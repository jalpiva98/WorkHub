//Global Items


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

            const resultsList = $('#resultsID');
            resultsList.append(listItem);
            listItem.append(checkbox)
            resultsList.append(listItem);

            const savedJobsID = $('#SavedContainerID');

            // Get Checkbox List Item and set it as Local Storage if checked - else remove item
            // Create an Element on gallery Element to display saved item

            $(`#myCheckbox${i}`).on('change', function() {



                if (this.checked) {

                    const listItemText = $(this).closest('li').text();
                    localStorage.setItem(`ListItem${i}`, listItemText + jobURL);

                    const galleryElement = $('<div>').text(listItemText);

                    galleryElement.attr('class', `gallery-item gallery-item-${i+1}`)
                    galleryElement.attr('id', `Saved_${i+1}`);
                    galleryElement.attr('data-index', `${i+1}`);

                    savedJobsID.append(galleryElement);




                } else  localStorage.removeItem(`ListItem${i}`);

            });
        }



    } catch (error) {
        console.error('error');
    }
}







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

