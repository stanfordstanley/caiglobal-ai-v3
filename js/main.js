// CAI Global — shared front-end behavior

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Harvard AI white paper banner — all pages
(function () {
  if (document.querySelector('.research-banner')) return;

  const header = document.querySelector('header');
  if (!header) return;

  const banner = document.createElement('div');
  banner.className = 'research-banner wrap';
  banner.innerHTML = `
    <div class="research-banner-inner">
      <span class="mono research-banner-label">HARVARD AI · WHITE PAPER</span>
      <span class="research-banner-title">CAI × HFTC Policy White Paper 2026 No.1 — Toronto–Boston Roundtable on AI Security &amp; Governance</span>
      <div class="research-banner-links">
        <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-EN.pdf" target="_blank" rel="noopener">English PDF ↓</a>
        <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-CN.pdf" target="_blank" rel="noopener">中文 PDF ↓</a>
        <a href="/content/#research" class="research-banner-more">Details →</a>
      </div>
    </div>`;

  header.insertAdjacentElement('afterend', banner);

  const setBannerHeight = () => {
    document.documentElement.style.setProperty('--research-banner-h', banner.offsetHeight + 'px');
  };
  setBannerHeight();
  window.addEventListener('resize', setBannerHeight);
})();
