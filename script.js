/* =========================================================
   SOPRA STERIA CYBERSECURITY CHALLENGE
   PARTICIPANT APPLICATION
========================================================= */

/* ================= SUPABASE ================= */

const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= STATE ================= */

let participantName = "";
let policyChoice = "";
let policyReason = "";

let currentScenario = 0;
let currentQuestion = 0;

let selectedQuizAnswer = null;

let answers = [];

const totalQuestions = 12;

/* ================= QUESTIONS ================= */

const questions = [
  {
    topic: "Policy Awareness",
    question:
      "What should you do before accepting a security policy or permission request?",
    options: [
      "Accept immediately",
      "Review what access or information is being requested",
      "Ignore it",
      "Share it with everyone",
    ],
    answer: 1,
  },

  {
    topic: "Phishing",
    question:
      "An email says your account will be suspended unless you verify it immediately. What is the safest response?",
    options: [
      "Click the link immediately",
      "Reply with your password",
      "Verify through an official channel",
      "Forward it to friends",
    ],
    answer: 2,
  },

  {
    topic: "Email Security",
    question:
      "What should you inspect first when receiving an unexpected email?",
    options: [
      "Font",
      "Logo",
      "Actual sender address and domain",
      "Email color",
    ],
    answer: 2,
  },

  {
    topic: "URL Safety",
    question: "Which is the safest way to handle a suspicious link?",
    options: [
      "Click it to check",
      "Hover/check the destination and verify independently",
      "Send it to someone else",
      "Enter your password",
    ],
    answer: 1,
  },

  {
    topic: "MFA Security",
    question:
      "Someone claiming to be IT asks for your MFA verification code. What should you do?",
    options: [
      "Share it",
      "Share half of it",
      "Refuse and verify through an official channel",
      "Give your password instead",
    ],
    answer: 2,
  },

  {
    topic: "QR Security",
    question:
      "What is a good practice before scanning a QR code from an unexpected source?",
    options: [
      "Scan immediately",
      "Verify where the QR code leads",
      "Disable security software",
      "Share the QR code publicly",
    ],
    answer: 1,
  },

  {
    topic: "Password Security",
    question: "Which password practice is safest?",
    options: [
      "Reuse one password everywhere",
      "Use unique strong passwords",
      "Write your password on your desk",
      "Share your password with colleagues",
    ],
    answer: 1,
  },

  {
    topic: "Social Engineering",
    question:
      "A caller pressures you to reveal confidential information. What should you do?",
    options: [
      "Provide the information",
      "Provide partial information",
      "Refuse and verify the person's identity independently",
      "Ask them to call again later",
    ],
    answer: 2,
  },

  {
    topic: "Attachment Safety",
    question:
      "You receive an unexpected attachment from an unknown sender. What should you do?",
    options: [
      "Open it immediately",
      "Download and run it",
      "Verify the sender before opening",
      "Forward it to colleagues",
    ],
    answer: 2,
  },

  {
    topic: "Public Wi-Fi",
    question: "When using public Wi-Fi for work, what is the safest approach?",
    options: [
      "Use it without protection",
      "Use approved security controls such as VPN where required",
      "Disable device security",
      "Share sensitive files freely",
    ],
    answer: 1,
  },

  {
    topic: "Incident Reporting",
    question: "You accidentally clicked a suspicious link. What should you do?",
    options: [
      "Hide it",
      "Continue working normally",
      "Report it promptly through the approved security channel",
      "Delete all evidence",
    ],
    answer: 2,
  },

  {
    topic: "AI Phishing",
    question:
      "Why can AI-generated phishing messages be difficult to identify?",
    options: [
      "They cannot contain mistakes",
      "They may look polished and convincing",
      "AI cannot create emails",
      "They are always safe",
    ],
    answer: 1,
  },
];

/* ================= SCENARIOS ================= */

