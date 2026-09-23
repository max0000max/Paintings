const lenis = new Lenis({ anchors: true, duration: 1 });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
