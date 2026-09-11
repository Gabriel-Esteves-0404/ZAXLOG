// ===== MENU MOBILE =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('nav-open');
  burger.classList.toggle('burger-open');
});

// fecha o menu ao clicar em um link (mobile)
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav-open');
  });
});

// ===== CONTADOR ANIMADO DAS ESTATÍSTICAS =====
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // easeOutQuad
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.dataset.target) animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => observer.observe(el));

// ===== HEADER COM SOMBRA AO ROLAR =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header-scrolled', window.scrollY > 10);
});

// ===== MODAL PROPOSTA =====
const propostaOverlay = document.getElementById('propostaOverlay');
const propostaForm = document.getElementById('propostaForm');
const modalClose = document.getElementById('modalClose');
const proposalTriggers = document.querySelectorAll('[data-open-proposal]');

function openProposalModal(e) {
  e.preventDefault();
  propostaOverlay.classList.add('is-open');
  document.body.classList.add('modal-open');
}

function closeProposalModal() {
  propostaOverlay.classList.remove('is-open');
  document.body.classList.remove('modal-open');
}

proposalTriggers.forEach(btn => btn.addEventListener('click', openProposalModal));
modalClose.addEventListener('click', closeProposalModal);

propostaOverlay.addEventListener('click', (e) => {
  if (e.target === propostaOverlay) closeProposalModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProposalModal();
});

const propostaStatus = document.getElementById('propostaStatus');
const propostaSubmitBtn = propostaForm.querySelector('.form-submit');

propostaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  propostaSubmitBtn.disabled = true;
  propostaStatus.textContent = 'Enviando...';
  propostaStatus.classList.remove('is-error', 'is-success');

  try {
    const response = await fetch(propostaForm.action, {
      method: 'POST',
      body: new FormData(propostaForm),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      propostaStatus.textContent = 'Proposta enviada! Em breve entraremos em contato.';
      propostaStatus.classList.add('is-success');
      propostaForm.reset();
      setTimeout(closeProposalModal, 1800);
    } else {
      propostaStatus.textContent = 'Não foi possível enviar. Tente novamente ou fale com a gente pelo WhatsApp.';
      propostaStatus.classList.add('is-error');
    }
  } catch (err) {
    propostaStatus.textContent = 'Não foi possível enviar. Verifique sua conexão e tente novamente.';
    propostaStatus.classList.add('is-error');
  } finally {
    propostaSubmitBtn.disabled = false;
  }
});
