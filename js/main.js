// CAI Global — shared front-end behavior

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Layout CSS variables (header, research banner)
(function () {
  const header = document.querySelector('header');
  const banner = document.querySelector('.research-banner');

  function syncLayoutVars() {
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
    if (banner) {
      document.documentElement.style.setProperty('--research-banner-h', banner.offsetHeight + 'px');
    }
  }

  syncLayoutVars();
  window.addEventListener('resize', syncLayoutVars);
})();

// Harvard AI white paper banner — full-bleed bar above header
(function () {
  if (document.querySelector('.research-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'research-banner';
  banner.innerHTML = `
    <div class="wrap">
      <div class="research-banner-inner">
        <span class="research-banner-label">CAI x HARVARD AI Governance · WHITE PAPER</span>
        <span class="research-banner-sep">·</span>
        <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-EN.pdf" class="research-banner-link" target="_blank" rel="noopener">English PDF ↓</a>
        <span class="research-banner-sep">·</span>
        <a href="/research/CAI-x-HFTC-Policy-White-Paper-2026-No-1-CN.pdf" class="research-banner-link" target="_blank" rel="noopener">中文 PDF ↓</a>
        <span class="research-banner-sep">·</span>
        <a href="/content/#research" class="research-banner-link research-banner-more">Details →</a>
      </div>
    </div>`;

  document.body.insertAdjacentElement('afterbegin', banner);
  window.dispatchEvent(new Event('resize'));
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  window.__caiCloseMobileNav = closeMenu;
})();

// Section subnav active state (Content, Studio)
(function () {
  const nav = document.querySelector('.content-nav:not(.team-filter-nav)');
  if (!nav) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      return section ? { id, section, link } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  const hashId = location.hash.slice(1);
  if (hashId && sections.some((s) => s.id === hashId)) setActive(hashId);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach(({ section }) => observer.observe(section));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (sections.some((s) => s.id === id)) setActive(id);
  });
})();

// Team profile modal
(function () {
  const modal = document.getElementById('team-modal');
  if (!modal) return;

  const body = modal.querySelector('.team-modal-body');
  const panel = modal.querySelector('.team-modal-panel');
  let lastFocus = null;

  function openModal(memberId) {
    const source = document.getElementById('bio-' + memberId);
    if (!source || !body) return;

    body.innerHTML = source.innerHTML;
    body.querySelector('.team-modal-head h2')?.setAttribute('id', 'team-modal-title');

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

  panel?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
    const focusable = panel.querySelectorAll('button, a[href]');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  window.__caiCloseTeamModal = closeModal;
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

// Global Escape — close overlays
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  window.__caiCloseTeamModal?.();
  window.__caiCloseMobileNav?.();
});
