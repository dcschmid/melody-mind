import { c as createComponent, r as renderTemplate, a as renderComponent, b as createAstro, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../chunks/_astro_assets_DaWUHmqA.mjs';
import { b as $$Layout } from '../chunks/Layout_D5hPvjSV.mjs';
import { $ as $$Button } from '../chunks/Button_wMB39no-.mjs';
import { $ as $$IntroText } from '../chunks/IntroText_D6vIU1LS.mjs';
import { c as categories } from '../chunks/categories_Ckn1CJny.mjs';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$category = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  const currentCategory = categories.find((cat) => cat.slug === category);
  if (!currentCategory) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Kategorie Start", "data-astro-cid-e6jqf47y": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "IntroText", $$IntroText, { "headline": `${currentCategory?.name} gew\xE4hlt!`, "subline": currentCategory?.introSubline, "data-astro-cid-e6jqf47y": true })} ${maybeRenderHead()}<div class="category"${addAttribute(currentCategory?.slug, "data-category")} data-astro-cid-e6jqf47y> <div class="cover" data-astro-cid-e6jqf47y> ${renderComponent($$result2, "Picture", $$Picture, { "src": currentCategory?.categoryImage, "width": 240, "height": 240, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-e6jqf47y": true })} </div> <div class="categoryHeadline" data-astro-cid-e6jqf47y>${currentCategory?.categoryHeadline}</div> <div class="text" data-astro-cid-e6jqf47y> ${currentCategory?.categoryText} </div> </div> <div class="centerButton" data-astro-cid-e6jqf47y> ${renderComponent($$result2, "Button", $$Button, { "buttonText": "weiter", "url": `${currentCategory?.slug}/round-one`, "data-astro-cid-e6jqf47y": true })} </div> `, "left-headercol": ($$result2) => renderTemplate`<div data-astro-cid-e6jqf47y></div>` })}  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/[category].astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/[category].astro";
const $$url = "/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
