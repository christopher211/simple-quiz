const viewHighscoresSelector = document.querySelector("#view-highscores");
const timeLeftSelector = document.querySelector("#time");
const introSelector = document.querySelector("#intro");
const quizSelector = document.querySelector("#quiz");
const questionSelector = document.querySelector("#question");
const choiceListSelector = document.querySelector("#choices");
const answerSelector = document.querySelector("#answer");
const resultSelector = document.querySelector("#result");

const startBtn = document.querySelector("#start-btn");

const questions = [
  {
    question: "What is the capital of France?",
    answers: {
      a: "Paris",
      b: "London",
      c: "Berlin",
      d: "Rome",
    },
    correctAnswer: "a",
  },
  {
    question: "What is the capital of Italy?",
    answers: {
      a: "Paris",
      b: "London",
      c: "Rome",
      d: "Madrid",
    },
    correctAnswer: "c",
  },
  {
    question: "What is the capital of Germany?",
    answers: {
      a: "Paris",
      b: "Berlin",
      c: "Rome",
      d: "Madrid",
    },
    correctAnswer: "b",
  },
  {
    question: "What is the capital of Spain?",
    answers: {
      a: "Madrid",
      b: "Paris",
      c: "Rome",
      d: "Berlin",
    },
    correctAnswer: "a",
  },
  {
    question: "What is the capital of Portugal?",
    answers: {
      a: "Lisbon",
      b: "Paris",
      c: "Rome",
      d: "Berlin",
    },
    correctAnswer: "a",
  },
];

let currentQuestion = 0;
let timeLeft = 60;
let timerId;
let autoNext;
let numCorrect = 0;
let initials = "";

const scoresStorage =
  JSON.parse(localStorage.getItem("scores")) === null
    ? []
    : JSON.parse(localStorage.getItem("scores"));

const clearContent = () => {
  introSelector.style.display = "none";
  questionSelector.innerHTML = "";
  choiceListSelector.innerHTML = "";
  answerSelector.innerHTML = "";
  resultSelector.innerHTML = "";
  startBtn.style.display = "none";
};

function startQuiz() {
  startBtn.style.display = "none";
  introSelector.style.display = "none";
  timerId = setInterval(countdown, 1000);
  showQuestion();
}

function countdown() {
  if (timeLeft == 0) {
    clearInterval(timerId);
    clearTimeout(autoNext);
    showResults();
  } else {
    timeLeft--;
    timeLeftSelector.innerHTML = "Time left: " + timeLeft;
  }
}

function showQuestion() {
  clearTimeout(autoNext);
  if (currentQuestion > questions.length - 1) {
    showResults();
    return;
  }

  answerSelector.style.display = "none";
  resultSelector.innerHTML = "";

  let question = questions[currentQuestion].question;
  let numChoices = Object.keys(questions[currentQuestion].answers).length;

  // Set the question
  questionSelector.innerHTML = question;

  // Clear existing options
  choiceListSelector.innerHTML = "";

  // Show options
  for (let i = 0; i < numChoices; i++) {
    let letter = String.fromCharCode(97 + i);
    let choice = questions[currentQuestion].answers[letter];
    let answerButton = document.createElement("button");

    answerButton.innerText = `${i + 1}. ${choice}`;
    answerButton.value = letter;
    answerButton.className = "answer-button";
    answerButton.addEventListener("click", (e) => {
      // Handle the click event
      const { value } = e.target;
      checkAnswer(value);
      autoNextQuestion();
    });

    choiceListSelector.appendChild(answerButton);
  }
}

function checkAnswer(answer) {
  const questionData = questions[currentQuestion];
  answerSelector.style.display = "block";
  if (answer === questions[currentQuestion].correctAnswer) {
    numCorrect++;
    answerSelector.innerHTML = `<h3>Correct!</h3>`;
  } else {
    timeLeft -= 10; // subtract 15 seconds from the timer for an incorrect answer
    const answerHTML = `<h3>Incorrect! Answer: ${
      questionData.answers[questionData.correctAnswer]
    }</h3>`;
    answerSelector.innerHTML = answerHTML;
  }
}

