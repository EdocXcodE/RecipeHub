document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingIndicator = document.getElementById('loading');

    const savedRecipesBtn = document.getElementById('savedRecipesBtn');    const container = document.querySelector('.container');
    const backBtn = document.getElementById('backBtn');
    let nextPage = 1;
    let isLoading = false;

    // Function to handle recipe search
     function searchRecipes(query) {
        if (query === '') {
            alert('Please enter ingredients or keywords to search.');
            return;
        }

        // Clear previous search results
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        } else {
            console.error('Results container not found.');
            return;
        }
        nextPage = 1;

        // Display loading indicator
        showLoading();

        // Fetch recipes from API
        fetchRecipes(query);
    }

    // Function to fetch recipes from the API
    function fetchRecipes(query) {
        const API_KEY = 'ef3ec680b0da4d9b99df083cf33a12e8'; // Replace with your API key
        const API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=300&page=${nextPage}`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                return response.json();
            })
            .then(data => {
                displayRecipes(data);
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
                alert('Failed to fetch recipes. Please try again later.');
                hideLoading(); // Hide loading indicator in case of error
            });
    }

    // Function to display search results
    function displayRecipes(data) {
        hideLoading(); // Hide loading indicator
        resultsContainer.innerHTML = '';
        const filterContainer = document.getElementById('filterContainer');
        const titleElements = document.querySelector('.title');
        filterContainer.classList.remove('hidden');
        titleElements.classList.remove('hidden');
        container.classList.remove('hidden');
        savedRecipesBtn.classList.remove('hidden');
        resultsContainer.classList.remove('hidden');

        data.results.forEach(recipe => {
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('recipe');

            const image = document.createElement('img');
            image.src = recipe.image;
            image.alt = recipe.title;

            const fullRecipeBtn = document.createElement('button');
            fullRecipeBtn.textContent = 'Full Recipe';
            fullRecipeBtn.addEventListener('click', function() {
                window.openFullRecipe(recipe.id);
            });

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Favourite';
            saveBtn.addEventListener('click', function() {
                saveRecipe(recipe);
            });

            const title = document.createElement('h3');
            title.textContent = recipe.title;

            imageDiv.appendChild(image);
            imageDiv.appendChild(title);
            imageDiv.appendChild(fullRecipeBtn);
            imageDiv.appendChild(saveBtn);
            resultsContainer.appendChild(imageDiv);
        });
       
 
        if(data.results.length==0){

            const noMatchParagraph = document.createElement('p');
            noMatchParagraph.textContent = 'There are no results that match your search.';
            // Check if the message already exists, if not append it
            const existingMessage = resultsContainer.querySelector('.no-match-message');
            if (!existingMessage) {
                resultsContainer.appendChild(noMatchParagraph);
                noMatchParagraph.classList.add('no-match-message');
            }
        } else {
            // Remove the message if it exists
            const existingMessage = resultsContainer.querySelector('.no-match-message');
            if (existingMessage) {
                existingMessage.remove();
            }

        }
    }

    // Function to open source URL
    window.openFullRecipe = function(recipeId) {
        showLoading(); // Show loading indicator

        const API_KEY = 'ef3ec680b0da4d9b99df083cf33a12e8'; // Replace with your API key
        const API_URL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=false`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe information');
                }
                return response.json();
            })
            .then(data => {
                const sourceUrl = data.sourceUrl;
                window.open(sourceUrl, '_blank');
                hideLoading(); // Hide loading indicator after opening URL
            })
            .catch(error => {
                console.error('Error fetching recipe information:', error);
                alert('Failed to open recipe source URL.');
                hideLoading(); // Hide loading indicator in case of error
            });
    }


function saveRecipe(recipe) {
    // Retrieve saved recipes for the user from local storage
    const loggedInUser = localStorage.getItem('loggedInUser');
    let userRecipes = JSON.parse(localStorage.getItem(loggedInUser)) || [];

    // Check if the userRecipes is an array
    if (!Array.isArray(userRecipes)) {
        userRecipes = [];
    }

    // Check if the recipe is already saved
    const isAlreadySaved = userRecipes.some(savedRecipe => savedRecipe.id === recipe.id);

    if (!isAlreadySaved) {
        // If the recipe is not already saved, add it to the saved recipes
        userRecipes.push({ id: recipe.id, title: recipe.title, image: recipe.image });
        // Save the updated list of saved recipes for the user to local storage
        localStorage.setItem(loggedInUser, JSON.stringify(userRecipes));
        console.log('Recipe saved:', recipe);
        alert('Enjoy! Your Recipe is Saved');
        // Refresh the saved recipes container

    } else {
        // If the recipe is already saved, notify the user
        alert('Recipe is already saved.');
    }
}


    // Function to show loading indicator and blur container
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        } else {
            console.error('Loading indicator not found.');
        }
        isLoading = true;
    }

    // Function to hide loading indicator and remove blur
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        } else {
            console.error('Loading indicator not found.');
        }
        if (container) {
            container.style.filter = 'none';
        } else {
            console.error('Container not found.');
        }
        isLoading = false;
    }

    function filterRecipes() {
        const filterInput = document.getElementById('filterInput');
        const filterValue = filterInput.value.toLowerCase();
        const recipeDivs = resultsContainer.querySelectorAll('.recipe');
        let hasMatch = false;
    
        recipeDivs.forEach(recipeDiv => {
            const title = recipeDiv.querySelector('h3').textContent.toLowerCase();
            if (title.includes(filterValue)) {
                recipeDiv.style.display = 'block';
                hasMatch = true;
            } else {
                recipeDiv.style.display = 'none';
            }
        });
    
        if (!hasMatch) {
            // Create a paragraph element to display the message
            const noMatchParagraph = document.createElement('p');
            noMatchParagraph.textContent = 'No results match your search.';
            // Check if the message already exists, if not append it
            const existingMessage = resultsContainer.querySelector('.no-match-message');
            if (!existingMessage) {
                resultsContainer.appendChild(noMatchParagraph);
                noMatchParagraph.classList.add('no-match-message');
            }
        } else {
            // Remove the message if it exists
            const existingMessage = resultsContainer.querySelector('.no-match-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        }
    }

    backBtn.addEventListener('click', function() {
        window.location.href = 'homePage.html';
    });

    // Event listener for input events on the filter input field
    const filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('input', filterRecipes);


    // Get the search query parameter from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get('query');
    if (query) {
        // If the search query exists, perform the search
        searchRecipes(query);
    } else {
        // If the search query doesn't exist, redirect to the landing page

    }
    if (savedRecipesBtn) {
        savedRecipesBtn.addEventListener('click', function() {
            window.location.href = 'saveRecipes.html';
        });
    } else {
        console.error('Saved Recipes button not found.');
    }
});
