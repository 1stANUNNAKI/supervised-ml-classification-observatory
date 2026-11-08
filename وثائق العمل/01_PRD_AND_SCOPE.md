# 01 — وثيقة متطلبات المنتج والنطاق التنفيذي (PRD & Executive Scope)

## 1. ملخص المشروع
بناء منظومة متكاملة لحل ومحاكاة مشروع التخرج النهائي في **التعلم الآلي الموجه للتصنيف (Supervised Machine Learning Classification)**، تشمل:
1. **محاكاة برمجية وعلمية حقيقية (`src/simulate_classification.py`)**: توليد وتحليل بيانات واقعية لتوقع تسرب عملاء المؤسسات (Enterprise Telecom & SaaS Customer Churn Classification) بـ 2,500 سجل و12 متغيراً تشغيلياً ومالياً، وتدريب ومقارنة **5 نماذج تصنيف موجهة**:
   - الانحدار اللوجستي المعياري (`Logistic Regression - L2 Regularized`)
   - الغابات العشوائية (`Random Forest Classifier`)
   - تعزيز التدرج الشجري (`Gradient Boosting Classifier` - النموذج الموصى به لـ CDO)
   - آلة المتجهات الداعمة بنواة شعاعية (`Support Vector Machine - RBF Kernel`)
   - خوارزمية الجيران الأقرب (`K-Nearest Neighbors - k-NN`)
2. **تقرير تحليلي تنفيذي بصيغة PDF (`Final_Report_Supervised_ML_Classification.pdf`)**: مصمم خصيصاً لجمهور القيادة العليا (`Chief Data Officer - CDO` و `Head of Analytics`) ومستوفٍ بنسبة 100% لكافة بنود أداة التقييم الذكي **Mark** (البنود 1.1 إلى 1.6 بوزن 8 نقاط).
3. **الحلول النموذجية الكاملة للأسئلة الخمسة (Questions 1–5 — 15 Points)**: مع أداة تدريب كتابي حي لتجاوز قيود منع النسخ واللصق (`Copying/Pasting/Right-Click Disabled`).
4. **صفحة عرض تفاعلية فريدة (`index.html`)**: مبنية بهوية **"المرصد الإكتواري السويسري التحريري" (Swiss Actuarial & Quantitative Editorial Observatory)** مع مشاهد ثلاثية الأبعاد حقيقية عبر `Three.js WebGL`، ومحرك محاكاة وتعديل العتبة الاحتمالية ($\tau$)، واستدلال فوري (Live What-If Inference) وتفسير الأهمية النسبية للمتغيرات (SHAP Attribution).
5. **تجهيز متكامل للنشر على GitHub**: هيكلة قياسية، ملف `README.md` ثنائي اللغة فائق الاحترافية، وملف `.gitignore` وترخيص `LICENSE`.

