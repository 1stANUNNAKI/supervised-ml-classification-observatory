/**
 * 3D Decision Boundary Manifold & Interactive Geometry Inspector
 * ==============================================================
 * Renders the 110 holdout enterprise customer accounts, the 3D classification
 * decision boundary surface (225 interactive quads), the threshold cutoff plane (tau),
 * and the 3D coordinate bounding cube:
 *   X-axis: Customer Tenure (1 to 72 Months)
 *   Z-axis: 30-Day Usage Drop (-40% to +65%)
 *   Y-axis: Predicted Churn Probability P(y=1|x) & Decision Threshold Plane (tau)
 *
 * Key Capabilities:
 * - Zero-drift locked viewport sizing (fixes DPR resize loop & falling manifold)
 * - Unrestricted 360° Camera-Space 3x3 Orthogonal Rotation Matrix (natural mouse drag:
 *   dragging DOWN rotates the front DOWN; dragging UP rotates the front UP; full 360° freedom)
 * - Fullscreen Mode toggle (Native Fullscreen API + CSS viewport lock)
 * - 2-Step Point Inspection:
 *     1) Click ANY point inside the 3D Manifold -> A pulsing Exclamation Mark (!) badge
 *        appears directly anchored to that 3D point.
 *     2) Click the (!) Exclamation Mark badge -> Opens a rich floating Point Telemetry
 *        Modal Card inside the 3D viewport showing ALL details and multi-model scores.
 * - Bilingual English / Arabic rendering support (window.OBSERVATORY_LANG)
 */

