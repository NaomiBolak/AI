const recipeId = localStorage.getItem("currentRecipeId");
const currentUser = localStorage.getItem("currentUser");
let isPaused = false;
let currentStep = 0;
let currentUtterance = null;

// טעינת הנתונים
window.onload = function() {
    let recipes = [];
    let users = [];
    
    try {
        recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        users = JSON.parse(localStorage.getItem("users")) || [];
    } catch (e) {
        console.error("שגיאה בטעינת נתונים:", e);
        recipes = [];
        users = [];
    }
    
    // החלת מצב כהה
    const user = users.find(u => u.username === currentUser);
    if (user && user.settings && user.settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    const recipe = recipes.find(r => r.id === parseInt(recipeId));
    const delay = user && user.settings ? user.settings.delay : 2000;

    if (recipe) {
        const titleElement = document.getElementById("recipeTitle");
        if (titleElement) {
            titleElement.textContent = recipe.title;
        }
        
        // הצגת מצרכים
        const ingList = document.getElementById("ingredientsList");
        if (ingList && recipe.ingredients) {
            recipe.ingredients.forEach(ing => {
                const li = document.createElement("li");
                li.textContent = ing;
                ingList.appendChild(li);
            });
        }

        // הצגת הוראות
        const instContainer = document.getElementById("instructionsContainer");
        if (instContainer && recipe.instructions) {
            recipe.instructions.forEach((inst, index) => {
                const p = document.createElement("p");
                p.textContent = inst;
                p.id = `step-${index}`;
                instContainer.appendChild(p);
            });
        }

        const startBtn = document.getElementById("startBtn");
        const pauseBtn = document.getElementById("pauseBtn");
        
        if (startBtn) {
            startBtn.onclick = () => {
                if (recipe.instructions) {
                    isPaused = false;
                    currentStep = 0;
                    startReading(recipe.instructions, delay);
                    startBtn.style.display = "none";
                    if (pauseBtn) pauseBtn.style.display = "inline-block";
                }
            };
        }
        
        if (pauseBtn) {
            pauseBtn.onclick = () => {
                pauseReading();
                startBtn.style.display = "inline-block";
                pauseBtn.style.display = "none";
            };
        }
    }
};

function startReading(steps, delay) {
    if (currentStep >= steps.length) {
        const startBtn = document.getElementById("startBtn");
        const pauseBtn = document.getElementById("pauseBtn");
        if (startBtn) startBtn.style.display = "inline-block";
        if (pauseBtn) pauseBtn.style.display = "none";
        currentStep = 0;
        return;
    }

    if (isPaused) return;

    if (!window.speechSynthesis) {
        alert("הדפדפן שלך לא תומך בהקראה קולית");
        return;
    }

    // תרגום לאנגלית לתמיכה טובה יותר
    let textToSpeak = translateToEnglish(steps[currentStep]);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en-US')) ||
                      voices.find(voice => voice.lang.includes('en')) ||
                      voices[0];
    
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    
    currentUtterance = utterance;

    // הדגשת השורה הנוכחית
    document.querySelectorAll("#instructionsContainer p").forEach(p => {
        p.style.color = "black";
        p.style.fontWeight = "normal";
    });
    
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.style.color = "#ff6b6b";
        currentStepElement.style.fontWeight = "bold";
    }

    utterance.onend = function() {
        currentStep++;
        if (currentStep < steps.length && !isPaused) {
            setTimeout(() => startReading(steps, delay), delay);
        } else if (currentStep >= steps.length) {
            const startBtn = document.getElementById("startBtn");
            const pauseBtn = document.getElementById("pauseBtn");
            if (startBtn) startBtn.style.display = "inline-block";
            if (pauseBtn) pauseBtn.style.display = "none";
            currentStep = 0;
        }
    };

    utterance.onerror = function(event) {
        console.error("שגיאה בהקראה:", event.error);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// פונקציה לתרגום לאנגלית
function translateToEnglish(text) {
    const translations = {
        // פעלים
        'מטגנים': 'fry',
        'מבשלים': 'cook',
        'מוסיפים': 'add',
        'מערבבים': 'mix',
        'מכינים': 'prepare',
        'חותכים': 'cut',
        'קוצצים': 'chop',
        'מקשטים': 'peel',
        'משפכים': 'pour',
        'מחממים': 'heat',
        'מצננים': 'cool',
        'מקפיאים': 'freeze',
        'משרים': 'soak',
        'מורידים': 'lower',
        'מעלים': 'raise',
        'מורידים את האש': 'lower the heat',
        'מעלים את האש': 'raise the heat',
        
        // מרכיבים
        'בצל': 'onion',
        'עדשים': 'lentils',
        'פסטה': 'pasta',
        'עגבניות': 'tomatoes',
        'שום': 'garlic',
        'שמן': 'oil',
        'שמן זית': 'olive oil',
        'מים': 'water',
        'כמון': 'cumin',
        'רוטב': 'sauce',
        'מלח': 'salt',
        'פלפל': 'pepper',
        'סוכר': 'sugar',
        'קמח': 'flour',
        'אורז': 'rice',
        'בשר': 'meat',
        'עוף': 'chicken',
        'דג': 'fish',
        'ביצים': 'eggs',
        'חלב': 'milk',
        'גבינה': 'cheese',
        'חמאה': 'butter',
        'לחם': 'bread',
        'גזר': 'carrot',
        'תפוחי אדמה': 'potatoes',
        'קישוא': 'cucumber',
        'חסה': 'lettuce',
        'פטריות': 'mushrooms',
        'בצל ירוק': 'green onion',
        'פטרוזיליה': 'parsley',
        'כוסברה': 'coriander',
        'נענע': 'mint',
        'בזיליקום': 'basil',
        'רוזמרין': 'rosemary',
        'תימיה': 'thyme',
        'אורגנו': 'oregano',
        'פפריקה': 'paprika',
        'קינמון': 'cinnamon',
        'הל': 'cardamom',
        'גינגר': 'ginger',
        'כורכום': 'turmeric',
        'חרדל': 'mustard',
        'חומץ': 'vinegar',
        'לימון': 'lemon',
        'תפוז': 'orange',
        'תפוח': 'apple',
        'בננה': 'banana',
        'ענבים': 'grapes',
        'אבטיח': 'watermelon',
        'מלון': 'melon',
        'אפרסק': 'peach',
        'שזיף': 'plum',
        'אגס': 'pear',
        'תות': 'strawberry',
        'אריס': 'dough',
        'בצק': 'dough',
        'עוגה': 'cake',
        'עוגיות': 'cookies',
        'לחמניה': 'roll',
        'פיתה': 'pita',
        'טורטילה': 'tortilla',
        'פיצה': 'pizza',
        'המבורגר': 'hamburger',
        'סנדוויץ': 'sandwich',
        'סלט': 'salad',
        'מרק': 'soup',
        'מרק עדשים': 'lentil soup',
        'מרק ירקות': 'vegetable soup',
        'מרק עוף': 'chicken soup',
        'מרק בשר': 'beef soup',
        'מרק דגים': 'fish soup',
        'מרק טמטים': 'tomato soup',
        'מרק בצל': 'onion soup',
        'מרק פטריות': 'mushroom soup',
        'מרק גזר': 'carrot soup',
        'מרק תפוחי אדמה': 'potato soup',
        'מרק קוביות': 'dumpling soup',
        'מרק נודלס': 'noodle soup',
        'מרק אורז': 'rice soup',
        'מרק שעועית': 'bean soup',
        'מרק חומצה': 'sour soup',
        'מרק מתוק': 'sweet soup',
        'מרק חריף': 'spicy soup',
        'מרק קר': 'cold soup',
        'מרק חם': 'hot soup',
        
        // זמנים ומדידות
        'דקות': 'minutes',
        'שעות': 'hours',
        'שניות': 'seconds',
        'כוס': 'cup',
        'כוסות': 'cups',
        'כף': 'spoon',
        'כפות': 'spoons',
        'כפית': 'teaspoon',
        'כפיות': 'teaspoons',
        'כף גדולה': 'tablespoon',
        'כפות גדולות': 'tablespoons',
        'ליטר': 'liter',
        'מל': 'ml',
        'גרם': 'gram',
        'קילו': 'kilo',
        'קילוגרם': 'kilogram',
        'צלחת': 'plate',
        'צלחות': 'plates',
        'קערה': 'bowl',
        'קערות': 'bowls',
        'כלי': 'pot',
        'מחבת': 'pan',
        'תנור': 'oven',
        'מיקרוגל': 'microwave',
        'מקרר': 'refrigerator',
        'מקפיא': 'freezer',
        'כיריים': 'stove',
        'גז': 'gas',
        'חשמל': 'electric',
        'אש גבוהה': 'high heat',
        'אש נמוכה': 'low heat',
        'אש בינונית': 'medium heat',
        'מעלות': 'degrees',
        'צלזיוס': 'celsius',
        'פהרנהיט': 'fahrenheit'
    };
    
    let translatedText = text;
    
    // החלפת מילים עבריות באנגליות
    Object.keys(translations).forEach(hebrew => {
        const regex = new RegExp(hebrew, 'g');
        translatedText = translatedText.replace(regex, translations[hebrew]);
    });
    
    return translatedText;
}

function pauseReading() {
    isPaused = true;
    if (currentUtterance) {
        window.speechSynthesis.cancel();
    }
}