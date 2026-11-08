# 04 — تدفق البيانات وخط أنابيب التعلم الآلي (ML Pipeline & Data Flow)

## دورة حياة النمذجة والاستدلال
```text
[Raw CSV Dataset (n=2,500, d=12)]
       │
       ▼
[Preprocessing & Feature Engineering Pipeline]
 ├── Missing Value Imputation (Median for numeric, Mode for categorical)
 ├── Encoding (One-Hot Encoding for nominal features)
 ├── Standardization (StandardScaler z-score for SVM, k-NN, Logistic Regression)
 └── Stratified Train/Test Split (80% Train n=2,000 / 20% Holdout Test n=500)
       │
       ▼
[5-Fold Stratified Cross-Validation & Multi-Model Training]
 ├── 1. Logistic Regression (L2 Regularized, C=1.0, class_weight='balanced')
 ├── 2. Random Forest Classifier (n_estimators=250, max_depth=8)
 ├── 3. Gradient Boosting Classifier (n_estimators=200, learning_rate=0.06, max_depth=4) ★ CHAMPION
 ├── 4. Support Vector Machine (RBF Kernel, C=1.5, probability=True)
 └── 5. K-Nearest Neighbors (n_neighbors=11, weights='distance')
       │
       ▼
[Evaluation, Calibration & Explainability Layer]
 ├── Metrics: Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC, Brier Score
 ├── Threshold Optimization (Cost-Sensitive τ* for Maximum Net Retention ROI)
 └── Feature Attribution (Permutation Importance & Local SHAP-Style Contributions)
       │
       ▼
[Executive Deliverables]
 ├── Stakeholder CDO Report PDF (Final_Report_Supervised_ML_Classification.pdf)
 └── Interactive 3D WebGL & Actuarial Decision Observatory (index.html)
```

