// Слайдер с эффектом увеличения
const carousel = document.querySelector('#paintings-carousel');
const slides = Array.from(
  document.querySelectorAll('#paintings-track .painting-slide'),
);

let currentIndex = 0;

const AUTOPLAY_DELAY = 3500;
const SWIPE_THRESHOLD = 50;

let autoplayTimer = null;

let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;

function getIndex(index) {
  return (index + slides.length) % slides.length;
}

function renderSlides(direction = 1) {
  slides.forEach((slide) => {
    slide.classList.remove(
      'is-active',
      'is-prev',
      'is-next',
      'is-hidden-left',
      'is-hidden-right',
    );
  });

  const activeIndex = getIndex(currentIndex);
  const prevIndex = getIndex(currentIndex - 1);
  const nextIndex = getIndex(currentIndex + 1);

  const active = slides[activeIndex];
  const prev = slides[prevIndex];
  const next = slides[nextIndex];

  active.classList.add('is-active');
  prev.classList.add('is-prev');
  next.classList.add('is-next');

  slides.forEach((slide, index) => {
    if (index !== activeIndex && index !== prevIndex && index !== nextIndex) {
      if (direction > 0) {
        slide.classList.add('is-hidden-right');
      } else {
        slide.classList.add('is-hidden-left');
      }
    }
  });
}

function nextSlide() {
  currentIndex = getIndex(currentIndex + 1);
  renderSlides(1);
}

function prevSlide() {
  currentIndex = getIndex(currentIndex - 1);
  renderSlides(-1);
}

function startAutoplay() {
  stopAutoplay();

  autoplayTimer = setInterval(() => {
    nextSlide();
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

/*
 * Swipe start
 */
carousel.addEventListener(
  'touchstart',
  (event) => {
    if (!event.touches.length) return;

    stopAutoplay();

    isTouching = true;

    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
  },
  { passive: true },
);

/*
 * Swipe move
 */
carousel.addEventListener(
  'touchmove',
  (event) => {
    if (!isTouching || !event.touches.length) return;

    touchCurrentX = event.touches[0].clientX;
  },
  { passive: true },
);

/*
 * Swipe end
 */
carousel.addEventListener('touchend', () => {
  if (!isTouching) return;

  isTouching = false;

  const swipeDistance = touchCurrentX - touchStartX;

  if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
    if (swipeDistance < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  startAutoplay();
});

/*
 * Mouse support for testing on desktop
 */
let mouseStartX = 0;
let mouseCurrentX = 0;
let mouseDown = false;

carousel.addEventListener('mousedown', (event) => {
  mouseDown = true;

  mouseStartX = event.clientX;
  mouseCurrentX = event.clientX;

  stopAutoplay();
});

carousel.addEventListener('mousemove', (event) => {
  if (!mouseDown) return;

  mouseCurrentX = event.clientX;
});

carousel.addEventListener('mouseup', () => {
  if (!mouseDown) return;

  mouseDown = false;

  const distance = mouseCurrentX - mouseStartX;

  if (Math.abs(distance) >= SWIPE_THRESHOLD) {
    if (distance < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  startAutoplay();
});

carousel.addEventListener('mouseleave', () => {
  if (!mouseDown) return;

  mouseDown = false;
  startAutoplay();
});

/*
 * Initial render
 */
renderSlides(1);
startAutoplay();
