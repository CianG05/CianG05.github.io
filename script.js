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