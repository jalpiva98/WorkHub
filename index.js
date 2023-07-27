//Global Items
const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');
const savedJobIndexes = [];
let centralJobIndex = savedJobIndexes.length > 0 ? savedJobIndexes[0] : undefined;

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

function updateDisplayedJobsArray() {
    displayedJobsArray = [];
  
    // Obtenemos el índice del trabajo central (posición 2 en el carrusel)
    const centralIndex = savedJobIndexes.indexOf(centralJobIndex);
    // Si el trabajo central no está en la lista de trabajos mostrados, lo agregamos al inicio
    if (centralIndex === -1) {
        displayedJobsArray.push(centralJobIndex);
    }
  
    for (let i = centralIndex - 1; i >= 0; i--) {
        displayedJobsArray.unshift(savedJobIndexes[i]);
        if (displayedJobsArray.length === 5) break; 
    }

    for (let i = centralIndex + 1; i < savedJobIndexes.length; i++) {
        displayedJobsArray.push(savedJobIndexes[i]);
        if (displayedJobsArray.length === 5) break; 
    }
}

function updateGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    for (let i = 0; i < galleryItems.length; i++) {
        const listItem = galleryItems[i];
        const jobDisplay = listItem.querySelector(`#job-display-${i + 1}`);

        if (i < displayedJobsArray.length) {
            const jobIndex = displayedJobsArray[i];
            const company = jobsArray.companyArray[jobIndex];
            const jobTitle = jobsArray.jobArray[jobIndex];
            const listItemText = `${company}: ${jobTitle}`;
            jobDisplay.textContent = listItemText;
            listItem.style.display = 'block';
        } else {
            jobDisplay.textContent = 'Save your favorite jobs and it will show here!';
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
            centralJobIndex = savedJobIndexes[savedJobIndexes.indexOf(centralJobIndex) - 1];
            if (centralJobIndex === undefined) centralJobIndex = savedJobIndexes[savedJobIndexes.length - 1];
        } else {
            this.carouselArray.push(this.carouselArray.shift());
            centralJobIndex = savedJobIndexes[savedJobIndexes.indexOf(centralJobIndex) + 1];
            if (centralJobIndex === undefined) centralJobIndex = savedJobIndexes[0];
        }
        updateDisplayedJobsArray(); // Actualizar el array de trabajos mostrados
        this.updateGallery(); // Actualizar el carrusel
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
            // Verificar si el control es un botón antes de agregar el evento de clic
            if (control.tagName === 'BUTTON') {
                const controlClass = control.className;
                const controlName = controlClass.replace('gallery-controls-', '');
                control.addEventListener('click', e => {
                    e.preventDefault();
                    console.log(displayedJobsArray);
                    this.setCurrentState(controlName);
                });
            }

            // Find the central carousel item (third item).
            const centralItem = this.carouselArray[2];
            // Add an event listener to the central item to show the modal on click.
            centralItem.classList.add("cursor-pointer");
            centralItem.addEventListener('click', showModal);
            attachModalEvent()
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