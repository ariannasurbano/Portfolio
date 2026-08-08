const siteHeader = document.querySelector('.site-header');
const sideNavToggle = document.querySelector('.side-nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const sliders = document.querySelectorAll('[data-slider]');
const cards = document.querySelectorAll('.professional-card');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

cards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });

  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 70}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

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

  const toggleSideNav = () => {
    if (!siteHeader) return;

    const collapsed = siteHeader.classList.toggle('side-nav-collapsed');
    if (sideNavToggle) {
      sideNavToggle.setAttribute('aria-label', collapsed ? 'Show side menu' : 'Hide side menu');
      sideNavToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
  };

  sideNavToggle?.addEventListener('click', toggleSideNav);

  window.addEventListener('scroll', updateSideNav, { passive: true });
  window.addEventListener('resize', updateSideNav);
  updateSideNav();

  // --- Drag-to-move support for small devices ---
  const dragState = {
    active: false,
    startX: 0,
    startY: 0,
    startTop: 0,
    startRight: 0,
    width: 0,
    height: 0,
    moved: false,
  };

  const onPointerDown = (e) => {
    if (!siteHeader.classList.contains('side-nav')) return;
    if (!smallScreen.matches) return;
    // don't start drag when interacting with links; allow starting from the toggle
    if (e.target.closest('a')) return;
    if (e.target.closest('button') && !e.target.closest('.side-nav-toggle')) return;

    const rect = siteHeader.getBoundingClientRect();
    dragState.active = true;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.startTop = rect.top;
    dragState.startRight = window.innerWidth - rect.right;
    dragState.width = rect.width;
    dragState.height = rect.height;
    dragState.moved = false;

    siteHeader.style.transition = 'none';
    try { siteHeader.setPointerCapture(e.pointerId); } catch (err) {}
  };

  const onPointerMove = (e) => {
    if (!dragState.active) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    if (!dragState.moved && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      dragState.moved = true;
    }

    let newTop = dragState.startTop + dy;
    let newRight = dragState.startRight - dx;

    // clamp inside viewport with small padding
    const minTop = 8;
    const maxTop = window.innerHeight - dragState.height - 8;
    const minRight = 8;
    const maxRight = window.innerWidth - dragState.width - 8;

    if (newTop < minTop) newTop = minTop;
    if (newTop > maxTop) newTop = maxTop;
    if (newRight < minRight) newRight = minRight;
    if (newRight > maxRight) newRight = maxRight;

    siteHeader.style.top = `${Math.round(newTop)}px`;
    siteHeader.style.right = `${Math.round(newRight)}px`;
    siteHeader.style.left = 'auto';
  };

  const onPointerUp = (e) => {
    if (!dragState.active) return;
    dragState.active = false;
    siteHeader.style.transition = 'top 0.15s ease, right 0.15s ease';
    try { siteHeader.releasePointerCapture(e.pointerId); } catch (err) {}
    // reset moved flag shortly after release to allow the next click normally
    window.setTimeout(() => { dragState.moved = false; }, 50);
  };

  siteHeader.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // Prevent the toggle's click action if the user was dragging (started on the toggle)
  sideNavToggle?.addEventListener('click', (e) => {
    if (dragState.moved) {
      e.preventDefault();
      e.stopImmediatePropagation();
      dragState.moved = false;
    }
  }, true);
}

sliders.forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const slides = slider.querySelectorAll('.slide');

  if (!track || slides.length < 2) {
    return;
  }

  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 3500);
});

const projectCarousel = document.querySelector('[data-project-carousel]');
const projectTrack = projectCarousel?.querySelector('.projects-track');
const projectCards = projectTrack ? Array.from(projectTrack.children) : [];
const projectPrevButton = document.querySelector('[data-project-prev]');
const projectNextButton = document.querySelector('[data-project-next]');
const projectDots = document.querySelector('[data-project-dots]');

if (projectCarousel && projectTrack && projectCards.length > 1) {
  let currentProjectIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const updateProjectCarousel = () => {
    projectTrack.style.transform = `translateX(-${currentProjectIndex * 100}%)`;

    projectCards.forEach((card, index) => {
      card.classList.toggle('is-active', index === currentProjectIndex);
    });

    projectDots?.querySelectorAll('button').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentProjectIndex);
    });
  };

  projectCards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to project ${index + 1}`);
    dot.addEventListener('click', () => {
      currentProjectIndex = index;
      updateProjectCarousel();
    });
    projectDots?.appendChild(dot);
  });

  projectPrevButton?.addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
    updateProjectCarousel();
  });

  projectNextButton?.addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
    updateProjectCarousel();
  });

  projectCarousel.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  projectCarousel.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 50) {
      return;
    }

    if (distance < 0) {
      currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
    } else {
      currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
    }

    updateProjectCarousel();
  }, { passive: true });

  updateProjectCarousel();
}
