'use strict';
//first check if there is stored data in localStorage
var isStoredData;
var products;
if(localStorage.getItem('products') !== null){
  isStoredData = true;
  products = JSON.parse(localStorage.getItem('products'));
}else{
  isStoredData = false;
}
var firstTimeVoting = false;
var imagesNames =['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png' , 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var container = document.getElementById('container');
var image1 = document.getElementById('img1');
var image2 = document.getElementById('img2');
var image3 = document.getElementById('img3');
var resultContainer = document.getElementById('result');
var index1, index2, index3;
var attemptsOfVoting = 25;
var votingTimes = 0;
var resultButton = document.getElementById('show-result-button');
var mainForm = document.getElementById('form');
var listOfResult = document.createElement('ul');
var namesNoExtenstion = [];
var votesArray = [];
var shownArray = [];
var arrOfUniques=[-1,-1,-1];
function ImageObject(name, imageSource, votes, shownTimes){
  //extract only the name form the image name, not with the extension
  //since the objects that come from the local storage, has the names without the extension
  this.name = name;
  if(name.includes('.'))//remove the extension only if it exists
    this.name = name.slice(0, name.length-4);
  imagesArray.push(this);
  this.imageSource = imageSource;
  this.votes = votes;
  this.shownTimes = shownTimes;
  namesNoExtenstion.push(this.name);
}
var imagesArray = [];


mainForm.addEventListener('submit', getUserInput);

function getUserInput(event){
  event.preventDefault();
  attemptsOfVoting = Number(event.target.VoteTimesField.value);
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

function generateRandomNumber(min, max){
  return Math.floor(Math.random() * max) + min;
}

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
      if(!flag){
        arrOfUniques = [index1, index2, index3];
        break;
        //back to while loop
      }
    }
  }

  //show the images in the page using src property
  image1.src = imagesArray[index1].imageSource;
  imagesArray[index1].shownTimes+=1;

  image2.src = imagesArray[index2].imageSource;
  imagesArray[index2].shownTimes+=1;

  image3.src = imagesArray[index3].imageSource;
  imagesArray[index3].shownTimes+=1;
}
// call the function that shows 3 new images.
showThreeImage();

//set event listener for the div that contains the images
container.addEventListener('click', selectImage);

var imageId = '';
function selectImage(event){
  imageId = event.target.id;
  if(votingTimes < attemptsOfVoting){
    votingTimes+=1;
    if(imageId === 'img1'){
      imagesArray[index1].votes+=1;
      showThreeImage();
    }
    else if(imageId === 'img2'){
      imagesArray[index2].votes+=1;
      showThreeImage();
    }
    else if(imageId === 'img3'){
      imagesArray[index3].votes+=1;
      showThreeImage();
    }

  }else if(votingTimes === attemptsOfVoting){//when voting is done
    //display the button that show the results
    localStorage.setItem('products', JSON.stringify(imagesArray));
    resultButton.style.display = 'block';

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

function drawBar(){
  var ctx = document.getElementById('chart-id').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: namesNoExtenstion,
      datasets: [{
        label: 'votes',
        backgroundColor: 'rgb(179, 255, 0)',
        borderColor: 'rgb(255, 99, 132)',
        data: votesArray
      },
      {
        label: 'shown times',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(255, 99, 132)',
        data: shownArray
      }]
    },

    // Configuration options go here
    options: {}
  });
  chart.canvas.parentNode.style.height = '700px';
  chart.canvas.parentNode.style.width = '700px';
}
function drawPie(){
  var ctx = document.getElementById('pie-chart').getContext('2d');
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: namesNoExtenstion,
      datasets: [{
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
        data: votesArray
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
    },
  });
}

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
    listItem.textContent = ' • ' + imageName + ', votes: ' + imageVotes + ', shown:' + imageShownTimes + ', percentage: ' + (imageVotes/imageShownTimes*100).toFixed(2) + '%';
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
showChartsAndList(isStoredData);
