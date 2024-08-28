/**
 * Updates the display based on the wonPopRockBrain and wonBrainFrame parameters.
 *
 * @param wonPopRockBrain - Indicates if PopRock Brain has been won.
 * @param wonBrainFrame - Indicates if Brain Frame has been won.
 */
export function updateDisplay(
  wonPopRockBrain: boolean,
  wonBrainFrame: boolean,
) {
  /**
   * Represents the DOM elements used in the updateDisplay function.
   */
  const elements = {
    // The silver PopRock element
    silverPopRock: document.querySelector(".silverPopRock") as HTMLElement,
    // The gold PopRock element
    goldPopRock: document.querySelector(".goldPopRock") as HTMLElement,
    // The new frame element
    newFrame: document.querySelector(".newFrame") as HTMLElement,
    // The hide frame element
    hideFrame: document.querySelector(".hideFrame") as HTMLElement,
  };

  // Update the display of silverPopRock based on the wonPopRockBrain parameter
  elements.silverPopRock!.style.display = wonPopRockBrain ? "none" : "block";
  // Update the display of goldPopRock based on the wonPopRockBrain parameter
  elements.goldPopRock!.style.display = wonPopRockBrain ? "block" : "none";

  // Update the display of newFrame based on the wonBrainFrame parameter
  elements.newFrame!.style.display = wonBrainFrame ? "flex" : "none";
  // Update the display of hideFrame based on the wonBrainFrame parameter
  elements.hideFrame!.style.display = wonBrainFrame ? "none" : "block";
}
