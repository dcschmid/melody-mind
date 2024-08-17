import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent } from './astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Layout_D5hPvjSV.mjs';
/* empty css                           */

const $$ShowCoins = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="coins" data-astro-cid-fvn33zj7> <div data-astro-cid-fvn33zj7>Erspielte Münzen:</div> <div class="count" data-astro-cid-fvn33zj7>${renderComponent($$result, "Icon", $$Icon, { "class": "icon", "name": "coin", "width": 24, "height": 24, "data-astro-cid-fvn33zj7": true })} <span class="coinsCount" data-astro-cid-fvn33zj7></span></div> </div>  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Shared/ShowCoins.astro", void 0);

export { $$ShowCoins as $ };
