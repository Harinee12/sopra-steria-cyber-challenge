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
