class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.numbers = [];
    this.isGenerating = false;
  }

  connectedCallback() {
    this.render();
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
    if (num <= 10) return 'oklch(0.7 0.15 80)'; // Yellowish
    if (num <= 20) return 'oklch(0.6 0.15 230)'; // Blueish
    if (num <= 30) return 'oklch(0.6 0.2 20)';  // Reddish
    if (num <= 40) return 'oklch(0.5 0.05 0)';  // Greyish
    return 'oklch(0.6 0.2 140)';                // Greenish
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .card {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 
            0 10px 25px var(--shadow-color),
            0 20px 48px var(--shadow-color);
          text-align: center;
          transition: transform 0.3s ease;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .numbers-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 3rem;
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
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--delay);
          opacity: 0;
          transform: scale(0.5);
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        @keyframes popIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        button {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px oklch(0.6 0.2 250 / 0.3);
          font-family: inherit;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px oklch(0.6 0.2 250 / 0.4);
          filter: brightness(1.1);
        }

        button:active {
          transform: translateY(1px);
        }

        button:disabled {
          background-color: oklch(0.8 0.02 240);
          cursor: not-allowed;
          box-shadow: none;
        }

        @container (max-width: 500px) {
          .ball {
            width: 45px;
            height: 45px;
            font-size: 1rem;
          }
        }
      </style>
      
      <div class="card">
        <h1>오늘의 행운 번호</h1>
        <div class="numbers-container">
          <!-- 번호 공들이 여기에 렌더링됩니다 -->
        </div>
        <button id="generate">번호 생성하기</button>
      </div>
    `;

    this.shadowRoot.querySelector('#generate').addEventListener('click', () => this.generateNumbers());
  }
}

customElements.define('lotto-generator', LottoGenerator);
