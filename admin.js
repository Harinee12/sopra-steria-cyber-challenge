<<<<<<< HEAD
/* =========================================================
   SOPRA STERIA CYBERSECURITY CHALLENGE
   Admin Dashboard
========================================================= */

/* ================= SUPABASE ================= */

const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= STATE ================= */

let allResults = [];

/* ================= LOAD RESULTS ================= */

async function loadResults() {
  try {
    const { data, error } = await supabaseClient
      .from("challenge_results")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      alert("Could not load results.");

      return;
    }

    allResults = data || [];

    updateDashboard(allResults);

    renderTable(allResults);
  } catch (error) {
    console.error(error);
  }
}

/* ================= DASHBOARD ================= */

function updateDashboard(results) {
  const total = results.length;

  document.getElementById("totalParticipants").textContent = total;

  if (total === 0) {
    document.getElementById("averageScore").textContent = "0/5";

    document.getElementById("highestScore").textContent = "0/5";
  } else {
    const scores = results.map((result) => Number(result.score || 0));

    const average = scores.reduce((a, b) => a + b, 0) / total;

    const highest = Math.max(...scores);

    document.getElementById("averageScore").textContent =
      `${average.toFixed(1)}/5`;

    document.getElementById("highestScore").textContent = `${highest}/5`;
  }

  const rookie = countLevel(results, "CYBER ROOKIE");

  const aware = countLevel(results, "CYBER AWARE");

  const defender = countLevel(results, "CYBER DEFENDER");

  const guardian = countLevel(results, "CYBER GUARDIAN");

  document.getElementById("rookieCount").textContent = rookie;

  document.getElementById("awareCount").textContent = aware;

  document.getElementById("defenderCount").textContent = defender;

  document.getElementById("guardianCount").textContent = guardian;

  document.getElementById("guardianCount2").textContent = guardian;
}

/* ================= COUNT LEVEL ================= */

function countLevel(results, level) {
  return results.filter((result) => result.awareness_level === level).length;
}

/* ================= TABLE ================= */

function renderTable(results) {
  const tbody = document.getElementById("resultsBody");

  tbody.innerHTML = "";

  if (!results.length) {
    tbody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#64748b;
                    "
                >
                    No participant results yet.
                </td>

            </tr>

        `;

    return;
  }

  results.forEach((result, index) => {
    const row = document.createElement("tr");

    const date = result.created_at
      ? new Date(result.created_at).toLocaleString()
      : "-";

    row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(result.participant_name)}
                    </strong>
                </td>

                <td>

                    <span class="policy-pill">

                        ${escapeHtml(result.policy_choice || "-")}

                    </span>

                </td>

                <td>
                    ${result.score || 0}/5
                </td>

                <td>
                    ${result.percentage || 0}%
                </td>

                <td>

                    <span class="level-pill">

                        ${escapeHtml(result.awareness_level || "-")}

                    </span>

                </td>

                <td>
                    ${result.correct_answers || 0}
                </td>

                <td>
                    ${result.wrong_answers || 0}
                </td>

                <td>
                    ${date}
                </td>

            `;

    tbody.appendChild(row);
  });
}

/* ================= SEARCH ================= */

function searchResults() {
  const search = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  if (!search) {
    renderTable(allResults);

    return;
  }

  const filtered = allResults.filter((result) =>
    (result.participant_name || "").toLowerCase().includes(search),
  );

  renderTable(filtered);
}

/* ================= CSV ================= */

function downloadCSV() {
  if (!allResults.length) {
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
    "Date",
  ];

  const rows = allResults.map((result) => [
    result.participant_name,

    result.policy_choice,

    result.policy_reason || "",

    result.score,

    result.total_questions,

    result.percentage,

    result.awareness_level,

    result.correct_answers,

    result.wrong_answers,

    result.created_at,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "cybersecurity-results.csv";

  link.click();

  URL.revokeObjectURL(url);
}

/* ================= SECURITY ================= */

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}

/* ================= EVENTS ================= */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("refreshBtn").addEventListener("click", loadResults);

  document.getElementById("downloadBtn").addEventListener("click", downloadCSV);

  document
    .getElementById("searchInput")
    .addEventListener("input", searchResults);

  loadResults();
});
=======
/* =========================================================
   SOPRA STERIA CYBERSECURITY CHALLENGE
   ADMIN DASHBOARD
========================================================= */

/* ================= SUPABASE ================= */

const SUPABASE_URL = "https://ekjvwzsddkzqbgywahwr.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-dUITzFjMo2FZFYizCCHQ_L9rTt40z";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= DATA ================= */

let allResults = [];

/* ================= LOAD DATA ================= */

