const CONFIG = {
  feedbackEmail: "Cian.g05@icloud.com",
  projectName: "BaustellenHub",
};

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("baustellenhub-theme");

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("baustellenhub-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☼" : "☾";
}

applyTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

const modal = document.getElementById("feedbackModal");
const openButtons = [
  document.getElementById("openFeedbackTop"),
  document.getElementById("openFeedbackHero"),
  document.getElementById("openFeedbackBottom"),
].filter(Boolean);

openButtons.forEach((button) => {
  button.addEventListener("click", () => modal.showModal());
});

modal.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    modal.close();
  }
});

const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

document.getElementById("sendFeedback").addEventListener("click", () => {
  const name = document.getElementById("feedbackName").value.trim() || "Nicht angegeben";
  const area = document.getElementById("feedbackArea").value;
  const priority = document.getElementById("feedbackPriority").value;
  const message = document.getElementById("feedbackMessage").value.trim();

  if (!message) {
    showToast("Bitte zuerst ein Feedback eingeben.");
    return;
  }

  if (CONFIG.feedbackEmail.includes("BEISPIEL.DE")) {
    showToast("Bitte zuerst die Feedback-E-Mail in script.js eintragen.");
    return;
  }

  const subject = encodeURIComponent(
    `[${CONFIG.projectName}] Feedback: ${area} (${priority})`
  );

  const body = encodeURIComponent(
`Hallo,

hier ist mein Feedback zur ${CONFIG.projectName} App.

Name: ${name}
Bereich: ${area}
Priorität: ${priority}

Feedback:
${message}

Viele Grüße
${name}`
  );

  showToast("E-Mail wird geöffnet …");
  window.location.href = `mailto:${CONFIG.feedbackEmail}?subject=${subject}&body=${body}`;
  modal.close();
});
