/*******************************  
*****   Global Variables   *****
********************************/
const apiKey = '&appid=2143c3b648fa6801136a86ca8d608a79&units=imperial',
      apiURL = 'http://localhost:3000',
      zip = document.getElementById('zip'),
      feelings = document.getElementById('feelings'),
      date = document.getElementById('date'),
      temp = document.getElementById('temp'),
      content = document.getElementById('content'),
      generateBtn = document.getElementById('generate');


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

/****************************** 
*****   GLOBAL FUNCTION   *****
*******************************/
//1- Function to GET Web API Data
const getWeather = async (zipCode)=> {
    const request =  await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}${apiKey}&units=metric`)
        try {
            const data = await request.json()
            return data;
        }
        catch(err) {
            console.log('Error', err);
        }
}

//2- Function to POST request 
const postData = async (url='', data={})=> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
        try {
            const newData = await response.json();
            return newData;
        }
        catch(err) {
            console.log('Error', err);
        }
}

//3- Function to update the DOM
const updateUI = async ()=> {
    const req = await fetch('/all');
        try {
            const allData = await req.json();
                date.innerHTML = 'Date : '+ allData.date;
                temp.innerHTML = 'Tempreture : '+ allData.temp;
                // Alert the User if the feeling box was empty & just return the date & the tempreture
                if(allData.content == '') {
                    return alert('You missed a feelings box')
                }else{
                    content.innerHTML = 'Your Feelings : '+ allData.content;
                }
        }
        catch(err) {
            console.log('Error : ', err);
        }
}

//4- Function to retrieve data on click generate button
const generateData = ()=> {
    // Scroll the page to the bottom
    window.scrollTo(0,document.body.scrollHeight);
    // Get data from API 
    getWeather(zip.value).then((data)=>{
        // If the User didn't enter the zipCode
        if(data.cod == 400){
            return  alert(data.message);
        // If the User entered wrong zipCode
        }else if (data.cod == 404) {
            return  alert(data.message);
        }else {
            // Post data to the server
            postData('/postData', {
                temp: data.main.temp+'  C',
                date: d.toLocaleDateString(),
                content: feelings.value
            }).then(
            // Get data from the server
            updateUI()
            )         
        }
    });
}

/****************************** 
*****   EVENT LISTENER   *****
*******************************/
// Add Event Listener to 'Generate Button' to Retrieve Data 
generateBtn.addEventListener('click', generateData);
   