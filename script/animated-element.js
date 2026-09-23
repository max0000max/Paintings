document.addEventListener('DOMContentLoaded', () => {
  const threshold = 0.8;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target); // перестаём следить после первого срабатывания
        }
      });
    },
    {
      threshold: [threshold],
    },
  );

  document
    .querySelectorAll('.animated-element')
    .forEach((el) => observer.observe(el));
});
