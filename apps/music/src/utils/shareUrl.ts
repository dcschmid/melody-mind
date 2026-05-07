export const isHttpShareUrl = (shareUrl: string): boolean => {
  try {
    const url = new URL(shareUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
