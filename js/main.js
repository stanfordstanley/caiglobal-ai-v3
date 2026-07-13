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

// Harvard AI white paper banner — top of page, above header
(function () {
  if (document.querySelector('.research-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'research-banner wrap';
  banner.innerHTML = `
    <div class="research-banner-inner">
      <span class="research-banner-label">CAI x HARVARD AI Governance · WHITE PAPER</span>
      <span class="research-banner-sep">·</span>
      <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-EN.pdf" class="research-banner-link" target="_blank" rel="noopener">English PDF ↓</a>
      <span class="research-banner-sep">·</span>
      <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-CN.pdf" class="research-banner-link" target="_blank" rel="noopener">中文 PDF ↓</a>
      <span class="research-banner-sep">·</span>
      <a href="/content/#research" class="research-banner-link research-banner-more">Details →</a>
    </div>`;

  document.body.insertAdjacentElement('afterbegin', banner);

  const setBannerHeight = () => {
    document.documentElement.style.setProperty('--research-banner-h', banner.offsetHeight + 'px');
  };
  setBannerHeight();
  window.addEventListener('resize', setBannerHeight);
})();

// Mobile hamburger navigation
(function () {
  const nav = document.querySelector('header nav.wrap');
  const desktopLinks = document.querySelector('.nav-links');
  if (!nav || !desktopLinks) return;

  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('nav');
  panel.className = 'mobile-nav-panel';
  panel.setAttribute('aria-label', 'Mobile navigation');

  desktopLinks.querySelectorAll('a').forEach((link) => {
    const clone = link.cloneNode(true);
    clone.addEventListener('click', closeMenu);
    panel.appendChild(clone);
  });

  mobileNav.appendChild(panel);
  nav.appendChild(toggle);
  document.body.appendChild(mobileNav);

  function openMenu() {
    mobileNav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', () => {
    if (mobileNav.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const header = document.querySelector('header');
  if (header) {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
})();

// Team profile modal (Draper-style — click photo or Learn More)
(function () {
  const modal = document.getElementById('team-modal');
  if (!modal) return;

  const body = modal.querySelector('.team-modal-body');
  let lastFocus = null;

  function openModal(memberId) {
    const source = document.getElementById('bio-' + memberId);
    if (!source || !body) return;

    body.innerHTML = source.innerHTML;
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.team-modal-close')?.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    body.innerHTML = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.querySelectorAll('[data-member]').forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.member));
  });

  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

// Team filter tabs (Leadership / Advisory / Fellows)
(function () {
  const nav = document.querySelector('.team-filter-nav');
  const groupsWrap = document.querySelector('.team-groups');
  if (!nav || !groupsWrap) return;

  const buttons = nav.querySelectorAll('[data-team-filter]');
  const groups = groupsWrap.querySelectorAll('[data-team-group]');

  function activate(filter) {
    buttons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.teamFilter === filter);
    });

    groupsWrap.dataset.active = filter;

    groups.forEach((group) => {
      group.hidden = group.dataset.teamGroup !== filter;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.dataset.teamFilter));
  });
})();
