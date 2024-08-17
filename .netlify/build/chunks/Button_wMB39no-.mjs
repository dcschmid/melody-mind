import { c as createComponent, r as renderTemplate, m as maybeRenderHead, d as addAttribute, a as renderComponent, b as createAstro } from './astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Layout_D5hPvjSV.mjs';
/* empty css                           */

const $$Astro = createAstro();
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const { buttonText = "", url = "", id } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(id, "id")} class="button"${addAttribute(url, "href")} class="button" data-astro-cid-3gnbv2q5> ${buttonText} ${renderComponent($$result, "Icon", $$Icon, { "name": "next", "width": 24, "height": 24, "data-astro-cid-3gnbv2q5": true })} </a> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Shared/Button.astro", void 0);

export { $$Button as $ };
