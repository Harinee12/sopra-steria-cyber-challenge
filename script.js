/* =========================================================
   SOPRA STERIA CYBERSECURITY CHALLENGE
   Participant Application
========================================================= */

/* ================= SUPABASE ================= */

const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= STATE ================= */

let participantName = "";

let policyChoice = "";

let policyReason = "";

let currentQuestion = 0;

let selectedQuizAnswer = null;

let answers = [];

const totalQuestions = 5;

/* ================= QUESTIONS ================= */

const questions = [
  {
    question:
      "You receive an email saying your account will be locked unless you click a link immediately. What should you do?",

    options: [
      "Click the link immediately",
      "Verify the sender and report the suspicious email",
      "Reply with your password",
      "Forward it to everyone",
    ],

    correct: 1,

    topic: "Phishing",

    explanation:
      "Phishing messages often create urgency to make you act without thinking. Verify the sender and use your organization's reporting process instead of clicking suspicious links.",
  },

  {
    question:
      "Someone claiming to be from IT asks you for your MFA verification code. What should you do?",

    options: [
      "Give the code if they sound genuine",
      "Send only the latest code",
      "Never share the code and verify through an official channel",
      "Ask them why they need it and then send it",
    ],

    correct: 2,

    topic: "MFA Security",

    explanation:
      "MFA codes are private authentication factors. Legitimate support personnel should not ask you to disclose your verification code.",
  },

  {
    question:
      "Which situation should make you most cautious about a website link?",

    options: [
      "The website uses HTTPS",
      "The website has a professional-looking design",
      "The website asks you to log in urgently",
      "The domain does not match the organization it claims to represent",
    ],

    correct: 3,

    topic: "URL Safety",

    explanation:
      "Always inspect the actual domain. Attackers can create convincing-looking websites that use unrelated or misleading domains.",
  },

  {
    question:
      "You find a QR code on a poster asking you to 'verify your account'. What should you do?",

    options: [
      "Scan it immediately",
      "Verify where it leads before opening it",
      "Enter your credentials after scanning",
      "Share the QR code with coworkers",
    ],

    correct: 1,

    topic: "QR Security",

    explanation:
      "QR codes can hide the destination URL. This technique is known as quishing. Check the destination before opening it and never enter sensitive credentials into an untrusted page.",
  },

  {
    question:
      "You accidentally clicked a suspicious link at work. What is the best response?",

    options: [
      "Hide it because you might get in trouble",
      "Continue using the computer normally",
      "Report it immediately through the organization's security process",
      "Delete the email and say nothing",
    ],

    correct: 2,

    topic: "Incident Reporting",

    explanation:
      "Fast reporting gives the security team a chance to investigate and reduce potential damage. Reporting an incident quickly is more important than hiding the mistake.",
  },
];

/* ================= SCREEN MANAGEMENT ================= */

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }

  updateProgress(screenId);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* ================= PROGRESS ================= */

function updateProgress(screenId) {
  const progressBar = document.getElementById("progressBar");

  const progressMap = {
    landing: 0,

    nameScreen: 15,

    policyScreen: 30,

    reasonScreen: 40,

    awarenessScreen: 50,

    quizScreen: 70,

    resultScreen: 100,
  };

  const value = progressMap[screenId] ?? 0;

  progressBar.style.width = value + "%";
}

/* ================= NAME ================= */

function continueFromName() {
  const input = document.getElementById("participantName");

  const error = document.getElementById("nameError");

  const name = input.value.trim();

  if (!name) {
    error.textContent = "Please enter your name.";

    return;
  }

  if (name.length < 2) {
    error.textContent = "Please enter at least 2 characters.";

    return;
  }

  participantName = name;

  error.textContent = "";

  showScreen("policyScreen");
}

/* ================= POLICY ================= */

function chooseAccept() {
  policyChoice = "Accept All";

  policyReason = "";

  showAcceptAwareness();
}

function chooseReview() {
  policyChoice = "Review";

  document.getElementById("decisionBadge").textContent = "REVIEW SELECTED";

  document.getElementById("reasonTitle").textContent =
    "Why did you choose Review?";

  document.getElementById("reasonInput").value = "";

  document.getElementById("charCount").textContent = "0 / 250";

  document.getElementById("reasonError").textContent = "";

  showScreen("reasonScreen");
}

/* ================= ACCEPT AWARENESS ================= */

