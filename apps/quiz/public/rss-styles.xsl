<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          :root {
            --bg-primary: #f7f9fc;
            --surface-1: #ffffff;
            --surface-2: #f2f6fb;
            --surface-3: #e8edf5;
            --text-primary: #0d111b;
            --text-secondary: #2a3446;
            --text-tertiary: #3f4d65;
            --accent-primary: #7a4700;
            --accent-strong: #5b3000;
            --accent-soft: #9a5800;
            --border-default: #4a5c78;
            --border-muted: rgba(74, 92, 120, 0.2);
            --shadow-base: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -4px rgba(0, 0, 0, 0.1);
            --radius-base: 0.5rem;
            --radius-pill: 9999px;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-primary: #080c14;
              --surface-1: #06090f;
              --surface-2: #0d1219;
              --surface-3: #141b26;
              --text-primary: #f6f9fc;
              --text-secondary: #c5d0e5;
              --text-tertiary: #a8b7d1;
              --accent-primary: #99d9ff;
              --accent-strong: #c5ebff;
              --accent-soft: #7dcbf5;
              --border-default: #5b6d8d;
              --border-muted: rgba(91, 109, 141, 0.25);
              --shadow-base: 0 20px 25px -5px rgba(0, 0, 0, 0.28),
                0 8px 10px -6px rgba(0, 0, 0, 0.28);
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: "Atkinson Hyperlegible", system-ui, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--bg-primary);
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: linear-gradient(160deg, var(--surface-2), var(--surface-1));
            padding: 40px;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-base);
          }
          header {
            border-bottom: 2px solid var(--border-default);
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            color: var(--text-primary);
            font-size: 2rem;
            margin-bottom: 10px;
          }
          .description {
            color: var(--text-secondary);
            font-size: 1.125rem;
          }
          .info-box {
            background: color-mix(in srgb, var(--accent-primary) 12%, var(--surface-2));
            border-left: 4px solid var(--accent-primary);
            padding: 15px;
            margin: 20px 0;
            border-radius: var(--radius-base);
          }
          .info-box strong {
            color: var(--accent-strong);
          }
          .item {
            border-bottom: 1px solid var(--border-default);
            padding: 20px 0;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item h2 {
            color: var(--accent-strong);
            font-size: 1.4rem;
            margin-bottom: 8px;
          }
          .item h2 a {
            color: inherit;
            text-decoration: none;
          }
          .item h2 a:hover {
            text-decoration: underline;
          }
          .item-meta {
            color: var(--text-secondary);
            font-size: 1.125rem;
            margin-bottom: 10px;
          }
          .item-description {
            color: var(--text-tertiary);
            line-height: 1.7;
          }
          .categories {
            margin-top: 10px;
          }
          .category {
            display: inline-block;
            background: color-mix(in srgb, var(--accent-primary) 12%, var(--surface-1));
            color: var(--accent-strong);
            padding: 4px 12px;
            border: 1px solid var(--border-muted);
            border-radius: var(--radius-pill);
            font-size: 1.125rem;
            margin-right: 6px;
            margin-top: 6px;
          }
          footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid var(--border-default);
            text-align: center;
            color: var(--text-secondary);
            font-size: 1.125rem;
          }
          footer a {
            color: var(--accent-primary);
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
