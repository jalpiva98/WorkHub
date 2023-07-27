//Global Items
const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');
const savedJobIndexes = [];

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
    displayedJobsArray = savedJobIndexes.slice();

    // If there are fewer than 5 saved jobs, fill the array with `undefined` values
    while (displayedJobsArray.length < 5) {
        displayedJobsArray.push(undefined);
    }

    // Get the central job index
    const centralJobIndex = displayedJobsArray[Math.floor(displayedJobsArray.length / 2)];

    // Fill the displayedJobsArray with job indexes before the central job
    let currentIndex = savedJobIndexes.indexOf(centralJobIndex) - 1;
    while (displayedJobsArray[0] === undefined && currentIndex >= 0) {
        displayedJobsArray.unshift(savedJobIndexes[currentIndex]);
        currentIndex--;
    }

    // Fill the displayedJobsArray with job indexes after the central job
    currentIndex = savedJobIndexes.indexOf(centralJobIndex) + 1;
    while (displayedJobsArray[displayedJobsArray.length - 1] === undefined && currentIndex < savedJobIndexes.length) {
        displayedJobsArray.push(savedJobIndexes[currentIndex]);
        currentIndex++;
    }
}

function updateGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    for (let i = 1; i <= galleryItems.length; i++) {
        const listItem = galleryItems[i - 1];
        const jobDisplay = listItem.querySelector(`#job-display-${i}`);

        if (i <= displayedJobsArray.length) {
            const jobIndex = displayedJobsArray[i - 1];
            const company = jobsArray.companyArray[jobIndex];
            const jobTitle = jobsArray.jobArray[jobIndex];
            const listItemText = `${company}: ${jobTitle}`;
            jobDisplay.textContent = listItemText;
            listItem.style.display = 'block';
        } else {
            jobDisplay.textContent = 'Save your favorite jobs and they will show here!';
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.justifyContent = 'center';
            listItem.classList.add('flex', 'items-center', 'justify-center');
            jobDisplay.classList.add('text-center');
        }
    }
}

class Carousel {
    constructor(container, items, controls) {
        this.carouselContainer = container;
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
exampleCarousel.setControls();
exampleCarousel.useControls();