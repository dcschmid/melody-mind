import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as renderComponent, b as createAstro, d as addAttribute } from '../chunks/astro/server_CvA5EDur.mjs';
import 'kleur/colors';
import { $ as $$Icon, a as $$AstroWhen, b as $$Layout } from '../chunks/Layout_D5hPvjSV.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Picture } from '../chunks/_astro_assets_DaWUHmqA.mjs';
/* empty css                                    */
import { s as shuffleArray } from '../chunks/shuffleArray_KhgXiPkd.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$PlaylistItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PlaylistItem;
  const { headline = "", years = "", image } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="playlistItem" data-astro-cid-stn3u5x6> ${renderComponent($$result, "Picture", $$Picture, { "class": "cover", "src": image, "width": 106, "height": 106, "formats": ["avif", "webp"], "alt": "", "data-astro-cid-stn3u5x6": true })} <div class="headline" data-astro-cid-stn3u5x6>${headline}</div> <div class="years" data-astro-cid-stn3u5x6>${years}</div> </div> `;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/PlaylistItem.astro", void 0);

const $$Help = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div>${renderComponent($$result, "Icon", $$Icon, { "name": "question", "width": 24, "height": 22.24 })}</div>`;
}, "/Users/danielschmid/projects/cover-shuffle/src/components/HeaderItems/Help.astro", void 0);

const categoriesList = [
	{
		headline: "PopRock",
		years: "70er bis heute",
		imageUrl: "/category/poprock.png",
		categoryUrl: "/poprock",
		isPlayable: true
	},
	{
		headline: "Heavy Metal",
		years: "2010 bis heute",
		imageUrl: "/category/heavymetal.png",
		isPlayable: false
	},
	{
		headline: "Party On!",
		years: "2010 bis 2024",
		imageUrl: "/category/partyon.png",
		isPlayable: false
	},
	{
		headline: "Summer Hits",
		years: "2023/24",
		imageUrl: "/category/summerhits.png",
		isPlayable: false
	},
	{
		headline: "Top Charts",
		years: "Alle Jahrzehnte",
		imageUrl: "/category/topcharts.png",
		isPlayable: false
	},
	{
		headline: "DeutschRap",
		years: "2020 bis heute",
		imageUrl: "/category/deutschrap.png",
		isPlayable: false
	},
	{
		headline: "Disco Fever",
		years: "Hits der 70er und frühen 80er",
		imageUrl: "/category/disco-fever.jpg",
		isPlayable: false
	},
	{
		headline: "Disco Fever",
		years: "Hits der 70er und frühen 80er",
		imageUrl: "/category/disco-fever.jpg",
		isPlayable: false
	},
	{
		headline: "Indie & Alternative",
		years: "2000 bis 2020",
		imageUrl: "/category/indie-alternative.jpg",
		isPlayable: false
	},
	{
		headline: "Latin Vibes",
		years: "2010 bis heute",
		imageUrl: "/category/latin.jpg",
		isPlayable: false
	},
	{
		headline: "Gothic",
		years: "2000 bis heute",
		imageUrl: "/category/gothic.jpg",
		isPlayable: false
	},
	{
		headline: "Country Classics",
		years: "80er bis 90er Jahre",
		imageUrl: "/category/country-classics.jpg",
		isPlayable: false
	},
	{
		headline: "Millennium Pop",
		years: "2000 bis 2010",
		imageUrl: "/category/millennium-pop.jpg",
		isPlayable: false
	}
];

const $$Gamehome = createComponent(($$result, $$props, $$slots) => {
  const getSelectedPlayableItem = () => {
    const playableItems = categoriesList.filter((item) => item.isPlayable);
    const selectedPlayableItems = playableItems.sort(() => Math.random() - Math.random()).slice(0, 1);
    return selectedPlayableItems;
  };
  const getNonPlayableItems = () => {
    const nonPlayableItems = shuffleArray(categoriesList.filter((item) => !item.isPlayable));
    nonPlayableItems.length = Math.min(nonPlayableItems.length, 5);
    return nonPlayableItems;
  };
  const categories = [...getSelectedPlayableItem(), ...getNonPlayableItems()];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Spiel Kategorien", "data-astro-cid-6g6pdpov": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="introText" data-astro-cid-6g6pdpov> <div class="headline" data-astro-cid-6g6pdpov>Willkommen <span class="name" data-astro-cid-6g6pdpov></span>!</div> <div class="subline" data-astro-cid-6g6pdpov>Wählen Sie eine <span class="whiteText" data-astro-cid-6g6pdpov>Playlist</span> zum spielen!</div> </div> <div class="choosePlaylist" data-astro-cid-6g6pdpov> ${categories.map((item) => renderTemplate`${renderComponent($$result2, "When", $$AstroWhen, { "test": item.isPlayable, "data-astro-cid-6g6pdpov": true }, { "default": ($$result3) => renderTemplate` <a${addAttribute(item.categoryUrl, "href")} data-astro-cid-6g6pdpov> ${renderComponent($$result3, "PlaylistItem", $$PlaylistItem, { "headline": item.headline, "years": item.years, "image": item.imageUrl, "data-astro-cid-6g6pdpov": true })} </a> ` })}

        ${renderComponent($$result2, "When", $$AstroWhen, { "test": !item.isPlayable, "data-astro-cid-6g6pdpov": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "PlaylistItem", $$PlaylistItem, { "headline": item.headline, "years": item.years, "image": item.imageUrl, "data-astro-cid-6g6pdpov": true })} ` })}`)} </div> `, "left-headercol": ($$result2) => renderTemplate`${renderComponent($$result2, "Help", $$Help, { "slot": "left-headercol", "data-astro-cid-6g6pdpov": true })}` })} <div class="hint" data-astro-cid-6g6pdpov> ${renderComponent($$result, "Icon", $$Icon, { "class": "icon", "name": "spotify", "width": 24, "height": 24, "data-astro-cid-6g6pdpov": true })} Spotify Account einbinden um Freunde zu challengen
</div>  `;
}, "/Users/danielschmid/projects/cover-shuffle/src/pages/gamehome.astro", void 0);

const $$file = "/Users/danielschmid/projects/cover-shuffle/src/pages/gamehome.astro";
const $$url = "/gamehome";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Gamehome,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
