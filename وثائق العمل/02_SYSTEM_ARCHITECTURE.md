# 02 — المعمارية العامة للنظام (System Architecture Blueprint)

## هيكلة المشروع (Project Tree)
```text
classification-learning/
├── index.html                                      # الواجهة التفاعلية الرئيسية (Swiss Actuarial Observatory + 3D WebGL)
├── assets/
│   ├── css/
│   │   └── observatory.css                         # نظام التصميم السويسري الإكتواري المزدوج (Paper & Obsidian Modes)
│   └── js/
│       ├── data-bundle.js                          # الحزمة الإحصائية المولدة من محرك بايثون (Metrics, ROC, PR, Sample Records)
│       ├── manifold-3d.js                          # محرك Three.js WebGL لفضاء القرار ثلاثي الأبعاد والسطح الفاصل
│       ├── simulator-engine.js                     # محرك الاستدلال الحي (What-If) وحساب مصفوفة الارتباك والعائد المالي
│       └── mark-companion.js                       # رفيق اختبار Mark التفاعلي ومدرب الكتابة المباشرة (Anti-Paste Helper)
├── data/
│   └── enterprise_churn_dataset.csv                # مجموعة البيانات المعتمدة (2,500 عميل، 12 متغيراً + الهدف الثنائي)
├── src/
│   ├── simulate_classification.py                  # المحرك الإحصائي الفعلي (Scikit-Learn) لتدريب ومقارنة النماذج الـ 5
│   └── generate_cdo_report_pdf.py                  # مولد التقرير التنفيذي المعتمد بصيغة PDF (جاهز للرفع في السؤال 1)
├── outputs/
│   ├── Final_Report_Supervised_ML_Classification.pdf # التقرير النهائي الجاهز للرفع في منصة Mark (Question 1 - 8 Points)
│   ├── Final_Report_Printable.html                 # نسخة HTML طباعية عالية الدقة للتقرير التنفيذي
│   └── model_evaluation_metrics.json               # المخرجات الإحصائية الدقيقة لكافة النماذج الخمسة
├── وثائق العمل/                                    # حزمة الـ 14 وثيقة معمارية الإلزامية
├── تقارير التحديثات/                               # تقارير التحديثات الموثقة بالوقت الفعلي
├── CHRONICLE.md                                    # السجل الزمني التراكمي
├── LESSONS.md                                      # الدروس المستفادة
├── LIVING_STYLE_VAULT.md                           # خزانة الأنماط الحية
├── README.md                                       # التوثيق الشامل للمستودع على GitHub (English & العربية)
├── requirements.txt                                # اعتمادات بايثون العلمية
├── package.json                                    # توصيف المشروع وأوامر التشغيل والفحص
├── LICENSE                                         # رخصة MIT مفتوحة المصدر
└── .gitignore                                      # استثناءات Git القياسية
```

