import type { APIRoute } from "astro";
import { SITE } from "../config/site.mjs";

export const GET: APIRoute = () => {
  const pages = import.meta.glob("/src/pages/**/*.astro", { eager: true });

  const urls = Object.keys(pages)
    .filter((p) => !p.includes("404") && !p.includes("["))
    .map((p) => {
      const url = p
        .replace("/src/pages", "")
        .replace("/index.astro", "/")
        .replace(".astro", "/");
      return `${SITE.url}${url}`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
