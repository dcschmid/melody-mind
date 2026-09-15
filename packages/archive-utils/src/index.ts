export const ARCHIVE_PAGE_SIZE = 30;

export const getArchivePageHref = (page: number) => (page <= 1 ? "/" : `/page/${page}/`);

export const formatArchivePageUrl = (url: string) => {
  const normalized = url.endsWith("/") ? url : `${url}/`;
  return normalized === "/page/1/" ? "/" : normalized;
};

const getPageBounds = (total: number, requestedPage: number) => {
  const lastPage = Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Math.trunc(requestedPage) || 1), lastPage);
  const start = (currentPage - 1) * ARCHIVE_PAGE_SIZE;
  return { currentPage, lastPage, start };
};

export const getArchivePageSlice = <T>(items: readonly T[], page: number) => {
  const { currentPage, lastPage, start } = getPageBounds(items.length, page);
  const data = items.slice(start, start + ARCHIVE_PAGE_SIZE);

  return {
    currentPage,
    data,
    end: Math.min(start + data.length, items.length),
    lastPage,
    nextUrl: currentPage < lastPage ? getArchivePageHref(currentPage + 1) : undefined,
    prevUrl: currentPage > 1 ? getArchivePageHref(currentPage - 1) : undefined,
    start: data.length > 0 ? start + 1 : 0,
    total: items.length,
  };
};

export const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFKD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .trim();

export const getSearchPageSlice = <T>(items: readonly T[], requestedPage: number) => {
  const { currentPage, lastPage, start } = getPageBounds(items.length, requestedPage);
  const data = items.slice(start, start + ARCHIVE_PAGE_SIZE);

  return {
    currentPage,
    data,
    end: Math.min(start + data.length, items.length),
    lastPage,
    start: data.length > 0 ? start + 1 : 0,
    total: items.length,
  };
};
