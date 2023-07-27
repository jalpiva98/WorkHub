//Global Items

document.addEventListener("DOMContentLoaded", function () {
  // Get references to the input fields and the search button
  const positionInput = document.getElementById("positionInputID");
  const skillInput = document.getElementById("skillInputID");
  const locationInput = document.getElementById("locationInputID");
  const searchButton = document.querySelector(".bg-blue-500");

  // Get references to the boxes
  const boxes = document.querySelectorAll(".box > div");

  // Function to update the boxes with the search inputs
  function updateBoxes() {
    const position = positionInput.value.trim();
    const skill = skillInput.value.trim();
    const location = locationInput.value.trim();

    if (position || skill || location) {
      // Create the formatted search string as a list
      let searchString = "<ul>";
      if (position) {
        searchString += `<li>Position: ${position}</li>`;
      }
      if (skill) {
        searchString += `<li>Skills: ${skill}</li>`;
      }
      if (location) {
        searchString += `<li>Location: ${location}</li>`;
      }
      searchString += "</ul>";

      // Shift the content of the boxes to the right (box4 -> box3, box3 -> box2, box2 -> box1)
      for (let i = boxes.length - 1; i > 0; i--) {
        boxes[i].innerHTML = boxes[i - 1].innerHTML;
      }

      // Set the content of box1 with the new search string as a list
      boxes[0].innerHTML = searchString;

      // Save the search string in local storage
      localStorage.setItem("box1Content", boxes[0].innerHTML);
      localStorage.setItem("box2Content", boxes[1].innerHTML);
      localStorage.setItem("box3Content", boxes[2].innerHTML);
      localStorage.setItem("box4Content", boxes[3].innerHTML);
    }
  }

  // Add click event listener to the search button
  searchButton.addEventListener("click", updateBoxes);

  // Retrieve and set the content of the boxes from local storage on page load
  for (let i = 0; i < boxes.length; i++) {
    const boxContent = localStorage.getItem(`box${i + 1}Content`);
    if (boxContent) {
      boxes[i].innerHTML = boxContent;
    }
  }
});
=======

