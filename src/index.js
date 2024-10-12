

document.addEventListener('DOMContentLoaded', () => {
  const toyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.getElementById('toy-collection');

  // Function to fetch all toys from the server
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          addToyToDOM(toy);
        });
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Function to add a toy to the DOM
  function addToyToDOM(toy) {
    const div = document.createElement('div');
    div.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.className = 'like-btn';
    button.id = toy.id; // Set the button ID to the toy's ID
    button.textContent = 'Like ❤️';

    // Add event listener for the like button
    button.addEventListener('click', () => {
      increaseLikes(toy.id, toy.likes);
    });

    div.append(h2, img, p, button);
    toyCollection.appendChild(div);
  }

  // Function to increase likes of a toy
  function increaseLikes(id, currentLikes) {
    const newLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      // Update the DOM with the new like count
      const card = document.getElementById(id).parentElement; // Get the parent card
      card.querySelector('p').textContent = `${updatedToy.likes} Likes`; // Update likes
    })
    .catch(error => console.error('Error updating likes:', error));
  }

  // Event listener for form submission
  toyForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get form values for toy name and image
    const toyName = document.querySelector('input[name="name"]').value;
    const toyImage = document.querySelector('input[name="image"]').value;

    // New toy object
    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0 // Default likes set to 0
    };

    // Send POST request to add toy to the server
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      // Add the new toy to the DOM
      addToyToDOM(toy);
      // Clear the form after submission
      toyForm.reset();
    })
    .catch(error => console.error('Error adding toy:', error));
  });

  // Fetch toys when the page loads
  fetchToys();
});
