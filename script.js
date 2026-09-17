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
  if (text.includes('precio') || text.includes('cuánto') || text.includes('cuanto') || text.includes('cost')) return 'Ahora mismo la web es informativa y no mostramos precios ni activamos compras. Si quieres conocer una solución, escríbenos y te orientaremos personalmente.';
  if (text.includes('servicio') || text.includes('web') || text.includes('ia') || text.includes('automat') || text.includes('redes')) return 'Podemos ayudarte con una web, un Asistente de Atención al Cliente, un Asistente administrativo, una Automatización personalizada o contenido y redes. ¿Cuál te interesa?';
  return 'Puedo orientarte sobre nuestros servicios, contacto y ubicación. ¿Qué tipo de solución busca tu negocio?';
}

async function askFia(question) {
  const clean = question.trim();
  if (!clean) return;
  addFiaMessage(clean, 'user');
  fia.classList.add('is-thinking');

  let sessionId = sessionStorage.getItem('fantasia-fia-session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('fantasia-fia-session', sessionId);
  }

  try {
    const response = await fetch('/.netlify/functions/fia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'web', message: clean, sessionId }),
    });
    const data = await response.json();
    if (!response.ok || !data.reply) throw new Error(data.error || 'Respuesta no válida');
    addFiaMessage(data.reply);
  } catch (error) {
    console.error('FIA no pudo conectar con Make:', error);
    addFiaMessage('Ahora mismo no puedo conectarme. Puedes escribirnos a informacion.fantasia@gmail.com o por WhatsApp en el 615 987 988.');
  } finally {
    fia.classList.remove('is-thinking');
  }
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
  }, 2000);
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

