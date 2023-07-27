//Global Items
const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');
const savedJobIndexes = [];

//Inputs ID for search
const jobsArray = {
    companyArray: [],
    jobArray: [],
    URLarray: [],
};

const inputFunc = () => {
    $('#searchInputs').click(function () {
        const position = $('#positionInputID').val();
        const skills = $('#skillInputID').val();
        const city = $('#locationInputID').val();

        jobsArray.companyArray = [];
        jobsArray.jobArray = [];
        jobsArray.URLarray = [];

        fetchJobSearch(position, skills, city); // Pass the input values to the function
    });
};

inputFunc();

const saveJobFunc = () => {

    for (let i = 0; i < 150; i++) {
    }
};

async function fetchJobSearch(position, skills, city) {
    const url =
        'https://jobsearch4.p.rapidapi.com/api/v2/Jobs/Search?SearchQuery=' +
        position +
        '+' +
        city +
        '+' +
        skills +
        '+' +
        '&PageSize=50&PageNumber=1';

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9952432343msh4d888bb5e64d387p154272jsnca97fea3ca77',
            'X-RapidAPI-Host': 'jobsearch4.p.rapidapi.com',
        },
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const resultsList = $('#resultsID');
        resultsList.empty();

        for (let i = 0; i < 150; i++) {
            let company = result.data[i].company;
            let jobTitle = result.data[i].title;
            let jobURL = result.data[i].url;

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

            checkbox.attr('id', `myCheckbox${i}`);
            checkbox.attr('name', 'myCheckbox');
            checkbox.prop('checked', false);

            const listItem = $('<li class="mb-5 bg-orange-500 w-5/6 rounded-lg shadow-md">');
            listItem.append(link);

            resultsList.append(listItem);
            listItem.append(checkbox);

            // Get Checkbox List Item and set it as Local Storage if checked - else remove item
            $(`#myCheckbox${i}`).on('change', function() {
                if (this.checked) {
                    const listItemText = $(this).closest('li').text();
                    localStorage.setItem(`ListItem${i}`, listItemText + jobURL);
                    savedJobIndexes.push(i);
                } else {
                    localStorage.removeItem(`ListItem${i}`);
                    const indexToRemove = savedJobIndexes.indexOf(i);
                    if (indexToRemove !== -1) {
                        savedJobIndexes.splice(indexToRemove, 1);
                    }
                }
                updateGallery();
            });
        }
        updateGallery();
    } catch (error) {
        console.error('error');
    }
}

function updateGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
  
    for (let i = 0; i < 5; i++) {
      const jobIndex = savedJobIndexes[i];
      const company = jobsArray.companyArray[jobIndex];
      const jobTitle = jobsArray.jobArray[jobIndex];
  
      const listItemText = `${company}: ${jobTitle}`;
      const jobDisplay = galleryItems[i].querySelector(`#job-display-${i + 1}`);
      jobDisplay.textContent = listItemText;
    }
  }



/////////////
//carousel
/////////////////


class Carousel {
    constructor(container, items, controls) {
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }

    updateGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
    
        // Remove the current classes from all items
        galleryItems.forEach(item => item.classList.remove('gallery-item-1', 'gallery-item-2', 'gallery-item-3', 'gallery-item-4', 'gallery-item-5'));
    
        // Determine the new central item index based on the direction
        if (this.carouselControls === 'next') {
          this.currentCentralIndex = (this.currentCentralIndex + 1) % this.carouselArray.length;
        } else if (this.carouselControls === 'previous') {
          this.currentCentralIndex = (this.currentCentralIndex - 1 + this.carouselArray.length) % this.carouselArray.length;
        }
    
        // Set the new classes for each item based on the new central index
        for (let i = 0; i < 5; i++) {
          const itemIndex = (this.currentCentralIndex + i - 2 + this.carouselArray.length) % this.carouselArray.length;
          const galleryItem = galleryItems[i];
          galleryItem.classList.add(`gallery-item-${i + 1}`);
    
          // Get the job data from the savedJobsID div
          const jobDataDiv = document.querySelector(`#Saved_${itemIndex + 1}`);
    
          // Check if the element exists before accessing its content
          if (jobDataDiv) {
            const listItemText = jobDataDiv.textContent;
    
            // Update the job data within the gallery item
            const jobDisplayDiv = galleryItem.querySelector('#job-display');
            jobDisplayDiv.textContent = listItemText;
          }
        }
      }

      setCurrentState(direction) {
        if (direction.className === 'gallery-controls-previous') {
          this.carouselControls = 'previous'; // Set the carouselControls based on the direction
          const previousCentralItem = this.carouselArray[2];
          previousCentralItem.classList.remove("cursor-pointer");
          previousCentralItem.removeEventListener('click', showModal);
          this.carouselArray.unshift(this.carouselArray.pop());
        } else {
          this.carouselControls = 'next'; // Set the carouselControls based on the direction
          const previousCentralItem = this.carouselArray[2];
          previousCentralItem.classList.remove("cursor-pointer");
          previousCentralItem.removeEventListener('click', showModal);
          this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery();
        attachModalEvent();
      }

    setControls() {
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
