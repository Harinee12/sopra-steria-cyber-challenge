/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

let supabaseClient = null;

/*
   Safely initialize Supabase.

   Even if Supabase fails to load,
   the buttons will STILL work.
*/

if (window.supabase && typeof window.supabase.createClient === "function") {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

/* =====================================================
   VARIABLES
===================================================== */

let participantName = "";

let policyChoice = "";

let policyReason = "";

let currentQuestion = 0;

let selectedAnswer = -1;

let answerChecked = false;

let score = 0;

let wrong = 0;

/* =====================================================
   QUESTIONS
===================================================== */

const questions = [
  {
    question:
      "You receive an unexpected email saying your account will be locked in 10 minutes. It asks you to click a link immediately. What should you do?",

    options: [
      "Click the link immediately",
      "Ignore the urgency and verify the message through an official channel",
      "Reply with your password",
      "Forward the email to everyone",
    ],

    answer: 1,

    explanation:
      "Phishing messages often create urgency so people act without thinking. Verify unexpected requests through a trusted official channel before clicking.",
  },

  {
    question: "Which is the safest password practice?",

    options: [
      "Use the same password everywhere",
      "Use your birthday as your password",
      "Use a strong unique password for each important account",
      "Share your password with a trusted colleague",
    ],

    answer: 2,

    explanation:
      "Strong and unique passwords reduce the impact if one account is compromised.",
  },

  {
    question:
      "Someone calls pretending to be IT support and asks you to read out the OTP sent to your phone. What should you do?",

    options: [
      "Give the OTP because they are IT",
      "Share only the first few digits",
      "Do not share the OTP and verify the caller independently",
      "Send the OTP by email",
    ],

    answer: 2,

    explanation:
      "An OTP is a security verification code. Never share it with another person, even if they claim to be from IT support.",
  },

  {
    question:
      "Before entering information on a website, what should you check first?",

    options: [
      "Whether the page has many colors",
      "The website address and whether it is the expected legitimate domain",
      "Whether the website loads quickly",
      "Whether the page has advertisements",
    ],

    answer: 1,

    explanation:
      "Fake websites can look almost identical to legitimate websites. Checking the address and domain helps identify suspicious destinations.",
  },

  {
    question:
      "A person you do not know asks you to bypass a security procedure because they claim it is an emergency. What is the safest response?",

    options: [
      "Bypass the procedure to help them",
      "Give them your access temporarily",
      "Follow the security procedure and verify the request",
      "Ask them for another employee's password",
    ],

    answer: 2,

    explanation:
      "Social engineering uses pressure, urgency and authority to influence people. Security procedures should not be bypassed simply because someone claims there is an emergency.",
  },
];

/* =====================================================
   SHOW SCREEN
===================================================== */

function showScreen(id) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach(function (screen) {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  updateProgress();

  window.scrollTo(0, 0);
}

/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {
  const bar = document.getElementById("progressBar");

  const active = document.querySelector(".screen.active");

  if (!active) return;

  let value = 0;

  if (active.id === "home") {
    value = 0;
  } else if (active.id === "nameScreen") {
    value = 15;
  } else if (active.id === "policyScreen") {
    value = 25;
  } else if (active.id === "reasonScreen") {
    value = 35;
  } else if (active.id === "lessonScreen") {
    value = 45;
  } else if (active.id === "quizScreen") {
    value = 45 + ((currentQuestion + 1) / 5) * 45;
  } else if (active.id === "resultScreen") {
    value = 100;
  }

  bar.style.width = value + "%";
}

/* =====================================================
   START
===================================================== */

function startChallenge() {
  showScreen("nameScreen");
}

/* =====================================================
   NAME
===================================================== */

function continueName() {
  const input = document.getElementById("nameInput");

  const error = document.getElementById("nameError");

  const name = input.value.trim();

  if (name === "") {
    error.textContent = "Please enter your name.";

    return;
  }

  participantName = name;

  error.textContent = "";

  showScreen("policyScreen");
}

/* =====================================================
   ACCEPT ALL
===================================================== */

function chooseAccept() {
  policyChoice = "Accept All";

  /*
       IMPORTANT:
       We do NOT ask for a reason.
    */

  policyReason = "Not requested";

  showAcceptLesson();
}

/* =====================================================
   REVIEW
===================================================== */

function chooseReview() {
  policyChoice = "Review";

  document.getElementById("reasonInput").value = "";

  document.getElementById("charCount").textContent = "0";

  document.getElementById("reasonError").textContent = "";

  showScreen("reasonScreen");
}

/* =====================================================
   CHARACTER COUNT
===================================================== */

function updateCount() {
  const input = document.getElementById("reasonInput");

  document.getElementById("charCount").textContent = input.value.length;
}

/* =====================================================
   REVIEW REASON
===================================================== */

function submitReason() {
  const input = document.getElementById("reasonInput");

  const error = document.getElementById("reasonError");

  const reason = input.value.trim();

  if (reason === "") {
    error.textContent = "Please write your reason.";

    return;
  }

  policyReason = reason;

  error.textContent = "";

  showReviewLesson();
}

/* =====================================================
   ACCEPT LESSON
===================================================== */

function showAcceptLesson() {
  document.getElementById("lessonIcon").textContent = "⚠";

  document.getElementById("lessonTitle").textContent =
    "Good lesson to remember";

  document.getElementById("lessonText").textContent =
    "In a real workplace, accepting a security request without reviewing it can create unnecessary risk. Attackers may rely on people acting quickly. Always pause, understand what you are accepting, and verify unexpected requests before proceeding.";

  showScreen("lessonScreen");
}

/* =====================================================
   REVIEW LESSON
===================================================== */

function showReviewLesson() {
  document.getElementById("lessonIcon").textContent = "✓";

  document.getElementById("lessonTitle").textContent = "Good security habit!";

  document.getElementById("lessonText").textContent =
    "Reviewing a request before accepting it is a strong cybersecurity habit. Checking permissions, links and unexpected requests can help you identify suspicious activity before it becomes a problem.";

  showScreen("lessonScreen");
}

/* =====================================================
   START QUIZ
===================================================== */

function startQuiz() {
  currentQuestion = 0;

  selectedAnswer = -1;

  answerChecked = false;

  score = 0;

  wrong = 0;

  loadQuestion();

  showScreen("quizScreen");
}

/* =====================================================
   LOAD QUESTION
===================================================== */

function loadQuestion() {
  const question = questions[currentQuestion];

  document.getElementById("questionNumber").textContent =
    "Question " + (currentQuestion + 1);

  document.getElementById("questionCounter").textContent =
    currentQuestion + 1 + " / " + questions.length;

  document.getElementById("questionText").textContent = question.question;

  const options = document.getElementById("options");

  options.innerHTML = "";

  /*
       IMPORTANT:
       We only show options.
       Correct answer is NOT shown.
    */

  question.options.forEach(function (optionText, index) {
    const button = document.createElement("button");

    button.type = "button";

    button.className = "option";

    button.textContent = optionText;

    button.onclick = function () {
      selectAnswer(index);
    };

    options.appendChild(button);
  });

  document.getElementById("feedback").classList.add("hidden");

  document.getElementById("quizError").textContent = "";

  document.getElementById("quizButton").textContent = "Check Answer";

  selectedAnswer = -1;

  answerChecked = false;

  updateProgress();
}

/* =====================================================
   SELECT ANSWER
===================================================== */

function selectAnswer(index) {
  if (answerChecked) {
    return;
  }

  selectedAnswer = index;

  const options = document.querySelectorAll(".option");

  options.forEach(function (option, i) {
    option.classList.remove("selected");

    if (i === index) {
      option.classList.add("selected");
    }
  });
}

/* =====================================================
   QUIZ BUTTON
===================================================== */

function quizButtonClick() {
  /*
       FIRST CLICK:
       CHECK ANSWER
    */

  if (!answerChecked) {
    checkAnswer();

    return;
  }

  /*
       SECOND CLICK:
       NEXT QUESTION
    */

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;

    loadQuestion();

    updateProgress();
  } else {
    showResult();
  }
}

/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer() {
  const error = document.getElementById("quizError");

  if (selectedAnswer === -1) {
    error.textContent = "Please select an answer.";

    return;
  }

  error.textContent = "";

  const question = questions[currentQuestion];

  const correct = selectedAnswer === question.answer;

  if (correct) {
    score++;
  } else {
    wrong++;
  }

  answerChecked = true;

  /*
       Disable options
    */

  document.querySelectorAll(".option").forEach(function (button) {
    button.disabled = true;
  });

  /*
       SHOW FEEDBACK
    */

  const feedback = document.getElementById("feedback");

  const title = document.getElementById("feedbackTitle");

  if (correct) {
    title.textContent = "✓ Correct!";
  } else {
    title.textContent = "✗ Wrong answer.";
  }

  document.getElementById("correctAnswer").textContent =
    question.options[question.answer];

  document.getElementById("explanation").textContent = question.explanation;

  feedback.classList.remove("hidden");

  /*
       BUTTON TEXT
    */

  if (currentQuestion === questions.length - 1) {
    document.getElementById("quizButton").textContent = "View Final Result →";
  } else {
    document.getElementById("quizButton").textContent = "Next Question →";
  }
}

/* =====================================================
   RESULT
===================================================== */

function showResult() {
  const total = questions.length;

  const percentage = Math.round((score / total) * 100);

  let level = "";

  if (score <= 1) {
    level = "CYBER ROOKIE";
  } else if (score <= 3) {
    level = "CYBER AWARE";
  } else if (score === 4) {
    level = "CYBER DEFENDER";
  } else {
    level = "CYBER GUARDIAN";
  }

  document.getElementById("resultName").textContent = participantName;

  document.getElementById("score").textContent = score + "/5";

  document.getElementById("percentage").textContent = percentage + "%";

  document.getElementById("level").textContent = level;

  document.getElementById("correct").textContent = score;

  document.getElementById("wrong").textContent = wrong;

  document.getElementById("resultPolicy").textContent = policyChoice;

  document.getElementById("resultReason").textContent = policyReason;

  document.getElementById("saveStatus").textContent = "Saving result...";

  showScreen("resultScreen");

  saveResult(percentage, level);
}

/* =====================================================
   SAVE TO SUPABASE
===================================================== */

async function saveResult(percentage, level) {
  const status = document.getElementById("saveStatus");

  /*
       If Supabase didn't load,
       don't break the application.
    */

  if (!supabaseClient) {
    status.textContent = "Result displayed. Supabase connection unavailable.";

    return;
  }

  try {
    const result = await supabaseClient.from("challenge_results").insert([
      {
        participant_name: participantName,

        policy_choice: policyChoice,

        policy_reason: policyReason,

        score: score,

        total_questions: 5,

        percentage: percentage,

        awareness_level: level,

        correct_answers: score,

        wrong_answers: wrong,
      },
    ]);

    if (result.error) {
      throw result.error;
    }

    status.textContent = "✓ Result saved successfully.";
  } catch (error) {
    console.error("Supabase error:", error);

    status.textContent = "Result could not be saved.";
  }
}

/* =====================================================
   RESTART
===================================================== */

function restart() {
  participantName = "";

  policyChoice = "";

  policyReason = "";

  currentQuestion = 0;

  selectedAnswer = -1;

  answerChecked = false;

  score = 0;

  wrong = 0;

  document.getElementById("nameInput").value = "";

  showScreen("home");
}
