document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       SUPABASE
    ===================================================== */

  const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

  const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
  );

  /* =====================================================
       STATE
    ===================================================== */

  let participantName = "";
  let policyChoice = "";
  let policyReason = "";

  let currentQuestion = 0;
  let score = 0;

  let selectedAnswer = null;
  let answerChecked = false;

  const totalQuestions = 5;

  /* =====================================================
       QUESTIONS
    ===================================================== */

  const questions = [
    {
      topic: "Phishing",

      question:
        "You receive an email saying your account will be blocked in 10 minutes unless you click a link. What should you do?",

      options: [
        "Click immediately",
        "Verify the message through an official channel",
        "Forward it to everyone",
        "Reply with your password",
      ],

      answer: 1,

      explanation:
        "Urgency is a common phishing technique. Verify the sender and the request using an official channel before clicking.",
    },

    {
      topic: "Email Security",

      question:
        "An email appears to come from your IT team and asks you to open an unexpected attachment. What is safest?",

      options: [
        "Open it immediately",
        "Download it on your personal phone",
        "Verify the request before opening the attachment",
        "Send the attachment to a friend",
      ],

      answer: 2,

      explanation:
        "Unexpected attachments can contain malicious content. Verify the sender and the reason for the attachment first.",
    },

    {
      topic: "MFA Security",

      question:
        "Someone calls claiming to be IT support and asks you to tell them your OTP. What should you do?",

      options: [
        "Give the OTP",
        "Read half of the OTP",
        "Refuse and report the suspicious request",
        "Send the OTP by email",
      ],

      answer: 2,

      explanation:
        "An OTP is a security factor. Genuine support should not ask you to reveal your authentication code.",
    },

    {
      topic: "URL Safety",

      question:
        "Before entering your password on a website, what should you check first?",

      options: [
        "The website color",
        "The URL and domain",
        "How many images it has",
        "Whether the page looks attractive",
      ],

      answer: 1,

      explanation:
        "Attackers can create convincing fake websites. Checking the URL and domain helps identify suspicious destinations.",
    },

    {
      topic: "Social Engineering",

      question:
        "A stranger asks for confidential company information and says it is an emergency. What should you do?",

      options: [
        "Share it because it is urgent",
        "Give only part of the information",
        "Verify their identity and authorization first",
        "Send it through personal email",
      ],

      answer: 2,

      explanation:
        "Social engineering often uses urgency and authority to pressure people. Verify identity and authorization before sharing information.",
    },
  ];

  /* =====================================================
       ELEMENTS
    ===================================================== */

  const screens = document.querySelectorAll(".screen");

  const startBtn = document.getElementById("startBtn");

  const participantNameInput = document.getElementById("participantName");

  const nameContinueBtn = document.getElementById("nameContinueBtn");

  const nameError = document.getElementById("nameError");

  const acceptBtn = document.getElementById("acceptBtn");

  const reviewBtn = document.getElementById("reviewBtn");

  const reasonInput = document.getElementById("reasonInput");

  const reasonContinueBtn = document.getElementById("reasonContinueBtn");

  const reasonError = document.getElementById("reasonError");

  const charCount = document.getElementById("charCount");

  const awarenessTitle = document.getElementById("awarenessTitle");

  const awarenessText = document.getElementById("awarenessText");

  const awarenessIcon = document.getElementById("awarenessIcon");

  const awarenessContinueBtn = document.getElementById("awarenessContinueBtn");

  const questionCounter = document.getElementById("questionCounter");

  const questionText = document.getElementById("questionText");

  const optionsContainer = document.getElementById("optionsContainer");

  const nextQuestionBtn = document.getElementById("nextQuestionBtn");

  const quizError = document.getElementById("quizError");

  const answerFeedback = document.getElementById("answerFeedback");

  const feedbackStatus = document.getElementById("feedbackStatus");

  const correctAnswerText = document.getElementById("correctAnswerText");

  const explanationText = document.getElementById("explanationText");

  const resultName = document.getElementById("resultName");

  const scoreNumber = document.getElementById("scoreNumber");

  const percentage = document.getElementById("percentage");

  const levelBadge = document.getElementById("levelBadge");

  const resultDecision = document.getElementById("resultDecision");

  const resultReason = document.getElementById("resultReason");

  const correctCount = document.getElementById("correctCount");

  const wrongCount = document.getElementById("wrongCount");

  const saveStatus = document.getElementById("saveStatus");

  const restartBtn = document.getElementById("restartBtn");

  const progressBar = document.getElementById("progressBar");

  const progressText = document.getElementById("progressText");

  /* =====================================================
       SCREEN NAVIGATION
    ===================================================== */

  function showScreen(id) {
    screens.forEach(function (screen) {
      screen.classList.remove("active");
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

  /* =====================================================
       PROGRESS
    ===================================================== */

  function updateProgress(screenId) {
    let progress = 0;

    if (screenId === "landing") {
      progress = 0;
    } else if (screenId === "nameScreen") {
      progress = 10;
    } else if (screenId === "policyScreen") {
      progress = 20;
    } else if (screenId === "reasonScreen") {
      progress = 30;
    } else if (screenId === "awarenessScreen") {
      progress = 40;
    } else if (screenId === "quizScreen") {
      progress = 40 + ((currentQuestion + 1) / totalQuestions) * 50;
    } else if (screenId === "resultScreen") {
      progress = 100;
    }

    progressBar.style.width = progress + "%";

    progressText.textContent = Math.round(progress) + "%";
  }

  /* =====================================================
       START
    ===================================================== */

  startBtn.addEventListener("click", function () {
    showScreen("nameScreen");

    setTimeout(function () {
      participantNameInput.focus();
    }, 300);
  });

  /* =====================================================
       NAME CONTINUE
    ===================================================== */

  nameContinueBtn.addEventListener("click", function () {
    const name = participantNameInput.value.trim();

    if (name.length < 2) {
      nameError.textContent = "Please enter your name.";

      return;
    }

    participantName = name;

    nameError.textContent = "";

    showScreen("policyScreen");
  });

  /* =====================================================
       ACCEPT ALL
    ===================================================== */

  acceptBtn.addEventListener("click", function () {
    policyChoice = "Accept All";

    /*
           IMPORTANT:
           Accept All DOES NOT ask for a reason.
        */

    policyReason = "Participant chose Accept All.";

    showAcceptLesson();
  });

  /* =====================================================
       REVIEW
    ===================================================== */

  reviewBtn.addEventListener("click", function () {
    policyChoice = "Review";

    policyReason = "";

    reasonInput.value = "";

    charCount.textContent = "0";

    reasonError.textContent = "";

    showScreen("reasonScreen");
  });

  /* =====================================================
       REASON COUNTER
    ===================================================== */

  reasonInput.addEventListener("input", function () {
    charCount.textContent = reasonInput.value.length;
  });

  /* =====================================================
       REVIEW REASON CONTINUE
    ===================================================== */

  reasonContinueBtn.addEventListener("click", function () {
    const reason = reasonInput.value.trim();

    if (reason.length < 3) {
      reasonError.textContent = "Please enter a short reason.";

      return;
    }

    policyReason = reason;

    reasonError.textContent = "";

    showReviewLesson();
  });

  /* =====================================================
       ACCEPT LESSON
    ===================================================== */

  function showAcceptLesson() {
    awarenessIcon.textContent = "⚠️";

    awarenessTitle.textContent = "You chose Accept All";

    awarenessText.innerHTML = `

            <div class="lesson-point">
                📋 <strong>Accepting without reading can be risky.</strong>
                Security policies may contain important information about
                privacy, permissions and access.
            </div>

            <div class="lesson-point">
                🔍 <strong>Always pause and review.</strong>
                Take a few seconds to understand what you are accepting.
            </div>

            <div class="lesson-point">
                🚨 <strong>Attackers take advantage of quick decisions.</strong>
                Urgent messages and confusing prompts can encourage people
                to click or accept without checking.
            </div>

            <div class="lesson-point">
                🛡️ <strong>The better habit:</strong>
                Read → Verify → Decide.
            </div>

            <div class="lesson-point">
                😊 <strong>Don't worry!</strong>
                This challenge is designed to teach you, not to judge you.
            </div>

        `;

    showScreen("awarenessScreen");
  }

  /* =====================================================
       REVIEW LESSON
    ===================================================== */

  function showReviewLesson() {
    awarenessIcon.textContent = "🛡️";

    awarenessTitle.textContent = "Good security habit!";

    awarenessText.innerHTML = `

            <div class="lesson-point">
                🔍 <strong>Reviewing before accepting is a safer habit.</strong>
                It gives you a chance to understand what you are agreeing to.
            </div>

            <div class="lesson-point">
                👀 <strong>Look for unexpected permissions.</strong>
                Check what access an application, website or policy is requesting.
            </div>

            <div class="lesson-point">
                🔐 <strong>Protect your information.</strong>
                Never approve something just because a message tells you
                to do it quickly.
            </div>

            <div class="lesson-point">
                🧠 <strong>Think before you click.</strong>
                A few seconds of verification can prevent a security incident.
            </div>

            <div class="lesson-point">
                ✅ <strong>Your rule:</strong>
                Review first. Accept only when you understand it.
            </div>

        `;

    showScreen("awarenessScreen");
  }

  /* =====================================================
       START QUIZ
    ===================================================== */

  awarenessContinueBtn.addEventListener("click", function () {
    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;

    answerChecked = false;

    loadQuestion();
  });

  /* =====================================================
       LOAD QUESTION
    ===================================================== */

  function loadQuestion() {
    const q = questions[currentQuestion];

    questionCounter.textContent =
      "Question " + (currentQuestion + 1) + " of " + totalQuestions;

    questionText.textContent = q.question;

    optionsContainer.innerHTML = "";

    selectedAnswer = null;

    answerChecked = false;

    quizError.textContent = "";

    answerFeedback.className = "answer-feedback hidden";

    nextQuestionBtn.textContent = "Check Answer";

    q.options.forEach(function (option, index) {
      const button = document.createElement("button");

      button.className = "option-btn";

      button.textContent = option;

      button.type = "button";

      button.addEventListener("click", function () {
        if (answerChecked) {
          return;
        }

        document.querySelectorAll(".option-btn").forEach(function (btn) {
          btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedAnswer = index;

        quizError.textContent = "";
      });

      optionsContainer.appendChild(button);
    });

    showScreen("quizScreen");
  }

  /* =====================================================
       CHECK ANSWER
    ===================================================== */

  nextQuestionBtn.addEventListener("click", function () {
    /*
           FIRST CLICK = CHECK ANSWER
           SECOND CLICK = NEXT QUESTION
        */

    if (!answerChecked) {
      if (selectedAnswer === null) {
        quizError.textContent = "Please select an answer.";

        return;
      }

      checkAnswer();

      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      currentQuestion++;

      loadQuestion();
    } else {
      showResult();
    }
  });

  /* =====================================================
       CHECK ANSWER + EXPLANATION
    ===================================================== */

  function checkAnswer() {
    const q = questions[currentQuestion];

    answerChecked = true;

    const isCorrect = selectedAnswer === q.answer;

    if (isCorrect) {
      score++;

      answerFeedback.className = "answer-feedback correct";

      feedbackStatus.textContent = "✓ Correct!";
    } else {
      answerFeedback.className = "answer-feedback incorrect";

      feedbackStatus.textContent = "✗ Incorrect";
    }

    correctAnswerText.textContent = q.options[q.answer];

    explanationText.textContent = q.explanation;

    answerFeedback.classList.remove("hidden");

    document.querySelectorAll(".option-btn").forEach(function (btn) {
      btn.classList.add("disabled");
    });

    nextQuestionBtn.textContent =
      currentQuestion === totalQuestions - 1
        ? "View Final Score"
        : "Next Question →";
  }

  /* =====================================================
       RESULT
    ===================================================== */

  function showResult() {
    const percent = Math.round((score / totalQuestions) * 100);

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

    resultName.textContent = participantName;

    scoreNumber.textContent = score + "/" + totalQuestions;

    percentage.textContent = percent + "%";

    levelBadge.textContent = level;

    resultDecision.textContent = policyChoice;

    if (policyChoice === "Accept All") {
      resultReason.textContent =
        "You chose Accept All. The lesson showed why reviewing security prompts is important.";
    } else {
      resultReason.textContent = policyReason;
    }

    correctCount.textContent = score;

    wrongCount.textContent = totalQuestions - score;

    saveStatus.textContent = "Saving result...";

    showScreen("resultScreen");

    saveResult(percent, level);
  }

  /* =====================================================
       SAVE TO SUPABASE
    ===================================================== */

  async function saveResult(percent, level) {
    /*
           Topic score fields use the existing table.
        */

    const topicScores = {
      policy_awareness: 0,
      phishing: 0,
      email_security: 0,
      url_safety: 0,
      mfa_security: 0,
      social_engineering: 0,
    };

    /*
           We cannot reconstruct individual answers
           after the quiz unless we store them.
           So score is stored as the main result.
        */

    const resultData = {
      participant_name: participantName,

      policy_choice: policyChoice,

      policy_reason: policyReason,

      score: score,

      total_questions: totalQuestions,

      percentage: percent,

      awareness_level: level,

      correct_answers: score,

      wrong_answers: totalQuestions - score,

      policy_awareness: topicScores.policy_awareness,

      phishing: topicScores.phishing,

      email_security: topicScores.email_security,

      url_safety: topicScores.url_safety,

      mfa_security: topicScores.mfa_security,

      qr_security: 0,

      password_security: 0,

      social_engineering: topicScores.social_engineering,

      attachment_safety: 0,

      public_wifi: 0,

      incident_reporting: 0,

      ai_phishing: 0,
    };

    try {
      const { error } = await supabaseClient
        .from("challenge_results")
        .insert([resultData]);

      if (error) {
        console.error("Supabase error:", error);

        saveStatus.textContent = "Result could not be saved.";

        return;
      }

      saveStatus.textContent = "✓ Result saved successfully.";
    } catch (error) {
      console.error("Unexpected error:", error);

      saveStatus.textContent = "Result could not be saved.";
    }
  }

  /* =====================================================
       RESTART
    ===================================================== */

  restartBtn.addEventListener("click", function () {
    participantName = "";

    policyChoice = "";

    policyReason = "";

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;

    answerChecked = false;

    participantNameInput.value = "";

    reasonInput.value = "";

    showScreen("landing");
  });

  /* =====================================================
       INITIAL STATE
    ===================================================== */

  showScreen("landing");
});
