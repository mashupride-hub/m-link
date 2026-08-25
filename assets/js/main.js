// ============================================================
// main.js — M-Link Corporate Site Modern Clean JS
// (Simple, Light, Refined Interactions)
// ============================================================

async function initSite() {
  if (window.siteComponentsReady) await window.siteComponentsReady;

  // ── 1. Header Scroll state ──
  const header = document.querySelector('.header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Highlight the current top-page section in the desktop navigation.
  const sectionLinks = [...document.querySelectorAll('.header__nav-link[href*="#"]')]
    .filter(link => new URL(link.href, window.location.href).pathname === window.location.pathname);
  const observedSections = sectionLinks
    .map(link => document.querySelector(new URL(link.href, window.location.href).hash))
    .filter(Boolean);

  if ('IntersectionObserver' in window && observedSections.length) {
    const navObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      sectionLinks.forEach(link => {
        const active = new URL(link.href, window.location.href).hash === `#${visible.target.id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, 0.2, 0.5] });

    observedSections.forEach(section => navObserver.observe(section));
  }

  // ── 2. Mobile Hamburger Menu ──
  const hamburger = document.querySelector('#hamburger');
  const mobileNav = document.querySelector('#mobile-nav');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-active');
    mobileNav?.classList.toggle('is-active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('is-active');
      mobileNav?.classList.remove('is-active');
      document.body.style.overflow = '';
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // ── 3. Subtle Scroll Fade-Up (Intersection Observer) ──
  const fadeElements = document.querySelectorAll('.fade-up, .reveal, .fade-in');
  
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // ── 4. Smooth Anchor Scroll ──
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetUrl = new URL(anchor.href, window.location.href);
      if (targetUrl.pathname !== window.location.pathname) return;
      const targetId = targetUrl.hash;
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header?.offsetHeight || 76;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 5. Contact Form Logic ──
  initContactForm();

  initCaseSlider();

  const pageTop = document.querySelector('.page-top');
  const updatePageTop = () => pageTop?.classList.toggle('is-visible', window.scrollY > 500);
  window.addEventListener('scroll', updatePageTop, { passive: true });
  updatePageTop();
  pageTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}

function initCaseSlider() {
  const slider = document.querySelector('[data-case-slider]');
  if (!slider) return;

  const track = slider.querySelector('.case-slider__track');
  const cards = [...slider.querySelectorAll('.case-card')];
  const dots = slider.querySelector('.case-slider__dots');
  const previous = slider.querySelector('.case-slider__button--prev');
  const next = slider.querySelector('.case-slider__button--next');
  let current = 0;

  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'case-slider__dot';
    dot.setAttribute('aria-label', `導入事例 ${index + 1}を表示`);
    dot.addEventListener('click', () => moveTo(index));
    dots?.appendChild(dot);
  });

  function moveTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slider.querySelectorAll('.case-slider__dot').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  previous?.addEventListener('click', () => moveTo(current - 1));
  next?.addEventListener('click', () => moveTo(current + 1));
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') moveTo(current - 1);
    if (event.key === 'ArrowRight') moveTo(current + 1);
  });
  slider.tabIndex = 0;
  moveTo(0);
}

// ============================================================
// Contact Form Logic
// ============================================================
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const requestedProduct = new URLSearchParams(window.location.search).get('product');
  const productField = document.querySelector('#f-product');
  if (requestedProduct && productField) productField.value = requestedProduct;

  const stepInput    = document.querySelector('#form-step-input');
  const stepConfirm  = document.querySelector('#form-step-confirm');
  const stepComplete = document.querySelector('#form-step-complete');

  const btnToConfirm = document.querySelector('#btn-to-confirm');
  const btnBack      = document.querySelector('#btn-back');
  const btnSubmit    = document.querySelector('#btn-submit');

  const requiredFields = [
    { id: 'f-company',  label: '会社名' },
    { id: 'f-name',     label: 'お名前' },
    { id: 'f-tel',      label: '電話番号' },
    { id: 'f-email',    label: 'メールアドレス' },
    { id: 'f-content',  label: 'お問い合わせ内容' },
  ];

  function validate() {
    let valid = true;
    requiredFields.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(`${id}-error`);
      if (!el) return;
      const val = el.value.trim();
      let errMsg = '';

      if (!val) {
        errMsg = `${label}を入力してください。`;
      } else if (id === 'f-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errMsg = '正しいメールアドレスを入力してください。';
      } else if (id === 'f-tel' && !/^[\d\-\+\(\)\s]{7,}$/.test(val)) {
        errMsg = '正しい電話番号を入力してください。';
      }

      if (errMsg) {
        el.classList.add('is-error');
        if (errEl) errEl.textContent = errMsg;
        valid = false;
      } else {
        el.classList.remove('is-error');
        if (errEl) errEl.textContent = '';
      }
    });
    return valid;
  }

  function buildConfirm() {
    const rows = [
      { label: 'お問い合わせ種別', id: 'f-type', isSelect: true },
      { label: '会社名',           id: 'f-company' },
      { label: 'お名前',           id: 'f-name' },
      { label: '電話番号',         id: 'f-tel' },
      { label: 'メールアドレス',   id: 'f-email' },
      { label: '商品名（任意）',   id: 'f-product' },
      { label: 'お問い合わせ内容', id: 'f-content' },
    ];

    const tbody = document.querySelector('#confirm-body');
    if (!tbody) return;
    tbody.innerHTML = rows.map(({ label, id }) => {
      const el = document.getElementById(id);
      const val = el ? (el.tagName === 'SELECT'
        ? el.options[el.selectedIndex]?.text
        : el.value.trim()) : '';
      if (!val) return '';
      return `<tr>
        <th scope="row" style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left; color:#94A3B8; font-weight:600;">${label}</th>
        <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color:#FFF;">${val.replace(/\n/g, '<br>')}</td>
      </tr>`;
    }).join('');
  }

  function showStep(stepEl) {
    [stepInput, stepConfirm, stepComplete].forEach(s => {
      if (s) s.style.display = 'none';
    });
    if (stepEl) stepEl.style.display = 'block';
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  }

  btnToConfirm?.addEventListener('click', (e) => {
    e.preventDefault();
    if (validate()) {
      buildConfirm();
      showStep(stepConfirm);
    }
  });

  btnBack?.addEventListener('click', (e) => {
    e.preventDefault();
    showStep(stepInput);
  });

  btnSubmit?.addEventListener('click', (e) => {
    e.preventDefault();
    showStep(stepComplete);
  });
}
