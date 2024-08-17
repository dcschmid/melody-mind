import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { b as $$Layout } from '../chunks/Layout_D5hPvjSV.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../chunks/_astro_assets_DaWUHmqA.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Insta = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Instastory", "showHeader": false, "data-astro-cid-r2huxbr6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-r2huxbr6> ${renderComponent($$result2, "Picture", $$Picture, { "class": "cover", "src": "/imagesites/instastory.jpg", "width": 480, "height": 815, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-r2huxbr6": true })} <a class="button" href="/login" data-astro-cid-r2huxbr6><span class="rainbowText" data-astro-cid-r2huxbr6>COVERSHUFFLE</span></a> </div> ` })} `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/insta.astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/insta.astro";
const $$url = "/insta";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Insta,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
