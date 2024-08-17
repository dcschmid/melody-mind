import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_DZLNfWt7.mjs';
import { onRequest } from './_noop-middleware.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/gamehome.astro.mjs');
const _page2 = () => import('./pages/insta.astro.mjs');
const _page3 = () => import('./pages/login.astro.mjs');
const _page4 = () => import('./pages/spotify.astro.mjs');
const _page5 = () => import('./pages/user.astro.mjs');
const _page6 = () => import('./pages/videos/nilzvideo.astro.mjs');
const _page7 = () => import('./pages/_category_/result/_round_.astro.mjs');
const _page8 = () => import('./pages/_category_/trivia/_round_.astro.mjs');
const _page9 = () => import('./pages/_category_/trivia-solution/_round_.astro.mjs');
const _page10 = () => import('./pages/_category_/_round_.astro.mjs');
const _page11 = () => import('./pages/_category_.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/gamehome.astro", _page1],
    ["src/pages/insta.astro", _page2],
    ["src/pages/login.astro", _page3],
    ["src/pages/spotify.astro", _page4],
    ["src/pages/user.astro", _page5],
    ["src/pages/videos/nilzvideo.astro", _page6],
    ["src/pages/[category]/result/[round].astro", _page7],
    ["src/pages/[category]/trivia/[round].astro", _page8],
    ["src/pages/[category]/trivia-solution/[round].astro", _page9],
    ["src/pages/[category]/[round].astro", _page10],
    ["src/pages/[category].astro", _page11],
    ["src/pages/index.astro", _page12]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "07969aeb-38ac-42c3-86c5-1346fd5dc6fa"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
