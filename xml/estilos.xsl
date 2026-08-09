<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <div class="news-grid" id="news-grid-items">
      <xsl:for-each select="catalogonoticias/noticia">
        <xsl:sort select="fecha" order="descending"/>
        
        <article class="news-card" data-category="{@categoria}" data-article-id="{@id}">
          <div class="news-card-img">
            <img src="{imagen}" alt="{titulo}"/>
            <span class="category-badge {@categoria}" style="position: absolute; top: 1rem; left: 1rem; margin: 0;">
              <xsl:value-of select="translate(@categoria, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
            </span>
          </div>
          
          <div class="news-card-content">
            <h3 class="news-card-title">
              <xsl:value-of select="titulo"/>
            </h3>
            
            <p class="news-card-excerpt">
              <xsl:value-of select="resumen"/>
            </p>

            <div class="news-card-tags" style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <xsl:for-each select="etiquetas/etiqueta">
                <span style="font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.2rem 0.6rem; border-radius: 4px; color: var(--text-muted);">
                  #<xsl:value-of select="."/>
                </span>
              </xsl:for-each>
            </div>
            
            <div class="news-card-footer">
              <span>✍️ <xsl:value-of select="autor"/></span>
              <span>📅 <xsl:value-of select="fecha"/> • ⏱️ <xsl:value-of select="lecturaMinutos"/> min</span>
            </div>
          </div>
        </article>
      </xsl:for-each>
    </div>
  </xsl:template>

</xsl:stylesheet>
