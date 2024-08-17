import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { b as $$Layout } from '../../chunks/Layout_D5hPvjSV.mjs';
import { $ as $$Button } from '../../chunks/Button_wMB39no-.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Nilzvideo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Video von Nils", "data-astro-cid-losvxtax": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<video autoplay controls data-astro-cid-losvxtax> <source src="/video/9x16-coverlover-fleetwood-mac_HGzQD4M4.mp4" type="video/mp4" data-astro-cid-losvxtax>
Your browser does not support the video tag.
</video> <div class="centerButton" data-astro-cid-losvxtax> ${renderComponent($$result2, "Button", $$Button, { "buttonText": "Neue Kategorie ausw\xE4hlen", "url": "/gamehome", "data-astro-cid-losvxtax": true })} </div> `, "left-headercol": ($$result2) => renderTemplate`<div data-astro-cid-losvxtax></div>` })} `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/videos/nilzvideo.astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/videos/nilzvideo.astro";
const $$url = "/videos/nilzvideo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nilzvideo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
