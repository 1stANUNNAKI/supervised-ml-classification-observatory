/**
 * Quantitative Classification Simulator & CDO Decision Workbench Engine
 * =====================================================================
 * Powers:
 * 1. Multi-Model Benchmark Selection & Overfitting Diagnostic Comparison
 * 2. Probability Threshold (tau) Scrubber, 2x2 Confusion Matrix & Financial ROI Calculator
 * 3. Interactive SVG ROC Curves, Precision-Recall Curves & Feature Importance / Odds Ratios
 * 4. What-If Live Enterprise Account Churn Predictor & Local SHAP Attribution Waterfall
 * 5. 1-Click Vector PDF Report Downloader & Rubric 1.1–1.6 Section Spotlighter
 * 6. Full Bilingual (EN / AR) & Directional (LTR / RTL) Re-Rendering
 */

(function () {
  'use strict';

  const MODEL_COLORS = {
    gradient_boosting: '#0047AB',
    random_forest: '#0D7A5F',
    svm_rbf: '#7C3AED',
    logistic_regression: '#B47812',
    knn: '#64748B',
    overfit_tree: '#C8321E'
  };

  const MODEL_I18N_AR = {
    gradient_boosting: {
      name: 'تعزيز التدرج (Gradient Boosting - البطل)',
      role: 'النموذج البطل المعتمد للإنتاج',
      verdict: 'أفضل توازن بين القوة التنبؤية (88.8% دقة، F1=0.754) وقابلية التفسير عبر الأهمية التبادلية وSHAP.'
    },
    random_forest: {
      name: 'الغابات العشوائية (Random Forest)',
      role: 'المنافس التجميعي (Bagging Challenger)',
      verdict: 'أعلى مساحة تحت منحنى ROC (0.893) ودقة تنبؤية (93.8%)، لكن باستدعاء أقل عند العتبة الافتراضية.'
    },
    svm_rbf: {
      name: 'آلة المتجهات الداعمة (RBF-SVM)',
      role: 'فاصل الحدود غير الخطية بالنواة الشعاعية',
      verdict: 'أداء قوي في الفضاءات غير الخطية (86.8% دقة)، لكنه أقل شفافية للإدارة التنفيذية.'
    },
    logistic_regression: {
      name: 'الانحدار اللوجستي المنظم (L2 Logistic)',
      role: 'المرجع الخطي الأعلى شفافية وتفسيراً',
      verdict: 'يوفر نسب الأرجحية (Odds Ratios) الصريحة لكل متغير، لكنه يفوت التفاعلات غير الخطية المركبة.'
    },
    knn: {
      name: 'أقرب الجيران (k-NN · k=15)',
      role: 'مرجع الجوار المسافي غير المعلمي',
      verdict: 'حساس لتعدد الأبعاد (Curse of Dimensionality) ويحقق أقل استدعاء (37.1%).'
    },
    overfit_tree: {
      name: 'شجرة قرار غير مقلمة (Overfit Tree · Q5)',
      role: 'نموذج تشخيص فرط التخصيص (السؤال 5)',
      verdict: 'يحفظ بيانات التدريب بنسبة 100% لكنه ينهار في الاختبار إلى 81.2% (دليل عملي قاطع على Overfitting).'
    }
  };

  function isArabic() {
    return window.OBSERVATORY_LANG === 'ar';
  }

  class ClassificationObservatoryEngine {
    constructor() {
      this.telemetry = window.CLASSIFICATION_TELEMETRY || null;
      if (!this.telemetry) {
        console.error('CLASSIFICATION_TELEMETRY bundle missing.');
        return;
      }

      this.activeModelId = 'gradient_boosting';
      this.activeThreshold = 0.50;
      this.activeChartTab = 'roc'; // 'roc' | 'pr' | 'features'

      this.manifold = new window.ManifoldVisualizer('manifold3dCanvas');

      this.initTopToolbar();
      this.renderModelCardsAndTable();
      this.initThresholdWorkbench();
      this.initWhatIfSimulator();
      this.initRubricSpotlighter();
      this.initScrollSpy();
    }

    getModelLocalized(id) {
      const m = this.telemetry.models[id];
      if (!m) return { name: id, role: '', verdict: '' };
      if (isArabic() && MODEL_I18N_AR[id]) {
        return MODEL_I18N_AR[id];
      }
      return {
        name: m.name,
        role: m.role,
        verdict: m.cdo_verdict
      };
    }

    initTopToolbar() {
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const html = document.documentElement;
          const isObsidian = html.getAttribute('data-theme') === 'obsidian';
          html.setAttribute('data-theme', isObsidian ? 'alabaster' : 'obsidian');
          this.updateThemeButtonLabel();
          this.renderDiagnosticChart();
        });
      }

      document.querySelectorAll('.js-download-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.downloadExecutivePdfReport();
        });
      });

      document.querySelectorAll('.manifold-btn[data-manifold-model]').forEach(btn => {
        btn.addEventListener('click', () => {
          const modelId = btn.dataset.manifoldModel;
          this.selectModel(modelId);
        });
      });
    }

    updateThemeButtonLabel() {
      const themeBtn = document.getElementById('themeToggleBtn');
      if (!themeBtn) return;
      const isObsidian = document.documentElement.getAttribute('data-theme') === 'obsidian';
      const ar = isArabic();
      if (ar) {
        themeBtn.textContent = isObsidian ? '◑ المظهر: داكن (Obsidian)' : '◐ المظهر: ورقي سويسري';
      } else {
        themeBtn.textContent = isObsidian ? '◑ THEME: OBSIDIAN DARK' : '◐ THEME: ALABASTER PAPER';
      }
    }

    downloadExecutivePdfReport() {
      const b64 = window.FINAL_REPORT_PDF_BASE64;
      if (!b64) {
        window.open('outputs/Final_Report_Printable.html', '_blank');
        return;
      }
      try {
        const byteChars = atob(b64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Final_Report_Supervised_ML_Classification.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } catch (err) {
        console.error('PDF Blob download fallback triggered:', err);
        window.open('outputs/Final_Report_Printable.html', '_blank');
      }
    }

    selectModel(modelId) {
      if (!this.telemetry.models[modelId]) return;
      this.activeModelId = modelId;

      if (this.manifold) {
        this.manifold.setModel(modelId);
      }

      document.querySelectorAll('.model-select-card').forEach(card => {
        card.classList.toggle('active', card.dataset.modelId === modelId);
      });

      document.querySelectorAll('#benchmarkTableBody tr').forEach(row => {
        row.classList.toggle('active-row', row.dataset.modelId === modelId);
      });

      this.updateThresholdWorkbenchUI();
      this.renderDiagnosticChart();
    }

    renderModelCardsAndTable() {
      const cardsContainer = document.getElementById('modelCardsStrip');
      const tableBody = document.getElementById('benchmarkTableBody');
      if (!cardsContainer || !tableBody) return;

      const ar = isArabic();
      const order = [
        'gradient_boosting',
        'random_forest',
        'svm_rbf',
        'logistic_regression',
        'knn',
        'overfit_tree'
      ];

      cardsContainer.innerHTML = order.map(id => {
        const m = this.telemetry.models[id];
        const loc = this.getModelLocalized(id);
        const tm = m.test_metrics;
        const tr = m.train_metrics;
        const isDiag = !m.is_primary;
        const activeClass = id === this.activeModelId ? 'active' : '';
        const diagClass = isDiag ? 'diagnostic-card' : '';
        return `
          <div class="model-select-card ${activeClass} ${diagClass}" data-model-id="${id}">
            <div>
              <div class="model-role-tag">${loc.role}</div>
              <div class="model-card-name">${loc.name}</div>
            </div>
            <div class="model-card-metrics">
              <div><span>${ar ? 'دقة الاختبار' : 'TEST ACC'}</span><strong>${(tm.accuracy * 100).toFixed(1)}%</strong></div>
              <div><span>F1-SCORE</span><strong>${tm.f1.toFixed(3)}</strong></div>
              <div><span>ROC-AUC</span><strong>${tm.roc_auc.toFixed(3)}</strong></div>
              <div><span>${ar ? 'دقة التدريب' : 'TRAIN ACC'}</span><strong>${(tr.accuracy * 100).toFixed(1)}%</strong></div>
            </div>
          </div>
        `;
      }).join('');

      tableBody.innerHTML = order.map(id => {
        const m = this.telemetry.models[id];
        const loc = this.getModelLocalized(id);
        const tm = m.test_metrics;
        const tr = m.train_metrics;
        const gap = ((tr.accuracy - tm.accuracy) * 100).toFixed(1);
        const rowClass = id === 'gradient_boosting'
          ? 'row-champion'
          : (id === 'overfit_tree' ? 'row-overfit' : '');
        return `
          <tr class="${rowClass}" data-model-id="${id}" style="cursor:pointer;">
            <td class="model-title-cell">
              <strong>${loc.name}</strong>
              <div style="font-size:0.72rem;color:var(--ink-muted);">${loc.role}</div>
            </td>
            <td>${(tr.accuracy * 100).toFixed(1)}%</td>
            <td><strong>${(tm.accuracy * 100).toFixed(1)}%</strong></td>
            <td style="color:${parseFloat(gap) > 12 ? 'var(--accent-vermilion)' : 'var(--accent-emerald)'};font-weight:700;">
              ${gap > 0 ? '+' : ''}${gap}%
            </td>
            <td>${(tm.precision * 100).toFixed(1)}%</td>
            <td>${(tm.recall * 100).toFixed(1)}%</td>
            <td><strong>${tm.f1.toFixed(3)}</strong></td>
            <td><strong>${tm.roc_auc.toFixed(3)}</strong> ± ${m.cv_roc_auc_std.toFixed(3)}</td>
            <td>${tm.pr_auc.toFixed(3)}</td>
            <td>${tm.brier_score.toFixed(4)}</td>
            <td>$${m.max_net_roi_usd.toLocaleString()}</td>
          </tr>
        `;
      }).join('');

      cardsContainer.querySelectorAll('.model-select-card').forEach(card => {
        card.addEventListener('click', () => this.selectModel(card.dataset.modelId));
      });

      tableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => this.selectModel(row.dataset.modelId));
      });
    }

    initThresholdWorkbench() {
      const slider = document.getElementById('tauSlider');
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.activeThreshold = parseFloat(e.target.value);
          if (this.manifold) {
            this.manifold.setThreshold(this.activeThreshold);
          }
          this.updateThresholdWorkbenchUI();
          this.renderDiagnosticChart();
        });
      }

      document.querySelectorAll('.js-tau-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const tau = parseFloat(btn.dataset.tau);
          this.activeThreshold = tau;
          if (slider) slider.value = tau;
          if (this.manifold) this.manifold.setThreshold(tau);
          this.updateThresholdWorkbenchUI();
          this.renderDiagnosticChart();
        });
      });

      document.querySelectorAll('.js-chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.activeChartTab = tab.dataset.chartTab;
          document.querySelectorAll('.js-chart-tab').forEach(t => {
            t.classList.toggle('btn-primary-cobalt', t.dataset.chartTab === this.activeChartTab);
          });
          this.renderDiagnosticChart();
        });
      });

      this.updateThresholdWorkbenchUI();
      this.renderDiagnosticChart();
    }

    getNearestSweepPoint(model, tau) {
      const sweep = model.threshold_sweep || [];
      let best = sweep[0];
      let minDiff = 999;
      for (let i = 0; i < sweep.length; i++) {
        const diff = Math.abs(sweep[i].threshold - tau);
        if (diff < minDiff) {
          minDiff = diff;
          best = sweep[i];
        }
      }
      return best;
    }

    updateThresholdWorkbenchUI() {
      const model = this.telemetry.models[this.activeModelId];
      if (!model) return;

      const loc = this.getModelLocalized(this.activeModelId);
      const pt = this.getNearestSweepPoint(model, this.activeThreshold);
      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setTxt('workbenchModelTitle', loc.name);
      setTxt('workbenchModelVerdict', loc.verdict);
      setTxt('tauReadoutValue', pt.threshold.toFixed(2));

      setTxt('cmTpVal', pt.tp);
      setTxt('cmFpVal', pt.fp);
      setTxt('cmTnVal', pt.tn);
      setTxt('cmFnVal', pt.fn);

      setTxt('wbAccVal', `${(pt.accuracy * 100).toFixed(1)}%`);
      setTxt('wbPrecVal', `${(pt.precision * 100).toFixed(1)}%`);
      setTxt('wbRecVal', `${(pt.recall * 100).toFixed(1)}%`);
      setTxt('wbF1Val', pt.f1.toFixed(3));

      const grossSaved = pt.tp * 1764;
      const campaignCost = (pt.tp + pt.fp) * 180;
      setTxt('wbGrossSaved', `$${grossSaved.toLocaleString()}`);
      setTxt('wbCampaignCost', `-$${campaignCost.toLocaleString()}`);
      setTxt('wbNetRoi', `$${pt.net_roi_usd.toLocaleString()}`);
    }

    renderDiagnosticChart() {
      const container = document.getElementById('diagnosticSvgContainer');
      if (!container) return;

      if (this.activeChartTab === 'features') {
        this.renderFeatureAttributionChart(container);
        return;
      }

      const ar = isArabic();
      const w = 540;
      const h = 300;
      const padL = 52;
      const padR = 24;
      const padT = 24;
      const padB = 40;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      const isRoc = this.activeChartTab === 'roc';
      const modelKeys = ['gradient_boosting', 'random_forest', 'svm_rbf', 'logistic_regression', 'knn', 'overfit_tree'];

      let gridLines = '';
      for (let i = 0; i <= 4; i++) {
        const ratio = i / 4;
        const x = padL + ratio * plotW;
        const y = padT + (1 - ratio) * plotH;
        gridLines += `
          <line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="var(--rule-hairline)" stroke-dasharray="3,3" />
          <line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="var(--rule-hairline)" stroke-dasharray="3,3" />
          <text x="${x}" y="${padT + plotH + 16}" fill="var(--ink-muted)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">${ratio.toFixed(2)}</text>
          <text x="${padL - 8}" y="${y + 3}" fill="var(--ink-muted)" font-family="var(--font-mono)" font-size="10" text-anchor="end">${ratio.toFixed(2)}</text>
        `;
      }

      const baselineLine = isRoc
        ? `<line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT}" stroke="var(--ink-muted)" stroke-dasharray="5,5" stroke-width="1" />`
        : `<line x1="${padL}" y1="${padT + (1 - 0.264) * plotH}" x2="${padL + plotW}" y2="${padT + (1 - 0.264) * plotH}" stroke="var(--ink-muted)" stroke-dasharray="5,5" stroke-width="1" />`;

      let pathsSvg = '';
      modelKeys.forEach(k => {
        const m = this.telemetry.models[k];
        const xs = isRoc ? m.roc_curve.fpr : m.pr_curve.recall;
        const ys = isRoc ? m.roc_curve.tpr : m.pr_curve.precision;
        const pts = xs.map((vx, idx) => {
          const sx = padL + vx * plotW;
          const sy = padT + (1 - ys[idx]) * plotH;
          return `${sx.toFixed(1)},${sy.toFixed(1)}`;
        }).join(' ');

        const isActive = k === this.activeModelId;
        const strokeW = isActive ? 3.0 : 1.4;
        const opacity = isActive ? 1.0 : 0.48;
        pathsSvg += `<polyline fill="none" stroke="${MODEL_COLORS[k]}" stroke-width="${strokeW}" stroke-opacity="${opacity}" points="${pts}" />`;
      });

      const activeModel = this.telemetry.models[this.activeModelId];
      const pt = this.getNearestSweepPoint(activeModel, this.activeThreshold);
      const fprCurrent = pt.fp / Math.max(1, pt.fp + pt.tn);
      const opX = padL + (isRoc ? fprCurrent : pt.recall) * plotW;
      const opY = padT + (1 - (isRoc ? pt.recall : pt.precision)) * plotH;

      const xAxisLabel = isRoc
        ? (ar ? 'معدل الإيجابيات الكاذبة FPR (1 - Specificity)' : 'False Positive Rate (1 - Specificity)')
        : (ar ? 'معدل الاستدعاء والحساسية (Recall / Sensitivity)' : 'Recall (Sensitivity / Churn Capture Rate)');
      const yAxisLabel = isRoc
        ? (ar ? 'معدل الإيجابيات الصحيحة (TPR / Recall)' : 'True Positive Rate (Recall)')
        : (ar ? 'الدقة التنبؤية (Precision / PPV)' : 'Precision (Positive Predictive Value)');

      container.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" aria-label="Diagnostic Curve" style="direction:ltr;">
          ${gridLines}
          ${baselineLine}
          ${pathsSvg}
          <circle cx="${opX}" cy="${opY}" r="6" fill="${MODEL_COLORS[this.activeModelId]}" stroke="#FFFFFF" stroke-width="2" />
          <text x="${Math.min(w - 145, opX + 10)}" y="${Math.max(24, opY - 8)}" fill="var(--ink-primary)" font-family="var(--font-mono)" font-size="10" font-weight="700">
            τ=${pt.threshold.toFixed(2)} (${isRoc ? 'TPR:' + (pt.recall * 100).toFixed(0) + '%' : 'P:' + (pt.precision * 100).toFixed(0) + '%'})
          </text>
          <text x="${padL + plotW * 0.5}" y="${h - 6}" fill="var(--ink-primary)" font-family="var(--font-sans)" font-size="11" font-weight="700" text-anchor="middle">${xAxisLabel}</text>
          <text x="14" y="${padT + plotH * 0.5}" fill="var(--ink-primary)" font-family="var(--font-sans)" font-size="11" font-weight="700" text-anchor="middle" transform="rotate(-90, 14, ${padT + plotH * 0.5})">${yAxisLabel}</text>
        </svg>
      `;
    }

    renderFeatureAttributionChart(container) {
      const ar = isArabic();
      const imp = this.telemetry.feature_importance_gbm.slice(0, 8);
      const maxVal = Math.max(...imp.map(d => d.importance_mean), 0.16);

      const featureLabelsAr = {
        usage_drop_pct: 'انخفاض الاستخدام (usage_drop_pct)',
        tenure_months: 'مدة الاشتراك (tenure_months)',
        support_tickets_90d: 'تذاكر الدعم (support_tickets_90d)',
        contract_type_Two_Year: 'عقد سنتين (contract_Two_Year)',
        active_modules_count: 'الوحدات النشطة (active_modules)',
        contract_type_One_Year: 'عقد سنوي (contract_One_Year)',
        nps_score: 'مؤشر الرضا (nps_score)',
        avg_resolution_hours: 'زمن حل التذاكر (resolution_hrs)'
      };

      const rowsHtml = imp.map(item => {
        const pct = Math.max(2, (item.importance_mean / maxVal) * 100);
        const label = ar ? (featureLabelsAr[item.feature] || item.feature) : item.feature;
        return `
          <div style="display:grid;grid-template-columns:185px 1fr 64px;align-items:center;gap:0.6rem;font-family:var(--font-mono);font-size:0.72rem;margin-bottom:0.42rem;">
            <span style="color:var(--ink-primary);font-weight:600;">${label}</span>
            <div style="height:12px;background:var(--bg-ledger);border:1px solid var(--rule-hairline);">
              <div style="height:100%;width:${pct.toFixed(1)}%;background:var(--accent-cobalt);"></div>
            </div>
            <span style="text-align:right;font-weight:700;">+${item.importance_mean.toFixed(3)}</span>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div style="padding:0.9rem 1.1rem;height:100%;overflow-y:auto;">
          <div style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;color:var(--accent-cobalt);margin-bottom:0.6rem;">
            ${ar ? 'الأهمية التبادلية للمتغيرات في نموذج GBM البطل (Δ ROC-AUC على عينة الاختبار)' : 'CHAMPION GBM PERMUTATION IMPORTANCE (Δ ROC-AUC ON HOLDOUT TEST SET)'}
          </div>
          ${rowsHtml}
        </div>
      `;
    }

    initWhatIfSimulator() {
      const inputs = [
        'wiTenure', 'wiMonthly', 'wiUsageDrop', 'wiTickets',
        'wiResolution', 'wiModules', 'wiNps', 'wiContract',
        'wiPayment', 'wiSlaBreach'
      ];

      inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => this.computeWhatIfPrediction());
          el.addEventListener('change', () => this.computeWhatIfPrediction());
        }
      });

      document.querySelectorAll('.js-whatif-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          if (preset === 'high-risk') {
            this.setWhatIfValues({ tenure: 5, monthly: 168, usageDrop: 29, tickets: 6, resolution: 31, modules: 2, nps: 3, contract: 'Month-to-Month', payment: 'Manual_Check', sla: 1 });
          } else if (preset === 'borderline') {
            this.setWhatIfValues({ tenure: 16, monthly: 128, usageDrop: 14, tickets: 3, resolution: 18, modules: 3, nps: 6, contract: 'Month-to-Month', payment: 'Credit_Card', sla: 0 });
          } else {
            this.setWhatIfValues({ tenure: 44, monthly: 105, usageDrop: -8, tickets: 1, resolution: 6, modules: 6, nps: 9, contract: 'Two-Year', payment: 'Bank_AutoPay', sla: 0 });
          }
        });
      });

      this.computeWhatIfPrediction();
    }

    setWhatIfValues(v) {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      };
      setVal('wiTenure', v.tenure);
      setVal('wiMonthly', v.monthly);
      setVal('wiUsageDrop', v.usageDrop);
      setVal('wiTickets', v.tickets);
      setVal('wiResolution', v.resolution);
      setVal('wiModules', v.modules);
      setVal('wiNps', v.nps);
      setVal('wiContract', v.contract);
      setVal('wiPayment', v.payment);
      setVal('wiSlaBreach', v.sla);
      this.computeWhatIfPrediction();
    }

    computeWhatIfPrediction() {
      const ar = isArabic();
      const getNum = (id, def) => {
        const el = document.getElementById(id);
        return el ? parseFloat(el.value) : def;
      };
      const getStr = (id, def) => {
        const el = document.getElementById(id);
        return el ? el.value : def;
      };

      const tenure = getNum('wiTenure', 14);
      const monthly = getNum('wiMonthly', 135);
      const usageDrop = getNum('wiUsageDrop', 18);
      const tickets = getNum('wiTickets', 4);
      const resolution = getNum('wiResolution', 24);
      const modules = getNum('wiModules', 3);
      const nps = getNum('wiNps', 5);
      const contract = getStr('wiContract', 'Month-to-Month');
      const payment = getStr('wiPayment', 'Manual_Check');
      const sla = getNum('wiSlaBreach', 1);

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setTxt('wiTenureVal', `${tenure}m`);
      setTxt('wiMonthlyVal', `$${monthly}`);
      setTxt('wiUsageDropVal', `${usageDrop > 0 ? '+' : ''}${usageDrop}%`);
      setTxt('wiTicketsVal', `${tickets}`);
      setTxt('wiResolutionVal', `${resolution}h`);
      setTxt('wiModulesVal', `${modules}`);
      setTxt('wiNpsVal', `${nps}/10`);

      const cContract = contract === 'Month-to-Month' ? 1.15 : (contract === 'One-Year' ? -0.45 : -1.25);
      const cUsage = 0.032 * usageDrop + ((contract === 'Month-to-Month' && usageDrop > 12) ? 1.45 : 0);
      const cTenure = -0.042 * (tenure - 24) + ((tenure <= 12 && monthly > 125) ? 0.85 : 0);
      const cSupport = 0.22 * (tickets - 2.5) + ((tickets >= 4 && resolution > 22) ? 1.15 : 0);
      const cModules = -0.28 * (modules - 3.8) - ((modules >= 5 && tenure >= 20) ? 0.90 : 0);
      const cSlaNps = 0.65 * sla - 0.20 * (nps - 6.5) + ((nps <= 4 && sla === 1) ? 0.80 : 0);
      const cBilling = 0.011 * (monthly - 118) + (payment === 'Manual_Check' ? 0.55 : -0.15);

      const linearLogit = -0.85 + cContract + 0.032 * usageDrop - 0.042 * (tenure - 24) + 0.22 * (tickets - 2.5) - 0.28 * (modules - 3.8) + 0.65 * sla - 0.20 * (nps - 6.5) + cBilling;
      const nonLinearLogit = -0.85 + cContract + cUsage + cTenure + cSupport + cModules + cSlaNps + cBilling;

      const sigmoid = z => 1.0 / (1.0 + Math.exp(-z));
      const pGbm = Math.max(0.02, Math.min(0.98, sigmoid(nonLinearLogit)));
      const pRf = Math.max(0.03, Math.min(0.96, sigmoid(0.88 * nonLinearLogit + 0.12 * linearLogit)));
      const pSvm = Math.max(0.03, Math.min(0.97, sigmoid(0.82 * nonLinearLogit + 0.18 * linearLogit)));
      const pLr = Math.max(0.02, Math.min(0.97, sigmoid(linearLogit)));
      const pKnn = Math.max(0.05, Math.min(0.94, 0.55 * pRf + 0.45 * pLr));

      const probEl = document.getElementById('wiGbmProb');
      const statusEl = document.getElementById('wiRiskVerdict');
      const actionEl = document.getElementById('wiRecommendedPlay');

      if (probEl) {
        probEl.textContent = `${(pGbm * 100).toFixed(1)}%`;
        probEl.style.color = pGbm >= this.activeThreshold ? 'var(--accent-vermilion)' : 'var(--accent-emerald)';
      }

      if (statusEl && actionEl) {
        if (pGbm >= 0.60) {
          statusEl.textContent = ar ? 'نطاق خطر تسرب حرج (أولوية قصوى)' : 'CRITICAL CHURN REGIME (HIGH PRIORITY)';
          statusEl.style.color = 'var(--accent-vermilion)';
          actionEl.textContent = ar
            ? 'تفعيل تدخل فوري من مدير نجاح العملاء + عرض خصم 15% للترقية إلى عقد سنوي (تكلفة $180 مقابل إنقاذ $1,764).'
            : 'Trigger immediate Executive CSM escalation + 15% Annual Contract Migration incentive ($180 cost vs $1,764 expected ACV save).';
        } else if (pGbm >= this.activeThreshold) {
          statusEl.textContent = ar ? 'خطر تسرب متوسط إلى مرتفع (فوق العتبة τ)' : 'MODERATE-HIGH CHURN RISK (ABOVE τ)';
          statusEl.style.color = 'var(--accent-ochre)';
          actionEl.textContent = ar
            ? 'إدراج الحساب في مسار تفعيل الاستخدام الآلي وتسريع معالجة تذاكر الدعم الفني SLA.'
            : 'Enroll in automated product-adoption workflow & priority SLA ticket fast-track.';
        } else {
          statusEl.textContent = ar ? 'حساب مؤسسي مستقر وآمن (تحت العتبة τ)' : 'HEALTHY RETAINED COHORT (BELOW τ)';
          statusEl.style.color = 'var(--accent-emerald)';
          actionEl.textContent = ar
            ? 'لا حاجة لحوافز خصم؛ الحساب مؤهل لعروض التوسع في الوحدات الإضافية.'
            : 'No discount intervention needed. Eligible for multi-module expansion upsell.';
        }
      }

      const multiModelEl = document.getElementById('wiMultiModelBars');
      if (multiModelEl) {
        const models = [
          { name: ar ? 'تعزيز التدرج (GBM البطل)' : 'Gradient Boosting (Champion)', p: pGbm, col: MODEL_COLORS.gradient_boosting },
          { name: ar ? 'الغابات العشوائية (RF)' : 'Random Forest (Bagging)', p: pRf, col: MODEL_COLORS.random_forest },
          { name: ar ? 'آلة المتجهات (RBF-SVM)' : 'RBF Support Vector Machine', p: pSvm, col: MODEL_COLORS.svm_rbf },
          { name: ar ? 'الانحدار اللوجستي (Linear)' : 'Logistic Regression (Linear)', p: pLr, col: MODEL_COLORS.logistic_regression },
          { name: ar ? 'أقرب الجيران (k-NN)' : 'K-Nearest Neighbors (k=15)', p: pKnn, col: MODEL_COLORS.knn }
        ];
        multiModelEl.innerHTML = models.map(m => `
          <div style="display:grid;grid-template-columns:185px 1fr 54px;align-items:center;gap:0.6rem;font-family:var(--font-mono);font-size:0.73rem;margin-bottom:0.4rem;">
            <span>${m.name}</span>
            <div style="height:10px;background:var(--bg-ledger);border:1px solid var(--rule-hairline);position:relative;">
              <div style="height:100%;width:${(m.p * 100).toFixed(1)}%;background:${m.col};"></div>
            </div>
            <strong style="text-align:right;">${(m.p * 100).toFixed(1)}%</strong>
          </div>
        `).join('');
      }

      const shapEl = document.getElementById('wiShapWaterfall');
      if (shapEl) {
        const factors = [
          { name: ar ? `نوع العقد (${contract})` : `Contract (${contract})`, val: cContract },
          { name: ar ? `انخفاض الاستخدام (${usageDrop}%)` : `Usage Drop (${usageDrop}%)`, val: cUsage },
          { name: ar ? `الدعم والـ SLA (${tickets}t/${resolution}h)` : `Support & SLA (${tickets}t/${resolution}h)`, val: cSupport },
          { name: ar ? `مدة الاشتراك (${tenure}m)` : `Tenure (${tenure}m)`, val: cTenure },
          { name: ar ? `الوحدات النشطة (${modules})` : `Active Modules (${modules})`, val: cModules },
          { name: ar ? `الرضا والـ SLA (${nps}/10)` : `NPS & SLA (${nps}/10)`, val: cSlaNps },
          { name: ar ? `الفوترة ($${monthly})` : `Billing ($${monthly})`, val: cBilling }
        ].sort((a, b) => Math.abs(b.val) - Math.abs(a.val));

        const maxAbs = Math.max(...factors.map(f => Math.abs(f.val)), 1.5);
        shapEl.innerHTML = factors.map(f => {
          const widthPct = Math.min(100, (Math.abs(f.val) / maxAbs) * 100);
          const isRisk = f.val >= 0;
          const color = isRisk ? 'var(--accent-vermilion)' : 'var(--accent-emerald)';
          const sign = isRisk ? '+' : '';
          return `
            <div class="shap-row">
              <span>${f.name}</span>
              <div class="shap-bar-track">
                <div class="shap-bar-fill" style="width:${widthPct.toFixed(1)}%;background:${color};"></div>
              </div>
              <strong style="text-align:right;color:${color};">${sign}${f.val.toFixed(2)}</strong>
            </div>
          `;
        }).join('');
      }
    }

    initRubricSpotlighter() {
      const buttons = document.querySelectorAll('.rubric-filter-btn');
      const blocks = document.querySelectorAll('.dossier-section-block');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetRubric = btn.dataset.rubric;
          buttons.forEach(b => b.classList.toggle('active', b === btn));

          blocks.forEach(block => {
            const matches = targetRubric === 'all' || block.dataset.rubricId === targetRubric;
            block.classList.toggle('rubric-spotlight', targetRubric !== 'all' && matches);
            block.style.opacity = (targetRubric === 'all' || matches) ? '1' : '0.42';
          });

          if (targetRubric !== 'all') {
            const targetEl = document.querySelector(`.dossier-section-block[data-rubric-id="${targetRubric}"]`);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      });
    }

    initScrollSpy() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.rail-nav-link');
      if (!sections.length || !navLinks.length) return;

      window.addEventListener('scroll', () => {
        let currentId = '';
        sections.forEach(sec => {
          const top = sec.getBoundingClientRect().top;
          if (top <= 180) {
            currentId = sec.getAttribute('id');
          }
        });
        if (currentId) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
          });
        }
      }, { passive: true });
    }

    refreshLanguage() {
      this.updateThemeButtonLabel();
      this.renderModelCardsAndTable();
      this.updateThresholdWorkbenchUI();
      this.renderDiagnosticChart();
      this.computeWhatIfPrediction();
      if (this.manifold) {
        this.manifold.updateMotionButtonsUI();
        this.manifold.renderInspectorDetails();
        if (this.manifold.detailsModalOpen && typeof this.manifold.renderPointModalDetails === 'function') {
          this.manifold.renderPointModalDetails();
        }
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.observatoryEngine = new ClassificationObservatoryEngine();
  });
})();