const scenarios = [
  {
    title: "URGENT SECURITY ALERT",

    content: `
            <p class="large-text">
                Your corporate account requires immediate verification.
            </p>

            <div class="scenario-email">

                <div class="email-header">
                    From: Security Support<br>
                    Subject: Urgent Account Verification
                </div>

                <div class="email-body">

                    <h3>
                        Your account may be temporarily restricted.
                    </h3>

                    <p>
                        Please verify your account immediately
                        to avoid interruption.
                    </p>

                    <div class="fake-button">
                        Verify Account
                    </div>

                </div>

            </div>

            <div class="scenario-question">
                What should you notice?
            </div>

            <div class="scenario-options">

                <button class="scenario-option">
                    Urgency
                </button>

                <button class="scenario-option">
                    Fear of account suspension
                </button>

                <button class="scenario-option">
                    Unexpected verification
                </button>

                <button class="scenario-option">
                    Suspicious request
                </button>

            </div>

            <div class="warning-box">
                This is a controlled phishing simulation.
                Never enter real credentials into unexpected
                verification pages.
            </div>
        `,
  },

  {
    title: "WOULD YOU TRUST THIS EMAIL?",

    content: `
            <div class="scenario-email">

                <div class="email-header">
                    From:
                    IT Support
                    &lt;support@secure-verification.example&gt;
                    <br>

                    Subject:
                    MFA Verification Required
                </div>

                <div class="email-body">

                    <p>
                        Your account requires security verification.
                    </p>

                    <p>
                        Please confirm your settings immediately.
                    </p>

                </div>

            </div>

            <div class="scenario-question">
                What should you inspect first?
            </div>

            <div class="scenario-options">

                <button class="scenario-option">
                    A. Display name
                </button>

                <button class="scenario-option">
                    B. Actual sender address
                </button>

                <button class="scenario-option">
                    C. Font
                </button>

                <button class="scenario-option">
                    D. Logo
                </button>

            </div>

            <div class="simulation-note">
                Always inspect the actual sender address
                and domain.
            </div>
        `,
  },

  {
    title: "SOMEONE CALLS CLAIMING TO BE IT.",

    content: `
            <p class="large-text">
                "We're troubleshooting your account.
                Please tell me the verification code
                you just received."
            </p>

            <div class="scenario-options">

                <button class="scenario-option">
                    A. Share the code
                </button>

                <button class="scenario-option">
                    B. Share part of the code
                </button>

                <button class="scenario-option">
                    C. Refuse and verify through an official channel
                </button>

                <button class="scenario-option">
                    D. Give your password instead
                </button>

            </div>

            <div class="simulation-note">
                MFA codes and passwords should never be shared
                simply because someone claims to be from IT.
            </div>
        `,
  },
];

/* ================= SCREEN NAVIGATION ================= */

const screens = [
  "landing",
  "nameScreen",
  "policyScreen",
  "reasonScreen",
  "awarenessScreen",
  "scenarioScreen",
  "quizScreen",
  "resultScreen",
];

function showScreen(id) {
  screens.forEach((screenId) => {
    const element = document.getElementById(screenId);

    if (element) {
      element.classList.remove("active");
    }
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  updateProgress(id);
}

/* ================= PROGRESS ================= */

function updateProgress(screenId) {
  const progressMap = {
    landing: [0, "Welcome"],

    nameScreen: [12, "Participant"],

    policyScreen: [25, "Security Policy"],

    reasonScreen: [35, "Your Decision"],

    awarenessScreen: [45, "Awareness"],

    scenarioScreen: [60, "Scenarios"],

    quizScreen: [80, "Knowledge Check"],

    resultScreen: [100, "Final Result"],
  };

  const data = progressMap[screenId] || [0, "Welcome"];

  document.getElementById("progressBar").style.width = data[0] + "%";

  document.getElementById("progressPercent").textContent = data[0] + "%";

  document.getElementById("progressText").textContent = data[1];
}

/* ================= NAME ================= */

function continueFromName() {
  const input = document.getElementById("participantName");

  const error = document.getElementById("nameError");

  const name = input.value.trim();

  if (!name) {
    error.textContent = "Please enter your name.";

    input.focus();

    return;
  }

  if (name.length < 2) {
    error.textContent = "Please enter a valid name.";

    input.focus();

    return;
  }

  error.textContent = "";

  participantName = name;

  showScreen("policyScreen");
}

/* ================= POLICY ================= */

function choosePolicy(choice) {
  policyChoice = choice;

  const badge = document.getElementById("decisionBadge");

  const title = document.getElementById("reasonTitle");

  badge.textContent = choice === "Accept All" ? "ACCEPT ALL" : "REVIEW POLICY";

  title.textContent =
    choice === "Accept All"
      ? "Why did you choose 'Accept All'?"
      : "Why did you choose 'Review'?";

  showScreen("reasonScreen");

  document.getElementById("reasonInput").focus();
}

/* ================= REASON ================= */

function continueFromReason() {
  const input = document.getElementById("reasonInput");

  const error = document.getElementById("reasonError");

  const reason = input.value.trim();

  if (!reason) {
    error.textContent = "Please explain your choice.";

    input.focus();

    return;
  }

  error.textContent = "";

  policyReason = reason;

  const title = document.getElementById("awarenessTitle");

  const text = document.getElementById("awarenessText");

  if (policyChoice === "Accept All") {
    title.textContent = "Pause before you accept.";

    text.textContent =
      "Accepting requests without checking them can create security risks. The goal is not to blame the decision, but to build the habit of pausing, reviewing and verifying unexpected requests.";
  } else {
    title.textContent = "Good security starts with verification.";

    text.textContent =
      "Reviewing a policy before accepting it is a useful security habit. Taking a moment to understand what you are agreeing to can help prevent unnecessary access and information exposure.";
  }

  showScreen("awarenessScreen");
}

/* ================= SCENARIOS ================= */

function loadScenario() {
  const scenario = scenarios[currentScenario];

  document.getElementById("scenarioNumber").textContent =
    `SECURITY SCENARIO ${currentScenario + 1} / ${scenarios.length}`;

  document.getElementById("scenarioContent").innerHTML = `
        <h1>${scenario.title}</h1>
        ${scenario.content}
    `;

  const buttons = document.querySelectorAll(".scenario-option");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("selected"));

      this.classList.add("selected");
    });
  });
}

