//Search Job Fetch
///////////////////

//Get Inputs ID

let position = 'manager';
let skills = 'javascript';
let city = 'chicago';
const jobsArray = {
    companyArray: [],
    jobArray: [],
    URLarray: []
};

const url = 'https://jobsearch4.p.rapidapi.com/api/v2/Jobs/Search?SearchQuery=' + position +'+' + city+ '+' + skills +'+' +  '&PageSize=100&PageNumber=1';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '9952432343msh4d888bb5e64d387p154272jsnca97fea3ca77',
        'X-RapidAPI-Host': 'jobsearch4.p.rapidapi.com'
    }
};

async function fetchJobSearch () {

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        for (let i = 0; i < 150; i++) {
            let company = result.data[i].company;
            let jobTitle = result.data[i].title;
            let jobURL = result.data[i].url;

            JSON.stringify(company);
            JSON.stringify(jobTitle);
            JSON.stringify(jobURL);

            jobsArray.companyArray.push(company);
            jobsArray.jobArray.push(jobTitle);
            jobsArray.URLarray.push(jobURL);

            // Append Results on Div

            // Create an anchor element
            const link = $('<a>');
            link.prop('href', jobURL);
            link.prop('target', '_blank');

            const companyElement = $('<span class="text-white">').text(`${company}: `);
            const jobTitleElement = $('<span class="font-extrabold text-xl">').text(jobTitle);

            link.append(companyElement, $('<br>'), jobTitleElement);

            const checkbox = $('<input class="ml-auto" type="checkbox">');

            checkbox.attr('id', 'myCheckbox');
            checkbox.attr('name', 'myCheckbox');
            checkbox.prop('checked', false);

            const listItem = $('<li class="mb-5">');
            listItem.append(link);


            const resultsList = $('#resultsID');
            resultsList.append(listItem);

            listItem.append(checkbox);

        }

console.log(jobsArray);

    } catch (error) {
        console.error(error);
    }

}

fetchJobSearch();

/////////////
//carousel
/////////////////
const galleryContainer=document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');

class Carousel {
    constructor(container, items, controls){
        this.carouselContainer = container;
        this.carouselControls =controls;
        this.carouselArray = [...items];
    }

updateGallery(){
    this.carouselArray.forEach(el => {
        el.classList.remove('gallery-item-1');
        el.classList.remove('gallery-item-2');
        el.classList.remove('gallery-item-3');
        el.classList.remove('gallery-item-4');
        el.classList.remove('gallery-item-5');

        });
    
        this.carouselArray.slice(0 ,5).forEach((el , i) =>{
            el.classList.add(`gallery-item-${i+1}`);
        })
    }

    setCurrentState(direction){
        if(direction.className === 'gallery-controls-previous'){
            
            this.carouselArray.unshift(this.carouselArray.pop());
        }else{
            this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery();
        attachModalEvent();
    }

    setControls(){
        this.carouselControls.forEach(control => {
            galleryControlsContainer.appendChild(document.createElement('button')).className = `gallery-controls-${control}`;
            document.querySelector(`.gallery-controls-${control}`).innerText = control;
        });
    }
    useControls() {
        const triggers = [...galleryControlsContainer.childNodes];
        triggers.forEach(control => {
          control.addEventListener('click', e => {
            e.preventDefault();
            this.setCurrentState(control);
          });
        });
      
        // Find the central carousel item (third item).
        const centralItem = this.carouselArray[2];
        // Add an event listener to the central item to show the modal on click.
        centralItem.classList.add("cursor-pointer");
        centralItem.addEventListener('click', showModal);
        attachModalEvent();
      }
    }

    function attachModalEvent() {
        const centralItem = document.querySelector('.gallery-item-3');
        centralItem.classList.add("cursor-pointer");
        centralItem.addEventListener('click', showModal);
      }



    function showModal() {
        const modal = document.getElementById('SavedJobModal');
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
      }
  
// Hide looking glass and show input form

    document.getElementById('looking-glass').addEventListener('click', toggleInputs);

function toggleInputs() {
    const searchInputs = document.getElementById("searchInputs");
    const searchImgDiv = document.getElementById("looking-glass");
  
    searchInputs.classList.remove('hidden');
    searchImgDiv.classList.add('hidden');
  }

// Function to hide the modal
function hideModal() {
    const modal = document.getElementById('SavedJobModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  // Add click event listener to the X button in the modal header
  document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('[data-modal-hide="defaultModal"]');
    if (closeButton) {
      closeButton.addEventListener('click', hideModal);
    }
  });

const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);

exampleCarousel.setControls();
exampleCarousel.useControls();


// Function to update the boxes with the previous searches
function updateBoxes() {
  const boxElements = document.querySelectorAll('.box div');
  for (let i = 0; i < previousSearches.length; i++) {
    boxElements[i].textContent = previousSearches[i];
  }
}

// Load previous searches from localStorage if available
let previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

// Function to save previous searches to localStorage
function savePreviousSearches() {
  localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
}

// Add event listener to the search input
document.getElementById('positionInputID').addEventListener('change', function () {
  const searchValue = this.value.trim();

  // Only add the search value if it's not empty
  if (searchValue) {
    // Add the search value to the array
    previousSearches.push(searchValue);

    // If the array size exceeds 4, remove the oldest search value
    if (previousSearches.length > 4) {
      previousSearches.shift();
    }

    // Update the boxes with the new search values
    updateBoxes();

    // Save the updated previous searches to localStorage
    savePreviousSearches();
  }
});

// Call updateBoxes() initially to populate the boxes on page load
updateBoxes();
