/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allResults = [];

/* =====================================================
   ANSWER KEY
===================================================== */

const answerKey = [
  {
    topic: "PHISHING",

    question:
      "You receive an unexpected email saying your account will be locked in 10 minutes. It asks you to click a link immediately. What should you do?",

    answer:
      "Ignore the urgency and verify the message through an official channel",

    explanation:
      "Phishing messages often create urgency so people act without thinking. Verify unexpected requests through a trusted official channel before clicking.",
  },

  {
    topic: "PASSWORD SECURITY",

    question: "Which is the safest password practice?",

    answer: "Use a strong unique password for each important account",

    explanation:
      "Strong and unique passwords reduce the impact if one account is compromised.",
  },

  {
    topic: "MFA SECURITY",

    question:
      "Someone calls pretending to be IT support and asks you to read out the OTP sent to your phone. What should you do?",

    answer: "Do not share the OTP and verify the caller independently",

    explanation:
      "An OTP is a security verification code. Never share it with another person, even if they claim to be from IT support.",
  },

  {
    topic: "URL SAFETY",

    question:
      "Before entering information on a website, what should you check first?",

    answer:
      "The website address and whether it is the expected legitimate domain",

    explanation:
      "Fake websites can look almost identical to legitimate websites. Checking the address and domain helps identify suspicious destinations.",
  },

  {
    topic: "SOCIAL ENGINEERING",

    question:
      "A person you do not know asks you to bypass a security procedure because they claim it is an emergency. What is the safest response?",

    answer: "Follow the security procedure and verify the request",

    explanation:
      "Social engineering uses pressure, urgency and authority to influence people. Security procedures should not be bypassed simply because someone claims there is an emergency.",
  },
];

/* =====================================================
   LOAD RESULTS
===================================================== */

async function loadResults() {
  const body = document.getElementById("results");

  body.innerHTML = `
        <tr>
            <td colspan="10">
                Loading...
            </td>
        </tr>
    `;

  try {
    const response = await supabaseClient
      .from("challenge_results")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (response.error) {
      throw response.error;
    }

    allResults = response.data || [];

    updateStats();

    renderResults(allResults);
  } catch (error) {
    console.error(error);

    body.innerHTML = `
            <tr>
                <td colspan="10">
                    Error loading results.
                </td>
            </tr>
        `;
  }
}

/* =====================================================
   STATS
===================================================== */

function updateStats() {
  const total = allResults.length;

  document.getElementById("total").textContent = total;

  if (total === 0) {
    document.getElementById("average").textContent = "0%";

    document.getElementById("highest").textContent = "0/5";
  } else {
    const avg =
      allResults.reduce(function (sum, row) {
        return sum + Number(row.percentage || 0);
      }, 0) / total;

    const highest = Math.max(
      ...allResults.map(function (row) {
        return Number(row.score || 0);
      }),
    );

    document.getElementById("average").textContent = Math.round(avg) + "%";

    document.getElementById("highest").textContent = highest + "/5";
  }

  const guardians = allResults.filter(function (row) {
    return row.awareness_level === "CYBER GUARDIAN";
  }).length;

  document.getElementById("guardians").textContent = guardians;
}

/* =====================================================
   RENDER
===================================================== */

function renderResults(results) {
  const body = document.getElementById("results");

  if (results.length === 0) {
    body.innerHTML = `
            <tr>
                <td colspan="10">
                    No participant results yet.
                </td>
            </tr>
        `;

    return;
  }

  body.innerHTML = results
    .map(function (row, index) {
      const date = row.created_at
        ? new Date(row.created_at).toLocaleString()
        : "-";

      return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${safe(row.participant_name)}
                            </strong>
                        </td>

                        <td>
                            ${safe(row.policy_choice)}
                        </td>

                        <td class="reason">
                            ${safe(row.policy_reason)}
                        </td>

                        <td class="score">
                            ${row.score || 0}/5
                        </td>

                        <td>
                            ${row.percentage || 0}%
                        </td>

                        <td class="level">
                            ${safe(row.awareness_level)}
                        </td>

                        <td>
                            ${row.correct_answers || 0}
                        </td>

                        <td>
                            ${row.wrong_answers || 0}
                        </td>

                        <td>
                            ${date}
                        </td>

                    </tr>

                `;
    })
    .join("");
}

/* =====================================================
   SEARCH
===================================================== */

function searchResults() {
  const value = document.getElementById("search").value.toLowerCase();

  const filtered = allResults.filter(function (row) {
    return String(row.participant_name || "")
      .toLowerCase()
      .includes(value);
  });

  renderResults(filtered);
}

/* =====================================================
   ANSWER KEY DISPLAY
===================================================== */

function displayAnswerKey() {
  const container = document.getElementById("answerKey");

  container.innerHTML = answerKey
    .map(function (item, index) {
      return `

                    <div class="answer">

                        <div class="answer-number">

                            QUESTION ${index + 1}
                            · ${item.topic}

                        </div>


                        <div class="answer-question">

                            ${safe(item.question)}

                        </div>


                        <div class="correct-answer">

                            <b>
                                CORRECT ANSWER
                            </b>

                            ${safe(item.answer)}

                        </div>


                        <div class="explanation">

                            <b>
                                Explanation:
                            </b>

                            ${safe(item.explanation)}

                        </div>

                    </div>

                `;
    })
    .join("");
}

/* =====================================================
   CSV
===================================================== */

function downloadCSV() {
  if (allResults.length === 0) {
    alert("No results available.");

    return;
  }

  const headers = [
    "Name",
    "Policy",
    "Reason",
    "Score",
    "Total",
    "Percentage",
    "Level",
    "Correct",
    "Wrong",
    "Date",
  ];

  const rows = allResults.map(function (row) {
    return [
      row.participant_name,

      row.policy_choice,

      row.policy_reason,

      row.score,

      row.total_questions,

      row.percentage,

      row.awareness_level,

      row.correct_answers,

      row.wrong_answers,

      row.created_at,
    ];
  });

  const csv = [headers, ...rows]
    .map(function (row) {
      return row
        .map(function (value) {
          return '"' + String(value ?? "").replace(/"/g, '""') + '"';
        })
        .join(",");
    })
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "sopra-steria-results.csv";

  link.click();

  URL.revokeObjectURL(url);
}

/* =====================================================
   SECURITY
===================================================== */

function safe(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =====================================================
   START ADMIN
===================================================== */

displayAnswerKey();

loadResults();
