/**
 * Mark Auto-Grader Exam Companion & Anti-Paste Live Typing Teleprompter
 * =====================================================================
 * Contains the 100% EXACT VERBATIM questions and 4 choices per question
 * extracted directly from the live Mark platform (`assignmentId: 3547`,
 * `assignmentVersionId: 9399` — Questions 19980, 19983, 19982, 19985, 19984),
 * paired with full bilingual English/Arabic explanations and an interactive
 * character-by-character typing trainer.
 */

(function () {
  'use strict';

  function isArabic() {
    return window.OBSERVATORY_LANG === 'ar';
  }

  const EXAM_QUESTIONS_DATA = {
    q2: {
      id: 'q2',
      markId: 19983,
      points: 1,
      typeEn: 'MULTIPLE CHOICE (1 CORRECT ANSWER)',
      typeAr: 'اختيار من متعدد (إجابة واحدة صحيحة · نقطة واحدة)',
      code: 'QUESTION 2 · 1 POINT (MULTIPLE CHOICE · ID #19983)',
      codeAr: 'السؤال الثاني · نقطة واحدة (اختيار من متعدد · #19983)',
      title: 'What is the primary role of evaluation metrics in the context of Supervised Machine Learning Classification?',
      titleAr: 'ما هو الدور الأساسي لمقاييس التقييم في سياق التصنيف بالتعلم الآلي الخاضع للإشراف؟',
      prompt: 'Verbatim Mark Question 2 (1 Point): "What is the primary role of evaluation metrics in the context of Supervised Machine Learning Classification?"',
      promptAr: 'النص الحرفي للسؤال الثاني في منصة Mark (نقطة واحدة): "What is the primary role of evaluation metrics in the context of Supervised Machine Learning Classification?"',
      optionsList: [
        {
          status: 'wrong',
          labelEn: 'OPTION 1 — DO NOT SELECT (Feature Scaling)',
          labelAr: 'الخيار 1 — لا تختره (توحيد مقاييس المتغيرات)',
          text: 'To automatically adjust the scale of all input features',
          textAr: 'الترجمة: ضبط مقياس جميع متغيرات الإدخال تلقائياً (خطأ: هذا دور StandardScaler وليس مقاييس التقييم).'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 2 — DO NOT SELECT (Hierarchical Clustering)',
          labelAr: 'الخيار 2 — لا تختره (التجميع الهرمي غير الإشرافي)',
          text: 'To illustrate the merging of clusters at various distance levels',
          textAr: 'الترجمة: توضيح دمج العناقيد عند مستويات مسافة مختلفة (خطأ: هذا دور مخطط Dendrogram في التجميع غير الإشرافي).'
        },
        {
          status: 'correct',
          labelEn: 'OPTION 3 — ✅ CORRECT ANSWER (SELECT THIS IN MARK)',
          labelAr: 'الخيار 3 — ✅ الإجابة الصحيحة المعتمدة (اختر هذا الخيار)',
          text: 'To assess and compare the effectiveness of Classification models using labeled datasets',
          textAr: 'الترجمة: تقييم ومقارنة فعالية نماذج التصنيف باستخدام مجموعات البيانات المُعنونة (Labeled Datasets).'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 4 — DO NOT SELECT (Linear Regression)',
          labelAr: 'الخيار 4 — لا تختره (الانحدار الخطي للقيم المستمرة)',
          text: 'To calculate regression coefficients for predicting continuous values',
          textAr: 'الترجمة: حساب معاملات الانحدار للتنبؤ بالقيم المستمرة (خطأ: هذا يخص Linear Regression).'
        }
      ],
      arabicExplanation: 'الشرح العلمي للسؤال الثاني (نقطة واحدة): في منصة Mark، الخيار الثالث "To assess and compare the effectiveness of Classification models using labeled datasets" هو الإجابة الصحيحة الوحيدة؛ لأن مقاييس التقييم (Accuracy, Precision, Recall, F1-Score, ROC-AUC) صُممت لقياس كفاءة نماذج التصنيف ومقارنتها ببعضها على البيانات المُعنونة.',
      englishExplanation: 'Scientific Rationale (Question 2 · 1 Pt): Select Choice 3 — "To assess and compare the effectiveness of Classification models using labeled datasets". Evaluation metrics (Accuracy, Precision, Recall, F1-Score, ROC-AUC) quantify how accurately classifiers predict ground-truth labels and allow objective model comparison.',
      teleprompterText: 'To assess and compare the effectiveness of Classification models using labeled datasets'
    },

    q3: {
      id: 'q3',
      markId: 19982,
      points: 2,
      typeEn: 'MULTIPLE SELECT (SELECT 2 CORRECT ANSWERS)',
      typeAr: 'اختيار متعدد (اختر إجابتين صحيحتين · نقطتان)',
      code: 'QUESTION 3 · 2 POINTS (MULTIPLE SELECT · ID #19982)',
      codeAr: 'السؤال الثالث · نقطتان (اختر كل ما ينطبق · #19982)',
      title: 'Which statements about Supervised ML Classification are correct? (Select all that apply)',
      titleAr: 'أي العبارات التالية حول التصنيف في التعلم الآلي الخاضع للإشراف صحيحة؟ (اختر كل ما ينطبق)',
      prompt: 'Verbatim Mark Question 3 (2 Points): "Which statements about Supervised ML Classification are correct? (Select all that apply)"',
      promptAr: 'النص الحرفي للسؤال الثالث في منصة Mark (نقطتان): "Which statements about Supervised ML Classification are correct? (Select all that apply)"',
      optionsList: [
        {
          status: 'correct',
          labelEn: 'OPTION 1 — ✅ CORRECT STATEMENT (SELECT THIS — 1 of 2)',
          labelAr: 'الخيار 1 — ✅ عبارة صحيحة (اختر هذا الخيار — 1 من 2)',
          text: 'Supervised ML Classification models can be compared using performance metrics to select the best model',
          textAr: 'الترجمة: يمكن مقارنة نماذج التصنيف الخاضع للإشراف باستخدام مقاييس الأداء لاختيار النموذج الأفضل.'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 2 — DO NOT SELECT (Categorical Data Trap)',
          labelAr: 'الخيار 2 — لا تختره (فخ البيانات الفئوية)',
          text: 'Supervised ML Classification works only with numerical features and cannot handle categorical data',
          textAr: 'الترجمة: يعمل التصنيف الإشرافي فقط مع الميزات الرقمية ولا يمكنه التعامل مع البيانات الفئوية (خطأ: يتعامل معها عبر One-Hot Encoding أو الأشجار).'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 3 — DO NOT SELECT (No Metrics Trap)',
          labelAr: 'الخيار 3 — لا تختره (فخ الاستغناء عن المقاييس)',
          text: 'Supervised ML Classification does not require evaluation metrics because class labels are already known',
          textAr: 'الترجمة: لا يتطلب التصنيف الإشرافي مقاييس تقييم لأن تسميات الفئات معروفة مسبقاً (خطأ: مقاييس التقييم إلزامية لفحص التعميم على بيانات الاختبار).'
        },
        {
          status: 'correct',
          labelEn: 'OPTION 4 — ✅ CORRECT STATEMENT (SELECT THIS — 2 of 2)',
          labelAr: 'الخيار 4 — ✅ عبارة صحيحة (اختر هذا الخيار — 2 من 2)',
          text: 'In Supervised ML Classification, models are trained using labeled data where the target class is known',
          textAr: 'الترجمة: في التصنيف الخاضع للإشراف، يتم تدريب النماذج باستخدام بيانات مُعنونة تكون فيها الفئة المستهدفة معروفة.'
        }
      ],
      arabicExplanation: 'الشرح العلمي للسؤال الثالث (نقطتان - Select all that apply): يجب تحديد الخيار الأول والخيار الرابع معاً: (1) "Supervised ML Classification models can be compared using performance metrics to select the best model" و(4) "In Supervised ML Classification, models are trained using labeled data where the target class is known".',
      englishExplanation: 'Scientific Rationale (Question 3 · 2 Pts): Select BOTH Option 1 ("Supervised ML Classification models can be compared using performance metrics to select the best model") AND Option 4 ("In Supervised ML Classification, models are trained using labeled data where the target class is known").',
      teleprompterText: 'Supervised ML Classification models can be compared using performance metrics to select the best model | In Supervised ML Classification, models are trained using labeled data where the target class is known'
    },

    q4: {
      id: 'q4',
      markId: 19985,
      points: 3,
      typeEn: 'MULTIPLE SELECT (SELECT 3 CORRECT ANSWERS)',
      typeAr: 'اختيار متعدد (اختر 3 إجابات صحيحة · 3 نقاط)',
      code: 'QUESTION 4 · 3 POINTS (MULTIPLE SELECT · ID #19985)',
      codeAr: 'السؤال الرابع · 3 نقاط (اختر كل ما ينطبق · #19985)',
      title: 'When evaluating Supervised Machine Learning Classification models to select the most effective one, which factors should be taken into account? (Select all that apply)',
      titleAr: 'عند تقييم نماذج التصنيف في التعلم الآلي الخاضع للإشراف لاختيار الأكثر فعالية، ما العوامل التي يجب أخذها في الاعتبار؟',
      prompt: 'Verbatim Mark Question 4 (3 Points): "When evaluating Supervised Machine Learning Classification models to select the most effective one, which factors should be taken into account? (Select all that apply)"',
      promptAr: 'النص الحرفي للسؤال الرابع في منصة Mark (3 نقاط): "When evaluating Supervised Machine Learning Classification models to select the most effective one, which factors should be taken into account? (Select all that apply)"',
      optionsList: [
        {
          status: 'correct',
          labelEn: 'OPTION 1 — ✅ CORRECT FACTOR (SELECT THIS — 1 of 3)',
          labelAr: 'الخيار 1 — ✅ عامل صحيح (اختر هذا الخيار — 1 من 3)',
          text: 'Applying suitable performance metrics for evaluating Supervised ML Classification models',
          textAr: 'الترجمة: تطبيق مقاييس أداء مناسبة لتقييم نماذج التصنيف في التعلم الآلي الخاضع للإشراف.'
        },
        {
          status: 'correct',
          labelEn: 'OPTION 2 — ✅ CORRECT FACTOR (SELECT THIS — 2 of 3)',
          labelAr: 'الخيار 2 — ✅ عامل صحيح (اختر هذا الخيار — 2 من 3)',
          text: 'Experimenting with different hyperparameter settings for Supervised ML Classification models, like learning rate and batch size',
          textAr: 'الترجمة: تجربة إعدادات مختلفة للمعاملات الفائقة (Hyperparameters) لنماذج التصنيف، مثل معدل التعلم وحجم الدفعة.'
        },
        {
          status: 'correct',
          labelEn: 'OPTION 3 — ✅ CORRECT FACTOR (SELECT THIS — 3 of 3)',
          labelAr: 'الخيار 3 — ✅ عامل صحيح (اختر هذا الخيار — 3 من 3)',
          text: 'Assessing various Supervised ML Classification techniques such as Support Vector Machines, Naive Bayes, and K-Nearest Neighbors',
          textAr: 'الترجمة: تقييم تقنيات تصنيف إشرافية متنوعة مثل آلات المتجهات الداعمة (SVM) وبايز الساذج (Naive Bayes) وأقرب الجيران (k-NN).'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 4 — DO NOT SELECT (Negative Predictions Trap)',
          labelAr: 'الخيار 4 — لا تختره (فخ تعظيم التنبؤات السلبية)',
          text: 'Choosing the Supervised ML Classification model that generates the highest number of negative class predictions',
          textAr: 'الترجمة: اختيار النموذج الذي يولد أكبر عدد من تنبؤات الفئة السلبية (خطأ فادح: يؤدي إلى تفويت جميع حالات الفئة الإيجابية الحرجة).'
        }
      ],
      arabicExplanation: 'الشرح العلمي للسؤال الرابع (3 نقاط كاملة - Select all that apply): يجب تحديد الخيارات الثلاثة الأولى معاً (Option 1 + Option 2 + Option 3)، وترك الخيار الرابع فقط دون تحديد.',
      englishExplanation: 'Scientific Rationale (Question 4 · 3 Pts): Select the first THREE choices (Option 1: Applying suitable performance metrics; Option 2: Experimenting with different hyperparameter settings; Option 3: Assessing various Supervised ML Classification techniques). Do NOT select Option 4.',
      teleprompterText: 'Applying suitable performance metrics for evaluating Supervised ML Classification models | Experimenting with different hyperparameter settings for Supervised ML Classification models, like learning rate and batch size | Assessing various Supervised ML Classification techniques such as Support Vector Machines, Naive Bayes, and K-Nearest Neighbors'
    },

    q5: {
      id: 'q5',
      markId: 19984,
      points: 1,
      typeEn: 'MULTIPLE CHOICE (1 CORRECT ANSWER)',
      typeAr: 'اختيار من متعدد (إجابة واحدة صحيحة · نقطة واحدة)',
      code: 'QUESTION 5 · 1 POINT (MULTIPLE CHOICE · ID #19984)',
      codeAr: 'السؤال الخامس · نقطة واحدة (اختيار من متعدد · #19984)',
      title: 'If a Supervised ML Classification model performs well on training data but poorly on test data, what is the most likely issue?',
      titleAr: 'إذا كان نموذج التصنيف الخاضع للإشراف يؤدي بشكل جيد على بيانات التدريب ولكنه يؤدي بشكل ضعيف على بيانات الاختبار، فما هي المشكلة الأكثر احتمالاً؟',
      prompt: 'Verbatim Mark Question 5 (1 Point): "If a Supervised ML Classification model performs well on training data but poorly on test data, what is the most likely issue?"',
      promptAr: 'النص الحرفي للسؤال الخامس في منصة Mark (نقطة واحدة): "If a Supervised ML Classification model performs well on training data but poorly on test data, what is the most likely issue?"',
      optionsList: [
        {
          status: 'correct',
          labelEn: 'OPTION 1 — ✅ CORRECT ANSWER (SELECT THIS IN MARK)',
          labelAr: 'الخيار 1 — ✅ الإجابة الصحيحة المعتمدة (اختر هذا الخيار)',
          text: 'The Supervised ML Classification model is overfitting the training data',
          textAr: 'الترجمة: نموذج التصنيف الخاضع للإشراف يعاني من فرط التخصيص (Overfitting) لبيانات التدريب.'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 2 — DO NOT SELECT (Underfitting)',
          labelAr: 'الخيار 2 — لا تختره (نقص التخصيص Underfitting)',
          text: 'The Supervised ML Classification model has too few features to learn from',
          textAr: 'الترجمة: النموذج لديه عدد قليل جداً من الميزات للتعلم منها (خطأ: هذا يؤدي لضعف الأداء في التدريب والاختبار معاً).'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 3 — DO NOT SELECT (Unsupervised Learning)',
          labelAr: 'الخيار 3 — لا تختره (التعلم غير الخاضع للإشراف)',
          text: 'The Supervised ML Classification model does not require labeled data',
          textAr: 'الترجمة: نموذج التصنيف الخاضع للإشراف لا يتطلب بيانات مُعنونة (خطأ).'
        },
        {
          status: 'wrong',
          labelEn: 'OPTION 4 — DO NOT SELECT (Feature Scaling)',
          labelAr: 'الخيار 4 — لا تختره (تحجيم الميزات)',
          text: 'The Supervised ML Classification model is automatically scaling features incorrectly',
          textAr: 'الترجمة: يقوم النموذج تلقائياً بتحجيم الميزات بشكل غير صحيح (خطأ).'
        }
      ],
      arabicExplanation: 'الشرح العلمي للسؤال الخامس (نقطة واحدة): الخيار الأول "The Supervised ML Classification model is overfitting the training data" هو الإجابة الصحيحة الحاسمة؛ فالأداء الممتاز على بيانات التدريب (مثل 100% في شجرة القرار غير المقلمة في مشروعنا) مع الأداء الضعيف على بيانات الاختبار (81.2%) هو التعريف القياسي لفرط التخصيص (Overfitting).',
      englishExplanation: 'Scientific Rationale (Question 5 · 1 Pt): Select Choice 1 — "The Supervised ML Classification model is overfitting the training data". High training accuracy paired with poor test accuracy is the classic signature of overfitting (high variance).',
      teleprompterText: 'The Supervised ML Classification model is overfitting the training data'
    }
  };

  class MarkExamCompanion {
    constructor() {
      this.activeQuestionKey = 'q2';
      this.renderAllQuestionsGrid();
      this.bindEvents();
      this.renderQuestion('q2');
    }

    renderAllQuestionsGrid() {
      const gridEl = document.getElementById('examAllQuestionsGrid');
      if (!gridEl) return;

      const ar = isArabic();
      const qKeys = ['q2', 'q3', 'q4', 'q5'];

      gridEl.innerHTML = qKeys.map(k => {
        const q = EXAM_QUESTIONS_DATA[k];
        const isActive = k === this.activeQuestionKey;
        const choicesHtml = q.optionsList.map((opt, idx) => {
          const isCorr = opt.status === 'correct';
          const cls = isCorr ? 'choice-correct' : 'choice-wrong';
          const icon = isCorr ? '✅' : '❌';
          const badge = isCorr
            ? (ar ? 'اختر هذا الخيار (صحيح)' : 'SELECT THIS (CORRECT)')
            : (ar ? 'لا تختره (خاطئ)' : 'DO NOT SELECT');
          return `
            <div class="exam-choice-item ${cls}">
              <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.68rem;margin-bottom:0.15rem;color:${isCorr ? 'var(--accent-emerald)' : 'var(--accent-vermilion)'};font-weight:700;">
                <span>${icon} ${ar ? `الخيار ${idx + 1}` : `CHOICE ${idx + 1}`}</span>
                <span>${badge}</span>
              </div>
              <div style="color:var(--ink-primary);direction:ltr;text-align:left;font-family:var(--font-sans);">"${opt.text}"</div>
              ${ar ? `<div style="font-size:0.73rem;color:var(--ink-secondary);margin-top:0.2rem;">${opt.textAr}</div>` : ''}
            </div>
          `;
        }).join('');

        return `
          <div class="exam-q-card-full ${isActive ? 'active-q-card' : ''}" data-qcard-key="${k}" style="cursor:pointer;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;border-bottom:1px solid var(--rule-hairline);padding-bottom:0.55rem;margin-bottom:0.65rem;">
                <span style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;color:var(--accent-cobalt);">
                  ${ar ? q.codeAr : q.code}
                </span>
                <span style="font-family:var(--font-mono);font-size:0.68rem;padding:0.15rem 0.45rem;background:var(--accent-emerald-soft);color:var(--accent-emerald);font-weight:700;">
                  ${ar ? q.typeAr : q.typeEn}
                </span>
              </div>
              <h4 style="font-size:0.95rem;font-weight:700;color:var(--ink-primary);margin-bottom:0.35rem;direction:ltr;text-align:left;">
                ${q.title}
              </h4>
              ${ar ? `<div style="font-size:0.84rem;color:var(--accent-cobalt);font-weight:600;margin-bottom:0.65rem;">${q.titleAr}</div>` : ''}
              <div style="margin-top:0.55rem;">
                ${choicesHtml}
              </div>
            </div>
            <div style="margin-top:0.65rem;padding-top:0.55rem;border-top:1px solid var(--rule-hairline);display:flex;justify-content:space-between;align-items:center;font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">
              <span>Mark Question ID: #${q.markId}</span>
              <span style="color:var(--accent-cobalt);font-weight:700;">
                ${ar ? '⌨ انقر لتحميل السؤال في مدرب الكتابة ↓' : '⌨ Click to load in Teleprompter ↓'}
              </span>
            </div>
          </div>
        `;
      }).join('');

      gridEl.querySelectorAll('.exam-q-card-full').forEach(card => {
        card.addEventListener('click', () => {
          const qKey = card.dataset.qcardKey;
          document.querySelectorAll('.exam-q-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.qkey === qKey);
          });
          this.renderQuestion(qKey);
          this.renderAllQuestionsGrid();
        });
      });
    }

    bindEvents() {
      document.querySelectorAll('.exam-q-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const qKey = tab.dataset.qkey;
          document.querySelectorAll('.exam-q-tab').forEach(t => t.classList.toggle('active', t === tab));
          this.renderQuestion(qKey);
          this.renderAllQuestionsGrid();
        });
      });

      const inputEl = document.getElementById('teleprompterInput');
      if (inputEl) {
        inputEl.addEventListener('input', () => {
          this.evaluateTypingProgress(inputEl.value);
        });
      }

      const resetBtn = document.getElementById('resetTeleprompterBtn');
      if (resetBtn && inputEl) {
        resetBtn.addEventListener('click', () => {
          inputEl.value = '';
          this.startTime = null;
          this.evaluateTypingProgress('');
          inputEl.focus();
        });
      }

      const fillBtn = document.getElementById('autoFillDemoBtn');
      if (fillBtn && inputEl) {
        fillBtn.addEventListener('click', () => {
          const q = EXAM_QUESTIONS_DATA[this.activeQuestionKey];
          inputEl.value = q.teleprompterText;
          this.evaluateTypingProgress(inputEl.value);
        });
      }
    }

    renderQuestion(qKey) {
      const q = EXAM_QUESTIONS_DATA[qKey];
      if (!q) return;
      this.activeQuestionKey = qKey;
      this.startTime = null;

      const ar = isArabic();
      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setTxt('examQCode', ar ? q.codeAr : q.code);
      setTxt('examQTitle', ar ? `${q.titleAr} — (${q.title})` : q.title);
      setTxt('examQPrompt', ar ? q.promptAr : q.prompt);
      setTxt('examQArabic', ar ? q.arabicExplanation : `${q.englishExplanation} — ${q.arabicExplanation}`);

      const optionsBox = document.getElementById('examQOptionsList');
      if (optionsBox && q.optionsList) {
        optionsBox.innerHTML = q.optionsList.map(opt => {
          const isCorrect = opt.status === 'correct';
          const borderCol = isCorrect ? 'var(--accent-emerald)' : 'var(--rule-hairline)';
          const bgCol = isCorrect ? 'var(--accent-emerald-soft)' : 'var(--bg-paper)';
          const badgeCol = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-vermilion)';
          const icon = isCorrect ? '✓' : '✗';
          return `
            <div style="padding:0.7rem 0.9rem;margin-bottom:0.5rem;border:1px solid ${borderCol};border-inline-start:4px solid ${badgeCol};background:${bgCol};font-size:0.83rem;">
              <div style="font-family:var(--font-mono);font-size:0.71rem;font-weight:700;color:${badgeCol};margin-bottom:0.2rem;">
                ${icon} ${ar ? opt.labelAr : opt.labelEn}
              </div>
              <div style="color:var(--ink-primary);font-weight:${isCorrect ? '700' : '400'};direction:ltr;text-align:left;">
                "${opt.text}"
              </div>
              <div style="font-size:0.76rem;color:var(--ink-secondary);margin-top:0.2rem;">
                ${opt.textAr}
              </div>
            </div>
          `;
        }).join('');
      }

      const inputEl = document.getElementById('teleprompterInput');
      if (inputEl) {
        inputEl.value = '';
      }
      this.evaluateTypingProgress('');
    }

    evaluateTypingProgress(typedText) {
      const q = EXAM_QUESTIONS_DATA[this.activeQuestionKey];
      if (!q) return;

      const target = q.teleprompterText;
      const targetBox = document.getElementById('teleprompterTargetBox');
      if (!targetBox) return;

      if (typedText.length === 1 && !this.startTime) {
        this.startTime = performance.now();
      }

      let correctCount = 0;
      let html = '';

      for (let i = 0; i < target.length; i++) {
        const targetChar = target[i];
        const safeChar = targetChar === '<' ? '&lt;' : (targetChar === '>' ? '&gt;' : targetChar);

        if (i < typedText.length) {
          if (typedText[i] === targetChar) {
            correctCount++;
            html += `<span class="char-correct">${safeChar}</span>`;
          } else {
            html += `<span class="char-error">${safeChar}</span>`;
          }
        } else if (i === typedText.length) {
          html += `<span class="char-current">${safeChar}</span>`;
        } else {
          html += `<span>${safeChar}</span>`;
        }
      }

      targetBox.innerHTML = html;

      const progressPct = Math.min(100, Math.round((typedText.length / target.length) * 100));
      const accuracyPct = typedText.length > 0 ? Math.round((correctCount / typedText.length) * 100) : 100;

      let wpm = 0;
      if (this.startTime && typedText.length > 3) {
        const elapsedMinutes = Math.max(0.05, (performance.now() - this.startTime) / 60000);
        wpm = Math.round((typedText.length / 5) / elapsedMinutes);
      }

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setTxt('tpProgressStat', `${progressPct}% (${typedText.length}/${target.length})`);
      setTxt('tpAccuracyStat', `${accuracyPct}%`);
      setTxt('tpWpmStat', `${wpm} WPM`);
    }

    refreshLanguage() {
      this.renderAllQuestionsGrid();
      this.renderQuestion(this.activeQuestionKey);
    }
  }

  window.EXAM_QUESTIONS_DATA = EXAM_QUESTIONS_DATA;

  window.addEventListener('DOMContentLoaded', () => {
    window.markExamCompanion = new MarkExamCompanion();
  });
})();
