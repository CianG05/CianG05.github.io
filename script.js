const C=window.ROADMAP_CONFIG||{};let D=null,F="all";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const avg=a=>a.length?Math.round(a.reduce((s,v)=>s+Number(v||0),0)/a.length):0;
const statusText={planned:"Geplant",in_progress:"In Arbeit",done:"Erledigt"};

function projectProgress(){return avg(D.items.map(x=>x.progress));}
function milestoneProgress(m){return avg(m.taskIds.map(id=>D.items.find(x=>x.id===id)?.progress??0));}
function render(){
 $("summary").textContent=D.project.summary;$("version").textContent=D.project.version;$("updated").textContent=D.project.updated;$("footerDate").textContent=`Stand ${D.project.updated}`;
 const p=projectProgress();$("overall").textContent=`${p}%`;$("overallBig").textContent=`${p}%`;$("overallBar").style.width=`${p}%`;
 $("doneCount").textContent=D.items.filter(x=>x.status==="done").length;$("workCount").textContent=D.items.filter(x=>x.status==="in_progress").length;$("planCount").textContent=D.items.filter(x=>x.status==="planned").length;
 $("milestones").innerHTML=D.milestones.map((m,i)=>{const p=milestoneProgress(m);return `<article class="milestone"><div class="num">${String(i+1).padStart(2,"0")}</div><div><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><small>${m.taskIds.length} zugeordnete Aufgabe${m.taskIds.length===1?"":"n"}</small></div><div class="milestone-progress"><strong>${p}%</strong><div class="bar"><i style="width:${p}%"></i></div></div></article>`}).join("");
 renderTasks();
 $("changelog").innerHTML=D.changelog.map(x=>`<article class="change"><div class="change-date">${esc(x.date)}</div><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></article>`).join("");
}
function renderTasks(){const a=F==="all"?D.items:D.items.filter(x=>x.status===F);$("taskList").innerHTML=a.map(x=>`<article class="task ${x.status==="done"?"done":""}"><div class="check">${x.status==="done"?"✓":""}</div><div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><div class="tags"><span class="tag">${esc(x.area)}</span><span class="tag ${x.priority}">${x.priority==="high"?"Hohe":x.priority==="medium"?"Mittlere":"Normale"} Priorität</span><span class="tag">${esc(x.owner)}</span><span class="tag">${esc(statusText[x.status])}</span></div></div><div class="task-side"><strong>${Number(x.progress)}%</strong><span>Fortschritt</span></div></article>`).join("")}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");F=b.dataset.filter;renderTasks()});
async function load(){const r=await fetch("roadmap.json",{cache:"no-store"});D=await r.json();render()}load().catch(e=>document.querySelector("main").innerHTML=`<section class="section container"><p>Roadmap konnte nicht geladen werden.</p></section>`);
const dialog=$("feedbackDialog");$("feedbackOpen").onclick=$("feedbackOpenBottom").onclick=()=>dialog.showModal();
$("issueButton").onclick=()=>{if(C.githubOwner.includes("DEIN-")||C.githubRepo.includes("DEIN-"))return alert("GitHub-Daten in config.js eintragen.");const t=$("fbTitle").value.trim(),text=$("fbText").value.trim(),area=$("fbArea").value;if(!t||!text)return alert("Titel und Beschreibung ausfüllen.");const body=`## Bereich\n${area}\n\n## Beschreibung\n${text}`;window.open(`https://github.com/${C.githubOwner}/${C.githubRepo}/issues/new?title=${encodeURIComponent(t)}&body=${encodeURIComponent(body)}&labels=feedback`,"_blank","noopener")};
$("emailButton").onclick=()=>{if(C.feedbackEmail.includes("BEISPIEL.DE"))return alert("E-Mail in config.js eintragen.");location.href=`mailto:${C.feedbackEmail}?subject=${encodeURIComponent($("fbTitle").value||"BaustellenHub Feedback")}&body=${encodeURIComponent($("fbArea").value+"\n\n"+$("fbText").value)}`};

