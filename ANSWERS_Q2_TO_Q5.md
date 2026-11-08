# 🎯 الإجابات النموذجية الكاملة لأسئلة الاختبار (Questions 1 to 5 — 15/15 Points)
## Final Assignment: Supervised Machine Learning Classification (`assignmentId: 3547`)

> تم استخراج النصوص الحرفية للأسئلة والخيارات الأربعة لكل سؤال مباشرةً من ملفات الاختبار الحية لمنصة **Mark (`mark.skills.network/learner/3547/questions`)** ومطابقتها بنسبة 100% مع معايير التقييم (`Grading Criteria.png`).

---

## 📄 Question 1 (8 Points) — UPLOAD REPORT (PDF)

- **النص الحرفي للسؤال في المنصة:**
  > *"Upload the final report explaining how your chosen Supervised Machine Learning Classification model supports the main objective of your analysis, including key insights and recommendations."*
- **الملف الجاهز للرفع مباشرةً (Upload File):**
  - [`Final_Report_Supervised_ML_Classification.pdf`](file:///c:/Users/070425/Downloads/classification%20%20learning/Final_Report_Supervised_ML_Classification.pdf) (موجود في جذر المشروع وفي مجلد `outputs/`).
- **تغطية بنود التقييم الستة (8/8 درجات):**
  - **1.1 (1 Point):** التقرير بصيغة PDF ويبرز بوضوح النتائج والرؤى الرئيسية (Key Insights).
  - **1.2 (1 Point):** وصف شامل للبيانات (`N = 2,500` حساب مؤسسي، 12 متغيراً مفسراً، وكيفية استخدامها في التدريب والتقييم والتفسير).
  - **1.3 (1 Point):** فقرة مخصصة تشرح الهدف الرئيسي للتحليل (موازنة القوة التنبؤية مع قابلية التفسير التنفيذية).
  - **1.4 (2 Points):** مقارنة شاملة بين 6 نماذج تصنيف (`Gradient Boosting`, `Random Forest`, `RBF-SVM`, `Logistic Regression`, `k-NN`, `Unpruned Decision Tree`) وتحديد النموذج الأفضل (`Gradient Boosting`: دقة 88.8%، `F1 = 0.754`، `ROC-AUC = 0.888`).
  - **1.5 (1 Point):** شرح العيوب المنهجية المحتملة وخطة المراجعة باستخدام بيانات وتقنيات إضافية (`SMOTE-Tomek`, `Time-Series Velocity`, `NLP Sentiment`, `Survival Analysis`).
  - **1.6 (2 Points):** شرح قيود النماذج والخطوات التالية المقترحة للإنتاج (`Threshold τ = 0.20`, `TreeSHAP CRM Integration`, `Causal Uplift A/B Testing`, `PSI Drift Monitoring`).

---

## ✅ Question 2 (1 Point) — MULTIPLE CHOICE (اختيار من متعدد - إجابة واحدة)

### النص الحرفي للسؤال:
> **"What is the primary role of evaluation metrics in the context of Supervised Machine Learning Classification?"**

### الخيارات الأربعة في المنصة والإجابة الصحيحة:

| الحالة | الخيار الحرفي في منصة Mark | الشرح والسبب العلمي |
| :--- | :--- | :--- |
| ❌ خطأ | `To automatically adjust the scale of all input features` | هذا دور توحيد المقاييس (`StandardScaler` / `MinMaxScaler`) أثناء المعالجة المسبقة للبيانات وليس مقاييس التقييم. |
| ❌ خطأ | `To illustrate the merging of clusters at various distance levels` | هذا دور مخطط الشجرة العنقودية (`Dendrogram`) في التجميع الهرمي غير الخاضع للإشراف (`Hierarchical Clustering`). |
| ✅ **الإجابة الصحيحة (اختر هذا)** | **`To assess and compare the effectiveness of Classification models using labeled datasets`** | **الإجابة الصحيحة (1 نقطة):** مقاييس التقييم (`Accuracy`, `Precision`, `Recall`, `F1-Score`, `ROC-AUC`) تُستخدم لتقييم ومقارنة فعالية نماذج التصنيف باستخدام البيانات المُعنونة. |
| ❌ خطأ | `To calculate regression coefficients for predicting continuous values` | هذا يخص نماذج الانحدار الخطي (`Linear Regression`) للتنبؤ بالقيم الرقمية المستمرة وليس التصنيف الفئوي. |

---

## ✅ Question 3 (2 Points) — MULTIPLE SELECT (اختر كل ما ينطبق - إجابتان صحيحتان)

### النص الحرفي للسؤال:
> **"Which statements about Supervised ML Classification are correct? (Select all that apply)"**

### الخيارات الأربعة في المنصة والإجابات الصحيحة:

| الحالة | الخيار الحرفي في منصة Mark | الشرح والسبب العلمي |
| :--- | :--- | :--- |
| ✅ **صحيح (اختر هذا الخيار - 1)** | **`Supervised ML Classification models can be compared using performance metrics to select the best model`** | **عبارة صحيحة:** يمكن مقارنة نماذج التصنيف الخاضع للإشراف باستخدام مقاييس الأداء (`F1`, `ROC-AUC`, `Precision`, `Recall`) لاختيار النموذج الأفضل. |
| ❌ خطأ (لا تختره) | `Supervised ML Classification works only with numerical features and cannot handle categorical data` | عبارة خاطئة: نماذج التصنيف تتعامل بكفاءة مع البيانات الفئوية (`Categorical Data`) عبر الترميز (`One-Hot / Ordinal Encoding`) أو مباشرة في الأشجار. |
| ❌ خطأ (لا تختره) | `Supervised ML Classification does not require evaluation metrics because class labels are already known` | عبارة خاطئة: مقاييس التقييم على بيانات الاختبار غير المرئية ضرورية جداً لقياس قدرة النموذج على التعميم واكتشاف الأخطاء. |
| ✅ **صحيح (اختر هذا الخيار - 2)** | **`In Supervised ML Classification, models are trained using labeled data where the target class is known`** | **عبارة صحيحة:** في التصنيف الخاضع للإشراف، يتم تدريب النماذج باستخدام بيانات مُعنونة (`Labeled Data`) تكون فيها الفئة المستهدفة (`Target Class`) معروفة مسبقاً. |

---

## ✅ Question 4 (3 Points) — MULTIPLE SELECT (اختر كل ما ينطبق - 3 إجابات صحيحة)

### النص الحرفي للسؤال:
> **"When evaluating Supervised Machine Learning Classification models to select the most effective one, which factors should be taken into account? (Select all that apply)"**

### الخيارات الأربعة في المنصة والإجابات الصحيحة:

| الحالة | الخيار الحرفي في منصة Mark | الشرح والسبب العلمي |
| :--- | :--- | :--- |
| ✅ **صحيح (اختر هذا الخيار - 1)** | **`Applying suitable performance metrics for evaluating Supervised ML Classification models`** | **عبارة صحيحة:** تطبيق مقاييس أداء مناسبة لتقييم نماذج التصنيف (مثل `Precision`, `Recall`, `F1-Score`, `ROC-AUC`) أمر جوهري لاختيار النموذج الأكفأ. |
| ✅ **صحيح (اختر هذا الخيار - 2)** | **`Experimenting with different hyperparameter settings for Supervised ML Classification models, like learning rate and batch size`** | **عبارة صحيحة:** تجربة إعدادات مختلفة للمعاملات الفائقة (`Hyperparameters` مثل معدل التعلم `learning rate` وعمق الشجرة ومعامل التنظيم) ضرورية لضبط أداء كل نموذج قبل المقارنة. |
| ✅ **صحيح (اختر هذا الخيار - 3)** | **`Assessing various Supervised ML Classification techniques such as Support Vector Machines, Naive Bayes, and K-Nearest Neighbors`** | **عبارة صحيحة:** تقييم ومقارنة عائلات خوارزمية متنوعة (`SVM`, `Naive Bayes`, `k-NN`, `Random Forest`, `Gradient Boosting`, `Logistic Regression`) يضمن عدم الانحياز لفرضية خطية أو مكانية واحدة. |
| ❌ خطأ (لا تختره) | `Choosing the Supervised ML Classification model that generates the highest number of negative class predictions` | عبارة خاطئة: اختيار النموذج الذي يتنبأ بأكبر عدد من الفئات السالبة يؤدي إلى تفويت الفئة الموجبة الحرجة (تدمير `Recall` وزيادة `False Negatives`). |

---

## ✅ Question 5 (1 Point) — MULTIPLE CHOICE (اختيار من متعدد - إجابة واحدة)

### النص الحرفي للسؤال:
> **"If a Supervised ML Classification model performs well on training data but poorly on test data, what is the most likely issue?"**

### الخيارات الأربعة في المنصة والإجابة الصحيحة:

| الحالة | الخيار الحرفي في منصة Mark | الشرح والسبب العلمي |
| :--- | :--- | :--- |
| ✅ **الإجابة الصحيحة (اختر هذا)** | **`The Supervised ML Classification model is overfitting the training data`** | **الإجابة الصحيحة (1 نقطة):** النموذج يعاني من **فرط التخصيص (Overfitting)** لبيانات التدريب؛ حيث حفظ الضوضاء والتفاصيل الخاصة بعينة التدريب (مثل شجرة القرار غير المقلمة التي حققت `100%` في التدريب وهبطت إلى `81.2%` في الاختبار) وفشل في التعميم على البيانات الجديدة. |
| ❌ خطأ | `The Supervised ML Classification model has too few features to learn from` | قلة المتغيرات المفسرة تؤدي إلى ضعف الأداء في التدريب والاختبار معاً (`Underfitting / High Bias`). |
| ❌ خطأ | `The Supervised ML Classification model does not require labeled data` | التصنيف الخاضع للإشراف يتطلب دائماً بيانات مُعنونة (`Labeled Data`). |
| ❌ خطأ | `The Supervised ML Classification model is automatically scaling features incorrectly` | الفجوة الكبيرة بين دقة التدريب المرتفعة ودقة الاختبار المنخفضة هي التعريف الكلاسيكي لـ `Overfitting`. |

