<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>MelodyMind Sitemap</title>
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
            --border-default: #4a5c78;
            --border-muted: rgba(74, 92, 120, 0.2);
            --shadow-base: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -4px rgba(0, 0, 0, 0.1);
            --radius-base: 0.5rem;
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
              --border-default: #5b6d8d;
              --border-muted: rgba(91, 109, 141, 0.25);
              --shadow-base: 0 20px 25px -5px rgba(0, 0, 0, 0.28),
                0 8px 10px -6px rgba(0, 0, 0, 0.28);
            }
          }

          body {
            font-family: "Atkinson Hyperlegible", system-ui, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            margin: 2rem;
          }
          h1 { color: var(--accent-strong); }
          p { color: var(--text-secondary); }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 1.5rem;
            background: linear-gradient(180deg, var(--surface-1), var(--surface-2));
            border: 1px solid var(--border-default);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-base);
            overflow: hidden;
          }
          th, td {
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid var(--border-muted);
            text-align: left;
          }
          th {
            background: var(--surface-3);
            color: var(--text-primary);
            position: sticky;
            top: 0;
          }
          a { color: var(--accent-primary); text-decoration: none; }
          a:hover { text-decoration: underline; color: var(--accent-strong); }
          .locale {
            font-size: 1.125rem;
            padding: 0.15rem 0.4rem;
            border-radius: 0.25rem;
            background: color-mix(in srgb, var(--accent-primary) 12%, var(--surface-2));
            color: var(--accent-strong);
            border: 1px solid var(--border-muted);
          }
          footer { margin-top: 2rem; font-size: 1.125rem; color: var(--text-secondary); }
        </style>
      </head>
      <body>
        <h1>MelodyMind Sitemap Index</h1>
        <p>A human-readable view of the generated sitemap files. Each row represents one entry and its available language variants.</p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Updated</th>
            <th>Priority</th>
            <th>Change Frequency</th>
            <th>Alternate Locales</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></td>
              <td><xsl:value-of select="sitemap:lastmod" /></td>
              <td><xsl:value-of select="sitemap:priority" /></td>
              <td><xsl:value-of select="sitemap:changefreq" /></td>
              <td>
                <xsl:for-each select="xhtml:link">
                  <span class="locale"><xsl:value-of select="@hreflang" /></span>
                </xsl:for-each>
              </td>
            </tr>
          </xsl:for-each>
        </table>
        <footer>© 2025 MelodyMind Podcasts. This view is for reference only. Search engines read the raw XML structure.</footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
