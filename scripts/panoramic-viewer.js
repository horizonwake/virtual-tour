import { Viewer } from "@photo-sphere-viewer/core";
import { getData } from "./api.js";

export const panoramicViewer = async () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  //query parameters
  const customerID = params.get("customerID");
  const propertyID = params.get("propertyID");

  if (!customerID && !propertyID) {
    const grid =  document.getElementById("media-viewers-grid");
    grid.innerHTML = "<p> Whoops... No property to view at this URL! </p>";
    return;
  }

  const rawData = await getData(customerID, propertyID);
  const data = JSON.parse(rawData.body)[0];
  const rooms = data.Rooms;

  let count = 0;

  const showImage = (index) => {
    count = index;
    updateViewer();
  };

  const nextImage = () => {
    count++;
    if (count === rooms.length) {
      count = 0;
    }
    updateViewer();
  };

  const prevImage = () => {
    count--;
    if (count < 0) {
      count = rooms.length - 1;
    }
    updateViewer();
  };

  const updateViewer = () => {
    const viewerContainer = document.querySelector("#viewer");
    viewerContainer.innerHTML = ""; // Clear the viewer container

    // Create and append the floor plan image
    const FPMap = document.createElement("img");
    FPMap.src = rooms[count].FloorplanImage ? rooms[count].FloorplanImage : "";
    FPMap.classList.add("fp-map");
    viewerContainer.appendChild(FPMap);

    // Event listener to toggle enlargement and centering
    FPMap.addEventListener("click", () => {
      FPMap.classList.toggle("enlarged");
    });

    // Create and append the left arrow
    const leftArrow = document.createElement("span");
    leftArrow.id = "panoramic-left-arrow";
    leftArrow.classList.add("panoramic-arrow");
    leftArrow.textContent = " < ";
    leftArrow.addEventListener("click", prevImage);
    viewerContainer.appendChild(leftArrow);

    // Create and append the right arrow
    const rightArrow = document.createElement("span");
    rightArrow.id = "panoramic-right-arrow";
    rightArrow.classList.add("panoramic-arrow");
    rightArrow.textContent = " > ";
    rightArrow.addEventListener("click", nextImage);
    viewerContainer.appendChild(rightArrow);

    if (rooms.length <= 1) {
      leftArrow.style.display = "none";
      rightArrow.style.display = "none";
    }

    // Create dots container within the viewer container
    const dotsContainer = document.createElement("div");
    dotsContainer.id = "panoramicDots";
    viewerContainer.appendChild(dotsContainer);

    // Create dots with custom tooltip
    for (let i = 0; i < rooms.length; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      const tooltipText = document.createElement("span");
      tooltipText.classList.add("tooltip-text");
      tooltipText.textContent = rooms[i].Name;

      dot.appendChild(tooltipText);
      dot.addEventListener("click", () => showImage(i));
      dotsContainer.appendChild(dot);
    }

    // Update dots active state
    const dots = dotsContainer.getElementsByClassName("dot");
    Array.from(dots).forEach((dot, index) => {
      dot.classList.remove("active");
      if (index === count) {
        dot.classList.add("active");
      }
    });

    initializePanoramicViewer(); // re-initialize the panoramic viewer
  };
  function initializePanoramicViewer() {
    const viewer = new Viewer({
      container: document.querySelector("#viewer"),
      panorama: rooms[count].PanoramicImage,
      caption: rooms[count].Name,
      defaultZoomLvl: 0,
      navbar: ["zoom", "caption", "move", "fullscreen"],
    });
  }
  updateViewer();
};
