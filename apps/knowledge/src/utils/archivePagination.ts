export const ARCHIVE_PAGE_SIZE = 30;

export const getArchivePageHref = (page: number) => (page <= 1 ? "/" : `/page/${page}/`);

export const formatArchivePageUrl = (url: string) => {
  const normalized = url.endsWith("/") ? url : `${url}/`;
  return normalized === "/page/1/" ? "/" : normalized;
};

export const getArchivePageSlice = <T>(items: T[], page: number) => {
  const lastPage = Math.max(1, Math.ceil(items.length / ARCHIVE_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Math.trunc(page)), lastPage);
  const start = (currentPage - 1) * ARCHIVE_PAGE_SIZE;
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
