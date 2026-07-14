// CAI Global — shared front-end behavior
document.documentElement.classList.add('js');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    io.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

function setOverlayInert(active) {
  const main = document.getElementById('main');
  const footer = document.querySelector('footer');
  if (main) main.inert = active;
  if (footer) footer.inert = active;
}

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
  toggle.setAttribute('aria-controls', 'mobile-nav-panel');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('nav');
  panel.className = 'mobile-nav-panel';
  panel.id = 'mobile-nav-panel';
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
    setOverlayInert(true);
    panel.querySelector('a')?.focus();
  }

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
    if (!document.getElementById('team-modal')?.classList.contains('is-open')) {
      setOverlayInert(false);
    }
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (mobileNav.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMenu();
  });

  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !mobileNav.classList.contains('is-open')) return;
    const focusable = panel.querySelectorAll('a[href]');
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  window.__caiCloseMobileNav = closeMenu;
})();

// Nav active state from current path
(function () {
  function navKey(pathname) {
    if (pathname === '/' || (pathname.endsWith('/index.html') && pathname.split('/').filter(Boolean).length <= 1)) {
      return 'home';
    }
    if (pathname.includes('/content')) return 'content';
    if (pathname.includes('/ecosystem')) return 'ecosystem';
    const file = pathname.split('/').pop() || '';
    return file.replace('.html', '') || 'home';
  }

  function linkKey(href) {
    if (href === '/' || href === '/index.html') return 'home';
    if (href.includes('/content')) return 'content';
    if (href.includes('/ecosystem')) return 'ecosystem';
    return href.split('/').pop().replace('.html', '');
  }

  const current = navKey(location.pathname);
  document.querySelectorAll('.nav-links a, .mobile-nav-panel a').forEach((link) => {
    const key = linkKey(link.getAttribute('href'));
    link.classList.toggle('active', key === current && current !== 'home');
  });
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

  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.set(entry.target.id, entry.boundingClientRect.top);
        } else {
          visible.delete(entry.target.id);
        }
      });
      if (!visible.size) return;
      const topId = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
      setActive(topId);
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
    setOverlayInert(true);
    modal.querySelector('.team-modal-close')?.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    body.innerHTML = '';
    if (!document.querySelector('.mobile-nav.is-open')) {
      setOverlayInert(false);
    }
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
  const validFilters = [...buttons].map((btn) => btn.dataset.teamFilter);

  function activate(filter) {
    if (!validFilters.includes(filter)) return;
    buttons.forEach((btn) => {
      const isActive = btn.dataset.teamFilter === filter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    groupsWrap.dataset.active = filter;
    groups.forEach((group) => {
      group.hidden = group.dataset.teamGroup !== filter;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activate(btn.dataset.teamFilter);
      history.replaceState(null, '', '#' + btn.dataset.teamFilter);
    });
  });

  const hashFilter = location.hash.slice(1);
  activate(validFilters.includes(hashFilter) ? hashFilter : 'leadership');
})();

// Global Escape — close overlays
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  window.__caiCloseTeamModal?.();
  window.__caiCloseMobileNav?.();
});
