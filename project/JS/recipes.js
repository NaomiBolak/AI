// 1. בדיקת אבטחה - אם המשתמש לא מחובר, נחזיר אותו לדף הלוגין
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
}

// איניציאליזציה של משתמשים ראשוניים
function initUsers() {
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem("users"));
    } catch (e) {
        console.error("שגיאה בטעינת משתמשים:", e);
        users = null;
    }
    
    if (!users) {
        const initialUsers = [
            {
                username: "admin",
                password: "123456",
                settings: {
                    delay: 2000,
                    darkMode: false
                }
            },
            {
                username: "משתמש",
                password: "1234",
                settings: {
                    delay: 3000,
                    darkMode: true
                }
            }
        ];
        localStorage.setItem("users", JSON.stringify(initialUsers));
    }
}

// 2. נתונים ראשוניים - אם אין מתכונים ב-LocalStorage, ניצור כמה
function initRecipes() {
    let recipes = [];
    try {
        recipes = JSON.parse(localStorage.getItem("recipes"));
    } catch (e) {
        console.error("שגיאה בטעינת מתכונים:", e);
        recipes = null;
    }
    
    if (!recipes) {
        const initialRecipes = [
            {
                id: 1,
                title: "מרק עדשים חם",
                ingredients: ["עדשים", "בצל", "כמון", "מים"],
                instructions: ["מטגנים בצל", "מוסיפים עדשים ותבלינים", "מבשלים 40 דקות"]
            },
            {
                id: 2,
                title: "פסטה ברוטב עגבניות",
                ingredients: ["פסטה", "עגבניות", "שום", "שמן זית"],
                instructions: ["מבשלים פסטה", "מכינים רוטב", "מערבבים הכל"]
            }
        ];
        localStorage.setItem("recipes", JSON.stringify(initialRecipes));
    }
}

// 3. פונקציה להצגת המתכונים על המסך
function displayRecipes(searchTerm = '') {
    let recipes = [];
    try {
        recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    } catch (e) {
        console.error("שגיאה בטעינת מתכונים:", e);
        recipes = [];
    }
    
    const recipesList = document.getElementById("recipesList");
    if (!recipesList) {
        console.error("לא נמצא אלמנט recipesList");
        return;
    }
    
    // סינון לפי חיפוש
    const filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // ניקוי הרשימה לפני הטעינה
    recipesList.innerHTML = "";

    filteredRecipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        
        // שימוש ב-textContent למניעת XSS
        const title = document.createElement("h3");
        title.textContent = recipe.title;
        
        const ingredientsCount = document.createElement("p");
        ingredientsCount.textContent = `${recipe.ingredients ? recipe.ingredients.length : 0} מרכיבים`;
        
        const button = document.createElement("button");
        button.textContent = "למתכון המלא";
        button.className = "nav-btn";
        button.onclick = () => viewRecipe(recipe.id);
        
        card.appendChild(title);
        card.appendChild(ingredientsCount);
        card.appendChild(button);
        recipesList.appendChild(card);
    });
}

// 4. פונקציה למעבר למתכון ספציפי
function viewRecipe(id) {
    localStorage.setItem("currentRecipeId", id);
    window.location.href = "recipe.html";
}

// 5. כפתור התנתקות
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}

// 6. פונקציית חיפוש
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        displayRecipes(e.target.value);
    });
}

// 7. הוספת מתכון חדש
const addRecipeBtn = document.getElementById("addRecipeBtn");
if (addRecipeBtn) {
    addRecipeBtn.addEventListener("click", () => {
        window.location.href = "addRecipe.html";
    });
}

// הפעלת הפונקציות בטעינת הדף
initUsers();
initRecipes();
displayRecipes();