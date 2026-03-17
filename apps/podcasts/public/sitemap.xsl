<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>MelodyMind Sitemap</title>
        <style>
          body { font-family: system-ui, Arial, sans-serif; background:#0f172a; color:#f1f5f9; margin:2rem; }
          h1 { color:#a855f7; }
          table { border-collapse: collapse; width:100%; margin-top:1.5rem; }
          th, td { padding:0.5rem 0.75rem; border-bottom:1px solid #334155; text-align:left; }
          th { background:#1e293b; color:#f8fafc; position:sticky; top:0; }
          a { color:#93c5fd; text-decoration:none; }
          a:hover { text-decoration:underline; color:#bfdbfe; }
          .locale { font-size:0.75rem; padding:0.15rem 0.4rem; border-radius:0.25rem; background:#334155; color:#f1f5f9; }
          footer { margin-top:2rem; font-size:0.85rem; color:#94a3b8; }
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