function showAcceptAwareness() {
  document.getElementById("lessonIcon").textContent = "⚠";

  document.getElementById("awarenessTitle").textContent =
    "Oops! You chose Accept All.";

  document.getElementById("awarenessText").textContent =
    "Accepting everything immediately may feel quick and convenient, but blindly accepting security prompts can expose you to unnecessary risks.";

  document.querySelector(".fact-box p").textContent =
    "The lesson: Never automatically click Accept All. Take a moment to review what you are agreeing to, especially when permissions, privacy or security are involved.";

  showScreen("awarenessScreen");
}

/* ================= REVIEW REASON ================= */

function continueFromReason() {
  const input = document.getElementById("reasonInput");

  const error = document.getElementById("reasonError");

  const reason = input.value.trim();

  if (!reason) {
    error.textContent = "Please explain why you chose Review.";

    return;
  }

  policyReason = reason;

  error.textContent = "";

  showReviewAwareness();
}

function showReviewAwareness() {
  document.getElementById("lessonIcon").textContent = "✓";

  document.getElementById("awarenessTitle").textContent =
    "Good security instinct!";

  document.getElementById("awarenessText").textContent =
    "Choosing Review shows that you wanted to understand what you were accepting before making a decision.";

  document.querySelector(".fact-box p").textContent =
    "The lesson: Reviewing permissions, policies and security prompts before accepting them is a safer digital habit.";

  showScreen("awarenessScreen");
}

/* ================= REASON COUNTER ================= */

function updateCharacterCount() {
  const input = document.getElementById("reasonInput");

  const counter = document.getElementById("charCount");

  counter.textContent = input.value.length + " / 250";
}

/* ================= START QUIZ ================= */

function startQuiz() {
  currentQuestion = 0;

  selectedQuizAnswer = null;

  answers = [];

  renderQuestion();

  showScreen("quizScreen");
}

/* ================= RENDER QUESTION ================= */

function renderQuestion() {
  const question = questions[currentQuestion];

  selectedQuizAnswer = null;

  document.getElementById("questionTitle").textContent =
    `Question ${currentQuestion + 1}`;

  document.getElementById("questionCounter").textContent =
    `Question ${currentQuestion + 1} of ${totalQuestions}`;

  document.getElementById("questionText").textContent = question.question;

  const optionsContainer = document.getElementById("optionsContainer");

  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "option";

    button.type = "button";

    const letter = String.fromCharCode(65 + index);

    button.innerHTML = `
                <span class="option-letter">
                    ${letter}
                </span>
                ${escapeHtml(option)}
            `;

    button.addEventListener("click", () => {
      selectOption(index, button);
    });

    optionsContainer.appendChild(button);
  });

  document.getElementById("quizError").textContent = "";

  const nextButton = document.getElementById("nextQuestionBtn");

  if (currentQuestion === totalQuestions - 1) {
    nextButton.textContent = "Finish Challenge";
  } else {
    nextButton.textContent = "Next Question";
  }
}

/* ================= SELECT OPTION ================= */

function selectOption(index, button) {
  selectedQuizAnswer = index;

  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("selected");
  });

  button.classList.add("selected");

  document.getElementById("quizError").textContent = "";
}

/* ================= NEXT QUESTION ================= */

function nextQuestion() {
  if (selectedQuizAnswer === null) {
    document.getElementById("quizError").textContent =
      "Please select an answer.";

    return;
  }

  const question = questions[currentQuestion];

  answers.push({
    questionNumber: currentQuestion + 1,

    question: question.question,

    selectedAnswer: selectedQuizAnswer,

    selectedAnswerText: question.options[selectedQuizAnswer],

    correctAnswer: question.correct,

    correctAnswerText: question.options[question.correct],

    isCorrect: selectedQuizAnswer === question.correct,

    topic: question.topic,

    explanation: question.explanation,
  });

  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;

    renderQuestion();
  } else {
    finishChallenge();
  }
}

/* ================= FINISH ================= */

function finishChallenge() {
  const score = answers.filter((answer) => answer.isCorrect).length;

  const percentage = Math.round((score / totalQuestions) * 100);

  const level = getAwarenessLevel(score);

  displayResult(score, percentage, level);

  showScreen("resultScreen");

  saveResult(score, percentage, level);
}

/* ================= LEVEL ================= */

