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

projectCards.forEach((card) => {
  const frontBtn = card.querySelector('.project-toggle');
  const backBtn = card.querySelector('.project-back-btn');
  const cardBack = card.querySelector('.card-back');

  if (frontBtn) {
    frontBtn.addEventListener('click', () => {
      // Close any other flipped card first
      projectCards.forEach((other) => {
        if (other !== card && other.classList.contains('flipped')) {
          other.classList.remove('flipped');
          const otherFrontBtn = other.querySelector('.project-toggle');
          const otherBack = other.querySelector('.card-back');
          if (otherFrontBtn) otherFrontBtn.setAttribute('aria-expanded', 'false');
          if (otherBack) otherBack.setAttribute('aria-hidden', 'true');
        }
      });

      card.classList.add('flipped');
      frontBtn.setAttribute('aria-expanded', 'true');
      if (cardBack) cardBack.setAttribute('aria-hidden', 'false');
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      card.classList.remove('flipped');
      if (frontBtn) frontBtn.setAttribute('aria-expanded', 'false');
      if (cardBack) cardBack.setAttribute('aria-hidden', 'true');
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    projectCards.forEach((card) => {
      if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        const frontBtn = card.querySelector('.project-toggle');
        const cardBack = card.querySelector('.card-back');
        if (frontBtn) frontBtn.setAttribute('aria-expanded', 'false');
        if (cardBack) cardBack.setAttribute('aria-hidden', 'true');
      }
    });
  }
});

const CONTACT_API = 'https://TU_DOMINIO_API/api/contact';

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
