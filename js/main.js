/**
 * NBA NOTICIAS - LÓGICA JAVASCRIPT PRINCIPAL
 * Navegación Responsiva | Validaciones de Formulario | Cargador XML/XSLT Dual
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFormValidation();
  initCatalogXSLT();
});

/* ==========================================================================
   1. MENÚ DE NAVEGACIÓN MÓVIL
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
      toggleBtn.innerHTML = isExpanded ? '✕' : '☰';
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/* ==========================================================================
   2. VALIDACIÓN DE FORMULARIO DE CONTACTO (HTML5 + JS)
   ========================================================================== */
function initFormValidation() {
  const contactForm = document.getElementById('nba-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Campos del formulario
    const nameField = document.getElementById('nombre');
    const emailField = document.getElementById('email');
    const topicField = document.getElementById('asunto');
    const messageField = document.getElementById('mensaje');
    const termsField = document.getElementById('terminos');

    // Resetear errores
    clearErrors([nameField, emailField, topicField, messageField]);

    // Validar Nombre
    if (!nameField.value.trim() || nameField.value.trim().length < 3) {
      showFieldError(nameField, 'El nombre debe contener al menos 3 caracteres.');
      isValid = false;
    }

    // Validar Email con Expresión Regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      showFieldError(emailField, 'Por favor, ingrese un correo electrónico válido.');
      isValid = false;
    }

    // Validar Asunto
    if (!topicField.value) {
      showFieldError(topicField, 'Por favor, seleccione un asunto.');
      isValid = false;
    }

    // Validar Mensaje
    if (!messageField.value.trim() || messageField.value.trim().length < 10) {
      showFieldError(messageField, 'El mensaje debe tener al menos 10 caracteres.');
      isValid = false;
    }

    // Validar Términos
    if (termsField && !termsField.checked) {
      showToast('⚠️ Debes aceptar los términos y condiciones.', 'warning');
      isValid = false;
    }

    if (isValid) {
      // Éxito en la validación
      showToast('🚀 ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
      contactForm.reset();
    }
  });
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorContainer = document.getElementById(`error-${field.id}`);
  if (errorContainer) {
    errorContainer.innerText = message;
    errorContainer.style.display = 'block';
  }
}

function clearErrors(fields) {
  fields.forEach(field => {
    if (field) {
      field.classList.remove('error');
      const errorContainer = document.getElementById(`error-${field.id}`);
      if (errorContainer) {
        errorContainer.innerText = '';
        errorContainer.style.display = 'none';
      }
    }
  });
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('nba-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nba-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   3. CARGADOR Y PROCESADOR DE CATÁLOGO DINÁMICO (XML + XSLT)
   ========================================================================== */
async function initCatalogXSLT() {
  const container = document.getElementById('catalog-container');
  if (!container) return; // Solo ejecutar en catalog.html

  try {
    // 1. Cargar datos XML y hoja XSLT
    const [xmlResponse, xslResponse] = await Promise.all([
      fetch('xml/datos.xml'),
      fetch('xml/estilos.xsl')
    ]);

    if (!xmlResponse.ok || !xslResponse.ok) {
      throw new Error('Error al cargar los archivos de datos XML/XSLT.');
    }

    const xmlText = await xmlResponse.text();
    const xslText = await xslResponse.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const xslDoc = parser.parseFromString(xslText, 'application/xml');

    // Comprobar errores de parseo
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('El archivo datos.xml contiene errores de sintaxis XML.');
    }

    // 2. Intentar Transformación XSLT nativa mediante XSLTProcessor
    if (window.XSLTProcessor) {
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslDoc);
      const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
      container.innerHTML = '';
      container.appendChild(resultDocument);
    } else {
      // Fallback JS en caso de entorno restrictivo
      renderXMLFallback(xmlDoc, container);
    }

    // 3. Inicializar botones de filtro por categoría
    initCategoryFilters();

  } catch (error) {
    console.warn('Carga XSLT estándar falló o se ejecuta localmente. Usando motor cliente...', error);
    // Carga directa de fallback por seguridad para GitHub Pages / local
    loadXMLDirectly(container);
  }
}

async function loadXMLDirectly(container) {
  try {
    const response = await fetch('xml/datos.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    renderXMLFallback(xmlDoc, container);
    initCategoryFilters();
  } catch (err) {
    container.innerHTML = `<div class="error-box" style="padding: 2rem; color: #ef4444; background: var(--bg-card); border-radius: 12px; text-align: center;">
      <h3>⚠️ No se pudo cargar el catálogo XML</h3>
      <p>Asegúrate de estar sirviendo los archivos a través de un servidor HTTP o en GitHub Pages.</p>
    </div>`;
  }
}

function renderXMLFallback(xmlDoc, container) {
  const noticias = xmlDoc.getElementsByTagName('noticia');
  let html = '<div class="news-grid" id="news-grid-items">';

  for (let i = 0; i < noticias.length; i++) {
    const noticia = noticias[i];
    const id = noticia.getAttribute('id') || `news-${i}`;
    const categoria = noticia.getAttribute('categoria') || 'general';
    const titulo = noticia.getElementsByTagName('titulo')[0]?.textContent || '';
    const fecha = noticia.getElementsByTagName('fecha')[0]?.textContent || '';
    const autor = noticia.getElementsByTagName('autor')[0]?.textContent || '';
    const resumen = noticia.getElementsByTagName('resumen')[0]?.textContent || '';
    const imagen = noticia.getElementsByTagName('imagen')[0]?.textContent || 'assets/images/nba_hero_banner.jpg';
    const lecturaMinutos = noticia.getElementsByTagName('lecturaMinutos')[0]?.textContent || '3';

    html += `
      <article class="news-card" data-category="${categoria}">
        <div class="news-card-img">
          <img src="${imagen}" alt="${titulo}">
          <span class="category-badge ${categoria}" style="position: absolute; top: 1rem; left: 1rem; margin: 0;">${categoria.toUpperCase()}</span>
        </div>
        <div class="news-card-content">
          <h3 class="news-card-title">${titulo}</h3>
          <p class="news-card-excerpt">${resumen}</p>
          <div class="news-card-footer">
            <span>✍️ ${autor}</span>
            <span>📅 ${fecha} • ⏱️ ${lecturaMinutos} min</span>
          </div>
        </div>
      </article>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsItems = document.querySelectorAll('.news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      newsItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'todos' || itemCategory === filterValue) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
