/**
 * NBA NOTICIAS - LÓGICA JAVASCRIPT PRINCIPAL
 * Navegación Responsiva | Validaciones | Cargador XML/XSLT | Artículos | Comentarios
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFormValidation();
  initCatalogXSLT();
  initArticlePage();
  initClickableCards();
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

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/* ==========================================================================
   2. HACER TARJETAS DE NOTICIAS CLICKEABLES (index.html y catalog.html)
   ========================================================================== */
function initClickableCards() {
  // Tarjetas del index.html - asignar links basados en los IDs de las noticias
  const indexCards = document.querySelectorAll('.news-card[data-article-id]');
  indexCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.getAttribute('data-article-id');
      window.location.href = `article.html?id=${articleId}`;
    });
  });

  // Hero banner clickeable
  const heroBanner = document.querySelector('.hero-banner[data-article-id]');
  if (heroBanner) {
    heroBanner.style.cursor = 'pointer';
    heroBanner.addEventListener('click', () => {
      const articleId = heroBanner.getAttribute('data-article-id');
      window.location.href = `article.html?id=${articleId}`;
    });
  }
}

/* ==========================================================================
   3. VALIDACIÓN DE FORMULARIO DE CONTACTO (HTML5 + JS)
   ========================================================================== */
function initFormValidation() {
  const contactForm = document.getElementById('nba-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameField = document.getElementById('nombre');
    const emailField = document.getElementById('email');
    const topicField = document.getElementById('asunto');
    const messageField = document.getElementById('mensaje');
    const termsField = document.getElementById('terminos');

    clearErrors([nameField, emailField, topicField, messageField]);

    if (!nameField.value.trim() || nameField.value.trim().length < 3) {
      showFieldError(nameField, 'El nombre debe contener al menos 3 caracteres.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      showFieldError(emailField, 'Por favor, ingrese un correo electrónico válido.');
      isValid = false;
    }

    if (!topicField.value) {
      showFieldError(topicField, 'Por favor, seleccione un asunto.');
      isValid = false;
    }

    if (!messageField.value.trim() || messageField.value.trim().length < 10) {
      showFieldError(messageField, 'El mensaje debe tener al menos 10 caracteres.');
      isValid = false;
    }

    if (termsField && !termsField.checked) {
      showToast('⚠️ Debes aceptar los términos y condiciones.', 'warning');
      isValid = false;
    }

    if (isValid) {
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
   4. CARGADOR Y PROCESADOR DE CATÁLOGO DINÁMICO (XML + XSLT)
   ========================================================================== */
let cachedXMLDoc = null;

// Base de datos de respaldo (garantiza que la página de artículo NUNCA falle)
const ARTICLES_DATABASE = {
  'nba-101': {
    id: 'nba-101',
    categoria: 'playoffs',
    titulo: 'Finales NBA 2026: Batalla Épica en el Séptimo Juego por el Anillo de Campeón',
    fecha: '2026-06-18',
    autor: 'Carlos Mendoza',
    resumen: 'Una actuación histórica en los últimos segundos define el título de la NBA en una serie de playoffs inolvidable llena de tensión y estrategia de alto nivel.',
    contenido: `El séptimo partido de las finales ofreció un espectáculo inolvidable para los fanáticos del baloncesto mundial. Con una defensa asfixiante en los últimos dos minutos y un triple decisivo faltando 4 segundos, el equipo coronó una temporada impecable en el baloncesto profesional estadounidense.

La serie completa fue un reflejo del más alto nivel competitivo que la NBA puede ofrecer. Desde el primer partido, donde el equipo visitante sorprendió con una victoria en la carretera, hasta el dramático cierre en el séptimo juego, cada encuentro mantuvo a millones de espectadores al borde de sus asientos.

El jugador clave del partido decisivo registró 38 puntos, 12 rebotes y 8 asistencias, una línea estadística que será recordada durante generaciones. Su capacidad para tomar el control en los momentos más críticos demostró por qué es considerado uno de los mejores de su generación.

La defensa fue el factor diferenciador en los últimos minutos. El equipo campeón logró forzar tres pérdidas de balón consecutivas cuando el marcador estaba empatado a 104, convirtiendo cada una en puntos de transición rápida que sellaron el destino del partido.

Los analistas coinciden en que esta serie de finales pasará a la historia como una de las cinco mejores en la historia de la liga, comparándola con las icónicas batallas entre Lakers y Celtics en los años 80 y las legendarias Finales de 2016.

El trofeo Larry O'Brien fue entregado en una emotiva ceremonia en el centro de la cancha, donde los jugadores celebraron con lágrimas de alegría y abrazos con sus familias, culminando meses de sacrificio y dedicación absoluta al deporte.`,
    imagen: 'assets/images/nba_playoffs.jpg',
    lecturaMinutos: '5',
    etiquetas: ['Playoffs', 'FinalesNBA', 'Campeones']
  },
  'nba-102': {
    id: 'nba-102',
    categoria: 'mvp',
    titulo: 'Anuncio Oficial del MVP 2026: Dominio Total y Récords Rotos en la Liga',
    fecha: '2026-05-24',
    autor: 'Sofia Ramírez',
    resumen: 'Con promedios astronómicos de triple-doble y liderando a su franquicia al mejor récord de la temporada regular, el premio al Jugador Más Valioso fue otorgado por unanimidad.',
    contenido: `La votación oficial de la prensa deportiva confirmó lo que se vio en la cancha durante toda la fase regular. El estelar base registró actuaciones memorables, rompiendo marcas históricas de efectividad en tiros de campo y asistencias.

Con promedios de 32.4 puntos, 11.2 asistencias y 8.7 rebotes por partido, el ganador del MVP estableció un nuevo estándar de excelencia individual combinada con éxito colectivo. Su equipo terminó con el mejor récord de la liga, una marca de 65-17 que no se veía desde hace más de una década.

Lo que hace especialmente notable esta temporada es la eficiencia. Con un 52.3% de tiros de campo, un 41.8% desde la línea de tres puntos y un 89.1% en tiros libres, se convirtió en el primer jugador en la historia de la NBA en promediar más de 30 puntos con un verdadero porcentaje de tiro (TS%) superior al 65%.

Los momentos más memorables de la temporada incluyen una racha de 15 triples dobles consecutivos en febrero, un partido de 58 puntos contra uno de los principales rivales de conferencia, y un récord de asistencias en un solo cuarto con 12 pases de gol en el tercer periodo contra los visitantes.

La ceremonia de entrega del premio contó con la presencia de leyendas de la liga, quienes reconocieron públicamente que están presenciando a uno de los jugadores más completos que jamás haya pisado una cancha de la NBA.

El impacto del MVP trasciende las estadísticas individuales. Su liderazgo transformó la cultura del equipo, convirtiendo a una franquicia que no había ganado más de 45 partidos en cinco años en el dominador absoluto de la temporada regular.`,
    imagen: 'assets/images/nba_mvp.jpg',
    lecturaMinutos: '4',
    etiquetas: ['MVP', 'PremiosNBA', 'Records']
  },
  'nba-103': {
    id: 'nba-103',
    categoria: 'draft',
    titulo: 'NBA Draft 2026: La Primera Selección Promete Revolucionar la Liga',
    fecha: '2026-06-25',
    autor: 'Alejandro Silva',
    resumen: 'Las futuras estrellas del baloncesto universitario e internacional conocen sus nuevos destinos en una noche llena de sorpresas e intercambios estratégicos.',
    contenido: `El Barclays Center fue escenario de una jornada electrizante donde la primera selección global desató la ovación del público. Con una envergadura impresionante y un tiro exterior desarrollado a la perfección, este prospecto está listo para impactar desde el primer día.

El número uno del draft, un ala-pívot de 2.08 metros proveniente de la universidad más dominante del baloncesto colegial, fue descrito por los scouts como "el prospecto más completo desde hace una generación". Su combinación de tamaño, habilidad perimetral y visión de juego lo convierte en una pieza transformadora para cualquier franquicia.

Los intercambios de picks marcaron la noche. Tres traspasos se concretaron antes de la selección número 10, reorganizando completamente el panorama del draft. La jugada más sorpresiva fue el intercambio que llevó a un equipo de la Conferencia Oeste a subir del puesto 14 al 5, cediendo dos futuras primeras rondas y un jugador joven con potencial de All-Star.

Los analistas internacionales destacaron la presencia de cinco jugadores nacidos fuera de Estados Unidos entre las primeras 15 selecciones, confirmando la tendencia de globalización que la NBA ha experimentado en la última década. Jugadores de Francia, Serbia, Australia, Canadá y Nigeria fueron seleccionados en la lotería.

La segunda ronda no estuvo exenta de historias emotivas. Un jugador que fue rechazado por tres universidades antes de encontrar su lugar en una escuela pequeña fue seleccionado en el puesto 35, generando una de las reacciones más virales de la noche cuando abrazó a su madre entre lágrimas.

Los equipos ya comenzaron a planificar las ligas de verano donde estos rookies tendrán su primera oportunidad de demostrar su talento en un escenario profesional.`,
    imagen: 'assets/images/nba_draft.jpg',
    lecturaMinutos: '6',
    etiquetas: ['Draft2026', 'Rookies', 'FuturoNBA']
  },
  'nba-104': {
    id: 'nba-104',
    categoria: 'fichajes',
    titulo: 'Mega Traspaso Sacude el Mercado de Agentes Libres en la Conferencia Oeste',
    fecha: '2026-07-02',
    autor: 'Javier Torres',
    resumen: 'Múltiples All-Stars cambian de camiseta en un acuerdo de tres equipos que altera drásticamente el equilibrio de poder para la próxima campaña.',
    contenido: `En uno de los movimientos más audaces de los últimos años, tres franquicias llegaron a un acuerdo multijugador que incluye varias elecciones de primera ronda del draft y veteranos consolidados.

El traspaso involucra a un total de siete jugadores y cuatro selecciones de primera ronda del draft. El equipo que se posiciona como el gran ganador adquirió a dos All-Stars complementarios que, junto a su estrella actual, forman un tridente ofensivo que los analistas califican como "potencialmente imparable".

Las cifras del acuerdo son astronómicas: más de 280 millones de dólares en salarios combinados se movieron entre las tres franquicias, convirtiendo este traspaso en el más grande en términos de valor salarial en la historia de la liga.

El mercado de agentes libres se vio inmediatamente afectado. Varios jugadores que esperaban ofertas máximas vieron cómo sus posibles destinos se reducían dramáticamente, forzando a sus agentes a reconsiderar las estrategias de negociación para el resto del verano.

Los expertos en techo salarial señalan que este movimiento tendrá implicaciones fiscales significativas. Al menos dos de los tres equipos involucrados superarán el segundo nivel del impuesto de lujo, pagando penalidades que podrían alcanzar los 150 millones de dólares adicionales en la próxima temporada.

La reacción de los fanáticos fue mixta pero intensa. Las redes sociales se inundaron con análisis, memes y predicciones sobre cómo este movimiento cambiará el panorama competitivo de la Conferencia Oeste, donde al menos cuatro equipos ahora se consideran legítimos contendientes al título.`,
    imagen: 'assets/images/nba_hero_banner.jpg',
    lecturaMinutos: '4',
    etiquetas: ['AgenciaLibre', 'Traspasos', 'MercadoNBA']
  },
  'nba-105': {
    id: 'nba-105',
    categoria: 'general',
    titulo: 'Nuevas Reglas Arbitrales y Uso de Tecnología IA en la NBA 2026-2027',
    fecha: '2026-07-15',
    autor: 'Elena Gómez',
    resumen: 'La junta de gobernadores de la NBA aprueba ajustes en las faltas ofensivas y sistemas de revisión instantánea para agilizar el ritmo de los partidos.',
    contenido: `Buscando mejorar la fluidez del juego y la precisión en las decisiones arbitrales decisivas, la liga implementará asistentes de revisión asistidos por inteligencia artificial en las jugadas fuera de banda y tiros sobre la bocina.

El nuevo sistema, desarrollado en colaboración con empresas tecnológicas líderes, utiliza más de 30 cámaras de alta velocidad distribuidas por toda la arena para capturar cada jugada desde múltiples ángulos. El algoritmo de IA puede procesar estas imágenes en menos de 3 segundos, proporcionando a los árbitros información precisa sobre contactos, posiciones de pies y trayectorias del balón.

Entre los cambios más significativos se encuentra la modificación de la regla de falta ofensiva en el poste bajo. A partir de la próxima temporada, los jugadores ofensivos tendrán mayor libertad para establecer posición siempre que no utilicen el hombro como punto de contacto principal. Esta modificación busca revitalizar el juego interior sin sacrificar la seguridad de los defensores.

La reducción del tiempo de revisión es otro punto clave. Las revisiones de jugadas en los últimos dos minutos del cuarto periodo estarán limitadas a un máximo de 60 segundos, después de los cuales se mantendrá la decisión original del árbitro en cancha. Esta medida responde a las quejas de jugadores y fanáticos sobre las excesivas interrupciones en los momentos más emocionantes de los partidos.

El comité de competición también anunció ajustes en las reglas del challenge de los entrenadores, permitiendo ahora un desafío adicional en el último periodo si el primero fue exitoso, una modificación que otorga mayor poder a los cuerpos técnicos en los momentos decisivos.

Las pruebas piloto realizadas en la G League durante la pasada temporada mostraron resultados prometedores: un 94% de precisión en las decisiones asistidas por IA y una reducción del 40% en el tiempo total de revisiones.`,
    imagen: 'assets/images/nba_hero_banner.jpg',
    lecturaMinutos: '3',
    etiquetas: ['Reglamento', 'Tecnologia', 'Innovacion']
  },
  'nba-106': {
    id: 'nba-106',
    categoria: 'playoffs',
    titulo: 'Análisis Táctico: El Renacimiento del Juego en la Pintura y el Pívot Moderno',
    fecha: '2026-08-01',
    autor: 'Carlos Mendoza',
    resumen: 'Un repaso profundo a cómo los hombres altos con visión de juego y tiro de tres han transformado los esquemas defensivos de la liga.',
    contenido: `La evolución del baloncesto moderno ha tomado un giro fascinante: los pívots ya no solo dominan bajo el aro, sino que distribuyen el juego desde la cabecera y amenazan la zona perimetral con alta efectividad.

Durante la temporada 2025-2026, los pívots de la liga promediaron un récord histórico de 1.8 triples intentados por partido, un incremento del 340% respecto a hace apenas una década. Más impresionante aún, el porcentaje de acierto se mantuvo en un sólido 35.2%, demostrando que no se trata de un fenómeno de volumen sino de verdadera evolución técnica.

El caso más emblemático es el del pívot estrella que lideró a su equipo en asistencias con 7.3 por noche, convirtiéndose en el primer centro en la historia en liderar a su equipo en esa categoría durante una temporada completa. Su capacidad para leer defensas desde el poste alto y encontrar cortadores o tiradores abiertos ha revolucionado los esquemas ofensivos de su franquicia.

Los coordinadores defensivos han tenido que adaptarse radicalmente. La defensa tradicional de "hundirse" contra el pívot en el poste bajo ya no es viable cuando el hombre grande puede castigarte con un triple desde la esquina o un pase cortante al ala que corta por la puerta de atrás. Esto ha generado un aumento significativo en las defensas cambiantes y las coberturas de ayuda rotacionales.

Las estadísticas avanzadas revelan un dato fascinante: los equipos cuyos pívots promedian más de un triple anotado por partido tienen un récord combinado de 312-178, un porcentaje de victorias del 63.7%. En contraste, los equipos con pívots tradicionales que no amenazan desde el perímetro tienen un récord combinado de 198-292.

Esta tendencia no muestra signos de desaceleración. Los programas universitarios y las academias de desarrollo de la NBA han reestructurado sus entrenamientos para desarrollar habilidades perimetrales en jugadores altos desde edades tempranas, asegurando que la próxima generación de pívots será aún más versátil que la actual.`,
    imagen: 'assets/images/nba_playoffs.jpg',
    lecturaMinutos: '5',
    etiquetas: ['Táctica', 'Evolución', 'Estadísticas']
  }
};

async function loadXMLData() {
  if (cachedXMLDoc) return cachedXMLDoc;
  try {
    const response = await fetch('xml/datos.xml');
    let xmlText = await response.text();
    
    // Remover DOCTYPE para evitar errores de restricción DTD del navegador al parsear en cliente
    xmlText = xmlText.replace(/<!DOCTYPE[^>]*>/i, '');
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    if (doc.getElementsByTagName('parsererror').length === 0) {
      cachedXMLDoc = doc;
      return cachedXMLDoc;
    }
  } catch (err) {
    console.warn('Carga directa de XML falló. Usando respaldo...', err);
  }
  return null;
}

function getArticleDataFromXML(xmlDoc, articleId) {
  if (!xmlDoc) return null;
  const noticias = xmlDoc.getElementsByTagName('noticia');
  for (let i = 0; i < noticias.length; i++) {
    if (noticias[i].getAttribute('id') === articleId) {
      const noticia = noticias[i];
      const etiquetas = [];
      const etiquetaNodes = noticia.getElementsByTagName('etiqueta');
      for (let j = 0; j < etiquetaNodes.length; j++) {
        etiquetas.push(etiquetaNodes[j].textContent);
      }
      return {
        id: articleId,
        categoria: noticia.getAttribute('categoria') || 'general',
        titulo: noticia.getElementsByTagName('titulo')[0]?.textContent || '',
        fecha: noticia.getElementsByTagName('fecha')[0]?.textContent || '',
        autor: noticia.getElementsByTagName('autor')[0]?.textContent || '',
        resumen: noticia.getElementsByTagName('resumen')[0]?.textContent || '',
        contenido: noticia.getElementsByTagName('contenido')[0]?.textContent || '',
        imagen: noticia.getElementsByTagName('imagen')[0]?.textContent || 'assets/images/nba_hero_banner.jpg',
        lecturaMinutos: noticia.getElementsByTagName('lecturaMinutos')[0]?.textContent || '3',
        etiquetas: etiquetas
      };
    }
  }
  return null;
}

async function initCatalogXSLT() {
  const container = document.getElementById('catalog-container');
  if (!container) return;

  try {
    const [xmlResponse, xslResponse] = await Promise.all([
      fetch('xml/datos.xml'),
      fetch('xml/estilos.xsl')
    ]);

    if (!xmlResponse.ok || !xslResponse.ok) {
      throw new Error('Error al cargar los archivos de datos XML/XSLT.');
    }

    let xmlText = await xmlResponse.text();
    const xslText = await xslResponse.text();

    const parser = new DOMParser();
    const xmlDocClean = parser.parseFromString(xmlText.replace(/<!DOCTYPE[^>]*>/i, ''), 'text/xml');
    const xslDoc = parser.parseFromString(xslText, 'text/xml');
    cachedXMLDoc = xmlDocClean;

    if (window.XSLTProcessor) {
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslDoc);
      const resultDocument = xsltProcessor.transformToFragment(xmlDocClean, document);
      container.innerHTML = '';
      container.appendChild(resultDocument);
    } else {
      renderXMLFallback(xmlDocClean, container);
    }

    makeCatalogCardsClickable();
    initCategoryFilters();

  } catch (error) {
    console.warn('Carga XSLT estándar falló. Usando motor cliente...', error);
    loadXMLDirectly(container);
  }
}

async function loadXMLDirectly(container) {
  try {
    const response = await fetch('xml/datos.xml');
    let xmlText = await response.text();
    xmlText = xmlText.replace(/<!DOCTYPE[^>]*>/i, '');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    if (xmlDoc.getElementsByTagName('noticia').length > 0) {
      cachedXMLDoc = xmlDoc;
      renderXMLFallback(xmlDoc, container);
    } else {
      renderCatalogFromDatabase(container);
    }
  } catch (err) {
    renderCatalogFromDatabase(container);
  }
  makeCatalogCardsClickable();
  initCategoryFilters();
}

function renderCatalogFromDatabase(container) {
  const articleKeys = Object.keys(ARTICLES_DATABASE);
  let html = '<div class="news-grid" id="news-grid-items">';

  articleKeys.forEach(key => {
    const item = ARTICLES_DATABASE[key];
    html += `
      <article class="news-card" data-category="${item.categoria}" data-article-id="${item.id}">
        <div class="news-card-img">
          <img src="${item.imagen}" alt="${item.titulo}">
          <span class="category-badge ${item.categoria}" style="position: absolute; top: 1rem; left: 1rem; margin: 0;">${item.categoria.toUpperCase()}</span>
        </div>
        <div class="news-card-content">
          <h3 class="news-card-title">${item.titulo}</h3>
          <p class="news-card-excerpt">${item.resumen}</p>
          <div class="news-card-footer">
            <span>✍️ ${item.autor}</span>
            <span>📅 ${item.fecha} • ⏱️ ${item.lecturaMinutos} min</span>
          </div>
        </div>
      </article>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
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
      <article class="news-card" data-category="${categoria}" data-article-id="${id}">
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

function makeCatalogCardsClickable() {
  const cards = document.querySelectorAll('#catalog-container .news-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.getAttribute('data-article-id');
      if (articleId) {
        window.location.href = `article.html?id=${articleId}`;
      }
    });
  });
}

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const getCards = () => document.querySelectorAll('#catalog-container .news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const newsItems = getCards();

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

/* ==========================================================================
   5. PÁGINA DE ARTÍCULO COMPLETO (article.html)
   ========================================================================== */
async function initArticlePage() {
  const articleContainer = document.getElementById('article-container');
  if (!articleContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (!articleId) {
    articleContainer.innerHTML = `<div style="text-align: center; padding: 4rem; color: var(--text-muted);">
      <h2>📰 No se especificó un artículo</h2>
      <p style="margin-top: 1rem;">Vuelve al <a href="index.html" style="color: var(--primary-nba);">inicio</a> o al <a href="catalog.html" style="color: var(--primary-nba);">catálogo</a> para seleccionar una noticia.</p>
    </div>`;
    return;
  }

  // 1. Intentar obtener el artículo desde el documento XML
  const xmlDoc = await loadXMLData();
  let articleData = getArticleDataFromXML(xmlDoc, articleId);

  // 2. Si falla la carga XML, usar la base de datos JavaScript de respaldo
  if (!articleData && ARTICLES_DATABASE[articleId]) {
    articleData = ARTICLES_DATABASE[articleId];
  }

  if (!articleData) {
    articleContainer.innerHTML = `<div style="text-align: center; padding: 4rem; color: var(--text-muted);">
      <h2>🔍 Artículo no encontrado</h2>
      <p style="margin-top: 1rem;">El artículo con ID "${articleId}" no existe. <a href="catalog.html" style="color: var(--primary-nba);">Ver catálogo completo</a></p>
    </div>`;
    return;
  }

  const { titulo, fecha, autor, contenido, imagen, lecturaMinutos, categoria, etiquetas } = articleData;

  const initials = autor.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const fechaFormateada = formatDate(fecha);
  const paragraphs = contenido.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('');

  document.title = `${titulo} | NBA Noticias`;

  articleContainer.innerHTML = `
    <img src="${imagen}" alt="${titulo}" class="article-hero-img">
    
    <div class="article-header">
      <span class="category-badge ${categoria}">${categoria.toUpperCase()}</span>
      <h1 class="article-title">${titulo}</h1>
      
      <div class="article-meta-bar">
        <div class="article-author">
          <div class="author-avatar">${initials}</div>
          <div class="author-info">
            <strong>${autor}</strong>
            <span>Redactor de NBA Noticias</span>
          </div>
        </div>
        <div class="article-meta-item">📅 ${fechaFormateada}</div>
        <div class="article-meta-item">⏱️ ${lecturaMinutos} min de lectura</div>
      </div>

      <div class="article-tags">
        ${etiquetas.map(tag => `<span class="article-tag">#${tag}</span>`).join('')}
      </div>
    </div>

    <div class="article-body">
      ${paragraphs}
    </div>

    <div class="article-share">
      <span style="font-weight: 700; color: var(--text-main);">📤 Compartir este artículo:</span>
      <div class="share-buttons">
        <button class="share-btn" onclick="copyArticleLink()">🔗 Copiar enlace</button>
        <button class="share-btn" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=' + encodeURIComponent(window.location.href), '_blank')">🐦 Twitter</button>
        <button class="share-btn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank')">📘 Facebook</button>
      </div>
    </div>
  `;

  initComments(articleId);
  loadRelatedArticles(articleId, categoria, xmlDoc);
}

function formatDate(dateStr) {
  try {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const parts = dateStr.split('-');
    const day = parseInt(parts[2]);
    const month = months[parseInt(parts[1]) - 1];
    const year = parts[0];
    return `${day} de ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

function copyArticleLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('🔗 ¡Enlace copiado al portapapeles!', 'success');
  }).catch(() => {
    showToast('⚠️ No se pudo copiar el enlace.', 'warning');
  });
}

// Hacer la función accesible globalmente
window.copyArticleLink = copyArticleLink;

/* ==========================================================================
   6. SISTEMA DE COMENTARIOS (localStorage)
   ========================================================================== */
function initComments(articleId) {
  const commentForm = document.getElementById('comment-form');
  if (!commentForm) return;

  // Cargar comentarios existentes
  renderComments(articleId);

  // Manejar envío de nuevo comentario
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (name.length < 2) {
      showToast('⚠️ El nombre debe tener al menos 2 caracteres.', 'warning');
      return;
    }
    if (text.length < 5) {
      showToast('⚠️ El comentario debe tener al menos 5 caracteres.', 'warning');
      return;
    }

    // Crear comentario
    const comment = {
      id: Date.now().toString(),
      name: name,
      text: text,
      date: new Date().toISOString(),
      likes: 0
    };

    // Guardar en localStorage
    const comments = getComments(articleId);
    comments.unshift(comment);
    saveComments(articleId, comments);

    // Limpiar formulario
    commentForm.reset();
    showToast('✅ ¡Comentario publicado exitosamente!', 'success');

    // Re-renderizar
    renderComments(articleId);
  });
}

function getComments(articleId) {
  try {
    const stored = localStorage.getItem(`nba-comments-${articleId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveComments(articleId, comments) {
  localStorage.setItem(`nba-comments-${articleId}`, JSON.stringify(comments));
}

function renderComments(articleId) {
  const commentsList = document.getElementById('comments-list');
  const commentCount = document.getElementById('comment-count');
  if (!commentsList) return;

  const comments = getComments(articleId);

  // Actualizar contador
  if (commentCount) {
    commentCount.textContent = `${comments.length} comentario${comments.length !== 1 ? 's' : ''}`;
  }

  if (comments.length === 0) {
    commentsList.innerHTML = `
      <div class="no-comments">
        <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">💬</p>
        <p>Sé el primero en comentar esta noticia.</p>
      </div>
    `;
    return;
  }

  commentsList.innerHTML = comments.map(comment => {
    const initials = comment.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const dateFormatted = formatCommentDate(comment.date);

    return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-user">
            <div class="comment-avatar">${initials}</div>
            <div>
              <div class="comment-user-name">${escapeHtml(comment.name)}</div>
              <div class="comment-date">${dateFormatted}</div>
            </div>
          </div>
        </div>
        <div class="comment-body">${escapeHtml(comment.text)}</div>
        <div class="comment-actions">
          <button class="comment-action-btn ${comment.likes > 0 ? 'liked' : ''}" onclick="likeComment('${articleId}', '${comment.id}')">
            ❤️ <span>${comment.likes > 0 ? comment.likes : 'Me gusta'}</span>
          </button>
          <button class="comment-action-btn" onclick="deleteComment('${articleId}', '${comment.id}')">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function formatCommentDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function likeComment(articleId, commentId) {
  const comments = getComments(articleId);
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.likes = (comment.likes || 0) + 1;
    saveComments(articleId, comments);
    renderComments(articleId);
  }
}

function deleteComment(articleId, commentId) {
  if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
  const comments = getComments(articleId).filter(c => c.id !== commentId);
  saveComments(articleId, comments);
  renderComments(articleId);
  showToast('🗑️ Comentario eliminado.', 'success');
}

// Hacer funciones accesibles globalmente
window.likeComment = likeComment;
window.deleteComment = deleteComment;

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   7. NOTICIAS RELACIONADAS
   ========================================================================== */
function loadRelatedArticles(currentId, currentCategory, xmlDoc) {
  const relatedGrid = document.getElementById('related-grid');
  if (!relatedGrid) return;

  const noticias = xmlDoc.getElementsByTagName('noticia');
  let relatedHTML = '';
  let count = 0;

  // Primero buscar de la misma categoría
  for (let i = 0; i < noticias.length && count < 3; i++) {
    const noticia = noticias[i];
    const id = noticia.getAttribute('id');
    const cat = noticia.getAttribute('categoria');
    if (id === currentId) continue;

    if (cat === currentCategory || count < 3) {
      const titulo = noticia.getElementsByTagName('titulo')[0]?.textContent || '';
      const imagen = noticia.getElementsByTagName('imagen')[0]?.textContent || '';
      const resumen = noticia.getElementsByTagName('resumen')[0]?.textContent || '';
      const autor = noticia.getElementsByTagName('autor')[0]?.textContent || '';
      const fecha = noticia.getElementsByTagName('fecha')[0]?.textContent || '';

      relatedHTML += `
        <article class="news-card" onclick="window.location.href='article.html?id=${id}'" style="cursor: pointer;">
          <div class="news-card-img">
            <img src="${imagen}" alt="${titulo}">
            <span class="category-badge ${cat}" style="position: absolute; top: 1rem; left: 1rem; margin: 0;">${cat.toUpperCase()}</span>
          </div>
          <div class="news-card-content">
            <h3 class="news-card-title">${titulo}</h3>
            <p class="news-card-excerpt">${resumen.substring(0, 100)}...</p>
            <div class="news-card-footer">
              <span>✍️ ${autor}</span>
              <span>📅 ${fecha}</span>
            </div>
          </div>
        </article>
      `;
      count++;
    }
  }

  if (relatedHTML) {
    relatedGrid.innerHTML = relatedHTML;
  } else {
    document.getElementById('related-section').style.display = 'none';
  }
}
