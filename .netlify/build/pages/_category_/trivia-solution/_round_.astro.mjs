import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent, b as createAstro, d as addAttribute } from '../../../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon, b as $$Layout } from '../../../chunks/Layout_D5hPvjSV.mjs';
import { $ as $$Button } from '../../../chunks/Button_wMB39no-.mjs';
/* empty css                                         */
import { c as categories } from '../../../chunks/categories_Ckn1CJny.mjs';
import { $ as $$ShowCoins } from '../../../chunks/ShowCoins__LVeRE39.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$TriviaFinishOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TriviaFinishOverlay;
  const { url } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="overlayFinish" class="overlayFinish" data-astro-cid-5gjdxlvf> <div class="overlayFinish-content" data-astro-cid-5gjdxlvf> <div class="shareRoot" data-astro-cid-5gjdxlvf> ${renderComponent($$result, "Icon", $$Icon, { "name": "share", "width": 48, "height": 48, "data-astro-cid-5gjdxlvf": true })} </div> ${renderComponent($$result, "Icon", $$Icon, { "name": "diamond", "width": 150, "height": 150, "data-astro-cid-5gjdxlvf": true })} <div class="bigHeadline" data-astro-cid-5gjdxlvf>Glückwunsch!</div> <div class="headline" data-astro-cid-5gjdxlvf>PopRock erfolgreich durchgespielt!</div> <div class="subline" data-astro-cid-5gjdxlvf>Punktzahl verdoppelt</div> <div class="points" data-astro-cid-5gjdxlvf>+200 Pt</div> <div class="totalText" data-astro-cid-5gjdxlvf>gesamt</div> <div class="totalPoints" data-astro-cid-5gjdxlvf></div> <div class="centerButton" data-astro-cid-5gjdxlvf> ${renderComponent($$result, "Button", $$Button, { "id": "playVideo", "buttonText": "Video abspielen", "url": url, "data-astro-cid-5gjdxlvf": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Trivia/TriviaFinishOverlay.astro", void 0);

const $$Astro = createAstro();
const $$round = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$round;
  const { category, round } = Astro2.params;
  const currentCategory = categories.find((cat) => cat.slug === category);
  const currentRound = currentCategory?.rounds.find((rnd) => rnd.slug === round);
  const centerButtonText = round === "round-one" || round === "round-two" ? "n\xE4chste Runde" : "Spiel beenden";
  const centerButtonUrl = round === "round-one" ? `/${currentCategory?.slug}/round-two` : round === "round-two" ? `/${currentCategory?.slug}/round-three` : `#`;
  const centerButtonID = round === "round-three" ? "openOverlay" : "";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentCategory?.name} - ${currentRound?.headline} - Trivia L\xF6sung`, "showUserLink": false, "data-astro-cid-qaxisrrp": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "TriviaFinishOverlay", $$TriviaFinishOverlay, { "url": currentCategory?.videoPage ? currentCategory?.videoPage : "/gamehome", "data-astro-cid-qaxisrrp": true })} ${maybeRenderHead()}<div class="solution"${addAttribute(category, "data-category")}${addAttribute(round?.replace("#", ""), "data-round")} data-astro-cid-qaxisrrp> <div class="cover" data-astro-cid-qaxisrrp> <img class="picture" src=""${addAttribute(240, "width")}${addAttribute(240, "height")} alt="" data-astro-cid-qaxisrrp> ${renderComponent($$result2, "Icon", $$Icon, { "class": "shareIcon", "name": "share", "width": 48, "height": 48, "data-astro-cid-qaxisrrp": true })} </div> <div class="solutionHeadline" data-astro-cid-qaxisrrp></div> <div class="answer" data-astro-cid-qaxisrrp></div> </div> <div class="centerButton" data-astro-cid-qaxisrrp> ${renderComponent($$result2, "Button", $$Button, { "id": centerButtonID, "buttonText": centerButtonText, "url": centerButtonUrl, "data-astro-cid-qaxisrrp": true })} </div> `, "left-headercol": ($$result2) => renderTemplate`<div data-astro-cid-qaxisrrp> ${renderComponent($$result2, "ShowCoins", $$ShowCoins, { "data-astro-cid-qaxisrrp": true })} </div>` })}  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/trivia-solution/[round].astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/trivia-solution/[round].astro";
const $$url = "/[category]/trivia-solution/[round]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$round,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
