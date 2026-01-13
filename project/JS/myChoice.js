// בדיקה שמשתמש מחובר
const currentUser = localStorage.getItem("currentUser");
if (!localStorage.getItem("isLoggedIn") || !currentUser) {
    window.location.href = "login.html";
}

// טעינת הגדרות קיימות בטעינת הדף
window.onload = function() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === currentUser);

    if (user && user.settings) {
        document.getElementById("delayInput").value = user.settings.delay / 1000;
        document.getElementById("themeSelect").value = user.settings.darkMode ? "dark" : "light";
        
        // החלת מצב כהה אם נבחר
        if (user.settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
};

// שמירת הגדרות חדשות
document.getElementById("saveSettingsBtn").addEventListener("click", function() {
    const delay = document.getElementById("delayInput").value * 1000;
    const isDark = document.getElementById("themeSelect").value === "dark";

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === currentUser);

    if (userIndex !== -1) {
        users[userIndex].settings = {
            delay: delay,
            darkMode: isDark
        };
        localStorage.setItem("users", JSON.stringify(users));
        
        // החלת מצב כהה מיידית
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        document.getElementById("settingsMessage").innerText = "ההגדרות נשמרו בהצלחה!";
        document.getElementById("settingsMessage").style.color = "green";
    }
});