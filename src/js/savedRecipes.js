document.addEventListener('DOMContentLoaded', function() {
    const savedRecipesContainer = document.getElementById('savedRecipesContainer');
    const goBackBtn = document.getElementById('goBackBtn');
    const deleteItemsBtn = document.getElementById('deleteItemsBtn');
    const leaveDeleteModeBtn = document.getElementById('leaveDeleteModeBtn');
    const loadingIndicator = document.getElementById('loading');

    // Event listener for the Go Back button
    goBackBtn.addEventListener('click', function() {
        window.location.href = 'homePage.html';
    });

    // Retrieve the logged-in user from local storage
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Retrieve saved recipes for the user from local storage
    const userRecipes = JSON.parse(localStorage.getItem(loggedInUser)) || [];

    // Display saved recipes
    if(userRecipes.length>0){
        displaySavedRecipes(userRecipes);
        }
        else {
            deleteItemsBtn.style.display = 'none';
            leaveDeleteModeBtn.style.display = 'none';
            const messageElement = document.createElement('h2');
            messageElement.textContent = "Please add some recipes first";
            
            // Append the message to the container
            savedRecipesContainer.appendChild(messageElement);
        }
    
        function showLoading() {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            } else {
                console.error('Loading indicator not found.');
            }
        }
    
        // Function to hide loading indicator and remove blur
        function hideLoading() {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            } else {
                console.error('Loading indicator not found.');
            }
        }

    function displaySavedRecipes(savedRecipes) {
        savedRecipesContainer.innerHTML = '';

        savedRecipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('saved-recipe');

            const image = document.createElement('img');
            image.src = recipe.image;
            image.alt = recipe.title;

            const title = document.createElement('h3');
            title.textContent = recipe.title;

            const fullRecipeBtn = document.createElement('button');
            fullRecipeBtn.textContent = 'Full Recipe';
            fullRecipeBtn.classList.add('full-recipe-btn');
            fullRecipeBtn.addEventListener('click', function() {
                window.openFullRecipe(recipe.id);
            });

            const summaryRecipeBtn = document.createElement('button');
            summaryRecipeBtn.innerHTML = '&#128270;';
            summaryRecipeBtn.classList.add('summarize-recipe-btn');
            summaryRecipeBtn.addEventListener('click', function() {
                showLoading();
                summaryRecipe(recipe.id);
            });
            recipeDiv.appendChild(image);
            recipeDiv.appendChild(title);
            recipeDiv.appendChild(fullRecipeBtn);
            recipeDiv.appendChild(summaryRecipeBtn);
            savedRecipesContainer.appendChild(recipeDiv);
        });
    }

    function summaryRecipe(recipeId) {
        const API_KEY = 'b400173f7fb143c6b8e8dee1911c3701'; // Replace with your API key
        const API_URL = `https://api.spoonacular.com/recipes/${recipeId}/summary?apiKey=${API_KEY}`;
    
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe summary');
                }
                return response.json();
            })
            .then(data => {
                const summary = data.summary;
                displaySummaryPopup(summary);
                hideLoading();
            })
            .catch(error => {
                console.error('Error fetching recipe summary:', error);
                alert('Failed to fetch recipe summary. Please try again later.');
            });
    }
    
    function displaySummaryPopup(summary) {
        // Create a div for the popup window
        const popupDiv = document.createElement('div');
        popupDiv.classList.add('summary-popup');
    
        // Create a heading for the popup window
        const popupHeading = document.createElement('h2');
        popupHeading.textContent = 'Quick Overview';
        popupDiv.appendChild(popupHeading);
    
        // Create a paragraph for the summary
        const summaryParagraph = document.createElement('p');
        summaryParagraph.innerHTML = summary; // Use innerHTML to render HTML content
        popupDiv.appendChild(summaryParagraph);
    
        // Add the popup window to the document body
        document.body.appendChild(popupDiv);
    
        // Close the popup when clicking outside of it
        function closePopup(event) {
            if (!event.target.closest('.summary-popup')) {
                popupDiv.remove();
                document.removeEventListener('click', closePopup);
                // Restore interaction with background
                document.body.style.pointerEvents = 'auto';
            }
        }
    
        // Add event listener to the document to capture clicks
        document.addEventListener('click', closePopup);
    
        // Prevent interaction with background while popup is open
        document.body.style.pointerEvents = 'none';
        popupDiv.style.pointerEvents = 'auto';
    }
    
    
    

    // Event listener for the Delete Items button
    deleteItemsBtn.addEventListener('click', function() {
        toggleDeleteMode();
    });

    function toggleDeleteMode() {
        const savedRecipeDivs = savedRecipesContainer.querySelectorAll('.saved-recipe');
        savedRecipeDivs.forEach(recipeDiv => {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteRecipe(recipeDiv);
            });
            recipeDiv.appendChild(deleteBtn);
        });

        deleteItemsBtn.style.display = 'none';
        leaveDeleteModeBtn.style.display = 'inline-block';
    }

    function deleteRecipe(recipeDiv) {
        const title = recipeDiv.querySelector('h3').textContent;
        const loggedInUser = localStorage.getItem('loggedInUser');
        let userRecipes = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        userRecipes = userRecipes.filter(recipe => recipe.title !== title);
        if(userRecipes.length==0){

            deleteItemsBtn.style.display = 'none';
            leaveDeleteModeBtn.style.display = 'none';
            const messageElement = document.createElement('h2');
            messageElement.textContent = "Please add some recipes first";
            
            // Append the message to the container
            savedRecipesContainer.appendChild(messageElement);
        }
        localStorage.setItem(loggedInUser, JSON.stringify(userRecipes));
        recipeDiv.remove();
    }

    // Event listener for the Leave Delete Mode button
    leaveDeleteModeBtn.addEventListener('click', function() {
        leaveDeleteMode();
    });

    function leaveDeleteMode() {
        const savedRecipeDivs = savedRecipesContainer.querySelectorAll('.saved-recipe');
        savedRecipeDivs.forEach(recipeDiv => {
            const deleteBtn = recipeDiv.querySelector('.delete-btn');
            deleteBtn.remove();
        });

        deleteItemsBtn.style.display = 'inline-block';
        leaveDeleteModeBtn.style.display = 'none';
    }
});
