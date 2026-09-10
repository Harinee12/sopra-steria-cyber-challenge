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
       QUESTIONS / ANSWER KEY
    ===================================================== */

  const questions = [
    {
      topic: "Phishing",

      question:
        "You receive an email saying your account will be blocked in 10 minutes unless you click a link.",

      answer: "Verify the message through an official channel.",

      explanation:
        "Urgency is commonly used in phishing. Verify the sender and request before clicking.",
    },

    {
      topic: "Email Security",

      question:
        "An email appears to come from IT and asks you to open an unexpected attachment.",

      answer: "Verify the request before opening the attachment.",

      explanation:
        "Unexpected attachments may contain malicious content. Verify the sender and purpose first.",
    },

    {
      topic: "MFA Security",

      question: "Someone claiming to be IT support asks for your OTP.",

      answer: "Refuse and report the suspicious request.",

      explanation:
        "Authentication codes are private security factors and should never be shared.",
    },

    {
      topic: "URL Safety",

      question:
        "Before entering your password on a website, what should you check?",

      answer: "The URL and domain.",

      explanation:
        "Fake websites can look legitimate. Checking the domain helps identify suspicious websites.",
    },

    {
      topic: "Social Engineering",

      question:
        "A stranger asks for confidential company information and says it is an emergency.",

      answer: "Verify their identity and authorization first.",

      explanation:
        "Attackers may use urgency and authority to manipulate people into revealing information.",
    },
  ];

  /* =====================================================
       ELEMENTS
    ===================================================== */

  const totalParticipants = document.getElementById("totalParticipants");

  const averageScore = document.getElementById("averageScore");

  const highestScore = document.getElementById("highestScore");

  const guardianCount = document.getElementById("guardianCount");

  const rookieCount = document.getElementById("rookieCount");

  const awareCount = document.getElementById("awareCount");

  const defenderCount = document.getElementById("defenderCount");

  const guardianLevelCount = document.getElementById("guardianLevelCount");

  const resultsBody = document.getElementById("resultsBody");

  const recordCount = document.getElementById("recordCount");

  const searchInput = document.getElementById("searchInput");

  const refreshBtn = document.getElementById("refreshBtn");

  const downloadBtn = document.getElementById("downloadBtn");

  const answerKey = document.getElementById("answerKey");

  let allResults = [];

  /* =====================================================
       LOAD RESULTS
    ===================================================== */

  async function loadResults() {
    resultsBody.innerHTML = `
            <tr>
                <td colspan="9">
                    Loading results...
                </td>
            </tr>
        `;

    const { data, error } = await supabaseClient
      .from("challenge_results")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      resultsBody.innerHTML = `
                <tr>
                    <td colspan="9">
                        Could not load results.
                    </td>
                </tr>
            `;

      return;
    }

    allResults = data || [];

    updateDashboard(allResults);

    renderTable(allResults);
  }

  /* =====================================================
       DASHBOARD
    ===================================================== */

  function updateDashboard(results) {
    totalParticipants.textContent = results.length;

    if (results.length === 0) {
      averageScore.textContent = "0%";

      highestScore.textContent = "0/5";

      guardianCount.textContent = "0";

      rookieCount.textContent = "0";

      awareCount.textContent = "0";

      defenderCount.textContent = "0";

      guardianLevelCount.textContent = "0";

      return;
    }

    const percentages = results.map(function (r) {
      return Number(r.percentage || 0);
    });

    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;

    averageScore.textContent = Math.round(average) + "%";

    const highest = Math.max.apply(
      null,
      results.map(function (r) {
        return Number(r.score || 0);
      }),
    );

    highestScore.textContent = highest + "/5";

    const guardians = results.filter(function (r) {
      return r.awareness_level === "CYBER GUARDIAN";
    }).length;

    guardianCount.textContent = guardians;

    rookieCount.textContent = results.filter(function (r) {
      return r.awareness_level === "CYBER ROOKIE";
    }).length;

    awareCount.textContent = results.filter(function (r) {
      return r.awareness_level === "CYBER AWARE";
    }).length;

    defenderCount.textContent = results.filter(function (r) {
      return r.awareness_level === "CYBER DEFENDER";
    }).length;

    guardianLevelCount.textContent = results.filter(function (r) {
      return r.awareness_level === "CYBER GUARDIAN";
    }).length;
  }

  /* =====================================================
       TABLE
    ===================================================== */

  function renderTable(results) {
    recordCount.textContent =
      results.length + " record" + (results.length === 1 ? "" : "s");

    if (results.length === 0) {
      resultsBody.innerHTML = `
                <tr>
                    <td colspan="9">
                        No results found.
                    </td>
                </tr>
            `;

      return;
    }

    resultsBody.innerHTML = "";

    results.forEach(function (result, index) {
      const row = document.createElement("tr");

      const date = result.created_at
        ? new Date(result.created_at).toLocaleString()
        : "-";

      row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <strong>
                        ${escapeHtml(result.participant_name || "")}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(result.policy_choice || "")}
                </td>

                <td>
                    ${result.score || 0}/${result.total_questions || 5}
                </td>

                <td>
                    ${result.percentage || 0}%
                </td>

                <td>
                    <span class="level-badge">
                        ${escapeHtml(result.awareness_level || "")}
                    </span>
                </td>

                <td>
                    ${result.correct_answers || 0}
                </td>

                <td>
                    ${result.wrong_answers || 0}
                </td>

                <td>
                    ${escapeHtml(date)}
                </td>
            `;

      resultsBody.appendChild(row);
    });
  }

  /* =====================================================
       SEARCH
    ===================================================== */

  searchInput.addEventListener("input", function () {
    const term = searchInput.value.trim().toLowerCase();

    const filtered = allResults.filter(function (result) {
      return (result.participant_name || "").toLowerCase().includes(term);
    });

    updateDashboard(filtered);

    renderTable(filtered);
  });

  /* =====================================================
       CSV
    ===================================================== */

  downloadBtn.addEventListener("click", function () {
    if (allResults.length === 0) {
      alert("There are no results to download.");

      return;
    }

    const headers = [
      "Participant Name",
      "Policy Choice",
      "Policy Reason",
      "Score",
      "Total Questions",
      "Percentage",
      "Awareness Level",
      "Correct Answers",
      "Wrong Answers",
      "Created At",
    ];

    const rows = allResults.map(function (r) {
      return [
        r.participant_name,

        r.policy_choice,

        r.policy_reason,

        r.score,

        r.total_questions,

        r.percentage,

        r.awareness_level,

        r.correct_answers,

        r.wrong_answers,

        r.created_at,
      ];
    });

    let csv = headers.join(",") + "\n";

    rows.forEach(function (row) {
      csv += row.map(csvEscape).join(",") + "\n";
    });

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "cybersecurity-results.csv";

    link.click();

    URL.revokeObjectURL(url);
  });

  /* =====================================================
       ANSWER KEY
    ===================================================== */

  function renderAnswerKey() {
    answerKey.innerHTML = "";

    questions.forEach(function (q, index) {
      const div = document.createElement("div");

      div.className = "answer-item";

      div.innerHTML = `

                    <div class="answer-question">

                        Q${index + 1}.
                        ${escapeHtml(q.question)}

                    </div>

                    <div class="answer-correct">

                        Correct Answer:
                        ${escapeHtml(q.answer)}

                    </div>

                    <div class="answer-explanation">

                        Explanation:
                        ${escapeHtml(q.explanation)}

                    </div>
                `;

      answerKey.appendChild(div);
    });
  }

  /* =====================================================
       REFRESH
    ===================================================== */

  refreshBtn.addEventListener("click", function () {
    loadResults();
  });

  /* =====================================================
       SECURITY HELPERS
    ===================================================== */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function csvEscape(value) {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value).replace(/"/g, '""');

    return `"${stringValue}"`;
  }

  /* =====================================================
       INITIAL LOAD
    ===================================================== */

  renderAnswerKey();

  loadResults();
});
