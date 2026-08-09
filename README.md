# 🏀 NBA Noticias — Sitio Web Profesional

Portal de noticias deportivas sobre la NBA construido con **HTML5 semántico**, **CSS3 avanzado** (variables, Grid, Flexbox, responsive), y un **catálogo dinámico XML + XSLT** con validación DTD y XSD.

---

## 📁 Estructura del Proyecto

```
nnn/
├── index.html          ← Página principal (Hero, Ticker, Noticias, Tabla)
├── about.html           ← Acerca de Nosotros (Equipo, Valores, Métricas)
├── catalog.html         ← Catálogo Dinámico (XML → XSLT → HTML)
├── contact.html         ← Formulario de Contacto (Validación HTML5 + JS)
├── css/
│   └── styles.css       ← Hoja de estilos externa avanzada
├── js/
│   └── main.js          ← Lógica: menú móvil, validación, cargador XSLT
├── xml/
│   ├── datos.xml        ← Fuente de datos (6+ registros de noticias)
│   ├── datos.dtd        ← Validación de estructura DTD
│   ├── datos.xsd        ← Validación de estructura XSD (XML Schema)
│   └── estilos.xsl      ← Hoja de transformación XSLT
└── assets/
    └── images/          ← Imágenes del sitio
```

---

## 🚀 Cómo Ejecutar Localmente

> **IMPORTANTE**: Los archivos XML/XSLT requieren un servidor HTTP. No funcionarán abriendo `index.html` directamente con doble clic.

### Opción 1: Extensión Live Server (VS Code)
1. Instala la extensión **Live Server** en VS Code.
2. Haz clic derecho en `index.html` → **Open with Live Server**.

### Opción 2: Servidor Python
```bash
cd nnn
python -m http.server 8080
```
Luego abre: `http://localhost:8080`

### Opción 3: Node.js
```bash
npx -y serve .
```

---

## 🌐 Publicar en GitHub Pages

1. **Crear repositorio** en GitHub (ej: `nba-noticias`).
2. **Subir archivos** al repositorio:
   ```bash
   git init
   git add .
   git commit -m "NBA Noticias - Sitio web completo"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/nba-noticias.git
   git push -u origin main
   ```
3. **Activar GitHub Pages**:
   - Ve a **Settings → Pages**.
   - En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
   - Haz clic en **Save**.
4. Tu sitio estará disponible en: `https://TU_USUARIO.github.io/nba-noticias/`

---

## ✅ Requisitos Técnicos Cumplidos

| Requisito | Estado |
|---|---|
| Mínimo 4 páginas HTML5 | ✅ index, about, catalog, contact |
| Etiquetas semánticas (header, nav, main, section, article, footer) | ✅ |
| Formulario con validación HTML5 + JavaScript | ✅ contact.html |
| Tabla accesible (thead, tbody, scope, ARIA) | ✅ index.html y about.html |
| CSS externo con variables `:root` | ✅ css/styles.css |
| Layout Flexbox y Grid | ✅ |
| Responsive (3 breakpoints: móvil, tablet, escritorio) | ✅ |
| Transiciones y animaciones CSS | ✅ |
| datos.xml con 6+ registros | ✅ xml/datos.xml |
| DTD para validar XML | ✅ xml/datos.dtd |
| XSD para validar XML | ✅ xml/datos.xsd |
| XSLT para transformar XML en HTML | ✅ xml/estilos.xsl |
| Catálogo dinámico visible en catalog.html | ✅ |

---

## 📝 Licencia

Proyecto académico. © 2026 NBA Noticias.
