'use strict';

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

var namesNoExtenstion = [];
var votesArray = [];
var shownArray = [];
var arrOfUniques=[-1,-1,-1];
function ImageObject(name, imageSource){
  //extract only the name form the image name, not with the extension
  this.name = name.slice(0, name.length-4);
  this.imagesArray.push(this);
  this.imageSource = imageSource;
  this.votes = 0;
  this.shownTimes = 0;
  namesNoExtenstion.push(this.name);
}
ImageObject.prototype.imagesArray = [];


mainForm.addEventListener('submit', getUserInput);

function getUserInput(event){
  event.preventDefault();
  attemptsOfVoting = Number(event.target.VoteTimesField.value);
  mainForm.removeEventListener('submit', getUserInput);
}




//create the 20 image objects
for(var i=0; i<imagesNames.length; i++){
  new ImageObject(imagesNames[i], '../img/'+imagesNames[i]);
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
          //break the loop once we got similar image
          break;
        }
      }
      if(!flag){
        arrOfUniques = [index1, index2, index3];
        break;
      }
    }
  }
  image1.src = ImageObject.prototype.imagesArray[index1].imageSource;
  ImageObject.prototype.imagesArray[index1].shownTimes+=1;

  image2.src = ImageObject.prototype.imagesArray[index2].imageSource;
  ImageObject.prototype.imagesArray[index2].shownTimes+=1;

  image3.src = ImageObject.prototype.imagesArray[index3].imageSource;
  ImageObject.prototype.imagesArray[index3].shownTimes+=1;
}
showThreeImage();

//set event listener for the div that container the images
container.addEventListener('click', selectImage);

var imageId = '';
function selectImage(event){
  imageId = event.target.id;
  if(votingTimes < attemptsOfVoting){
    votingTimes+=1;
    if(imageId === 'img1'){
      ImageObject.prototype.imagesArray[index1].votes+=1;
      showThreeImage();
    }
    else if(imageId === 'img2'){
      ImageObject.prototype.imagesArray[index2].votes+=1;
      showThreeImage();
    }
    else if(imageId === 'img3'){
      ImageObject.prototype.imagesArray[index3].votes+=1;
      showThreeImage();
    }

  }else if(votingTimes === attemptsOfVoting){//when voting is done
    //display the button that show the results
    resultButton.style.display = 'block';

    for(var v=0; v<ImageObject.prototype.imagesArray.length; v++){
      //push the votes to an array so it can be used as chart data
      votesArray.push(ImageObject.prototype.imagesArray[v].votes);
      //psuh the shown times toan array, so it can be used later
      shownArray.push(ImageObject.prototype.imagesArray[v].shownTimes);
    }
    //call the function that will draw the chart after the voting is done.
    drawBar();
    //draw the data as pie chart
    drawPie();
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
      var listOfResult = document.createElement('ul');
      //create list item li;
      var listItem;
      var imageVotes;
      var imageShownTimes;
      var imageName;
      //looping over the images objects
      for(var item=0; item<ImageObject.prototype.imagesArray.length; item++){
        //getting the votes out of the objects
        imageVotes = ImageObject.prototype.imagesArray[item].votes;
        //getting the shown time that image has been shown to the user
        imageShownTimes = ImageObject.prototype.imagesArray[item].shownTimes;
        //getting the name of the image as well
        imageName = ImageObject.prototype.imagesArray[item].name;
        //choose only the images with votes
        if(imageVotes > 0){
          listItem = document.createElement('li');
          //create the list element with the content
          listItem.textContent = '• ' + imageName + ', votes: ' + imageVotes + ', shown:' + imageShownTimes + ', percentage: ' + (imageVotes/imageShownTimes*100).toFixed(2) + '%';
          //add the li to the ul
          listOfResult.appendChild(listItem);
        }
      }
      //adding the result list the parent container
      resultContainer.appendChild(listOfResult);
      //remove the event listeber once the reult has been shown
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
        data: votesArray}
      ]
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
