class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.numbers = [];
    this.isGenerating = false;
    this.theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.applyTheme();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.updateThemeToggleIcon();
  }

  updateThemeToggleIcon() {
    const icon = this.shadowRoot.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }
  }

  generateNumbers() {
    if (this.isGenerating) return;
    this.isGenerating = true;
    
    const newNumbers = [];
    while (newNumbers.length < 6) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!newNumbers.includes(num)) {
        newNumbers.push(num);
      }
    }
    this.numbers = newNumbers.sort((a, b) => a - b);
    this.renderNumbers();
  }

  renderNumbers() {
    const container = this.shadowRoot.querySelector('.numbers-container');
    container.innerHTML = '';
    
    this.numbers.forEach((num, index) => {
      const ball = document.createElement('div');
      ball.className = 'ball';
      ball.textContent = num;
      ball.style.setProperty('--delay', `${index * 0.1}s`);
      ball.style.backgroundColor = this.getBallColor(num);
      container.appendChild(ball);
    });

    setTimeout(() => {
      this.isGenerating = false;
    }, 600);
  }

  getBallColor(num) {
    if (num <= 10) return 'oklch(0.75 0.15 80)';
    if (num <= 20) return 'oklch(0.65 0.15 230)';
    if (num <= 30) return 'oklch(0.65 0.2 20)';
    if (num <= 40) return 'oklch(0.55 0.05 0)';
    return 'oklch(0.65 0.2 140)';
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('#generate').addEventListener('click', () => this.generateNumbers());
    this.shadowRoot.querySelector('#theme-toggle').addEventListener('click', () => this.toggleTheme());
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .card {
          background: var(--card-bg);
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 
            0 10px 25px var(--shadow-color),
            0 20px 48px var(--shadow-color);
          text-align: center;
          transition: background-color 0.3s ease, transform 0.3s ease;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin: 0;
        }

        #theme-toggle {
          background: var(--bg-color);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--shadow-color);
        }

        #theme-toggle:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .numbers-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 3.5rem;
          min-height: 60px;
          flex-wrap: wrap;
        }

        .ball {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 1.25rem;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--delay);
          opacity: 0;
          transform: scale(0.5) translateY(20px);
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        @keyframes popIn {
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        #generate {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 1.25rem 3rem;
          font-size: 1.125rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 24px oklch(0.6 0.2 250 / 0.3);
          font-family: inherit;
        }

        #generate:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px oklch(0.6 0.2 250 / 0.4);
          filter: brightness(1.1);
        }

        #generate:active {
          transform: translateY(0);
        }

        #generate:disabled {
          background-color: oklch(0.8 0.02 240);
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 500px) {
          .card { padding: 2rem; }
          .ball { width: 44px; height: 44px; font-size: 1.125rem; }
          .numbers-container { gap: 8px; }
        }
      </style>
      
      <div class="card">
        <div class="header">
          <h1>행운의 번호</h1>
          <button id="theme-toggle" aria-label="Toggle theme">
            <span class="theme-icon">${this.theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
        </div>
        <div class="numbers-container">
          <!-- Numbers will be rendered here -->
        </div>
        <button id="generate">번호 생성하기</button>
      </div>
    `;
  }
}

customElements.define('lotto-generator', LottoGenerator);
