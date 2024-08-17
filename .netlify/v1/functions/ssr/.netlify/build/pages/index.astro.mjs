import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { b as $$Layout } from '../chunks/Layout_D5hPvjSV.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../chunks/_astro_assets_DaWUHmqA.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Wilkommen zum Cover Shuffle", "showHeader": false, "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Picture", $$Picture, { "class": "cover", "src": "/imagesites/cover-shuffle.jpg", "width": 480, "height": 815, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-j7pv25f6": true })} <a class="button" href="/gamehome" data-astro-cid-j7pv25f6>Jetzt loslegen</a> </div> ` })} `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/index.astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
