document.addEventListener('DOMContentLoaded', function() {
    const savedRecipesContainer = document.getElementById('savedRecipesContainer');
    const goBackBtn = document.getElementById('goBackBtn');
    const deleteItemsBtn = document.getElementById('deleteItemsBtn');
    const leaveDeleteModeBtn = document.getElementById('leaveDeleteModeBtn');

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

            recipeDiv.appendChild(image);
            recipeDiv.appendChild(title);
            recipeDiv.appendChild(fullRecipeBtn);
            savedRecipesContainer.appendChild(recipeDiv);
        });
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
