# 11 — هندسة الأداء واستهلاك الموارد (Performance & Optimization Specification)

## معايير الأداء المعتمدة (`@perf-auditor`)
- **الحساب المسبق للمنحنيات (`Pre-computed ROC/PR & Confusion Matrix Grid`)**: يتم حساب مصفوفات الارتباك ومنحنيات `ROC` و `Precision-Recall` عبر 99 عتبة احتمالية ($\tau \in [0.01, 0.99]$) داخل محرك بايثون وتصديرها إلى `assets/js/data-bundle.js`، مما يضمن استجابة لحظية (`< 1ms`) عند تحريك شريط العتبة في المتصفح بسرعة `60 FPS`.
- **تحسين مشهد `Three.js WebGL`**: استخدام `BufferGeometry` وإدارة دورة حياة الإطارات (`requestAnimationFrame`) بكفاءة عالية مع دعم تغيير حجم النافذة الفوري.

