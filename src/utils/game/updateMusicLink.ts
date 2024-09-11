/**
 * Updates a link element with the given URL.
 *
 * If the URL is null or undefined, the link element is hidden.
 *
 * @param linkElement - The link element to update
 * @param url - The URL to set on the link element. If null or undefined, the link element is hidden.
 */
export function updateMusicLink(
  linkElement: { href: string | null; style: { display: string } },
  url: string | null | undefined,
): void {
  // If the URL is null or undefined, hide the link element
  if (url === null || url === undefined) {
    linkElement.style.display = "none";
    return;
  }

  // Set the URL on the link element
  linkElement.href = url;
}
