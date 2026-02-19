export type PaybackDemoController = {
  dispose: () => void;
};

type PaybackTiming = {
  cursorStart: number;
  cursorHover: number;
  buttonClick: number;
  shockwave: number;
  couponDelay: number;
  couponStagger: number;
  loopDuration: number;
};

const DEFAULT_TIMING: PaybackTiming = {
  cursorStart: 1000,
  cursorHover: 2000,
  buttonClick: 2250,
  shockwave: 2500,
  couponDelay: 100,
  couponStagger: 50,
  loopDuration: 8000
};

export function startPaybackDemo(container: HTMLElement, timing: Partial<PaybackTiming> = {}): PaybackDemoController {
  const t: PaybackTiming = { ...DEFAULT_TIMING, ...timing };
  let disposed = false;
  const timeouts: number[] = [];

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      if (disposed) return;
      fn();
    }, ms);
    timeouts.push(id);
  };

  const buildUI = () => {
    container.innerHTML = `
      <div class="payback-ambient-glow"></div>
      <div class="payback-grid-container" data-payback-grid></div>

      <div class="payback-widget">
        <div class="payback-success-badge" data-payback-badge>
          <svg style="width:16px;height:16px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
          ALL COUPONS ACTIVATED
        </div>

        <div class="payback-widget-header">
          <div class="payback-logo-box">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="payback-title-group">
            <h3>AutoCoupon</h3>
            <p>by Ivo Tech</p>
          </div>
        </div>

        <button class="payback-main-btn" data-payback-btn type="button">
          <svg style="width:24px;height:24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ACTIVATE COUPONS
        </button>

        <div class="payback-logo-footer">ivo-tech edition</div>
      </div>

      <div class="payback-cursor" data-payback-cursor></div>
    `;

    const grid = container.querySelector<HTMLElement>('[data-payback-grid]');
    if (grid) {
      grid.innerHTML = '';
      for (let i = 0; i < 16; i++) {
        const coupon = document.createElement('div');
        coupon.className = 'payback-coupon-card';
        coupon.innerHTML = `
          <div class="payback-coupon-label">10x POINTS</div>
          <div class="payback-activate-btn-fake">Activate</div>
        `;
        grid.appendChild(coupon);
      }
    }
  };

  const createShockwave = () => {
    const shockwave = document.createElement('div');
    shockwave.className = 'payback-shockwave';
    container.appendChild(shockwave);
    schedule(() => shockwave.remove(), 1500);
  };

  const reset = () => {
    const btn = container.querySelector<HTMLButtonElement>('[data-payback-btn]');
    const badge = container.querySelector<HTMLElement>('[data-payback-badge]');
    const cursor = container.querySelector<HTMLElement>('[data-payback-cursor]');
    const coupons = Array.from(container.querySelectorAll<HTMLElement>('.payback-coupon-card'));

    if (btn) {
      btn.innerHTML = `
        <svg style="width:24px;height:24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        ACTIVATE COUPONS
      `;
      btn.style.background = 'linear-gradient(90deg, #00f3ff 0%, #bd00ff 100%)';
      btn.style.transform = '';
      btn.style.boxShadow = '';
    }

    badge?.classList.remove('show');
    cursor?.classList.remove('active');

    coupons.forEach((coupon) => {
      coupon.classList.remove('active');
      const fakeBtn = coupon.querySelector<HTMLElement>('.payback-activate-btn-fake');
      if (fakeBtn) {
        fakeBtn.textContent = 'Activate';
        fakeBtn.style.color = '';
        fakeBtn.style.fontWeight = '';
      }
    });

    container.querySelectorAll('.payback-shockwave').forEach((sw) => sw.remove());
  };

  const start = () => {
    reset();

    const btn = container.querySelector<HTMLButtonElement>('[data-payback-btn]');
    const badge = container.querySelector<HTMLElement>('[data-payback-badge]');
    const cursor = container.querySelector<HTMLElement>('[data-payback-cursor]');
    const coupons = Array.from(container.querySelectorAll<HTMLElement>('.payback-coupon-card'));

    schedule(() => cursor?.classList.add('active'), t.cursorStart);
    schedule(() => {
      if (!btn) return;
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 6px 30px rgba(0, 243, 255, 0.6)';
    }, t.cursorHover);
    schedule(() => {
      if (!btn) return;
      btn.style.transform = 'scale(0.95)';
    }, t.buttonClick);

    schedule(() => {
      if (btn) btn.style.transform = 'scale(1)';
      createShockwave();
      badge?.classList.add('show');

      if (btn) {
        btn.innerHTML = `
          <svg style="width:24px;height:24px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          DONE
        `;
        btn.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
      }

      coupons.forEach((coupon, index) => {
        schedule(() => {
          coupon.classList.add('active');
          const fakeBtn = coupon.querySelector<HTMLElement>('.payback-activate-btn-fake');
          if (fakeBtn) {
            fakeBtn.textContent = 'ACTIVATED';
            fakeBtn.style.color = 'black';
            fakeBtn.style.fontWeight = '800';
          }
        }, t.couponDelay + index * t.couponStagger);
      });
    }, t.shockwave);

    schedule(() => start(), t.loopDuration);
  };

  buildUI();
  start();

  return {
    dispose() {
      disposed = true;
      timeouts.forEach((id) => clearTimeout(id));
      container.innerHTML = '';
    }
  };
}
