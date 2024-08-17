import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { b as $$Layout } from '../chunks/Layout_D5hPvjSV.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../chunks/_astro_assets_DaWUHmqA.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "ARD Login", "showHeader": false, "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-sgpqyurt> ${renderComponent($$result2, "Picture", $$Picture, { "class": "cover", "src": "/imagesites/ardlogin.jpg", "width": 480, "height": 815, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-sgpqyurt": true })} <a class="loginButton" href="/loadingscreen" data-astro-cid-sgpqyurt>Jetzt loslegen</a> <a class="withoutLoginButton" href="/loadingscreen" data-astro-cid-sgpqyurt>Ohne Anmeldung</a> </div> ` })} `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/login.astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
