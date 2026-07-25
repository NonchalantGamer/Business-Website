document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((counter) => {
    const rawValue = counter.dataset.counter || '0';
    const target = Number.parseFloat(rawValue);
    const suffix = counter.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Number.isFinite(target) ? Math.floor(progress * target) : 0;
      counter.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });

  const pricingToggle = document.querySelector('[data-pricing-toggle]');
  const priceNodes = document.querySelectorAll('[data-price]');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.checked;
      priceNodes.forEach((price) => {
        const monthly = price.dataset.monthly;
        const annual = price.dataset.annual;
        price.textContent = isAnnual ? annual : monthly;
      });
    });
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    button?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('pointermove', (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      heroVisual.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    heroVisual.addEventListener('pointerleave', () => {
      heroVisual.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    });
  }
});