const nextQuestion = () => {
  currentQuestion++;
  answerSelector.innerHTML = "";
  showQuestion();
};

const prevQuestion = () => {
  currentQuestion--;
  showQuestion();
};

const autoNextQuestion = () => {
  if (currentQuestion > questions.length - 1) {
    clearTimeout(autoNext);
    clearInterval(timerId);
  }
  autoNext = setTimeout(nextQuestion, 1000);
};

function showResults() {
  clearInterval(timerId);
  clearTimeout(autoNext);
  answerSelector.style.display = "none";
  questionSelector.innerHTML = "";
  choiceListSelector.innerHTML = "";
  answerSelector.innerHTML = "";

  const saveScoreContainer = document.createElement("div");
  saveScoreContainer.id = "save-score";

  const inputName = document.createElement("input");
  inputName.id = "input-name";
  inputName.addEventListener("change", getInputValue);

  const submitButton = document.createElement("button");
  submitButton.id = "submit";
  submitButton.textContent = "Submit";
  submitButton.addEventListener("click", submitScore);

  saveScoreContainer.innerHTML = `<p>Enter initials: </p>`;
  saveScoreContainer.appendChild(inputName);
  saveScoreContainer.appendChild(submitButton);

  let resultHTML = `<h2>All done!</h2>
      <p>Your final score is: ${numCorrect}.</p>`;
  resultSelector.innerHTML = resultHTML;
  resultSelector.appendChild(saveScoreContainer);
}

const getInputValue = (e) => {
  const { value } = e.target;
  initials = value;
};

const submitScore = () => {
  const scoreObj = {
    name: initials === "" ? "Player" : initials,
    score: numCorrect,
  };

  const scoreData =
    JSON.parse(localStorage.getItem("scores")) === null
      ? []
      : JSON.parse(localStorage.getItem("scores"));
  scoreData.push(scoreObj);

  localStorage.setItem("scores", JSON.stringify(scoreData));
  showHighscores("after-submit");
};

const clearHighScore = () => {
  const confirm = window.confirm("Are you sure to clear your highscores?");

  if (confirm) {
    localStorage.clear();
    const scoreContainerSelector = document.querySelector("#score-list");
    scoreContainerSelector.innerHTML = "";
  }
};

const showHighscores = (mode) => {
  clearContent();

  let resultHTML = `<h2>Highscores</h2>`;
  resultSelector.innerHTML = resultHTML;

  const scoreContainer = document.createElement("div");
  scoreContainer.id = "score-list";

  const scoreData =
    JSON.parse(localStorage.getItem("scores")) === null
      ? []
      : JSON.parse(localStorage.getItem("scores"));

  scoreData?.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerText = `${index + 1}. ${item?.name} - ${item?.score}`;
    scoreContainer.appendChild(p);
  });

  resultSelector.appendChild(scoreContainer);

  const btnContainer = document.createElement("div");

  const clearBtn = document.createElement("button");
  clearBtn.id = "clear-highscore";
  clearBtn.textContent = "Clear highscores";
  clearBtn.addEventListener("click", () => {
    clearHighScore();
  });

  const dynamicBtn = document.createElement("button");
  if (mode === "after-submit") {
    dynamicBtn.textContent = "Re-Take";
  } else {
    dynamicBtn.textContent = "Go Back";
  }

  dynamicBtn.addEventListener("click", () => {
    goBack();
  });

  btnContainer.appendChild(dynamicBtn);
  btnContainer.appendChild(clearBtn);
  resultSelector.appendChild(btnContainer);
};

const goBack = () => {
  introSelector.style.display = "block";
  resultSelector.innerHTML = "";
  startBtn.style.display = "block";
  timeLeft = 60;
  timeLeftSelector.innerHTML = "Time left: " + timeLeft;
  currentQuestion = 0;
  numCorrect = 0;
};

viewHighscoresSelector.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  showHighscores("view");
});

startBtn.addEventListener("click", startQuiz);
