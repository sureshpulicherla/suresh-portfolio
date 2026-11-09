/* No framework, no backend, no build tools. This runs on GitHub Pages. */
(() => {
'use strict';
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const copy = obj => JSON.parse(JSON.stringify(obj));
const STORAGE = 'suresh-portfolio-v2-studio-preview';
const THEME_STORAGE = 'suresh-portfolio-color-theme';
function applyTheme(theme, persist=false){
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  const button = document.getElementById('theme-toggle');
  if(button){
    const isLight = next === 'light';
    button.setAttribute('aria-pressed',String(isLight));
    button.setAttribute('aria-label',isLight?'Switch to dark mode':'Switch to light mode');
    button.querySelector('.theme-toggle-icon').textContent = isLight ? '☾' : '☀';
    button.querySelector('.theme-toggle-label').textContent = isLight ? 'DARK MODE' : 'LIGHT MODE';
    button.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content = next === 'light' ? '#f8f7f2' : '#080c12';
  if(persist){ try{ localStorage.setItem(THEME_STORAGE,next); }catch{} }
}

const studioEnabled = new URLSearchParams(location.search).get('studio') === '1';
let data = copy(SITE_DATA);
let activeFilter = 'all';
let activeTemple = 0;
let bikeModel = 0, bikeColor = 0, bikeExhaust = 0, bikeWheel = 0;
let viewer = null, audioContext = null, audioNodes = [], tuneInterval = null, ambiencePlaying = false;
let studioTab = 'profile', studioSelection = 0;
let toastTimer = null;
const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const cleanLink = value => {try {const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}};
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const notify = message => {const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3300);};
const stopAudio = () => {
  if(tuneInterval){clearInterval(tuneInterval);tuneInterval=null;}
  audioNodes.forEach(node=>{try{node.stop?.();}catch{} try{node.disconnect?.();}catch{}});audioNodes=[];
  if(audioContext){audioContext.close().catch(()=>{});audioContext=null;}
  ambiencePlaying=false;
  const btn=$('#ambient-btn');if(btn){btn.textContent='♪ PLAY AMBIENT SOUND';btn.setAttribute('aria-pressed','false');}
};
function playOriginalTones(kind){
  stopAudio();
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx){notify('Audio is not supported in this browser');return false;}
  try{
    audioContext=new AudioCtx();
    if(kind==='ambient'){
      const gain=audioContext.createGain();gain.gain.value=.028;gain.connect(audioContext.destination);audioNodes.push(gain);
      [110,165,220].forEach((hz,i)=>{const oscillator=audioContext.createOscillator();oscillator.type=i===1?'triangle':'sine';oscillator.frequency.value=hz;oscillator.connect(gain);oscillator.start();audioNodes.push(oscillator);});
    }else{
      let step=0;const notes=[261.63,329.63,392,493.88,392,329.63,293.66,220];
      function tone(){if(!audioContext)return;const oscillator=audioContext.createOscillator();const gain=audioContext.createGain();const t=audioContext.currentTime;oscillator.type='sine';oscillator.frequency.setValueAtTime(notes[step++%notes.length],t);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.065,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+.23);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(t);oscillator.stop(t+.25);}
      tone();tuneInterval=setInterval(tone,310);
    }
    return true;
  }catch(error){console.warn('Audio unavailable',error);stopAudio();notify('Unable to start audio');return false;}
}
function projectGraphic(project){
  if(project.image)return `<img src="${esc(project.image)}" loading="lazy" alt="${esc(project.title)} concept artwork">`;
  if(project.id==='shopnest')return `<div class="project-graphic graphic-shop"><div class="mock-window"><div class="mock-browser"><i></i><i></i><i></i></div><div class="mock-bar">SHOPNEST / COLLECTION</div><div class="mock-products"><b>◈</b><b>⌘</b><b>✦</b></div></div><span class="mock-float">CART + CHECKOUT ↗</span></div>`;
  if(project.id==='tunehub')return `<div class="project-graphic graphic-tune"><div class="record"></div><div class="music-bars">${'<i></i>'.repeat(25)}</div></div>`;
  if(project.id==='aifood')return `<div class="project-graphic graphic-food"><div class="food-circle"></div><span class="food-score">ANALYZE / SAMPLE ↗</span></div>`;
  if(project.id==='aws')return `<div class="project-graphic graphic-aws"><div class="cloud-stack"><span>EC2</span><span>IAM</span><span>RDS</span></div></div>`;
  return `<img src="assets/tech_3d.webp" loading="lazy" alt="Abstract 3D technology illustration">`;
}
function renderProfile(){
  $('#hero-bio').textContent=data.profile.bio;
  const parts=data.profile.name.trim().split(/\s+/);
  $('#brand-name').innerHTML=esc(parts[0]||'SURESH')+(parts.length>1?'<br>'+esc(parts.slice(1).join(' ')):'');
  $('#footer-name').textContent=data.profile.name.toUpperCase();
  $('#hero-location').textContent=data.profile.location.toUpperCase();
  $('#hero-award').textContent=data.profile.award.toUpperCase();
  $('#hero-eyebrow').textContent=data.profile.eyebrow;
  $('#hero-portrait').src=data.profile.portrait;
  $('#email-link').href='mailto:'+data.profile.email.trim().replace(/[^a-zA-Z0-9@._+\-]/g,'');
  $('#linkedin-link').href=cleanLink(data.profile.linkedin)||'#contact';
  document.title=data.profile.name+' — Built Across Worlds';
}
function renderProjects(){
  const items=data.projects.filter(p=>activeFilter==='all'||p.category===activeFilter);
  const grid=$('#projects-grid');
  grid.innerHTML=items.map((p,idx)=>`<button class="project-card reveal visible" data-open-project="${esc(p.id)}" data-theme="${esc(p.theme||'mint')}" aria-label="Explore ${esc(p.title)} project">
    <div class="project-image">${projectGraphic(p)}<span class="project-cover-label">${esc(p.overline)}</span><span class="project-number">${String(idx+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}</span></div>
    <div class="project-body"><div class="project-meta">${esc(p.category==='software'?'SOFTWARE & SYSTEMS':'DESIGN & EXPERIMENTS')}</div><div class="project-title-row"><h3>${esc(p.title)}</h3><span aria-hidden="true">↗</span></div><p>${esc(p.subtitle)}</p><div class="tag-row">${(p.stack||[]).slice(0,4).map(s=>`<span>${esc(s)}</span>`).join('')}</div></div></button>`).join('');
  $$('.filter').forEach(btn=>{const on=btn.dataset.filter===activeFilter;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});
  const counts={all:data.projects.length,software:data.projects.filter(p=>p.category==='software').length,creative:data.projects.filter(p=>p.category==='creative').length};
  $$('.filter').forEach(btn=>{const span=$('span',btn);if(span)span.textContent=String(counts[btn.dataset.filter]).padStart(2,'0');});
}
function renderExperience(){
  $('#experience-list').innerHTML=data.experience.map((e,i)=>`<article class="exp-item ${i===0?'open':''}"><button type="button" class="exp-summary" data-expand="${esc(e.id)}" aria-expanded="${i===0?'true':'false'}"><div><span class="exp-type">${esc(e.type)}</span><div class="exp-period">${esc(e.period)}</div><h3>${esc(e.role)}</h3><div class="exp-org">${esc(e.organization)}</div></div><span class="exp-toggle" aria-hidden="true">+</span></button><div class="exp-details" ${i===0?'':'hidden'}><p>${esc(e.description)}</p><ul>${(e.highlights||[]).map(h=>`<li>${esc(h)}</li>`).join('')}</ul><div class="tag-row">${(e.skills||[]).map(s=>`<span>${esc(s)}</span>`).join('')}</div></div></article>`).join('');
}
function displayDemo(p){
  if(p.demo==='shopnest')return `<h3>TRY A MINI STOREFRONT SIMULATOR</h3><div class="demo-row"><button class="demo-btn" data-demo="add">+ ADD A SAMPLE ITEM</button><button class="demo-btn" data-demo="empty">CLEAR CART</button></div><div class="demo-result" id="demo-result">Cart items: <strong>0</strong> · Subtotal: <strong>₹0</strong><br>UI-only preview; no real store or checkout.</div>`;
  if(p.demo==='tunehub')return `<h3>ORIGINAL SYNTH AUDIO PREVIEW</h3><div class="demo-row"><button class="demo-btn" data-demo="tone">▶ PLAY ORIGINAL SAMPLE</button><button class="demo-btn" data-demo="stop">■ STOP</button></div><div class="demo-result">A short original synthesized pattern created by your browser; this is not TuneHub streaming.</div>`;
  if(p.demo==='aifood')return `<h3>EXPLORE SAMPLE NUTRITION RESULTS</h3><div class="demo-row"><button class="demo-btn" data-demo="food" data-food="dosa">MASALA DOSA</button><button class="demo-btn" data-demo="food" data-food="chicken">CHICKEN SALAD</button><button class="demo-btn" data-demo="food" data-food="oats">OATS BOWL</button></div><div class="demo-result" id="demo-result">Choose a sample to view illustrative values. This is not live AI analysis.</div>`;
  if(p.demo==='aws')return `<h3>CLICK THROUGH A SAMPLE DEPLOYMENT</h3><div class="demo-row"><button class="demo-btn" data-demo="aws" data-node="EC2">EC2</button><button class="demo-btn" data-demo="aws" data-node="IAM">IAM</button><button class="demo-btn" data-demo="aws" data-node="RDS">RDS</button></div><div class="demo-result" id="demo-result">Select a service to learn about its role in this example architecture.</div>`;
  return '';
}
let cartCount=0;
function openProject(id){
  const p=data.projects.find(item=>item.id===id);if(!p)return;
  if(p.demo==='bikes'||p.demo==='divine'){location.hash=p.demo==='bikes'?'garage':'atlas';return;}
  cartCount=0;
  $('#dialog-content').innerHTML=`<div class="dialog-overline">${esc(p.overline)}</div><h2 id="dialog-title">${esc(p.title)}<span style="color:var(--acid)">.</span></h2><p class="dialog-lead">${esc(p.description)}</p><div class="dialog-stack">${(p.stack||[]).map(s=>`<span>${esc(s)}</span>`).join('')}</div><h3>WHAT I WORKED ON</h3><ul class="dialog-highlights">${(p.highlights||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>${p.note?`<p class="dialog-note">${esc(p.note)}</p>`:''}<div class="dialog-demo">${displayDemo(p)}</div><div class="dialog-actions">${cleanLink(p.video)?`<a class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="${esc(cleanLink(p.video))}">WATCH ORIGINAL WALKTHROUGH ↗</a>`:''}<button class="btn btn-ghost" data-close-dialog="1">CLOSE DETAILS ×</button></div>`;
  $('#project-dialog').showModal();document.body.classList.add('modal-open');
}
function renderBikes(){
  $('#model-switch').innerHTML=data.bikes.map((b,i)=>`<button class="model-btn ${i===bikeModel?'selected':''}" data-bike-model="${i}" aria-pressed="${i===bikeModel}"><div><strong>${esc(b.name)}</strong><small>${esc(b.family)}</small></div><span>↗</span></button>`).join('');
  $('#paint-picker').innerHTML=data.bikeColors.map((c,i)=>`<button class="paint-swatch ${i===bikeColor?'selected':''}" data-paint="${i}" aria-label="${esc(c.name)}" aria-pressed="${i===bikeColor}" title="${esc(c.name)}" style="--swatch:${esc(c.hex)}"><span></span></button>`).join('');
  const exhaust=$('#exhaust-select'),wheel=$('#wheel-select');
  exhaust.innerHTML=data.exhausts.map((e,i)=>`<option value="${i}">${esc(e.name)} (+${e.hp} HP, ${money(e.cost)})</option>`).join('');exhaust.value=bikeExhaust;
  wheel.innerHTML=data.wheels.map((e,i)=>`<option value="${i}">${esc(e.name)} (${e.savings}, ${money(e.cost)})</option>`).join('');wheel.value=bikeWheel;
  updateBikeSpecs();
}
function updateBikeSpecs(){
  const bike=data.bikes[bikeModel],exhaust=data.exhausts[bikeExhaust],wheel=data.wheels[bikeWheel];
  if(!bike||!exhaust||!wheel)return;
  $('#spec-model').textContent=bike.name;
  $('#spec-hp').innerHTML=`${bike.hp+exhaust.hp} <small>HP</small>`;
  $('#spec-torque').textContent=bike.torque;
  $('#spec-speed').textContent=bike.speed;
  $('#spec-price').textContent=money(bike.basePrice+exhaust.cost+wheel.cost);
  if(viewer){viewer.setPaint(data.bikeColors[bikeColor].hex);viewer.setModel(bikeModel);viewer.setWheels(bikeWheel);}
}
function initViewer(){
  if(viewer){viewer.resize();return;}
  if(typeof window.createBikeViewer !== 'function')return fallbackViewer();
  try{viewer=window.createBikeViewer($('#bike-canvas'),data.bikeColors[bikeColor].hex);viewer.setModel(bikeModel);viewer.setWheels(bikeWheel);$('#viewer-status').innerHTML='<span class="online-dot"></span> LIVE 3D MODEL';}
  catch(error){console.warn('WebGL viewer unavailable',error);fallbackViewer();}
}
function fallbackViewer(){
  $('#bike-canvas').hidden=true;$('#bike-fallback').hidden=false;
  $('#viewer-status').textContent='STILL PREVIEW · 3D UNAVAILABLE';
  if(!window.THREE)$('#viewer-status').title='Three.js could not load. Check the internet connection.';
}
function renderTemples(){
  $('#temple-selector').innerHTML=data.temples.map((t,i)=>`<button class="temple-choice ${i===activeTemple?'selected':''}" data-temple="${i}" aria-pressed="${i===activeTemple}"><span>0${i+1} / ${esc(t.place)}</span><strong>${esc(t.title)}</strong></button>`).join('');
  const t=data.temples[activeTemple];
  $('#temple-detail').innerHTML=`<div><div class="temple-location">${esc(t.place)}</div><h2>${esc(t.title)}</h2></div><div><p>${esc(t.detail)}</p><span class="temple-mantra">${esc(t.mantra)}</span></div>`;
}
function showRoute(){
  const hash=location.hash.replace('#','');
  const bike=hash==='garage',divine=hash==='atlas';
  $('#page-main').hidden=bike||divine;$('#page-bikes').hidden=!bike;$('#page-divine').hidden=!divine;
  $('#site-footer').hidden=bike||divine;
  document.body.classList.toggle('immersive-route',bike||divine);
  if(!divine)stopAudio();
  if(viewer)viewer.setActive(bike);
  if(bike){renderBikes();initViewer();window.scrollTo({top:0,behavior:'instant'});}
  else if(divine){renderTemples();window.scrollTo({top:0,behavior:'instant'});}
  else if(hash){requestAnimationFrame(()=>{document.getElementById(hash)?.scrollIntoView({behavior:reduceMotion?'instant':'smooth'});});}
  else window.scrollTo({top:0,behavior:'instant'});
}
function savePreview(){if(!studioEnabled)return;try{localStorage.setItem(STORAGE,JSON.stringify(data));}catch{notify('Preview storage full; export data.js to keep changes.');}}
function exportData(){
  const raw=JSON.stringify(data,null,2).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  const blob=new Blob(['/** Editable portfolio content. No API keys or passwords. */\nconst SITE_DATA = '+raw+';\n'],{type:'text/javascript'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='data.js';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Downloaded data.js — replace js/data.js in your project folder.');
}
function resetPreview(){if(!confirm('Reset the local studio preview to the original file data?'))return;data=copy(SITE_DATA);try{localStorage.removeItem(STORAGE);}catch{}studioSelection=0;renderEverything();renderStudio();notify('Local preview reset.');}
const field=(label,name,value='',multiline=false,full=false)=>`<label class="studio-field ${full?'full':''}"><span>${esc(label)}</span>${multiline?`<textarea name="${esc(name)}">${esc(value)}</textarea>`:`<input name="${esc(name)}" value="${esc(value)}">`}</label>`;
const collection = () => studioTab==='projects'?data.projects:data.experience;
function renderStudio(){
  $$('.studio-tab').forEach(b=>b.classList.toggle('active',b.dataset.editView===studioTab));
  const root=$('#studio-body');
  if(studioTab==='profile'){
    const p=data.profile;
    root.innerHTML=`<form id="studio-profile-form" class="studio-fields">${field('Name','name',p.name)}${field('Location','location',p.location)}${field('Eyebrow','eyebrow',p.eyebrow,false,true)}${field('Introduction','bio',p.bio,true,true)}${field('Award / recognition','award',p.award)}${field('Email','email',p.email)}${field('LinkedIn URL','linkedin',p.linkedin,false,true)}${field('Portrait image path (replace asset in assets folder)','portrait',p.portrait,false,true)}<div class="studio-form-actions"><button type="submit">SAVE PROFILE PREVIEW</button></div></form>`;
    return;
  }
  const list=collection();studioSelection=Math.min(Math.max(studioSelection,0),list.length-1);
  const entry=list[studioSelection];
  root.innerHTML=`<div class="studio-list">${list.map((e,i)=>`<button class="${i===studioSelection?'selected':''}" data-edit-index="${i}"><span>${esc(studioTab==='projects'?e.title:e.role)}</span><span>EDIT ↗</span></button>`).join('')}</div><div class="studio-form-actions"><button class="secondary" data-studio-add="1">+ ADD ${studioTab==='projects'?'PROJECT':'EXPERIENCE'}</button></div>${entry?`<form id="studio-entry-form" class="studio-fields" style="margin-top:20px">${studioTab==='projects'?[
    field('Project title','title',entry.title),field('Category: software or creative','category',entry.category),field('Overline','overline',entry.overline,false,true),field('Subtitle','subtitle',entry.subtitle,false,true),field('Description','description',entry.description,true,true),field('Tech stack (comma-separated)','stack',(entry.stack||[]).join(', '),false,true),field('Highlights (one per line)','highlights',(entry.highlights||[]).join('\n'),true,true),field('Video URL','video',entry.video||'',false,true),field('Image path (optional)','image',entry.image||'',false,true),field('Preview note','note',entry.note||'',true,true)
    ].join(''):[field('Role / degree','role',entry.role),field('Organization','organization',entry.organization),field('Period','period',entry.period),field('Category','type',entry.type),field('Description','description',entry.description,true,true),field('Highlights (one per line)','highlights',(entry.highlights||[]).join('\n'),true,true),field('Skills (comma-separated)','skills',(entry.skills||[]).join(', '),false,true)].join('')}<div class="studio-form-actions"><button type="submit">SAVE ${studioTab==='projects'?'PROJECT':'EXPERIENCE'}</button><button class="danger" type="button" data-studio-delete="1">DELETE ENTRY</button></div></form>`:''}`;
}
function handleStudioSubmit(form){
  const fields=Object.fromEntries(new FormData(form).entries());
  if(studioTab==='profile'){
    Object.keys(data.profile).forEach(key=>{if(key in fields)data.profile[key]=fields[key].trim();});
    data.profile.email=data.profile.email.replace(/[\r\n]/g,'');
    if(!cleanLink(data.profile.linkedin))data.profile.linkedin=SITE_DATA.profile.linkedin;
  }else{
    const e=collection()[studioSelection];if(!e)return;
    ['title','category','overline','subtitle','description','video','image','note','role','organization','period','type'].forEach(k=>{if(k in fields)e[k]=fields[k].trim();});
    if('stack' in fields)e.stack=fields.stack.split(',').map(s=>s.trim()).filter(Boolean);
    if('skills' in fields)e.skills=fields.skills.split(',').map(s=>s.trim()).filter(Boolean);
    if('highlights' in fields)e.highlights=fields.highlights.split('\n').map(s=>s.trim()).filter(Boolean);
    if(e.video&&!cleanLink(e.video))e.video='';
    if(e.category&&!['software','creative'].includes(e.category))e.category='creative';
  }
  savePreview();renderEverything();renderStudio();notify('Local preview saved. Export data.js to publish your changes.');
}
function renderEverything(){renderProfile();renderProjects();renderExperience();renderBikes();renderTemples();}
function init(){
  applyTheme(document.documentElement.dataset.theme);
  $('#theme-toggle').addEventListener('click',()=>{applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light',true);});
  if(studioEnabled){try{const saved=JSON.parse(localStorage.getItem(STORAGE));if(saved&&saved.profile&&Array.isArray(saved.projects)&&Array.isArray(saved.experience))data=saved;}catch{}$('#studio-fab').hidden=false;}
  $('#year').textContent=new Date().getFullYear();renderEverything();
  $('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(data.profile.email);notify('Email copied!');}catch{notify('Email: '+data.profile.email);}});
  $('#menu-btn').addEventListener('click',()=>{const nav=$('#mobile-nav'),open=nav.hidden;nav.hidden=!open;$('#menu-btn').setAttribute('aria-expanded',String(open));});
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('#menu-btn').setAttribute('aria-expanded','false');}));
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;renderProjects();}));
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.route){location.hash=button.dataset.route==='bikes'?'garage':button.dataset.route==='divine'?'atlas':'lab';}
    if(button.dataset.openProject)openProject(button.dataset.openProject);
    if(button.dataset.expand){const parent=button.closest('.exp-item'),opening=!parent.classList.contains('open');parent.classList.toggle('open',opening);button.setAttribute('aria-expanded',String(opening));$('.exp-details',parent).hidden=!opening;}
    if(button.dataset.closeDialog)$('#project-dialog').close();
    if(button.dataset.demo){
      const result=$('#demo-result');
      if(button.dataset.demo==='add'){cartCount++;result.innerHTML=`Cart items: <strong>${cartCount}</strong> · Subtotal: <strong>${money(cartCount*1299)}</strong><br>Frontend-only illustration, no real checkout.`;}
      if(button.dataset.demo==='empty'){cartCount=0;result.innerHTML='Cart items: <strong>0</strong> · Subtotal: <strong>₹0</strong>';}
      if(button.dataset.demo==='tone'){if(playOriginalTones('tune'))notify('Playing original generated tones. Stop when finished.');}
      if(button.dataset.demo==='stop'){stopAudio();notify('Sample stopped.');}
      if(button.dataset.demo==='food'){
        const samples={dosa:['Masala Dosa',82,'8g','46g'],chicken:['Chicken Salad',96,'38g','12g'],oats:['Oats Bowl',94,'32g','38g']};const f=samples[button.dataset.food];result.innerHTML=`<strong>${f[0]} · ${f[1]}/100</strong><br>Sample protein: ${f[2]} · Sample carbs: ${f[3]} · Illustrative values only.`;
      }
      if(button.dataset.demo==='aws'){
        const descriptions={EC2:'EC2 can run a packaged Spring Boot API on a virtual server.',IAM:'IAM can assign roles and restrict what each cloud component can access.',RDS:'Amazon RDS can manage a relational database for application records.'};result.textContent=descriptions[button.dataset.node];
      }
    }
    if(button.dataset.bikeModel!==undefined){bikeModel=+button.dataset.bikeModel;renderBikes();}
    if(button.dataset.paint!==undefined){bikeColor=+button.dataset.paint;renderBikes();}
    if(button.dataset.temple!==undefined){activeTemple=+button.dataset.temple;renderTemples();}
    if(button.dataset.editView){studioTab=button.dataset.editView;studioSelection=0;renderStudio();}
    if(button.dataset.editIndex!==undefined){studioSelection=+button.dataset.editIndex;renderStudio();}
    if(button.dataset.studioAdd){
      if(studioTab==='projects')data.projects.push({id:'project-'+Date.now(),title:'New project',overline:'NEW / EXPERIMENT',subtitle:'Describe your project',category:'creative',description:'What did you build?',stack:[],highlights:[],video:'',image:'',theme:'mint',demo:'',note:'This entry was added in local Studio preview.'});
      else data.experience.push({id:'experience-'+Date.now(),role:'New experience',organization:'Organization',period:'2026',type:'EXPERIENCE',description:'What did you do?',skills:[],highlights:[]});
      studioSelection=collection().length-1;savePreview();renderEverything();renderStudio();
    }
    if(button.dataset.studioDelete){if(!confirm('Delete this entry from your local preview?'))return;collection().splice(studioSelection,1);studioSelection=0;savePreview();renderEverything();renderStudio();}
  });
  $('#exhaust-select').addEventListener('change',e=>{bikeExhaust=+e.target.value;updateBikeSpecs();});
  $('#wheel-select').addEventListener('change',e=>{bikeWheel=+e.target.value;updateBikeSpecs();});
  $('#bike-left').addEventListener('click',()=>viewer?.rotate(-.33));
  $('#bike-right').addEventListener('click',()=>viewer?.rotate(.33));
  $('#bike-reset').addEventListener('click',()=>viewer?.reset());
  $('#temple-explore-link').addEventListener('click',()=>$('#temple-explorer').scrollIntoView({behavior:reduceMotion?'instant':'smooth'}));
  $('#ambient-btn').addEventListener('click',()=>{if(ambiencePlaying){stopAudio();return;}if(playOriginalTones('ambient')){ambiencePlaying=true;$('#ambient-btn').textContent='■ STOP AMBIENT SOUND';$('#ambient-btn').setAttribute('aria-pressed','true');}});
  $('#project-dialog').addEventListener('close',()=>{stopAudio();document.body.classList.remove('modal-open');});
  $('#dialog-close').addEventListener('click',()=>$('#project-dialog').close());
  $('#project-dialog').addEventListener('click',event=>{if(event.target===$('#project-dialog'))$('#project-dialog').close();});
  window.addEventListener('hashchange',showRoute);showRoute();
  let scrolling=false;window.addEventListener('scroll',()=>{if(!scrolling){scrolling=true;requestAnimationFrame(()=>{$('#site-header').classList.toggle('scrolled',scrollY>28);scrolling=false;});}},{passive:true});
  if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{const glow=$('#cursor-glow');glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';},{passive:true});}
  if('IntersectionObserver' in window && !reduceMotion){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target);}})},{threshold:.1});$$('.journey-intro,.about-copy,.section-head,.lab-card').forEach(el=>{el.classList.add('reveal');io.observe(el);});}
  if(studioEnabled){
    $('#studio-open').onclick=()=>{renderStudio();$('#studio-dialog').showModal();};
    $('#studio-close').onclick=()=>$('#studio-dialog').close();
    $('#studio-export').onclick=exportData;$('#studio-export-inside').onclick=exportData;$('#studio-reset').onclick=resetPreview;
    $('#studio-dialog').addEventListener('click',e=>{if(e.target===$('#studio-dialog'))$('#studio-dialog').close();});
    $('#studio-dialog').addEventListener('submit',e=>{if(e.target.matches('form')){e.preventDefault();handleStudioSubmit(e.target);}});
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
