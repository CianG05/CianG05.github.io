
const config = window.ROADMAP_CONFIG || {};
let roadmapData = null;
let currentFilter = "all";

const statusLabels = {
  planned: "Geplant",
  in_progress: "In Arbeit",
  done: "Erledigt"
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function calculateProgress(items) {
  if (!items.length) return 0;
  const values = items.map(item => {
    if (item.status === "done") return 100;
    if (item.status === "in_progress") return 50;
    return 0;
  });
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function renderProject(data) {
  setText("projectSummary", data.project.summary);
  setText("projectVersion", data.project.version);
  setText("projectUpdated", data.project.updated);
  setText("footerUpdated", `Stand ${data.project.updated}`);

  const progress = calculateProgress(data.items);
  setText("overallProgress", `${progress}%`);
  setText("overallProgressLarge", `${progress}%`);
  document.getElementById("overallProgressBar").style.width = `${progress}%`;

  const done = data.items.filter(item => item.status === "done").length;
  const inProgress = data.items.filter(item => item.status === "in_progress").length;
  const planned = data.items.filter(item => item.status === "planned").length;

  setText("countDone", done);
  setText("countProgress", inProgress);
  setText("countPlanned", planned);
}

function renderMilestones(milestones) {
  const container = document.getElementById("milestoneList");
  container.innerHTML = milestones.map((item, index) => `
    <article class="milestone">
      <div class="milestone-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="milestone-meta">${item.target} · ${statusLabels[item.status]}</div>
      </div>
      <div class="milestone-progress">
        <strong>${item.progress}%</strong>
        <div class="progress-track"><span style="width:${item.progress}%"></span></div>
      </div>
    </article>
  `).join("");
}

function renderTasks() {
  const container = document.getElementById("taskList");
  const filtered = currentFilter === "all"
    ? roadmapData.items
    : roadmapData.items.filter(item => item.status === currentFilter);

  container.innerHTML = filtered.map(item => `
    <article class="task ${item.status === "done" ? "is-done" : ""}">
      <div class="task-check">${item.status === "done" ? "✓" : ""}</div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="task-meta">
          <span class="meta-tag">${item.area}</span>
          <span class="meta-tag priority-${item.priority}">${item.priority === "high" ? "Hohe Priorität" : item.priority === "medium" ? "Mittlere Priorität" : "Normale Priorität"}</span>
          <span class="meta-tag">${item.owner}</span>
          <span class="meta-tag">Aktualisiert ${item.updated}</span>
        </div>
      </div>
      <div class="task-status">${statusLabels[item.status]}</div>
    </article>
  `).join("");
}

function renderChangelog(changelog) {
  const container = document.getElementById("changelog");
  container.innerHTML = changelog.map(item => `
    <article class="change">
      <div class="change-date">${item.date}</div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    </article>
  `).join("");
}

function setupFilters() {
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });
}

function openFeedbackDialog() {
  document.getElementById("feedbackDialog").showModal();
}

function buildIssueUrl() {
  const owner = config.githubOwner;
  const repo = config.githubRepo;
  const title = document.getElementById("feedbackTitle").value.trim();
  const area = document.getElementById("feedbackArea").value;
  const text = document.getElementById("feedbackText").value.trim();

  if (!owner || !repo || owner.includes("DEIN-") || repo.includes("DEIN-")) {
    alert("Bitte zuerst githubOwner und githubRepo in config.js eintragen.");
    return null;
  }

  if (!title || !text) {
    alert("Bitte Titel und Beschreibung ausfüllen.");
    return null;
  }

  const body = [
    "## Bereich",
    area,
    "",
    "## Beschreibung",
    text,
    "",
    "## Erwartete Verbesserung",
    "_Bitte ergänzen, falls nötig._"
  ].join("\n");

  return `https://github.com/${owner}/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=feedback`;
}

function buildEmailUrl() {
  const email = config.feedbackEmail;
  const title = document.getElementById("feedbackTitle").value.trim() || "Feedback zur BaustellenHub Roadmap";
  const area = document.getElementById("feedbackArea").value;
  const text = document.getElementById("feedbackText").value.trim();

  if (!email || email.includes("BEISPIEL.DE")) {
    alert("Bitte zuerst feedbackEmail in config.js eintragen.");
    return null;
  }

  const body = `Bereich: ${area}\n\n${text}`;
  return `mailto:${email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

async function loadRoadmap() {
  try {
    const response = await fetch("roadmap.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    roadmapData = await response.json();

    renderProject(roadmapData);
    renderMilestones(roadmapData.milestones);
    renderTasks();
    renderChangelog(roadmapData.changelog);
  } catch (error) {
    document.querySelector("main").innerHTML = `
      <section class="section container">
        <div class="error-box">
          Die Roadmap konnte nicht geladen werden. Öffne die Seite über GitHub Pages oder einen lokalen Webserver.
        </div>
      </section>
    `;
    console.error(error);
  }
}

document.getElementById("feedbackButton").addEventListener("click", openFeedbackDialog);
document.getElementById("feedbackButtonBottom").addEventListener("click", openFeedbackDialog);

document.getElementById("createIssueButton").addEventListener("click", () => {
  const url = buildIssueUrl();
  if (url) window.open(url, "_blank", "noopener");
});

document.getElementById("emailFeedbackButton").addEventListener("click", () => {
  const url = buildEmailUrl();
  if (url) window.location.href = url;
});

const owner = config.githubOwner;
const repo = config.githubRepo;
if (owner && repo && !owner.includes("DEIN-") && !repo.includes("DEIN-")) {
  document.getElementById("editRoadmapLink").href =
    `https://github.com/${owner}/${repo}/edit/main/roadmap.json`;
}

setupFilters();
loadRoadmap();
