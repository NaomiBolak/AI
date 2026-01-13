// בדיקת אבטחה
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
}

document.getElementById("addRecipeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("recipeTitle").value.trim();
    const ingredients = document.getElementById("ingredients").value.trim();
    const instructions = document.getElementById("instructions").value.trim();

    if (!title || !ingredients || !instructions) {
        document.getElementById("message").innerText = "אנא מלא את כל השדות";
        document.getElementById("message").style.color = "red";
        return;
    }

    let recipes = [];
    try {
        recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    } catch (e) {
        recipes = [];
    }

    const newRecipe = {
        id: Date.now(),
        title: title,
        ingredients: ingredients.split("\n").map(i => i.trim()).filter(i => i),
        instructions: instructions.split("\n").map(i => i.trim()).filter(i => i)
    };

    recipes.push(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    
    document.getElementById("message").innerText = "המתכון נוסף בהצלחה!";
    document.getElementById("message").style.color = "green";
    
    // חזרה לרשימה אחרי 2 שניות
    setTimeout(() => {
        window.location.href = "recipeList.html";
    }, 2000);
});