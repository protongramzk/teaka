/**
 * TeakaLearn Quiz Engine Core
 * Lightweight, M3 Styled, Multi-Scoring & LocalStorage Support
 */
export class TeakaQuiz {
  constructor(options = {}) {
    this.quizId = options.quizId || window.location.pathname.split('/').pop().replace('.html', '');
    this.containerId = options.containerId || 'quiz-app';
    this.questions = options.questions || [];
    this.onComplete = options.onComplete || null;

    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null).map(() => []);
    
    this.init();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) return console.error(`Container #${this.containerId} tidak ditemukan.`);
    
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

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    const isMultiple = q.type === 'multiple' || (Array.isArray(q.trueAnswer) && q.trueAnswer.length > 1);

    document.getElementById('tq-progress-text').innerHTML = `
      Soal ${this.currentIndex + 1} dari ${this.questions.length} 
      ${isMultiple ? '<span class="tq-badge-type">Kompleks</span>' : ''}
    `;
    
    // Parse Markdown
    const qTextEl = document.getElementById('tq-q-text');
    qTextEl.innerHTML = window.marked ? marked.parse(q.question) : q.question;

    // Render Options
    const optContainer = document.getElementById('tq-options-container');
    optContainer.innerHTML = '';

    q.answer.forEach((optText, idx) => {
      const isSelected = this.userAnswers[this.currentIndex].includes(idx);
      const optEl = document.createElement('div');
      optEl.className = `tq-option ${isMultiple ? 'multiple' : ''} ${isSelected ? 'selected' : ''}`;
      
      const parsedOpt = window.marked ? marked.parseInline(optText) : optText;

      optEl.innerHTML = `
        <div class="tq-control-indicator"></div>
        <span>${parsedOpt}</span>
      `;

      optEl.onclick = () => this.selectAnswer(idx, isMultiple);
      optContainer.appendChild(optEl);
    });

    // Update Nav Buttons
    document.getElementById('tq-prev-btn').disabled = this.currentIndex === 0;
    const nextBtn = document.getElementById('tq-next-btn');
    nextBtn.innerText = this.currentIndex === this.questions.length - 1 ? 'Selesai' : 'Selanjutnya';

    // Trigger LaTeX re-render
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise();
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
      const user = this.userAnswers[idx].sort().join(',');
      const target = Array.isArray(q.trueAnswer) 
        ? [...q.trueAnswer].sort().join(',') 
        : q.trueAnswer.toString();

      if (this.userAnswers[idx].length === 0) {
        unattemptedCount++;
      } else if (user === target) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = this.questions.length;
    
    // 1. Skala 0 - 100
    const score100 = Math.round((correctCount / total) * 100);

    // 2. Skala 200 - 800 (Standar UTBK / TKA)
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
    const history = JSON.parse(localStorage.getItem('teaka_quiz_history') || '{}');
    
    history[this.quizId] = {
      quizId: this.quizId,
      lastUpdated: new Date().toISOString(),
      completed: true,
      scores: scores
    };

    localStorage.setItem('teaka_quiz_history', JSON.stringify(history));
  }

  finishQuiz() {
    const scores = this.calculateScores();
    this.saveProgress(scores);

    this.container.innerHTML = `
      <div class="tq-card tq-score-card">
        <h2>Kuis Selesai!</h2>
        
        <div style="margin: 24px 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
          <!-- 1. Skala UTBK (200-800) -->
          <div style="background: var(--tq-bg-container); padding: 16px; border-radius: 16px;">
            <span style="font-size: 0.8rem; color: var(--tq-text-muted);">Skor TKA (200-800)</span>
            <div class="tq-score-val" style="font-size: 3rem; margin: 8px 0;">${scores.score800}</div>
          </div>
          
          <!-- 2. Skala Persentase (0-100) -->
          <div style="background: var(--tq-bg-container); padding: 16px; border-radius: 16px;">
            <span style="font-size: 0.8rem; color: var(--tq-text-muted);">Skor Standar (0-100)</span>
            <div class="tq-score-val" style="font-size: 3rem; margin: 8px 0; color: var(--tq-text-primary);">${scores.score100}</div>
          </div>
        </div>

        <!-- 3. Salah / Benar Absolut -->
        <div style="display: flex; justify-content: center; gap: 20px; font-weight: 600; font-size: 0.95rem; color: var(--tq-text-secondary);">
          <span style="color: var(--tq-color-success);">✓ Benar: ${scores.correctCount}</span>
          <span style="color: var(--tq-color-error);">✗ Salah: ${scores.wrongCount}</span>
          <span>➖ Kosong: ${scores.unattemptedCount}</span>
        </div>
      </div>
    `;

    if (typeof this.onComplete === 'function') {
      this.onComplete(scores);
    }
  }
}
