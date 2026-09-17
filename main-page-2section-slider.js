// Простой десктопный слайдер на главной странице во 2 секции
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.paintings-slider');
  const track = slider.querySelector('.paintings-slider__track');
  const slides = [...track.querySelectorAll('.paintings-slider__slide')];

  // Настройка количества отображаемых слайдов
  const visibleSlides = 2;

  let currentIndex = 0;
  let slideWidth = 0;
  let gap = 0;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let moved = false;

  const autoplayDelay = 4000;
  let autoplay;

  function getSliderSizes() {
    const slide = slides[0];

    slideWidth = slide.getBoundingClientRect().width;

    const trackStyles = window.getComputedStyle(track);
    gap = parseFloat(trackStyles.columnGap) || 0;
  }

  function getStep() {
    return slideWidth + gap;
  }

  function updateSlider(animate = true) {
    track.style.transition = animate ? 'transform 500ms ease' : 'none';

    track.style.transform = `translate3d(-${currentIndex * getStep()}px, 0, 0)`;
  }

  function nextSlide() {
    const lastStartIndex = slides.length - visibleSlides;

    if (currentIndex >= lastStartIndex) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    updateSlider();
  }

  function previousSlide() {
    const lastStartIndex = slides.length - visibleSlides;

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = lastStartIndex;
    }

    updateSlider();
  }
  function startAutoplay() {
    stopAutoplay();

    autoplay = setInterval(() => {
      nextSlide();
    }, autoplayDelay);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  slider.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    isDragging = true;
    moved = false;
    startX = event.clientX;
    currentX = startX;

    stopAutoplay();

    slider.classList.add('is-dragging');
    slider.setPointerCapture(event.pointerId);

    track.style.transition = 'none';
  });

  slider.addEventListener('pointermove', (event) => {
    if (!isDragging) {
      return;
    }

    currentX = event.clientX;

    const distance = currentX - startX;

    if (Math.abs(distance) > 5) {
      moved = true;
    }

    track.style.transform = `translate3d(${
      -currentIndex * getStep() + distance
    }px, 0, 0)`;
  });

  function finishDrag(event) {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    slider.classList.remove('is-dragging');

    const distance = currentX - startX;
    const swipeThreshold = 60;

    if (Math.abs(distance) >= swipeThreshold) {
      if (distance < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    } else {
      updateSlider();
    }

    startAutoplay();
  }

  slider.addEventListener('pointerup', finishDrag);
  slider.addEventListener('pointercancel', finishDrag);

  slider.addEventListener(
    'click',
    (event) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true,
  );

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', () => {
    if (!isDragging) {
      startAutoplay();
    }
  });

  window.addEventListener('resize', () => {
    getSliderSizes();
    updateSlider(false);
  });

  getSliderSizes();
  updateSlider(false);
  startAutoplay();
});