function startScenarios() {
  currentScenario = 0;

  loadScenario();

  showScreen("scenarioScreen");
}

function nextScenario() {
  if (currentScenario < scenarios.length - 1) {
    currentScenario++;

    loadScenario();

    return;
  }

  currentQuestion = 0;

  answers = [];

  selectedQuizAnswer = null;

  loadQuestion();

  showScreen("quizScreen");
}

/* ================= QUIZ ================= */

function loadQuestion() {
  const question = questions[currentQuestion];

  selectedQuizAnswer = null;

  document.getElementById("questionTitle").textContent =
    `Question ${currentQuestion + 1}`;

  document.getElementById("questionCounter").textContent =
    `${currentQuestion + 1} / ${totalQuestions}`;

  document.getElementById("questionText").textContent = question.question;

  const container = document.getElementById("optionsContainer");

  container.innerHTML = "";

  document.getElementById("quizError").textContent = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "quiz-option";

    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".quiz-option")
        .forEach((btn) => btn.classList.remove("selected"));

      button.classList.add("selected");

      selectedQuizAnswer = index;
    });

    container.appendChild(button);
  });

  const nextButton = document.getElementById("nextQuestionBtn");

  nextButton.textContent =
    currentQuestion === totalQuestions - 1
      ? "Finish Challenge"
      : "Next Question →";
}

function nextQuestion() {
  if (selectedQuizAnswer === null) {
    document.getElementById("quizError").textContent =
      "Please select an answer.";

    return;
  }

  answers[currentQuestion] = selectedQuizAnswer;

  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;

    loadQuestion();
  } else {
    calculateResult();
  }
}

/* ================= RESULT ================= */

function getLevel(score) {
  if (score <= 4) {
    return "CYBER ROOKIE";
  }

  if (score <= 7) {
    return "CYBER AWARE";
  }

  if (score <= 10) {
    return "CYBER DEFENDER";
  }

  return "CYBER GUARDIAN";
}

function calculateResult() {
  let score = 0;

  const topicScores = {};

  questions.forEach((question, index) => {
    topicScores[question.topic] = {
      correct: 0,
      total: 1,
    };

    if (answers[index] === question.answer) {
      score++;

      topicScores[question.topic].correct = 1;
    }
  });

  const percentage = Math.round((score / totalQuestions) * 100);

  const wrong = totalQuestions - score;

  const level = getLevel(score);

  document.getElementById("resultName").textContent = participantName;

  document.getElementById("scoreNumber").textContent = score;

  document.getElementById("percentage").textContent = percentage + "%";

  document.getElementById("levelBadge").textContent = level;

  document.getElementById("resultDecision").textContent = policyChoice;

  document.getElementById("resultReason").textContent = policyReason;

  document.getElementById("correctCount").textContent = score;

  document.getElementById("wrongCount").textContent = wrong;

  renderTopics(topicScores);

  showScreen("resultScreen");

  saveResult(score, percentage, level, topicScores);
}

/* ================= TOPICS ================= */

