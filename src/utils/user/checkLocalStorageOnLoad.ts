/**
 * Checks the local storage on load and updates the display accordingly.
 * Retrieves the user selected frame and header background elements from local storage.
 * Retrieves the header background element and the avatar icon and frame elements.
 * If the user selected frame is "rocket", displays the rocket icon and frame and updates the header background.
 * If the user selected frame is "brain", displays the brain icon and frame and adds the brain header background.
 * If the user selected frame is "microphone", displays the microphone icon and frame and adds the microphone header background.
 */
export function checkLocalStorageOnLoad() {
  // Get the user selected frame from local storage
  const userFrameSelected = localStorage.getItem("userFrameSelected");

  // Get the header background element
  const headerBG = document.querySelector(".headerBG") as HTMLElement;

  // Get the avatar icon and frame elements
  const avatarIconRocket = document.querySelector(".avatarIconRocket") as HTMLElement;
  const avatarFrameRocket = document.querySelector(".avatarFrameRocket") as HTMLElement;
  const avatarIconBrain = document.querySelector(".avatarIconBrain") as HTMLElement;
  const avatarFrameBrain = document.querySelector(".avatarFrameBrain") as HTMLElement;
  const avatarIconMic = document.querySelector(".avatarIconMic") as HTMLElement;
  const avatarFrameMic = document.querySelector(".avatarFrameMic") as HTMLElement;
  const frameNew = document.querySelector(".newIcon2") as HTMLElement;
  const frameBrain = document.getElementById("brain") as HTMLElement;
  const frameRocket = document.getElementById("rocket") as HTMLElement;
  const frameMic = document.getElementById("microphone") as HTMLElement;

  // Define the frames with their respective elements
  const frames = {
    rocket: {
      avatarIcon: avatarIconRocket,
      avatarFrame: avatarFrameRocket,
      headerBG: "headerBGRocket",
      frame: frameRocket
    },
    brain: {
      avatarIcon: avatarIconBrain,
      avatarFrame: avatarFrameBrain,
      headerBG: "headerBGBrain",
      frame: frameBrain
    },
    microphone: {
      avatarIcon: avatarIconMic,
      avatarFrame: avatarFrameMic,
      headerBG: "headerBGMic",
      frame: frameMic
    }
  };

  // Get the selected frame object from the frames dictionary
  const frame = frames[userFrameSelected as keyof typeof frames] || null;

  // If a frame is selected
  if (frame) {
    // Update the header background
    headerBG.classList.remove(...headerBG.classList);
    headerBG.classList.add("headerBG");
    headerBG.classList.add(frame.headerBG);

    // Hide the new frame icon
    if (frame === frames.brain) frameNew!.style.display = "none";

    // Display the selected avatar icon and frame
    frame.avatarIcon!.style.display = "block";
    frame.avatarFrame!.style.display = "block";

    // If a frame element is defined, update its class list
    if (frame.frame) {
      frame.frame.classList.remove("whiteBackground");
      frame.frame.classList.add("goldBackground");
    }
  }
}
