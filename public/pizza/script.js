

document.addEventListener('DOMContentLoaded', () => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const prefersReducedMotion = (() => {
    if (!('matchMedia' in window)) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  })();

  const isEmbedded = () => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };

  const getFocusableElements = (container) =>
    qsa(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => el instanceof HTMLElement && !el.hasAttribute('disabled') && el.tabIndex !== -1);

  function initHeaderScrollState() {
    const header = qs('header');
    if (!header) return;

    const root = document.documentElement;
    let lastScrolled = null;
    let syncTimer = 0;

    const syncHeaderOffset = () => {
      // Offset used by CSS `scroll-margin-top` to prevent anchor jumps being hidden behind the fixed header.
      const h = Math.ceil(header.getBoundingClientRect().height);
      root.style.setProperty('--header-offset', `${h}px`);
    };

    const scheduleHeaderOffsetSync = () => {
      requestAnimationFrame(syncHeaderOffset);
      window.clearTimeout(syncTimer);
      // Header padding animates; run one more sync after the transition settles.
      syncTimer = window.setTimeout(syncHeaderOffset, 500);
    };

    const onScroll = () => {
      const scrolled = window.scrollY > 20;
      header.classList.toggle('scrolled', scrolled);

      // Header height changes between scrolled/non-scrolled states.
      if (lastScrolled !== scrolled) {
        lastScrolled = scrolled;
        scheduleHeaderOffsetSync();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleHeaderOffsetSync, { passive: true });
    onScroll();
    scheduleHeaderOffsetSync();
    window.addEventListener('load', scheduleHeaderOffsetSync);
  }

  function initMobileNav() {
    const menuToggle = qs('.menu-toggle');
    const navLinks = qs('.nav-links');

    const setOpen = (open) => {
      if (!menuToggle || !navLinks) return;
      navLinks.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };

    const closeNav = () => setOpen(false);

    if (!menuToggle || !navLinks) return { closeNav };

    setOpen(false);

    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!navLinks.classList.contains('open'));
    });

    qsa('a', navLinks).forEach((a) => a.addEventListener('click', closeNav));

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (navLinks.contains(target) || menuToggle.contains(target)) return;
      closeNav();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!navLinks.classList.contains('open')) return;
      e.preventDefault();
      closeNav();
      menuToggle.focus();
    });

    return { closeNav };
  }

  function extractMenuItemsFromBook() {
    const items = [];

    qsa('.visual-menu-item').forEach((item) => {
      const nameEl = qs('.menu-header h4', item);
      const priceEl = qs('.menu-header .price', item);
      if (!nameEl || !priceEl) return;

      const name = nameEl.textContent?.trim() ?? '';
      const price = priceEl.textContent?.trim() ?? '';
      if (!name || !price) return;

      items.push({ name, price });
    });

    const seen = new Set();
    return items.filter((i) => {
      if (seen.has(i.name)) return false;
      seen.add(i.name);
      return true;
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function initOrderModal({ closeNav }) {
    const orderModal = qs('#order-modal');
    const orderForm = qs('#order-form');
    const closeModalBtn = orderModal ? qs('.close-modal', orderModal) : null;
    const modalContent = orderModal ? qs('.modal-content', orderModal) : null;

    const nameInput = qs('#name');
    const pizzaSelect = qs('#pizza-select');
    const addressInput = qs('#address');
    const embedNote = qs('#order-embed-note');
    const statusEl = qs('#order-status');

    const actionButtons = orderForm ? qsa('[data-order-action]', orderForm) : [];
    const embedded = isEmbedded();

    let lastTrigger = null;
    let previousBodyOverflow = '';

    const setStatus = (msg) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
    };

    const openOrderModal = (trigger) => {
      if (!orderModal) return;
      lastTrigger = trigger || null;
      previousBodyOverflow = document.body.style.overflow;

      orderModal.classList.add('show');
      orderModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      setStatus('');
      if (embedded && embedNote) embedNote.hidden = false;

      setTimeout(() => {
        if (nameInput && typeof nameInput.focus === 'function') nameInput.focus();
      }, 0);

      // Focus trap (Tab cycling) while modal is open.
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeOrderModal();
          return;
        }

        if (e.key !== 'Tab') return;
        if (!modalContent) return;

        const focusables = getFocusableElements(modalContent);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
          return;
        }

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      orderModal.__onKeyDown = onKeyDown;
      document.addEventListener('keydown', onKeyDown);
    };

    const closeOrderModal = () => {
      if (!orderModal) return;
      orderModal.classList.remove('show');
      orderModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = previousBodyOverflow;

      const onKeyDown = orderModal.__onKeyDown;
      if (typeof onKeyDown === 'function') {
        document.removeEventListener('keydown', onKeyDown);
      }
      delete orderModal.__onKeyDown;

      if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
      lastTrigger = null;
    };

    // Populate select from the visible menu so names/prices never drift.
    if (pizzaSelect) {
      const placeholder = pizzaSelect.querySelector('option[value=\"\"]') ?? null;
      const menuItems = extractMenuItemsFromBook();

      if (menuItems.length > 0) {
        pizzaSelect.innerHTML = '';
        if (placeholder) pizzaSelect.appendChild(placeholder);

        menuItems.forEach(({ name, price }) => {
          const opt = document.createElement('option');
          opt.value = slugify(name);
          opt.textContent = `${name} — ${price}`;
          pizzaSelect.appendChild(opt);
        });

        pizzaSelect.selectedIndex = 0;
      }
    }

    if (embedded && embedNote) embedNote.hidden = false;

    // Disable external actions when embedded (iframe sandbox blocks opening apps/urls).
    if (embedded) {
      actionButtons.forEach((btn) => {
        const action = btn.getAttribute('data-order-action');
        if (action === 'whatsapp' || action === 'email') {
          btn.setAttribute('aria-disabled', 'true');
          btn.setAttribute('disabled', 'true');
        }
      });
    }

    // Prevent enter-key submits from reloading the page.
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setStatus('Bitte wähle eine Aktion (WhatsApp, E-Mail oder Kopieren).');
      });
    }

    const buildOrderMessage = () => {
      const name = nameInput?.value?.trim() ?? '';
      const pizza = pizzaSelect && pizzaSelect.selectedIndex > 0 ? pizzaSelect.options[pizzaSelect.selectedIndex]?.text : '';
      const address = addressInput?.value?.trim() ?? '';

      const lines = ['Hallo Luna Rossa Team,', '', 'ich möchte gern bestellen:', ''];
      if (name) lines.push(`Name: ${name}`);
      if (pizza) lines.push(`Pizza: ${pizza}`);
      if (address) lines.push(`Adresse: ${address}`);
      lines.push('', 'Danke!');
      return lines.join('\n');
    };

    const reportFormValidity = () => {
      if (!orderForm) return true;
      if (typeof orderForm.reportValidity !== 'function') return true;
      return orderForm.reportValidity();
    };

    const copyToClipboard = async (text) => {
      if (!text) return false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch {
          // Fall through to legacy fallback.
        }
      }

      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', 'true');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    };

    const ORDER_EMAIL = 'info@lunarossa-ristorante.it';
    const WHATSAPP_NUMBER = '49123456789'; // Placeholder: +49 123 456 789

    actionButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();

        const action = btn.getAttribute('data-order-action');
        if (!action) return;

        if (!reportFormValidity()) return;

        const message = buildOrderMessage();

        if (action === 'copy') {
          const ok = await copyToClipboard(message);
          setStatus(ok ? 'Bestelltext kopiert.' : 'Kopieren fehlgeschlagen. Bitte manuell markieren und kopieren.');
          return;
        }

        if (embedded) {
          setStatus('In der eingebetteten Demo sind externe Links gesperrt. Bitte im Vollbild öffnen.');
          return;
        }

        if (action === 'whatsapp') {
          const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
          window.location.assign(url);
          return;
        }

        if (action === 'email') {
          const subject = 'Bestellung – Ristorante Luna Rossa';
          const url = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
          window.location.assign(url);
        }
      });
    });

    // Triggers
    qsa('a[href=\"#order\"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        closeNav?.();
        openOrderModal(a);
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeOrderModal();
      });
    }

    if (orderModal) {
      orderModal.setAttribute('aria-hidden', orderModal.classList.contains('show') ? 'false' : 'true');
      orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeOrderModal();
      });
    }

    return { closeOrderModal };
  }

  function initBook() {
    const book = qs('#book');
    const bookActionBtn = qs('#book-action-btn');
    const prevPageBtn = qs('#prev-page-btn');
    const nextPageBtn = qs('#next-page-btn');
    const papers = qsa('.paper-sheet');

    if (!book || papers.length === 0) return { isOpen: () => false };

    let isOpen = false;
    let currentLocation = 1;
    const numOfPapers = papers.length;
    const maxLocation = numOfPapers + 1;

    // Stack order (right side). Left stacking is handled on flip.
    papers.forEach((paper, index) => {
      paper.style.zIndex = String(numOfPapers - index);
    });

    const updateControls = () => {
      if (bookActionBtn) {
        bookActionBtn.textContent = isOpen ? 'Karte schließen ↩' : 'Karte öffnen ✨';
        bookActionBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }

      const canGoPrev = currentLocation > 1;
      const canGoNext = currentLocation < maxLocation;

      if (prevPageBtn) prevPageBtn.disabled = !canGoPrev;
      if (nextPageBtn) nextPageBtn.disabled = !canGoNext;

      const controls = qs('.book-controls');
      if (controls) controls.dataset.bookOpen = isOpen ? 'true' : 'false';
    };

    const setBookState = (open) => {
      isOpen = open;
      book.classList.toggle('state-open', isOpen);
      book.classList.remove('is-tilting');
      book.style.setProperty('--tilt-x', '0deg');
      book.style.setProperty('--tilt-y', '0deg');
      updateControls();
    };

    const goNextPage = () => {
      if (currentLocation >= maxLocation) return;
      const currentPaper = papers[currentLocation - 1];
      currentPaper.classList.add('flipped');
      currentPaper.style.zIndex = String(currentLocation);
      currentLocation += 1;
      updateControls();
    };

    const goPrevPage = () => {
      if (currentLocation <= 1) return;
      const prevPaper = papers[currentLocation - 2];
      prevPaper.classList.remove('flipped');
      const originalIndex = currentLocation - 2;
      prevPaper.style.zIndex = String(numOfPapers - originalIndex);
      currentLocation -= 1;
      updateControls();
    };

    if (bookActionBtn) {
      bookActionBtn.addEventListener('click', () => setBookState(!isOpen));
    }

    if (prevPageBtn) prevPageBtn.addEventListener('click', goPrevPage);
    if (nextPageBtn) nextPageBtn.addEventListener('click', goNextPage);

    // Click cover opens book.
    const cover = qs('.hardcover-front');
    if (cover) {
      cover.addEventListener('click', () => {
        if (!isOpen) setBookState(true);
      });
    }

    // Corner hitboxes.
    qsa('.page.front-side .corner-hitbox').forEach((hitbox) => {
      hitbox.addEventListener('click', (e) => {
        e.stopPropagation();
        goNextPage();
      });
    });

    qsa('.page.back-side .corner-hitbox').forEach((hitbox) => {
      hitbox.addEventListener('click', (e) => {
        e.stopPropagation();
        goPrevPage();
      });
    });

    updateControls();

    return { isOpen: () => isOpen, setBookState };
  }

  function initHeroEffects({ bookApi }) {
    const hero = qs('.hero');
    const heroContent = qs('.hero-content');
    const heroImage = qs('.hero-image');
    const book = qs('#book');

    // Parallax
    if (!prefersReducedMotion && hero && (heroContent || heroImage)) {
      let latestY = 0;
      let ticking = false;
      let heroEnd = 1000;

      const measure = () => {
        heroEnd = hero.offsetTop + hero.offsetHeight;
      };

      const flush = () => {
        ticking = false;
        const scrolled = latestY;

        if (scrolled <= heroEnd) {
          if (heroContent) heroContent.style.transform = `translate3d(0, ${Math.round(scrolled * 0.4)}px, 0)`;
          if (heroImage) heroImage.style.transform = `translate3d(0, ${Math.round(scrolled * 0.2)}px, 0)`;
          return;
        }

        if (heroContent) heroContent.style.transform = '';
        if (heroImage) heroImage.style.transform = '';
      };

      const onScroll = () => {
        latestY = window.scrollY;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(flush);
        }
      };

      window.addEventListener('resize', measure, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      measure();
      onScroll();
    }

    // Subtle tilt (CSS variables), disabled when open/reduced motion.
    if (!prefersReducedMotion && book) {
      book.style.setProperty('--tilt-x', '0deg');
      book.style.setProperty('--tilt-y', '0deg');

      const onMove = (e) => {
        if (bookApi?.isOpen?.()) return;
        const rect = book.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        const tiltY = Math.max(-6, Math.min(6, dx * 6));
        const tiltX = Math.max(-4, Math.min(4, dy * -4));

        book.classList.add('is-tilting');
        book.style.setProperty('--tilt-x', `${tiltX}deg`);
        book.style.setProperty('--tilt-y', `${tiltY}deg`);
      };

      const onLeave = () => {
        book.classList.remove('is-tilting');
        book.style.setProperty('--tilt-x', '0deg');
        book.style.setProperty('--tilt-y', '0deg');
      };

      book.addEventListener('mousemove', onMove);
      book.addEventListener('mouseleave', onLeave);
    }
  }

  initHeaderScrollState();
  const { closeNav } = initMobileNav();
  const { closeOrderModal } = initOrderModal({ closeNav });
  const bookApi = initBook();
  initHeroEffects({ bookApi });

  // Global escape: close mobile nav + modal if open.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeNav?.();
    closeOrderModal?.();
  });
});
