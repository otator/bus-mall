'use strict';

//this variable will holdes the data from localStorage when it's avaiable
var products;

//first check if there is stored data in localStorage
var isStoredData;
if(localStorage.getItem('products') !== null){
  isStoredData = true;
  //parse string data from localStorage into object
  products = JSON.parse(localStorage.getItem('products'));
}else{
  isStoredData = false;
}
//this variable used to konw if this is the first time voting
var firstTimeVoting = false;
//create an array that holdes the images names
var imagesNames =['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png' , 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
//main continer for result and images
var container = document.getElementById('container');
//add the three images to js to use them in code
var image1 = document.getElementById('img1');
var image2 = document.getElementById('img2');
var image3 = document.getElementById('img3');
//result contanier to add unordered list to it.
var resultContainer = document.getElementById('result');
//these indices used will hold the random numbers.
var index1, index2, index3;
//the defualt attempts of voting and it is set to 25, this value will be changed if the user entered another number.
var attemptsOfVoting = 25;
//this variable used to check when voting is done.
var votingTimes = 0;
//this button is used to show the result in list.
var resultButton = document.getElementById('show-result-button');
//the form where user inputs the number for attempt of voting.
var mainForm = document.getElementById('form');
//create unordered list to add to the container
var listOfResult = document.createElement('ul');
//store the names of images with no extension to use later.
var namesNoExtenstion = [];
//the array that holds the votes for each image during the voting.
var votesArray = [];
//the array that holds how mnay times an image is shown to the user.
var shownArray = [];
//this array is used to store unique indices for images.
var arrOfUniques=[-1,-1,-1];
//this array holds all the images objects.
var imagesArray = [];
//the image object that has image propreties.
function ImageObject(name, imageSource, votes, shownTimes){
  //extract only the name form the image name, not with the extension
  //since the objects that come from the local storage, has the names without the extension
  this.name = name;
  if(name.includes('.'))//remove the extension only if it exists.
    this.name = name.slice(0, name.length-4);
  //push each image object to this array.
  imagesArray.push(this);
  this.imageSource = imageSource;
  this.votes = votes;
  this.shownTimes = shownTimes;
  //add the images names to indivisual array.
  namesNoExtenstion.push(this.name);
}


//add an event listener to the form to save the data entered from the user.
mainForm.addEventListener('submit', getUserInput);

//the function that will be executed once the submitted button clicked.
function getUserInput(event){
  //prevent the default vehavior of form submission which is refreshes the page.
  event.preventDefault();
  //get the number of  attempts of voting and convert it to number data type to use later.
  attemptsOfVoting = Number(event.target.VoteTimesField.value);
  //remove the event listener once the user submitted.
  mainForm.removeEventListener('submit', getUserInput);
}




//create the 20 image objects
if(isStoredData){//if there is stored data recreate the objects for this data.
  for(var i=0; i<products.length; i++){
    new ImageObject(products[i].name, products[i].imageSource, products[i].votes, products[i].shownTimes);
  }
}else{
  for(i=0; i<imagesNames.length; i++){//for the first time, create the objects with 0 for votes and shown times.
    new ImageObject(imagesNames[i], 'img/'+imagesNames[i],0,0);
  }
}

//this function generates random value between min and max
function generateRandomNumber(min, max){
  return Math.floor(Math.random() * max) + min;
}

//this function is responsible of showing the three images to user.
function showThreeImage(){
  var flag;
  //loop until finding the desired images
  while(true){
    flag = false;
    //generates 3 random indices to get images using them.
    index1 = generateRandomNumber(0, imagesNames.length);
    index2 = generateRandomNumber(0, imagesNames.length);
    index3 = generateRandomNumber(0, imagesNames.length);

    //first make sure that the indices are different from each other
    if(index1 !== index2 && index2 !== index3 && index1 !== index3){
      //then check if any of the indices shown in the previous time.
      for(var i=0; i<arrOfUniques.length;i++){
        if(arrOfUniques[i] === index1 || arrOfUniques[i] === index2 || arrOfUniques[i] ===index3){
          flag = true;
          //break the loop once we get similar image
          break;
        }
      }
      if(!flag){//if all images are unique, store them and break the loop
        arrOfUniques = [index1, index2, index3];
        break;
      }
      //back to while loop
    }
  }

  //show the images in the page using src property
  image1.src = imagesArray[index1].imageSource;
  imagesArray[index1].shownTimes+=1;

  image2.src = imagesArray[index2].imageSource;
  imagesArray[index2].shownTimes+=1;

  image3.src = imagesArray[index3].imageSource;
  imagesArray[index3].shownTimes+=1;
}//end of showThreeImages function.

// call the function that shows 3 new images.
showThreeImage();

//set event listener for the div that contains the images
container.addEventListener('click', selectImage);

var imageId = '';
//this function is responsible of what image has been selected
function selectImage(event){
  imageId = event.target.id;
  //check if the voting times is done or not
  if(votingTimes < attemptsOfVoting){
    //increase the voting times by one
    votingTimes+=1;

    if(imageId === 'img1'){//if image1 was clicked increase its votes by one.
      imagesArray[index1].votes+=1;
      //show new 3 images after the user had chosen
      showThreeImage();
    }
    else if(imageId === 'img2'){//if image2 was clicked increase its votes by one.
      imagesArray[index2].votes+=1;
      //show new 3 images after the user had chosen
      showThreeImage();
    }
    else if(imageId === 'img3'){//if image3 was clicked increase its votes by one.
      imagesArray[index3].votes+=1;
      //show new 3 images after the user had chosen
      showThreeImage();
    }

  }else if(votingTimes === attemptsOfVoting){//when voting is done
    //display the button that show the results
    resultButton.style.display = 'block';
    //store the new voting data to the localStorage
    localStorage.setItem('products', JSON.stringify(imagesArray));

    for(var v=0; v<imagesArray.length; v++){
      //push the votes to an array so it can be used as chart data
      votesArray.push(imagesArray[v].votes);
      //psuh the shown times toan array, so it can be used later
      shownArray.push(imagesArray[v].shownTimes);
    }
    firstTimeVoting = true;
    showChartsAndList(isStoredData);
  }
}



//this variable to make the run only one time
var onlyOnce = true;
//show the result in list function
function showVotes(){
  if(onlyOnce === true){
    onlyOnce = false;
    //if the user click the button before finshing the votes
    if(votingTimes !== attemptsOfVoting){
      //this line will alert the user to keep voting
      alert('keep voting');
      onlyOnce = true;
    }else{
      //remove the ul from its parent, for no doublication.
      showList();
      container.removeEventListener('click', selectImage);
    }
  }
}
//this function draws a chart of votes and shown times as bar
function drawBar(){
  var ctx = document.getElementById('chart-id').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      //the label are the images name
      labels: namesNoExtenstion,
      datasets: [{
        label: 'votes',
        backgroundColor: 'rgb(179, 255, 0)',
        borderColor: 'rgb(255, 99, 132)',
        //data of bars are votes array for the first bar
        data: votesArray
      },
      {
        label: 'shown times',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(255, 99, 132)',
        //data of bars are shown times for the second bar
        data: shownArray
      }]
    },

    // Configuration options go here
    options: {}
  });
  chart.canvas.parentNode.style.height = '700px';
  chart.canvas.parentNode.style.width = '700px';
}

