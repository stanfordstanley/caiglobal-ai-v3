// CAI Global — shared front-end behavior

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

(function () {
  const header = document.querySelector('header');
  if (header) {
    const setHeaderHeight = () => {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }
})();

// Harvard AI white paper banner — all pages, single row
(function () {
  if (document.querySelector('.research-banner')) return;

  const header = document.querySelector('header');
  if (!header) return;

  const banner = document.createElement('div');
  banner.className = 'research-banner wrap';
  banner.innerHTML = `
    <div class="research-banner-inner">
      <span class="research-banner-title">CAI × HFTC Policy White Paper 2026 No.1 — HARVARD AI · WHITE PAPER</span>
      <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-EN.pdf" class="research-banner-link" target="_blank" rel="noopener">English PDF ↓</a>
      <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-CN.pdf" class="research-banner-link" target="_blank" rel="noopener">中文 PDF ↓</a>
      <a href="/content/#research" class="research-banner-link research-banner-more">Details →</a>
    </div>`;

  header.insertAdjacentElement('afterend', banner);

  const setBannerHeight = () => {
    document.documentElement.style.setProperty('--research-banner-h', banner.offsetHeight + 'px');
  };
  setBannerHeight();
  window.addEventListener('resize', setBannerHeight);
})();
