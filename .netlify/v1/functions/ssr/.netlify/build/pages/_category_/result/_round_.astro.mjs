import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent, b as createAstro, d as addAttribute } from '../../../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon, b as $$Layout } from '../../../chunks/Layout_D5hPvjSV.mjs';
import { $ as $$IntroText } from '../../../chunks/IntroText_D6vIU1LS.mjs';
import { $ as $$Button } from '../../../chunks/Button_wMB39no-.mjs';
/* empty css                                         */
import { c as categories } from '../../../chunks/categories_Ckn1CJny.mjs';
import { $ as $$ShowCoins } from '../../../chunks/ShowCoins__LVeRE39.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Points = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="points" data-astro-cid-lfmjcnuq> ${renderComponent($$result, "Icon", $$Icon, { "name": "coin", "width": 48, "height": 48, "data-astro-cid-lfmjcnuq": true })} <span class="point" data-astro-cid-lfmjcnuq></span> <div class="finishButton" data-astro-cid-lfmjcnuq> ${renderComponent($$result, "Button", $$Button, { "id": "finishedButton", "url": "#", "data-astro-cid-lfmjcnuq": true })} </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Result/Points.astro", void 0);

const $$Astro = createAstro();
const $$round = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$round;
  const { category, round } = Astro2.params;
  const currentCategory = categories.find((cat) => cat.slug === category);
  const currentRound = currentCategory?.rounds.find((rnd) => rnd.slug === round);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentCategory?.name} - ${currentRound?.headline} - Ergebnisse`, "data-astro-cid-p3nc6pya": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "IntroText", $$IntroText, { "headline": `${currentRound?.headline} - Ergebnisse`, "subline": currentRound?.introSubline, "whiteText": currentRound?.sortToText, "isSmallHeadline": true, "isWhiteSubline": true, "data-astro-cid-p3nc6pya": true })} ${maybeRenderHead()}<div class="results" id="results-container"${addAttribute(category, "data-category")}${addAttribute(round?.replace("#", ""), "data-round")} data-astro-cid-p3nc6pya></div> ${renderComponent($$result2, "Points", $$Points, { "data-astro-cid-p3nc6pya": true })} `, "left-headercol": ($$result2) => renderTemplate`<div data-astro-cid-p3nc6pya> ${renderComponent($$result2, "ShowCoins", $$ShowCoins, { "data-astro-cid-p3nc6pya": true })} </div>` })}  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/result/[round].astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/result/[round].astro";
const $$url = "/[category]/result/[round]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$round,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
