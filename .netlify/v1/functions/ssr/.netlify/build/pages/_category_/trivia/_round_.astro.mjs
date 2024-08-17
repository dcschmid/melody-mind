import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent, b as createAstro, d as addAttribute } from '../../../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$TimeupsOverlay, F as For, a as $$Timer } from '../../../chunks/Timer_Bi1TmKem.mjs';
import { $ as $$IntroText } from '../../../chunks/IntroText_D6vIU1LS.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../../../chunks/_astro_assets_DaWUHmqA.mjs';
import { $ as $$Icon, b as $$Layout } from '../../../chunks/Layout_D5hPvjSV.mjs';
/* empty css                                         */
import { $ as $$Button } from '../../../chunks/Button_wMB39no-.mjs';
import { c as categories } from '../../../chunks/categories_Ckn1CJny.mjs';
import { s as shuffleArray } from '../../../chunks/shuffleArray_KhgXiPkd.mjs';
import { $ as $$ShowCoins } from '../../../chunks/ShowCoins__LVeRE39.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro$5 = createAstro();
const $$TriviaItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TriviaItem;
  const { band = "", album = "", image } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="triviaItem" data-astro-cid-7tyb73fc> ${renderComponent($$result, "Picture", $$Picture, { "class": "cover", "src": image, "width": 126, "height": 126, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-7tyb73fc": true })} <div class="band" data-astro-cid-7tyb73fc>${band}</div> <div class="album" data-astro-cid-7tyb73fc>${album}</div> ${renderComponent($$result, "Icon", $$Icon, { "class": "star", "name": "star", "width": 39, "height": 37, "data-astro-cid-7tyb73fc": true })} </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Trivia/TriviaItem.astro", void 0);

const $$Astro$4 = createAstro();
const $$TriviaLostOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$TriviaLostOverlay;
  const { url } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="overlayLost" class="overlay" data-astro-cid-xoy5yqtu> <div class="overlayLost-content" data-astro-cid-xoy5yqtu> ${renderComponent($$result, "Icon", $$Icon, { "name": "lost", "width": 80, "height": 80, "data-astro-cid-xoy5yqtu": true })} <div class="headline" data-astro-cid-xoy5yqtu>Leider falsch</div> <div class="subline" data-astro-cid-xoy5yqtu>Punktestand bleibt</div> <div class="point" data-astro-cid-xoy5yqtu></div> <div class="centerButton" data-astro-cid-xoy5yqtu> ${renderComponent($$result, "Button", $$Button, { "buttonText": "Aufl\xF6sung", "url": url, "data-astro-cid-xoy5yqtu": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Trivia/TriviaLostOverlay.astro", void 0);

const $$Astro$3 = createAstro();
const $$TriviaStartOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$TriviaStartOverlay;
  const { question } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="overlayStart" class="overlay" data-astro-cid-p3irw2qr> <div class="overlayStart-content" data-astro-cid-p3irw2qr> ${renderComponent($$result, "Icon", $$Icon, { "name": "star-golden", "width": 80, "height": 80, "data-astro-cid-p3irw2qr": true })} <div class="headline" data-astro-cid-p3irw2qr>Trivia Frage</div> <div class="subline" data-astro-cid-p3irw2qr>verdoppeln Sie Ihren Punktestand!</div> <div class="question" data-astro-cid-p3irw2qr>${question}</div> <div class="centerButton" data-astro-cid-p3irw2qr> ${renderComponent($$result, "Button", $$Button, { "id": "gameButton", "buttonText": "weiter", "url": "#", "data-astro-cid-p3irw2qr": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Trivia/TriviaStartOverlay.astro", void 0);

const $$Astro$2 = createAstro();
const $$TriviaWonLPOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$TriviaWonLPOverlay;
  const { url } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="overlayWonLP" class="overlay" data-astro-cid-c5hnucz6> <div class="content" data-astro-cid-c5hnucz6> <div class="goldenLPRoot" data-astro-cid-c5hnucz6> ${renderComponent($$result, "Icon", $$Icon, { "name": "golden-lp", "width": 200, "height": 200, "data-astro-cid-c5hnucz6": true })} </div> <div class="headline" data-astro-cid-c5hnucz6>Glückwunsch!</div> <div class="centerText" data-astro-cid-c5hnucz6>Alles richtig! Sie haben eine goldene Schallplatte erspielt!</div> <div class="smallText" data-astro-cid-c5hnucz6>& Punktestand verdoppelt!</div> <div class="point" data-astro-cid-c5hnucz6></div> <div class="centerButton" data-astro-cid-c5hnucz6> ${renderComponent($$result, "Button", $$Button, { "buttonText": "Aufl\xF6sung", "url": url, "data-astro-cid-c5hnucz6": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Trivia/TriviaWonLPOverlay.astro", void 0);

const $$Astro$1 = createAstro();
const $$TriviaWonOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TriviaWonOverlay;
  const { url } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="overlayWon" class="overlay" data-astro-cid-js4mfntm> <div class="overlayWon-content" data-astro-cid-js4mfntm> ${renderComponent($$result, "Icon", $$Icon, { "name": "golden-coins", "width": 80, "height": 80, "data-astro-cid-js4mfntm": true })} <div class="headline" data-astro-cid-js4mfntm>Glückwunsch!</div> <div class="subline" data-astro-cid-js4mfntm>Punktestand verdoppelt!</div> <div class="point" data-astro-cid-js4mfntm></div> <div class="centerButton" data-astro-cid-js4mfntm> ${renderComponent($$result, "Button", $$Button, { "buttonText": "Aufl\xF6sung", "url": url, "data-astro-cid-js4mfntm": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Trivia/TriviaWonOverlay.astro", void 0);

const $$Astro = createAstro();
const $$round = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$round;
  const { category, round } = Astro2.params;
  const currentCategory = categories.find((cat) => cat.slug === category);
  const currentRound = currentCategory?.rounds.find((rnd) => rnd.slug === round);
  const randomizedTriviaData = shuffleArray(currentRound?.coverData ?? []);
  const wonItem = randomizedTriviaData[0];
  const lostItems = randomizedTriviaData.slice(1);
  const triviaDataWithTypes = [{ ...wonItem, type: "won" }, ...lostItems.map((item) => ({ ...item, type: "lost" }))];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentCategory?.name} - ${currentRound?.headline} - Trivia Frage`, "showUserLink": false, "data-astro-cid-neaz6txk": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "TriviaStartOverlay", $$TriviaStartOverlay, { "question": wonItem?.triviaQuestion, "data-astro-cid-neaz6txk": true })} ${renderComponent($$result2, "TimeupsOverlay", $$TimeupsOverlay, { "url": `/${category}/trivia-solution/${round}`, "data-astro-cid-neaz6txk": true })} ${renderComponent($$result2, "TriviaLostOverlay", $$TriviaLostOverlay, { "url": `/${category}/trivia-solution/${round}`, "data-astro-cid-neaz6txk": true })} ${renderComponent($$result2, "TriviaWonOverlay", $$TriviaWonOverlay, { "url": `/${category}/trivia-solution/${round}`, "data-astro-cid-neaz6txk": true })} ${renderComponent($$result2, "TriviaWonLPOverlay", $$TriviaWonLPOverlay, { "url": `/${category}/trivia-solution/${round}`, "data-astro-cid-neaz6txk": true })} ${renderComponent($$result2, "IntroText", $$IntroText, { "headline": `${currentRound?.headline} - Trivia Frage`, "subline": wonItem?.triviaQuestion, "whiteText": "", "isSmallHeadline": true, "isWhiteSubline": true, "data-astro-cid-neaz6txk": true })} ${maybeRenderHead()}<div class="trivia"${addAttribute(category, "data-category")}${addAttribute(round?.replace("#", ""), "data-round")}${addAttribute(wonItem?.triviaAnswer, "data-triviaAnswer")}${addAttribute(`${wonItem?.band} - ${wonItem?.album}`, "data-triviaAlbum")}${addAttribute(wonItem?.coverSrc, "data-triviaImage")} data-astro-cid-neaz6txk> ${renderComponent($$result2, "For", For, { "of": triviaDataWithTypes, "data-astro-cid-neaz6txk": true }, { "default": ($$result3) => renderTemplate`${(item) => renderTemplate`<div${addAttribute(item.type, "class")} data-astro-cid-neaz6txk> ${renderComponent($$result3, "TriviaItem", $$TriviaItem, { "band": item.band, "album": item.album, "image": item.coverSrc, "data-astro-cid-neaz6txk": true })} </div>`}` })} </div> ${renderComponent($$result2, "Timer", $$Timer, { "minutes": "00", "seconds": "20", "showFinishButton": false, "data-astro-cid-neaz6txk": true })} `, "left-headercol": ($$result2) => renderTemplate`<div data-astro-cid-neaz6txk> ${renderComponent($$result2, "ShowCoins", $$ShowCoins, { "data-astro-cid-neaz6txk": true })} </div>` })}  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/trivia/[round].astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/trivia/[round].astro";
const $$url = "/[category]/trivia/[round]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$round,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
