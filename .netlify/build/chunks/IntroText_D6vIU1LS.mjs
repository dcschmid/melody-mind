import { c as createComponent, r as renderTemplate, m as maybeRenderHead, d as addAttribute, b as createAstro } from './astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                              */

const $$Astro = createAstro();
const $$IntroText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$IntroText;
  const { headline, subline, whiteText, isSmallHeadline = false, isWhiteSubline = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="introText" data-astro-cid-oos7gvxu> <div${addAttribute(["headline", isSmallHeadline && "isSmallHeadline"], "class:list")} data-astro-cid-oos7gvxu>${headline}</div> <div${addAttribute(["subline", isWhiteSubline && "whiteText"], "class:list")} data-astro-cid-oos7gvxu> ${subline} <span class="whiteText" data-astro-cid-oos7gvxu>${whiteText}</span> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Shared/IntroText.astro", void 0);

export { $$IntroText as $ };
