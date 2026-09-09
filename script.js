const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});
document.querySelector('.nav-tab')?.addEventListener('click', () => {
  document.querySelectorAll('#faq details').forEach((item) => { item.open = true; });
});

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 12), { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const message = [
    'Hola, me gustaría hablar sobre una solución digital para mi negocio.',
    `Nombre: ${form.get('name')}`,
    `Negocio: ${form.get('business')}`,
    `Necesidad: ${form.get('message')}`,
  ].join('\n');
  window.open(`https://wa.me/34615987988?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.querySelectorAll('.quote-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const service = link.dataset.quote || 'un servicio digital';
    const message = `Hola, me gustaría solicitar presupuesto para: ${service}. Me gustaría contaros un poco sobre mi negocio.`;
    window.open(`https://wa.me/34615987988?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
});

const fia = document.querySelector('#fia-assistant');
const fiaIntro = document.querySelector('#fia-intro-stage');
const fiaLauncher = document.querySelector('#fia-launcher');
const fiaPanel = document.querySelector('#fia-panel');
const fiaClose = document.querySelector('#fia-close');
const fiaMessages = document.querySelector('#fia-messages');
const fiaForm = document.querySelector('#fia-form');
const fiaInput = document.querySelector('#fia-input');

let currentSpeech = null;
let currentSpeakButton = null;
let availableVoices = [];

function loadFiaVoices() {
  availableVoices = window.speechSynthesis?.getVoices?.() || [];
}
loadFiaVoices();
window.speechSynthesis?.addEventListener?.('voiceschanged', loadFiaVoices);

function speakFia(text, button) {
  if (!('speechSynthesis' in window)) {
    button.title = 'La voz no está disponible en este navegador';
    return;
  }
  if (currentSpeakButton === button && window.speechSynthesis.speaking) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      button.textContent = 'Ⅱ';
      button.title = 'Pausar respuesta';
    } else {
      window.speechSynthesis.pause();
      button.textContent = '▶';
      button.title = 'Continuar respuesta';
    }
    return;
  }
  window.speechSynthesis.cancel();
  if (currentSpeakButton) { currentSpeakButton.textContent = '◖'; currentSpeakButton.title = 'Escuchar respuesta'; }
  currentSpeakButton = button;
  currentSpeech = new SpeechSynthesisUtterance(text);
  currentSpeech.lang = 'es-ES';
  currentSpeech.rate = 0.96;
  currentSpeech.pitch = 1.18;
  currentSpeech.volume = 1;
  const femaleSpanishVoice = availableVoices.find((voice) => /es(-|_)(ES|MX|US|AR)|español|spanish/i.test(`${voice.lang} ${voice.name}`) && /female|mujer|elvira|helena|monica|laura|sofia|luciana|paulina|google español|microsoft/i.test(voice.name));
  const anySpanishVoice = availableVoices.find((voice) => /^es(-|_)/i.test(voice.lang));
  currentSpeech.voice = femaleSpanishVoice || anySpanishVoice || null;
  currentSpeech.onstart = () => { button.textContent = 'Ⅱ'; button.title = 'Pausar respuesta'; };
  currentSpeech.onend = () => { button.textContent = '◖'; button.title = 'Reproducir de nuevo'; currentSpeakButton = null; };
  window.speechSynthesis.speak(currentSpeech);
}

function addFiaMessage(text, type = 'bot') {
  const message = document.createElement('div');
  message.className = `fia-message fia-message--${type}`;
  const content = document.createElement('span');
  content.textContent = text;
  message.appendChild(content);
  if (type === 'bot') {
    const speaker = document.createElement('button');
    speaker.className = 'fia-speak';
    speaker.type = 'button';
    speaker.textContent = '◖';
    speaker.title = 'Escuchar respuesta';
    speaker.setAttribute('aria-label', 'Escuchar respuesta');
    speaker.addEventListener('click', () => speakFia(content.textContent, speaker));
    message.appendChild(speaker);
  }
  fiaMessages.appendChild(message);
  fiaMessages.scrollTop = fiaMessages.scrollHeight;
}

