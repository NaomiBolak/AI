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
    
    const recipe = recipes.find(r => r.id === parseInt(recipeId));
    const user = users.find(u => u.username === currentUser);
    
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

    // המתנה לטעינת קולות
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            startReading(steps, delay);
        }, { once: true });
        return;
    }

    // תרגום לאנגלית ל-Edge (בסיסי)
    let textToSpeak = steps[currentStep];
    
    // תרגום מילים בסיסיות
    const translations = {
        'מטגנים': 'fry',
        'מבשלים': 'cook',
        'מוסיפים': 'add',
        'מערבבים': 'mix',
        'מכינים': 'prepare',
        'בצל': 'onion',
        'עדשים': 'lentils',
        'פסטה': 'pasta',
        'עגבניות': 'tomatoes',
        'שום': 'garlic',
        'שמן': 'oil',
        'מים': 'water',
        'כמון': 'cumin',
        'רוטב': 'sauce',
        'דקות': 'minutes'
    };
    
    // החלפת מילים עבריות באנגליות
    Object.keys(translations).forEach(hebrew => {
        textToSpeak = textToSpeak.replace(new RegExp(hebrew, 'g'), translations[hebrew]);
    });

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en-US')) || 
                      voices.find(voice => voice.lang.includes('en')) ||
                      voices[0];
    
    utterance.voice = englishVoice;
    utterance.lang = 'en-US'; // אנגלית עובדת טוב יותר ב-Edge
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
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

    console.log(`מקריא: ${textToSpeak}`);

    utterance.onstart = function() {
        console.log("התחילה הקראה");
    };

    utterance.onend = function() {
        console.log("סיימה הקראה");
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

function pauseReading() {
    isPaused = true;
    if (currentUtterance) {
        window.speechSynthesis.cancel();
    }
}