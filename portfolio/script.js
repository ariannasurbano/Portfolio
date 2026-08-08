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