const VERSION_STATUS = {
  testing: "Testphase",
  ready_for_test: "Bereit zum Test",
  outdated: "Veraltet",
  stable: "Freigegeben"
};

function renderDownload(download) {
  const href = encodeURI(download.file);
  return `<a class="version-download ${download.primary ? "primary-download" : ""}" href="${href}" download>
    <span class="download-icon">${esc(download.format || "DATEI")}</span>
    <span class="download-copy"><small>${esc(download.name)}</small><strong>${esc(download.format || "Datei")} herunterladen</strong></span>
    <span class="download-arrow">↓</span>
  </a>`;
}

function renderCurrentVersion(version) {
  const container = $("currentVersion");
  if (!container) return;
  if (!version) {
    container.innerHTML = `<div class="version-empty">Aktuell ist keine Testversion hinterlegt.</div>`;
    return;
  }

  const downloads = (version.downloads || []).length
    ? version.downloads.map(renderDownload).join("")
    : `<div class="download-missing">Für diese Version ist noch kein Download hinterlegt.</div>`;

  const changes = (version.changes || []).map(change =>
    `<li><span class="version-check">✓</span><span>${esc(change)}</span></li>`
  ).join("");

  container.innerHTML = `<article class="current-version-card">
    <div class="current-version-top">
      <div>
        <div class="version-label-row">
          <span class="current-version-label">${esc(version.statusLabel || "Aktuelle Testversion")}</span>
          <span class="version-status version-status-${esc(version.status)}">${esc(VERSION_STATUS[version.status] || version.status)}</span>
        </div>
        <h3>BaustellenHub <span>v${esc(version.version)}</span></h3>
        <p class="current-version-description">${esc(version.description || "")}</p>
      </div>
      <div class="version-date"><span>Stand</span><strong>${esc(version.date)}</strong></div>
    </div>
    <div class="current-version-content">
      <div class="version-changes">
        <h4>Enthaltene Änderungen</h4>
        <ul>${changes}</ul>
      </div>
      <div class="version-downloads">
        <h4>Download</h4>
        <div class="version-download-list">${downloads}</div>
        ${version.notice ? `<p class="version-notice">${esc(version.notice)}</p>` : ""}
      </div>
    </div>
  </article>`;
}

function renderVersionHistory(versions, currentVersion) {
  const container = $("versionHistory");
  const count = $("versionCount");
  if (!container) return;
  if (count) count.textContent = `${versions.length} ${versions.length === 1 ? "Version" : "Versionen"}`;

  const history = versions.filter(v => v !== currentVersion);
  if (!history.length) {
    container.innerHTML = `<div class="version-empty">Noch keine älteren Versionen vorhanden.</div>`;
    return;
  }

  container.innerHTML = history.map(version => {
    const downloads = (version.downloads || []).length
      ? version.downloads.map(d => `<a class="history-download" href="${encodeURI(d.file)}" download>${esc(d.format || d.name)} <span>↓</span></a>`).join("")
      : `<span class="history-no-download">Kein Download hinterlegt</span>`;

    return `<article class="history-version">
      <div class="history-version-main">
        <div>
          <div class="history-version-title">
            <strong>v${esc(version.version)}</strong>
            <span class="version-status version-status-${esc(version.status)}">${esc(VERSION_STATUS[version.status] || version.status)}</span>
          </div>
          <p>${esc(version.title || "BaustellenHub Testversion")}</p>
        </div>
        <time>${esc(version.date)}</time>
      </div>
      <div class="history-version-downloads">${downloads}</div>
    </article>`;
  }).join("");
}

async function loadVersions() {
  const container = $("currentVersion");
  try {
    const response = await fetch(`versions.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const versions = Array.isArray(data.versions) ? data.versions : [];
    const currentVersion = versions.find(v => v.current) || versions[0] || null;
    renderCurrentVersion(currentVersion);
    renderVersionHistory(versions, currentVersion);
  } catch (error) {
    console.error("Fehler beim Laden der Testversionen:", error);
    if (container) container.innerHTML = `<div class="version-empty version-error">Die Testversionen konnten momentan nicht geladen werden.</div>`;
  }
}
loadVersions();
