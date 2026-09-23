// Анимация гамбургер-меню и сокрытие header при скроле вниз
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header-burger');
  const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
  const mobileLinks = document.querySelectorAll(
    '.mobile-menu-link, .mobile-action-btn',
  );

  if (!header || !burger || !mobileMenuWrapper) {
    return;
  }

  /* =========================
     BURGER MENU
     ========================= */

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('is-active');

    mobileMenuWrapper.classList.toggle('is-open', isOpen);

    burger.setAttribute('aria-expanded', String(isOpen));

    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  /* =========================
     CLOSE MENU AFTER CLICK
     ========================= */

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-active');
      mobileMenuWrapper.classList.remove('is-open');

      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    });
  });

  /* =========================
     HIDE HEADER ON SCROLL DOWN
     SHOW HEADER ON SCROLL UP
     ========================= */

  let lastScrollPosition = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;

    // Если меню открыто — header не скрываем
    if (mobileMenuWrapper.classList.contains('is-open')) {
      lastScrollPosition = currentScrollPosition;
      return;
    }

    // В самом верху header всегда виден
    if (currentScrollPosition <= 0) {
      header.classList.remove('is-hidden');

      lastScrollPosition = currentScrollPosition;
      return;
    }

    // Скроллим вниз
    if (currentScrollPosition > lastScrollPosition) {
      header.classList.add('is-hidden');
    }

    // Скроллим вверх
    else if (currentScrollPosition < lastScrollPosition) {
      header.classList.remove('is-hidden');
    }

    lastScrollPosition = currentScrollPosition;
  });
});
