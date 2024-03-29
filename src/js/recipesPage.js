document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingIndicator = document.getElementById('loading');
    const loadingIndicatorCont = document.getElementById('loadingContainer');
    const savedRecipesBtn = document.getElementById('savedRecipesBtn');    
    const container = document.querySelector('.container');
    const backBtn = document.getElementById('backBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nxtBtn = document.getElementById('nxtBtn');
    const paginationDetails = document.getElementById('paginationDetails');
    const advancedFilterBtn = document.getElementById('advancedFilterBtn');
    const filterOptions = document.getElementById('filterOptions');
    
    // Event listeners for advanced filter checkboxes
    const vegetarianCheckbox = document.getElementById('vegetarianCheckbox');
    const veganCheckbox = document.getElementById('veganCheckbox');
    const glutenFreeCheckbox = document.getElementById('glutenFreeCheckbox');
    const dairyFreeCheckbox = document.getElementById('dairyFreeCheckbox');
    const veryHealthyCheckbox = document.getElementById('veryHealthyCheckbox');
    const cheapCheckbox = document.getElementById('cheapCheckbox');
    const veryPopularCheckbox = document.getElementById('veryPopularCheckbox');
    const sustainableCheckbox = document.getElementById('sustainableCheckbox');
    const filterInput = document.getElementById('filterInput');
    let currentPage = 1;
    const recipesPerPage = 30;
    let totalPages;
    let isLoading = false;
    let recipeData = {};

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

        // Display loading indicator
        showLoading();

        // Fetch recipes from API
        fetchRecipes(query);
    }

    function paginateRecipes(data){
        calculateTotalPages(data.results.length);

        const startIndex = (currentPage - 1) * recipesPerPage;
        const endIndex = Math.min(startIndex + recipesPerPage, data.results.length);
        let recipe=[];
        for (let i = startIndex; i < endIndex; i++) {
            recipe[i] = data.results[i];
        }
        displayRecipes(recipe);
        // Update pagination details
        updatePaginationDetails();

    }

    function calculateTotalPages(totalRecipes) {
        totalPages = Math.ceil(totalRecipes / recipesPerPage);
    }

    function updatePaginationDetails() {
        paginationDetails.textContent = `Page ${currentPage}/${totalPages}`;
    }

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            hiddenAdd();
            showLoadingCont();
            searchRecipes(query);
        }
    }

    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            hiddenAdd();
            showLoadingCont();
            searchRecipes(query);
        }
    }

    // Function to fetch recipes from the API
    function fetchRecipes(query) {
        const API_KEY = 'fd27a96f0f1f4572b4c4b762706176c5'; // Replace with your API key
        const API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=1000&addRecipeInformation=true`;
        
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                return response.json();
            })
            .then(data => {
                paginateRecipes(data);
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
                alert('Failed to fetch recipes. Please try again later.');
                hideLoading(); // Hide loading indicator in case of error
            });
    }

    function hiddenAdd(){
    container.classList.add('hidden');
    }

    function hiddenRemove(){
        container.classList.remove('hidden');    
    }

    // Function to display search results
    function displayRecipes(results) {
        hideLoading(); // Hide loading indicator
        if(loadingIndicatorCont)
        hideLoadingCont();
        resultsContainer.innerHTML = '';
        hiddenRemove();
        results.forEach((recipe) => {
  
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

            const ytButton = document.createElement('button');
            ytButton.id = 'youtubeButton';
            ytButton.onclick = function() {
                searchYoutube(recipe.title);
            };

            const googleButton = document.createElement('button');
            googleButton.id = 'googleButton';
            googleButton.onclick = function() {
                searchGoogle(recipe.title);
            };
            
            const title = document.createElement('h3');
            title.textContent = recipe.title;
            imageDiv.dataset.recipeId = recipe.id;

                const trueFields = Object.entries(recipe)
                    .filter(([key, value]) => value === true)
                    .map(([key]) => key);
    
                recipeData[recipe.id] = trueFields;

            imageDiv.appendChild(image);
            imageDiv.appendChild(title);
            imageDiv.appendChild(fullRecipeBtn);
            imageDiv.appendChild(saveBtn);
            imageDiv.appendChild(ytButton);
            imageDiv.appendChild(googleButton);
            resultsContainer.appendChild(imageDiv);
        });

        updateDisplayedRecipes();
 
        if(results.length==0){

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

    function searchYoutube(recipeTitle) {   
        const searchQuery = encodeURIComponent(recipeTitle);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

        window.open(youtubeUrl, '_blank');
    }

    function searchGoogle(recipeTitle) {   
        const searchQuery = encodeURIComponent(recipeTitle);
        const googleUrl = `https://www.google.com/search?q=${searchQuery}`;

        window.open(googleUrl, '_blank');
    }
    

    // Function to open source URL
    window.openFullRecipe = function(recipeId) {
        showLoading(); // Show loading indicator

        const API_KEY = 'fd27a96f0f1f4572b4c4b762706176c5'; // Replace with your API key
        const API_URL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=false`;
     
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe information');
                }
                return response.json();
            })
            .then(data => {
                const sourceUrl = data.spoonacularSourceUrl;
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

        // Function to show loading indicator and blur container
        function showLoadingCont() {
            if (loadingIndicatorCont) {
                loadingIndicatorCont.style.display = 'block';
            } else {
                console.error('Loading indicator not found.');
            }
            isLoading = true;
        }
    
        // Function to hide loading indicator and remove blur
        function hideLoadingCont() {
            if (loadingIndicatorCont) {
                loadingIndicatorCont.style.display = 'none';
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


        advancedFilterBtn.addEventListener('click', function() {
            filterOptions.classList.toggle('active');
            
            // Change button text based on the state
            if (filterOptions.classList.contains('active')) {
              advancedFilterBtn.textContent = 'Hide Advanced Filters';
            } else {
              advancedFilterBtn.textContent = 'Advanced Filters';
            }
          });
        

    filterInput.addEventListener('input', updateDisplayedRecipes);
    vegetarianCheckbox.addEventListener('change', updateDisplayedRecipes);
    veganCheckbox.addEventListener('change', updateDisplayedRecipes);
    glutenFreeCheckbox.addEventListener('change', updateDisplayedRecipes);
    dairyFreeCheckbox.addEventListener('change', updateDisplayedRecipes);
    veryHealthyCheckbox.addEventListener('change', updateDisplayedRecipes);
    cheapCheckbox.addEventListener('change', updateDisplayedRecipes);
    veryPopularCheckbox.addEventListener('change', updateDisplayedRecipes);
    sustainableCheckbox.addEventListener('change', updateDisplayedRecipes);

    function updateDisplayedRecipes() {
        const filterValue = filterInput.value.toLowerCase();
        const recipeDivs = resultsContainer.querySelectorAll('.recipe');
        let hasMatch = false;

        recipeDivs.forEach(recipeDiv => {
            const title = recipeDiv.querySelector('h3').textContent.toLowerCase();
            const recipeId = parseInt(recipeDiv.dataset.recipeId);
            const recipeFilters = recipeData[recipeId] || []; // Get filters for the recipe

            // Check if the recipe title matches the search filter
            const titleMatches = title.includes(filterValue);

            // Check if the recipe matches the selected advanced filters
            const filtersMatch = [
                !vegetarianCheckbox.checked || recipeFilters.includes('vegetarian'),
                !veganCheckbox.checked || recipeFilters.includes('vegan'),
                !glutenFreeCheckbox.checked || recipeFilters.includes('glutenFree'),
                !dairyFreeCheckbox.checked || recipeFilters.includes('dairyFree'),
                !veryHealthyCheckbox.checked || recipeFilters.includes('veryHealthy'),
                !cheapCheckbox.checked || recipeFilters.includes('cheap'),
                !veryPopularCheckbox.checked || recipeFilters.includes('veryPopular'),
                !sustainableCheckbox.checked || recipeFilters.includes('sustainable'),
            ].every(Boolean);

            // Show/hide the recipe based on search filter and advanced filters
            if (titleMatches && filtersMatch) {
                recipeDiv.style.display = 'block';
                hasMatch = true;
            } else {
                recipeDiv.style.display = 'none';
            }
        });

        // Show a message if there are no matching recipes
        const noMatchParagraph = resultsContainer.querySelector('.no-match-message');
        if (!hasMatch && !noMatchParagraph) {
            const noMatchParagraph = document.createElement('p');
            noMatchParagraph.textContent = 'No results match your search.';
            noMatchParagraph.classList.add('no-match-message');
            resultsContainer.appendChild(noMatchParagraph);
        } else if (hasMatch && noMatchParagraph) {
            noMatchParagraph.remove();
        }
    }

    backBtn.addEventListener('click', function() {
        window.location.href = 'homePage.html';
    });

    prevBtn.addEventListener('click', function() {
        previousPage();
    });

    nxtBtn.addEventListener('click', function() {
        nextPage();
    });

    
    // Get the search query parameter from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get('query');
    if (query) {
        // If the search query exists, perform the search
        searchRecipes(query);
        hiddenAdd();
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
