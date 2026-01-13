document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // בדיקת קלט
    if (!username || !password) {
        document.getElementById("message").innerText = "אנא מלא את כל השדות";
        return;
    }

    // טעינת משתמשים עם error handling
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem("users")) || [];
    } catch (e) {
        console.error("שגיאה בטעינת נתוני משתמשים:", e);
        users = [];
    }

    const user = users.find(u => u.username === username && u.password === password);

    if(user){
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", username);
        document.getElementById("message").innerText = "התחברת בהצלחה!";
        window.location.href = "recipeList.html";
    } else {
        document.getElementById("message").innerText = "שם משתמש או סיסמה לא נכונים";
    }
});
