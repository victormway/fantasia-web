const services = {
  'web-new': ['Web nueva', '599 €'],
  'web-redesign': ['Rediseño web', '499 €'],
  'web-maintenance': ['Mantenimiento web', '49 €/mes'],
  'content-strategy': ['Estrategia de contenido', '149 €'],
  'video-editing': ['Edición de contenido', '49 €/vídeo'],
  'content-pack': ['Pack Contenido y Redes', '799 €/mes'],
};

const selected = services[new URLSearchParams(window.location.search).get('service')] || services['web-new'];
document.querySelector('#service-name').textContent = selected[0];
document.querySelector('#service-price').textContent = selected[1];

document.querySelector('#order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.hidden = true;
  document.querySelector('#order-success').hidden = false;
});
