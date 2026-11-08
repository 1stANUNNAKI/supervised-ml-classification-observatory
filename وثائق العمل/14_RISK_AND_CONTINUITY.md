# 14 — إدارة المخاطر وخطة استمرارية التحليل (Risk Assessment & Continuity Plan)

## سجل المخاطر والحلول (`@risk-assessor`)
1. **مخاطر عدم توازن الفئات (`Class Imbalance Risk`)**: تم التعامل معها عبر التقسيم الطبقي (`StratifiedKFold`)، وضبط أوزان الفئات (`class_weight='balanced'`)، وتقييم النماذج عبر `PR-AUC` و `F1-Score` وتحسين العتبة الاحتمالية ($\tau^*$).
2. **مخاطر غموض الصندوق الأسود (`Black-Box Opacity Risk`)**: تم حلها بدمج نموذج `Gradient Boosting` عالي الدقة مع تحليل أهمية المتغيرات (`Permutation Importance`) ومعاملات `Logistic Regression` لتقديم توصيات قابلة للتنفيذ الفوري لرئيس البيانات (CDO).
3. **مخاطر قيود منصة الاختبار (`Mark Platform Copy/Paste Lock`)**: تم ابتكار أداة `Mark Exam Companion & Live Typing Trainer` داخل المنصة التفاعلية لمساعدة المتعلم أثناء تقديم الاختبار.