function getAwarenessLevel(score) {
  if (score === 5) {
    return "CYBER GUARDIAN";
  }

  if (score === 4) {
    return "CYBER DEFENDER";
  }

  if (score >= 2) {
    return "CYBER AWARE";
  }

  return "CYBER ROOKIE";
}

/* ================= DISPLAY RESULT ================= */

function displayResult(score, percentage, level) {
  document.getElementById("resultName").textContent = participantName;

  document.getElementById("scoreNumber").textContent =
    `${score}/${totalQuestions}`;

  document.getElementById("percentage").textContent = `${percentage}%`;

  document.getElementById("correctCount").textContent = score;

  document.getElementById("wrongCount").textContent = totalQuestions - score;

  document.getElementById("levelBadge").textContent = level;

  document.getElementById("resultDecision").textContent =
    `You selected: ${policyChoice}`;

  const reasonElement = document.getElementById("resultReason");

  if (policyChoice === "Review") {
    reasonElement.textContent = `Your reason: ${policyReason}`;
  } else {
    reasonElement.textContent = "No reason was requested for Accept All.";
  }

  renderAnswerReview();
}

/* ================= ANSWER REVIEW ================= */

function renderAnswerReview() {
  const container = document.getElementById("topicPerformance");

  container.innerHTML = "";

  answers.forEach((answer) => {
    const item = document.createElement("div");

    item.className = `answer-item ${answer.isCorrect ? "correct" : "wrong"}`;

    const status = answer.isCorrect ? "✓ CORRECT" : "✗ WRONG";

    item.innerHTML = `

            <div class="answer-status">
                ${status}
            </div>

            <div class="answer-question">
                Q${answer.questionNumber}.
                ${escapeHtml(answer.question)}
            </div>

            <div class="answer-detail">
                <strong>Your answer:</strong>
                ${escapeHtml(answer.selectedAnswerText)}
            </div>

            <div class="answer-detail">
                <strong>Correct answer:</strong>
                ${escapeHtml(answer.correctAnswerText)}
            </div>

            <div class="explanation">

                <strong>Why?</strong><br>

                ${escapeHtml(answer.explanation)}

            </div>

        `;

    container.appendChild(item);
  });
}

/* ================= SAVE RESULT ================= */

async function saveResult(score, percentage, level) {
  const saveStatus = document.getElementById("saveStatus");

  saveStatus.textContent = "Saving result...";

  try {
    const { error } = await supabaseClient.from("challenge_results").insert([
      {
        participant_name: participantName,

        policy_choice: policyChoice,

        policy_reason: policyReason || null,

        score: score,

        total_questions: totalQuestions,

        percentage: percentage,

        awareness_level: level,

        correct_answers: score,

        wrong_answers: totalQuestions - score,

        answers: answers,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);

      saveStatus.textContent = "Result could not be saved.";

      saveStatus.style.color = "#b91c1c";

      return;
    }

    saveStatus.textContent = "✓ Result saved successfully.";

    saveStatus.style.color = "#15803d";
  } catch (error) {
    console.error(error);

    saveStatus.textContent = "Result could not be saved.";

    saveStatus.style.color = "#b91c1c";
  }
}

/* ================= RESTART ================= */

function restartChallenge() {
  participantName = "";

  policyChoice = "";

  policyReason = "";

  currentQuestion = 0;

  selectedQuizAnswer = null;

  answers = [];

  document.getElementById("participantName").value = "";

  document.getElementById("reasonInput").value = "";

  document.getElementById("charCount").textContent = "0 / 250";

  showScreen("landing");
}

/* ================= SECURITY ================= */

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}

/* ================= EVENT LISTENERS ================= */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", () => {
    showScreen("nameScreen");
  });

  document
    .getElementById("nameContinueBtn")
    .addEventListener("click", continueFromName);

  document.getElementById("acceptBtn").addEventListener("click", chooseAccept);

  document.getElementById("reviewBtn").addEventListener("click", chooseReview);

  document
    .getElementById("reasonContinueBtn")
    .addEventListener("click", continueFromReason);

  document
    .getElementById("reasonInput")
    .addEventListener("input", updateCharacterCount);

  document
    .getElementById("awarenessContinueBtn")
    .addEventListener("click", startQuiz);

  document
    .getElementById("nextQuestionBtn")
    .addEventListener("click", nextQuestion);

  document
    .getElementById("restartBtn")
    .addEventListener("click", restartChallenge);
});