async function loadResults() {
  const loading = document.getElementById("loading");

  const errorBox = document.getElementById("adminError");

  loading.style.display = "block";

  errorBox.style.display = "none";

  try {
    const { data, error } = await supabaseClient
      .from("challenge_results")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    allResults = data || [];

    updateDashboard(allResults);

    renderTable(allResults);

    loading.style.display = "none";
  } catch (error) {
    console.error("Admin loading error:", error);

    loading.style.display = "none";

    errorBox.style.display = "block";

    errorBox.textContent =
      "Unable to load results. Check Supabase table, API key and RLS policies.";
  }
}

/* ================= DASHBOARD ================= */

function updateDashboard(results) {
  const total = results.length;

  document.getElementById("totalParticipants").textContent = total;

  if (total === 0) {
    document.getElementById("averageScore").textContent = "0%";

    document.getElementById("highestScore").textContent = "0/12";
  } else {
    const average =
      results.reduce((sum, item) => sum + Number(item.percentage || 0), 0) /
      total;

    document.getElementById("averageScore").textContent =
      Math.round(average) + "%";

    const highest = Math.max(...results.map((item) => Number(item.score || 0)));

    document.getElementById("highestScore").textContent = `${highest}/12`;
  }

  const rookie = results.filter(
    (item) => item.awareness_level === "CYBER ROOKIE",
  ).length;

  const aware = results.filter(
    (item) => item.awareness_level === "CYBER AWARE",
  ).length;

  const defender = results.filter(
    (item) => item.awareness_level === "CYBER DEFENDER",
  ).length;

  const guardian = results.filter(
    (item) => item.awareness_level === "CYBER GUARDIAN",
  ).length;

  document.getElementById("rookieCount").textContent = rookie;

  document.getElementById("awareCount").textContent = aware;

  document.getElementById("defenderCount").textContent = defender;

  document.getElementById("guardianCount").textContent = guardian;

  document.getElementById("guardianCount2").textContent = guardian;
}

/* ================= TABLE ================= */

function renderTable(results) {
  const tbody = document.getElementById("resultsBody");

  const recordCount = document.getElementById("recordCount");

  recordCount.textContent = `${results.length} record${results.length === 1 ? "" : "s"}`;

  tbody.innerHTML = "";

  if (results.length === 0) {
    tbody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="text-align:center;padding:40px;color:#66798c;"
                >
                    No participant results yet.
                </td>

            </tr>

        `;

    return;
  }

  results.forEach((item, index) => {
    const row = document.createElement("tr");

    const date = item.created_at
      ? new Date(item.created_at).toLocaleString()
      : "-";

    row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(item.participant_name || "-")}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(item.policy_choice || "-")}
                </td>

                <td class="score">
                    ${item.score || 0}/12
                </td>

                <td>
                    ${item.percentage || 0}%
                </td>

                <td>
                    <span class="level">
                        ${escapeHtml(item.awareness_level || "-")}
                    </span>
                </td>

                <td>
                    ${item.correct_answers || 0}
                </td>

                <td>
                    ${item.wrong_answers || 0}
                </td>

                <td>
                    ${date}
                </td>

            `;

    tbody.appendChild(row);
  });
}

/* ================= SEARCH ================= */

function searchResults() {
  const search = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  if (!search) {
    renderTable(allResults);

    return;
  }

  const filtered = allResults.filter((item) =>
    String(item.participant_name || "")
      .toLowerCase()
      .includes(search),
  );

  renderTable(filtered);
}

/* ================= CSV ================= */

function downloadCSV() {
  if (!allResults.length) {
    alert("There are no results to download yet.");

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
    "Correct",
    "Wrong",
    "Policy Awareness",
    "Phishing",
    "Email Security",
    "URL Safety",
    "MFA Security",
    "QR Security",
    "Password Security",
    "Social Engineering",
    "Attachment Safety",
    "Public Wi-Fi",
    "Incident Reporting",
    "AI Phishing",
    "Created At",
  ];

  const rows = allResults.map((item) => [
    item.participant_name,
    item.policy_choice,
    item.policy_reason,
    item.score,
    item.total_questions,
    item.percentage,
    item.awareness_level,
    item.correct_answers,
    item.wrong_answers,
    item.policy_awareness,
    item.phishing,
    item.email_security,
    item.url_safety,
    item.mfa_security,
    item.qr_security,
    item.password_security,
    item.social_engineering,
    item.attachment_safety,
    item.public_wifi,
    item.incident_reporting,
    item.ai_phishing,
    item.created_at,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "sopra-steria-cybersecurity-results.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* ================= SECURITY ================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ================= EVENTS ================= */

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("refreshBtn").addEventListener("click", loadResults);

  document.getElementById("downloadBtn").addEventListener("click", downloadCSV);

  document
    .getElementById("searchInput")
    .addEventListener("input", searchResults);

  loadResults();
});
>>>>>>> 2f1e3120dd35bec5725a8bf9ccf4ecc9d7f213dd
