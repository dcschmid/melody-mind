<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            color: #1a202c;
            font-size: 2rem;
            margin-bottom: 10px;
          }
          .description {
            color: #64748b;
            font-size: 1.1rem;
          }
          .info-box {
            background: #f1f5f9;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box strong {
            color: #1e40af;
          }
          .item {
            border-bottom: 1px solid #e2e8f0;
            padding: 20px 0;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item h2 {
            color: #1e40af;
            font-size: 1.4rem;
            margin-bottom: 8px;
          }
          .item h2 a {
            color: #1e40af;
            text-decoration: none;
          }
          .item h2 a:hover {
            text-decoration: underline;
          }
          .item-meta {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 10px;
          }
          .item-description {
            color: #475569;
            line-height: 1.7;
          }
          .categories {
            margin-top: 10px;
          }
          .category {
            display: inline-block;
            background: #e0e7ff;
            color: #3730a3;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85rem;
            margin-right: 6px;
            margin-top: 6px;
          }
          footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
          }
          @media (max-width: 640px) {
            .container {
              padding: 20px;
            }
            h1 {
              font-size: 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
          </header>
          
          <div class="info-box">
            <strong>📡 This is an RSS feed.</strong> Subscribe by copying the URL from the address bar into your RSS reader.
          </div>
          
          <main>
            <xsl:for-each select="/rss/channel/item">
              <article class="item">
                <h2>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="link"/>
                    </xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <div class="item-meta">
                  <xsl:if test="pubDate">
                    Published: <xsl:value-of select="pubDate"/>
                  </xsl:if>
                  <xsl:if test="author">
                    · By <xsl:value-of select="author"/>
                  </xsl:if>
                </div>
                <p class="item-description">
                  <xsl:value-of select="description"/>
                </p>
                <xsl:if test="category">
                  <div class="categories">
                    <xsl:for-each select="category">
                      <span class="category"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </article>
            </xsl:for-each>
          </main>
          
          <footer>
            <p>© MelodyMind Knowledge · <a href="https://melody-mind.de">Visit Website</a></p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