// Acciones de servicio: contacto rápido y reserva guiada.
(function setupServiceActions() {
  const serviceLinks = document.querySelectorAll('.service-card a.text-link');
  if (!serviceLinks.length) return;
  const modal = document.createElement('div');
  modal.className = 'service-modal';
  modal.hidden = true;
  modal.innerHTML = '<div class="service-modal__backdrop" data-close-service></div><section class="service-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="service-modal-title"><button class="service-modal__close" type="button" aria-label="Cerrar" data-close-service>×</button><p class="eyebrow">Tu siguiente paso</p><h2 id="service-modal-title">Conoce el servicio</h2><p class="service-modal__intro">Elige cómo quieres continuar y te ayudaremos con tu proyecto.</p><div class="service-modal__actions"><button type="button" class="service-action service-action--whatsapp" data-service-action="whatsapp">WhatsApp</button><button type="button" class="service-action service-action--email" data-service-action="email">Email</button><button type="button" class="service-action service-action--booking" data-service-action="booking">Reservar llamada</button></div><form class="booking-form" hidden><label>Nombre<input name="name" required autocomplete="name" /></label><label>Prefijo<input name="prefix" list="fia-country-prefixes" value="+34" required inputmode="tel" /><datalist id="fia-country-prefixes"><option value="+34">España</option><option value="+33">Francia</option><option value="+351">Portugal</option><option value="+44">Reino Unido</option><option value="+49">Alemania</option><option value="+39">Italia</option><option value="+1">Estados Unidos / Canadá</option><option value="+52">México</option><option value="+54">Argentina</option><option value="+57">Colombia</option><option value="+58">Venezuela</option><option value="+61">Australia</option></datalist></label><label>Número de teléfono<input name="phone" type="tel" required inputmode="tel" autocomplete="tel" placeholder="615 987 988" /></label><label>Día<select name="date" required></select></label><label>Hora<select name="time" required></select></label><button class="service-action service-action--confirm" type="submit">Confirmar solicitud</button><p class="booking-note">Duración: 30 minutos · Antelación mínima: 1 día.</p></form><p class="service-modal__status" role="status"></p></section>';
  document.body.appendChild(modal);
  const title = modal.querySelector('#service-modal-title');
  const actions = modal.querySelector('.service-modal__actions');
  const bookingForm = modal.querySelector('.booking-form');
  const status = modal.querySelector('.service-modal__status');
  const dateSelect = bookingForm.querySelector('[name=date]');
  const timeSelect = bookingForm.querySelector('[name=time]');
  let selectedService = '';
  const pad = (number) => String(number).padStart(2, '0');
  const dateLabel = (date) => new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  function slotsFor(date) {
    const day = date.getDay();
    const weekend = day === 0 || day === 6;
    const start = weekend ? 11 * 60 : (day === 2 || day === 4 ? 15 * 60 + 15 : 14 * 60);
    const end = weekend ? 20 * 60 : 22 * 60;
    const slots = [];
    for (let minutes = start; minutes + 30 <= end; minutes += 30) slots.push(pad(Math.floor(minutes / 60)) + ':' + pad(minutes % 60));
    return slots;
  }
  function fillDates() {
    dateSelect.innerHTML = '';
    const today = new Date();
    for (let offset = 1; offset <= 60; offset += 1) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      const option = document.createElement('option');
      option.value = date.toISOString().slice(0, 10);
      option.textContent = dateLabel(date);
      dateSelect.appendChild(option);
    }
    fillTimes();
  }
  function fillTimes() {
    const date = new Date(dateSelect.value + 'T12:00:00');
    timeSelect.innerHTML = slotsFor(date).map((slot) => '<option value="' + slot + '">' + slot + '</option>').join('');
  }
  function openModal(service) {
    selectedService = service;
    title.textContent = 'Conoce ' + service;
    status.textContent = '';
    actions.hidden = false;
    bookingForm.hidden = true;
    modal.hidden = false;
    document.body.classList.add('service-modal-open');
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('service-modal-open');
  }
  function contactMessage() { return 'Hola, quiero conocer un poco más sobre ' + selectedService + '.'; }
  serviceLinks.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const card = link.closest('.service-card');
    openModal(card?.querySelector('h4')?.textContent.trim() || 'este servicio');
  }, true));
  modal.addEventListener('click', (event) => {
    const close = event.target.closest('[data-close-service]');
    if (close) closeModal();
    const action = event.target.closest('[data-service-action]');
    if (!action) return;
    const message = contactMessage();
    if (action.dataset.serviceAction === 'whatsapp') window.open('https://wa.me/34615987988?text=' + encodeURIComponent(message), '_blank', 'noopener');
    if (action.dataset.serviceAction === 'email') window.open('mailto:informacion.fantasia@gmail.com?subject=' + encodeURIComponent('Consulta sobre ' + selectedService) + '&body=' + encodeURIComponent(message), '_blank');
    if (action.dataset.serviceAction === 'booking') { actions.hidden = true; bookingForm.hidden = false; fillDates(); bookingForm.querySelector('[name=name]').focus(); }
  });
  dateSelect.addEventListener('change', fillTimes);
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(bookingForm);
    const date = String(form.get('date'));
    const time = String(form.get('time'));
    const fullPhone = String(form.get('prefix')).trim() + ' ' + String(form.get('phone')).trim();
    const message = 'SOLICITUD DE RESERVA WEB. Servicio: ' + selectedService + '. Nombre del cliente: ' + form.get('name') + '. Teléfono: ' + fullPhone + '. Fecha solicitada: ' + date + ' a las ' + time + '. Duración: 30 minutos. Comprueba disponibilidad real en Google Calendar y el límite de 2 reservas diarias. Si está libre, crea el evento con título EXACTAMENTE igual al nombre del cliente y añade el servicio y teléfono en la descripción. Después, envía a Víctor una notificación especial por WhatsApp con: Hola, he reservado el día ' + date + ' a las ' + time + '. Cliente: ' + form.get('name') + '. Teléfono: ' + fullPhone + '. No confirmes la reserva hasta que el calendario confirme el evento.';
    status.textContent = 'Comprobando disponibilidad…';
    await askFia(message);
    status.textContent = 'Solicitud enviada. FIA confirmará la reserva cuando el calendario la valide.';
    bookingForm.reset();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
})();