(function () {
  'use strict';

  const MODEL_SURFACE_FUNCTIONS = {
    gradient_boosting: function (u, v) {
      const tenureStep = u < -0.25 ? 0.28 : (u > 0.35 ? -0.22 : 0.02);
      const usageStep = v > 0.12 ? 0.36 : (v < -0.15 ? -0.24 : 0.04);
      const interaction = (u < 0.0 && v > 0.1) ? 0.22 : 0.0;
      return clamp01(0.38 + tenureStep + usageStep + interaction + 0.08 * Math.tanh(3.5 * (v - 0.5 * u)));
    },
    random_forest: function (u, v) {
      const s1 = 0.26 * Math.tanh(4.0 * (v - 0.1));
      const s2 = -0.22 * Math.tanh(3.2 * (u + 0.1));
      const pocket = 0.18 * Math.exp(-3.0 * ((u + 0.45) * (u + 0.45) + (v - 0.45) * (v - 0.45)));
      return clamp01(0.42 + s1 + s2 + pocket);
    },
    logistic_regression: function (u, v) {
      const logit = -0.35 - 1.65 * u + 2.15 * v;
      return 1.0 / (1.0 + Math.exp(-logit));
    },
    svm_rbf: function (u, v) {
      const d1 = (u + 0.45) * (u + 0.45) + (v - 0.48) * (v - 0.48);
      const d2 = (u - 0.45) * (u - 0.45) + (v + 0.40) * (v + 0.40);
      const rbf = 0.85 * Math.exp(-1.8 * d1) - 0.45 * Math.exp(-1.6 * d2);
      return clamp01(0.32 + rbf);
    },
    knn: function (u, v) {
      const base = 0.42 - 0.28 * u + 0.35 * v;
      const ripple = 0.11 * Math.sin(5.2 * u) * Math.cos(5.2 * v);
      return clamp01(base + ripple);
    },
    overfit_tree: function (u, v) {
      const base = 0.44 - 0.30 * u + 0.38 * v;
      const noiseSpike = 0.32 * Math.sin(11.5 * u + 2.0 * v) * Math.cos(10.5 * v - 1.5 * u);
      return clamp01(base + noiseSpike);
    }
  };

  const MODEL_SURFACE_EXPLANATIONS = {
    gradient_boosting: {
      en: 'Sequential shallow trees (max_depth=3) create sharp axis-aligned non-linear steps where short tenure (<18m) and positive usage drop (>+12%) interact.',
      ar: 'أشجار التعزيز المتسلسلة (بعمق 3) تشكّل عتبات غير خطية حادة عند تقاطع قصر مدة الاشتراك (<18 شهراً) مع ارتفاع انخفاض الاستخدام (>+12%).'
    },
    random_forest: {
      en: 'Bagged ensemble of 250 trees smooths out individual splits into a stable non-linear probability pocket with low variance.',
      ar: 'تجميع 250 شجرة عشوائية ينعّم الانقسامات الحادة لتكوين جيب احتمالي غير خطي مستقر ومنخفض التباين.'
    },
    logistic_regression: {
      en: 'Generalized linear sigmoid hyperplane: log-odds change monotonically with Tenure (OR=0.45) and Usage Drop (OR=2.14) without interaction bends.',
      ar: 'مستوى انحدار لوجستي خطي رتيب (Sigmoid Hyperplane): تتغير احتمالات التسرب خطياً دون التقاط التفاعلات المركبة.'
    },
    svm_rbf: {
      en: 'Radial Basis Function (RBF) kernel wraps a smooth Gaussian probability dome around the high-risk short-tenure / high-drop cluster.',
      ar: 'نواة دالة الأساس الشعاعي (RBF Kernel) تبني قبة احتمالية ملساء حول عنقود الحسابات ذات الخطر المرتفع.'
    },
    knn: {
      en: 'Local k=15 Euclidean neighborhood averaging produces Voronoi-like local ripples sensitive to nearby sample density.',
      ar: 'متوسط الجيران الأقرب (k=15) ينتج تموجات محلية تعتمد على كثافة النقاط المجاورة في الفضاء الإقليدي.'
    },
    overfit_tree: {
      en: 'SEVERE OVERFITTING (Q5): Unconstrained tree (depth=None) memorizes training noise, creating jagged high-variance spikes that fail on test data (81.2% Acc).',
      ar: 'فرط تخصيص حاد (السؤال 5): شجرة غير مقلمة تحفظ ضوضاء التدريب (100%) وتصنع نتوءات عشوائية حادة تفشل في التعميم على بيانات الاختبار (81.2%).'
    }
  };

  function clamp01(val) {
    return Math.max(0.02, Math.min(0.98, val));
  }

  function isArabic() {
    return window.OBSERVATORY_LANG === 'ar';
  }

  function getPointProbability(pt, modelId) {
    if (modelId === 'gradient_boosting') return pt.p_gbm;
    if (modelId === 'random_forest') return pt.p_rf;
    if (modelId === 'logistic_regression') return pt.p_lr;
    if (modelId === 'svm_rbf') return pt.p_svm;
    if (modelId === 'knn') {
      return clamp01(0.5 * pt.p_rf + 0.5 * pt.p_lr + 0.08 * Math.sin(pt.tenure));
    }
    if (modelId === 'overfit_tree') {
      return pt.actual === 1 ? 0.92 : (pt.usage_drop > 15 ? 0.84 : 0.08);
    }
    return pt.p_gbm;
  }

  function classifyOutcomeColor(actual, prob, tau) {
    const pred = prob >= tau ? 1 : 0;
    const ar = isArabic();
    if (actual === 1 && pred === 1) {
      return {
        hex: '#10B981',
        short: 'TP',
        code: ar ? 'TP (إيجابي صحيح · عميل متسرب تم إنقاذه)' : 'TP (True Positive · Rescued Churner)',
        fin: ar ? '+$1,764 قيمة عقد تم إنقاذها' : '+$1,764 Saved Contract ACV'
      };
    }
    if (actual === 0 && pred === 0) {
      return {
        hex: '#3B82F6',
        short: 'TN',
        code: ar ? 'TN (سلبي صحيح · عميل مستقر آمن)' : 'TN (True Negative · Retained Safe)',
        fin: ar ? '$0 تكلفة تدخل (آمن)' : '$0 Intervention Cost (Safe)'
      };
    }
    if (actual === 0 && pred === 1) {
      return {
        hex: '#F59E0B',
        short: 'FP',
        code: ar ? 'FP (إنذار كاذب · حافز غير ضروري)' : 'FP (False Positive · Extra Incentive)',
        fin: ar ? '-$180 تكلفة حملة استبقاء' : '-$180 Retention Campaign Cost'
      };
    }
    return {
      hex: '#EF4444',
      short: 'FN',
      code: ar ? 'FN (سلبي كاذب · تسرب فائت غير مكتشف)' : 'FN (False Negative · Missed Churner)',
      fin: ar ? '-$1,764 خسارة عقد غير مستردة' : '-$1,764 Unrecovered Contract Loss'
    };
  }

  function pointInQuad(px, py, q) {
    const verts = [q.p00, q.p10, q.p11, q.p01];
    let inside = false;
    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
      const xi = verts[i].sx, yi = verts[i].sy;
      const xj = verts[j].sx, yj = verts[j].sy;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / ((yj - yi) || 1e-7) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * 3x3 Rotation Matrix Utilities for Unrestricted 360° Trackball Orbit
   */
  function createInitialRotationMatrix(yaw, pitch) {
    // First rotate around Y by yaw, then around X by pitch
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cx = Math.cos(pitch), sx = Math.sin(pitch);
    // R = Rx(pitch) * Ry(yaw)
    return [
      [cy, 0, -sy],
      [-sx * sy, cx, -sx * cy],
      [cx * sy, sx, cx * cy]
    ];
  }

  function multiplyMat3(A, B) {
    const out = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        out[r][c] = A[r][0] * B[0][c] + A[r][1] * B[1][c] + A[r][2] * B[2][c];
      }
    }
    return out;
  }

  function orthonormalizeMat3(M) {
    // Gram-Schmidt orthonormalization to keep 3D rotation matrix 100% drift-free
    let r0 = M[0], r1 = M[1];
    const len0 = Math.hypot(r0[0], r0[1], r0[2]) || 1;
    r0 = [r0[0] / len0, r0[1] / len0, r0[2] / len0];

    const dot01 = r0[0] * r1[0] + r0[1] * r1[1] + r0[2] * r1[2];
    r1 = [r1[0] - dot01 * r0[0], r1[1] - dot01 * r0[1], r1[2] - dot01 * r0[2]];
    const len1 = Math.hypot(r1[0], r1[1], r1[2]) || 1;
    r1 = [r1[0] / len1, r1[1] / len1, r1[2] / len1];

    const r2 = [
      r0[1] * r1[2] - r0[2] * r1[1],
      r0[2] * r1[0] - r0[0] * r1[2],
      r0[0] * r1[1] - r0[1] * r1[0]
    ];
    return [r0, r1, r2];
  }

  class ManifoldVisualizer {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      const telemetry = window.CLASSIFICATION_TELEMETRY || {};
      this.points = telemetry.manifold_3d_points || [];
      this.currentModel = 'gradient_boosting';
      this.prevModel = 'gradient_boosting';
      this.currentThreshold = 0.50;
      this.morphProgress = 1.0;

      // Unrestricted 360° 3D Rotation Matrix (Camera-Space Trackball)
      this.rotMatrix = createInitialRotationMatrix(-0.62, 0.42);
      this.zoom = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.autoRotate = true;
      this.rotSpeed = 1.0;
      this.renderMode = 'hybrid'; // 'hybrid' | 'wireframe' | 'nodes'

      // Pointer & Hit-Testing State
      this.isDragging = false;
      this.dragMoved = false;
      this.pointerDownPos = { x: 0, y: 0 };
      this.lastMouse = { x: 0, y: 0 };
      this.mousePos = { x: -999, y: -999 };
      this.pulsePhase = 0;

      // Cached projected elements for interactive click inspection
      this.lastProjectedNodes = [];
      this.lastProjectedQuads = [];
      this.lastThresholdPoly = null;
      this.lastAxisLabels = [];

      // Selected 3D Part & Exclamation Mark (!) State
      this.selectedPart = null;
      this.showExclamationPin = false;
      this.detailsModalOpen = false;
      this.pinnedScreenPos = null;

      this._lastW = 0;
      this._lastH = 0;
      this._lastDpr = 1;

      this.tooltip = document.getElementById('manifoldTooltip');
      this.hudModelLabel = document.getElementById('hudModelName');
      this.hudTauLabel = document.getElementById('hudThresholdVal');
      this.inspectorEl = document.getElementById('manifoldInspectorPanel');
      this.exclBtn = document.getElementById('manifoldExclamationBtn');
      this.exclLabel = document.getElementById('manifoldExclLabel');
      this.detailsModalEl = document.getElementById('manifoldPointDetailsModal');
      this.detailsModalContent = document.getElementById('manifoldPointModalContent');
      this.paneEl = this.canvas.closest('.hero-manifold-pane');

      this.bindInteractionEvents();
      this.bindControlToolbar();
      this.selectDefaultHighlight();
      this.startRenderLoop();
    }

    /**
     * Applies a screen-space (camera-space) rotation so that:
     * - Dragging RIGHT (dYaw > 0) always moves the front surface RIGHT
     * - Dragging DOWN (dy > 0 -> dPitch < 0) always moves the front surface DOWN
     * - Dragging UP (dy < 0 -> dPitch > 0) always moves the front surface UP
     * Works across full 360° in all directions without gimbal lock or wall limits!
     */
    applyScreenSpaceRotation(dYaw, dPitch) {
      const cy = Math.cos(dYaw), sy = Math.sin(dYaw);
      const cx = Math.cos(dPitch), sx = Math.sin(dPitch);

      const Ry = [
        [cy, 0, -sy],
        [0, 1, 0],
        [sy, 0, cy]
      ];
      const Rx = [
        [1, 0, 0],
        [0, cx, -sx],
        [0, sx, cx]
      ];

      const Rdelta = multiplyMat3(Rx, Ry);
      this.rotMatrix = orthonormalizeMat3(multiplyMat3(Rdelta, this.rotMatrix));
    }

    /**
     * Rotates around the object's vertical Y axis for smooth auto-spin
     */
    applyWorldYRotation(angle) {
      const c = Math.cos(angle), s = Math.sin(angle);
      const RyWorld = [
        [c, 0, -s],
        [0, 1, 0],
        [s, 0, c]
      ];
      this.rotMatrix = orthonormalizeMat3(multiplyMat3(this.rotMatrix, RyWorld));
    }

    selectDefaultHighlight() {
      if (this.points && this.points.length > 0) {
        const highRiskIdx = this.points.findIndex(p => p.actual === 1 && p.p_gbm >= 0.72);
        const idx = highRiskIdx >= 0 ? highRiskIdx : 0;
        this.selectedPart = {
          type: 'node',
          index: idx,
          pt: this.points[idx]
        };
        this.showExclamationPin = true;
        this.detailsModalOpen = false;
        this.renderInspectorDetails();
      }
    }

    setModel(modelId) {
      if (!MODEL_SURFACE_FUNCTIONS[modelId]) return;
      this.prevModel = this.currentModel;
      this.currentModel = modelId;
      this.morphProgress = 0.0;
      if (this.hudModelLabel && window.CLASSIFICATION_TELEMETRY) {
        const m = window.CLASSIFICATION_TELEMETRY.models[modelId];
        if (m) this.hudModelLabel.textContent = m.name;
      }
      document.querySelectorAll('.manifold-btn[data-manifold-model]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.manifoldModel === modelId);
      });
      this.renderInspectorDetails();
      if (this.detailsModalOpen) {
        this.renderPointModalDetails();
      }
    }

    setThreshold(tau) {
      this.currentThreshold = parseFloat(tau) || 0.50;
      if (this.hudTauLabel) {
        this.hudTauLabel.textContent = this.currentThreshold.toFixed(2);
      }
      this.renderInspectorDetails();
      if (this.detailsModalOpen) {
        this.renderPointModalDetails();
      }
    }

    bindControlToolbar() {
      const bindClick = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
      };

      // Play / Pause Auto-Spin
      bindClick('manifoldPlayPauseBtn', () => {
        this.autoRotate = !this.autoRotate;
        this.updateMotionButtonsUI();
      });

      // Speed Multiplier
      bindClick('manifoldSpeedBtn', () => {
        if (this.rotSpeed === 1.0) this.rotSpeed = 2.0;
        else if (this.rotSpeed === 2.0) this.rotSpeed = 0.5;
        else this.rotSpeed = 1.0;
        this.updateMotionButtonsUI();
      });

      // Unrestricted 360° Directional Orbit & Tilt Buttons
      bindClick('manifoldRotLeftBtn', () => {
        this.autoRotate = false;
        this.applyScreenSpaceRotation(-0.24, 0);
        this.updateMotionButtonsUI();
      });
      bindClick('manifoldRotRightBtn', () => {
        this.autoRotate = false;
        this.applyScreenSpaceRotation(+0.24, 0);
        this.updateMotionButtonsUI();
      });
      bindClick('manifoldTiltUpBtn', () => {
        this.autoRotate = false;
        // Rotate front face UP
        this.applyScreenSpaceRotation(0, +0.22);
        this.updateMotionButtonsUI();
      });
      bindClick('manifoldTiltDownBtn', () => {
        this.autoRotate = false;
        // Rotate front face DOWN
        this.applyScreenSpaceRotation(0, -0.22);
        this.updateMotionButtonsUI();
      });

      // Zoom In / Out
      bindClick('manifoldZoomInBtn', () => {
        this.zoom = Math.min(2.6, +(this.zoom + 0.18).toFixed(2));
        this.updateMotionButtonsUI();
      });
      bindClick('manifoldZoomOutBtn', () => {
        this.zoom = Math.max(0.5, +(this.zoom - 0.18).toFixed(2));
        this.updateMotionButtonsUI();
      });

      // Reset Camera
      bindClick('manifoldResetBtn', () => {
        this.rotMatrix = createInitialRotationMatrix(-0.62, 0.42);
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.autoRotate = true;
        this.updateMotionButtonsUI();
      });

      // Surface Render Mode
      bindClick('manifoldModeBtn', () => {
        if (this.renderMode === 'hybrid') this.renderMode = 'wireframe';
        else if (this.renderMode === 'wireframe') this.renderMode = 'nodes';
        else this.renderMode = 'hybrid';
        this.updateMotionButtonsUI();
      });

      // Fullscreen Toggle
      bindClick('manifoldFullscreenBtn', () => {
        this.toggleFullscreen();
      });

      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && this.paneEl) {
          this.paneEl.classList.remove('is-fullscreen');
        }
        this.updateMotionButtonsUI();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.detailsModalOpen) {
            this.closePointDetailsModal();
          } else if (this.paneEl && this.paneEl.classList.contains('is-fullscreen')) {
            this.paneEl.classList.remove('is-fullscreen');
            this.updateMotionButtonsUI();
          }
        }
      });

      // Exclamation Mark (!) Button Click -> Opens the Full Point Details Modal!
      if (this.exclBtn) {
        this.exclBtn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
        });
        this.exclBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openPointDetailsModal();
        });
      }

      // Prevent clicks inside the Point Details Modal from propagating to the 3D canvas
      if (this.detailsModalEl) {
        this.detailsModalEl.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
        });
        this.detailsModalEl.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      // Quick-inspect preset chips inside the 3D stage
      document.querySelectorAll('.js-manifold-quick-select').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetType = chip.dataset.inspectType;
          this.selectPresetPart(targetType);
        });
      });

      this.updateMotionButtonsUI();
    }

    openPointDetailsModal() {
      if (!this.selectedPart) return;
      this.detailsModalOpen = true;
      this.renderPointModalDetails();
      if (this.detailsModalEl) {
        this.detailsModalEl.style.display = 'block';
      }
      this.renderInspectorDetails();
    }

    closePointDetailsModal() {
      this.detailsModalOpen = false;
      if (this.detailsModalEl) {
        this.detailsModalEl.style.display = 'none';
      }
    }

    toggleFullscreen() {
      if (!this.paneEl) return;
      const isCurrentlyFs = this.paneEl.classList.contains('is-fullscreen') || document.fullscreenElement === this.paneEl;

      if (!isCurrentlyFs) {
        this.paneEl.classList.add('is-fullscreen');
        if (this.paneEl.requestFullscreen) {
          this.paneEl.requestFullscreen().catch(() => {});
        }
      } else {
        this.paneEl.classList.remove('is-fullscreen');
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
      this.updateMotionButtonsUI();
    }

    updateMotionButtonsUI() {
      const ar = isArabic();
      const playBtn = document.getElementById('manifoldPlayPauseBtn');
      if (playBtn) {
        playBtn.textContent = this.autoRotate
          ? (ar ? '⏸ إيقاف الدوران' : '⏸ PAUSE')
          : (ar ? '▶ دوران تلقائي' : '▶ SPIN');
        playBtn.classList.toggle('active', this.autoRotate);
      }

      const speedBtn = document.getElementById('manifoldSpeedBtn');
      if (speedBtn) {
        speedBtn.textContent = `${this.rotSpeed}×`;
      }

      const modeBtn = document.getElementById('manifoldModeBtn');
      if (modeBtn) {
        const labels = {
          hybrid: ar ? '🌐 السطح + النقاط' : '🌐 SURFACE+NODES',
          wireframe: ar ? '🕸 شبكة سلكية' : '🕸 WIREFRAME',
          nodes: ar ? '⚪ النقاط فقط' : '⚪ NODES ONLY'
        };
        modeBtn.textContent = labels[this.renderMode] || labels.hybrid;
      }

      const fsBtn = document.getElementById('manifoldFullscreenBtn');
      if (fsBtn && this.paneEl) {
        const isFs = this.paneEl.classList.contains('is-fullscreen') || document.fullscreenElement === this.paneEl;
        fsBtn.textContent = isFs
          ? (ar ? '🗗 إنهاء ملء الشاشة' : '🗗 EXIT FULLSCREEN')
          : (ar ? '⛶ ملء الشاشة' : '⛶ FULLSCREEN');
      }

      const zoomReadout = document.getElementById('manifoldZoomReadout');
      if (zoomReadout) {
        zoomReadout.textContent = `${Math.round(this.zoom * 100)}%`;
      }

      if (this.exclLabel) {
        let codeLabel = '';
        if (this.selectedPart) {
          if (this.selectedPart.type === 'node' && this.selectedPart.pt) {
            codeLabel = this.selectedPart.pt.id;
          } else if (this.selectedPart.type === 'surface') {
            codeLabel = `[${this.selectedPart.row},${this.selectedPart.col}]`;
          } else if (this.selectedPart.type === 'threshold_plane') {
            codeLabel = `τ=${this.currentThreshold.toFixed(2)}`;
          } else {
            codeLabel = '3D AXES';
          }
        }
        this.exclLabel.textContent = ar
          ? `اضغط لعرض تفاصيل ${codeLabel}`
          : `Click for ${codeLabel} Details`;
      }
    }

    selectPresetPart(targetType) {
      this.autoRotate = false;
      this.showExclamationPin = true;
      if (targetType === 'node_high') {
        const idx = this.points.findIndex(p => p.actual === 1 && p.p_gbm >= 0.78);
        const useIdx = idx >= 0 ? idx : 0;
        this.selectedPart = { type: 'node', index: useIdx, pt: this.points[useIdx] };
      } else if (targetType === 'surface_peak') {
        this.selectedPart = { type: 'surface', row: 2, col: 12 };
      } else if (targetType === 'threshold_plane') {
        this.selectedPart = { type: 'threshold_plane' };
      } else if (targetType === 'axis_info') {
        this.selectedPart = { type: 'axis', axisKey: 'X_Z_Y' };
      }
      document.querySelectorAll('.js-manifold-quick-select').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.inspectType === targetType);
      });
      this.updateMotionButtonsUI();
      this.renderInspectorDetails();
      if (this.detailsModalOpen) {
        this.renderPointModalDetails();
      }
    }

    bindInteractionEvents() {
      this.canvas.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        this.dragMoved = false;
        this.pointerDownPos = { x: e.clientX, y: e.clientY };
        this.lastMouse = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('pointerup', (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;

        const moveDist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
        // Generous 10px click tolerance so any tap/click on a point registers reliably
        if (moveDist < 10) {
          const rect = this.canvas.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
            this.handleCanvasClick(clickX, clickY);
          }
        }
      });

      window.addEventListener('pointermove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };

        if (!this.isDragging) return;
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          this.dragMoved = true;
          this.autoRotate = false;
          this.updateMotionButtonsUI();
        }

        if (e.shiftKey) {
          // Shift + Drag pans the 3D stage
          this.panX = Math.max(-180, Math.min(180, this.panX + dx));
          this.panY = Math.max(-140, Math.min(140, this.panY + dy));
        } else {
          /**
           * NATURAL 360° TRACKBALL ROTATION:
           * - dx > 0 (drag mouse RIGHT) -> dYaw = +dx * 0.009 -> front of 3D manifold moves RIGHT
           * - dy > 0 (drag mouse DOWN)  -> dPitch = -dy * 0.009 -> front of 3D manifold moves DOWN
           * - dy < 0 (drag mouse UP)    -> dPitch = -dy * 0.009 (>0) -> front of 3D manifold moves UP
           * Zero angle limits: full 360° in all directions!
           */
          this.applyScreenSpaceRotation(dx * 0.009, -dy * 0.009);
        }
        this.lastMouse = { x: e.clientX, y: e.clientY };
      });

      // Mouse Wheel Zoom inside the 3D Manifold
      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.12 : -0.12;
        this.zoom = Math.max(0.5, Math.min(2.6, +(this.zoom + delta).toFixed(2)));
        this.updateMotionButtonsUI();
      }, { passive: false });
    }

    handleCanvasClick(cx, cy) {
      // Check 0: Did the user click directly on the canvas-drawn (!) marker?
      if (this.showExclamationPin && this.pinnedScreenPos) {
        const distToPin = Math.hypot(cx - this.pinnedScreenPos.sx, cy - (this.pinnedScreenPos.sy - 26));
        if (distToPin < 24) {
          this.openPointDetailsModal();
          return;
        }
      }

      // Priority 1: Check if user clicked any 3D Customer Node (generous 28px hit radius!)
      let bestNode = null;
      let minNodeDist = 28;
      for (let i = 0; i < this.lastProjectedNodes.length; i++) {
        const n = this.lastProjectedNodes[i];
        const d = Math.hypot(n.sx - cx, n.sy - cy);
        if (d < minNodeDist) {
          minNodeDist = d;
          bestNode = n;
        }
      }

      if (bestNode) {
        // Pause rotation so the clicked point & its (!) badge stay right under the user's cursor
        this.autoRotate = false;
        this.selectedPart = {
          type: 'node',
          index: bestNode.index,
          pt: bestNode.pt
        };
        this.showExclamationPin = true;
        this.closePointDetailsModal();
        this.updateMotionButtonsUI();
        this.renderInspectorDetails();
        return;
      }

      // Priority 2: Check if user clicked near a 3D Axis label
      for (let i = 0; i < this.lastAxisLabels.length; i++) {
        const ax = this.lastAxisLabels[i];
        if (Math.abs(cx - ax.sx) < 58 && Math.abs(cy - ax.sy) < 18) {
          this.autoRotate = false;
          this.selectedPart = {
            type: 'axis',
            axisKey: ax.key
          };
          this.showExclamationPin = true;
          this.closePointDetailsModal();
          this.updateMotionButtonsUI();
          this.renderInspectorDetails();
          return;
        }
      }

      // Priority 3: Check if user clicked a 3D Decision Surface Quad
      const quadsFrontFirst = [...this.lastProjectedQuads].sort((a, b) => a.avgDepth - b.avgDepth);
      for (let i = 0; i < quadsFrontFirst.length; i++) {
        const q = quadsFrontFirst[i];
        if (pointInQuad(cx, cy, q)) {
          this.autoRotate = false;
          this.selectedPart = {
            type: 'surface',
            row: q.row,
            col: q.col
          };
          this.showExclamationPin = true;
          this.closePointDetailsModal();
          this.updateMotionButtonsUI();
          this.renderInspectorDetails();
          return;
        }
      }

      // Priority 4: Check if user clicked inside the Threshold Cutoff Plane (tau)
      if (this.lastThresholdPoly && pointInQuad(cx, cy, this.lastThresholdPoly)) {
        this.autoRotate = false;
        this.selectedPart = {
          type: 'threshold_plane'
        };
        this.showExclamationPin = true;
        this.closePointDetailsModal();
        this.updateMotionButtonsUI();
        this.renderInspectorDetails();
        return;
      }

      // Priority 5 (Fallback): Find the closest customer node within 65px so clicking inside the manifold always locks onto the nearest point
      let fallbackNode = null;
      let fallbackDist = 65;
      for (let i = 0; i < this.lastProjectedNodes.length; i++) {
        const n = this.lastProjectedNodes[i];
        const d = Math.hypot(n.sx - cx, n.sy - cy);
        if (d < fallbackDist) {
          fallbackDist = d;
          fallbackNode = n;
        }
      }
      if (fallbackNode) {
        this.autoRotate = false;
        this.selectedPart = {
          type: 'node',
          index: fallbackNode.index,
          pt: fallbackNode.pt
        };
        this.showExclamationPin = true;
        this.closePointDetailsModal();
        this.updateMotionButtonsUI();
        this.renderInspectorDetails();
      }
    }

    /**
     * Renders the Full Point Details Modal Card inside the 3D Manifold when clicking (!)
     */
    renderPointModalDetails() {
      if (!this.detailsModalContent || !this.selectedPart) return;
      const ar = isArabic();
      const telemetry = window.CLASSIFICATION_TELEMETRY || {};
      const activeModelObj = (telemetry.models && telemetry.models[this.currentModel]) || { name: this.currentModel };

      if (this.selectedPart.type === 'node') {
        const pt = this.selectedPart.pt;
        const prob = getPointProbability(pt, this.currentModel);
        const outcome = classifyOutcomeColor(pt.actual, prob, this.currentThreshold);
        const actualLabel = pt.actual === 1
          ? (ar ? 'متسرب فعلياً (Churned y = 1)' : 'Churned Account (y = 1)')
          : (ar ? 'مستقر فعلياً (Retained y = 0)' : 'Retained Account (y = 0)');

        const pKnn = clamp01(0.5 * pt.p_rf + 0.5 * pt.p_lr + 0.08 * Math.sin(pt.tenure));
        const modelScores = [
          { name: 'Gradient Boosting (GBM)', p: pt.p_gbm, col: '#3B82F6' },
          { name: 'Random Forest (RF)', p: pt.p_rf, col: '#10B981' },
          { name: 'RBF-SVM Kernel', p: pt.p_svm, col: '#A855F7' },
          { name: 'Logistic Regression (L2)', p: pt.p_lr, col: '#F59E0B' },
          { name: 'k-NN (k=15)', p: pKnn, col: '#94A3B8' }
        ];

        const barsHtml = modelScores.map(m => `
          <div style="display:grid;grid-template-columns:138px 1fr 44px;align-items:center;gap:0.4rem;margin-bottom:0.3rem;font-size:0.65rem;">
            <span style="color:#CBD5E1;">${m.name}</span>
            <div style="height:8px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.25);">
              <div style="height:100%;width:${(m.p * 100).toFixed(1)}%;background:${m.col};"></div>
            </div>
            <strong style="text-align:right;color:#F8FAFC;">${(m.p * 100).toFixed(1)}%</strong>
          </div>
        `).join('');

        this.detailsModalContent.innerHTML = `
          <div class="point-modal-header">
            <div>
              <div style="color:#FACC15;font-weight:800;font-size:0.66rem;">
                [!] ${ar ? 'بطاقة التفاصيل الكاملة للنقطة المختارة' : 'COMPLETE 3D POINT TELEMETRY DOSSIER'}
              </div>
              <div style="font-size:0.88rem;font-weight:800;color:#FFFFFF;margin-top:0.15rem;">
                ${pt.id} · <span style="color:${outcome.hex};">${outcome.short}</span>
              </div>
              <div style="font-size:0.67rem;color:${outcome.hex};font-weight:700;">${outcome.code}</div>
            </div>
            <button type="button" id="closePointModalBtn" class="point-modal-close" title="Close">✕</button>
          </div>

          <div class="point-modal-grid">
            <div class="point-modal-kv">
              <span>${ar ? 'نوع العقد' : 'CONTRACT TIER'}</span>
              <strong>${pt.contract}</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'مدة الاشتراك (المحور X)' : 'X-AXIS: TENURE'}</span>
              <strong>${pt.tenure} ${ar ? 'شهراً' : 'Months'}</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'انخفاض الاستخدام (المحور Z)' : 'Z-AXIS: 30D USAGE DROP'}</span>
              <strong style="color:${pt.usage_drop > 10 ? '#F87171' : '#6EE7B7'};">${pt.usage_drop > 0 ? '+' : ''}${pt.usage_drop}%</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'احتمال التسرب (المحور Y)' : 'Y-AXIS: P(CHURN)'}</span>
              <strong style="color:${outcome.hex};">${(prob * 100).toFixed(1)}% (τ=${this.currentThreshold.toFixed(2)})</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'الرسوم الشهرية وتذاكر الدعم' : 'MONTHLY FEE & TICKETS'}</span>
              <strong>$${pt.monthly_charges} · ${pt.support_tickets} ${ar ? 'تذاكر' : 'Tickets'}</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'الحالة الفعلية والأثر المالي' : 'GROUND TRUTH & ROI'}</span>
              <strong>${actualLabel}<br><span style="color:${outcome.hex};font-size:0.66rem;">${outcome.fin}</span></strong>
            </div>
          </div>

          <div style="border-top:1px solid rgba(148,163,184,0.22);padding-top:0.5rem;margin-bottom:0.6rem;">
            <div style="font-size:0.64rem;font-weight:700;color:#93C5FD;margin-bottom:0.35rem;">
              ${ar ? 'مقارنة احتمالية التسرب لهذه النقطة عبر النماذج الـ 5:' : 'CROSS-MODEL PROBABILITY COMPARISON FOR THIS POINT:'}
            </div>
            ${barsHtml}
          </div>

          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
            <button type="button" id="modalLoadWhatIfBtn" class="manifold-ctrl-btn" style="flex:1;justify-content:center;background:#2563EB;color:#FFFFFF;border-color:#93C5FD;padding:0.38rem 0.6rem;">
              ⚡ ${ar ? 'محاكاة هذا العميل في قسم What-If' : 'SIMULATE THIS POINT IN WHAT-IF'}
            </button>
          </div>
        `;

        const closeBtn = document.getElementById('closePointModalBtn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.closePointDetailsModal());
        }
        const simBtn = document.getElementById('modalLoadWhatIfBtn');
        if (simBtn && window.observatoryEngine) {
          simBtn.addEventListener('click', () => {
            window.observatoryEngine.setWhatIfValues({
              tenure: pt.tenure,
              monthly: Math.round(pt.monthly_charges || 135),
              usageDrop: Math.round(pt.usage_drop),
              tickets: pt.support_tickets || 3,
              resolution: pt.actual === 1 ? 28 : 12,
              modules: pt.actual === 1 ? 2 : 5,
              nps: pt.actual === 1 ? 4 : 8,
              contract: pt.contract || 'Month-to-Month',
              payment: pt.actual === 1 ? 'Manual_Check' : 'Bank_AutoPay',
              sla: pt.actual === 1 ? 1 : 0
            });
            const sec = document.getElementById('sec-whatif');
            if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        return;
      }

      if (this.selectedPart.type === 'surface') {
        const steps = 15;
        const r = this.selectedPart.row;
        const c = this.selectedPart.col;
        const u = -1.0 + (2.0 * (r + 0.5)) / steps;
        const v = -1.0 + (2.0 * (c + 0.5)) / steps;
        const prob = this.evaluateSurface(u, v);
        const mappedTenure = Math.round(((u + 1.0) * 0.5) * 71 + 1);
        const mappedUsageDrop = Math.round(((v + 1.0) * 0.5) * 100 - 40);
        const isHigh = prob >= this.currentThreshold;
        const deltaTau = (prob - this.currentThreshold) * 100;
        const zoneColor = isHigh ? '#F87171' : '#60A5FA';
        const expObj = MODEL_SURFACE_EXPLANATIONS[this.currentModel] || MODEL_SURFACE_EXPLANATIONS.gradient_boosting;

        this.detailsModalContent.innerHTML = `
          <div class="point-modal-header">
            <div>
              <div style="color:#FACC15;font-weight:800;font-size:0.66rem;">
                [!] ${ar ? 'تفاصيل خلية السطح القراري ثلاثي الأبعاد' : '3D DECISION SURFACE PATCH TELEMETRY'}
              </div>
              <div style="font-size:0.86rem;font-weight:800;color:${zoneColor};margin-top:0.15rem;">
                ${ar ? `خلية السطح [${r}, ${c}]` : `Surface Patch [Grid ${r}, ${c}]`}
              </div>
            </div>
            <button type="button" id="closePointModalBtn" class="point-modal-close">✕</button>
          </div>
          <div class="point-modal-grid">
            <div class="point-modal-kv">
              <span>${ar ? 'إحداثي مدة الاشتراك (X)' : 'X-AXIS: TENURE'}</span>
              <strong>${mappedTenure} ${ar ? 'شهراً' : 'Months'}</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'إحداثي انخفاض الاستخدام (Z)' : 'Z-AXIS: USAGE DROP'}</span>
              <strong>${mappedUsageDrop > 0 ? '+' : ''}${mappedUsageDrop}%</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'الاحتمال على السطح (Y)' : 'Y-AXIS: SURFACE P(CHURN)'}</span>
              <strong style="color:${zoneColor};">${(prob * 100).toFixed(1)}%</strong>
            </div>
            <div class="point-modal-kv">
              <span>${ar ? 'الفرق عن العتبة (P − τ)' : 'MARGIN (P − τ)'}</span>
              <strong>${deltaTau >= 0 ? '+' : ''}${deltaTau.toFixed(1)}%</strong>
            </div>
          </div>
          <div style="color:#CBD5E1;line-height:1.5;font-size:0.68rem;">
            <strong>${activeModelObj.name}:</strong> ${ar ? expObj.ar : expObj.en}
          </div>
        `;
        const closeBtn = document.getElementById('closePointModalBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closePointDetailsModal());
        return;
      }

      // Threshold Plane or Axis Modal
      this.detailsModalContent.innerHTML = `
        <div class="point-modal-header">
          <div>
            <div style="color:#FACC15;font-weight:800;font-size:0.66rem;">
              [!] ${ar ? 'تفاصيل العنصر الهندسي المحدد' : '3D GEOMETRY ELEMENT TELEMETRY'}
            </div>
            <div style="font-size:0.86rem;font-weight:800;color:#FFFFFF;margin-top:0.15rem;">
              ${this.selectedPart.type === 'threshold_plane'
                ? (ar ? `مستوى العتبة الفاصلة τ = ${this.currentThreshold.toFixed(2)}` : `Threshold Cutoff Plane τ = ${this.currentThreshold.toFixed(2)}`)
                : (ar ? 'محاور الفضاء ثلاثي الأبعاد (X, Y, Z)' : '3D Coordinate Space Axes (X, Y, Z)')}
            </div>
          </div>
          <button type="button" id="closePointModalBtn" class="point-modal-close">✕</button>
        </div>
        <div style="color:#CBD5E1;line-height:1.55;font-size:0.7rem;">
          ${this.inspectorEl ? this.inspectorEl.innerHTML : ''}
        </div>
      `;
      const closeBtn = document.getElementById('closePointModalBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closePointDetailsModal());
    }

    renderInspectorDetails() {
      if (!this.inspectorEl || !this.selectedPart) return;
      const ar = isArabic();
      const telemetry = window.CLASSIFICATION_TELEMETRY || {};
      const activeModelObj = (telemetry.models && telemetry.models[this.currentModel]) || { name: this.currentModel };

      if (this.selectedPart.type === 'node') {
        const pt = this.selectedPart.pt;
        const prob = getPointProbability(pt, this.currentModel);
        const outcome = classifyOutcomeColor(pt.actual, prob, this.currentThreshold);
        const actualLabel = pt.actual === 1
          ? (ar ? 'متسرب فعلياً (Churned = 1)' : 'Churned Account (y = 1)')
          : (ar ? 'مستقر فعلياً (Retained = 0)' : 'Retained Account (y = 0)');

        this.inspectorEl.innerHTML = `
          <div class="inspector-header-row">
            <div>
              <span class="inspector-badge" style="border-color:${outcome.hex};color:${outcome.hex};">
                ● ${ar ? 'نقطة عميل 3D' : '3D CUSTOMER NODE'}: ${pt.id}
              </span>
              <strong style="margin-inline-start:0.45rem;color:#F8FAFC;">${outcome.code}</strong>
            </div>
            <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
              <button type="button" id="openModalFromInspectorBtn" class="manifold-ctrl-btn" style="background:#F59E0B;color:#090D16;border-color:#FEF08A;font-weight:800;">
                [!] ${ar ? 'إظهار نافذة التفاصيل الكاملة' : 'OPEN FULL POINT DETAILS'}
              </button>
              <button type="button" id="loadNodeToWhatIfBtn" class="manifold-ctrl-btn" style="border-color:#60A5FA;color:#93C5FD;">
                ⚡ ${ar ? 'محاكاة في What-If' : 'LOAD IN WHAT-IF'}
              </button>
            </div>
          </div>
          <div class="inspector-metrics-grid">
            <div class="inspector-kv">
              <span>${ar ? 'نوع العقد والاشتراك' : 'CONTRACT & TENURE'}</span>
              <strong>${pt.contract} · ${pt.tenure}m</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'انخفاض الاستخدام / التذاكر' : 'USAGE DROP / TICKETS'}</span>
              <strong>${pt.usage_drop > 0 ? '+' : ''}${pt.usage_drop}% · ${pt.support_tickets}t</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'الاحتمال التنبؤي P(Churn)' : 'PREDICTED P(CHURN)'}</span>
              <strong style="color:${outcome.hex};">${(prob * 100).toFixed(1)}% (τ=${this.currentThreshold.toFixed(2)})</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'الحالة الفعلية والأثر المالي' : 'ACTUAL & ROI IMPACT'}</span>
              <strong>${actualLabel} · ${outcome.fin}</strong>
            </div>
          </div>
          <div class="inspector-desc-row">
            <span>
              ${ar
                ? `مقارنة النماذج لهذا العميل: GBM ${(pt.p_gbm * 100).toFixed(1)}% | RF ${(pt.p_rf * 100).toFixed(1)}% | SVM ${(pt.p_svm * 100).toFixed(1)}% | Logistic ${(pt.p_lr * 100).toFixed(1)}%`
                : `Cross-Model Consensus for ${pt.id}: GBM ${(pt.p_gbm * 100).toFixed(1)}% | RF ${(pt.p_rf * 100).toFixed(1)}% | SVM ${(pt.p_svm * 100).toFixed(1)}% | Logistic ${(pt.p_lr * 100).toFixed(1)}%`}
            </span>
          </div>
        `;

        const openModalBtn = document.getElementById('openModalFromInspectorBtn');
        if (openModalBtn) {
          openModalBtn.addEventListener('click', () => this.openPointDetailsModal());
        }

        const loadBtn = document.getElementById('loadNodeToWhatIfBtn');
        if (loadBtn && window.observatoryEngine) {
          loadBtn.addEventListener('click', () => {
            window.observatoryEngine.setWhatIfValues({
              tenure: pt.tenure,
              monthly: Math.round(pt.monthly_charges || 135),
              usageDrop: Math.round(pt.usage_drop),
              tickets: pt.support_tickets || 3,
              resolution: pt.actual === 1 ? 28 : 12,
              modules: pt.actual === 1 ? 2 : 5,
              nps: pt.actual === 1 ? 4 : 8,
              contract: pt.contract || 'Month-to-Month',
              payment: pt.actual === 1 ? 'Manual_Check' : 'Bank_AutoPay',
              sla: pt.actual === 1 ? 1 : 0
            });
            const sec = document.getElementById('sec-whatif');
            if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        return;
      }

      if (this.selectedPart.type === 'surface') {
        const steps = 15;
        const r = this.selectedPart.row;
        const c = this.selectedPart.col;
        const u = -1.0 + (2.0 * (r + 0.5)) / steps;
        const v = -1.0 + (2.0 * (c + 0.5)) / steps;
        const prob = this.evaluateSurface(u, v);
        const mappedTenure = Math.round(((u + 1.0) * 0.5) * 71 + 1);
        const mappedUsageDrop = Math.round(((v + 1.0) * 0.5) * 100 - 40);
        const isHigh = prob >= this.currentThreshold;
        const deltaTau = (prob - this.currentThreshold) * 100;
        const zoneColor = isHigh ? '#F87171' : '#60A5FA';
        const zoneLabel = isHigh
          ? (ar ? 'منطقة خطر تسرب (فوق العتبة τ)' : 'CHURN INTERVENTION ZONE (P ≥ τ)')
          : (ar ? 'منطقة استقرار آمنة (تحت العتبة τ)' : 'SAFE RETENTION ZONE (P < τ)');
        const expObj = MODEL_SURFACE_EXPLANATIONS[this.currentModel] || MODEL_SURFACE_EXPLANATIONS.gradient_boosting;

        this.inspectorEl.innerHTML = `
          <div class="inspector-header-row">
            <div>
              <span class="inspector-badge" style="border-color:${zoneColor};color:${zoneColor};">
                📐 ${ar ? `خلية السطح القراري [${r},${c}]` : `3D SURFACE PATCH [GRID ${r},${c}]`}
              </span>
              <strong style="margin-inline-start:0.45rem;color:${zoneColor};">${zoneLabel}</strong>
            </div>
            <button type="button" id="openModalFromInspectorBtn" class="manifold-ctrl-btn" style="background:#F59E0B;color:#090D16;border-color:#FEF08A;font-weight:800;">
              [!] ${ar ? 'تفاصيل الخلية' : 'PATCH DETAILS'}
            </button>
          </div>
          <div class="inspector-metrics-grid">
            <div class="inspector-kv">
              <span>${ar ? 'إحداثي مدة الاشتراك (X)' : 'MAPPED TENURE (X)'}</span>
              <strong>${mappedTenure} ${ar ? 'شهراً' : 'Months'}</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'إحداثي انخفاض الاستخدام (Z)' : 'MAPPED USAGE DROP (Z)'}</span>
              <strong>${mappedUsageDrop > 0 ? '+' : ''}${mappedUsageDrop}%</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'ارتفاع السطح الاحتمالي (Y)' : 'SURFACE P(CHURN) (Y)'}</span>
              <strong style="color:${zoneColor};">${(prob * 100).toFixed(1)}%</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'الفرق عن العتبة (P − τ)' : 'THRESHOLD MARGIN (P − τ)'}</span>
              <strong>${deltaTau >= 0 ? '+' : ''}${deltaTau.toFixed(1)}%</strong>
            </div>
          </div>
          <div class="inspector-desc-row">
            <span><strong>${ar ? 'تفسير انحناء السطح:' : 'Surface Geometry:'}</strong> ${ar ? expObj.ar : expObj.en}</span>
          </div>
        `;
        const openModalBtn = document.getElementById('openModalFromInspectorBtn');
        if (openModalBtn) openModalBtn.addEventListener('click', () => this.openPointDetailsModal());
        return;
      }

      if (this.selectedPart.type === 'threshold_plane') {
        const model = (telemetry.models && telemetry.models[this.currentModel]) || null;
        let sweepPt = { tp: 86, fp: 10, tn: 358, fn: 46, precision: 0.896, recall: 0.652, f1: 0.754, net_roi_usd: 134424 };
        if (model && model.threshold_sweep) {
          sweepPt = model.threshold_sweep.reduce((best, curr) =>
            Math.abs(curr.threshold - this.currentThreshold) < Math.abs(best.threshold - this.currentThreshold) ? curr : best
          , model.threshold_sweep[0]);
        }

        this.inspectorEl.innerHTML = `
          <div class="inspector-header-row">
            <div>
              <span class="inspector-badge" style="border-color:#F59E0B;color:#FBBF24;">
                ⚖ ${ar ? 'مستوى العتبة الفاصلة (τ)' : 'DECISION THRESHOLD PLANE (τ)'}
              </span>
              <strong style="margin-inline-start:0.45rem;color:#FDE68A;">
                P(y = 1 | x) = ${this.currentThreshold.toFixed(2)}
              </strong>
            </div>
            <span style="color:#94A3B8;font-size:0.66rem;">${activeModelObj.name}</span>
          </div>
          <div class="inspector-metrics-grid">
            <div class="inspector-kv">
              <span>${ar ? 'الدقة التنبؤية (Precision)' : 'PRECISION AT τ'}</span>
              <strong>${(sweepPt.precision * 100).toFixed(1)}%</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'الاستدعاء (Recall)' : 'RECALL AT τ'}</span>
              <strong>${(sweepPt.recall * 100).toFixed(1)}%</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'مقياس التوازن (F1-Score)' : 'F1-SCORE AT τ'}</span>
              <strong>${sweepPt.f1.toFixed(3)}</strong>
            </div>
            <div class="inspector-kv">
              <span>${ar ? 'صافي العائد المالي (Net ROI)' : 'NET RETAINED ROI'}</span>
              <strong style="color:#10B981;">$${sweepPt.net_roi_usd.toLocaleString()}</strong>
            </div>
          </div>
          <div class="inspector-desc-row">
            <span>
              ${ar
                ? `هذا المستوى الذهبي الأفقي يقسم الفضاء ثلاثي الأبعاد: أي عميل أو سطح يقع فوق المستوى (P ≥ ${this.currentThreshold.toFixed(2)}) يُصنَّف كمتسرب محتمل ويُوجَّه لحملة الاستبقاء.`
                : `This horizontal amber plane slices the 3D probability manifold at τ = ${this.currentThreshold.toFixed(2)}: any account or surface region above the plane triggers proactive retention intervention.`}
            </span>
          </div>
        `;
        return;
      }

      // Axis Telemetry Info
      this.inspectorEl.innerHTML = `
        <div class="inspector-header-row">
          <div>
            <span class="inspector-badge" style="border-color:#38BDF8;color:#7DD3FC;">
              📊 ${ar ? 'محاور الفضاء ثلاثي الأبعاد (X, Y, Z)' : '3D FEATURE SPACE AXES TELEMETRY'}
            </span>
            <strong style="margin-inline-start:0.45rem;color:#F8FAFC;">
              ${ar ? 'المتغيرات الأكثر تأثيراً في التصنيف' : 'Top Empirical Classification Drivers'}
            </strong>
          </div>
        </div>
        <div class="inspector-metrics-grid">
          <div class="inspector-kv">
            <span>${ar ? 'المحور X: مدة الاشتراك' : 'X-AXIS: TENURE'}</span>
            <strong>1..72m (OR = 0.452)</strong>
          </div>
          <div class="inspector-kv">
            <span>${ar ? 'المحور Z: انخفاض الاستخدام' : 'Z-AXIS: USAGE DROP'}</span>
            <strong>-40%..+65% (Rank #1)</strong>
          </div>
          <div class="inspector-kv">
            <span>${ar ? 'المحور Y: احتمالية التسرب' : 'Y-AXIS: P(CHURN)'}</span>
            <strong>0.00 .. 1.00 (Calibrated)</strong>
          </div>
          <div class="inspector-kv">
            <span>${ar ? 'عينة الاختبار المعروضة' : 'HOLDOUT COHORT'}</span>
            <strong>n = 110 / 500 Test Set</strong>
          </div>
        </div>
        <div class="inspector-desc-row">
          <span>
            ${ar
              ? 'تم توحيد المحاور الرقمية عبر StandardScaler (μ=0, σ=1) لمنع تحيز المسافات في نماذج SVM و k-NN ولضمان عدالة عقوبة التنظيم L2.'
              : 'Continuous axes are standardized via StandardScaler (μ=0, σ=1) inside the training pipeline to prevent Euclidean distance distortion in RBF-SVM and k-NN.'}
          </span>
        </div>
      `;
    }

    /**
     * Projects any 3D point (x, y, z) using the unrestricted 3x3 Orthogonal Rotation Matrix
     */
    project3D(x, y, z, width, height) {
      const M = this.rotMatrix;
      const xCam = M[0][0] * x + M[0][1] * y + M[0][2] * z;
      const yCam = M[1][0] * x + M[1][1] * y + M[1][2] * z;
      const zCam = M[2][0] * x + M[2][1] * y + M[2][2] * z;

      const fov = Math.min(width, height) * 0.88 * this.zoom;
      const viewerDist = 3.45;
      const scale = fov / Math.max(0.8, viewerDist + zCam);

      return {
        sx: width * 0.5 + this.panX + xCam * scale,
        sy: height * 0.52 + this.panY - yCam * scale,
        depth: zCam,
        scale: scale
      };
    }

    evaluateSurface(u, v) {
      const fnCurr = MODEL_SURFACE_FUNCTIONS[this.currentModel] || MODEL_SURFACE_FUNCTIONS.gradient_boosting;
      if (this.morphProgress >= 1.0 || !this.prevModel) {
        return fnCurr(u, v);
      }
      const fnPrev = MODEL_SURFACE_FUNCTIONS[this.prevModel] || fnCurr;
      return fnPrev(u, v) * (1.0 - this.morphProgress) + fnCurr(u, v) * this.morphProgress;
    }

    startRenderLoop() {
      const ctx = this.canvas.getContext('2d');
      const renderFrame = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(280, Math.floor(this.canvas.clientWidth || 520));
        const h = Math.max(280, Math.floor(this.canvas.clientHeight || 390));

        if (w !== this._lastW || h !== this._lastH || dpr !== this._lastDpr) {
          this._lastW = w;
          this._lastH = h;
          this._lastDpr = dpr;
          this.canvas.width = Math.round(w * dpr);
          this.canvas.height = Math.round(h * dpr);
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (this.autoRotate && !this.isDragging) {
          this.applyWorldYRotation(0.0028 * this.rotSpeed);
        }
        if (this.morphProgress < 1.0) {
          this.morphProgress = Math.min(1.0, this.morphProgress + 0.06);
        }
        this.pulsePhase = (this.pulsePhase + 0.07) % (Math.PI * 2);

        this.drawScene(ctx, w, h);
        requestAnimationFrame(renderFrame);
      };
      requestAnimationFrame(renderFrame);
    }

    drawScene(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5 + this.panX;
      const cy = h * 0.52 + this.panY;
      const grad = ctx.createRadialGradient(cx, cy, 18, cx, cy, Math.max(w, h) * 0.58);
      grad.addColorStop(0, 'rgba(30, 58, 138, 0.24)');
      grad.addColorStop(1, 'rgba(10, 14, 23, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 1. Draw 3D Coordinate Bounding Box & Axes
      this.drawBoundingCube(ctx, w, h);

      // 2. Draw Threshold Cutoff Plane (y = tau mapped to [-0.75, +0.75])
      const tauY = (this.currentThreshold - 0.5) * 1.5;
      this.drawThresholdPlane(ctx, w, h, tauY);

      // 3. Draw 3D Decision Boundary Manifold Mesh (unless in nodes-only mode)
      if (this.renderMode !== 'nodes') {
        this.drawDecisionManifold(ctx, w, h);
      } else {
        this.lastProjectedQuads = [];
      }

      // 4. Draw 110 Enterprise Customer Test Points & Update Floating (!) Pin Position
      this.drawCustomerPoints(ctx, w, h);
      this.updateFloatingExclamationPosition(w, h);
    }

    updateFloatingExclamationPosition(w, h) {
      if (!this.exclBtn) return;
      if (!this.showExclamationPin || !this.selectedPart) {
        this.exclBtn.style.display = 'none';
        return;
      }

      let targetSx = w * 0.5;
      let targetSy = h * 0.5;

      if (this.selectedPart.type === 'node') {
        const nodeProj = this.lastProjectedNodes.find(n => n.index === this.selectedPart.index);
        if (nodeProj) {
          targetSx = nodeProj.sx;
          targetSy = nodeProj.sy;
        }
      } else if (this.selectedPart.type === 'surface') {
        const quadProj = this.lastProjectedQuads.find(
          q => q.row === this.selectedPart.row && q.col === this.selectedPart.col
        );
        if (quadProj) {
          targetSx = quadProj.cx;
          targetSy = quadProj.cy;
        }
      } else if (this.selectedPart.type === 'threshold_plane' && this.lastThresholdPoly) {
        targetSx = 0.25 * (
          this.lastThresholdPoly.p00.sx +
          this.lastThresholdPoly.p10.sx +
          this.lastThresholdPoly.p11.sx +
          this.lastThresholdPoly.p01.sx
        );
        targetSy = 0.25 * (
          this.lastThresholdPoly.p00.sy +
          this.lastThresholdPoly.p10.sy +
          this.lastThresholdPoly.p11.sy +
          this.lastThresholdPoly.p01.sy
        );
      } else if (this.selectedPart.type === 'axis' && this.lastAxisLabels.length > 0) {
        targetSx = this.lastAxisLabels[0].sx;
        targetSy = this.lastAxisLabels[0].sy;
      }

      this.pinnedScreenPos = { sx: targetSx, sy: targetSy };

      // Keep the floating (!) button within viewport bounds while anchored right above the point
      const clampedX = Math.max(85, Math.min(w - 85, targetSx));
      const clampedY = Math.max(44, Math.min(h - 46, targetSy - 14));

      this.exclBtn.style.display = 'inline-flex';
      this.exclBtn.style.left = `${clampedX}px`;
      this.exclBtn.style.top = `${clampedY}px`;
    }

    drawBoundingCube(ctx, w, h) {
      const corners = [
        [-1, -0.75, -1], [1, -0.75, -1], [1, -0.75, 1], [-1, -0.75, 1],
        [-1, 0.75, -1], [1, 0.75, -1], [1, 0.75, 1], [-1, 0.75, 1]
      ].map(c => this.project3D(c[0], c[1], c[2], w, h));

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      const isAxisSelected = this.selectedPart && this.selectedPart.type === 'axis';
      ctx.strokeStyle = isAxisSelected ? 'rgba(56, 189, 248, 0.55)' : 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = isAxisSelected ? 1.5 : 1;
      ctx.beginPath();
      edges.forEach(([i, j]) => {
        ctx.moveTo(corners[i].sx, corners[i].sy);
        ctx.lineTo(corners[j].sx, corners[j].sy);
      });
      ctx.stroke();

      const ar = isArabic();
      ctx.fillStyle = isAxisSelected ? '#7DD3FC' : 'rgba(203, 213, 225, 0.85)';
      ctx.font = '600 10.5px "JetBrains Mono", "IBM Plex Sans Arabic", monospace';

      const xLabel = this.project3D(0, -0.85, 1.08, w, h);
      const xText = ar ? 'X: مدة الاشتراك (1..72 ش)' : 'X: TENURE (1..72m)';
      ctx.fillText(xText, xLabel.sx - 48, xLabel.sy);

      const zLabel = this.project3D(1.12, -0.85, 0, w, h);
      const zText = ar ? 'Z: انخفاض الاستخدام %' : 'Z: USAGE DROP %';
      ctx.fillText(zText, zLabel.sx - 38, zLabel.sy);

      const yLabel = this.project3D(-1.08, 0.83, -1.0, w, h);
      const yText = ar ? 'Y: احتمالية التسرب P' : 'Y: P(CHURN)';
      ctx.fillText(yText, yLabel.sx - 28, yLabel.sy);

      this.lastAxisLabels = [
        { key: 'X', sx: xLabel.sx, sy: xLabel.sy },
        { key: 'Z', sx: zLabel.sx, sy: zLabel.sy },
        { key: 'Y', sx: yLabel.sx, sy: yLabel.sy }
      ];
    }

    drawThresholdPlane(ctx, w, h, tauY) {
      const planeCorners = [
        [-1, tauY, -1], [1, tauY, -1], [1, tauY, 1], [-1, tauY, 1]
      ].map(c => this.project3D(c[0], c[1], c[2], w, h));

      this.lastThresholdPoly = {
        p00: planeCorners[0],
        p10: planeCorners[1],
        p11: planeCorners[2],
        p01: planeCorners[3]
      };

      const isSelected = this.selectedPart && this.selectedPart.type === 'threshold_plane';
      ctx.fillStyle = isSelected ? 'rgba(245, 158, 11, 0.20)' : 'rgba(245, 158, 11, 0.08)';
      ctx.strokeStyle = isSelected ? '#FBBF24' : 'rgba(245, 158, 11, 0.58)';
      ctx.lineWidth = isSelected ? 2.2 : 1.25;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(planeCorners[0].sx, planeCorners[0].sy);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(planeCorners[i].sx, planeCorners[i].sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#FBBF24';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillText(`τ = ${this.currentThreshold.toFixed(2)}`, planeCorners[1].sx - 44, planeCorners[1].sy - 5);
    }

    drawDecisionManifold(ctx, w, h) {
      const steps = 15;
      const grid = [];

      for (let i = 0; i <= steps; i++) {
        const u = -1.0 + (2.0 * i) / steps;
        const row = [];
        for (let j = 0; j <= steps; j++) {
          const v = -1.0 + (2.0 * j) / steps;
          const prob = this.evaluateSurface(u, v);
          const y = (prob - 0.5) * 1.5;
          const proj = this.project3D(u, y, v, w, h);
          row.push({ sx: proj.sx, sy: proj.sy, prob: prob, depth: proj.depth, u, v, y });
        }
        grid.push(row);
      }

      const quads = [];
      for (let i = 0; i < steps; i++) {
        for (let j = 0; j < steps; j++) {
          const p00 = grid[i][j];
          const p10 = grid[i + 1][j];
          const p11 = grid[i + 1][j + 1];
          const p01 = grid[i][j + 1];
          const avgProb = 0.25 * (p00.prob + p10.prob + p11.prob + p01.prob);
          const avgDepth = 0.25 * (p00.depth + p10.depth + p11.depth + p01.depth);
          const cx = 0.25 * (p00.sx + p10.sx + p11.sx + p01.sx);
          const cy = 0.25 * (p00.sy + p10.sy + p11.sy + p01.sy);

          quads.push({
            row: i,
            col: j,
            p00,
            p10,
            p11,
            p01,
            avgProb,
            avgDepth,
            cx,
            cy
          });
        }
      }

      quads.sort((a, b) => b.avgDepth - a.avgDepth);
      this.lastProjectedQuads = quads;

      let selectedQuadObj = null;

      for (let qIdx = 0; qIdx < quads.length; qIdx++) {
        const q = quads[qIdx];
        const isHighRisk = q.avgProb >= this.currentThreshold;
        const isSelected = this.selectedPart &&
          this.selectedPart.type === 'surface' &&
          this.selectedPart.row === q.row &&
          this.selectedPart.col === q.col;

        if (isSelected) {
          selectedQuadObj = q;
        }

        if (this.renderMode === 'wireframe') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
          ctx.strokeStyle = isHighRisk
            ? 'rgba(248, 113, 113, 0.55)'
            : 'rgba(96, 165, 250, 0.48)';
          ctx.lineWidth = 1.05;
        } else {
          ctx.fillStyle = isHighRisk
            ? `rgba(239, 68, 68, ${0.12 + q.avgProb * 0.16})`
            : `rgba(59, 130, 246, ${0.10 + (1 - q.avgProb) * 0.12})`;
          ctx.strokeStyle = isHighRisk
            ? 'rgba(248, 113, 113, 0.36)'
            : 'rgba(96, 165, 250, 0.32)';
          ctx.lineWidth = 0.85;
        }

        ctx.beginPath();
        ctx.moveTo(q.p00.sx, q.p00.sy);
        ctx.lineTo(q.p10.sx, q.p10.sy);
        ctx.lineTo(q.p11.sx, q.p11.sy);
        ctx.lineTo(q.p01.sx, q.p01.sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      if (selectedQuadObj) {
        const q = selectedQuadObj;
        ctx.save();
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(q.p00.sx, q.p00.sy);
        ctx.lineTo(q.p10.sx, q.p10.sy);
        ctx.lineTo(q.p11.sx, q.p11.sy);
        ctx.lineTo(q.p01.sx, q.p01.sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    drawCustomerPoints(ctx, w, h) {
      const projectedPoints = [];
      let hoveredPoint = null;
      let minDist = 16;

      for (let i = 0; i < this.points.length; i++) {
        const pt = this.points[i];
        const u = ((pt.tenure - 1) / 71) * 2.0 - 1.0;
        const v = ((pt.usage_drop + 40) / 100) * 2.0 - 1.0;
        const prob = getPointProbability(pt, this.currentModel);
        const y = (prob - 0.5) * 1.5;

        const proj = this.project3D(u, y, v, w, h);
        const baseProj = this.project3D(u, -0.75, v, w, h);
        const outcome = classifyOutcomeColor(pt.actual, prob, this.currentThreshold);

        const dx = proj.sx - this.mousePos.x;
        const dy = proj.sy - this.mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          hoveredPoint = { index: i, pt, prob, outcome, sx: proj.sx, sy: proj.sy };
        }

        projectedPoints.push({
          index: i,
          pt: pt,
          prob: prob,
          outcome: outcome,
          sx: proj.sx,
          sy: proj.sy,
          baseSx: baseProj.sx,
          baseSy: baseProj.sy,
          depth: proj.depth,
          radius: Math.max(3.8, Math.min(7.5, proj.scale * 0.034)),
          color: outcome.hex,
          actual: pt.actual
        });
      }

      this.lastProjectedNodes = projectedPoints;

      const sortedNodes = [...projectedPoints].sort((a, b) => b.depth - a.depth);
      let selectedNodeProj = null;

      for (let i = 0; i < sortedNodes.length; i++) {
        const p = sortedNodes[i];
        const isSelected = this.selectedPart &&
          this.selectedPart.type === 'node' &&
          this.selectedPart.index === p.index;

        if (isSelected) {
          selectedNodeProj = p;
        }

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, isSelected ? p.radius * 1.65 : p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.lineWidth = isSelected ? 2.5 : 1.1;
        ctx.strokeStyle = isSelected ? '#FEF08A' : '#0F172A';
        ctx.stroke();
      }

      // Draw 3D drop-line and pulsing target rings around the selected customer node
      if (selectedNodeProj) {
        const pulseRadius = 11 + Math.sin(this.pulsePhase) * 3.0;
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(selectedNodeProj.sx, selectedNodeProj.sy);
        ctx.lineTo(selectedNodeProj.baseSx, selectedNodeProj.baseSy);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(selectedNodeProj.sx, selectedNodeProj.sy, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
      }

      const ar = isArabic();
      if (hoveredPoint && this.tooltip && !this.detailsModalOpen) {
        ctx.beginPath();
        ctx.arc(hoveredPoint.sx, hoveredPoint.sy, 9, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${Math.min(w - 245, Math.max(10, hoveredPoint.sx + 14))}px`;
        this.tooltip.style.top = `${Math.max(10, hoveredPoint.sy - 74)}px`;
        this.tooltip.innerHTML = `
          <div><strong>${hoveredPoint.pt.id}</strong> · ${hoveredPoint.pt.contract}</div>
          <div>${ar ? 'المدة' : 'Tenure'}: ${hoveredPoint.pt.tenure}m | ${ar ? 'الانخفاض' : 'Drop'}: ${hoveredPoint.pt.usage_drop > 0 ? '+' : ''}${hoveredPoint.pt.usage_drop}%</div>
          <div>${ar ? 'احتمال التسرب' : 'Pred P(Churn)'}: <strong>${(hoveredPoint.prob * 100).toFixed(1)}%</strong></div>
          <div style="color:${hoveredPoint.outcome.hex}">${hoveredPoint.outcome.code}</div>
          <div style="color:#FACC15;font-size:0.65rem;font-weight:700;margin-top:2px;">${ar ? 'انقر لإظهار علامة [!] وتفاصيل النقطة' : 'Click point to show [!] & inspect details'}</div>
        `;
      } else if (this.tooltip) {
        this.tooltip.style.display = 'none';
      }
    }
  }

  window.ManifoldVisualizer = ManifoldVisualizer;
})();
