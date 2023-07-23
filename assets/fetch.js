//RAPID API - INDEED  API
//NEW KEY MAY BE REQUIRED ONLY 25 SEARCHES PER MONTH
//NEED TO CHANGE VARS TO GET ITEM

//Indeed 25 Searches - Position - City

/*
let city = "San Diego";
let position = "Software Engineer";


const url = 'https://indeed12.p.rapidapi.com/jobs/search?query=' + position + '&location=' + city;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '9952432343msh4d888bb5e64d387p154272jsnca97fea3ca77',
        'X-RapidAPI-Host': 'indeed12.p.rapidapi.com'
    }
};

async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

fetchData();  */

//SearchJob No Limit - Any Search



let position = 'communication';
let skills = 'chicago';
let location3 = 'director';

const url = 'https://jobsearch4.p.rapidapi.com/api/v2/Jobs/Search?SearchQuery=' + position +'+' + location3+ '+' + skills +'+' +  '&PageSize=50&PageNumber=1';
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
        console.log(result);
    } catch (error) {
        console.error(error);
    }

}

fetchJobSearch();



