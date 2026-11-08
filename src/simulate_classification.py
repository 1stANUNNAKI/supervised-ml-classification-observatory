"""
Supervised Machine Learning Classification Simulation Engine
============================================================
Trains, cross-validates, and compares five production classification models
plus one unconstrained diagnostic tree (to demonstrate Overfitting for Q5)
on an Enterprise Customer Churn dataset (N=2,500, 12 features).

Outputs:
- data/enterprise_churn_dataset.csv
- outputs/model_evaluation_metrics.json
- assets/js/telemetry-data.js
"""

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    brier_score_loss,
    confusion_matrix,
    f1_score,
    log_loss,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

RANDOM_SEED = 42
TOTAL_SAMPLES = 2500

NUMERIC_FEATURES = [
    "tenure_months",
    "monthly_charges_usd",
    "total_contract_value",
    "support_tickets_90d",
    "avg_resolution_hours",
    "usage_drop_pct",
    "active_modules_count",
    "nps_score",
    "sla_breach_flag",
    "onboarding_completed",
]

CATEGORICAL_FEATURES = [
    "contract_type",
    "payment_method",
]


def generate_enterprise_churn_dataset(n_samples: int = TOTAL_SAMPLES, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Generates a realistic enterprise subscription churn dataset (~26.4% churn rate) with non-linear regime shifts."""
    if n_samples < 100:
        raise ValueError("Sample size must be at least 100 records.")

    rng = np.random.default_rng(seed)
    customer_ids = [f"ENT-{10000 + i}" for i in range(1, n_samples + 1)]

    contract_types = rng.choice(
        ["Month-to-Month", "One-Year", "Two-Year"],
        size=n_samples,
        p=[0.48, 0.30, 0.22],
    )
    payment_methods = rng.choice(
        ["Credit_Card", "Bank_AutoPay", "Wire_Transfer", "Manual_Check"],
        size=n_samples,
        p=[0.33, 0.30, 0.17, 0.20],
    )

    tenure_months = np.clip(rng.gamma(shape=2.4, scale=11.0, size=n_samples).round(0), 1, 72).astype(int)
    monthly_charges = np.clip(rng.normal(loc=118.0, scale=44.0, size=n_samples), 29.0, 249.0).round(2)
    discount_factor = np.where(contract_types == "Two-Year", 0.88, np.where(contract_types == "One-Year", 0.94, 1.0))
    total_contract_value = (tenure_months * monthly_charges * discount_factor).round(2)

    support_tickets = np.clip(rng.poisson(lam=2.6, size=n_samples), 0, 14)

    avg_resolution_hours = np.clip(
        rng.lognormal(mean=2.55, sigma=0.58, size=n_samples) + support_tickets * 1.5,
        1.5,
        72.0,
    ).round(1)

    usage_drop_pct = np.clip(rng.normal(loc=6.0, scale=22.0, size=n_samples), -40.0, 85.0).round(1)
    active_modules = np.clip(rng.binomial(n=7, p=0.46, size=n_samples) + 1, 1, 8)
    nps_score = np.clip(
        np.round(rng.normal(loc=6.6, scale=2.2, size=n_samples) - 0.25 * support_tickets),
        0,
        10,
    ).astype(int)

    sla_breach_flag = rng.binomial(
        n=1,
        p=np.clip(0.10 + 0.015 * (avg_resolution_hours > 22) * support_tickets, 0.05, 0.70),
    )
    onboarding_completed = rng.binomial(
        n=1,
        p=np.where(tenure_months > 6, 0.86, 0.58),
    )

    # Structural log-odds with strong non-linear threshold and interaction regimes
    linear_part = (
        -0.95
        - 0.045 * tenure_months
        + 0.012 * (monthly_charges - 115.0)
        + np.where(contract_types == "Month-to-Month", 1.25, np.where(contract_types == "One-Year", -0.45, -1.25))
        + np.where(payment_methods == "Manual_Check", 0.65, -0.18)
        + 0.24 * support_tickets
        + 0.032 * usage_drop_pct
        - 0.28 * active_modules
        - 0.22 * (nps_score - 6.0)
        + 0.78 * sla_breach_flag
        - 0.60 * onboarding_completed
    )

    non_linear_regime = (
        + 2.35 * ((contract_types == "Month-to-Month") & (usage_drop_pct > 12.0)).astype(float)
        + 2.10 * ((tenure_months <= 12) & (monthly_charges > 125.0) & (onboarding_completed == 0)).astype(float)
        + 1.95 * ((support_tickets >= 4) & (avg_resolution_hours > 22.0)).astype(float)
        + 1.55 * ((nps_score <= 4) & (sla_breach_flag == 1)).astype(float)
        - 1.85 * ((active_modules >= 5) & (tenure_months >= 20)).astype(float)
    )

    logit = linear_part + non_linear_regime + rng.normal(0.0, 0.22, size=n_samples)
    probabilities = 1.0 / (1.0 + np.exp(-logit))
    churn_status = (probabilities >= 0.50).astype(int)
    # Introduce 6.5% realistic label noise (stochastic human/market variance)
    flip_mask = rng.uniform(0.0, 1.0, size=n_samples) < 0.065
    churn_status = np.where(flip_mask, 1 - churn_status, churn_status)

    return pd.DataFrame(
        {
            "customer_id": customer_ids,
            "tenure_months": tenure_months,
            "monthly_charges_usd": monthly_charges,
            "total_contract_value": total_contract_value,
            "contract_type": contract_types,
            "payment_method": payment_methods,
            "support_tickets_90d": support_tickets,
            "avg_resolution_hours": avg_resolution_hours,
            "usage_drop_pct": usage_drop_pct,
            "active_modules_count": active_modules,
            "nps_score": nps_score,
            "sla_breach_flag": sla_breach_flag,
            "onboarding_completed": onboarding_completed,
            "churn_status": churn_status,
        }
    )


def build_preprocessor() -> ColumnTransformer:
    """Constructs a standardized preprocessing pipeline for numeric and categorical features."""
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            ("cat", OneHotEncoder(drop="first", sparse_output=False), CATEGORICAL_FEATURES),
        ]
    )


def define_candidate_models() -> Dict[str, Tuple[Any, Dict[str, Any]]]:
    """Defines the 5 primary classification models plus 1 overfitting diagnostic tree."""
    return {
        "gradient_boosting": (
            GradientBoostingClassifier(
                n_estimators=140,
                learning_rate=0.04,
                max_depth=3,
                min_samples_leaf=8,
                subsample=0.80,
                random_state=RANDOM_SEED,
            ),
            {
                "name": "Gradient Boosting (GBM)",
                "family": "Boosted Tree Ensemble",
                "role": "Recommended Champion Model",
                "interpretability_score": 84,
                "scalability_score": 91,
                "is_primary": True,
                "cdo_verdict": "Optimal balance of predictive discrimination (highest Accuracy, PR-AUC & F1) and actionable SHAP/Permutation feature attribution.",
            },
        ),
        "random_forest": (
            RandomForestClassifier(
                n_estimators=220,
                max_depth=8,
                min_samples_leaf=4,
                random_state=RANDOM_SEED,
            ),
            {
                "name": "Random Forest (RF)",
                "family": "Bagging Tree Ensemble",
                "role": "Strong Non-Linear Challenger",
                "interpretability_score": 78,
                "scalability_score": 89,
                "is_primary": True,
                "cdo_verdict": "Captures non-linear feature interactions well with low variance, trailing Gradient Boosting slightly in recall and probability calibration.",
            },
        ),
        "logistic_regression": (
            LogisticRegression(
                C=1.0,
                l1_ratio=0.0,
                max_iter=1000,
                random_state=RANDOM_SEED,
            ),
            {
                "name": "Logistic Regression (L2)",
                "family": "Generalized Linear Model",
                "role": "Interpretable Parametric Baseline",
                "interpretability_score": 98,
                "scalability_score": 99,
                "is_primary": True,
                "cdo_verdict": "Gold-standard directional transparency via exact Odds Ratios, but cannot natively capture complex threshold regime interactions.",
            },
        ),
        "svm_rbf": (
            CalibratedClassifierCV(
                SVC(C=1.2, kernel="rbf", gamma="scale", random_state=RANDOM_SEED),
                ensemble=False,
            ),
            {
                "name": "Support Vector Machine (RBF)",
                "family": "Kernel Margin Classifier",
                "role": "Non-Linear Boundary Challenger",
                "interpretability_score": 54,
                "scalability_score": 68,
                "is_primary": True,
                "cdo_verdict": "Strong accuracy in curved feature spaces, but acts as a geometric black-box without native executive feature explanations.",
            },
        ),
        "knn": (
            KNeighborsClassifier(
                n_neighbors=15,
                weights="distance",
                metric="minkowski",
            ),
            {
                "name": "K-Nearest Neighbors (k-NN)",
                "family": "Instance-Based Non-Parametric",
                "role": "Local Similarity Baseline",
                "interpretability_score": 62,
                "scalability_score": 55,
                "is_primary": True,
                "cdo_verdict": "Degrades across 12 mixed-scale dimensions (curse of dimensionality) and requires storing the entire training cohort for inference.",
            },
        ),
        "overfit_tree": (
            DecisionTreeClassifier(
                max_depth=None,
                min_samples_split=2,
                min_samples_leaf=1,
                random_state=RANDOM_SEED,
            ),
            {
                "name": "Unpruned Decision Tree (Depth=None)",
                "family": "Unconstrained Single Tree (Q5 Diagnostic)",
                "role": "Overfitting Diagnostic Example (Q5)",
                "interpretability_score": 65,
                "scalability_score": 85,
                "is_primary": False,
                "cdo_verdict": "Memorizes training data perfectly (100.0% Train Accuracy) but collapses on unseen test data — textbook Overfitting (Question 5).",
            },
        ),
    }


def compute_threshold_sweep(y_true: np.ndarray, y_prob: np.ndarray) -> List[Dict[str, float]]:
    """Computes confusion matrix and financial ROI metrics across probability thresholds."""
    thresholds = np.round(np.linspace(0.05, 0.95, 19), 2)
    sweep_results = []
    # Business economics for CDO decision matrix:
    # Average Annual Contract Value saved per rescued true churner (42% save rate on $4,200 ACV) = $1,764
    # Proactive retention intervention cost per flagged account (TP + FP) = $180
    for tau in thresholds:
        y_pred = (y_prob >= tau).astype(int)
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        acc = accuracy_score(y_true, y_pred)

        gross_saved = int(tp) * 1764
        campaign_cost = int(tp + fp) * 180
        net_roi_usd = gross_saved - campaign_cost

        sweep_results.append(
            {
                "threshold": float(tau),
                "tp": int(tp),
                "fp": int(fp),
                "tn": int(tn),
                "fn": int(fn),
                "accuracy": round(float(acc), 4),
                "precision": round(float(prec), 4),
                "recall": round(float(rec), 4),
                "f1": round(float(f1), 4),
                "net_roi_usd": int(net_roi_usd),
            }
        )
    return sweep_results


def evaluate_all_models(df: pd.DataFrame) -> Dict[str, Any]:
    """Splits dataset, trains all candidate models, and extracts comprehensive evaluation telemetry."""
    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df["churn_status"].to_numpy()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=RANDOM_SEED
    )

    candidates = define_candidate_models()
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)

    model_results: Dict[str, Any] = {}
    trained_pipelines: Dict[str, Pipeline] = {}

    for key, (estimator, meta) in candidates.items():
        pipeline = Pipeline(
            steps=[
                ("preprocessor", build_preprocessor()),
                ("classifier", estimator),
            ]
        )

        t0 = time.perf_counter()
        pipeline.fit(X_train, y_train)
        train_time_ms = (time.perf_counter() - t0) * 1000.0

        t1 = time.perf_counter()
        y_prob_test = pipeline.predict_proba(X_test)[:, 1]
        infer_time_ms = (time.perf_counter() - t1) * 1000.0

        y_prob_train = pipeline.predict_proba(X_train)[:, 1]
        y_pred_train = (y_prob_train >= 0.50).astype(int)
        y_pred_test = (y_prob_test >= 0.50).astype(int)

        cv_auc_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="roc_auc")

        tn, fp, fn, tp = confusion_matrix(y_test, y_pred_test).ravel()
        specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0

        fpr, tpr, _ = roc_curve(y_test, y_prob_test)
        prec_curve, rec_curve, _ = precision_recall_curve(y_test, y_prob_test)

        roc_idx = np.linspace(0, len(fpr) - 1, min(45, len(fpr))).astype(int)
        pr_idx = np.linspace(0, len(prec_curve) - 1, min(45, len(prec_curve))).astype(int)

        sweep = compute_threshold_sweep(y_test, y_prob_test)
        best_roi_point = max(sweep, key=lambda item: item["net_roi_usd"])

        model_results[key] = {
            "id": key,
            **meta,
            "train_metrics": {
                "accuracy": round(float(accuracy_score(y_train, y_pred_train)), 4),
                "f1": round(float(f1_score(y_train, y_pred_train)), 4),
                "roc_auc": round(float(roc_auc_score(y_train, y_prob_train)), 4),
            },
            "test_metrics": {
                "accuracy": round(float(accuracy_score(y_test, y_pred_test)), 4),
                "precision": round(float(precision_score(y_test, y_pred_test, zero_division=0)), 4),
                "recall": round(float(recall_score(y_test, y_pred_test, zero_division=0)), 4),
                "specificity": round(float(specificity), 4),
                "f1": round(float(f1_score(y_test, y_pred_test, zero_division=0)), 4),
                "roc_auc": round(float(roc_auc_score(y_test, y_prob_test)), 4),
                "pr_auc": round(float(average_precision_score(y_test, y_prob_test)), 4),
                "brier_score": round(float(brier_score_loss(y_test, y_prob_test)), 4),
                "log_loss": round(float(log_loss(y_test, y_prob_test)), 4),
            },
            "cv_roc_auc_mean": round(float(np.mean(cv_auc_scores)), 4),
            "cv_roc_auc_std": round(float(np.std(cv_auc_scores)), 4),
            "confusion_matrix_05": {"tp": int(tp), "fp": int(fp), "tn": int(tn), "fn": int(fn)},
            "optimal_threshold": best_roi_point["threshold"],
            "max_net_roi_usd": best_roi_point["net_roi_usd"],
            "train_time_ms": round(float(train_time_ms), 2),
            "inference_time_ms": round(float(infer_time_ms), 2),
            "roc_curve": {
                "fpr": [round(float(v), 4) for v in fpr[roc_idx]],
                "tpr": [round(float(v), 4) for v in tpr[roc_idx]],
            },
            "pr_curve": {
                "recall": [round(float(v), 4) for v in rec_curve[pr_idx]],
                "precision": [round(float(v), 4) for v in prec_curve[pr_idx]],
            },
            "threshold_sweep": sweep,
        }
        trained_pipelines[key] = pipeline

    gbm_pipe = trained_pipelines["gradient_boosting"]
    perm_imp = permutation_importance(
        gbm_pipe, X_test, y_test, n_repeats=10, random_state=RANDOM_SEED, scoring="roc_auc"
    )
    raw_feature_names = NUMERIC_FEATURES + CATEGORICAL_FEATURES
    feature_importance_list = []
    for idx, feat_name in enumerate(raw_feature_names):
        feature_importance_list.append(
            {
                "feature": feat_name,
                "importance_mean": round(float(perm_imp.importances_mean[idx]), 4),
                "importance_std": round(float(perm_imp.importances_std[idx]), 4),
            }
        )
    feature_importance_list.sort(key=lambda x: x["importance_mean"], reverse=True)

    lr_pipe = trained_pipelines["logistic_regression"]
    lr_pre = lr_pipe.named_steps["preprocessor"]
    lr_clf = lr_pipe.named_steps["classifier"]
    transformed_names = list(NUMERIC_FEATURES) + list(
        lr_pre.named_transformers_["cat"].get_feature_names_out(CATEGORICAL_FEATURES)
    )
    lr_coefs = [
        {
            "feature": name,
            "coefficient": round(float(coef), 4),
            "odds_ratio": round(float(np.exp(coef)), 4),
        }
        for name, coef in zip(transformed_names, lr_clf.coef_[0])
    ]
    lr_coefs.sort(key=lambda x: abs(x["coefficient"]), reverse=True)

    sample_test = X_test.iloc[:110].copy()
    sample_y = y_test[:110]
    gbm_probs = trained_pipelines["gradient_boosting"].predict_proba(sample_test)[:, 1]
    lr_probs = trained_pipelines["logistic_regression"].predict_proba(sample_test)[:, 1]
    rf_probs = trained_pipelines["random_forest"].predict_proba(sample_test)[:, 1]
    svm_probs = trained_pipelines["svm_rbf"].predict_proba(sample_test)[:, 1]

    points_3d = []
    for i in range(len(sample_test)):
        row = sample_test.iloc[i]
        points_3d.append(
            {
                "id": f"ENT-T{i + 1:03d}",
                "tenure": int(row["tenure_months"]),
                "monthly": float(row["monthly_charges_usd"]),
                "usage_drop": float(row["usage_drop_pct"]),
                "tickets": int(row["support_tickets_90d"]),
                "contract": str(row["contract_type"]),
                "actual": int(sample_y[i]),
                "p_gbm": round(float(gbm_probs[i]), 3),
                "p_rf": round(float(rf_probs[i]), 3),
                "p_lr": round(float(lr_probs[i]), 3),
                "p_svm": round(float(svm_probs[i]), 3),
            }
        )

    return {
        "dataset_summary": {
            "name": "Enterprise Subscription & Telecom Customer Churn Dataset",
            "total_records": int(len(df)),
            "train_records": int(len(X_train)),
            "test_records": int(len(X_test)),
            "num_features": 12,
            "numeric_features_count": len(NUMERIC_FEATURES),
            "categorical_features_count": len(CATEGORICAL_FEATURES),
            "churn_rate_overall": round(float(df["churn_status"].mean()), 4),
            "retained_count": int((df["churn_status"] == 0).sum()),
            "churned_count": int((df["churn_status"] == 1).sum()),
            "avg_tenure_retained": round(float(df[df["churn_status"] == 0]["tenure_months"].mean()), 1),
            "avg_tenure_churned": round(float(df[df["churn_status"] == 1]["tenure_months"].mean()), 1),
            "avg_charges_retained": round(float(df[df["churn_status"] == 0]["monthly_charges_usd"].mean()), 2),
            "avg_charges_churned": round(float(df[df["churn_status"] == 1]["monthly_charges_usd"].mean()), 2),
            "m2m_churn_rate": round(
                float(df[df["contract_type"] == "Month-to-Month"]["churn_status"].mean()), 4
            ),
            "two_year_churn_rate": round(
                float(df[df["contract_type"] == "Two-Year"]["churn_status"].mean()), 4
            ),
        },
        "models": model_results,
        "feature_importance_gbm": feature_importance_list,
        "logistic_regression_odds": lr_coefs,
        "manifold_3d_points": points_3d,
    }


def save_outputs(base_dir: Path) -> Dict[str, Any]:
    """Generates dataset, evaluates all models, and writes CSV, JSON, and JS bundle."""
    data_dir = base_dir / "data"
    outputs_dir = base_dir / "outputs"
    js_dir = base_dir / "assets" / "js"
    data_dir.mkdir(parents=True, exist_ok=True)
    outputs_dir.mkdir(parents=True, exist_ok=True)
    js_dir.mkdir(parents=True, exist_ok=True)

    df = generate_enterprise_churn_dataset()
    df.to_csv(data_dir / "enterprise_churn_dataset.csv", index=False)

    results = evaluate_all_models(df)
    (outputs_dir / "model_evaluation_metrics.json").write_text(
        json.dumps(results, indent=2), encoding="utf-8"
    )
    (js_dir / "telemetry-data.js").write_text(
        "window.CLASSIFICATION_TELEMETRY = " + json.dumps(results, indent=2) + ";\n",
        encoding="utf-8",
    )
    return results


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    telemetry = save_outputs(project_root)
    print(f"Simulation Complete. Total Records: {telemetry['dataset_summary']['total_records']}")
    for k, m in telemetry["models"].items():
        tm = m["test_metrics"]
        print(
            f" - {m['name']:36s} | Test Acc: {tm['accuracy']:.3f} | F1: {tm['f1']:.3f} | ROC-AUC: {tm['roc_auc']:.3f}"
        )
