/**
 * Creates a result item element for the given result and index.
 *
 * @param {any} result - The result object.
 * @param {any} index - The index of the result.
 * @return {HTMLDivElement} The created result item element.
 */
export function createResultItem(result: any, index: any) {
  // Create a new div element for the result item
  const resultItem = document.createElement("div");

  // Add the "result-item" class to the element
  resultItem.classList.add("result-item");

  // Set the innerHTML of the element to display the result details
  // The result details include the index, cover image, band name, album name, and release date
  resultItem.innerHTML = `
    <div class="resultItem">
      <div class="resultPlace ${result.isWrong ? "resultError" : ""}">${index + 1}.</div>
      <img class="resultCover" src="${result.coverSrc}" alt="${result.band} - ${result.album}" width="126" height="126" />
      <div class="resultData">${result.data}</div>
      <div class="resultBand">${result.band}</div>
      <div class="resultAlbum">${result.album}</div>
    </div>
  `;

  // Return the created result item element
  return resultItem;
}
