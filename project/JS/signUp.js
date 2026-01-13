document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const massegeElement = document.getElementById("massege");

    // 1. קבלת המשתמשים הקיימים או יצירת מערך ריק אם אין כאלה
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 2. בדיקה האם שם המשתמש כבר תפוס
    const userExists = users.find(u => u.username === username);

    if (userExists) {
        massegeElement.innerText = "שם משתמש זה כבר קיים במערכת";
        massegeElement.style.color = "red";
    } else {
        // 3. יצירת אובייקט משתמש חדש עם הגדרות ברירת מחדל
        const newUser = {
            username: username,
            password: password,
            settings: {
                delay: 2000,     // זמן המתנה ברירת מחדל (2 שניות)
                darkMode: false  // מצב תצוגה ברירת מחדל
            }
        };

        // 4. הוספה למערך ושמירה ב-localStorage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // 5. התחברות אוטומטית והעברה לדף המתכונים
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", username); // נשמור מי המשתמש המחובר כרגע
        
        massegeElement.innerText = "נרשמת בהצלחה! מעביר אותך...";
        massegeElement.style.color = "green";

        setTimeout(() => {
            window.location.href = "recipeList.html";
        }, 1500);
    }
});