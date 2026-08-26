const C=window.ROADMAP_CONFIG||{};let D=null,SHA=null,dirty=false;
const $=id=>document.getElementById(id);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const api=()=>`https://api.github.com/repos/${C.githubOwner}/${C.githubRepo}/contents/${C.roadmapPath||"roadmap.json"}?ref=${C.githubBranch||"main"}`;
function msg(t,ok=true){const e=$("message");e.textContent=t;e.className=`message show ${ok?"ok":"bad"}`;setTimeout(()=>e.classList.remove("show"),5000)}
function token(){return sessionStorage.getItem("bhGithubToken")||""}
function headers(auth=true){const h={"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};if(auth&&token())h.Authorization=`Bearer ${token()}`;return h}
function utf8ToBase64(s){const bytes=new TextEncoder().encode(s);let bin="";bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin)}
function base64ToUtf8(s){const bin=atob(s.replace(/\n/g,""));const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function mark(){dirty=true;$("saveState").textContent="Ungespeicherte Änderungen vorhanden."}
function syncProject(){D.project.version=$("version").value;D.project.updated=$("updated").value;D.project.summary=$("summary").value}
function statusChanged(i,v){D.items[i].status=v;if(v==="done")D.items[i].progress=100;if(v==="planned"&&D.items[i].progress===100)D.items[i].progress=0;D.items[i].updated=D.project.updated;renderTasks();mark()}
function render(){
 $("version").value=D.project.version;$("updated").value=D.project.updated;$("summary").value=D.project.summary;renderTasks();renderMilestones();renderChanges();
 document.querySelectorAll("#version,#updated,#summary").forEach(e=>e.oninput=()=>{syncProject();mark()})
}
function taskFields(x,i){return `<div class="form-grid"><label class="field wide">Titel<input value="${esc(x.title)}" oninput="D.items[${i}].title=this.value;mark()"></label><label class="field wide">Beschreibung<textarea oninput="D.items[${i}].description=this.value;mark()">${esc(x.description)}</textarea></label><label class="field">Status<select onchange="statusChanged(${i},this.value)"><option value="planned" ${x.status==="planned"?"selected":""}>Geplant</option><option value="in_progress" ${x.status==="in_progress"?"selected":""}>In Arbeit</option><option value="done" ${x.status==="done"?"selected":""}>Erledigt</option></select></label><label class="field">Fortschritt in %<input type="number" min="0" max="100" value="${x.progress}" oninput="D.items[${i}].progress=Math.max(0,Math.min(100,Number(this.value)));if(D.items[${i}].progress===100)D.items[${i}].status='done';else if(D.items[${i}].status==='done')D.items[${i}].status='in_progress';mark()"></label><label class="field">Bereich<input value="${esc(x.area)}" oninput="D.items[${i}].area=this.value;mark()"></label><label class="field">Priorität<select onchange="D.items[${i}].priority=this.value;mark()"><option value="high" ${x.priority==="high"?"selected":""}>Hoch</option><option value="medium" ${x.priority==="medium"?"selected":""}>Mittel</option><option value="normal" ${x.priority==="normal"?"selected":""}>Normal</option></select></label><label class="field">Verantwortlich<input value="${esc(x.owner)}" oninput="D.items[${i}].owner=this.value;mark()"></label><label class="field">Aktualisiert<input value="${esc(x.updated)}" oninput="D.items[${i}].updated=this.value;mark()"></label></div><div class="row-actions"><button class="btn secondary danger" onclick="removeTask(${i})">Aufgabe löschen</button></div>`}
function renderTasks(){$("tasks").innerHTML=D.items.map((x,i)=>`<details class="edit"><summary><strong>${esc(x.title)}</strong><span class="pill ${x.status}">${x.progress}% · ${x.status==="done"?"Erledigt":x.status==="in_progress"?"In Arbeit":"Geplant"}</span></summary><div class="edit-body">${taskFields(x,i)}</div></details>`).join("")}
function renderMilestones(){$("milestones").innerHTML=D.milestones.map((m,i)=>`<details class="edit"><summary><strong>${esc(m.title)}</strong><span class="pill">${m.taskIds.length} Aufgaben</span></summary><div class="edit-body"><div class="form-grid"><label class="field wide">Titel<input value="${esc(m.title)}" oninput="D.milestones[${i}].title=this.value;mark()"></label><label class="field wide">Beschreibung<textarea oninput="D.milestones[${i}].description=this.value;mark()">${esc(m.description)}</textarea></label><label class="field wide">Zugeordnete Aufgaben${D.items.map(t=>`<span style="display:flex;gap:8px;align-items:center;margin-top:8px;font-weight:400"><input style="width:auto;height:auto" type="checkbox" ${m.taskIds.includes(t.id)?"checked":""} onchange="toggleMilestoneTask(${i},'${t.id}',this.checked)"> ${esc(t.title)}</span>`).join("")}</label></div><button class="btn secondary danger" onclick="removeMilestone(${i})">Meilenstein löschen</button></div></details>`).join("")}
function renderChanges(){$("changes").innerHTML=D.changelog.map((x,i)=>`<details class="edit"><summary><strong>${esc(x.title)}</strong><span class="pill">${esc(x.date)}</span></summary><div class="edit-body"><div class="form-grid"><label class="field">Datum<input value="${esc(x.date)}" oninput="D.changelog[${i}].date=this.value;mark()"></label><label class="field">Titel<input value="${esc(x.title)}" oninput="D.changelog[${i}].title=this.value;mark()"></label><label class="field wide">Beschreibung<textarea oninput="D.changelog[${i}].text=this.value;mark()">${esc(x.text)}</textarea></label></div><button class="btn secondary danger" onclick="removeChange(${i})">Eintrag löschen</button></div></details>`).join("")}
function removeTask(i){if(confirm("Aufgabe wirklich löschen?")){const id=D.items[i].id;D.items.splice(i,1);D.milestones.forEach(m=>m.taskIds=m.taskIds.filter(x=>x!==id));renderTasks();renderMilestones();mark()}}
function removeMilestone(i){if(confirm("Meilenstein wirklich löschen?")){D.milestones.splice(i,1);renderMilestones();mark()}}
function removeChange(i){if(confirm("Eintrag wirklich löschen?")){D.changelog.splice(i,1);renderChanges();mark()}}
function toggleMilestoneTask(i,id,on){const a=D.milestones[i].taskIds;if(on&&!a.includes(id))a.push(id);if(!on)D.milestones[i].taskIds=a.filter(x=>x!==id);mark()}
$("addTask").onclick=()=>{const id=`task-${Date.now()}`;D.items.push({id,title:"Neue Aufgabe",description:"Beschreibung ergänzen",area:"Allgemein",priority:"normal",status:"planned",progress:0,owner:"Jeremy",updated:D.project.updated});renderTasks();renderMilestones();mark()};
$("addMilestone").onclick=()=>{D.milestones.push({id:`milestone-${Date.now()}`,title:"Neuer Meilenstein",description:"Beschreibung ergänzen",taskIds:[]});renderMilestones();mark()};
$("addChange").onclick=()=>{D.changelog.unshift({date:D.project.updated,title:"Neue Änderung",text:"Beschreibung ergänzen"});renderChanges();mark()};
async function load(useApi=false){try{if(useApi||token()){const r=await fetch(`${api()}&_=${Date.now()}`,{headers:headers(),cache:"no-store"});if(!r.ok)throw new Error(`${r.status} ${await r.text()}`);const j=await r.json();SHA=j.sha;D=JSON.parse(base64ToUtf8(j.content));$("connection").classList.add("connected");$("connection").querySelector("span:last-child").textContent="Mit GitHub verbunden"}else{const r=await fetch("roadmap.json",{cache:"no-store"});D=await r.json()}render();dirty=false;$("saveState").textContent="Roadmap geladen."}catch(e){msg("Laden fehlgeschlagen: "+e.message,false)}}
$("connect").onclick=async()=>{const t=$("token").value.trim();if(!t)return msg("Token eingeben.",false);sessionStorage.setItem("bhGithubToken",t);$("token").value="";await load(true)};
$("reload").onclick=()=>{if(!dirty||confirm("Ungespeicherte Änderungen verwerfen?"))load(Boolean(token()))};
$("save").onclick=async()=>{if(!token())return msg("Zuerst mit GitHub verbinden.",false);syncProject();try{$("save").disabled=true;$("save").textContent="Speichert …";const fresh=await fetch(`${api()}&_=${Date.now()}`,{headers:headers(),cache:"no-store"});if(!fresh.ok)throw new Error("Aktuelle Dateiversion konnte nicht geladen werden.");const meta=await fresh.json();const body={message:`roadmap: Stand ${D.project.updated} aktualisieren`,content:utf8ToBase64(JSON.stringify(D,null,2)),sha:meta.sha,branch:C.githubBranch||"main"};const r=await fetch(`https://api.github.com/repos/${C.githubOwner}/${C.githubRepo}/contents/${C.roadmapPath||"roadmap.json"}`,{method:"PUT",headers:{...headers(),"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok)throw new Error(`${r.status}: ${await r.text()}`);const j=await r.json();SHA=j.content.sha;dirty=false;$("saveState").textContent="Gespeichert. GitHub Pages aktualisiert sich automatisch.";msg("Roadmap wurde erfolgreich direkt in GitHub gespeichert.")}catch(e){msg("Speichern fehlgeschlagen: "+e.message,false)}finally{$("save").disabled=false;$("save").textContent="Direkt in GitHub speichern"}};
window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue=""}});load(false);

// =========================================================
// TESTVERSIONEN / BUILDS
// =========================================================
let VERSIONS = {versions: []};

const versionsApi = () =>
  `https://api.github.com/repos/${C.githubOwner}/${C.githubRepo}/contents/versions.json?ref=${C.githubBranch||"main"}`;

function buildPath(version, ext) {
  if (ext === "rar") return `downloads/v${version}/JuH Baustellen Hub Release ${version}.rar`;
  return `downloads/v${version}/JuH-BaustellenHub-v${version}.${ext}`;
}

function renderVersionsEditor() {
  const box = $("versionsEditor");
  if (!box) return;

  box.innerHTML = VERSIONS.versions.map((v, i) => {
    const win = (v.downloads || []).find(d => d.format === "RAR");
    const apk = (v.downloads || []).find(d => d.format === "APK");
    return `<details class="edit" ${v.current ? "open" : ""}>
      <summary>
        <strong>v${esc(v.version)} · ${esc(v.title || "Testversion")}</strong>
        <span class="pill ${v.current ? "in_progress" : ""}">${v.current ? "Aktuell" : esc(v.statusLabel || "Vorheriger Stand")}</span>
      </summary>
      <div class="edit-body">
        <div class="form-grid">
          <label class="field">Version
            <input value="${esc(v.version)}" onchange="changeVersionNumber(${i},this.value)">
          </label>
          <label class="field">Datum
            <input value="${esc(v.date || "")}" oninput="VERSIONS.versions[${i}].date=this.value;mark()">
          </label>
          <label class="field wide">Titel
            <input value="${esc(v.title || "")}" oninput="VERSIONS.versions[${i}].title=this.value;mark()">
          </label>
          <label class="field wide">Beschreibung
            <textarea oninput="VERSIONS.versions[${i}].description=this.value;mark()">${esc(v.description || "")}</textarea>
          </label>
          <label class="field">Status
            <select onchange="VERSIONS.versions[${i}].status=this.value;mark()">
              <option value="testing" ${v.status==="testing"?"selected":""}>Testphase</option>
              <option value="ready_for_test" ${v.status==="ready_for_test"?"selected":""}>Bereit zum Test</option>
              <option value="stable" ${v.status==="stable"?"selected":""}>Freigegeben</option>
              <option value="outdated" ${v.status==="outdated"?"selected":""}>Veraltet</option>
            </select>
          </label>
          <label class="field">Anzeige
            <input value="${esc(v.statusLabel || "")}" oninput="VERSIONS.versions[${i}].statusLabel=this.value;mark()">
          </label>
          <label class="field wide">Windows-Paket (.RAR)
            <input value="${esc(win?.file || buildPath(v.version,'rar'))}" oninput="setBuildFile(${i},'RAR',this.value)">
          </label>
          <label class="field wide">APK-Pfad
            <input value="${esc(apk?.file || buildPath(v.version,'apk'))}" oninput="setBuildFile(${i},'APK',this.value)">
          </label>
          <label class="field wide">Hinweis
            <input value="${esc(v.notice || "")}" oninput="VERSIONS.versions[${i}].notice=this.value;mark()">
          </label>
        </div>
        <div class="notice">
          GitHub-Ordner für diesen Build: <code>downloads/v${esc(v.version)}/</code><br>
          Erwartete Dateien: <code>JuH Baustellen Hub Release ${esc(v.version)}.rar</code> und <code>JuH-BaustellenHub-v${esc(v.version)}.apk</code>
        </div>
        <div class="row-actions">
          ${v.current ? "" : `<button class="btn secondary" onclick="makeCurrentVersion(${i})">Als aktuelle Testversion setzen</button>`}
          <button class="btn secondary danger" onclick="removeVersion(${i})">Version löschen</button>
        </div>
      </div>
    </details>`;
  }).join("");
}

function ensureBuildDownloads(v) {
  v.downloads = Array.isArray(v.downloads) ? v.downloads.filter(d => d.format !== "EXE") : [];
  if (!v.downloads.find(d => d.format === "RAR"))
    v.downloads.push({name:"Windows-Paket",format:"RAR",file:buildPath(v.version,"rar"),primary:true,description:"Komplettes Windows-Programmpaket inklusive benötigter DLLs"});
  if (!v.downloads.find(d => d.format === "APK"))
    v.downloads.push({name:"Android",format:"APK",file:buildPath(v.version,"apk"),primary:false});
}

function setBuildFile(i, format, value) {
  ensureBuildDownloads(VERSIONS.versions[i]);
  const d = VERSIONS.versions[i].downloads.find(x => x.format === format);
  d.file = value;
  mark();
}

function changeVersionNumber(i, value) {
  const v = VERSIONS.versions[i];
  const old = v.version;
  v.version = value.trim();
  ensureBuildDownloads(v);
  v.downloads.forEach(d => {
    if (d.format === "RAR" && (!d.file || d.file.includes(`${old}`)))
      d.file = buildPath(v.version, "rar");
    if (d.format === "APK" && (!d.file || d.file.includes(`v${old}`)))
      d.file = buildPath(v.version, "apk");
  });
  renderVersionsEditor();
  mark();
}

function makeCurrentVersion(i) {
  VERSIONS.versions.forEach((v, idx) => {
    v.current = idx === i;
    if (idx === i) {
      v.status = v.status === "outdated" ? "testing" : v.status;
      v.statusLabel = "Aktuelle Testversion";
    } else if (v.statusLabel === "Aktuelle Testversion") {
      v.statusLabel = "Vorheriger Entwicklungsstand";
      if (v.status === "testing") v.status = "outdated";
    }
  });
  const selected = VERSIONS.versions.splice(i, 1)[0];
  VERSIONS.versions.unshift(selected);
  renderVersionsEditor();
  mark();
}

function removeVersion(i) {
  if (!confirm(`Version v${VERSIONS.versions[i].version} wirklich aus der Versionsliste löschen? Die Build-Dateien in GitHub werden dadurch nicht gelöscht.`)) return;
  const wasCurrent = VERSIONS.versions[i].current;
  VERSIONS.versions.splice(i, 1);
  if (wasCurrent && VERSIONS.versions.length) {
    VERSIONS.versions[0].current = true;
    VERSIONS.versions[0].statusLabel = "Aktuelle Testversion";
  }
  renderVersionsEditor();
  mark();
}

$("addVersion").onclick = () => {
  const current = VERSIONS.versions.find(v => v.current);
  const suggested = prompt("Neue Versionsnummer, z. B. 0.9.3:", current ? current.version : "0.9.3");
  if (!suggested || !suggested.trim()) return;

  VERSIONS.versions.forEach(v => {
    v.current = false;
    if (v.statusLabel === "Aktuelle Testversion") v.statusLabel = "Vorheriger Entwicklungsstand";
    if (v.status === "testing") v.status = "outdated";
  });

  const version = suggested.trim().replace(/^v/i, "");
  const v = {
    version,
    title: "Büro- & Tablet-Testpaket",
    date: D?.project?.updated || new Date().toLocaleDateString("de-DE"),
    status: "testing",
    statusLabel: "Aktuelle Testversion",
    current: true,
    description: "Aktueller interner Teststand der BaustellenHub App.",
    downloads: [
      {name:"Windows-Paket",format:"RAR",file:buildPath(version,"rar"),primary:true,description:"Komplettes Windows-Programmpaket inklusive benötigter DLLs"},
      {name:"Android",format:"APK",file:buildPath(version,"apk"),primary:false}
    ],
    changes: [],
    notice: "Interne Testversion – noch nicht als produktive Version freigegeben."
  };
  VERSIONS.versions.unshift(v);
  renderVersionsEditor();
  mark();
};

async function loadVersionsForEditor() {
  try {
    if (token()) {
      const r = await fetch(`${versionsApi()}&_=${Date.now()}`, {headers:headers(),cache:"no-store"});
      if (!r.ok) throw new Error(`${r.status}`);
      const j = await r.json();
      VERSIONS = JSON.parse(base64ToUtf8(j.content));
    } else {
      const r = await fetch(`versions.json?v=${Date.now()}`, {cache:"no-store"});
      VERSIONS = await r.json();
    }
    VERSIONS.versions.forEach(ensureBuildDownloads);
    renderVersionsEditor();
  } catch (e) {
    msg("Versionsliste konnte nicht geladen werden: " + e.message, false);
  }
}

async function saveGithubJson(path, data, commitMessage) {
  const url = `https://api.github.com/repos/${C.githubOwner}/${C.githubRepo}/contents/${path}`;
  const metaUrl = `${url}?ref=${C.githubBranch||"main"}&_=${Date.now()}`;
  const fresh = await fetch(metaUrl,{headers:headers(),cache:"no-store"});
  let sha = null;
  if (fresh.ok) {
    const meta = await fresh.json();
    sha = meta.sha;
  } else if (fresh.status !== 404) {
    throw new Error(`${path}: aktuelle Dateiversion konnte nicht geladen werden (${fresh.status}).`);
  }

  const body = {
    message: commitMessage,
    content: utf8ToBase64(JSON.stringify(data,null,2)),
    branch: C.githubBranch||"main"
  };
  if (sha) body.sha = sha;

  const r = await fetch(url,{
    method:"PUT",
    headers:{...headers(),"Content-Type":"application/json"},
    body:JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`${path}: ${r.status}: ${await r.text()}`);
  return r.json();
}

// Override save button: roadmap + versions in one action.
$("save").onclick = async () => {
  if (!token()) return msg("Zuerst mit GitHub verbinden.",false);
  syncProject();
  try {
    $("save").disabled=true;
    $("save").textContent="Speichert …";

    await saveGithubJson(
      C.roadmapPath||"roadmap.json",
      D,
      `roadmap: Stand ${D.project.updated} aktualisieren`
    );

    await saveGithubJson(
      "versions.json",
      VERSIONS,
      `builds: Versionsliste aktualisieren`
    );

    dirty=false;
    $("saveState").textContent="Roadmap und Versionsliste gespeichert. GitHub Pages aktualisiert sich automatisch.";
    msg("Roadmap und Testversionen wurden erfolgreich direkt in GitHub gespeichert.");
  } catch(e) {
    msg("Speichern fehlgeschlagen: "+e.message,false);
  } finally {
    $("save").disabled=false;
    $("save").textContent="Direkt in GitHub speichern";
  }
};

const originalConnect = $("connect").onclick;
$("connect").onclick = async () => {
  await originalConnect();
  if (token()) await loadVersionsForEditor();
};

loadVersionsForEditor();
