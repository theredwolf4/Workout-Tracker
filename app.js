
// Build week template
const WEEK1 = {
  1: {title:"Chest & Shoulders", blocks:[
    {tag:"CHEST", items:[
      {name:"Barbell Bench Press", sets:4, reps:[8,12], goal:"155 lbs"},
      {name:"Dumbbell Bench Press (flat)", sets:3, reps:[8,12], goal:"50s"},
      {name:"Incline Barbell Press", sets:3, reps:[8,12], goal:"135 lbs"},
    ]},
    {tag:"SHOULDERS", items:[
      {name:"Dumbbell Overhead Press", sets:4, reps:[8,12], goal:"45s"},
      {name:"Dumbbell Lateral Raise", sets:3, reps:[8,12], goal:"25s"},
    ]},
  ]},
  2: {title:"Arms & Abs (Biceps)", blocks:[
    {tag:"BICEPS", items:[
      {name:"Barbell Curl", sets:4, reps:[8,12], goal:"55 lbs"},
      {name:"Dumbbell Curl (alt)", sets:3, reps:[8,12], goal:"35s"},
      {name:"Hammer Curl", sets:3, reps:[8,12], goal:"35s"},
    ]},
    {tag:"TRICEPS", items:[
      {name:"Rope Triceps Extension", sets:3, reps:[8,12], goal:"40 lbs"},
    ]},
    {tag:"ABS", items:[
      {name:"Incline Crunch", sets:3, reps:[25,25], goal:"10 lbs"},
      {name:"Hanging Knee Raise", sets:3, reps:[25,25], goal:"BW"},
    ]},
  ]},
  3: {title:"Shoulders & Back", blocks:[
    {tag:"BACK", items:[
      {name:"Barbell Row", sets:4, reps:[8,12], goal:"115 lbs"},
      {name:"Dumbbell Row", sets:3, reps:[8,12], goal:"55s"},
      {name:"Lat Pulldown", sets:3, reps:[8,12], goal:"120 lbs"},
      {name:"Pull-Ups", sets:3, reps:[7,10], goal:"BW"},
    ]},
    {tag:"SHOULDERS", items:[
      {name:"Dumbbell Overhead Press", sets:3, reps:[8,12], goal:"45s"},
      {name:"Dumbbell Lateral Raise", sets:3, reps:[8,12], goal:"25s"},
    ]},
  ]},
  4: {title:"Arms & Abs (Triceps)", blocks:[
    {tag:"TRICEPS", items:[
      {name:"Rope Triceps Extension", sets:4, reps:[8,12], goal:"40 lbs"},
      {name:"Dips", sets:3, reps:[12,15], goal:"BW"},
      {name:"Overhead DB Triceps Ext.", sets:3, reps:[8,12], goal:"35s"},
    ]},
    {tag:"BICEPS", items:[
      {name:"Barbell Curl", sets:3, reps:[8,12], goal:"55 lbs"},
      {name:"Dumbbell Curl", sets:3, reps:[8,12], goal:"35s"},
    ]},
    {tag:"ABS", items:[
      {name:"Hanging Knee Raise", sets:3, reps:[25,25], goal:"BW"},
      {name:"Weighted Crunch", sets:3, reps:[25,25], goal:"10 lbs"},
    ]},
  ]},
  5: {title:"Quads & Abs", blocks:[
    {tag:"QUADS", items:[
      {name:"Barbell Squat", sets:4, reps:[8,12], goal:"135 lbs"},
      {name:"Hex Bar Squat", sets:4, reps:[8,12], goal:"155 lbs"},
      {name:"Dumbbell Step-Ups (bench)", sets:3, reps:[8,12], goal:"35s"},
    ]},
    {tag:"ABS", items:[
      {name:"Incline Crunch", sets:3, reps:[25,25], goal:"10 lbs"},
      {name:"Hanging Knee Raise", sets:3, reps:[25,25], goal:"BW"},
    ]},
  ]},
};

// Build PLAN for 6 weeks by cloning WEEK1
const PLAN = {};
for(let w=1; w<=6; w++){
  PLAN[w] = JSON.parse(JSON.stringify(WEEK1));
}

// Helpers
const $ = s => document.querySelector(s);
const el = (t,c,txt)=>{ const e=document.createElement(t); if(c) e.className=c; if(txt) e.textContent=txt; return e; };
const KEY='workout-tracker-v1';
function load(){ try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return{};} }
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
let STATE=load(); if(STATE.selectedWeek==null) STATE.selectedWeek=1; if(STATE.selectedDay==null) STATE.selectedDay=1;
const setKey=(w,d,n,s)=>`${w}-${d}-${n}-S${s}`;

