/**
 * TeakaLearn Quiz Engine Core
 * Lightweight, M3 Styled, Multi-Scoring & LocalStorage Support
 */
class TeakaQuiz {
  constructor(options = {}) {
    this.quizId = options.quizId || 'quiz';
    this.containerId = options.containerId || 'quiz-app';
    this.questions = options.questions || [];
    this.onComplete = options.onComplete || null;

    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null).map(() => []);
    
    this.init();
  }

  init() {
    this.container = typeof this.containerId === 'string'
      ? document.getElementById(this.containerId)
      : this.containerId;

    if (!this.container) {
      console.error(`Container ${this.containerId} tidak ditemukan.`);
      return;
    }
    
    this.renderLayout();
    this.renderQuestion();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="tq-wrapper">
        <div class="tq-header">
          <span class="tq-progress" id="tq-progress-text"></span>
        </div>
        <div class="tq-card" id="tq-question-card">
          <div class="tq-question" id="tq-q-text"></div>
          <div class="tq-options" id="tq-options-container"></div>
        </div>
        <div class="tq-footer">
          <button class="tq-btn tq-btn-secondary" id="tq-prev-btn">Sebelumnya</button>
          <button class="tq-btn" id="tq-next-btn">Selanjutnya</button>
        </div>
      </div>
    `;

    document.getElementById('tq-prev-btn').onclick = () => this.navigate(-1);
    document.getElementById('tq-next-btn').onclick = () => this.navigate(1);
  }

  getOptions(q) {
    if (Array.isArray(q.options)) return q.options;
    if (Array.isArray(q.answer)) return q.answer;
    return [];
  }

  getTargetAnswers(q) {
    if (q.trueAnswer !== undefined) {
      return Array.isArray(q.trueAnswer) ? q.trueAnswer : [q.trueAnswer];
    }
    if (typeof q.answer === 'number') {
      return [q.answer];
    }
    if (Array.isArray(q.answer) && typeof q.answer[0] === 'number') {
      return q.answer;
    }
    return [];
  }

  formatContent(text) {
    if (window.renderMarkdownAndLatex) {
      return window.renderMarkdownAndLatex(text);
    }
    if (window.marked) {
      return marked.parse(text);
    }
    return text;
  }

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    const optionsList = this.getOptions(q);
    const targetAnswers = this.getTargetAnswers(q);
    const isMultiple = q.type === 'multiple' || targetAnswers.length > 1;

    const progressEl = document.getElementById('tq-progress-text');
    if (progressEl) {
      progressEl.innerHTML = `
        Soal ${this.currentIndex + 1} dari ${this.questions.length}
        ${q.category ? `<span class="tq-badge-type" style="background:var(--tq-bg-container-highest); color:var(--tq-text-secondary);">${q.category}</span>` : ''}
        ${isMultiple ? '<span class="tq-badge-type">Kompleks</span>' : ''}
      `;
    }
    
    // Parse Question Text
    const qTextEl = document.getElementById('tq-q-text');
    if (qTextEl) {
      qTextEl.innerHTML = this.formatContent(q.question);
    }

    // Render Options
    const optContainer = document.getElementById('tq-options-container');
    if (optContainer) {
      optContainer.innerHTML = '';

      optionsList.forEach((optText, idx) => {
        const isSelected = this.userAnswers[this.currentIndex].includes(idx);
        const optEl = document.createElement('div');
        optEl.className = `tq-option ${isMultiple ? 'multiple' : ''} ${isSelected ? 'selected' : ''}`;

        const parsedOpt = this.formatContent(optText);

        optEl.innerHTML = `
          <div class="tq-control-indicator"></div>
          <div>${parsedOpt}</div>
        `;

        optEl.onclick = () => this.selectAnswer(idx, isMultiple);
        optContainer.appendChild(optEl);
      });
    }

    // Update Nav Buttons
    const prevBtn = document.getElementById('tq-prev-btn');
    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;

    const nextBtn = document.getElementById('tq-next-btn');
    if (nextBtn) {
      nextBtn.innerText = this.currentIndex === this.questions.length - 1 ? 'Selesai' : 'Selanjutnya';
    }

    // Re-render KaTeX / MathJax if needed
    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('tq-question-card'));
    }
  }

  selectAnswer(index, isMultiple) {
    let current = this.userAnswers[this.currentIndex];

    if (isMultiple) {
      if (current.includes(index)) {
        this.userAnswers[this.currentIndex] = current.filter(i => i !== index);
      } else {
        this.userAnswers[this.currentIndex].push(index);
      }
    } else {
      this.userAnswers[this.currentIndex] = [index];
    }

    this.renderQuestion();
  }

  navigate(dir) {
    if (dir === 1 && this.currentIndex === this.questions.length - 1) {
      return this.finishQuiz();
    }
    this.currentIndex += dir;
    this.renderQuestion();
  }

  calculateScores() {
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    this.questions.forEach((q, idx) => {
      const user = [...this.userAnswers[idx]].sort().join(',');
      const targets = this.getTargetAnswers(q);
      const target = [...targets].sort().join(',');

      if (this.userAnswers[idx].length === 0) {
        unattemptedCount++;
      } else if (user === target) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = this.questions.length;
    const score100 = Math.round((correctCount / total) * 100);
    const score800 = Math.round(200 + (correctCount / total) * 600);

    return {
      total,
      correctCount,
      wrongCount,
      unattemptedCount,
      score100,
      score800
    };
  }

  saveProgress(scores) {
    try {
      const history = JSON.parse(localStorage.getItem('teaka_quiz_history') || '{}');
      history[this.quizId] = {
        quizId: this.quizId,
        lastUpdated: new Date().toISOString(),
        completed: true,
        scores: scores
      };
      localStorage.setItem('teaka_quiz_history', JSON.stringify(history));
    } catch (e) {
      console.error("Gagal menyimpan riwayat kuis:", e);
    }
  }

  finishQuiz() {
    const scores = this.calculateScores();
    this.saveProgress(scores);

    this.container.innerHTML = `
      <div class="tq-card tq-score-card">
        <h2>Kuis Selesai!</h2>
        
        <div style="margin: 24px 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
          <div style="background: var(--tq-bg-container-high); padding: 16px; border-radius: 16px;">
            <span style="font-size: 0.8rem; color: var(--tq-text-muted);">Skor TKA (200-800)</span>
            <div class="tq-score-val" style="font-size: 3rem; margin: 8px 0;">${scores.score800}</div>
          </div>
          
          <div style="background: var(--tq-bg-container-high); padding: 16px; border-radius: 16px;">
            <span style="font-size: 0.8rem; color: var(--tq-text-muted);">Skor Standar (0-100)</span>
            <div class="tq-score-val" style="font-size: 3rem; margin: 8px 0; color: var(--tq-text-primary);">${scores.score100}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 20px; font-weight: 600; font-size: 0.95rem; color: var(--tq-text-secondary); margin-bottom: 24px;">
          <span style="color: var(--tq-color-success);">✓ Benar: ${scores.correctCount}</span>
          <span style="color: var(--tq-color-error);">✗ Salah: ${scores.wrongCount}</span>
          <span>➖ Kosong: ${scores.unattemptedCount}</span>
        </div>

        <button class="tq-btn" onclick="window.location.hash = '#home'">Kembali ke Dashboard</button>
      </div>
    `;

    if (typeof this.onComplete === 'function') {
      this.onComplete(scores);
    }
  }
}

if (typeof window !== 'undefined') {
  window.TeakaQuiz = TeakaQuiz;
}
