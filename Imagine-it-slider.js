// Слайдер на странице item в блоке Imagine it...
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.painting-slider');
  const track = slider.querySelector('.painting-slider__track');
  const slides = [...track.querySelectorAll('.painting-slider__slide')];
  const nextButton = slider.querySelector('.btn-next');

  let currentIndex = 0;
  let isDragging = false;
  let hasMoved = false;

  let startX = 0;
  let currentX = 0;
  let dragOffset = 0;

  const autoplayDelay = 4000;
  let autoplayTimer;

  function getGap() {
    const styles = window.getComputedStyle(track);

    return parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;
  }

  function getSlideOffset(index) {
    if (index <= 0) {
      return 0;
    }

    let offset = 0;
    const gap = getGap();

    for (let i = 0; i < index; i++) {
      offset += slides[i].getBoundingClientRect().width + gap;
    }

    return offset;
  }

  function updateSlider(animate = true) {
    track.style.transition = animate ? 'transform 500ms ease' : 'none';

    track.style.transform = `
        translate3d(-${getSlideOffset(currentIndex)}px, 0, 0)
      `;
  }

  function nextSlide() {
    currentIndex++;

    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }

    updateSlider();
  }

  function previousSlide() {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    }

    updateSlider();
  }

  function startAutoplay() {
    stopAutoplay();

    autoplayTimer = setInterval(() => {
      nextSlide();
    }, autoplayDelay);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  slider.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.btn-next')) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    isDragging = true;
    hasMoved = false;

    startX = event.clientX;
    currentX = startX;

    dragOffset = getSlideOffset(currentIndex);

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
      hasMoved = true;
    }

    track.style.transform = `
        translate3d(${-dragOffset + distance}px, 0, 0)
      `;
  });

  function finishDragging(event) {
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

    // Сбрасываем координаты, чтобы следующий клик/свайп начинался «с чистого листа»
    startX = 0;
    currentX = 0;

    startAutoplay();
  }

  // Кнопка NEXT
  const btnNext = slider.querySelector('.btn-next');

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // на всякий случай
      nextSlide();
    });
  }

  slider.addEventListener('pointerup', finishDragging);
  slider.addEventListener('pointercancel', finishDragging);

  slider.addEventListener('mouseenter', stopAutoplay);

  slider.addEventListener('mouseleave', () => {
    if (!isDragging) {
      startAutoplay();
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    updateSlider(false);
  });

  resizeObserver.observe(slider);
  resizeObserver.observe(track);

  slides.forEach((slide) => {
    resizeObserver.observe(slide);
  });

  window.addEventListener('load', () => {
    updateSlider(false);
  });

  updateSlider(false);
  startAutoplay();
});
