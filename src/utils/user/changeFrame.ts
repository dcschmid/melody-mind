/**
 * Adds a click event listener to the changeFrameButton element, which allows the user to change their avatar frame.
 * When the button is clicked, it selects the currently selected frame, hides the other frames, and displays the selected frame.
 * It also updates the header background and saves the selected frame to local storage.
 */
export function changeFrame() {
  // Get the changeFrameButton and headerBG elements
  const changeFrameButton = document.querySelector(
    ".changeFrameButton",
  ) as HTMLButtonElement;
  const headerBG = document.querySelector(".headerBG") as HTMLElement;

  // Define the frames with their respective elements
  const frames = {
    rocket: {
      icon: document.querySelector(".avatarIconRocket") as HTMLElement,
      frame: document.querySelector(".avatarFrameRocket") as HTMLElement,
      headerBG: "headerBGRocket",
    },
    brain: {
      icon: document.querySelector(".avatarIconBrain") as HTMLElement,
      frame: document.querySelector(".avatarFrameBrain") as HTMLElement,
      headerBG: "headerBGBrain",
    },
    microphone: {
      icon: document.querySelector(".avatarIconMic") as HTMLElement,
      frame: document.querySelector(".avatarFrameMic") as HTMLElement,
      headerBG: "headerBGMic",
    },
  };

  // Add a click event listener to the changeFrameButton element
  changeFrameButton.addEventListener("click", () => {
    // Get the currently selected frame
    const selectedFrameItem = document.querySelector(".frameSelected");
    const actualGoldenFrame = document.querySelector(".goldBackground");
    const frameValue = selectedFrameItem!.getAttribute("data-frame");

    // Hide the other frames
    Object.values(frames).forEach((frame) => {
      frame.icon!.style.display = "none";
      frame.frame!.style.display = "none";
    });

    // Display the selected frame
    const frame = frames[frameValue! as keyof typeof frames];
    frame.icon!.style.display = "block";
    frame.frame!.style.display = "block";

    if (actualGoldenFrame) {
      actualGoldenFrame!.classList.remove("goldBackground");
      actualGoldenFrame!.classList.add("whiteBackground");
    }

    selectedFrameItem!.classList.remove("frameSelected");
    selectedFrameItem!.classList.remove("goldBackground");
    selectedFrameItem!.classList.remove("whiteBackground");
    selectedFrameItem!.classList.add("goldBackground");

    // Update the header background
    headerBG.classList.remove("headerBGRocket", "headerBGBrain", "headerBGMic");
    headerBG.classList.add(frame.headerBG);

    // Save the selected frame to local storage
    localStorage.setItem("userFrameSelected", frameValue!);
  });
}
