const siteHeader = document.querySelector('.site-header');
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
    }
  };

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