function renderTopics(topicScores) {
  const container = document.getElementById("topicPerformance");

  container.innerHTML = "";

  Object.entries(topicScores).forEach(([topic, data]) => {
    const percent = data.correct * 100;

    const row = document.createElement("div");

    row.className = "topic-row";

    row.innerHTML = `

                    <div class="topic-info">

                        <span>
                            ${topic}
                        </span>

                        <span>
                            ${data.correct}/${data.total}
                        </span>

                    </div>

                    <div class="topic-bar">

                        <div
                            class="topic-fill"
                            style="width:${percent}%"
                        ></div>

                    </div>

                `;

    container.appendChild(row);
  });
}

/* ================= SAVE RESULT ================= */

async function saveResult(score, percentage, level, topicScores) {
  const saveStatus = document.getElementById("saveStatus");

  saveStatus.className = "save-status";

  saveStatus.textContent = "Saving result...";

  const row = {
    participant_name: participantName,

    policy_choice: policyChoice,

    policy_reason: policyReason,

    score: score,

    total_questions: totalQuestions,

    percentage: percentage,

    awareness_level: level,

    correct_answers: score,

    wrong_answers: totalQuestions - score,

    policy_awareness: topicScores["Policy Awareness"]?.correct || 0,

    phishing: topicScores["Phishing"]?.correct || 0,

    email_security: topicScores["Email Security"]?.correct || 0,

    url_safety: topicScores["URL Safety"]?.correct || 0,

    mfa_security: topicScores["MFA Security"]?.correct || 0,

    qr_security: topicScores["QR Security"]?.correct || 0,

    password_security: topicScores["Password Security"]?.correct || 0,

    social_engineering: topicScores["Social Engineering"]?.correct || 0,

    attachment_safety: topicScores["Attachment Safety"]?.correct || 0,

    public_wifi: topicScores["Public Wi-Fi"]?.correct || 0,

    incident_reporting: topicScores["Incident Reporting"]?.correct || 0,

    ai_phishing: topicScores["AI Phishing"]?.correct || 0,
  };

  try {
    const { error } = await supabaseClient
      .from("challenge_results")
      .insert([row]);

    if (error) {
      throw error;
    }

    saveStatus.className = "save-status success";

    saveStatus.textContent = "✓ Result saved successfully.";
  } catch (error) {
    console.error("Supabase save error:", error);

    saveStatus.className = "save-status failed";

    saveStatus.textContent =
      "Result could not be saved. Check Supabase configuration and RLS policies.";
  }
}

/* ================= RESTART ================= */

function restartChallenge() {
  participantName = "";
  policyChoice = "";
  policyReason = "";

  currentScenario = 0;
  currentQuestion = 0;

  selectedQuizAnswer = null;

  answers = [];

  document.getElementById("participantName").value = "";

  document.getElementById("reasonInput").value = "";

  document.getElementById("charCount").textContent = "0";

  showScreen("landing");
}

/* ================= EVENT LISTENERS ================= */

document.addEventListener("DOMContentLoaded", function () {
  /* START */

  document.getElementById("startBtn").addEventListener("click", () => {
    showScreen("nameScreen");

    setTimeout(() => {
      document.getElementById("participantName").focus();
    }, 200);
  });

  /* NAME */

  document
    .getElementById("nameContinueBtn")
    .addEventListener("click", continueFromName);

  document
    .getElementById("participantName")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        continueFromName();
      }
    });

  /* POLICY */

  document
    .getElementById("reviewBtn")
    .addEventListener("click", () => choosePolicy("Review"));

  document
    .getElementById("acceptBtn")
    .addEventListener("click", () => choosePolicy("Accept All"));

  /* REASON */

  document
    .getElementById("reasonContinueBtn")
    .addEventListener("click", continueFromReason);

  document.getElementById("reasonInput").addEventListener("input", function () {
    document.getElementById("charCount").textContent = this.value.length;
  });

  /* AWARENESS */

  document
    .getElementById("awarenessContinueBtn")
    .addEventListener("click", startScenarios);

  /* SCENARIO */

  document
    .getElementById("scenarioContinueBtn")
    .addEventListener("click", nextScenario);

  /* QUIZ */

  document
    .getElementById("nextQuestionBtn")
    .addEventListener("click", nextQuestion);

  /* RESTART */

  document
    .getElementById("restartBtn")
    .addEventListener("click", restartChallenge);

  updateProgress("landing");
});
