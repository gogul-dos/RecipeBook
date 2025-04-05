document.addEventListener("DOMContentLoaded", fetchTheDetails);
let fetchedResultsFull = null;

function capitalizeWords(str) {
    return str ? str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : "";
}
function renderItems(fetchedResults){
    const { strMeal, strMealThumb, strArea, strCategory, strTags, strYoutube, strInstructions } = fetchedResults;

    const contentContainer = document.getElementById("content-container");

    let ingredientsHTML = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = fetchedResults[`strIngredient${i}`];
        let measure = fetchedResults[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredientsHTML += `
                <li class="list-item-ingredients">
                    <p>${capitalizeWords(ingredient)}:</p> <p style="color:black;">${measure || "To taste"}</p>
                </li>`;
        }
    }
    let instructionPoints = strInstructions
        ? strInstructions.split('. ').filter(point => point.trim() !== "").map(point => `<li>${point.trim()}.</li>`).join('')
        : "<li>No instructions available.</li>";

    contentContainer.innerHTML = `
    <div>
        <div class="foodMainContainer"> 
            <div class="food-left-container">
                <div class ="go-back-button-container">
                    <button type="button" class="go-back-button" onClick="displayImages()">Go Back </button>
                </div>
                <h2>${strMeal}</h2>
                <img class="food-image" src="${strMealThumb}" alt="${strMeal}" />
                <div>
                    <p>Origin: ${strArea}</p>
                    <p>Category: ${strCategory}</p>
                    <p>Tags: ${strTags ? strTags.trim() : "N/A"}</p>
                    <a class="anchor-element" href="${strYoutube}" target="_blank" style="display: flex; align-items: center;">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUbcjEVrpsnIltwQFVZLRFgdPUze4pFX5odg&s" class="youtube-icon" alt="YouTube Link" />
                        <p style="padding-left:10px; margin: 0;">Watch Recipe</p>
                    </a>
                </div>
            </div>
            <div class="food-right-container">
                <h3>Ingredients Required:</h3>
                <ul class="ingredients-list">${ingredientsHTML}</ul>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 20px;">
            <h4>Guidance:</h4>
            <ol class="instruction-list" style="line-height: 1.6; padding-left: 20px;">${instructionPoints}</ol>
        </div>
    </div>
    `;
}
function resultsReady() {
    if (!fetchedResultsFull) {
        document.getElementById("content-container").innerHTML = "<p>No data available.</p>";
        return;
    }

    fetchedResultsFull.forEach(food => {
        renderItems(food);
    });

    
    
}

function foodIconClicked(strId){
    let  fetchedResults = fetchedResultsFull.filter(each => each.idMeal == strId);
    renderItems(fetchedResults[0]);
}


function displayImages() {
    const contentContainer = document.getElementById("content-container");
    const unOrderedList = document.createElement("ul");
    contentContainer.innerHTML = "";
    contentContainer.appendChild(unOrderedList);
    unOrderedList.classList.add("food-icons-unordered");
    
    let itemsHTML = "";
    fetchedResultsFull.forEach(food => {
        itemsHTML += `
        <li class="food-icon-list-item">
            <button type="Button" id="${food.idMeal}" onClick="foodIconClicked('${food.idMeal}')" class="food-icon-button"> 
                <img src="${food.strMealThumb}" alt="${food.strMeal}" class="food-icon"/>
                <p class="food-icon-name">${food.strMeal}</p>
            </button>
        </li>`;
    });

    unOrderedList.innerHTML = itemsHTML;
}


async function fetchTheDetails() {
    const loadingScreen = document.getElementById("loading-screen");
    const contentContainer = document.getElementById("content-container");

    loadingScreen.style.display = "block";
    let api = "https://www.themealdb.com/api/json/v1/1/search.php?s="

    try {
        const response = await fetch(api+"");
        const data = await response.json();

        loadingScreen.style.display = "none";
        contentContainer.style.display = "block";

        if (data.meals) {
            fetchedResultsFull = data.meals;
            console.log(fetchedResultsFull);
            // resultsReady();
            displayImages();
        } else {
            contentContainer.innerHTML = "<p>No recipes found.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        loadingScreen.innerHTML = "<p>Failed to load data. Please try again later.</p>";
    }
}