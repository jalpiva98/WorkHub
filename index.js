//Global Items
const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');
const savedJobIndexes = [];
let currentJobData = null; // Variable to store the data of the currently displayed job
let displayedJobsArray = [];
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
        // Add any additional functionality here if needed
        updateDisplayedJobsArray();
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
            $(`#myCheckbox${i}`).on('change', function () {
                if (this.checked) {
                    const listItemText = $(this).closest('li').text();
                    const jobIndex = i; // Store the index of the job in the local storage
                    localStorage.setItem(`ListItem${jobIndex}`, listItemText + jobURL);
                    savedJobIndexes.push(jobIndex);
                } else {
                    const jobIndex = i; // Retrieve the stored index of the job from local storage
                    localStorage.removeItem(`ListItem${jobIndex}`);
                    const indexToRemove = savedJobIndexes.indexOf(jobIndex);
                    if (indexToRemove !== -1) {
                        savedJobIndexes.splice(indexToRemove, 1);
                    }
                }
                // Update the displayed jobs immediately after saving/removing a job.
                updateDisplayedJobsArray();
                updateGallery();
            });

        }
        updateGallery();
    } catch (error) {
        console.error('error');
    }
}
function updateDisplayedJobsArray() {

    displayedJobsArray = [];

    // Get the central job index (gallery-item-3)
    const centralJobIndex = savedJobIndexes.indexOf(2);

    // Fill the displayedJobsArray with job indexes before the central job
    let currentIndex = centralJobIndex - 1;
    while (displayedJobsArray.length < 2 && currentIndex >= 0) {
        displayedJobsArray.unshift(savedJobIndexes[currentIndex]);
        currentIndex--;
    }

    // Fill the displayedJobsArray with the central job (gallery-item-3)
    displayedJobsArray.push(savedJobIndexes[centralJobIndex]);

    // Fill the displayedJobsArray with job indexes after the central job
    currentIndex = centralJobIndex + 1;
    while (displayedJobsArray.length < 5 && currentIndex < savedJobIndexes.length) {
        displayedJobsArray.push(savedJobIndexes[currentIndex]);
        currentIndex++;
    }

}
function updateGallery() {

    const galleryItems = document.querySelectorAll('.gallery-item');

    for (let i = 1; i <= galleryItems.length; i++) {
        const listItem = galleryItems[i - 1];
        const jobDisplay = listItem.querySelector(`#job-display-${i}`);

        if (i <= savedJobIndexes.length) {
            const jobIndex = savedJobIndexes[i - 1];
            const company = jobsArray.companyArray[jobIndex];
            const jobTitle = jobsArray.jobArray[jobIndex];
            const jobURL = jobsArray.URLarray[jobIndex];
            const listItemText = `${company}: ${jobTitle}`;
            jobDisplay.textContent = listItemText;
            listItem.style.display = 'block';

            // Store the data of the currently displayed job for the modal
            if (i === 3) {
                currentJobData = {
                    company,
                    jobTitle,
                    jobURL,
                };
            }
        } else {
            // If there's no saved job at this index, display the placeholder message
            jobDisplay.textContent = 'Save your favorite jobs and they will show here!';
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.justifyContent = 'center';
            listItem.classList.add('flex', 'items-center', 'justify-center');
            jobDisplay.classList.add('text-center');
        }
    }

    // Attach the modal event to the central item after updating the gallery
    attachModalEvent();

}
class Carousel {

    constructor(container, items, controls) {
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }

    updateGallery() {
        this.carouselArray.forEach(el => {
            el.classList.remove('gallery-item-1');
            el.classList.remove('gallery-item-2');
            el.classList.remove('gallery-item-3');
            el.classList.remove('gallery-item-4');
            el.classList.remove('gallery-item-5');
        });
        this.carouselArray.slice(0, 5).forEach((el, i) => {
            el.classList.add(`gallery-item-${i + 1}`);
        });
    }

    setCurrentState(direction) {
        if (direction === 'previous') {
            this.carouselArray.unshift(this.carouselArray.pop());
        } else {
            this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery(); // Update the carousel classes
    }
 
  setControls() {
    this.carouselControls.forEach((control) => {
      galleryControlsContainer.appendChild(
        document.createElement("button")
      ).className = `gallery-controls-${control}`;
      document.querySelector(`.gallery-controls-${control}`).innerText =
        control;
    });
  }


    setControls() {
        this.carouselControls.forEach(control => {
            galleryControlsContainer.appendChild(document.createElement('button')).className = `gallery-controls-${control}`;
            document.querySelector(`.gallery-controls-${control}`).innerText = control;
        });
    }


    useControls() {
        let previousCentralItem = this.carouselArray[2];
        const triggers = [...galleryControlsContainer.childNodes];

        triggers.forEach(control => {
            // Verificar si el control es un botón antes de agregar el evento de clic
            if (control.tagName === 'BUTTON') {
                const controlClass = control.className;
                const controlName = controlClass.replace('gallery-controls-', '');
                control.addEventListener('click', e => {
                    e.preventDefault();
                    console.log(displayedJobsArray);
                    this.setCurrentState(controlName);

                    // Remove event listener and class from previous central item
                    previousCentralItem.classList.remove("cursor-pointer");
                    previousCentralItem.removeEventListener('click', showModal);
                    previousCentralItem = this.carouselArray[2];

                    // Add event listener to the new central item
                    const centralItem = this.carouselArray[2];
                    centralItem.classList.add("cursor-pointer");
                    centralItem.addEventListener('click', showModal);

                    // Update currentJobData with the new central item's data
                    const centralItemIndex = parseInt(centralItem.dataset.index, 10);
                    currentJobData = {
                        jobIndex: displayedJobsArray[centralItemIndex],
                        company: jobsArray.companyArray[displayedJobsArray[centralItemIndex - 1]],
                        jobTitle: jobsArray.jobArray[displayedJobsArray[centralItemIndex - 1]],
                        jobURL: jobsArray.URLarray[displayedJobsArray[centralItemIndex - 1]],
                    };
                });
            }
        });
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

    // Populate the modal with the current job data
    const modalJobTitle = document.getElementById('modal-job-title');
    const modalJobCompany = document.getElementById('modal-job-company');
    const modalJobLink = document.getElementById('modal-job-link');

    if (currentJobData) {
        modalJobTitle.textContent = currentJobData.jobTitle;
        modalJobCompany.textContent = currentJobData.company;
        modalJobLink.href = currentJobData.jobURL;
    }

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

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('[data-modal-hide="defaultModal"]');
    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }
});

const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);

// Llamar a updateGallery() para mostrar los trabajos guardados inmediatamente
updateGallery();
exampleCarousel.useControls();
