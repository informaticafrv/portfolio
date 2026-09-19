const form = document.querySelector('.contact-form');
const animatedElements = document.querySelectorAll('.animate');
const projectCards = document.querySelectorAll('.project-card');

function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}

const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.15,
});

animatedElements.forEach((element) => observer.observe(element));

// ─── Tarjetas de proyecto (volteo) ───────────────────────────
// La cara que no se ve queda `inert`: fuera del orden de tabulación y del lector de pantalla.
function setFlipped(card, flipped, moveFocus = false) {
  const front = card.querySelector('.card-front');
  const back = card.querySelector('.card-back');
  const frontBtn = card.querySelector('.project-toggle');
  const backBtn = card.querySelector('.project-back-btn');

  card.classList.toggle('flipped', flipped);
  if (frontBtn) frontBtn.setAttribute('aria-expanded', String(flipped));
  if (back) back.setAttribute('aria-hidden', String(!flipped));
  if (front) front.inert = flipped;
  if (back) back.inert = !flipped;

  if (moveFocus) (flipped ? backBtn : frontBtn)?.focus();
}

projectCards.forEach((card) => {
  setFlipped(card, false);

  card.querySelector('.project-toggle')?.addEventListener('click', () => {
    projectCards.forEach((other) => {
      if (other !== card && other.classList.contains('flipped')) setFlipped(other, false);
    });
    setFlipped(card, true, true);
  });

  card.querySelector('.project-back-btn')?.addEventListener('click', () => {
    setFlipped(card, false, true);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  projectCards.forEach((card) => {
    if (card.classList.contains('flipped')) setFlipped(card, false, true);
  });
});

// ─── Carruseles ──────────────────────────────────────────────
document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const count = dots.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  const current = () => Math.round(track.scrollLeft / track.clientWidth);

  const goTo = (index) => {
    const i = (index + count) % count;
    track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  };

  carousel.querySelector('.carousel-prev')?.addEventListener('click', () => goTo(current() - 1));
  carousel.querySelector('.carousel-next')?.addEventListener('click', () => goTo(current() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const active = current();
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === active)));
      ticking = false;
    });
  }, { passive: true });

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current() - 1);
    if (e.key === 'ArrowRight') goTo(current() + 1);
  });
});

const CONTACT_API = 'https://api.franromero.es/api/contact';

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const existingError = form.querySelector('.form-error');
    if (existingError) existingError.remove();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const body = {
      name:    form.querySelector('input[name="name"]').value.trim(),
      email:   form.querySelector('input[name="email"]').value.trim(),
      message: form.querySelector('textarea[name="message"]').value.trim(),
      website: form.querySelector('input[name="website"]').value,
    };

    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje.');
      }

      form.innerHTML = `
        <div class="form-success">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>Mensaje enviado. Te respondo pronto.</p>
        </div>`;
    } catch (err) {
      const errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      errorEl.textContent = err.message || 'Error de conexión. Inténtalo de nuevo.';
      form.appendChild(errorEl);

      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
    }
  });
}
