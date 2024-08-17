import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent, b as createAstro, d as addAttribute } from '../../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon, b as $$Layout } from '../../chunks/Layout_D5hPvjSV.mjs';
import { $ as $$Button } from '../../chunks/Button_wMB39no-.mjs';
/* empty css                                      */
import { F as For, $ as $$TimeupsOverlay, a as $$Timer } from '../../chunks/Timer_Bi1TmKem.mjs';
import { $ as $$IntroText } from '../../chunks/IntroText_D6vIU1LS.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../../chunks/_astro_assets_DaWUHmqA.mjs';
import { s as shuffleArray } from '../../chunks/shuffleArray_KhgXiPkd.mjs';
import { c as categories } from '../../chunks/categories_Ckn1CJny.mjs';
import { $ as $$ShowCoins } from '../../chunks/ShowCoins__LVeRE39.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$3 = createAstro();
const $$StartOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$StartOverlay;
  const { headline, whiteText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="startOverlay" class="startOverlay" data-astro-cid-6i755iqr> <div class="startOverlay-content" data-astro-cid-6i755iqr> <div class="headline" data-astro-cid-6i755iqr>${headline}</div> <div class="text" data-astro-cid-6i755iqr>
Klicken Sie auf das Albumcover und sortieren Sie die Alben in die richtige Reihenfolge nach
<span class="whiteText" data-astro-cid-6i755iqr>${whiteText}</span> </div> <div class="text" data-astro-cid-6i755iqr>
Nutzen Sie die Möglichkeit einen <span class="whiteText" data-astro-cid-6i755iqr>Joker</span> einzulösen, um einen Hinweis zu erhalten.
</div> <div class="centerButton" data-astro-cid-6i755iqr> ${renderComponent($$result, "Button", $$Button, { "id": "gameButton", "buttonText": "spielen", "url": "#", "data-astro-cid-6i755iqr": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Overlays/StartOverlay.astro", void 0);

const $$Arrows = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="showButtons" class="buttons" data-astro-cid-6vzxdao4> <div class="arrowButton" id="up" data-astro-cid-6vzxdao4> ${renderComponent($$result, "Icon", $$Icon, { "name": "up-arrow", "width": 48, "height": 48, "data-astro-cid-6vzxdao4": true })} </div> <div class="arrowButton" id="down" data-astro-cid-6vzxdao4> ${renderComponent($$result, "Icon", $$Icon, { "name": "down-arrow", "width": 48, "height": 48, "data-astro-cid-6vzxdao4": true })} </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Round/Arrows.astro", void 0);

const $$Astro$2 = createAstro();
const $$CoverFlow = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CoverFlow;
  const {
    randomizedCoverflowData,
    upText = "",
    downText = "",
    dataCategory = "",
    dataSolution,
    dataRound = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="coverFlowRoot"${addAttribute(dataCategory, "data-category")}${addAttribute(JSON.stringify(dataSolution), "data-solution")}${addAttribute(dataRound.replace("#", ""), "data-round")} data-astro-cid-mbti7dvh> <div class="smallText" data-astro-cid-mbti7dvh>${upText}</div> <div class="coverflow" data-astro-cid-mbti7dvh> ${renderComponent($$result, "For", For, { "of": randomizedCoverflowData, "data-astro-cid-mbti7dvh": true }, { "default": ($$result2) => renderTemplate`${(item) => renderTemplate`<div class="cover"${addAttribute(item.band, "data-band")}${addAttribute(item.album, "data-album")}${addAttribute(item.data, "data-data")}${addAttribute(item.coverSrc, "data-cover-source")} data-astro-cid-mbti7dvh> ${renderComponent($$result2, "Picture", $$Picture, { "src": item.coverSrc, "width": 266, "height": 266, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-mbti7dvh": true })} <audio${addAttribute(`audio-${item.band}`, "id")}${addAttribute(item.audioSrc, "src")} preload="none" data-astro-cid-mbti7dvh></audio> </div>`}` })} ${renderComponent($$result, "Arrows", $$Arrows, { "data-astro-cid-mbti7dvh": true })} </div> <div class="hintText" data-astro-cid-mbti7dvh>${downText}</div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Round/CoverFlow.astro", void 0);

const $$Astro$1 = createAstro();
const $$Joker = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Joker;
  const { jokerCoverUrl, jokerData, jokerText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="jokerIcons" data-astro-cid-uyvppnkk> <div id="joker" data-astro-cid-uyvppnkk> ${renderComponent($$result, "Icon", $$Icon, { "name": "joker-gold", "width": 50, "height": 50, "data-astro-cid-uyvppnkk": true })} </div> <div id="jokeroverlay" class="jokeroverlay" data-astro-cid-uyvppnkk> <div class="jokercontent" data-astro-cid-uyvppnkk> <div class="closeRoot" data-astro-cid-uyvppnkk> ${renderComponent($$result, "Button", $$Button, { "id": "closeButton", "buttonText": "close", "url": "#", "data-astro-cid-uyvppnkk": true })} </div> <div class="jokergroup" data-astro-cid-uyvppnkk> ${renderComponent($$result, "Icon", $$Icon, { "name": "joker-gold", "width": 80, "height": 80, "data-astro-cid-uyvppnkk": true })} </div> <div class="jokeroneheadline" data-astro-cid-uyvppnkk>Joker</div> <div class="centerButton" data-astro-cid-uyvppnkk> ${renderComponent($$result, "Button", $$Button, { "id": "redeemjoker", "buttonText": "Joker einl\xF6sen", "url": "#", "data-astro-cid-uyvppnkk": true })} </div> </div> </div> <div id="jokersolution" class="jokersolution" data-astro-cid-uyvppnkk> <div class="jokersolutioncontent" data-astro-cid-uyvppnkk> <div class="closeRoot" data-astro-cid-uyvppnkk> ${renderComponent($$result, "Icon", $$Icon, { "class": "closeIcon", "name": "joker-gold", "width": 48, "height": 48, "data-astro-cid-uyvppnkk": true })} ${renderComponent($$result, "Button", $$Button, { "id": "closeJokerButton", "buttonText": "close", "url": "#", "data-astro-cid-uyvppnkk": true })} </div> <div class="solutionRoot" data-astro-cid-uyvppnkk> <div class="solutionCover" data-astro-cid-uyvppnkk> ${renderComponent($$result, "Picture", $$Picture, { "src": jokerCoverUrl, "width": 240, "height": 240, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-uyvppnkk": true })} </div> <div class="solutionData" data-astro-cid-uyvppnkk>${jokerData}</div> <div class="solutionText" data-astro-cid-uyvppnkk> ${jokerText} </div> </div> </div> </div> </div>  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Round/Joker.astro", void 0);

const $$Astro = createAstro();
const $$round = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$round;
  const { category, round } = Astro2.params;
  const currentCategory = categories.find((cat) => cat.slug === category);
  const currentRound = currentCategory?.rounds.find((rnd) => rnd.slug === round);
  const randomizedCoverflowData = shuffleArray(currentRound?.coverData ?? []);
  const jokerText = randomizedCoverflowData?.[0].jokerText;
  const jokerData = randomizedCoverflowData?.[0].data;
  const jokerCoverUrl = randomizedCoverflowData?.[0].coverSrc;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentCategory?.name} - ${currentRound?.headline}`, "`": true, "showUserLink": false, "data-astro-cid-2bn4gxso": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "StartOverlay", $$StartOverlay, { "headline": currentRound?.headline, "whiteText": currentRound?.startOverlayText, "data-astro-cid-2bn4gxso": true })} ${renderComponent($$result2, "TimeupsOverlay", $$TimeupsOverlay, { "data-astro-cid-2bn4gxso": true })} ${renderComponent($$result2, "IntroText", $$IntroText, { "headline": currentRound?.headline, "subline": currentRound?.introSubline, "whiteText": currentRound?.sortToText, "data-astro-cid-2bn4gxso": true })} ${renderComponent($$result2, "CoverFlow", $$CoverFlow, { "randomizedCoverflowData": randomizedCoverflowData, "upText": currentRound?.upToLabel, "downText": currentRound?.downToLabel, "dataCategory": category, "dataSolution": currentRound?.solutionsArray, "dataRound": round, "data-astro-cid-2bn4gxso": true })} ${maybeRenderHead()}<div class="timerSection" data-astro-cid-2bn4gxso> ${renderComponent($$result2, "Joker", $$Joker, { "jokerCoverUrl": jokerCoverUrl, "jokerText": jokerText, "jokerData": jokerData, "data-astro-cid-2bn4gxso": true })} ${renderComponent($$result2, "Timer", $$Timer, { "minutes": "01", "seconds": "30", "data-astro-cid-2bn4gxso": true })} </div> `, "left-headercol": ($$result2) => renderTemplate`<div data-astro-cid-2bn4gxso> ${renderComponent($$result2, "ShowCoins", $$ShowCoins, { "data-astro-cid-2bn4gxso": true })} </div>` })}  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/[round].astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/[category]/[round].astro";
const $$url = "/[category]/[round]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$round,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
