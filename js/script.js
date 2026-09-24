document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header height (for mobile nav panel offset) ---------- */
  const setHeaderHeight = () => {
    const header = document.getElementById('siteHeader');
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  };
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navBackdrop = document.querySelector('.nav-backdrop');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (navBackdrop) navBackdrop.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    if (navBackdrop) navBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }
}

  /* ---------- Header shrink + shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    if (header) header.classList.toggle('is-scrolled', scrolled);
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Active nav link by current page ----------
     Each page's <body data-page="..."> tells us which nav item
     should be marked active — this is a multi-page site now,
     not a single-page anchor scroller, so we match on page id
     rather than scroll position. */
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active-link', link.dataset.page === currentPage);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Work gallery filter (present on work.html) ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  if (filterButtons.length && workCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;

        workCards.forEach(card => {
          const show = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- FAQ accordion (present on index.html) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        faqItems.forEach(other => {
          other.classList.remove('is-open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- Contact form validation (present on index.html) ---------- */
 /* ---------- Contact form + EmailJS ---------- */
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form && formNote) {

  // Initialize EmailJS
  emailjs.init({
    publicKey: '9rjlVEvFyYVvb-rcZ'
  });

  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const row = field.closest('.form-row');
    const errorEl = document.getElementById(`err-${fieldId}`);

    row.classList.toggle('has-error', Boolean(message));

    if (errorEl) {
      errorEl.textContent = message || '';
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Name validation
    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    } else {
      showError('name', '');
    }

    // Email validation
    if (!email) {
      showError('email', 'Please enter your email.');
      valid = false;
    } else if (!emailPattern.test(email)) {
      showError('email', 'Please enter a valid email.');
      valid = false;
    } else {
      showError('email', '');
    }

    // Message validation
    if (!message) {
      showError('message', 'Tell us a little about your project.');
      valid = false;
    } else {
      showError('message', '');
    }

    // Stop if validation fails
    if (!valid) {
      formNote.textContent = 'Please fix the highlighted fields.';
      formNote.classList.remove('success');
      return;
    }

    // Show sending message
    formNote.textContent = 'Sending your message...';
    formNote.classList.remove('success');

    // Send form through EmailJS
    emailjs.sendForm(
      'service_ngo2ahz',
      'template_8dp64dc',
      form
    )
    .then(() => {

      // Success
      formNote.textContent =
        `Thanks, ${name.split(' ')[0]}! Your message has been sent successfully. We'll reply within one business day.`;

      formNote.classList.add('success');

      // Clear the form
      form.reset();

    })
    .catch((error) => {

      // Error
      console.error('EmailJS Error:', error);

      formNote.textContent =
        'Sorry, your message could not be sent. Please try again or contact us directly.';

      formNote.classList.remove('success');

    });

  });
}
  /* ---------- Testimonial card centering (present on index.html) ---------- */
  const testimonialWrapper = document.querySelector('.testimonial-track-wrapper');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (testimonialWrapper && testimonialCards.length) {
    const centerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-centered', entry.isIntersecting);
      });
    }, {
      root: testimonialWrapper,
      rootMargin: '0px -42% 0px -42%',
      threshold: 0
    });

    testimonialCards.forEach(card => centerObserver.observe(card));
  }

    const wrapper = document.querySelector('.tilt-image');

  if (wrapper) {
    const img = wrapper.querySelector('img');

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = ((centerY - y) / centerY) * 8;

      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      img.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
  

  /* ---------- Hero parallax depth (present on index.html) ---------- */
  const parallaxStage = document.getElementById('heroParallax');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (parallaxStage && !prefersReducedMotion) {
    const parallaxLayers = parallaxStage.querySelectorAll('.parallax-layer');

    const depthFor = (layer) => {
      if (layer.classList.contains('layer-back')) return 10;
      if (layer.classList.contains('layer-mid')) return 22;
      return 34; // layer-front
    };

    parallaxStage.addEventListener('mousemove', (e) => {
      const rect = parallaxStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      parallaxLayers.forEach((layer) => {
        const depth = depthFor(layer);
        layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });

    parallaxStage.addEventListener('mouseleave', () => {
      parallaxLayers.forEach((layer) => {
        layer.style.transform = 'translate(0, 0)';
      });
    });
  }
  /* ---------- Work card image lightbox (present on work.html) ---------- */
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
 
  if (lightboxOverlay && lightboxTriggers.length) {
    let lastFocused = null;
 
    const openLightbox = (trigger) => {
      lastFocused = document.activeElement;
 
      lightboxImage.src = trigger.dataset.full || trigger.querySelector('img').src;
      lightboxImage.alt = trigger.querySelector('img')?.alt || '';
      lightboxCategory.textContent = trigger.dataset.category || '';
      lightboxTitle.textContent = trigger.dataset.title || '';
 
      lightboxOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };
 
    const closeLightbox = () => {
      lightboxOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };
 
    lightboxTriggers.forEach(trigger => {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'View full image: ' + (trigger.dataset.title || ''));
 
      trigger.addEventListener('click', () => openLightbox(trigger));
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(trigger);
        }
      });
 
      // The arrow button inside the same card also opens the lightbox
      const card = trigger.closest('.work-card');
      const arrow = card ? card.querySelector('.work-arrow') : null;
      if (arrow) {
        arrow.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(trigger);
        });
      }
    });
 
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  
 

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Craft editorial scroll-swap (present on about.html) ---------- */
  const craftSteps = document.querySelectorAll('.editorial-step');
  const craftImages = document.querySelectorAll('.craft-editorial-image .stage-img');
  const craftCurrent = document.getElementById('craftCurrent');

  if (craftSteps.length && craftImages.length) {
    const setCraftActive = (stepNum) => {
      craftSteps.forEach(s => s.classList.toggle('is-active', s.dataset.step === stepNum));
      craftImages.forEach(img => img.classList.toggle('is-active', img.dataset.step === stepNum));
      if (craftCurrent) craftCurrent.textContent = '0' + stepNum;
    };

    const craftObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCraftActive(entry.target.dataset.step);
        }
      });
    }, {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    craftSteps.forEach(step => craftObserver.observe(step));
  }
});
const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');

  if (lightboxOverlay && lightboxTriggers.length) {
    let lastFocused = null;

    const openLightbox = (trigger) => {
      lastFocused = document.activeElement;

      lightboxImage.src = trigger.dataset.full || trigger.querySelector('img').src;
      lightboxImage.alt = trigger.querySelector('img')?.alt || '';
      lightboxCategory.textContent = trigger.dataset.category || '';
      lightboxTitle.textContent = trigger.dataset.title || '';

      lightboxOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightboxOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    lightboxTriggers.forEach(trigger => {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'View full image: ' + (trigger.dataset.title || ''));

      trigger.addEventListener('click', () => openLightbox(trigger));
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(trigger);
        }
      });

      // The arrow button inside the same card also opens the lightbox
      const card = trigger.closest('.work-card');
      const arrow = card ? card.querySelector('.work-arrow') : null;
      if (arrow) {
        arrow.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(trigger);
        });
      }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

    /* ---------- Materials tabs (present on index.html) ---------- */
  const materialsTabs = document.querySelectorAll('.materials-tab');
  const materialsPanels = document.querySelectorAll('.materials-panel');

  if (materialsTabs.length && materialsPanels.length) {
    materialsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        materialsTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        materialsPanels.forEach(p => {
          p.classList.remove('is-active');
          p.hidden = true;
        });

        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const panel = document.getElementById(tab.dataset.target);
        panel.classList.add('is-active');
        panel.hidden = false;
      });
    });
  }
  