function fiaReply(question) {
  const text = question.toLowerCase();
  if (text.includes('contact') || text.includes('whatsapp') || text.includes('teléfono') || text.includes('telefono')) return 'Puedes escribirnos por WhatsApp en el 615 987 988. También tienes el formulario en la sección Contacto.';
  if (text.includes('correo') || text.includes('email') || text.includes('mail')) return 'Puedes escribirnos directamente a informacion.fantasia@gmail.com. También tienes WhatsApp en el 615 987 988.';
  if (text.includes('dónde') || text.includes('donde') || text.includes('ubic')) return 'FantasIA está en Oliva y alrededores. También trabajamos online con clientes de cualquier lugar.';
  if (text.includes('pago') || text.includes('pagando') || text.includes('stripe') || text.includes('checkout')) return 'Los pagos online todavía no están activos. Si has llegado al pedido, puedes rellenar tus datos y te contactaremos para continuar sin realizar ningún cobro.';
  if (text.includes('precio') || text.includes('cuánto') || text.includes('cuanto') || text.includes('cost')) return 'Tenemos servicios cerrados desde 49 €/mes de mantenimiento, webs de 499–599 €, estrategia desde 149 € y el Pack Contenido y Redes por 799 €/mes. Los proyectos de IA y automatización se presupuestan a medida.';
  if (text.includes('servicio') || text.includes('web') || text.includes('ia') || text.includes('automat') || text.includes('redes')) return 'Podemos ayudarte con una web, un Asistente de Atención al Cliente, un Asistente administrativo, una Automatización personalizada o contenido y redes. ¿Cuál te interesa?';
  return 'Puedo orientarte sobre servicios, precios, contacto, ubicación y el proceso de pedido. ¿Qué tipo de solución busca tu negocio?';
}

function askFia(question) {
  const clean = question.trim();
  if (!clean) return;
  addFiaMessage(clean, 'user');
  fia.classList.add('is-thinking');
  window.setTimeout(() => { fia.classList.remove('is-thinking'); addFiaMessage(fiaReply(clean)); }, 650);
}

fiaLauncher?.addEventListener('click', () => {
  const isOpen = !fiaPanel.hidden;
  fiaPanel.hidden = isOpen;
  fiaLauncher.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) fiaInput?.focus();
});
fiaClose?.addEventListener('click', () => { fiaPanel.hidden = true; fiaLauncher.setAttribute('aria-expanded', 'false'); });
fiaForm?.addEventListener('submit', (event) => { event.preventDefault(); askFia(fiaInput.value); fiaInput.value = ''; });
document.querySelectorAll('[data-fia-question]').forEach((button) => button.addEventListener('click', () => askFia(button.dataset.fiaQuestion)));
document.querySelector('.fia-message--bot .fia-speak')?.addEventListener('click', (event) => speakFia(event.currentTarget.parentElement.querySelector('span').textContent, event.currentTarget));

let dragState = null;
fiaLauncher?.addEventListener('pointerdown', (event) => {
  dragState = { x: event.clientX, y: event.clientY, left: fia.offsetLeft, top: fia.offsetTop };
  fiaLauncher.setPointerCapture(event.pointerId);
  fia.classList.add('is-dragging');
});
fiaLauncher?.addEventListener('pointermove', (event) => {
  if (!dragState) return;
  const nextLeft = Math.max(10, Math.min(window.innerWidth - fia.offsetWidth - 10, dragState.left + event.clientX - dragState.x));
  const nextTop = Math.max(10, Math.min(window.innerHeight - fia.offsetHeight - 10, dragState.top + event.clientY - dragState.y));
  fia.style.left = `${nextLeft}px`; fia.style.top = `${nextTop}px`; fia.style.right = 'auto'; fia.style.bottom = 'auto';
});
fiaLauncher?.addEventListener('pointerup', () => { dragState = null; fia.classList.remove('is-dragging'); });

const fiaWelcomed = (() => { try { return sessionStorage.getItem('fantasia-fia-welcomed') === '1'; } catch { return false; } })();
if (fiaWelcomed) {
  fiaIntro?.classList.add('is-complete');
  fia?.classList.add('fia-ready');
} else {
  window.setTimeout(() => {
    fiaIntro?.classList.add('is-complete');
    fia?.classList.add('fia-ready');
    try { sessionStorage.setItem('fantasia-fia-welcomed', '1'); } catch {}
  }, 3000);
}

// La tablet del hero admite un giro suave con el ratón o el dedo, sin añadir librerías.
const tablet = document.querySelector('.visual-card');
let tabletDrag = null;
tablet?.addEventListener('pointerdown', (event) => {
  tabletDrag = { x: event.clientX, y: event.clientY, rx: 0, ry: 4 };
  tablet.setPointerCapture(event.pointerId);
  tablet.classList.add('is-interacting');
});
tablet?.addEventListener('pointermove', (event) => {
  if (!tabletDrag) return;
  tabletDrag.ry += (event.clientX - tabletDrag.x) * .42;
  tabletDrag.rx += (event.clientY - tabletDrag.y) * -.42;
  tablet.style.setProperty('--tablet-x', `${tabletDrag.rx}deg`);
  tablet.style.setProperty('--tablet-y', `${tabletDrag.ry}deg`);
  tabletDrag.x = event.clientX;
  tabletDrag.y = event.clientY;
});
const releaseTablet = () => { tabletDrag = null; tablet?.classList.remove('is-interacting'); };
tablet?.addEventListener('pointerup', releaseTablet);
tablet?.addEventListener('pointercancel', releaseTablet);
