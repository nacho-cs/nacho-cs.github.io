// https://dog.ceo/api/breeds/image/random

const dogImageID = document.getElementById('dogImage')
const button = document.getElementById('button')

function getNewDog() { 
fetch('https://dog.ceo/api/breeds/image/random')
  .then(response => response.json())
  .then(json => {
    console.log(json.message)
    dogImageID.innerHTML = `<img src='${json.message}'/>`
  })
}

button.onclick = () => getNewDog()