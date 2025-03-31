document.addEventListener("DOMContentLoaded", fetchTheDetails);
let fetchedResults = null;

function capitalizeWords(str) {
    return str ? str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : "";
}

function resultsReady() {
    if (!fetchedResults) {
        document.getElementById("content-container").innerHTML = "<p>No data available.</p>";
        return;
    }
    
    const { strMeal, strMealThumb, strArea, strCategory, strTags, strYoutube, strInstructions } = fetchedResults;

    const contentContainer = document.getElementById("content-container");
    contentContainer.innerHTML = "";

    let ingredientsHTML = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = fetchedResults[`strIngredient${i}`];
        let measure = fetchedResults[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredientsHTML += `
                <li class="list-item-ingredients">
                    <p>${capitalizeWords(ingredient)}:</p> <p>${measure || "To taste"}</p>
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


async function fetchTheDetails() {
    const loadingScreen = document.getElementById("loading-screen");
    const contentContainer = document.getElementById("content-container");

    loadingScreen.style.display = "block";

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata");
        const data = await response.json();

        loadingScreen.style.display = "none";
        contentContainer.style.display = "block";

        if (data.meals) {
            fetchedResults = data.meals[0];
            console.log(fetchedResults);
            resultsReady();
        } else {
            contentContainer.innerHTML = "<p>No recipes found.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        loadingScreen.innerHTML = "<p>Failed to load data. Please try again later.</p>";
    }
}