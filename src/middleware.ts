import { defineMiddleware } from 'astro:middleware';
import { languages, defaultLang } from './i18n/ui';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // Redirect root to default language
  if (pathname === '/') {
    return redirect(`/${defaultLang}`);
  }

  // Handle missing language prefix
  const [, lang] = pathname.split('/');
  if (!lang || !(lang in languages)) {
    return redirect(`/${defaultLang}${pathname}`);
  }

  return next();
});
