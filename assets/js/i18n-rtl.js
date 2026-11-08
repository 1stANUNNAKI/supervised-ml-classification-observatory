/**
 * Single-Emoji Bilingual (English ↔ Arabic) & Full RTL/LTR Direction Switcher
 * ===========================================================================
 * Toggles page language, layout direction (dir="rtl" / dir="ltr"),
 * static DOM nodes via [data-i18n], 3D Manifold HUD/Inspector/Axes,
 * SVG Diagnostic Curves, Confusion Matrix, What-If Simulator,
 * Executive CDO Report Dossier (1.1-1.6), and Mark Exam Companion (Q2-Q5).
 */

(function () {
  'use strict';

  window.OBSERVATORY_LANG = 'en';

  const I18N_DICTIONARY = {
    top_engine: {
      en: '<span class="status-dot"></span><strong>LIVE EMPIRICAL ENGINE:</strong> SCIKIT-LEARN v1.9 VERIFIED',
      ar: '<span class="status-dot"></span><strong>المحرك الإحصائي الحي:</strong> SCIKIT-LEARN v1.9 موثق'
    },
    top_cohort: {
      en: '<strong>COHORT:</strong> N = 2,500 (TRAIN: 2,000 · TEST: 500)',
      ar: '<strong>العينة:</strong> N = 2,500 حساب (تدريب: 2,000 · اختبار: 500)'
    },
    top_champion: {
      en: '<strong>CHAMPION:</strong> GRADIENT BOOSTING (ACC 88.8% · F1 0.754 · ROC-AUC 0.888)',
      ar: '<strong>النموذج البطل:</strong> تعزيز التدرج GBM (الدقة 88.8% · F1 0.754 · ROC-AUC 0.888)'
    },
    btn_printable: {
      en: '🖨️ PRINTABLE CDO REPORT',
      ar: '🖨️ نسخة التقرير للطباعة'
    },
    btn_download_top: {
      en: '⬇ DOWNLOAD CDO PDF (3 PAGES)',
      ar: '⬇ تحميل تقرير PDF (3 صفحات)'
    },
    rail_title: {
      en: 'Quantitative Classification Observatory',
      ar: 'مرصد التصنيف الإحصائي الكمي'
    },
    rail_sub: {
      en: 'Chief Data Officer (CDO) Decision & Exam Workbench',
      ar: 'منصة قرارات رئيس البيانات (CDO) وحلول الاختبار'
    },
    nav_01: {
      en: 'Executive Overview & 3D Manifold',
      ar: 'الملخص التنفيذي والمجسم 3D'
    },
    nav_02: {
      en: '6-Model Benchmark & Overfitting',
      ar: 'مقارنة النماذج الـ6 وفرط التخصيص'
    },
    nav_03: {
      en: 'Threshold (τ) & ROI Simulator',
      ar: 'محاكي العتبة (τ) والعائد المالي'
    },
    nav_04: {
      en: 'What-If Predictor & SHAP',
      ar: 'محاكي التنبؤ الحي وتفسير SHAP'
    },
    nav_05: {
      en: 'CDO PDF Report (Rubric 1.1–1.6)',
      ar: 'تقرير الـ PDF التنفيذي (1.1–1.6)'
    },
    nav_06: {
      en: 'Mark Exam Q2–Q5 & Teleprompter',
      ar: 'إجابات الأسئلة Q2–Q5 ومدرب الكتابة'
    },
    rail_rubric_hdr: {
      en: 'MARK RUBRIC READINESS',
      ar: 'جاهزية معايير التقييم'
    },
    hero_h1: {
      en: 'Supervised Machine Learning <span class="cobalt-underline">Classification</span>: Enterprise Churn Decision Observatory',
      ar: 'التصنيف بالتعلم الآلي <span class="cobalt-underline">الخاضع للإشراف</span>: مرصد قرارات استبقاء العملاء المؤسسيين'
    },
    hero_lead: {
      en: 'An end-to-end empirical classification study prepared for the <strong>Chief Data Officer (CDO)</strong> and <strong>Head of Analytics</strong>. We benchmark five supervised learning families—<strong>Gradient Boosting</strong>, <strong>Random Forest</strong>, <strong>RBF-SVM</strong>, <strong>L2 Logistic Regression</strong>, and <strong>k-NN</strong>—plus an unconstrained <strong>Overfitted Decision Tree</strong> across <code>N = 2,500</code> enterprise accounts to balance predictive discrimination with executive interpretability.',
      ar: 'دراسة تطبيقية متكاملة للتصنيف الآلي الخاضع للإشراف مُعدّة لـ <strong>رئيس البيانات التنفيذي (CDO)</strong> و<strong>رئيس قسم التحليلات</strong>. نقارن 5 عائلات خوارزمية إشرافية — <strong>تعزيز التدرج (GBM)</strong>، <strong>الغابات العشوائية</strong>، <strong>آلة المتجهات (RBF-SVM)</strong>، <strong>الانحدار اللوجستي المنظم (L2)</strong>، و<strong>أقرب الجيران (k-NN)</strong> — بالإضافة إلى <strong>شجرة قرار غير مقلمة لتشخيص فرط التخصيص (Q5)</strong> عبر <code>2,500</code> حساب مؤسسي للموازنة بين الدقة التنبؤية وقابلية التفسير.'
    },
    btn_hero_pdf: {
      en: '⬇ DOWNLOAD FINAL CDO PDF REPORT (Q1 · 8 PTS)',
      ar: '⬇ تحميل التقرير النهائي PDF للسؤال الأول (8 درجات)'
    },
    btn_hero_exam: {
      en: '⌨ OPEN MARK Q2–Q5 EXAM ANSWERS (7 PTS)',
      ar: '⌨ استعراض إجابات الأسئلة Q2–Q5 (7 درجات)'
    },
    btn_hero_sim: {
      en: '⚙ LAUNCH THRESHOLD & ROI SIMULATOR',
      ar: '⚙ تشغيل محاكي العتبات والعائد المالي'
    },
    kpi1_label: { en: 'CHAMPION MODEL (GBM)', ar: 'النموذج البطل (GBM)' },
    kpi1_sub: { en: 'Test Accuracy · F1: 0.754', ar: 'دقة الاختبار · F1: 0.754' },
    kpi2_label: { en: 'RANKING DISCRIMINATION', ar: 'القدرة التمييزية للترتيب' },
    kpi2_sub: { en: 'ROC-AUC · PR-AUC: 0.841', ar: 'مساحة ROC-AUC · PR-AUC: 0.841' },
    kpi3_label: { en: 'MAX NET RETENTION ROI', ar: 'أعلى صافي عائد استبقاء' },
    kpi3_sub: { en: 'At Optimal Threshold τ = 0.15', ar: 'عند العتبة المثلى τ = 0.15' },
    kpi4_label: { en: 'Q5 OVERFIT DIAGNOSTIC', ar: 'تشخيص فرط التخصيص (Q5)' },
    kpi4_sub: { en: 'Unpruned Tree (100% → 81.2%)', ar: 'شجرة غير مقلمة (100% ← 81.2%)' },

    manifold_hdr_title: {
      en: 'DECISION SURFACE & HOLDOUT COHORT (n=110 SAMPLED)',
      ar: 'سطح الحدود القرارية وعينة الاختبار (110 حسابات)'
    },
    hud_surface_lbl: { en: 'SURFACE:', ar: 'السطح النشط:' },
    hud_tau_lbl: { en: 'THRESHOLD PLANE:', ar: 'مستوى العتبة الفاصلة:' },
    hud_hint: {
      en: 'Drag to Orbit · Scroll to Zoom · Click ANY Node, Surface Cell, or Plane to Inspect',
      ar: 'اسحب للتدوير · عجلة الماوس للتكبير · انقر على أي نقطة أو خلية بالسطح لعرض تفاصيلها'
    },
    chip_node_high: { en: '🎯 High-Risk Node', ar: '🎯 عميل عالي الخطر' },
    chip_surface_peak: { en: '📐 Surface Peak', ar: '📐 قمة السطح القراري' },
    chip_tau_plane: { en: '⚖ Threshold Plane τ', ar: '⚖ مستوى العتبة τ' },
    chip_axes_info: { en: '📊 3D Axes Info', ar: '📊 تفاصيل المحاور' },
    leg_tp: { en: 'TP (Rescued Churn)', ar: 'TP (متسرب تم إنقاذه)' },
    leg_tn: { en: 'TN (Retained Safe)', ar: 'TN (عميل مستقر)' },
    leg_fp: { en: 'FP (False Alarm)', ar: 'FP (إنذار كاذب)' },
    leg_fn: { en: 'FN (Missed Churn)', ar: 'FN (تسرب فائت)' },
    manifold_axes_footer: {
      en: 'AXES: TENURE (X) × P(CHURN) (Y) × USAGE DROP (Z)',
      ar: 'المحاور: مدة الاشتراك (X) × احتمالية التسرب (Y) × انخفاض الاستخدام (Z)'
    },

    sec02_coord: {
      en: 'SEC-02 // RUBRIC CRITERION 1.4 (2 PTS) & QUESTION 5 (1 PT)',
      ar: 'القسم 02 // معيار التقييم 1.4 (نقطتان) والسؤال الخامس Q5 (نقطة واحدة)'
    },
    sec02_title: {
      en: 'Comparative Classification Model Benchmark & Overfitting Diagnostics',
      ar: 'المقارنة المعيارية لنماذج التصنيف وتشخيص فرط التخصيص (Overfitting)'
    },
    sec02_sub: {
      en: 'Click any model card or table row below to inspect its confusion matrix, threshold sensitivity, and 3D decision manifold. Notice how the <strong>Unpruned Decision Tree (Depth=None)</strong> achieves <code>100.0%</code> Training Accuracy but collapses to <code>81.2%</code> Test Accuracy (<code>ROC-AUC = 0.753</code>)—empirically proving <strong>Overfitting (High Variance)</strong> for Question 5.',
      ar: 'انقر على أي بطاقة نموذج أو صف في الجدول أدناه لفحص مصفوفة الارتباك الخاصة به والمجسم ثلاثي الأبعاد. لاحظ كيف تحقق <strong>شجرة القرار غير المقلمة</strong> دقة تدريب <code>100.0%</code> لكنها تهبط في الاختبار إلى <code>81.2%</code> — مما يثبت عملياً <strong>فرط التخصيص (Overfitting)</strong> لإجابة السؤال الخامس.'
    },
    th_model: { en: 'Model Architecture & Role', ar: 'معمارية النموذج ودوره التحليلي' },
    th_train: { en: 'Train Acc', ar: 'دقة التدريب' },
    th_test: { en: 'Test Acc', ar: 'دقة الاختبار' },
    th_gap: { en: 'Gen. Gap (Train−Test)', ar: 'فجوة التعميم' },
    th_prec: { en: 'Precision (τ=0.5)', ar: 'الدقة التنبؤية' },
    th_rec: { en: 'Recall (τ=0.5)', ar: 'الاستدعاء Recall' },
    th_f1: { en: 'F1-Score', ar: 'مقياس F1' },
    th_roc: { en: 'ROC-AUC (5-Fold CV)', ar: 'مساحة ROC-AUC' },
    th_pr: { en: 'PR-AUC', ar: 'مساحة PR-AUC' },
    th_brier: { en: 'Brier Calib.', ar: 'معايرة Brier' },
    th_roi: { en: 'Max Net ROI ($)', ar: 'أعلى عائد صافي ($)' },

    sec03_coord: {
      en: 'SEC-03 // QUESTION 3 (2 PTS) · PRECISION, RECALL & COST-SENSITIVE THRESHOLDING',
      ar: 'القسم 03 // السؤال الثالث Q3 · موازنة الدقة والاستدعاء ومحاكاة العتبات المالية'
    },
    sec03_title: {
      en: 'Probability Threshold (τ) Scrubber, Confusion Matrix & Financial ROI Simulator',
      ar: 'محاكي العتبة الاحتمالية (τ) ومصفوفة الارتباك 2×2 والعائد المالي (ROI)'
    },
    sec03_sub: {
      en: 'In enterprise churn prediction (26.4% base rate), a False Negative (missed churner: <strong>-$1,764</strong> lost recoverable ACV) is nearly 10× costlier than a False Positive (unnecessary retention incentive: <strong>-$180</strong>). Scrub the probability threshold <strong>τ</strong> below to observe the live trade-off between <strong>Precision</strong>, <strong>Recall</strong>, and <strong>Net Retained Revenue</strong>.',
      ar: 'في التنبؤ بتسرب الشركات (نسبة التسرب الأساسية 26.4%)، تكلفة السلبي الكاذب FN (خسارة عميل متسرب: <strong>-$1,764</strong>) تعادل 10 أضعاف تكلفة الإيجابي الكاذب FP (حافز غير ضروري: <strong>-$180</strong>). حرّك شريط العتبة الاحتمالية <strong>τ</strong> أدناه لمراقبة المفاضلة الحية بين <strong>الدقة (Precision)</strong> و<strong>الاستدعاء (Recall)</strong> و<strong>صافي العائد المالي</strong>.'
    },
    wb_panel1_title: {
      en: '2×2 Confusion Matrix & Retention Economics',
      ar: 'مصفوفة الارتباك 2×2 واقتصاديات استبقاء العقود'
    },
    wb_slider_lbl: {
      en: '<strong>DECISION PROBABILITY THRESHOLD (τ):</strong> Classify Churn if P(y=1|x) ≥ τ',
      ar: '<strong>عتبة القرار الاحتمالية (τ):</strong> تصنيف العميل كمتسرب إذا كان P(y=1|x) ≥ τ'
    },
    cm_tp_desc: {
      en: 'True churners accurately flagged & targeted (+$1,764 saved ACV each)',
      ar: 'متسربون فعليون تم اكتشافهم واستهدافهم بنجاح (+$1,764 لكل عقد)'
    },
    cm_fp_desc: {
      en: 'Retained clients unnecessarily offered incentive (-$180 campaign cost)',
      ar: 'عملاء مستقرون قُدمت لهم حوافز غير ضرورية (-$180 تكلفة الحملة)'
    },
    cm_fn_desc: {
      en: 'True churners missed by classifier (unrecovered contract loss)',
      ar: 'متسربون فعليون فاتوا على المصنف (خسارة عقد غير مستردة)'
    },
    cm_tn_desc: {
      en: 'Healthy accounts correctly left undisturbed ($0 intervention cost)',
      ar: 'حسابات سليمة تُركت دون إزعاج ($0 تكلفة تدخل)'
    },
    wb_panel2_title: {
      en: 'Discrimination Curves & Feature Attribution',
      ar: 'منحنيات التمييز (ROC / PR) وأهمية المتغيرات'
    },
    tab_roc: { en: 'ROC CURVE', ar: 'منحنى ROC' },
    tab_pr: { en: 'PR CURVE', ar: 'منحنى PR' },
    tab_feat: { en: 'GBM IMPORTANCE', ar: 'أهمية المتغيرات' },

    sec04_coord: {
      en: 'SEC-04 // RUBRIC CRITERION 1.2 & QUESTION 4 (INTERPRETABILITY IN ACTION)',
      ar: 'القسم 04 // المعيار 1.2 والسؤال الرابع Q4 (محاكاة التنبؤ الحي وتفسير SHAP)'
    },
    sec04_title: {
      en: 'What-If Live Enterprise Account Inference & Local SHAP Attribution',
      ar: 'محاكي التنبؤ الحي بالحسابات المؤسسية (What-If) وتفسير SHAP المحلي'
    },
    sec04_sub: {
      en: 'Configure an individual enterprise customer profile below (or load an executive preset) to compare real-time churn probability predictions across all five models and inspect how each feature pushes the account toward <strong>Churn Risk (+)</strong> or <strong>Retention Safety (−)</strong>.',
      ar: 'اضبط خصائص أي حساب مؤسسي أدناه (أو اختر أحد القوالب الجاهزة) لمقارنة احتمالية التسرب الفورية عبر النماذج الخمسة، ومعرفة كيف يدفع كل متغير الحساب نحو <strong>خطر التسرب (+)</strong> أو <strong>الاستقرار والبقاء (−)</strong>.'
    },
    preset_high: { en: '⚡ HIGH-RISK CHURNER', ar: '⚡ عميل متسرب عالي الخطر' },
    preset_border: { en: '⚖ BORDERLINE ACCOUNT', ar: '⚖ حساب على الحافة' },
    preset_loyal: { en: '🛡 LOYAL ENTERPRISE', ar: '🛡 عميل مؤسسي مستقر' },
    wi_inputs_title: {
      en: 'Enterprise Customer Telemetry Inputs (10 Key Drivers)',
      ar: 'مدخلات بيانات الحساب المؤسسي (10 متغيرات رئيسية)'
    },
    wi_scoring_title: {
      en: 'Live Multi-Model Scoring & Local Feature Attribution',
      ar: 'التقييم المتعدد النماذج وشلال مساهمة المتغيرات (SHAP)'
    },
    wi_lbl_1: { en: '1. CONTRACT TIER', ar: '1. نوع العقد (Contract Tier)' },
    wi_lbl_2: { en: '2. 30D USAGE DROP %', ar: '2. نسبة انخفاض الاستخدام (30 يوماً)' },
    wi_lbl_3: { en: '3. TENURE (MONTHS)', ar: '3. مدة الاشتراك (بالأشهر)' },
    wi_lbl_4: { en: '4. MONTHLY CHARGES ($)', ar: '4. الرسوم الشهرية ($)' },
    wi_lbl_5: { en: '5. SUPPORT TICKETS (90D)', ar: '5. تذاكر الدعم الفني (90 يوماً)' },
    wi_lbl_6: { en: '6. AVG RESOLUTION TIME', ar: '6. متوسط زمن حل التذاكر (ساعة)' },
    wi_lbl_7: { en: '7. ACTIVE SAAS MODULES', ar: '7. الوحدات البرمجية النشطة' },
    wi_lbl_8: { en: '8. EXECUTIVE NPS SCORE', ar: '8. مؤشر رضا العميل (NPS)' },
    wi_lbl_9: { en: '9. PAYMENT METHOD', ar: '9. طريقة السداد والفوترة' },
    wi_lbl_10: { en: '10. SLA BREACH INCIDENT', ar: '10. خرق اتفاقية مستوى الخدمة (SLA)' },
    wi_banner_lbl: {
      en: 'CHAMPION GBM CHURN PROBABILITY',
      ar: 'احتمالية التسرب وفق النموذج البطل (GBM)'
    },
    wi_consensus_lbl: {
      en: 'CROSS-MODEL PROBABILITY CONSENSUS P(y = 1 | x):',
      ar: 'إجماع النماذج الخمسة لاحتمالية التسرب P(y = 1 | x):'
    },
    wi_shap_lbl: {
      en: 'LOCAL SHAP LOG-ODDS FEATURE CONTRIBUTION WATERFALL (RED = CHURN RISK · GREEN = RETENTION):',
      ar: 'شلال مساهمة المتغيرات المحلي (SHAP Log-Odds) — (الأحمر = يدفع للتسرب · الأخضر = يدعم البقاء):'
    },

    sec05_coord: {
      en: 'SEC-05 // QUESTION 1 DELIVERABLE (8 POINTS TOTAL · CRITERIA 1.1 TO 1.6)',
      ar: 'القسم 05 // التقرير النهائي للسؤال الأول Q1 (8 درجات كاملة · المعايير 1.1 إلى 1.6)'
    },
    sec05_title: {
      en: 'Executive CDO Report Dossier & Interactive Rubric Verification',
      ar: 'تقرير رئيس البيانات التنفيذي (CDO PDF Report) والتحقق من بنود التقييم'
    },
    sec05_sub: {
      en: 'Question 1 requires uploading a stakeholder-ready <strong>PDF Report</strong> tailored to the Chief Data Officer (CDO). Click any rubric criterion button below (<code>1.1</code> through <code>1.6</code>) to spotlight the exact section that satisfies Mark\'s grading rubric, or click <strong>Download CDO PDF Report</strong> to get the ready-to-submit 3-page vector PDF file.',
      ar: 'يتطلب السؤال الأول رفع <strong>تقرير PDF تنفيذي</strong> موجه لرئيس البيانات (CDO). انقر على أي معيار تقييم أدناه (<code>1.1</code> إلى <code>1.6</code>) لتسليط الضوء على القسم المطابق له، أو اضغط على زر <strong>تحميل ملف PDF</strong> للحصول على التقرير الجاهز للرفع في المنصة.'
    },
    btn_dl_dossier: {
      en: '⬇ DOWNLOAD FINAL_REPORT_SUPERVISED_ML_CLASSIFICATION.PDF',
      ar: '⬇ تحميل ملف التقرير FINAL_REPORT_SUPERVISED_ML_CLASSIFICATION.PDF'
    },
    btn_open_print: {
      en: '↗ OPEN FULL-PAGE PRINTABLE VIEW',
      ar: '↗ فتح نسخة الطباعة الكاملة'
    },
    rub_all: { en: 'ALL SECTIONS (8 / 8 PTS)', ar: 'جميع الأقسام (8 / 8 درجات)' },
    rub_11: { en: '1.1 PDF Key Insights (1 Pt)', ar: '1.1 الرؤى التنفيذية (1 درجة)' },
    rub_12: { en: '1.2 Data Description (1 Pt)', ar: '1.2 وصف البيانات والمتغيرات (1 درجة)' },
    rub_13: { en: '1.3 Main Objective (1 Pt)', ar: '1.3 الهدف الرئيسي للتحليل (1 درجة)' },
    rub_14: { en: '1.4 Model Comparison (2 Pts)', ar: '1.4 مقارنة النماذج والبطل (درجتان)' },
    rub_15: { en: '1.5 Flaws & Revision Plan (1 Pt)', ar: '1.5 العيوب وخطة التحسين (1 درجة)' },
    rub_16: { en: '1.6 Limitations & Next Steps (2 Pts)', ar: '1.6 القيود والخطوات القادمة (درجتان)' },
    dos_file_tag: {
      en: 'FILE: Final_Report_Supervised_ML_Classification.pdf (3 Pages · Vector Charts Included)',
      ar: 'الملف: Final_Report_Supervised_ML_Classification.pdf (3 صفحات · رسوم متجهة مضمنة)'
    },
    dos_main_h3: {
      en: 'Supervised Machine Learning Classification: Enterprise Customer Churn Prediction & Decision Analysis',
      ar: 'التصنيف بالتعلم الآلي الخاضع للإشراف: التنبؤ بتسرب العملاء المؤسسيين وتحليل القرارات'
    },
    dos_prep_tag: {
      en: 'Prepared for: Chief Data Officer (CDO) & Head of Analytics · Cohort: N = 2,500 Enterprise Accounts',
      ar: 'مُعدّ إلى: رئيس البيانات التنفيذي (CDO) ورئيس التحليلات · العينة: N = 2,500 حساب مؤسسي'
    },
    btn_save_pdf: {
      en: '⬇ SAVE PDF TO COMPUTER',
      ar: '⬇ حفظ ملف الـ PDF على جهازك'
    },
    dos_13_stamp: {
      en: 'RUBRIC 1.3 · 1 POINT · MAIN OBJECTIVE PARAGRAPH',
      ar: 'المعيار 1.3 · درجة واحدة · فقرة الهدف الرئيسي للتحليل'
    },
    dos_13_h3: {
      en: 'Section 1A — Main Analytical Objective',
      ar: 'القسم 1أ — الهدف التحليلي الرئيسي للتقرير'
    },
    dos_13_p: {
      en: 'The primary objective of this analysis is to construct, validate, and benchmark a rigorous supervised machine learning classification framework capable of predicting binary enterprise customer churn (<code>churn_status = 1</code> vs. <code>0</code>) prior to contract renewal, while balancing predictive discrimination (Recall, Precision, F1-Score, ROC-AUC, and PR-AUC) against executive interpretability (Odds Ratios and Permutation Feature Attribution). Rather than relying on a single classifier, we evaluate five distinct algorithm families—<strong>Gradient Boosting (GBM)</strong>, <strong>Random Forest</strong>, <strong>Support Vector Machine (RBF-SVM)</strong>, <strong>L2-Regularized Logistic Regression</strong>, and <strong>K-Nearest Neighbors (k-NN)</strong>—alongside an unconstrained <strong>Decision Tree</strong> diagnostic to select the optimal production architecture for proactive retention targeting.',
      ar: 'الهدف الأساسي من هذا التحليل هو بناء والتحقق من ومقارنة إطار عمل صارم للتصنيف بالتعلم الآلي الخاضع للإشراف قادر على التنبؤ الثنائي بتسرب العملاء المؤسسيين (<code>churn_status = 1</code> مقابل <code>0</code>) قبل موعد تجديد العقود، مع الموازنة بين القدرة التمييزية التنبؤية (Recall, Precision, F1-Score, ROC-AUC, PR-AUC) وقابلية التفسير التنفيذية (نسب الأرجحية Odds Ratios والأهمية التبادلية للمتغيرات). وبدلاً من الاعتماد على مصنف واحد، نقوم بتقييم 5 عائلات خوارزمية متباينة — <strong>تعزيز التدرج (GBM)</strong>، <strong>الغابات العشوائية (Random Forest)</strong>، <strong>آلة المتجهات الداعمة (RBF-SVM)</strong>، <strong>الانحدار اللوجستي المنظم (L2)</strong>، و<strong>أقرب الجيران (k-NN)</strong> — إلى جانب <strong>شجرة قرار غير مقلمة</strong> لتشخيص فرط التخصيص واختيار المعمارية الأمثل للإنتاج.'
    },
    dos_11_stamp: {
      en: 'RUBRIC 1.1 · 1 POINT · EXECUTIVE KEY INSIGHTS & FINDINGS',
      ar: 'المعيار 1.1 · درجة واحدة · الرؤى التنفيذية الرئيسية والنتائج'
    },
    dos_11_h3: {
      en: 'Section 1B — Executive Key Insights & Strategic Recommendation',
      ar: 'القسم 1ب — الرؤى التنفيذية الرئيسية والتوصية الاستراتيجية'
    },
    dos_11_p: {
      en: 'Across the unseen holdout test cohort (<code>n = 500</code>), <strong>Gradient Boosting (GBM)</strong> emerges as the top-performing production model, achieving the highest overall <strong>Test Accuracy (88.8%)</strong>, <strong>F1-Score (0.754)</strong>, <strong>PR-AUC (0.841)</strong>, and <strong>ROC-AUC (0.888)</strong>, with the lowest probability calibration error (<strong>Brier Score = 0.0989</strong>). Operating GBM at a cost-optimized probability threshold of <strong>τ = 0.20</strong> (or <strong>τ = 0.15</strong>) captures <strong>82.6% to 86.4%</strong> of all true churning accounts and generates an estimated <strong>$157,896 in net retained contract value</strong> per 500 accounts. We recommend deploying <strong>Gradient Boosting</strong> as the primary scoring engine, paired with <strong>Logistic Regression Odds Ratios</strong> and <strong>Permutation Importance</strong> as a transparent governance layer.',
      ar: 'عبر عينة الاختبار غير المرئية (<code>n = 500</code>)، يبرز نموذج <strong>تعزيز التدرج (GBM)</strong> كأفضل نموذج إنتاجي، محققاً أعلى <strong>دقة اختبار (88.8%)</strong>، وأعلى <strong>مقياس F1 (0.754)</strong>، و<strong>PR-AUC (0.841)</strong>، و<strong>ROC-AUC (0.888)</strong>، مع أقل خطأ معايرة احتمالية (<strong>Brier Score = 0.0989</strong>). إن تشغيل نموذج GBM عند عتبة احتمالية محسّنة للتكلفة <strong>τ = 0.20</strong> (أو <strong>τ = 0.15</strong>) يلتقط <strong>82.6% إلى 86.4%</strong> من جميع الحسابات المتسربة فعلياً ويحقق صافي عائد استبقاء قدره <strong>$157,896</strong> لكل 500 حساب. نوصي باعتماد <strong>GBM</strong> كمحرك تقييم رئيسي مقترناً بنسب الأرجحية للانحدار اللوجستي كطبقة شفافية وحوكمة.'
    },
    dos_12_stamp: {
      en: 'RUBRIC 1.2 · 1 POINT · DATA DESCRIPTION & FEATURE PIPELINE',
      ar: 'المعيار 1.2 · درجة واحدة · وصف البيانات وهندسة المتغيرات'
    },
    dos_12_h3: {
      en: 'Section 2 — Data Description, Feature Engineering & Pipeline Usage',
      ar: 'القسم 2 — وصف مجموعة البيانات وهندسة المتغيرات وكيفية استخدامها في النماذج'
    },
    dos_12_p1: {
      en: 'The analysis evaluates a structured enterprise subscription cohort of <strong>N = 2,500 customer accounts</strong> characterized by <strong>12 domain-specific predictor variables</strong> (10 continuous/discrete numerical attributes and 2 categorical attributes) and a binary target outcome (<code>churn_status</code>: <strong>660 Churned [26.4%]</strong> vs. <strong>1,840 Retained [73.6%]</strong>). Accounts on <em>Month-to-Month</em> contracts exhibit a <strong>41.6% churn rate</strong> compared to <strong>10.2%</strong> on <em>Two-Year</em> contracts.',
      ar: 'يقيم هذا التحليل عينة اشتراكات مؤسسية مهيكلة تضم <strong>N = 2,500 حساب عميل</strong> موصوفة بـ <strong>12 متغيراً تنبؤياً</strong> (10 متغيرات رقمية مستمرة/متقطعة ومتغيرين فئويين) ومتغير هدف ثنائي (<code>churn_status</code>: <strong>660 متسرباً [26.4%]</strong> مقابل <strong>1,840 مستقراً [73.6%]</strong>). تُظهر الحسابات ذات العقود الشهرية معدل تسرب يبلغ <strong>41.6%</strong> مقارنة بـ <strong>10.2%</strong> فقط في عقود السنتين.'
    },
    dos_12_p2: {
      en: '<strong>How Features Are Used in Building, Training, and Interpreting Models:</strong> All preprocessing is encapsulated inside a leak-free Scikit-Learn <code>ColumnTransformer</code> pipeline fit strictly on the 80% stratified training partition (<code>n = 2,000</code>) and evaluated on the 20% unseen holdout test partition (<code>n = 500</code>). Continuous variables (<code>tenure_months</code>, <code>monthly_charges_usd</code>, <code>usage_drop_pct</code>, <code>support_tickets_90d</code>, <code>avg_resolution_hours</code>) are standardized via <code>StandardScaler</code> ($\mu=0, \sigma=1$) to stabilize L2 regularization, RBF kernel distances, and k-NN metrics, while categorical variables (<code>contract_type</code>, <code>payment_method</code>) are converted via <code>OneHotEncoder(drop=\'first\')</code>. In interpretation, <code>usage_drop_pct</code> ranks #1 in GBM Permutation Importance ($\Delta\text{ROC-AUC} = +0.159$), while Logistic Regression reveals that a Two-Year contract reduces churn odds by <strong>89.3%</strong> ($\text{OR} = 0.107$).',
      ar: '<strong>كيف تُستخدم المتغيرات في بناء وتدريب وتفسير النماذج:</strong> تم تغليف كافة عمليات المعالجة المسبقة داخل أنبوب <code>ColumnTransformer</code> مانع لتسرب البيانات يتم تدريبه حصرياً على قسم التدريب الطبقي 80% (<code>n = 2,000</code>) وتقييمه على قسم الاختبار 20% (<code>n = 500</code>). يتم توحيد المتغيرات الرقمية عبر <code>StandardScaler</code> ($\mu=0, \sigma=1$) لضمان استقرار عقوبة L2 ومسافات RBF-SVM و k-NN، بينما تُحوّل المتغيرات الفئوية عبر <code>OneHotEncoder</code>. وفي التفسير، يتصدر متغير انخفاض الاستخدام <code>usage_drop_pct</code> المرتبة الأولى في الأهمية التبادلية ($\Delta\text{ROC-AUC} = +0.159$)، بينما يثبت الانحدار اللوجستي أن عقد السنتين يخفض أرجحية التسرب بنسبة <strong>89.3%</strong> ($\text{OR} = 0.107$).'
    },
    dos_14_stamp: {
      en: 'RUBRIC 1.4 · 2 POINTS · MODEL VARIATIONS COMPARISON & BEST MODEL',
      ar: 'المعيار 1.4 · درجتان · مقارنة تنويعات النماذج وتحديد النموذج الأفضل'
    },
    dos_14_h3: {
      en: 'Section 3 — Comparing Classification Model Variations & Identifying the Champion',
      ar: 'القسم 3 — مقارنة تنويعات نماذج التصنيف الخمسة وتحديد النموذج البطل'
    },
    dos_14_p: {
      en: 'We compared five distinct supervised classification families plus an unconstrained tree baseline on the holdout test set: <strong>(1) Gradient Boosting (Champion):</strong> 88.8% Test Acc, 89.6% Precision, 65.2% Recall, <strong>0.754 F1-Score</strong>, 0.888 ROC-AUC, <strong>0.841 PR-AUC</strong>; <strong>(2) Random Forest (Bagging Challenger):</strong> 87.8% Test Acc, 93.8% Precision, 57.6% Recall, 0.714 F1-Score, 0.893 ROC-AUC; <strong>(3) RBF Support Vector Machine:</strong> 86.8% Test Acc, 85.9% Precision, 59.9% Recall, 0.705 F1-Score, 0.871 ROC-AUC; <strong>(4) L2 Logistic Regression (Interpretable Baseline):</strong> 83.8% Test Acc, 80.7% Precision, 50.8% Recall, 0.623 F1-Score, 0.866 ROC-AUC; <strong>(5) K-Nearest Neighbors (k=15):</strong> 80.4% Test Acc, 37.1% Recall, 0.500 F1-Score; and <strong>(6) Unpruned Decision Tree (Depth=None):</strong> 100.0% Train Acc vs. 81.2% Test Acc (0.753 ROC-AUC), illustrating severe overfitting. <strong>Gradient Boosting</strong> is identified as the best model because its sequential shallow trees (<code>max_depth=3</code>) capture non-linear interaction thresholds (+13.1 F1 percentage points over Logistic Regression) while maintaining superior recall (+7.6% over Random Forest) and the best probability calibration (Brier = 0.0989).',
      ar: 'قمنا بمقارنة 5 عائلات تصنيف إشرافية متباينة بالإضافة إلى شجرة قرار غير مقلمة على عينة الاختبار: <strong>(1) تعزيز التدرج GBM (البطل):</strong> دقة اختبار 88.8%، دقة تنبؤية 89.6%، استدعاء 65.2%، <strong>F1 = 0.754</strong>، ومساحة ROC-AUC = 0.888، و<strong>PR-AUC = 0.841</strong>؛ <strong>(2) الغابات العشوائية:</strong> دقة 87.8%، F1 = 0.714، ROC-AUC = 0.893؛ <strong>(3) آلة المتجهات RBF-SVM:</strong> دقة 86.8%، F1 = 0.705؛ <strong>(4) الانحدار اللوجستي L2:</strong> دقة 83.8%، F1 = 0.623؛ <strong>(5) أقرب الجيران k-NN:</strong> دقة 80.4%، F1 = 0.500؛ و<strong>(6) شجرة قرار غير مقلمة:</strong> 100.0% في التدريب مقابل 81.2% في الاختبار (تأكيد عملي لفرط التخصيص). تم اختيار <strong>تعزيز التدرج (GBM)</strong> كأفضل نموذج لأنه يلتقط التفاعلات غير الخطية (+13.1 نقطة في F1 فوق الانحدار اللوجستي) مع أعلى استدعاء وأفضل معايرة احتمالية.'
    },
    dos_15_stamp: {
      en: 'RUBRIC 1.5 · 1 POINT · POTENTIAL FLAWS & REVISION PLAN',
      ar: 'المعيار 1.5 · درجة واحدة · العيوب المنهجية المحتملة وخطة المراجعة'
    },
    dos_15_h3: {
      en: 'Section 4A — Potential Methodological Flaws & Plan to Revise Using Additional Data/Techniques',
      ar: 'القسم 4أ — العيوب المنهجية المحتملة وخطة التحسين ببيانات وتقنيات إضافية'
    },
    dos_15_p: {
      en: '<strong>Identified Flaws:</strong> (1) <em>Cross-Sectional Snapshot Aggregation:</em> Static 90-day features obscure week-over-week velocity in seat deactivations; (2) <em>Omitted Variable Bias:</em> Lack of competitor pricing shock data and unstructured support ticket NLP sentiment; (3) <em>Binary Window Truncation:</em> Treating churn as a binary 0/1 outcome ignores right-censoring and exact time-to-renewal. <strong>Actionable Revision Plan:</strong> Augment the feature store with longitudinal rolling telemetry slopes (7d/30d/90d usage velocity) and transformer-based NLP sentiment scores from support transcripts; apply <strong>SMOTE-Tomek</strong> / cost-sensitive loss weighting; and pair the classifier with a <strong>Cox Proportional Hazards / Random Survival Forest</strong> model to predict exact time-to-churn.',
      ar: '<strong>العيوب المرصودة:</strong> (1) <em>التجميع المقطعي الثابت:</em> إخفاء سرعة التغير الأسبوعي في إلغاء التراخيص؛ (2) <em>انحياز المتغيرات المحذوفة:</em> غياب بيانات عروض المنافسين وتحليل مشاعر نصوص تذاكر الدعم (NLP Sentiment)؛ (3) <em>الاختزال الثنائي للزمن:</em> تجاهل التوقيت الدقيق لتجديد العقد. <strong>خطة المراجعة والتحسين:</strong> إثراء متجر الميزات بمعدلات انحدار الاستخدام الزمنية المتحركة (7/30/90 يوماً) ودرجات تحليل المشاعر النصية لتذاكر الدعم، وتطبيق أوزان التكلفة غير المتماثلة (Cost-Sensitive Loss / SMOTE-Tomek)، ودمج المصنف مع نماذج تحليل البقاء (<strong>Survival Analysis / Cox Hazards</strong>).'
    },
    dos_16_stamp: {
      en: 'RUBRIC 1.6 · 2 POINTS · MODEL LIMITATIONS & STRATEGIC NEXT STEPS',
      ar: 'المعيار 1.6 · درجتان · قيود النماذج والخطوات الاستراتيجية القادمة'
    },
    dos_16_h3: {
      en: 'Section 4B — Model Limitations & Strategic Next Steps for Production',
      ar: 'القسم 4ب — القيود التشغيلية للنماذج والخطوات الاستراتيجية القادمة للإنتاج'
    },
    dos_16_p: {
      en: '<strong>Operational Limitations:</strong> (1) Observational churn probabilities measure correlation rather than causal treatment uplift (offering discounts to "sure things" or "lost causes" wastes budget); (2) Ensemble tree models require post-hoc SHAP computation for individual explanations; and (3) Macro pricing changes can induce covariate and concept drift. <strong>Recommended Next Steps:</strong> (1) Shift production operating threshold from $\tau=0.50$ to cost-optimal <strong>$\tau=0.20$</strong> (boosting Recall from 65.2% to 82.6% and saving $157,716 net ACV per 500 accounts); (2) Deploy <strong>TreeSHAP</strong> reason codes directly into the CRM dashboard for Customer Success Managers; (3) Execute a randomized A/B retention campaign to train a <strong>Causal Uplift Model</strong>; and (4) Establish automated monthly <strong>Population Stability Index ($\text{PSI} > 0.20$)</strong> drift monitoring.',
      ar: '<strong>القيود التشغيلية:</strong> (1) احتمالات التسرب الرصدية تقيس الارتباط وليس الأثر السببي للتدخل (Causal Uplift)؛ (2) نماذج الأشجار التجميعية تتطلب حسابات SHAP اللاحقة لتفسير كل حساب فردي؛ (3) تغيرات الأسعار السوقية قد تسبب انحراف البيانات (Concept Drift). <strong>الخطوات الاستراتيجية الموصى بها:</strong> (1) خفض عتبة التشغيل الإنتاجية من $\tau=0.50$ إلى <strong>$\tau=0.20$</strong> (لرفع الاستدعاء من 65.2% إلى 82.6% وحماية $157,716 لكل 500 حساب)؛ (2) دمج رموز أسباب <strong>TreeSHAP</strong> في لوحة CRM لمديري نجاح العملاء؛ (3) تنفيذ تجربة A/B عشوائية لبناء <strong>نموذج الرفع السببي (Causal Uplift Model)</strong>؛ و(4) تفعيل المراقبة الشهرية الآلية لانحراف التوزيع عبر مؤشر الاستقرار السكاني (<strong>$\text{PSI} > 0.20$</strong>).'
    },

    sec06_coord: {
      en: 'SEC-06 // QUESTIONS 2, 3, 4 & 5 (7 POINTS) + EXACT MARK EXAM SOLUTIONS',
      ar: 'القسم 06 // الحلول الحرفية الكاملة للأسئلة Q2 و Q3 و Q4 و Q5 (7 درجات)'
    },
    sec06_title: {
      en: 'Mark Auto-Grader Exam Solutions (Q2–Q5) & Anti-Paste Typing Teleprompter',
      ar: 'الحلول الحرفية المعتمدة لأسئلة منصة Mark (Q2–Q5) ومدرب الكتابة الحية'
    },
    sec06_sub: {
      en: 'Below are the <strong>exact word-for-word questions and 4 choices per question</strong> extracted directly from the live Mark exam (<code>assignmentId: 3547</code>). You can view all 4 questions at once in the matrix below, or click any question to practice in the character-by-character teleprompter.',
      ar: 'فيما يلي <strong>النصوص الحرفية للأسئلة والخيارات الأربعة لكل سؤال</strong> كما وردت في منصة الاختبار Mark (<code>assignmentId: 3547</code>). يمكنك استعراض الأسئلة الأربعة وإجاباتها الصحيحة دفعة واحدة في الشبكة أدناه، أو النقر على أي سؤال لتجربته في مدرب الكتابة.'
    },
    qtab_2: {
      en: 'Primary Role of Evaluation Metrics',
      ar: 'الدور الأساسي لمقاييس التقييم (نقطة واحدة)'
    },
    qtab_3: {
      en: 'Correct Statements About Classification (Select 2)',
      ar: 'العبارات الصحيحة حول التصنيف (اختر 2 · نقطتان)'
    },
    qtab_4: {
      en: 'Factors When Comparing Classification Models (Select 3)',
      ar: 'عوامل مقارنة واختيار نماذج التصنيف (اختر 3 · 3 نقاط)'
    },
    qtab_5: {
      en: 'Good on Train Data, Poor on Test Data (Overfitting)',
      ar: 'أداء ممتاز بالتدريب وضعيف بالاختبار (فرط التخصيص)'
    },
    tp_preview_btn: {
      en: '⚡ PREVIEW COMPLETED TYPING',
      ar: '⚡ معاينة الإجابة المكتملة'
    },
    tp_reset_btn: {
      en: '↺ RESET TELEPROMPTER',
      ar: '↺ إعادة ضبط المدرب'
    },
    tp_target_lbl: {
      en: 'TARGET VERBATIM ANSWER (CHARACTER-BY-CHARACTER GUIDE)',
      ar: 'النص الحرفي للإجابة الصحيحة (دليل حرفاً بحرف)'
    },
    tp_type_lbl: {
      en: 'TYPE HERE TO PRACTICE TRANSCRIPTION',
      ar: 'اكتب هنا للتدرب على النسخ المباشر'
    },
    sec07_coord: {
      en: 'SEC-07 // OFFICIAL COURSERA CREDENTIAL VERIFICATION (ID: UL7MLY014L1Y)',
      ar: 'القسم 07 // الشهادة الرسمية المعتمدة من منصة كورسيرا (رقم الشهادة: UL7MLY014L1Y)'
    },
    sec07_title: {
      en: 'Official Coursera Accomplishment Certificate — Supervised Machine Learning: Classification',
      ar: 'شهادة الإنجاز الرسمية من Coursera — التعلم الآلي الخاضع للإشراف: التصنيف'
    },
    btn_verify_cert: {
      en: '🎓 VERIFY CERTIFICATE ON COURSERA (UL7MLY014L1Y)',
      ar: '🎓 التحقق المباشر من الشهادة على Coursera (UL7MLY014L1Y)'
    }
  };

  function applyLanguage(lang) {
    window.OBSERVATORY_LANG = lang;
    const isAr = lang === 'ar';
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('lang', isAr ? 'ar' : 'en');
    htmlEl.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // Update the single-emoji button icon & tooltip
    const emojiBtn = document.getElementById('langEmojiToggleBtn');
    if (emojiBtn) {
      // Show Saudi flag emoji to switch to Arabic when in English, and UK flag emoji to switch to English when in Arabic
      emojiBtn.textContent = isAr ? '🇬🇧' : '🇸🇦';
      emojiBtn.setAttribute(
        'title',
        isAr ? 'Switch to English (LTR)' : 'تحويل الموقع بالكامل إلى العربية (RTL)'
      );
    }

    // Update all static [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const entry = I18N_DICTIONARY[key];
      if (entry) {
        el.innerHTML = isAr ? entry.ar : entry.en;
      }
    });

    // Refresh dynamic engines (Charts, Tables, What-If, 3D Manifold, Mark Exam Companion)
    if (window.observatoryEngine && typeof window.observatoryEngine.refreshLanguage === 'function') {
      window.observatoryEngine.refreshLanguage();
    }
    if (window.markExamCompanion && typeof window.markExamCompanion.refreshLanguage === 'function') {
      window.markExamCompanion.refreshLanguage();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const emojiBtn = document.getElementById('langEmojiToggleBtn');
    if (emojiBtn) {
      emojiBtn.addEventListener('click', () => {
        const nextLang = window.OBSERVATORY_LANG === 'en' ? 'ar' : 'en';
        applyLanguage(nextLang);
      });
    }
  });
})();

