let addToy = false;

function toyNodeMaker(toy) {
  const toyCard = document.createElement('div');
  const toyName = document.createElement('h2');
  const toyImage = document.createElement('img');
  const toyLikes = document.createElement('p');
  const likeButton = document.createElement('button');
  toyCard.className = 'card';
  toyImage.className = 'toy-avatar'
  toyName.innerText = toy.name;
  toyImage.src = toy.image;
  toyImage.alt = toy.name
  toyLikes.className = 'likes'
  toyLikes.innerText = toy.likes + ' Likes'
  likeButton.className = 'like-btn'
  likeButton.innerText = 'Like <3'
  toyCard.dataset.id = toy.id
  toyCard.dataset.likes = toy.likes
  toyCard.append(toyName, toyImage, toyLikes, likeButton) 
  return toyCard
}
function newToy(formFields) {
  let toy = { likes: 0 }
  for (let field of formFields) {
    toy[field.name] = field.value
  }
  return toy
}
function prepend(toy) {
  const toyCollection = document.getElementById('toy-collection')
  toyCollection.prepend(toy)
}

function getLikesOnCard(event) {
  return parseInt(event.target.parentNode.dataset.likes)
}
function setLikesOnCard(event, likes) {
  event.target.parentNode.dataset.likes = likes
}
function findCard(event) {
  const cardPath = event.path
  return cardPath.find(path => path.classList.contains('card'))
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  const newToyForm = document.querySelector('.add-toy-form')
  
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });
  
  fetch("http://localhost:3000/toys")
  .then((response) => response.json())
  .then((json) => {
    for (let toy of json){
      prepend(toyNodeMaker(toy));
    }
  })
  
  newToyForm.addEventListener('submit', function(event){
    event.preventDefault()
    const formFields = event.target.querySelectorAll('input[type="text"]')
    
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy(formFields)),
    })
    .then((response) => response.json())
    .then((data) => {
      prepend(toyNodeMaker(data));
      for (let f of formFields) {
        f.value = ""
      }
    })    
  })
});

document.addEventListener('click', function(event){
  if (event.target.classList.contains('like-btn')) {
    const likes = getLikesOnCard(event) + 1
    const id = findCard(event).dataset.id
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes })
    }) 
    .then(response => response.json())
    .then(data => {
      findCard(event).querySelector('.likes').innerText = `${data.likes} Likes`
      setLikesOnCard(event, data.likes)
    })
  }
})

