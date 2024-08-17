import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent, b as createAstro, d as addAttribute } from './astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon, a as $$AstroWhen } from './Layout_D5hPvjSV.mjs';
import { $ as $$Button } from './Button_wMB39no-.mjs';
/* empty css                           */

// @ts-check

const GeneratorFunctionConstructor = /** @type {GeneratorFunctionConstructor} */ (function* () {}.constructor);

const AsyncGeneratorFunctionConstructor = /** @type {AsyncGeneratorFunctionConstructor} */ (async function* () {}.constructor);

const isIterable = /** @type {import('./shared.d').isIterable} */ (
	(value) => value != null &&
	(
		typeof value[Symbol.iterator] === 'function' ||
		typeof value[Symbol.asyncIterator] === 'function'
	)
);

const { entries } = Object;

const isGenerator = /** @type {import('./shared.d').isGenerator} */ (
	(value) =>
		value instanceof GeneratorFunctionConstructor ||
		value instanceof AsyncGeneratorFunctionConstructor
);

const getNormalizedGenerator = /** @type {import('./shared.d').getNormalizedGenerator} */ (
	(fn) =>
		typeof fn !== 'function'
			? async function* (value) {
				yield await value;
			}
		: isGenerator(fn)
			? fn
		: async function* (...value) {
			yield await fn(...value);
		}
);

const For = Object.assign(
	function Iterate(_result, { of }, slots) {
		const promiseOfGenerator = Promise.resolve(
			typeof slots.default === 'function'
				? slots.default()
				: slots.default
		).then(
			result => result.expressions.at(0)
		).then(getNormalizedGenerator, getNormalizedGenerator);

		return {
			[Symbol.toStringTag]: 'AstroComponent',

			async *[Symbol.asyncIterator]() {
				const generator = await promiseOfGenerator;

				if (isIterable(of)) {
					let index = -1;

					for await (const value of of) {
						yield * generator(value, ++index);
					}
				} else if (typeof of === 'object' && of !== null) {
					for (const [ name, value ] of entries(of)) {
						yield * generator(value, name);
					}
				}
			},
		}
	},
	{
		isAstroComponentFactory: true,
	}
);

const $$Astro$1 = createAstro();
const $$TimeupsOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TimeupsOverlay;
  const { url = "#" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="timupsOverlay" class="timupsOverlay" data-astro-cid-f27bhb57> <div class="timupsOverlay-content" data-astro-cid-f27bhb57> ${renderComponent($$result, "Icon", $$Icon, { "name": "clock", "width": 200, "height": 200, "data-astro-cid-f27bhb57": true })} <div class="headline" data-astro-cid-f27bhb57>00:00</div> <div class="subline" data-astro-cid-f27bhb57>Zeit ist abgelaufen!</div> <div class="centerButton" data-astro-cid-f27bhb57> ${renderComponent($$result, "Button", $$Button, { "id": "finishRoundButton", "buttonText": "weiter", "url": url, "data-astro-cid-f27bhb57": true })} </div> </div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Overlays/TimeupsOverlay.astro", void 0);

const $$Astro = createAstro();
const $$Timer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Timer;
  const { minutes, seconds, showFinishButton = true } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["timer", showFinishButton ? "" : "timercenter"], "class:list")} data-astro-cid-3vlmgimf> ${renderComponent($$result, "Icon", $$Icon, { "name": "clock", "width": 48, "height": 48, "data-astro-cid-3vlmgimf": true })} <span id="minutes" data-astro-cid-3vlmgimf>${minutes}</span>:<span id="seconds" data-astro-cid-3vlmgimf>${seconds}</span> ${renderComponent($$result, "When", $$AstroWhen, { "test": showFinishButton, "data-astro-cid-3vlmgimf": true }, { "default": ($$result2) => renderTemplate` <div class="finishButton" data-astro-cid-3vlmgimf> ${renderComponent($$result2, "Button", $$Button, { "id": "endRound", "url": "#", "data-astro-cid-3vlmgimf": true })} </div> ` })} </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/Round/Timer.astro", void 0);

export { $$TimeupsOverlay as $, For as F, $$Timer as a };