// Build UI
function build(){
  $('#week').value=STATE.selectedWeek; $('#day').value=STATE.selectedDay;
  $('#headerTitle').textContent = `Week ${STATE.selectedWeek} • Day ${STATE.selectedDay} — ${PLAN[STATE.selectedWeek][STATE.selectedDay].title}`;
  const wrap = $('#content'); wrap.innerHTML='';

  PLAN[STATE.selectedWeek][STATE.selectedDay].blocks.forEach(block=>{
    wrap.appendChild(el('div','section',block.tag));
    block.items.forEach(item=>{
      const card=el('div','card'); card.appendChild(el('h3',null,item.name));
      card.appendChild(el('div','meta',`Target: ${item.reps[0]}–${item.reps[1]} reps • Goal: ${item.goal}`));

      const table=el('table','sets'); const thead=el('thead'); const trh=el('tr');
      ['Set','Weight','Reps','Log'].forEach(h=>trh.appendChild(el('th',null,h))); thead.appendChild(trh); table.appendChild(thead);
      const tbody=el('tbody');

      for(let s=1;s<=item.sets;s++){
        const tr=el('tr','row');
        const tdSet=el('td',null,`#${s}`);
        const tdW=el('td'); const wI=el('input'); wI.type='number'; wI.placeholder=item.goal.replace(/[^\d.]/g,'');
        const tdR=el('td'); const rI=el('input'); rI.type='number'; rI.placeholder=item.reps[1];
        const tdC=el('td'); const cb=el('input'); cb.type='checkbox';

        const k=setKey(STATE.selectedWeek,STATE.selectedDay,item.name,s); const sv=STATE[k]||{};
        if(sv.w!=null) wI.value=sv.w; if(sv.r!=null) rI.value=sv.r; if(sv.c===true) cb.checked=true;

        wI.addEventListener('input',()=>{STATE[k]=STATE[k]||{};STATE[k].w=parseFloat(wI.value||'');save(STATE);});
        rI.addEventListener('input',()=>{STATE[k]=STATE[k]||{};STATE[k].r=parseFloat(rI.value||'');save(STATE);});
        cb.addEventListener('change',()=>{STATE[k]=STATE[k]||{};STATE[k].c=cb.checked;save(STATE);updateProgress();});

        tdW.appendChild(wI); tdR.appendChild(rI); tdC.appendChild(cb);
        tr.appendChild(tdSet); tr.appendChild(tdW); tr.appendChild(tdR); tr.appendChild(tdC);
        tbody.appendChild(tr);
      }
      table.appendChild(tbody); card.appendChild(table);

      const ctrls=el('div','controls');
      const copy=el('button','btn green','Copy Last Week Weights'); copy.addEventListener('click',()=>copyLastWeek(item));
      const mark=el('button','btn brand','Mark All Complete'); mark.addEventListener('click',()=>markAll(item,true));
      const clear=el('button','btn danger','Clear Day'); clear.addEventListener('click',clearDay);
      ctrls.appendChild(copy); ctrls.appendChild(mark); ctrls.appendChild(clear); card.appendChild(ctrls);

      wrap.appendChild(card);
    });
  });

  updateProgress();
}

function updateProgress(){
  const cbs=[...document.querySelectorAll('input[type=checkbox]')];
  const done=cbs.filter(x=>x.checked).length; const total=cbs.length||1;
  $('#progressText').textContent=`Sets completed: ${done}/${total}`;
  const pct=Math.round((done/total)*100);
  $('#progressBar').style.background=`conic-gradient(var(--brand) ${pct*3.6}deg, #2a2c33 0)`;
  $('#progressPct').textContent=pct+'%';
}

function markAll(item,val){
  for(let s=1;s<=item.sets;s++){
    const k=setKey(STATE.selectedWeek,STATE.selectedDay,item.name,s);
    STATE[k]=STATE[k]||{}; STATE[k].c=val;
  }
  save(STATE); build();
}

function clearDay(){
  if(!confirm('Clear all logged values and checkmarks for this day?')) return;
  const day=PLAN[STATE.selectedWeek][STATE.selectedDay];
  day.blocks.forEach(b=>b.items.forEach(it=>{
    for(let s=1;s<=it.sets;s++){ const k=setKey(STATE.selectedWeek,STATE.selectedDay,it.name,s); delete STATE[k]; }
  }));
  save(STATE); build();
}

function copyLastWeek(item){
  if(STATE.selectedWeek<=1){ alert('No previous week to copy from.'); return; }
  for(let s=1;s<=item.sets;s++){
    const prev=setKey(STATE.selectedWeek-1,STATE.selectedDay,item.name,s);
    const cur=setKey(STATE.selectedWeek,STATE.selectedDay,item.name,s);
    const pv=STATE[prev];
    if(pv && pv.w!=null){ STATE[cur]=STATE[cur]||{}; STATE[cur].w=pv.w; }
  }
  save(STATE); build();
}

// Initialize
window.addEventListener('DOMContentLoaded',()=>{
  const wk=$('#week'), dy=$('#day'); wk.innerHTML=''; dy.innerHTML='';
  for(let i=1;i<=6;i++){ const o=document.createElement('option'); o.value=i; o.text=`Week ${i}`; wk.appendChild(o); }
  for(let i=1;i<=5;i'){ const o=document.createElement('option'); o.value=i; o.text=`Day ${i}`; dy.appendChild(o); }
  wk.addEventListener('change',e=>{STATE.selectedWeek=parseInt(e.target.value,10); save(STATE); build();});
  dy.addEventListener('change',e=>{STATE.selectedDay=parseInt(e.target.value,10); save(STATE); build();});
  build();
});

// Service worker
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{ navigator.serviceWorker.register('./sw.js'); });
}
