// Quiz Questions with different difficulty levels
const quizQuestions = {
    easy: [
        {
            question: "What is the capital of France?",
            options: ["Paris", "London", "Berlin", "Rome"],
            correctAnswer: "Paris",
            hint: "It's known as the 'City of Light'"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: "Mars",
            hint: "It's named after the Roman god of war"
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Au", "Ag", "Cu", "Fe"],
            correctAnswer: "Au",
            hint: "It comes from the Latin word 'aurum'"
        }
    ],
    medium: [
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correctAnswer: "Leonardo da Vinci",
            hint: "He was also a famous inventor"
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            correctAnswer: "Blue Whale",
            hint: "It lives in the ocean"
        },
        {
            question: "Which country is home to the kangaroo?",
            options: ["New Zealand", "South Africa", "Australia", "Brazil"],
            correctAnswer: "Australia",
            hint: "It's also known as the 'Land Down Under'"
        }
    ],
    hard: [
        {
            question: "What is the square root of 144?",
            options: ["10", "12", "14", "16"],
            correctAnswer: "12",
            hint: "It's between 10 and 14"
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: "William Shakespeare",
            hint: "He's known as the 'Bard of Avon'"
        },
        {
            question: "What is the chemical formula for water?",
            options: ["H2O", "CO2", "O2", "H2SO4"],
            correctAnswer: "H2O",
            hint: "It contains two hydrogen atoms"
        }
    ]
};

// Quiz State Variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let quizCompleted = false;
let selectedDifficulty = 'easy';
let startTime;
let totalTime = 0;
let questions = [];

// DOM Elements
const startButton = document.getElementById("start-button");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const timerDisplay = document.getElementById("timer");
const hintButton = document.getElementById("hint-button");
const hintText = document.getElementById("hint-text");
const nextButton = document.getElementById("next-button");
const progressBar = document.getElementById("progress");
const questionCount = document.getElementById("question-count");
const scoreDisplay = document.getElementById("score-display");
const welcomeScreen = document.getElementById("welcome-screen");
const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");
const finalScore = document.getElementById("final-score");
const correctAnswers = document.getElementById("correct-answers");
const totalQuestions = document.getElementById("total-questions");
const timeTaken = document.getElementById("time-taken");
const restartButton = document.getElementById("restart-button");
const shareButton = document.getElementById("share-button");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

// Event Listeners
startButton.addEventListener("click", startQuiz);
hintButton.addEventListener("click", showHint);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);
shareButton.addEventListener("click", shareScore);

difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedDifficulty = button.dataset.difficulty;
    });
});

// Start Quiz Function
function startQuiz() {
    welcomeScreen.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    nextButton.classList.remove("hidden");
    
    questions = [...quizQuestions[selectedDifficulty]];
    shuffleArray(questions);
    questions = questions.slice(0, 5); // Limit to 5 questions
    
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    startTime = Date.now();
    
    updateProgress();
    updateScore();
    displayQuestion();
    startTimer();
}

// Display Question Function
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    answerButtons.innerHTML = "";
    hintText.textContent = "";
    hintButton.disabled = false;

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("answer-button");
        button.addEventListener("click", () => checkAnswer(option));
        answerButtons.appendChild(button);
    });

    updateProgress();
}

// Check Answer Function
function checkAnswer(selectedOption) {
    if (quizCompleted) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const buttons = answerButtons.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === currentQuestion.correctAnswer) {
            button.classList.add("correct");
        } else if (button.textContent === selectedOption && !isCorrect) {
            button.classList.add("incorrect");
        }
    });

    if (isCorrect) {
        score++;
        updateScore();
    }

    nextButton.classList.remove("hidden");
}

// Show Hint Function
function showHint() {
    const currentQuestion = questions[currentQuestionIndex];
    hintText.textContent = currentQuestion.hint;
    hintButton.disabled = true;
}

// Next Question Function
function nextQuestion() {
    currentQuestionIndex++;
    nextButton.classList.add("hidden");
    
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        resetTimer();
    } else {
        endQuiz();
    }
}

// Timer Functions
function startTimer() {
    resetTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!quizCompleted) {
                nextQuestion();
            }
        }
    }, 1000);
}

function resetTimer() {
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
}

// Update Progress Function
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionCount.textContent = `Question: ${currentQuestionIndex + 1}/${questions.length}`;
}

// Update Score Function
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// End Quiz Function
function endQuiz() {
    quizCompleted = true;
    clearInterval(timerInterval);
    totalTime = Math.floor((Date.now() - startTime) / 1000);

    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    const scorePercentage = (score / questions.length) * 100;
    finalScore.textContent = score;
    correctAnswers.textContent = score;
    totalQuestions.textContent = questions.length;
    timeTaken.textContent = totalTime;
}

// Restart Quiz Function
function restartQuiz() {
    resultContainer.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
}

// Share Score Function
function shareScore() {
    const shareText = `I scored ${score} out of ${questions.length} in the quiz! Can you beat my score?`;
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Results',
            text: shareText
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = shareText;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Score copied to clipboard!');
    }
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
} 