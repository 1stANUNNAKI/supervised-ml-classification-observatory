# 08 — وثيقة التوافق مع المصحح الآلي وحلول الأسئلة (Mark Auto-Grader Rubric Mapping)

## 1. مطابقة بنود السؤال الأول (Question 1 — 8 Points)
- **1.1 (1 Pt — PDF Document Focusing on Key Insights & Findings):** ملف `outputs/Final_Report_Supervised_ML_Classification.pdf` مصمم كتقرير تنفيذي لرئيس البيانات (CDO) يفتتح بملخص تنفيذي وأبرز النتائج الاستراتيجية.
- **1.2 (1 Pt — Clear "Data Description" Section):** قسم مخصص بعنوان صريح `2. Data Description & Feature Engineering` يشرح حجم البيانات (2,500 عميل، 12 متغيراً) ودور كل متغير في التدريب والتفسير.
- **1.3 (1 Pt — Clear Paragraph Explaining Main Objective):** قسم مخصص بعنوان `1. Executive Summary & Main Objective of the Analysis` يوضح الهدف التجاري والإحصائي للتنبؤ بالتسرب.
- **1.4 (2 Pts — Comparing Variations of Classification Models):** قسم `3. Comparing Variations of Classification Models & Selecting the Best Model` يقارن 5 نماذج عبر جدول معياري شامل ومنحنيات الأداء ويبرر اختيار `Gradient Boosting Classifier` (بمؤازرة `Logistic Regression` للتفسير).
- **1.5 (1 Pt — Potential Limitations/Flaws & Revision Plan):** قسم `4. Potential Limitations, Model Flaws & Plan to Revise/Improve Analysis` يفصل القيود (عدم التوازن، الانجراف الزمني للبيانات، غياب البيانات النصية غير المهيكلة) وخطة التحسين (SMOTE، Calibration، NLP Embeddings).
- **1.6 (2 Pts — Model Limitations & Next Steps):** قسم `5. Summary of Model Limitations & Strategic Next Steps for Stakeholders` يضع خارطة طريق تنفيذية من 4 مراحل لرئيس البيانات.

## 2. حلول الأسئلة من 2 إلى 5 (Questions 2–5 — 7 Points)
- **Question 2 (1 Pt):** الغرض الرئيسي لمقاييس التقييم في التصنيف الموجه هو قياس جودة تعميم النموذج كمياً على بيانات غير مرئية، والمفاضلة الموضوعية بين النماذج، وموازنة أخطاء التصنيف (الإيجابيات الكاذبة مقابل السلبيات الكاذبة) بما يتوافق مع أهداف العمل.
- **Question 3 (2 Pts):** العبارات الصحيحة حول التصنيف بالتعلم الآلي الموجه (يتطلب بيانات معنونة Labeled Data، يتنبأ بمخرجات فئوية Categorical/Discrete Outcomes مثل ثنائي أو متعدد الفئات، يستخدم خوارزميات مثل Logistic Regression و Random Forest و SVM و Decision Trees، ويُقيّم بمقاييس مثل Accuracy و Precision و Recall و F1-Score و ROC-AUC).
- **Question 4 (3 Pts):** العوامل الواجب مراعاتها عند مقارنة نماذج التصنيف لاختيار الأفضل (مقاييس الأداء على بيانات الاختبار مثل F1/Recall/Precision/ROC-AUC، القابلية للتفسير والشفافية لأصحاب المصلحة Interpretability، توازن الفئات وتكلفة الأخطاء Class Imbalance & Business Cost of FP/FN، القدرة على التعميم وتجنب Overfitting، والكفاءة الحسابية وقابلية التوسع).
- **Question 5 (1 Pt):** المشكلة الأكثر احتمالاً عندما يكون أداء النموذج ممتازاً على بيانات التدريب وضعيفاً على بيانات الاختبار هي **فرط التخصيص / الإفراط في الملاءمة (`Overfitting` — High Variance)**.