//this function draws the votes and the shown times as pie chart
function drawPie(){
  var ctx = document.getElementById('pie-chart').getContext('2d');
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: namesNoExtenstion,
      datasets: [{
        //the colors for each slice of the bar
        backgroundColor:['#F44336',
          '#00ff00',
          '#ff0000',
          '#00ffff',
          '#0000ff',
          '#ff00ff',
          '#800000',
          '#808000',
          '#200080',
          '#ffff00',
          '#003300',
          '#FF8A80',
          '#FF5252',
          '#FF1744',
          '#D50000',
          '#E91E63',
          '#FCE4EC',
          '#F8BBD0',
          '#CFD8DC',
          '#B0BEC5',
          '#000066',
          '#006666',
          '#cc3300',
          '#66ffff',],
        //data is for the votes
        data: votesArray
      }],
    },
  });
}

//this function shows the list of votes and shown times for each image and the percentage of 
// how many times the images is chosen to the times that was showing.
function showList(){
  //create list item li;
  var listItem;
  var imageVotes;
  var imageShownTimes;
  var imageName;
  //looping over the images objects
  for(var item=0; item<imagesArray.length; item++){
    //getting the votes out of the objects
    imageVotes = imagesArray[item].votes;
    //getting the shown time that image has been shown to the user
    imageShownTimes = imagesArray[item].shownTimes;
    //getting the name of the image as well
    imageName = imagesArray[item].name;
    //choose only the images with votes

    listItem = document.createElement('li');
    //create the list element with the content
    listItem.textContent = ' • ' + imageName + ', votes: ' + imageVotes + ', shown:' + imageShownTimes + ', percentage: ' + (imageVotes/imageShownTimes*100).toFixed(2)+ '%';
    //add the li to the ul
    listOfResult.appendChild(listItem);
  }
  //adding the result list the parent container
  resultContainer.appendChild(listOfResult);
  //remove the event listeber once the reult has been shown
}

//show the charts for stored data
function showChartsAndList(isStoredData){
  if(isStoredData){
    votesArray = [];
    shownArray = [];
    for(i=0; i<imagesArray.length; i++){
      votesArray.push(imagesArray[i].votes);
      shownArray.push(imagesArray[i].shownTimes);
    }
    //call the function that will draw the chart after the voting is done.
    drawBar();
    //draw the data as pie chart
    drawPie();

  }else{
    if(firstTimeVoting){
      //call the function that will draw the chart after the voting is done.
      drawBar();
      //draw the data as pie chart
      drawPie();
    }
  }
}
//this function will display the charts if there was data stored in localStorage.
showChartsAndList(isStoredData);
