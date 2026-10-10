/**
 * ARIANNA C. SURBANO - INTERACTIVE PORTFOLIO ENGINE
 * Features:
 * - Dynamic typing effect
 * - Dark / Light theme toggle with persistence
 * - Scroll-spy navigation & mobile drawer
 * - Interactive Projects Carousel (unified, 1-per-view with screenshot slider & zoom)
 * - Interactive Certifications Carousel (responsive multi-card track with swipe & pagination)
 * - Fullscreen Lightbox Modal for gallery previews
 * - Quick Resume summary modal with print support
 * - Copy to clipboard with interactive toast alerts
 * - Form validation with live feedback
 * - Interactive 3D tilt cards
 * - Ambient canvas constellation particles
 * - Scroll-to-top button with circular SVG progress indicator
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. CURRENT YEAR IN FOOTER ---
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  // --- 2. TOAST NOTIFICATION SYSTEM ---
  const toastContainer = document.getElementById('toast-container');
  const showToast = (message, icon = '✓') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  };

  // --- 3. THEME TOGGLE (DARK / LIGHT) ---
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  
  // Ensure dark theme is the active default and reset accidental light mode
  let savedTheme = localStorage.getItem('arianna_theme');
  if (!savedTheme || savedTheme === 'light') {
    savedTheme = 'dark';
    localStorage.setItem('arianna_theme', 'dark');
  }

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('arianna_theme', theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0d0413' : '#f8f4f9');
    }
  };

  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
  });

  // --- 4. SCROLL PROGRESS BAR & SCROLL TO TOP ---
  const progressBar = document.getElementById('scroll-progress-bar');
  const scrollTopBtn = document.getElementById('scroll-to-top');
  const scrollCircle = document.getElementById('scroll-circle');
  const circleCircumference = 2 * Math.PI * 20;

  if (scrollCircle) {
    scrollCircle.style.strokeDasharray = `${circleCircumference}`;
    scrollCircle.style.strokeDashoffset = `${circleCircumference}`;
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent * 100}%`;
    }

    if (scrollTopBtn && scrollCircle) {
      if (scrollTop > 320) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }

      const offset = circleCircumference - (scrollPercent * circleCircumference);
      scrollCircle.style.strokeDashoffset = `${offset}`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 5. RESPONSIVE SIDE NAVIGATION & SCROLL-SPY ---
  const siteHeader = document.querySelector('.site-header');
  const sideNavToggle = document.getElementById('side-nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (siteHeader) {
    const scrollThreshold = 140;
    const smallScreen = window.matchMedia('(max-width: 980px)');

    const updateSideNav = () => {
      const shouldUseSideNav = smallScreen.matches || window.scrollY > scrollThreshold;

      if (shouldUseSideNav) {
        siteHeader.classList.add('side-nav');
      } else {
        siteHeader.classList.remove('side-nav');
        siteHeader.classList.remove('side-nav-collapsed');
        if (sideNavToggle) {
          sideNavToggle.setAttribute('aria-label', 'Hide side menu');
          sideNavToggle.setAttribute('aria-expanded', 'true');
        }
      }
    };

    const toggleSideNav = (e) => {
      e?.stopPropagation();
      const collapsed = siteHeader.classList.toggle('side-nav-collapsed');
      if (sideNavToggle) {
        sideNavToggle.setAttribute('aria-label', collapsed ? 'Show side menu' : 'Hide side menu');
        sideNavToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      }
    };

    sideNavToggle?.addEventListener('click', toggleSideNav);

    window.addEventListener('scroll', updateSideNav, { passive: true });
    window.addEventListener('resize', updateSideNav);
    if (typeof smallScreen.addEventListener === 'function') {
      smallScreen.addEventListener('change', updateSideNav);
    }

    updateSideNav();
  }

  // Active section scroll-spy
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });

  sections.forEach((sec) => sectionObserver.observe(sec));

  // Smooth scroll click handler
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: 'smooth' });
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // --- 6. DYNAMIC TYPING EFFECT ---
  const typingNode = document.getElementById('typing-text');
  if (typingNode) {
    const phrases = [
      'Backend Developer',
      'BSIT Senior Student',
      'Database Architect',
      'System Solutions Builder',
      'Continuous Learner'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingNode.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        typingNode.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 95;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 450;
      }

      setTimeout(typeLoop, typeSpeed);
    };

    setTimeout(typeLoop, 800);
  }

  // --- 7. STATS COUNTER ANIMATION ---
  const statNumbers = document.querySelectorAll('[data-counter]');
  let statsCounted = false;

  const countUp = () => {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-counter'), 10);
      let count = 0;
      const speed = target > 50 ? 25 : 80;
      const step = Math.ceil(target / 20) || 1;

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, speed);
    });
  };

  const heroSection = document.getElementById('profile');
  if (heroSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        countUp();
        statsObserver.disconnect();
      }
    }, { threshold: 0.15 });
    statsObserver.observe(heroSection);
  }

  // --- 8. INTERNAL PROJECT SCREENSHOT SLIDERS ---
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const images = Array.from(slider.querySelectorAll('.slide img'));
    const dotsContainer = slider.querySelector('.slider-dots');

    if (!track || slides.length < 2) return;

    let currentIndex = 0;
    let autoInterval = null;
    const projectTitle = slider.closest('.project-carousel-card')?.querySelector('.project-title')?.textContent.trim() || 'Project Preview';
    const galleryImages = images.map((image) => image.getAttribute('src')).filter(Boolean);

    images.forEach((image, index) => {
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `View full-size image: ${image.alt}`);
      image.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
      image.setAttribute('data-lightbox', galleryImages.join(','));
      image.setAttribute('data-title', projectTitle);
      image.setAttribute('data-lightbox-index', String(index));
      image.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          image.click();
        }
      });
    });

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(i);
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      images.forEach((image, index) => {
        image.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
      });
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      }
    };

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      updateSlider();
    };

    // Touch swipe support on screenshot slider
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });

    const startAutoPlay = () => {
      if (autoInterval || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      autoInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4200);
    };

    const stopAutoPlay = () => {
      if (!autoInterval) return;
      clearInterval(autoInterval);
      autoInterval = null;
    };

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    updateSlider();
    startAutoPlay();
  });

  // --- 9. UNIFIED PROJECTS CAROUSEL (NO CATEGORIES) ---
  const projectTrack = document.getElementById('project-carousel-track');
  const projectCards = projectTrack ? Array.from(projectTrack.children) : [];
  const projectPrevBtn = document.getElementById('project-carousel-prev');
  const projectNextBtn = document.getElementById('project-carousel-next');
  const projectDotsContainer = document.getElementById('project-carousel-dots');
  const projectCounter = document.getElementById('project-carousel-counter');

  if (projectTrack && projectCards.length > 0) {
    let currentProjectIndex = 0;

    // Render dot indicators
    if (projectDotsContainer) {
      projectDotsContainer.innerHTML = '';
      projectCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to project ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentProjectIndex = i;
          updateProjectCarousel();
        });
        projectDotsContainer.appendChild(dot);
      });
    }

    const updateProjectCarousel = () => {
      projectTrack.style.transform = `translateX(-${currentProjectIndex * 100}%)`;
      projectCards.forEach((card, i) => {
        card.classList.toggle('is-current', i === currentProjectIndex);
      });

      if (projectCounter) {
        projectCounter.textContent = `Project ${currentProjectIndex + 1} of ${projectCards.length}`;
      }

      if (projectDotsContainer) {
        const dots = projectDotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentProjectIndex));
      }
    };

    projectPrevBtn?.addEventListener('click', () => {
      currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
      updateProjectCarousel();
    });

    projectNextBtn?.addEventListener('click', () => {
      currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
      updateProjectCarousel();
    });

    // Touch swipe for projects carousel
    const projectViewport = document.getElementById('project-carousel-viewport');
    let projectTouchStartX = 0;
    let projectSwipeStarted = false;
    projectViewport?.addEventListener('touchstart', (e) => {
      if (e.target.closest('.project-slider')) return;
      projectSwipeStarted = true;
      projectTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    projectViewport?.addEventListener('touchend', (e) => {
      if (!projectSwipeStarted) return;
      projectSwipeStarted = false;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = projectTouchStartX - touchEndX;
      if (Math.abs(diff) > 55) {
        if (diff > 0) {
          currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
        } else {
          currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
        }
        updateProjectCarousel();
      }
    }, { passive: true });

    updateProjectCarousel();
  }

  // --- 10. UNIFIED CERTIFICATIONS & WEBINARS CAROUSEL ---
  const certTrack = document.getElementById('cert-carousel-track');
  const certCards = certTrack ? Array.from(certTrack.children) : [];
  const certPrevBtn = document.getElementById('cert-carousel-prev');
  const certNextBtn = document.getElementById('cert-carousel-next');
  const certDotsContainer = document.getElementById('cert-carousel-dots');
  const certCounter = document.getElementById('cert-carousel-counter');
  const certViewport = document.getElementById('cert-carousel-viewport');

  if (certTrack && certCards.length > 0) {
    let currentCertIndex = 0;

    const getVisibleCertCards = () => {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 991) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      return Math.max(0, certCards.length - getVisibleCertCards());
    };

    const getCertPageStarts = () => {
      const visible = getVisibleCertCards();
      const maxIndex = getMaxIndex();
      const pageStarts = [];

      for (let index = 0; index < maxIndex; index += visible) {
        pageStarts.push(index);
      }
      if (pageStarts.length === 0 || pageStarts[pageStarts.length - 1] !== maxIndex) {
        pageStarts.push(maxIndex);
      }

      return pageStarts;
    };

    const getCurrentCertPage = (pageStarts) => {
      let currentPage = 0;
      pageStarts.forEach((start, page) => {
        if (Math.abs(start - currentCertIndex) < Math.abs(pageStarts[currentPage] - currentCertIndex)) {
          currentPage = page;
        }
      });
      return currentPage;
    };

    const renderCertDots = (pageStarts, currentPage) => {
      if (!certDotsContainer) return;

      certDotsContainer.innerHTML = '';
      pageStarts.forEach((start, p) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to certificate page ${p + 1}`);
        if (p === currentPage) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentCertIndex = start;
          updateCertCarousel();
        });
        certDotsContainer.appendChild(dot);
      });
    };

    const updateCertCarousel = () => {
      const visible = getVisibleCertCards();
      const maxIndex = getMaxIndex();
      currentCertIndex = Math.min(Math.max(0, currentCertIndex), maxIndex);
      const pageStarts = getCertPageStarts();
      const currentPage = getCurrentCertPage(pageStarts);
      currentCertIndex = pageStarts[currentPage];

      if (certCards.length > 0) {
        const firstCard = certCards[0];
        const gap = parseFloat(window.getComputedStyle(certTrack).columnGap) || 0;
        const cardWidth = firstCard.offsetWidth;
        const offset = currentCertIndex * (cardWidth + gap);
        certTrack.style.transform = `translateX(-${offset}px)`;
      }

      certCards.forEach((card, i) => {
        card.classList.toggle('is-current', i >= currentCertIndex && i < currentCertIndex + visible);
      });

      if (certCounter) {
        const start = currentCertIndex + 1;
        const end = Math.min(currentCertIndex + visible, certCards.length);
        certCounter.textContent = `${start} to ${end} of ${certCards.length}`;
      }

      renderCertDots(pageStarts, currentPage);
    };

    const moveCertPage = (direction) => {
      const pageStarts = getCertPageStarts();
      const currentPage = getCurrentCertPage(pageStarts);
      const nextPage = Math.min(Math.max(0, currentPage + direction), pageStarts.length - 1);
      currentCertIndex = pageStarts[nextPage];
      updateCertCarousel();
    };

    certPrevBtn?.addEventListener('click', () => moveCertPage(-1));
    certNextBtn?.addEventListener('click', () => moveCertPage(1));

    // Touch swipe for certs carousel
    let certTouchStartX = 0;
    certViewport?.addEventListener('touchstart', (e) => {
      certTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    certViewport?.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = certTouchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        moveCertPage(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    window.addEventListener('resize', updateCertCarousel);
    setTimeout(updateCertCarousel, 150);
  }

  // --- 12. FULLSCREEN LIGHTBOX MODAL ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

  let lightboxImages = [];
  let currentLightboxIndex = 0;

  const openLightbox = (images, title = 'Image Preview', startIndex = 0) => {
    if (!lightboxModal || !images || images.length === 0) return;
    lightboxImages = images;
    currentLightboxIndex = startIndex;
    if (lightboxTitle) lightboxTitle.textContent = title;

    updateLightboxView();
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const updateLightboxView = () => {
    if (!lightboxImg || lightboxImages.length === 0) return;
    lightboxImg.src = lightboxImages[currentLightboxIndex];

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} of ${lightboxImages.length}`;
    }

    if (lightboxPrev && lightboxNext) {
      const single = lightboxImages.length <= 1;
      lightboxPrev.style.display = single ? 'none' : 'grid';
      lightboxNext.style.display = single ? 'none' : 'grid';
    }
  };

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const raw = trigger.getAttribute('data-lightbox');
      const title = trigger.getAttribute('data-title') || 'Preview';
      if (!raw) return;
      const imagesList = raw.split(',').map((s) => s.trim()).filter(Boolean);
      const startIndex = Number.parseInt(trigger.getAttribute('data-lightbox-index') || '0', 10);
      openLightbox(imagesList, title, Number.isInteger(startIndex) ? startIndex : 0);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  lightboxPrev?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxView();
  });

  lightboxNext?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightboxView();
  });

  window.addEventListener('keydown', (e) => {
    if (lightboxModal?.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    }
  });

  // --- 13. QUICK RESUME MODAL ---
  const resumeModal = document.getElementById('resume-modal');
  const resumeBtn = document.getElementById('resume-preview-btn');
  const resumeClose = document.getElementById('resume-close');
  const resumeDismiss = document.getElementById('resume-dismiss-btn');
  const resumeBackdrop = document.querySelector('.resume-backdrop');
  const resumePrint = document.getElementById('resume-print-btn');

  const openResume = () => {
    resumeModal?.classList.add('open');
    resumeModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeResume = () => {
    resumeModal?.classList.remove('open');
    resumeModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  resumeBtn?.addEventListener('click', openResume);
  resumeClose?.addEventListener('click', closeResume);
  resumeDismiss?.addEventListener('click', closeResume);
  resumeBackdrop?.addEventListener('click', closeResume);
  resumePrint?.addEventListener('click', () => {
    window.print();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal?.classList.contains('open')) {
      closeResume();
    }
  });

  // --- 14. COPY TO CLIPBOARD BUTTONS ---
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      const fallbackCopy = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast(`Copied to clipboard: ${text}`);
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);
        } catch (err) {
          showToast('Failed to copy', '✕');
        }
        document.body.removeChild(textarea);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);
        }).catch(() => fallbackCopy(textToCopy));
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  // --- 15. CONTACT FORM VALIDATION & SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const charCounter = document.getElementById('char-counter');
  const messageInput = document.getElementById('contact-message');
  const contactFormStatus = document.getElementById('contact-form-status');

  messageInput?.addEventListener('input', () => {
    const len = messageInput.value.length;
    if (charCounter) {
      charCounter.textContent = `${len} / 500`;
    }
  });

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    let hasError = false;

    document.querySelectorAll('.form-group').forEach((g) => g.classList.remove('has-error'));

    if (!nameInput?.value.trim()) {
      nameInput?.closest('.form-group')?.classList.add('has-error');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput?.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput?.closest('.form-group')?.classList.add('has-error');
      hasError = true;
    }

    if (!messageInput?.value.trim()) {
      messageInput?.closest('.form-group')?.classList.add('has-error');
      hasError = true;
    }

    if (hasError) {
      if (contactFormStatus) contactFormStatus.textContent = 'Please complete the required fields with valid information.';
      showToast('Please check required fields', '⚠️');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn instanceof HTMLButtonElement) {
      const originalButtonContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
      if (contactFormStatus) contactFormStatus.textContent = 'Sending your message...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/ariannasurbano64@gmail.com', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(new FormData(contactForm).entries()))
        });
        const result = await response.json();

        if (!response.ok || result.success !== 'true') {
          throw new Error(result.message || 'The email service could not accept your message.');
        }

        showToast('Your message was sent successfully.', '✉️');
        if (contactFormStatus) {
          contactFormStatus.textContent = 'Your message was submitted. Thank you for reaching out!';
        }
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';
      } catch (error) {
        console.error('Contact form submission failed:', error);
        const errorMessage = 'Your message could not be sent. Please try again or email ariannasurbano64@gmail.com directly.';
        if (contactFormStatus) contactFormStatus.textContent = errorMessage;
        showToast('Unable to send your message. Please try again.', '⚠️');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonContent;
      }
    }
  });

  // --- 16. 3D TILT EFFECT ON CARDS ---
  const tiltCard = document.getElementById('hero-profile-card');
  if (tiltCard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  // --- 17. SCROLL REVEAL OBSERVER ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((r, i) => {
    r.style.transitionDelay = `${(i % 3) * 80}ms`;
    revealObserver.observe(r);
  });

  // --- 18. AMBIENT CONSTELLATION CANVAS ---
  const canvas = document.getElementById('ambient-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.8 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 111, 177, ${this.alpha})`
          : `rgba(225, 29, 120, ${this.alpha * 0.6})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const maxDist = 120;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(168, 85, 247, ${alpha})`
              : `rgba(139, 92, 246, ${alpha * 0.7})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    initParticles();
    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }
});
