const APP_VERSION = '2.8.2-provenance-aware-source-integrity';
const RULES_LIBRARY = window.ASTARTES_RULES_LIBRARY || null;
const EDITION_SCHEMA_LIBRARY = window.ASTARTES_EDITION_SCHEMA_LIBRARY || null;
const CHAPTER_LIBRARY = window.ASTARTES_CHAPTER_LIBRARY || null;
const VERIFICATION_GROUPS = CHAPTER_LIBRARY?.verificationGroups || {
  'Generic Adeptus Astartes': ['Gladius Task Force','Anvil Siege Force','Firestorm Assault Force','Ironstorm Spearhead','Stormlance Task Force','Vanguard Spearhead','First Company Task Force','Librarius Conclave','Fulguris Task Force','Subversion Assets','Armoured Speartip','Bastion Task Force','Ceramite Sentinels','Headhunter Task Force','Orbital Assault Force'],
  'Space Wolves': ['Champions of Fenris','Legends of Saga and Song','Veterans of the Fang','Saga of the Beastslayer','Saga of the Bold','Saga of the Great Wolf','Saga of the Hunter'],
  'Blood Angels': ['Legacy of Grace','Encarmine Speartip','Wrath of the Doomed','The Angelic Host','The Lost Brethren','Angelic Inheritors','Liberator Assault Group','Rage-cursed Onslaught'],
  'Dark Angels': ['Dark Age Arsenal','Darkflight Pursuit','Interrogation Conclave','Company of Hunters','Inner Circle Task Force',"Lion's Blade Task Force",'Unforgiven Task Force','Wrath of the Rock'],
  'Ultramarines': ['Blade of Ultramar','Reclamation Force'],
  'Imperial Fists': ["Emperor's Shield"],
  'Salamanders': ["Forgefather's Seekers"],
  'Iron Hands': ['Hammer of Avernii'],
  'Raven Guard': ['Shadowmark Talon'],
  'White Scars': ['Spearpoint Task Force'],
  'Black Templars': ["Marshal's Household",'The Living Miracle','Wrathful Procession','Companions of Vehemence','Godhammer Assault Force','Vindication Task Force']
};
const VERIFICATION_DETACHMENTS = Object.values(VERIFICATION_GROUPS).flat();
const verificationState = JSON.parse(localStorage.getItem('astartesVerificationV1') || '{}');
function saveVerificationState(){ localStorage.setItem('astartesVerificationV1', JSON.stringify(verificationState)); }

// Test Lab ---------------------------------------------------------------
// Keeps development diagnostics separate from the normal print-first UI.
const testRuntime = { errors: [], lastRun: null };
const batchTestRuntime = { results: [], importedById: new Map(), running: false };
window.addEventListener('error', event => {
  testRuntime.errors.push({type:'error',message:event.message||'Unknown error',source:event.filename||'',line:event.lineno||0,column:event.colno||0,time:new Date().toISOString()});
  renderTestLab();
});
window.addEventListener('unhandledrejection', event => {
  const reason=event.reason instanceof Error ? `${event.reason.name}: ${event.reason.message}` : String(event.reason||'Unknown rejection');
  testRuntime.errors.push({type:'promise',message:reason,source:'unhandledrejection',line:0,column:0,time:new Date().toISOString()});
  renderTestLab();
});
const coreStratagems = [
  { name: 'Command Re-roll', cp: 1, phase: 'Any phase', text: 'WHEN: Just after you make an Advance, Charge, Damage, Hazard, Hit, Save or Wound roll, or a roll to determine a weapon’s Attacks for a friendly unit or model. TARGET: That unit or model. EFFECT: Re-roll that roll. If multiple dice are rolled together, re-roll one die; Charge rolls are re-rolled in full.' },
  { name: 'Epic Challenge', cp: 1, phase: 'Fight phase', text: 'WHEN: Just after a friendly Character unit is selected to fight. TARGET: That Character unit. EFFECT: Select one Character model in that unit; its melee weapons have Precision until the end of the phase.' },
  { name: 'Insane Bravery', cp: 1, phase: 'Command phase', text: 'WHEN: Battle-shock step of your Command phase, just before you make a Battle-shock roll for a friendly unit. TARGET: That unit. EFFECT: The Battle-shock roll is automatically successful. RESTRICTIONS: Once per battle.' },
  { name: 'Explosives', cp: 1, phase: 'Shooting phase', text: 'WHEN: Your Shooting phase. TARGET: One friendly unengaged Explosives or Grenades unit that is eligible to shoot and did not Advance this turn. EFFECT: Select one Explosives or Grenades model, then one visible unengaged enemy unit within 8 inches of that model. Roll six D6; each 4+ inflicts 1 mortal wound.' },
  { name: 'Crushing Impact', cp: 1, phase: 'Charge phase', text: 'WHEN: Just after a friendly Monster or Vehicle unit ends a Charge move. TARGET: That unit. EFFECT: Select an engaged enemy unit and one model from your unit engaged with it. Roll D6 equal to that model’s Toughness: each 1 inflicts 1 mortal wound on your unit; each 5+ inflicts 1 mortal wound on the enemy unit, to a maximum of 6.' },
  { name: 'Rapid Ingress', cp: 1, phase: 'Opponent Movement phase', text: 'WHEN: End of your opponent’s Movement phase. TARGET: One friendly unit in Strategic Reserves, excluding Aircraft. EFFECT: That unit makes an ingress move. RESTRICTIONS: Cannot be used in the first battle round.' },
  { name: 'Fire Overwatch', cp: 1, phase: 'Opponent Movement phase', text: 'WHEN: End of your opponent’s Movement phase. TARGET: One friendly unengaged unit, excluding Titanic units. EFFECT: The unit shoots using Snap Shooting: it can target one visible eligible enemy unit within 24 inches; attacks only hit on an unmodified 6 and Hit rolls cannot be re-rolled. AFTER SHOOTING: The unit cannot start an action for the rest of the phase.' },
  { name: 'Smokescreen', cp: 1, phase: 'Opponent Shooting phase', text: 'WHEN: Start of your opponent’s Shooting phase. TARGET: One friendly Smoke unit. EFFECT: Until the end of the phase, attacks targeting that unit, or a unit not fully visible because of models in that Smoke unit, gain the Benefit of Cover against those attacks.' },
  { name: 'Heroic Intervention', cp: 1, phase: 'Opponent Charge phase', text: 'WHEN: End of your opponent’s Charge phase. TARGET: One friendly unengaged unit within 12 inches of one or more enemy units; a Vehicle can only be selected if it is a Character or Walker. EFFECT: Resolve a charge with that unit using either Leap to Defend or Into the Fray as described in the Core Rules.' },
  { name: 'Counteroffensive', cp: 2, phase: 'Opponent Fight phase', text: 'WHEN: Fight step of your opponent’s Fight phase, just after an enemy unit has resolved its attacks. TARGET: One friendly unit eligible to fight. EFFECT: Until the end of the phase, that unit has Fights First and must be the next unit you select to fight.' }
];

const chapterThemes = {
  'space-wolves': {primary:'#354a5f', accent:'#b31f2b', paper:'#edf1f2', ink:'#111820', pattern:'chapter', chapter:'space-wolves'},
  'ultramarines': {primary:'#164b9b', accent:'#d4af37', paper:'#f3f4f7', ink:'#111827', pattern:'chapter', chapter:'ultramarines'},
  'blood-angels': {primary:'#9f171c', accent:'#f0c245', paper:'#f5eee8', ink:'#1c1111', pattern:'chapter', chapter:'blood-angels'},
  'dark-angels': {primary:'#173b2b', accent:'#d8c9a7', paper:'#eef0e8', ink:'#101713', pattern:'chapter', chapter:'dark-angels'},
  'black-templars': {primary:'#17191d', accent:'#f1eee6', paper:'#f3f1eb', ink:'#101114', pattern:'chapter', chapter:'black-templars'},
  'imperial-fists': {primary:'#d4a800', accent:'#b3261e', paper:'#f6f1df', ink:'#1b1810', pattern:'chapter', chapter:'imperial-fists'},
  'salamanders': {primary:'#176f45', accent:'#111111', paper:'#edf2ec', ink:'#101713', pattern:'chapter', chapter:'salamanders'},
  'white-scars': {primary:'#e7e7e4', accent:'#b51f2e', paper:'#f7f7f4', ink:'#171717', pattern:'chapter', chapter:'white-scars'},
  'raven-guard': {primary:'#1c2028', accent:'#b9c2cb', paper:'#eef0f2', ink:'#111318', pattern:'chapter', chapter:'raven-guard'},
  'iron-hands': {primary:'#17191d', accent:'#aeb7c2', paper:'#eceff1', ink:'#111318', pattern:'chapter', chapter:'iron-hands'},
  'deathwatch': {primary:'#111318', accent:'#c3c8ce', paper:'#eef0f2', ink:'#111318', pattern:'chapter', chapter:'deathwatch'},
  'crimson-fists': {primary:'#183d79', accent:'#b21f2d', paper:'#eef1f5', ink:'#111827', pattern:'chapter', chapter:'crimson-fists'},
  'flesh-tearers': {primary:'#68151b', accent:'#17191d', paper:'#f2ece8', ink:'#1a1112', pattern:'chapter', chapter:'flesh-tearers'},
  'generic-astartes': {primary:'#334155', accent:'#c7a64b', paper:'#f1f3f5', ink:'#111827', pattern:'chapter', chapter:'generic-astartes'}
};
const defaultTheme = {...chapterThemes['space-wolves']};

// Sprint 1: Smart Theme Engine ---------------------------------------------
// Calculate readable foreground colours for every theme surface. This keeps
// Chapter presets, custom colours and printed pages legible without requiring
// hand-tuned text colours for each component.
function normaliseHex(value='#000000') {
  const raw=String(value||'').trim().replace('#','');
  if (/^[0-9a-f]{3}$/i.test(raw)) return '#'+raw.split('').map(x=>x+x).join('').toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(raw)) return '#'+raw.toLowerCase();
  return '#000000';
}
function hexRgb(value) {
  const hex=normaliseHex(value).slice(1);
  return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));
}
function relativeLuminance(value) {
  const rgb=hexRgb(value).map(c=>c/255).map(c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4));
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
}
function contrastRatio(a,b) {
  const l1=relativeLuminance(a), l2=relativeLuminance(b);
  return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
}
function readableText(background, preferred='') {
  const candidates=['#ffffff','#111318'];
  if (preferred && /^#[0-9a-f]{3,6}$/i.test(preferred)) candidates.unshift(normaliseHex(preferred));
  return [...new Set(candidates)].sort((a,b)=>contrastRatio(background,b)-contrastRatio(background,a))[0];
}
function smartTheme(style={}) {
  const primary=normaliseHex(style.primary||defaultTheme.primary);
  const accent=normaliseHex(style.accent||defaultTheme.accent);
  const paper=normaliseHex(style.paper||defaultTheme.paper);
  return {
    ...style, primary, accent, paper,
    ink: readableText(paper, style.ink),
    primaryText: readableText(primary),
    accentText: readableText(accent),
    paperText: readableText(paper, style.ink),
    primaryContrast: contrastRatio(primary, readableText(primary)),
    accentContrast: contrastRatio(accent, readableText(accent)),
    paperContrast: contrastRatio(paper, readableText(paper, style.ink))
  };
}
function applyThemeVariables(target, rawStyle) {
  const style=smartTheme(rawStyle);
  target.setProperty('--primary',style.primary);
  target.setProperty('--accent',style.accent);
  target.setProperty('--paper',style.paper);
  target.setProperty('--ink',style.paperText);
  target.setProperty('--primary-text',style.primaryText);
  target.setProperty('--accent-text',style.accentText);
  target.setProperty('--paper-text',style.paperText);
  return style;
}

// Gold Master detachment merge -------------------------------------------------
// New Recruit is the source of truth for selected roster data. The versioned
// Rules Library is the *only* static fallback source. Older inline fallback
// registries were removed in v2.4.3 to prevent two copies of the same rule from
// drifting apart.
function mergeDetachmentLibrary(detachmentData={}) {
  const key=slug(detachmentData.name||detachmentData.id||'');
  const libraryEntry=RULES_LIBRARY?.lookupDetachment?.(detachmentData.name||detachmentData.id||'');
  if(!libraryEntry) return {...detachmentData,id:key||detachmentData.id,referenceSource:'New Recruit import',libraryStatus:'unavailable',libraryVersion:''};
  const importedRules=Array.isArray(detachmentData.rules)?detachmentData.rules:[];
  const importedStrats=Array.isArray(detachmentData.stratagems)?detachmentData.stratagems:[];
  const importedEnh=Array.isArray(detachmentData.enhancements)?detachmentData.enhancements:[];
  const libraryRuleNames=new Set((libraryEntry.rules||[]).map(r=>normaliseRuleName(r.name||'').toLowerCase()));
  const validImportedStrats=importedStrats.filter(r=>!libraryRuleNames.has(normaliseRuleName(r.name||'').toLowerCase()));
  const mergedStrats=mergeStratagemReferences(validImportedStrats,libraryEntry.stratagems||[]);
  return {
    ...libraryEntry,...detachmentData,id:key||detachmentData.id,
    // Exact selected New Recruit rule hierarchy wins. Static library content is
    // used only if the export does not contain a detachment rule.
    rules: importedRules.length ? importedRules : (libraryEntry.rules||[]),
    stratagems: mergedStrats,
    // Preserve full reference metadata separately from selected roster upgrades.
    enhancements: (libraryEntry.enhancements||[]).length ? (libraryEntry.enhancements||[]) : importedEnh,
    selectedEnhancements: importedEnh,
    referenceSource:`Rules Library ${RULES_LIBRARY.manifest.version}`,
    libraryStatus:libraryEntry.status,
    libraryVersion:RULES_LIBRARY.manifest.version
  };
}

const state = {
  roster: JSON.parse(localStorage.getItem('fenrisRoster') || '[]'),
  detachmentId: localStorage.getItem('fenrisDetachment') || 'champions',
  theme: JSON.parse(localStorage.getItem('fenrisTheme') || JSON.stringify(defaultTheme)),
  importedUnits: JSON.parse(localStorage.getItem('fenrisImportedUnits') || '[]'),
  importedRules: JSON.parse(localStorage.getItem('fenrisImportedRules') || '[]'),
  importedMeta: JSON.parse(localStorage.getItem('fenrisImportedMeta') || 'null'),
  themeTarget: 'global',
  chapterPreset: localStorage.getItem('fenrisChapterPreset') || 'space-wolves',
  importGraph: JSON.parse(localStorage.getItem('fenrisImportGraph') || 'null'),
  datasheetLayout: localStorage.getItem('fenrisDatasheetLayout') || 'model',
  sourceInspection: JSON.parse(localStorage.getItem('fenrisSourceInspection') || 'null'),
  structuredArmyModel: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const fallbackDetachment = { id: 'imported', name: 'Imported Detachment', rules: [], enhancements: [], stratagems: [], dp:0 };
const allDetachments = () => {
  const many = state.importedMeta?.detachmentsData;
  if (Array.isArray(many) && many.length) return many;
  return state.importedMeta?.detachmentData ? [state.importedMeta.detachmentData] : [];
};
const currentDetachment = () => allDetachments()[0] || fallbackDetachment;
const allEnhancements = () => dedupeBy(allDetachments().flatMap(d => d.enhancements || []), e => `${slug(e.name||e.id||'enhancement')}|${e.points||0}`);
const detachmentDisplayName = () => allDetachments().map(d=>d.name).filter(Boolean).join(' + ') || 'Imported Detachment';
const totalDetachmentPoints = () => allDetachments().reduce((sum,d)=>sum+Number(d.dp||0),0);
const allUnits = () => [...state.importedUnits];
const unitById = (id) => allUnits().find(u => u.id === id);
const attachedToEntry = (attachmentEntryId) => state.roster.find(entry => entry.leaderId === attachmentEntryId || entry.supportId === attachmentEntryId);
const attachedAsLeaderToEntry = (entryId) => state.roster.find(entry => entry.leaderId === entryId);
const attachedAsSupportToEntry = (entryId) => state.roster.find(entry => entry.supportId === entryId);
const isSupportUnit = (unit) => !!unit && (unit.support === true || (unit.tags || []).some(tag => /(^|\b)support($|\b)/i.test(tag)) || /(^|\b)support($|\b)/i.test(unit.category || ''));
const unattachedSupportEntries = () => state.roster.filter(entry => { const unit=unitById(entry.unitId); return isSupportUnit(unit) && !attachedAsSupportToEntry(entry.id); });
const isCharacterUnit = (unit) => !!unit && !isSupportUnit(unit) && (unit.leader === true || (unit.tags || []).some(tag => /(^|\b)character($|\b)/i.test(tag)) || /character/i.test(unit.category || ''));
function canLeaderJoin(leader, host) {
  if (!leader || !host || leader.leader !== true || isCharacterUnit(host) || isSupportUnit(host)) return false;
  if (Array.isArray(leader.canLead) && leader.canLead.length) return leader.canLead.includes(host.id);
  // Unknown eligibility is not treated as permission. New Recruit normally exports the list.
  return leader.attachmentEligibility === 'unknown' ? true : false;
}
function canSupportJoin(support, host) {
  if (!support || !host || support.support !== true || isCharacterUnit(host) || isSupportUnit(host)) return false;
  if (Array.isArray(support.canSupport) && support.canSupport.length) return support.canSupport.includes(host.id);
  return support.attachmentEligibility === 'unknown' ? true : false;
}
function invalidAttachmentEntries() {
  const errors=[];
  state.roster.forEach(hostEntry=>{
    const host=unitById(hostEntry.unitId); if(!host) return;
    if(hostEntry.leaderId){
      const linked=state.roster.find(x=>x.id===hostEntry.leaderId); const leader=linked&&unitById(linked.unitId);
      if(!canLeaderJoin(leader,host)) errors.push({role:'Leader',name:leader?.name||'Unknown Leader',host:host.name});
    }
    if(hostEntry.supportId){
      const linked=state.roster.find(x=>x.id===hostEntry.supportId); const support=linked&&unitById(linked.unitId);
      if(!canSupportJoin(support,host)) errors.push({role:'Support',name:support?.name||'Unknown Support',host:host.name});
    }
  });
  return errors;
}
const cardStyleFor = (entry) => ({...state.theme, ...(entry.cardStyle || {})});
const rosterPoints = () => state.roster.reduce((sum, entry) => {
  const unit = unitById(entry.unitId);
  const enhancement = allEnhancements().find(e => e.id === entry.enhancementId);
  return sum + (unit?.points || 0) + (enhancement?.points || 0);
}, 0);

function saveState() {
  localStorage.setItem('fenrisRoster', JSON.stringify(state.roster));
  localStorage.setItem('fenrisDetachment', state.detachmentId);
  localStorage.setItem('fenrisTheme', JSON.stringify(state.theme));
  localStorage.setItem('fenrisImportedUnits', JSON.stringify(state.importedUnits));
  localStorage.setItem('fenrisImportedRules', JSON.stringify(state.importedRules));
  localStorage.setItem('fenrisImportedMeta', JSON.stringify(state.importedMeta));
  localStorage.setItem('fenrisChapterPreset', state.chapterPreset);
  localStorage.setItem('fenrisDatasheetLayout', state.datasheetLayout || 'model');
  if(state.sourceInspection) localStorage.setItem('fenrisSourceInspection', JSON.stringify(state.sourceInspection)); else localStorage.removeItem('fenrisSourceInspection');
  // The lossless graph can be large. Keep the full graph in memory for diagnostics
  // during the import session, but persist only its compact indexes so browser
  // storage cannot break on large tournament rosters.
  const graph=state.importGraph;
  const persistedGraph=graph ? {
    detachment:graph.detachment||'', detachments:graph.detachments||[], profileCount:graph.profileCount||graph.profiles?.length||0,
    ruleCount:graph.ruleCount||graph.rules?.length||0, stratagemCandidates:graph.stratagemCandidates||[], normalization:graph.normalization||null,
    sourceGraphSummary:graph.sourceGraph ? {version:graph.sourceGraph.version,selections:graph.sourceGraph.selections.length,profiles:graph.sourceGraph.profiles.length,rules:graph.sourceGraph.rules.length,categories:graph.sourceGraph.categories.length,costs:graph.sourceGraph.costs.length} : graph.sourceGraphSummary||null,
    fullSourceGraphPersisted:false
  } : null;
  try { localStorage.setItem('fenrisImportGraph', JSON.stringify(persistedGraph)); }
  catch(error){ console.warn('Import graph was not persisted:',error); localStorage.removeItem('fenrisImportGraph'); }
}

function init() {
  applyTheme();
  const layoutSelect=$('#datasheetLayoutDefault');
  if(layoutSelect){
    layoutSelect.value=state.datasheetLayout||'model';
    layoutSelect.addEventListener('change',e=>{state.datasheetLayout=e.target.value==='section'?'section':'model';saveState();renderCards();renderThemePreview();});
  }
  renderThemeTargets();
  syncThemeControls();
  bindEvents();
  renderAll();
}

function bindEvents() {
  $$('.tab').forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));
  $('#importNewRecruit').addEventListener('click', () => $('#newRecruitFile').click());
  $('#exportImportDiagnostics').addEventListener('click', exportImportDiagnostics);
  $('#exportDetachmentDiagnostics')?.addEventListener('click', exportDetachmentDiagnostics);
  $('#exportSourceInspection')?.addEventListener('click', exportSourceInspection);
  $('#runVerification')?.addEventListener('click', runCurrentVerification);
  $('#exportVerificationReport')?.addEventListener('click', exportVerificationReport);
  $('#resetVerification')?.addEventListener('click', () => { if(!confirm('Reset all verification results?')) return; Object.keys(verificationState).forEach(k=>delete verificationState[k]); saveVerificationState(); renderVerificationDashboard(); });
  $('#runFullTest')?.addEventListener('click', runFullTestSuite);
  $('#exportTestReport')?.addEventListener('click', exportTestReport);
  $('#clearTestErrors')?.addEventListener('click', () => { testRuntime.errors=[]; testRuntime.lastRun=null; renderTestLab(); });
  $('#selectBatchRosters')?.addEventListener('click', () => $('#batchRosterFiles')?.click());
  $('#batchRosterFiles')?.addEventListener('change', e => { runBatchRosterTests([...e.target.files]); e.target.value=''; });
  $('#clearBatchTests')?.addEventListener('click', () => { batchTestRuntime.results=[]; batchTestRuntime.importedById.clear(); renderBatchTestResults(); });
  const batchDrop=$('#batchDropZone');
  batchDrop?.addEventListener('click', () => $('#batchRosterFiles')?.click());
  batchDrop?.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#batchRosterFiles')?.click();} });
  ['dragenter','dragover'].forEach(type=>batchDrop?.addEventListener(type,e=>{e.preventDefault();batchDrop.classList.add('dragover');}));
  ['dragleave','drop'].forEach(type=>batchDrop?.addEventListener(type,e=>{e.preventDefault();batchDrop.classList.remove('dragover');}));
  batchDrop?.addEventListener('drop', e => runBatchRosterTests([...e.dataTransfer.files]));
  $('#batchTestResults')?.addEventListener('click', e => { const button=e.target.closest('[data-load-batch]'); if(button) loadBatchRoster(button.dataset.loadBatch); });
  $('#newRecruitFile').addEventListener('change', handleNewRecruitImport);
  $('#clearImportedData').addEventListener('click', clearImportedData);
  $('#clearRoster')?.addEventListener('click', () => { state.roster = []; saveState(); renderAll(); });
  $('#printCards').addEventListener('click', () => { document.body.classList.remove('print-rules'); switchView('cards'); requestAnimationFrame(() => window.print()); });
  $('#printRules')?.addEventListener('click', () => { document.body.classList.add('print-rules'); switchView('reference'); requestAnimationFrame(() => window.print()); });
  $('#generateArmyPack')?.addEventListener('click', generateArmyPack);
  $$('[data-pack-section]').forEach(input => input.addEventListener('change', renderPrintCenter));
  $('#rulesSearch')?.addEventListener('input', renderReference);
  $('#phaseFilter')?.addEventListener('change', renderReference);
  $('#usableOnly')?.addEventListener('change', renderReference);
  window.addEventListener('afterprint', () => { document.body.classList.remove('print-rules'); document.body.classList.remove('print-pack'); });
  $('#chapterPreset').addEventListener('change', applyChapterPreset);
  $('#themeTarget').addEventListener('change', e => { state.themeTarget = e.target.value; syncThemeControls(); renderThemePreview(); });
  ['themePrimary','themeAccent','themePaper','themeInk'].forEach(id => $('#' + id).addEventListener('input', updateTheme));
  $('#patternStyle').addEventListener('change', updateTheme);
  $('#resetTheme').addEventListener('click', () => { state.chapterPreset = 'space-wolves'; state.theme = {...chapterThemes['space-wolves']}; applyTheme(); saveState(); syncThemeControls(); renderCards(); renderThemePreview(); });
  $('#resetUnitTheme').addEventListener('click', () => { const entry = state.roster.find(x => x.id === state.themeTarget); if (!entry) return; entry.cardStyle = {}; saveState(); syncThemeControls(); renderCards(); renderThemePreview(); });
}

function switchView(id) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === id));
  $$('.view').forEach(v => v.classList.toggle('active-view', v.id === id));
  if (id === 'cards') renderCards();
  if (id === 'reference') renderReference();
  if (id === 'theme') { renderThemeTargets(); syncThemeControls(); renderThemePreview(); }
  if (id === 'print-center') renderPrintCenter();
}

function renderImportInspector() {
  const box=$('#importInspector'); if(!box) return;
  const graph=state.importGraph;
  if(!graph){ box.innerHTML='<p class="muted">Import a roster to inspect the parsed New Recruit structure.</p>'; return; }
  const rows=(graph.stratagemCandidates||[]).map(x=>`<li><strong>${escapeHtml(x.name||'Unnamed')}</strong><span>${escapeHtml(x.path.join(' › ')||x.type)}</span></li>`).join('');
  box.innerHTML=`<div class="inspector-summary"><span>${graph.profileCount||0} profiles</span><span>${graph.ruleCount||0} rules</span><span>${(graph.stratagemCandidates||[]).length} Stratagem candidates</span></div><details><summary>Detected Stratagem candidates</summary><ul class="inspector-list">${rows||'<li>No structured Stratagem profiles found in this roster export.</li>'}</ul></details>`;
}


function verificationKey(name=''){ return slug(name).replace(/^1st-company-task-force$/,'first-company-task-force'); }
function currentVerificationChecks(){
  const det=currentDetachment();
  const libraryEntry=RULES_LIBRARY?.lookupDetachment?.(det?.name||det?.id||'') || null;
  const missingStats=state.importedUnits.filter(u=>!u.stats||['M','T','SV','W','LD','OC'].some(k=>u.stats[k]===undefined||u.stats[k]===''));
  const invalidWeapons=state.importedUnits.flatMap(u=>(u.weapons||[]).filter(w=>[w.name,w.type,w.range,w.a,w.skill,w.s,w.ap,w.d].some(v=>v===undefined||v===null||String(v).trim()==='')));
  const attached=state.roster.flatMap(x=>[x.leaderId,x.supportId]).filter(Boolean);
  const duplicate=attached.some((id,i)=>attached.indexOf(id)!==i);
  const libraryReady=Boolean(det?.libraryStatus==='ready'||det?.referenceSource?.startsWith('Rules Library'));
  return [
    {id:'import',label:'Roster import',ok:state.importedUnits.length>0,detail:`${state.importedUnits.length} units`},
    {id:'detachment',label:'Detachment match',ok:VERIFICATION_DETACHMENTS.some(n=>verificationKey(n)===verificationKey(det?.name||'')),detail:det?.name||'Not found'},
    {id:'stats',label:'Model statblocks',ok:missingStats.length===0,detail:missingStats.length?`${missingStats.length} incomplete`:'Complete'},
    {id:'weapons',label:'Weapon profiles',ok:invalidWeapons.length===0,detail:invalidWeapons.length?`${invalidWeapons.length} invalid`:'Parsed'},
    {id:'leaders',label:'Leader attachments',ok:!duplicate,detail:duplicate?'Duplicate attachment':'Unique'},
    {id:'supports',label:'Support attachments',ok:unattachedSupportEntries().length===0,detail:unattachedSupportEntries().length?`${unattachedSupportEntries().map(e=>unitById(e.unitId)?.name||'Support').join(', ')} must be attached`:'All Support units are attached'},
    {id:'library',label:'Rules Library mapping',ok:libraryReady,detail:det?.libraryStatus||det?.referenceSource||'Not mapped'},
    {id:'rule',label:'Detachment rule',ok:Boolean(det?.rules?.length),detail:`${det?.rules?.length||0} loaded`},
    {id:'stratagems',label:'Detachment Stratagems',ok:(det?.stratagems?.length||0)>=(libraryEntry?.stratagems?.length||0) && Boolean(libraryEntry?.status==='ready'),detail:`${det?.stratagems?.length||0} loaded · ${libraryEntry?.stratagems?.length||0} expected`},
    {id:'pack',label:'Army Pack generator',ok:Boolean(state.roster.length&&$('#generateArmyPack')),detail:'Available'}
  ];
}
function runCurrentVerification(){
  const det=currentDetachment(); const key=verificationKey(det?.name||'');
  if(!key || !VERIFICATION_DETACHMENTS.some(n=>verificationKey(n)===key)){ alert('Import one of the supported Generic Astartes, Space Wolves, Blood Angels, Dark Angels or Black Templars test rosters first.'); return; }
  const checks=currentVerificationChecks();
  const previous=verificationState[key]||{};
  verificationState[key]={
    name:VERIFICATION_DETACHMENTS.find(n=>verificationKey(n)===key)||det.name,
    checkedAt:new Date().toISOString(), appVersion:APP_VERSION,
    automated:Object.fromEntries(checks.map(c=>[c.id,{ok:c.ok,detail:c.detail}])),
    manual:previous.manual||{datasheets:false,rules:false,print:false}, notes:previous.notes||''
  };
  saveVerificationState(); renderVerificationDashboard();
}
function setManualVerification(key,field,value){
  verificationState[key] ||= {name:VERIFICATION_DETACHMENTS.find(n=>verificationKey(n)===key)||key,automated:{},manual:{datasheets:false,rules:false,print:false}};
  verificationState[key].manual ||= {datasheets:false,rules:false,print:false};
  verificationState[key].manual[field]=value; verificationState[key].checkedAt=new Date().toISOString(); saveVerificationState(); renderVerificationDashboard();
}
function verificationStatus(record){
  if(!record) return 'pending';
  const auto=Object.values(record.automated||{}); const automatedPass=auto.length>=9&&auto.every(x=>x.ok);
  const manual=record.manual||{}; return automatedPass&&manual.datasheets&&manual.rules&&manual.print?'verified':'testing';
}
function renderVerificationDashboard(){
  const current=$('#verificationCurrent'), dashboard=$('#verificationDashboard'); if(!current||!dashboard)return;
  const verified=VERIFICATION_DETACHMENTS.filter(n=>verificationStatus(verificationState[verificationKey(n)])==='verified').length;
  const pct=Math.round(verified/VERIFICATION_DETACHMENTS.length*100);
  const det=currentDetachment(), key=verificationKey(det?.name||''), eligible=VERIFICATION_DETACHMENTS.some(n=>verificationKey(n)===key), rec=verificationState[key];
  current.innerHTML=`<div class="verification-summary"><div class="verification-ring" style="--progress:${pct}%"><span>${verified}/${VERIFICATION_DETACHMENTS.length}</span></div><div><strong>${verified} detachments verified</strong><div class="verification-progress" style="--progress:${pct}%"><i></i></div><small class="muted">Automated checks plus manual datasheet, rules and print review.</small></div></div>`;
  if(eligible && state.importedUnits.length){
    const checks=rec?.automated?Object.entries(rec.automated).map(([id,x])=>({id,label:id.replace(/(^|_)(\w)/g,(_,a,b)=>' '+b.toUpperCase()).trim(),...x})):currentVerificationChecks();
    const manual=rec?.manual||{datasheets:false,rules:false,print:false};
    current.innerHTML+=`<article class="verification-current-card"><h4>${escapeHtml(det.name)}</h4><small class="muted">Current roster · ${verificationStatus(rec).toUpperCase()}</small><div class="verification-check-grid">${checks.map(c=>`<div class="verification-mini ${c.ok?'ok':'fail'}"><b>${c.ok?'✓':'×'} ${escapeHtml(c.label)}</b><small>${escapeHtml(c.detail||'')}</small></div>`).join('')}</div><div class="verification-manual"><label><input type="checkbox" data-verify-manual="datasheets" ${manual.datasheets?'checked':''}> Datasheets visually checked</label><label><input type="checkbox" data-verify-manual="rules" ${manual.rules?'checked':''}> Rules cards checked</label><label><input type="checkbox" data-verify-manual="print" ${manual.print?'checked':''}> Army Pack PDF checked</label></div></article>`;
    current.querySelectorAll('[data-verify-manual]').forEach(input=>input.addEventListener('change',e=>setManualVerification(key,e.target.dataset.verifyManual,e.target.checked)));
  } else current.innerHTML+=`<p class="muted">Import one of the supported Generic Astartes, Space Wolves, Blood Angels, Dark Angels or Black Templars rosters and press <strong>Run verification</strong>.</p>`;
  dashboard.innerHTML=Object.entries(VERIFICATION_GROUPS).map(([group,names])=>{const groupVerified=names.filter(name=>verificationStatus(verificationState[verificationKey(name)])==='verified').length;return `<section class="verification-group"><div class="section-head"><h4>${escapeHtml(group)}</h4><span class="badge">${groupVerified}/${names.length}</span></div><div class="verification-table"><div class="verification-row header"><span>Detachment</span><span>Status</span><span>Checks</span><span>Last tested</span></div>${names.map(name=>{const k=verificationKey(name),r=verificationState[k],status=verificationStatus(r),auto=Object.values(r?.automated||{}),pass=auto.filter(x=>x.ok).length,date=r?.checkedAt?new Date(r.checkedAt).toLocaleDateString():'—';return `<div class="verification-row"><strong>${escapeHtml(name)}</strong><span class="verification-status ${status}">${status.toUpperCase()}</span><span>${auto.length?`${pass}/${auto.length}`:'—'}</span><span>${date}</span></div>`}).join('')}</div></section>`}).join('');
}
function exportVerificationReport(){
  const report={generatedAt:new Date().toISOString(),appVersion:APP_VERSION,scope:Object.entries(VERIFICATION_GROUPS).map(([name,list])=>`${list.length} ${name}`).join(' + '),summary:{verified:VERIFICATION_DETACHMENTS.filter(n=>verificationStatus(verificationState[verificationKey(n)])==='verified').length,total:VERIFICATION_DETACHMENTS.length},detachments:VERIFICATION_DETACHMENTS.map(name=>({name,status:verificationStatus(verificationState[verificationKey(name)]),...(verificationState[verificationKey(name)]||{})}))};
  const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='astartes-forge-verification-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}


function testResult(id,label,ok,detail='',group='Core') { return {id,label,ok:Boolean(ok),detail:String(detail||''),group}; }
function runFullTestSuite(){
  const results=[];
  const det=currentDetachment();
  const libraryEntry=RULES_LIBRARY?.lookupDetachment?.(det?.name||det?.id||'')||null;
  const visibleEntries=typeof printableEntries==='function'?printableEntries():[];
  const cards=$$('#cardsContainer .data-card');
  const theme=smartTheme(state.theme||defaultTheme);
  results.push(testResult('boot','Application boot',Boolean($('#importNewRecruit')&&$('#generateArmyPack')&&typeof handleNewRecruitImport==='function'),'Required controls and functions are available.','Application'));
  results.push(testResult('library','Rules Library loaded',Boolean(RULES_LIBRARY?.manifest&&RULES_LIBRARY?.lookupDetachment),RULES_LIBRARY?.manifest?`v${RULES_LIBRARY.manifest.version} · ${RULES_LIBRARY.manifest.totalDetachments||0} catalogue entries`:'Library unavailable','Application'));
  results.push(testResult('errors','No captured runtime errors',testRuntime.errors.length===0,testRuntime.errors.length?`${testRuntime.errors.length} error(s) captured`:'No JavaScript errors captured in this session.','Application'));
  results.push(testResult('import','Roster imported',state.importedUnits.length>0,`${state.importedUnits.length} units · ${state.roster.length} roster entries`,'Import'));
  results.push(testResult('meta','Roster metadata',Boolean(state.importedMeta?.name&&state.importedMeta?.detachment),state.importedMeta?`${state.importedMeta.name||'Unnamed'} · ${state.importedMeta.detachment||'No detachment'}`:'No metadata','Import'));
  results.push(testResult('detachment','Detachment library match',Boolean(libraryEntry),libraryEntry?`${libraryEntry.name} · ${libraryEntry.status}`:`No entry for ${det?.name||'unknown detachment'}`,'Rules'));
  const missingStats=state.importedUnits.filter(u=>!u.stats||['M','T','SV','W','LD','OC'].some(k=>u.stats[k]===undefined||u.stats[k]===''));
  results.push(testResult('stats','Model statblocks complete',missingStats.length===0,missingStats.length?missingStats.map(u=>u.name).slice(0,5).join(', '):'All imported units have the required statline fields.','Datasheets'));
  const weapons=state.importedUnits.flatMap(u=>(u.weapons||[]).map(w=>({unit:u.name,...w})));
  const invalidWeapons=weapons.filter(w=>[w.name,w.type,w.range,w.a,w.skill,w.s,w.ap,w.d].some(v=>v===undefined||v===null||String(v).trim()===''));
  results.push(testResult('weapons','Weapon profiles complete',invalidWeapons.length===0,invalidWeapons.length?invalidWeapons.slice(0,5).map(w=>`${w.unit}: ${w.name}`).join(', '):`${weapons.length} profiles parsed.`, 'Datasheets'));
  renderCards();
  const renderedCards=$$('#cardsContainer .data-card');
  results.push(testResult('cards','Datasheets rendered',state.roster.length===0||renderedCards.length===visibleEntries.length,`${renderedCards.length} rendered · ${visibleEntries.length} expected`,'Datasheets'));
  const expectation=libraryEntry?.verification?.expected||null;
  const loadedRules=det?.rules?.length||0;
  const expectedRules=expectation?.detachmentRules;
  results.push(testResult(
    'rule','Detachment rule completeness',
    ruleExpectationSatisfied(loadedRules,expectedRules),
    !libraryEntry ? 'No Rules Library entry' : !expectation ? 'No verification expectation configured' : `${loadedRules} loaded · ${ruleExpectationLabel(expectedRules)} expected`,
    'Rules'
  ));

  const structureCounts=detachmentStructureCounts(det||{});
  results.push(testResult(
    'rule-structure','Detachment rule structure',
    loadedRules>0 && structureCounts.withBody===loadedRules,
    `${structureCounts.rules} top-level · ${structureCounts.subRules} sub-rule${structureCounts.subRules===1?'':'s'} · ${structureCounts.restrictions} restriction${structureCounts.restrictions===1?'':'s'}`,
    'Rules'
  ));

  const loadedStratagems=det?.stratagems||[];
  const loadedNames=new Set(loadedStratagems.map(x=>String(x?.name||'').trim().toLowerCase()).filter(Boolean));
  const expectedStratagems=expectation?.stratagems;
  const expectedNames=(expectation?.stratagemNames||[]).filter(Boolean);
  const missingNames=expectedNames.filter(name=>!loadedNames.has(name.toLowerCase()));
  const unexpectedNames=expectedNames.length ? loadedStratagems.filter(x=>!expectedNames.some(n=>n.toLowerCase()===String(x?.name||'').trim().toLowerCase())).map(x=>x.name) : [];
  const stratagemOk=Number.isInteger(expectedStratagems)
    ? loadedStratagems.length===expectedStratagems && missingNames.length===0
    : false;
  let stratagemDetail='';
  if(!libraryEntry) stratagemDetail='No Rules Library entry';
  else if(!expectation) stratagemDetail='No verification expectation configured';
  else {
    stratagemDetail=`${loadedStratagems.length} loaded · ${expectedStratagems} expected`;
    if(missingNames.length) stratagemDetail+=` · Missing: ${missingNames.join(', ')}`;
    else if(expectedStratagems>loadedStratagems.length) stratagemDetail+=` · ${expectedStratagems-loadedStratagems.length} unnamed record(s) missing`;
    if(unexpectedNames.length) stratagemDetail+=` · Unexpected: ${unexpectedNames.join(', ')}`;
  }
  results.push(testResult('stratagems','Detachment Stratagem completeness',stratagemOk,stratagemDetail,'Rules'));

  const expectedEnhancements=expectation?.enhancements;
  const loadedEnhancements=det?.enhancements?.length||0;
  results.push(testResult(
    'enhancements','Enhancement completeness',
    Number.isInteger(expectedEnhancements) ? loadedEnhancements===expectedEnhancements : false,
    !libraryEntry ? 'No Rules Library entry' : !expectation ? 'No verification expectation configured' : `${loadedEnhancements} loaded · ${expectedEnhancements} expected`,
    'Rules'
  ));
  results.push(testResult('contrast','Theme contrast',theme.primaryContrast>=4.5&&theme.accentContrast>=4.5&&theme.paperContrast>=4.5,`primary ${theme.primaryContrast.toFixed(1)} · accent ${theme.accentContrast.toFixed(1)} · paper ${theme.paperContrast.toFixed(1)}`,'Theme'));
  let packOk=false,packDetail='';
  try{ const markup=buildArmyPackMarkup(); const doc=new DOMParser().parseFromString(`<div>${markup}</div>`,'text/html'); const sections=doc.querySelectorAll('[data-pack-output]').length; packOk=sections>=7 && !doc.querySelector('parsererror'); packDetail=`${sections} pack sections generated`; }catch(err){ packDetail=err.message; }
  results.push(testResult('pack','Army Pack preflight',packOk,packDetail,'Print'));
  let storageOk=false,storageDetail='';
  try{ JSON.stringify({roster:state.roster,meta:state.importedMeta,theme:state.theme}); storageOk=true; storageDetail='Current state is serialisable.'; }catch(err){storageDetail=err.message;}
  results.push(testResult('storage','Local state serialisation',storageOk,storageDetail,'Application'));
  testRuntime.lastRun={generatedAt:new Date().toISOString(),appVersion:APP_VERSION,roster:{name:state.importedMeta?.name||'',detachment:det?.name||'',units:state.importedUnits.length,points:rosterPoints()},summary:{passed:results.filter(x=>x.ok).length,total:results.length},results,errors:[...testRuntime.errors]};
  renderTestLab();
}
function renderTestLab(){
  const host=$('#testLabResults'); if(!host)return;
  const run=testRuntime.lastRun;
  if(!run){ host.innerHTML=`<div class="test-lab-empty"><strong>Ready to test</strong><p>Import a roster, then run the full test suite. Runtime errors are captured automatically.</p>${testRuntime.errors.length?`<p class="test-error-count">${testRuntime.errors.length} runtime error(s) already captured.</p>`:''}</div>`; return; }
  const pct=Math.round(run.summary.passed/run.summary.total*100);
  const groups=[...new Set(run.results.map(x=>x.group))];
  host.innerHTML=`<div class="test-summary"><div class="test-score ${pct===100?'pass':'warn'}">${run.summary.passed}/${run.summary.total}</div><div><h4>${escapeHtml(run.roster.detachment||'Current roster')}</h4><p>${pct}% passed · ${escapeHtml(run.roster.name||'Unnamed army')} · ${run.roster.points} pts</p></div></div>${groups.map(group=>`<section class="test-group"><h4>${escapeHtml(group)}</h4><div class="test-result-grid">${run.results.filter(x=>x.group===group).map(x=>`<article class="test-result ${x.ok?'pass':'fail'}"><span class="test-icon">${x.ok?'✓':'×'}</span><div><strong>${escapeHtml(x.label)}</strong><small>${escapeHtml(x.detail)}</small></div></article>`).join('')}</div></section>`).join('')}${run.errors.length?`<details class="test-errors"><summary>${run.errors.length} captured runtime error(s)</summary><pre>${escapeHtml(JSON.stringify(run.errors,null,2))}</pre></details>`:''}`;
}
function exportTestReport(){
  if(!testRuntime.lastRun) runFullTestSuite();
  const report=testRuntime.lastRun; if(!report)return;
  const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`astartes-forge-test-${verificationKey(report.roster.detachment||'roster')}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}


function sourceIntegrityReport(imported, mergedDetachments=[]) {
  const graph=imported?.importGraph?.sourceGraph;
  if(!graph) return {ok:true,status:'ambiguity',detail:'Source ambiguity: this import has no lossless ROSZ source graph, so completeness cannot be proven automatically.'};

  const selections=new Map((graph.selections||[]).map(x=>[x.id,x]));
  const profiles=new Map((graph.profiles||[]).map(x=>[x.id,x]));
  const rules=new Map((graph.rules||[]).map(x=>[x.id,x]));
  const errors=[];
  const warnings=[];
  const fail=message=>{ if(errors.length<12) errors.push(message); };
  const warn=message=>{ if(warnings.length<8) warnings.push(message); };

  // Layer 1 — prove the lossless source graph is internally complete.
  // Source ownership lives here. Presentation rows are allowed to merge later.
  (graph.selections||[]).forEach(sel=>{
    if(sel.parentId && !selections.has(sel.parentId)) fail(`Selection ${sel.name||sel.id} references missing parent ${sel.parentId}`);
    (sel.childIds||[]).forEach(id=>{ if(!selections.has(id)) fail(`Selection ${sel.name||sel.id} references missing child ${id}`); });
  });
  (graph.profiles||[]).forEach(profile=>{ if(!selections.has(profile.ownerSelectionId)) fail(`Profile ${profile.name||profile.id} has no source owner`); });
  (graph.rules||[]).forEach(rule=>{ if(!selections.has(rule.ownerSelectionId)) fail(`Rule ${rule.name||rule.id} has no source owner`); });
  (graph.categories||[]).forEach(category=>{ if(!selections.has(category.ownerSelectionId)) fail(`Category ${category.name||category.id} has no source owner`); });
  (graph.costs||[]).forEach(cost=>{ if(!selections.has(cost.ownerSelectionId)) fail(`Cost ${cost.name||cost.id} has no source owner`); });

  const profileValue=(profile,patterns)=>profile?.characteristics?.find(c=>patterns.some(p=>p.test(c.name||'')))?.value ?? '—';
  const unitRootIds=new Set((imported.units||[]).map(u=>u.sourceSelectionId).filter(Boolean));
  const representedWeaponProfiles=new Set();
  const renderedWeaponRows=[];

  const provenanceForWeapon=weapon=>{
    const records=Array.isArray(weapon?.sourceProfiles) && weapon.sourceProfiles.length
      ? weapon.sourceProfiles
      : [{
          sourceSelectionId:weapon?.sourceSelectionId||'',
          sourceProfileId:weapon?.sourceProfileId||'',
          modelSourceSelectionId:weapon?.modelSourceSelectionId||'',
          count:Number(weapon?.count||1)
        }];
    return records.filter(Boolean);
  };

  const compareWeaponValues=(unitName,weapon,source)=>{
    const pairs=[
      ['Range',weapon.range,profileValue(source,[/^Range$/i,/Rng/i])],
      ['A',weapon.a,profileValue(source,[/^A$/i,/Attacks/i])],
      ['Skill',weapon.skill,profileValue(source,[/^BS$/i,/^WS$/i,/Skill/i])],
      ['S',weapon.s,profileValue(source,[/^S$/i,/Strength/i])],
      ['AP',weapon.ap,profileValue(source,[/^AP$/i])],
      ['D',weapon.d,profileValue(source,[/^D$/i,/Damage/i])]
    ];
    pairs.forEach(([label,actual,expected])=>{
      if(String(actual??'—').trim()!==String(expected??'—').trim()) fail(`${unitName}: ${weapon.name} ${label} changed (${expected} → ${actual})`);
    });
  };

  (imported.units||[]).forEach(unit=>{
    if(unit.sourceSelectionId && !selections.has(unit.sourceSelectionId)) fail(`Unit ${unit.name} lost its source selection`);
    (unit.modelProfiles||[]).forEach(model=>{
      if(model.sourceSelectionId && !selections.has(model.sourceSelectionId)) fail(`${unit.name}: model ${model.name} lost its source selection`);
      if(model.sourceProfileId && !profiles.has(model.sourceProfileId)) fail(`${unit.name}: model ${model.name} lost its source profile`);
    });

    (unit.weapons||[]).forEach(weapon=>{
      renderedWeaponRows.push(weapon);
      const provenance=provenanceForWeapon(weapon);
      if(!provenance.length){ fail(`${unit.name}: weapon ${weapon.name} has no source provenance`); return; }
      const sourceProfiles=[];
      provenance.forEach(record=>{
        if(!record.sourceProfileId || !profiles.has(record.sourceProfileId)){
          fail(`${unit.name}: weapon ${weapon.name} lost source profile ${record.sourceProfileId||'(missing id)'}`);
          return;
        }
        const source=profiles.get(record.sourceProfileId);
        representedWeaponProfiles.add(record.sourceProfileId);
        sourceProfiles.push(source);
        // Do not compare a presentation owner to the source owner. A merged row can
        // legitimately represent profiles from several model/weapon selections.
        // Exact ownership remains authoritative in source.ownerSelectionId.
        if(!selections.has(source.ownerSelectionId)) fail(`${unit.name}: weapon ${weapon.name} source profile ${source.name||source.id} has no valid owner`);
      });
      // A visible row may merge only identical profiles. Checking it against every
      // represented source profile proves that aggregation has not changed stats.
      sourceProfiles.forEach(source=>compareWeaponValues(unit.name,weapon,source));
      if(Array.isArray(weapon.sourceProfiles) && weapon.sourceProfiles.length){
        const expectedCount=weapon.sourceProfiles.reduce((sum,r)=>sum+Math.max(1,Number(r.count||1)),0);
        if(Number(weapon.count||0)!==expectedCount) fail(`${unit.name}: weapon ${weapon.name} merged count changed (${expectedCount} → ${weapon.count})`);
      }
    });

    (unit.structuredAbilities||[]).forEach(ability=>{
      if(ability.sourceSelectionId && !selections.has(ability.sourceSelectionId)) fail(`${unit.name}: ability ${ability.name} lost its source selection`);
      if(ability.sourceProfileId && !profiles.has(ability.sourceProfileId)) fail(`${unit.name}: ability ${ability.name} lost its source profile`);
    });
    (unit.structuredRules||[]).forEach(rule=>{
      if(rule.sourceSelectionId && !selections.has(rule.sourceSelectionId)) fail(`${unit.name}: rule ${rule.name} lost its source selection`);
      if(rule.sourceRuleId && !rules.has(rule.sourceRuleId)) fail(`${unit.name}: rule ${rule.name} lost its source rule`);
    });
  });

  // Layer 2 — coverage. Every weapon profile belonging to an imported unit must
  // still be represented by at least one normalised/presentation provenance set.
  // This catches real data loss while allowing intentional many-to-one rendering.
  const expectedWeaponProfiles=(graph.profiles||[]).filter(profile=>{
    if(!graphProfileLooksLikeWeapon(profile)) return false;
    const owner=selections.get(profile.ownerSelectionId);
    return Boolean(owner && unitRootIds.has(owner.topId||owner.id));
  });
  expectedWeaponProfiles.forEach(profile=>{
    if(!representedWeaponProfiles.has(profile.id)) fail(`Weapon profile ${profile.name||profile.id} is present in ROSZ but absent from normalised provenance`);
  });

  (mergedDetachments||[]).forEach(det=>{
    if(det.sourceSelectionId && !selections.has(det.sourceSelectionId)) fail(`${det.name}: detachment source selection was lost`);
    if(/^New Recruit/i.test(det.detachmentRuleSource||'') && !(det.rules||[]).length) fail(`${det.name}: New Recruit detachment rule was not preserved`);
    (det.rules||[]).forEach(rule=>{
      if(rule.sourceType==='direct-rule' && rule.sourceId && ![...rules.values()].some(x=>x.sourceId===rule.sourceId || x.id===rule.sourceId)) fail(`${det.name}: rule ${rule.name} no longer maps to its source rule`);
      if(rule.sourceType==='direct-profile' && rule.sourceId && ![...profiles.values()].some(x=>x.sourceId===rule.sourceId || x.id===rule.sourceId)) fail(`${det.name}: rule ${rule.name} no longer maps to its source profile`);
    });
  });

  // Source warnings are informational. They never fabricate a Warhammer rules error.
  const sourceWarnings=imported?.sourceInspection?.warnings||[];
  sourceWarnings.forEach(x=>warn(String(x)));

  if(errors.length) return {ok:false,status:'loss',detail:`Data loss detected: ${errors.slice(0,3).join(' | ')}`};
  const mergeCount=renderedWeaponRows.filter(w=>Array.isArray(w.sourceProfiles)&&w.sourceProfiles.length>1).length;
  const coverage=`${representedWeaponProfiles.size}/${expectedWeaponProfiles.length} unit weapon source profiles represented`;
  if(warnings.length) return {ok:true,status:'ambiguity',detail:`Source intact · ${coverage}${mergeCount?` · ${mergeCount} merged presentation row(s)`:''}; source ambiguity noted: ${warnings.slice(0,2).join(' | ')}`};
  return {ok:true,status:'intact',detail:`Source intact · ${coverage}${mergeCount?` · ${mergeCount} merged presentation row(s)`:''} · ${(graph.selections||[]).length} selections · ${(graph.rules||[]).length} rules`};
}

function batchCheck(id,label,ok,detail='',status=''){ return {id,label,ok:Boolean(ok),detail:String(detail||''),status:status||((ok)?'intact':'loss')}; }
function analyseImportedRoster(imported,fileName=''){
  const rawDetachments=(Array.isArray(imported.detachmentsData)&&imported.detachmentsData.length)
    ? imported.detachmentsData
    : [imported.detachmentData || {id:imported.detachmentId||'imported',name:imported.detachment||'Imported Detachment',rules:[],enhancements:imported.enhancements||[],stratagems:imported.stratagems||[]}];
  const mergedDetachments=rawDetachments.map(d=>mergeDetachmentLibrary(d));
  const detachmentRows=mergedDetachments.map(merged=>{
    const libraryEntry=RULES_LIBRARY?.lookupDetachment?.(merged.name||merged.id||'')||null;
    const expectation=libraryEntry?.verification?.expected||null;
    const loadedRules=(merged.rules||[]).length, loadedStrats=(merged.stratagems||[]).length, loadedEnh=(merged.enhancements||[]).length;
    return {merged,libraryEntry,expectation,loadedRules,loadedStrats,loadedEnh};
  });
  const units=imported.units||[];
  const entries=imported.entries||[];
  const weapons=units.flatMap(u=>(u.weapons||[]).map(w=>({unit:u.name,...w})));
  const missingStats=units.filter(u=>!u.stats||['M','T','SV','W','LD','OC'].some(k=>u.stats[k]===undefined||u.stats[k]===null||String(u.stats[k]).trim()===''));
  const invalidWeapons=weapons.filter(w=>[w.name,w.type,w.range,w.a,w.skill,w.s,w.ap,w.d].some(v=>v===undefined||v===null||String(v).trim()===''));
  const duplicateLeaderIds=entries.flatMap(e=>[e.leaderId,e.supportId]).filter(Boolean).filter((id,i,a)=>a.indexOf(id)!==i);
  const detail=(field,expectedField)=>detachmentRows.map(r=>{
    const expected=r.expectation?.[expectedField];
    const loaded=r[field];
    return `${r.merged.name}: ${loaded}/${expectedField==='detachmentRules'?ruleExpectationLabel(expected):(Number.isInteger(expected)?expected:'?')}`;
  }).join(' · ');
  const allLibrary=detachmentRows.length>0&&detachmentRows.every(r=>Boolean(r.libraryEntry));
  const allRules=detachmentRows.length>0&&detachmentRows.every(r=>ruleExpectationSatisfied(r.loadedRules,r.expectation?.detachmentRules) && (r.merged.rules||[]).every(detachmentRuleHasMeaningfulContent));
  const allStrats=detachmentRows.length>0&&detachmentRows.every(r=>Number.isInteger(r.expectation?.stratagems)&&r.loadedStrats===r.expectation.stratagems);
  const allEnh=detachmentRows.length>0&&detachmentRows.every(r=>Number.isInteger(r.expectation?.enhancements)&&r.loadedEnh===r.expectation.enhancements);
  const integrity=sourceIntegrityReport(imported,mergedDetachments);
  const checks=[
    batchCheck('parse','ROSZ parsed',units.length>0,`${units.length} units · ${entries.length} entries`),
    batchCheck('detachment','Detachments recognised',mergedDetachments.length>0,mergedDetachments.map(d=>`${d.name}${d.dp?` (${d.dp}DP)`:''}`).join(' + ')||'No detachment found'),
    batchCheck('library','Rules Library match',allLibrary,detachmentRows.map(r=>r.libraryEntry?`${r.merged.name}: ready`:`${r.merged.name}: missing`).join(' · ')),
    batchCheck('stats','Model statblocks',missingStats.length===0,missingStats.length?missingStats.map(u=>u.name).slice(0,4).join(', '):'Complete'),
    batchCheck('weapons','Weapon profiles',invalidWeapons.length===0,invalidWeapons.length?invalidWeapons.slice(0,4).map(w=>`${w.unit}: ${w.name}`).join(', '):`${weapons.length} parsed`),
    batchCheck('leaders','Leader uniqueness',duplicateLeaderIds.length===0,duplicateLeaderIds.length?`${duplicateLeaderIds.length} duplicate attachment(s)`:'Unique'),
    batchCheck('rules','Detachment rules',allRules,detachmentRows.map(r=>{const c=detachmentStructureCounts(r.merged);return `${r.merged.name}: ${c.rules} rule(s), ${c.subRules} sub-rule(s), ${c.restrictions} restriction(s)`}).join(' · ')),
    batchCheck('stratagems','Detachment Stratagems',allStrats,detail('loadedStrats','stratagems')),
    batchCheck('enhancements','Enhancements',allEnh,detail('loadedEnh','enhancements')),
    batchCheck('integrity','Source integrity & completeness',integrity.ok,integrity.detail,integrity.status)
  ];
  return {id:crypto.randomUUID(),fileName,name:imported.name||fileName,detachment:mergedDetachments.map(d=>d.name).join(' + '),points:imported.points||0,units:units.length,passed:checks.filter(c=>c.ok).length,total:checks.length,checks,imported};
}
async function runBatchRosterTests(files=[]){
  const accepted=files.filter(f=>/\.(rosz|ros|xml|json)$/i.test(f.name));
  if(!accepted.length){ alert('Select one or more .rosz, .ros, .xml or .json roster files.'); return; }
  batchTestRuntime.running=true; batchTestRuntime.results=[]; batchTestRuntime.importedById.clear(); renderBatchTestResults();
  for(const file of accepted){
    try{
      const imported=await parseRosterFile(file);
      const result=analyseImportedRoster(imported,file.name);
      batchTestRuntime.results.push(result); batchTestRuntime.importedById.set(result.id,imported);
    }catch(error){
      batchTestRuntime.results.push({id:crypto.randomUUID(),fileName:file.name,name:file.name,detachment:'Import failed',points:0,units:0,passed:0,total:1,checks:[batchCheck('parse','ROSZ parsed',false,error?.message||String(error))]});
    }
    renderBatchTestResults();
  }
  batchTestRuntime.running=false; renderBatchTestResults();
}
function renderBatchTestResults(){
  const host=$('#batchTestResults'),summary=$('#batchSummary'); if(!host||!summary)return;
  const results=batchTestRuntime.results;
  if(!results.length){summary.textContent=batchTestRuntime.running?'Preparing tests…':'No batch tests run yet.';host.innerHTML='';return;}
  const passed=results.filter(r=>r.passed===r.total).length;
  summary.textContent=batchTestRuntime.running?`Testing ${results.length} roster(s)…`:`${passed}/${results.length} rosters fully passed · ${results.reduce((s,r)=>s+r.passed,0)}/${results.reduce((s,r)=>s+r.total,0)} checks passed`;
  host.innerHTML=`<div class="batch-results-grid">${results.map(r=>{const ok=r.passed===r.total;return `<article class="batch-result-card ${ok?'pass':'fail'}"><div class="batch-result-head"><div><h4>${escapeHtml(r.detachment||r.name)}</h4><small>${escapeHtml(r.fileName)} · ${r.units} units · ${r.points} pts</small></div><span class="batch-score">${r.passed}/${r.total}</span></div><div class="batch-checks">${r.checks.map(c=>{const stateClass=c.status==='ambiguity'?'warn':(c.ok?'ok':'fail');const icon=c.status==='ambiguity'?'⚠':(c.ok?'✓':'×');return `<div class="batch-check ${stateClass}"><span class="batch-check-icon">${icon}</span><div><b>${escapeHtml(c.label)}</b><small>${escapeHtml(c.detail)}</small></div></div>`}).join('')}</div>${batchTestRuntime.importedById.has(r.id)?`<div class="batch-actions"><button class="ghost" data-load-batch="${r.id}" type="button">Load in app</button></div>`:''}</article>`}).join('')}</div>`;
}
function loadBatchRoster(id){
  const imported=batchTestRuntime.importedById.get(id); if(!imported)return;
  applyImportedRoster(imported); setImportStatus(`<strong>Loaded from Batch Test Lab.</strong><br>${escapeHtml(imported.name)} · ${imported.points} pts · ${escapeHtml(imported.detachment||'')}`,'success');
  document.querySelector('.developer-panel')?.removeAttribute('open');
}

function renderSafely(label, fn) {
  try { fn(); return true; }
  catch (error) {
    console.error(`Render step failed (${label}):`, error);
    testRuntime.errors.push({type:'render', message:`${label}: ${error?.message || String(error)}`, stack:error?.stack || '', at:new Date().toISOString()});
    return false;
  }
}
function renderAll() {
  renderSafely('Import inspector', renderImportInspector);
  renderSafely('Verification dashboard', renderVerificationDashboard);
  renderSafely('Test Lab', renderTestLab);
  const pointsNode=$('#pointsTotal'); if(pointsNode) pointsNode.textContent = rosterPoints();
  renderSafely('Army Forge', renderRoster);
  renderSafely('Validation', renderValidation);
  renderSafely('Datasheets', renderCards);
  renderSafely('Rules & Stratagems', renderReference);
  renderSafely('Theme targets', renderThemeTargets);
  renderSafely('Theme controls', syncThemeControls);
  renderSafely('Theme preview', renderThemePreview);
  renderSafely('Forge Army Pack', renderPrintCenter);
  renderSafely('Data quality dashboard', renderDataQualityDashboard);
  renderSafely('Source & Edition Inspector', renderSourceEditionInspector);
}

function renderCatalogue() {
  const search = $('#unitSearch').value.toLowerCase();
  const container = $('#unitCatalogue'); container.innerHTML = '';
  allUnits().filter(u => u.name.toLowerCase().includes(search) || u.category.toLowerCase().includes(search)).forEach(unit => {
    const count = state.roster.filter(r => r.unitId === unit.id).length;
    const maxed = unit.max && count >= unit.max;
    const item = document.createElement('article'); item.className = 'catalogue-item';
    item.innerHTML = `<div><h3>${unit.name}${unit.imported ? ' <span class="badge imported-badge">Import</span>' : ''}</h3><p>${unit.category} · ${unit.points} pts · ${unit.size}</p></div><button class="add-button" ${maxed ? 'disabled' : ''}>+</button>`;
    item.querySelector('button').addEventListener('click', () => addUnit(unit));
    container.append(item);
  });
}

function addUnit(unit) {
  state.roster.push({ id: crypto.randomUUID(), unitId: unit.id, weaponId: unit.weaponOptions?.[0]?.id || '', enabledWeapons: unit.imported ? (unit.weapons || []).map(w => w.id || w.name) : null, leaderId: '', supportId: '', enhancementId: '', cardStyle: {} });
  saveState(); renderAll();
}

function modelGroup(unit) {
  const tags = (unit?.tags || []).map(x => String(x).toLowerCase());
  if (tags.includes('epic hero')) return 'Epic Heroes';
  if (isCharacterUnit(unit)) return 'Characters';
  if (tags.some(x => /vehicle|dreadnought|walker/.test(x))) return 'Vehicles';
  if (tags.some(x => /mounted|beast|cavalry/.test(x))) return 'Mounted & Beasts';
  if (tags.some(x => /infantry|terminator|jump pack/.test(x))) return 'Infantry';
  return unit?.category || 'Other Units';
}

function renderRoster() {
  const container = $('#roster'); container.innerHTML = '';
  if (!state.roster.length) { container.innerHTML = '<div class="empty">Import a New Recruit roster to begin.</div>'; return; }
  const groups = new Map();
  state.roster.forEach(entry => { const unit=unitById(entry.unitId); const key=modelGroup(unit); if(!groups.has(key)) groups.set(key,[]); groups.get(key).push(entry); });
  const order=['Epic Heroes','Characters','Infantry','Mounted & Beasts','Vehicles','Other Units'];
  [...groups.keys()].sort((a,b)=>order.indexOf(a)-order.indexOf(b)).forEach(groupName => {
    const section=document.createElement('section'); section.className='roster-group';
    section.innerHTML=`<div class="roster-group-title"><h3>${escapeHtml(groupName)}</h3><span>${groups.get(groupName).length}</span></div>`;
    groups.get(groupName).forEach(entry => {
      const unit = unitById(entry.unitId); const linkedHost = (unit.leader || unit.support) ? attachedToEntry(entry.id) : null;
      const validLeaders = state.roster.filter(other => { const leader=unitById(other.unitId); if(!leader||leader.leader!==true||!canLeaderJoin(leader,unit)) return false; const usedBy=attachedAsLeaderToEntry(other.id); return !usedBy||usedBy.id===entry.id; });
      const validSupports = state.roster.filter(other => { const support=unitById(other.unitId); if(!support||!isSupportUnit(support)||!canSupportJoin(support,unit)) return false; const usedBy=attachedAsSupportToEntry(other.id); return !usedBy||usedBy.id===entry.id; });
      const supportError=isSupportUnit(unit)&&!linkedHost;
      const article=document.createElement('article'); article.className=`roster-unit compact-unit ${linkedHost?'leader-linked':''} ${supportError?'support-attachment-error':''}`;
      const status=linkedHost?`<span class="link-status linked">Attached to ${escapeHtml(unitById(linkedHost.unitId).name)}</span>`:supportError?'<span class="link-status error">Support must be attached to a bodyguard unit</span>':unit.leader?'<span class="link-status available">May deploy independently or attach to a unit</span>':`${entry.leaderId?`<span class="link-status linked">Leader: ${escapeHtml(unitById(state.roster.find(x=>x.id===entry.leaderId)?.unitId)?.name||'')}</span>`:''}${entry.supportId?`<span class="link-status linked">Support: ${escapeHtml(unitById(state.roster.find(x=>x.id===entry.supportId)?.unitId)?.name||'')}</span>`:''}`;
      const enhancementMarkup=(unit.selectedEnhancements||[]).length ? `<div class="forge-enhancements">${unit.selectedEnhancements.map(e=>`<span class="enhancement-chip">Enhancement: ${escapeHtml(e.name||e)}</span>`).join('')}</div>` : '';
      article.innerHTML=`<div class="roster-unit-header"><div><h3>${escapeHtml(unit.name)}</h3><div class="meta">${escapeHtml(unit.size)} · ${unit.points} pts</div>${enhancementMarkup}${status}</div><button class="small-button remove">Remove</button></div><div class="config-grid compact-config">
      ${!unit.leader && !unit.support?`<label>Attached Leader<select class="leader-select"><option value="">None</option>${validLeaders.map(l=>`<option value="${l.id}" ${entry.leaderId===l.id?'selected':''}>${escapeHtml(unitById(l.unitId).name)}</option>`).join('')}</select></label><label>Attached Support<select class="support-select"><option value="">None</option>${validSupports.map(l=>`<option value="${l.id}" ${entry.supportId===l.id?'selected':''}>${escapeHtml(unitById(l.unitId).name)}</option>`).join('')}</select></label>`:''}
      </div>`;
      article.querySelector('.remove').addEventListener('click',()=>{state.roster=state.roster.filter(x=>x.id!==entry.id).map(x=>({...x,leaderId:x.leaderId===entry.id?'':x.leaderId,supportId:x.supportId===entry.id?'':x.supportId}));saveState();renderAll();});
      article.querySelector('.leader-select')?.addEventListener('change',e=>{const requested=e.target.value;if(requested)state.roster.forEach(other=>{if(other.id!==entry.id&&other.leaderId===requested)other.leaderId=''});entry.leaderId=requested;saveState();renderAll();});
      article.querySelector('.support-select')?.addEventListener('change',e=>{const requested=e.target.value;if(requested)state.roster.forEach(other=>{if(other.id!==entry.id&&other.supportId===requested)other.supportId=''});entry.supportId=requested;saveState();renderAll();});
      section.append(article);
    });
    container.append(section);
  });
}

function renderValidation() {
  const box=$('#validationMessages');
  if (!state.importedUnits.length) {
    box.innerHTML='<section class="validator-panel"><div class="validator-heading"><div><p class="eyebrow">IMPORT VALIDATOR</p><h3>Waiting for a roster</h3></div><span class="validator-score neutral">0 / 0</span></div><p class="muted">Import a New Recruit roster to check datasheets, weapons, rules and print readiness.</p></section>';
    return;
  }
  const det=currentDetachment();
  const attached=state.roster.flatMap(x=>[x.leaderId,x.supportId]).filter(Boolean);
  const duplicate=attached.some((id,i)=>attached.indexOf(id)!==i);
  const unattachedSupports=unattachedSupportEntries();
  const missingStats=state.importedUnits.filter(u=>!u.stats||['M','T','SV','W','LD','OC'].some(k=>u.stats[k]===undefined||u.stats[k]===''));
  const missingWeapons=state.importedUnits.filter(u=>!(u.weapons||[]).length);
  const invalidWeapons=state.importedUnits.flatMap(u=>(u.weapons||[]).filter(w=>{
    // V4 weapon profiles store Attacks as `a` (matching the XML characteristic).
    // A shared name is valid when profiles differ, e.g. Foehammer (Melee/Ranged).
    const required=[w.name,w.type,w.range,w.a,w.skill,w.s,w.ap,w.d];
    return required.some(value=>value===undefined||value===null||String(value).trim()==='');
  }).map(w=>`${u.name}: ${w.name||'unnamed weapon'}`));
  const checks=[
    {label:'Roster imported',ok:state.importedUnits.length>0,detail:`${state.importedUnits.length} units · ${rosterPoints()} points`},
    {label:'Every unit has a statline',ok:missingStats.length===0,detail:missingStats.length?missingStats.map(x=>x.name).join(', '):'All model profiles are ready'},
    {label:'Weapon profiles parsed',ok:invalidWeapons.length===0,warning:missingWeapons.length>0,detail:invalidWeapons.length?invalidWeapons.slice(0,3).join(', '):(missingWeapons.length?`${missingWeapons.length} units contain no weapon profiles`:'All imported weapons are usable')},
    {label:'Leader and Support attachments are unique',ok:!duplicate,detail:duplicate?'A Leader or Support model is attached more than once':'No duplicate attachments'},
    {label:'Every Support unit is attached',ok:unattachedSupports.length===0,detail:unattachedSupports.length?unattachedSupports.map(e=>unitById(e.unitId)?.name||'Support').join(', '):'All Support units have a bodyguard unit'},
    {label:'Attachment eligibility',ok:invalidAttachmentEntries().length===0,detail:invalidAttachmentEntries().length?invalidAttachmentEntries().map(e=>`${e.role} ${e.name} cannot join ${e.host}`).join(' · '):'All attached Leaders and Support models are eligible for their bodyguard units'},
    {label:'Detachment recognised',ok:Boolean(det?.name&&det.name!=='Imported Detachment'),detail:det?.name||'No detachment found'},
    {label:'Rules Library mapped',ok:Boolean(det?.libraryStatus==='ready'||det?.referenceSource?.startsWith('Rules Library')),warning:Boolean(det?.libraryStatus==='catalogued'),detail:det?.libraryStatus==='ready'?`Library ${det.libraryVersion||RULES_LIBRARY?.manifest?.version||''} · ready`:det?.libraryStatus==='catalogued'?'Detachment recognised; concise rule cards still require verified source coverage':(det?.referenceSource||'No library entry found')},
    {label:'Detachment rule loaded',ok:Boolean(det?.rules?.length),detail:det?.rules?.length?`${det.rules.length} rule${det.rules.length===1?'':'s'} loaded`:'No detachment rule available'},
    (()=>{const detachments=allDetachments();const rows=detachments.map(d=>{const lib=RULES_LIBRARY?.lookupDetachment?.(d.name||d.id||'')||null;const expected=lib?.verification?.expected?.stratagems;const loaded=d?.stratagems?.length||0;return{name:d.name||'Unknown detachment',loaded,expected,ok:Boolean(lib)&&Number.isInteger(expected)&&loaded===expected};});return{label:'Detachment Stratagems loaded',ok:rows.length>0&&rows.every(r=>r.ok),detail:rows.length?rows.map(r=>`${r.name}: ${r.loaded}/${Number.isInteger(r.expected)?r.expected:'?'}`).join(' · '):'No detachments detected'};})(),
    {label:'Print package ready',ok:Boolean(state.roster.length&&det?.name),detail:'Datasheets and selected references can be generated'}
  ];
  const passed=checks.filter(c=>c.ok).length;
  const status=passed===checks.length?'ready':passed>=checks.length-2?'review':'issues';
  box.innerHTML=`<section class="validator-panel ${status}"><div class="validator-heading"><div><p class="eyebrow">IMPORT VALIDATOR</p><h3>${status==='ready'?'Army pack ready':status==='review'?'Review recommended':'Import needs attention'}</h3></div><span class="validator-score ${status}">${passed} / ${checks.length}</span></div><div class="validator-grid">${checks.map(c=>`<article class="validator-check ${c.ok?'ok':c.warning?'warning':'error'}"><span class="validator-icon">${c.ok?'✓':c.warning?'!':'×'}</span><div><strong>${escapeHtml(c.label)}</strong><small>${escapeHtml(c.detail)}</small></div></article>`).join('')}</div></section>`;
}
function normaliseWeaponFingerprintValue(value='') {
  return String(value ?? '')
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function weaponProfileFingerprint(weapon) {
  // Only merge profiles when every rules-relevant value from New Recruit matches.
  // The weapon name remains part of the fingerprint so two differently named weapons
  // are never combined merely because their numeric profile happens to be identical.
  const keywords = dedupeWeaponKeywords(weapon?.keywords || [])
    .map(normaliseWeaponFingerprintValue)
    .sort();
  return [
    normaliseWeaponFingerprintValue(weapon?.name),
    normaliseWeaponFingerprintValue(weapon?.type),
    normaliseWeaponFingerprintValue(weapon?.range),
    normaliseWeaponFingerprintValue(weapon?.a),
    normaliseWeaponFingerprintValue(weapon?.skill),
    normaliseWeaponFingerprintValue(weapon?.s),
    normaliseWeaponFingerprintValue(weapon?.ap),
    normaliseWeaponFingerprintValue(weapon?.d),
    keywords.join('|')
  ].join('::');
}

function weaponSourceKey(weapon, index=0) {
  const selectionId=String(weapon?.sourceSelectionId||'').trim();
  const profileId=String(weapon?.sourceProfileId||'').trim();
  // A profile is uniquely owned by the exact New Recruit selection and profile.
  // If either identifier is unavailable, keep the row isolated rather than risk
  // merging unrelated legacy data.
  if(selectionId && profileId) return `${selectionId}::${profileId}`;
  return `unkeyed::${index}::${weapon?.id||crypto.randomUUID()}`;
}

function mergeIdenticalWeaponProfiles(weapons=[]) {
  // Step 1: retain each exact ROSZ weapon profile once. This prevents the same
  // source profile from being counted twice if it appears in more than one UI array.
  const uniqueSources=[];
  const seenSources=new Set();
  (weapons||[]).forEach((weapon,index)=>{
    if(!weapon) return;
    const sourceKey=weaponSourceKey(weapon,index);
    if(seenSources.has(sourceKey)) return;
    seenSources.add(sourceKey);
    uniqueSources.push({...weapon,_sourceKey:sourceKey});
  });

  // Step 2: merge only complete, identical display profiles. Every source profile
  // remains listed in sourceProfiles so coverage can be checked after aggregation.
  const merged=new Map();
  uniqueSources.forEach((weapon,index)=>{
    const hasStableSource=!String(weapon._sourceKey).startsWith('unkeyed::');
    const fingerprint=weaponProfileFingerprint(weapon);
    const key=hasStableSource ? fingerprint : `${fingerprint}::${weapon._sourceKey}`;
    const parsedCount=Number(weapon.count);
    const quantity=Number.isFinite(parsedCount) && parsedCount>0 ? parsedCount : 1;
    const sourceRecord={
      sourceKey:weapon._sourceKey,
      id:weapon.id||'',
      sourceSelectionId:weapon.sourceSelectionId||'',
      sourceProfileId:weapon.sourceProfileId||'',
      modelSourceSelectionId:weapon.modelSourceSelectionId||'',
      model:weapon.model||'',
      count:quantity
    };
    if(!merged.has(key)){
      const clean={...weapon}; delete clean._sourceKey;
      merged.set(key,{...clean,count:quantity,keywords:dedupeWeaponKeywords(weapon.keywords||[]),sourceProfiles:[sourceRecord]});
      return;
    }
    const target=merged.get(key);
    target.count+=quantity;
    target.sourceProfiles.push(sourceRecord);
    target.countSource='merged-identical-rosz-profiles';
  });

  const result=[...merged.values()];
  // Safety invariant: aggregation may reduce visible rows, but it may never lose
  // an exact source profile. Fall back to the original source rows if coverage fails.
  const covered=new Set(result.flatMap(row=>(row.sourceProfiles||[]).map(p=>p.sourceKey)));
  if(covered.size!==uniqueSources.length || uniqueSources.some(w=>!covered.has(w._sourceKey))){
    return uniqueSources.map(w=>{const clean={...w};delete clean._sourceKey;return clean;});
  }
  return result;
}

function getEntryWeapons(entry, unit) {
  if (!unit) return [];
  const selected = unit.weaponOptions?.find(w => w.id === entry.weaponId);
  const base = [...(unit.weapons || []), ...(selected ? [selected] : []), ...(unit.fixedWeapons || [])];
  // New Recruit already contains the selected loadout. Imported weapons are read-only.
  // Merge only profiles whose name, type, complete statline and local keyword set are
  // identical in the ROSZ data. Source profile ownership is retained for diagnostics.
  return mergeIdenticalWeaponProfiles(base);
}

function hasInvulnerableSave(stats={}) {
  const value=String(stats?.INV ?? '').trim();
  return Boolean(value && value!=='—' && value!=='-');
}
function statsBlock(unit, label, className='') {
  const stats=unit?.stats||{};
  const order=['M','T','SV','W','LD','OC'];
  const cells=order.map(k=>{
    const v=stats[k] ?? '—';
    if(k==='SV' && hasInvulnerableSave(stats)){
      const detail=String(stats.INV_DETAIL||`Invulnerable Save ${stats.INV}`);
      return `<div class="stat save-stat"><span class="inv-save-badge" title="${escapeHtml(detail)}">${escapeHtml(stats.INV)}</span><b>${escapeHtml(v)}</b><span>${k}</span></div>`;
    }
    return `<div class="stat"><b>${escapeHtml(v)}</b><span>${k}</span></div>`;
  }).join('');
  return `<section class="profile-block ${className}">${label?`<div class="profile-label">${escapeHtml(label)}</div>`:''}<div class="stats">${cells}</div></section>`;
}

function modelStatsBlocks(unit, className='', suppressSingleLabel=false) {
  const profiles = Array.isArray(unit.modelProfiles) && unit.modelProfiles.length
    ? unit.modelProfiles
    : [{name: unit.name, stats: unit.stats, count: 1}];

  // Models with an identical characteristic profile share one stat block. Keep the
  // exact New Recruit quantities in the label so a Sergeant/Pack Leader can share a
  // profile without losing the unit composition.
  const groups = new Map();
  profiles.forEach(profile => {
    const stats = profile.stats || unit.stats;
    const key = ['M','T','SV','W','LD','OC','INV','INV_DETAIL'].map(k => String(stats?.[k] ?? '—')).join('|');
    if (!groups.has(key)) groups.set(key, {stats, models:new Map(), total:0});
    const group=groups.get(key);
    const name = profile.name || unit.name;
    const count = Math.max(1, Number(profile.count || 1));
    group.models.set(name, (group.models.get(name) || 0) + count);
    group.total += count;
  });

  return [...groups.values()].map(group => {
    const parts=[...group.models].map(([name,count])=>count>1?`${count}× ${name}`:name);
    const label = suppressSingleLabel && groups.size===1 ? '' : (parts.length ? parts.join(' · ') : unit.name);
    return statsBlock({stats:group.stats}, label, `${className}${!label?' no-profile-label':''}`);
  }).join('');
}

function shortRuleText(text='', max=220) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = cut.lastIndexOf('.');
  return `${(sentence > 90 ? cut.slice(0, sentence + 1) : cut.replace(/\s+\S*$/, ''))}…`;
}

function normaliseRuleName(name='') { return KEYWORD_LIBRARY?.normalise?.(name) || String(name).replace(/[‐‑‒–—−]/g,'-').replace(/[\[\]()]/g,'').replace(/\s+/g,' ').replace(/\s*-\s*/g,'-').trim(); }
function keywordClassification(name='', text='') { return KEYWORD_LIBRARY?.classify?.(name,text) || {type:'ability',render:'description',canonical:normaliseRuleName(name)}; }
function isGenericAbilityName(name='') {
  const classification=keywordClassification(name,'');
  return classification.render==='keyword' || /^(core|faction|keywords?|abilities?|weapon abilities?|wargear abilities?)$/i.test(normaliseRuleName(name));
}
function isWeaponKeywordExplanation(name='', text='') {
  const classification=keywordClassification(name,text);
  if(classification.type==='weapon') return true;
  const nested=String(text||'').split(':')[0].trim();
  return KEYWORD_LIBRARY?.isWeapon?.(nested) || false;
}

function abilitiesSection(unit, heading, suppressModelLabels=false) {
  const groups = (unit.modelAbilities?.length ? unit.modelAbilities : [{model:unit.name, abilities:unit.abilities || []}])
    .map(group => ({
      model: group.model,
      abilities: (group.abilities || []).filter(Boolean)
        .filter(raw => !/\bclose[\s-]+quarters\b/i.test(String(raw)) && !/^\s*support\s*(?::|$)/i.test(String(raw)) && !/\banti\s*-\s*[^:]+(?:\s+\d\+)?\s*(?::|$)/i.test(String(raw)) && !isWeaponKeywordExplanation(String(raw), String(raw)))
        .map(a => {
          const raw = String(a).trim();
          const parts = raw.split(':');
          let name = parts.shift() || '';
          let text = parts.join(':').trim();
          // Some New Recruit exports wrap keyword rules as “Abilities: Anti-X: …”.
          // Inspect and discard the nested keyword title rather than rendering it as prose.
          if (/^(?:abilities?|weapon abilities?|wargear abilities?)$/i.test(name.trim()) && /^(?:anti\s*-\s*(?:x|[^:]+)|close[\s-]+quarters|support)(?:\b|:)/i.test(text)) return null;
          if (/^support$/i.test(name.trim()) || /^anti\s*-\s*/i.test(name.trim())) return null;
          return {name: name.trim(), text: String(text || name.trim()).trim()};
        }).filter(a => a && a.text && !/\bclose[\s-]+quarters\b/i.test(`${a.name} ${a.text}`) && !/^support$/i.test(a.name) && !/^anti\s*-\s*/i.test(a.name) && !isGenericAbilityName(a.name) && !isWeaponKeywordExplanation(a.name, a.text))
    })).filter(group => group.abilities.length);
  if (!groups.length) return '';
  return `<div class="card-section"><h4>${heading}</h4><div class="ability-groups">${groups.map(group => `<div class="ability-group">${suppressModelLabels?'':`<strong>${escapeHtml(group.model)}</strong>`}<ul class="ability-list">${group.abilities.map(a => `<li><b>${escapeHtml(a.name)}</b>${a.text && a.text !== a.name ? ` — ${escapeHtml(a.text)}` : ''}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
}

function rulesSection(unit, heading='Rules', suppressModelLabels=false) {
  if(!unit) return '';
  const groups=(unit.modelRules?.length ? unit.modelRules : [{model:unit.name,rules:unit.rules||[]}])
    .map(group=>({model:group.model,rules:[...new Set((group.rules||[]).map(x=>normaliseRuleName(typeof x==='string'?x:(x?.name||''))).filter(Boolean))]}))
    .filter(group=>group.rules.length);
  if(!groups.length) return '';
  return `<div class="card-section rules-title-section"><h4>${escapeHtml(heading)}</h4><div class="rule-title-groups">${groups.map(group=>`<div class="rule-title-group">${suppressModelLabels?'':`<strong>${escapeHtml(group.model)}</strong>`}<div class="rule-title-list">${group.rules.map(name=>`<span>${escapeHtml(name)}</span>`).join('')}</div></div>`).join('')}</div></div>`;
}
function combinedRulesSection(parts=[]) {
  const groups=[];
  parts.forEach(({unit,label})=>{
    if(!unit) return;
    const source=(unit.modelRules?.length?unit.modelRules:[{model:label||unit.name,rules:unit.rules||[]}]);
    source.forEach(group=>{
      const rules=[...new Set((group.rules||[]).map(x=>normaliseRuleName(typeof x==='string'?x:(x?.name||''))).filter(Boolean))];
      if(rules.length) groups.push({model:group.model||label||unit.name,rules});
    });
  });
  if(!groups.length) return '';
  return `<div class="card-section rules-title-section"><h4>Rules</h4><div class="rule-title-groups">${groups.map(group=>`<div class="rule-title-group"><strong>${escapeHtml(group.model)}</strong><div class="rule-title-list">${group.rules.map(name=>`<span>${escapeHtml(name)}</span>`).join('')}</div></div>`).join('')}</div></div>`;
}

const IMPORTANT_UNIT_KEYWORDS = { test(value=''){ return Boolean(KEYWORD_LIBRARY?.isUnit?.(value)); } };
const KEYWORD_DISPLAY_ORDER = [
  'Epic Hero','Character','Infantry','Mounted','Vehicle','Monster','Beast','Swarm','Walker','Dreadnought',
  'Battleline','Dedicated Transport','Transport','Aircraft','Titanic','Leader','Support','Psyker','Jump Pack',
  'Terminator','Fly','Hover','Deep Strike','Infiltrators','Scout','Stealth','Lone Operative','Fights First',
  'Feel No Pain','Deadly Demise','Firing Deck','Grenades','Smoke'
];
const FACTION_KEYWORD_PATTERNS = [
  /^imperium$/i,/^adeptus astartes$/i,/^space marines?$/i,/^space wolves$/i,/^ultramarines$/i,
  /^blood angels$/i,/^dark angels$/i,/^black templars$/i,/^imperial fists$/i,/^salamanders$/i,
  /^white scars$/i,/^raven guard$/i,/^iron hands$/i,/^deathwatch$/i,/^crimson fists$/i,
  /^flesh tearers$/i,/^blood ravens$/i,/^carcharodons$/i,/^raptors$/i,/^minotaurs$/i,
  /^lamenters$/i,/^exorcists$/i,/^silver templars$/i
];
function canonicalUnitKeyword(value='') {
  return KEYWORD_LIBRARY?.canonicalUnit?.(value) || normaliseRuleName(value);
}
function canonicalFactionKeyword(value='') {
  return normaliseRuleName(value)
    .replace(/^faction\s*:\s*/i,'')
    .replace(/^faction keyword\s*:\s*/i,'')
    .trim();
}
function isFactionKeyword(value='') {
  const clean=canonicalFactionKeyword(value);
  return FACTION_KEYWORD_PATTERNS.some(pattern=>pattern.test(clean));
}
function keywordOrder(value='') {
  const clean=canonicalUnitKeyword(value);
  const index=KEYWORD_DISPLAY_ORDER.findIndex(item=>clean===item || clean.startsWith(`${item} `));
  return index < 0 ? 999 : index;
}
function sortKeywords(values=[]) {
  return [...new Set(values.map(canonicalUnitKeyword).filter(Boolean))]
    .sort((a,b)=>keywordOrder(a)-keywordOrder(b) || a.localeCompare(b));
}
function unitKeywordData(unit) {
  if(!unit) return {core:[], faction:[]};
  const values=[...(unit.tags||[])];
  if(unit.leader) values.push('Leader','Character');
  if(unit.support) values.push('Support');
  const core=[]; const faction=[];
  values.map(x=>String(x).trim()).filter(Boolean).forEach(value=>{
    if(isFactionKeyword(value)) faction.push(canonicalFactionKeyword(value));
    else if(IMPORTANT_UNIT_KEYWORDS.test(value)) core.push(value);
  });
  return {core:sortKeywords(core), faction:sortKeywords(faction)};
}
function combinedKeywordData(...units) {
  const core=[]; const faction=[];
  units.filter(Boolean).forEach(unit=>{
    const data=unitKeywordData(unit); core.push(...data.core); faction.push(...data.faction);
  });
  // Roster metadata may identify the player's chosen Chapter, but that does not
  // make every generic Adeptus Astartes datasheet a Chapter-specific unit.
  // Only add broad faction keywords here; Chapter keywords must come from the
  // exact unit, attached Leader or attached Support model's imported tags.
  const metaValues=[state.importedMeta?.faction,state.importedMeta?.catalogue].filter(Boolean);
  metaValues.forEach(value=>{
    const text=String(value);
    if(/imperium/i.test(text)) faction.push('Imperium');
    if(/adeptus astartes|space marines/i.test(text)) faction.push('Adeptus Astartes');
  });
  return {core:sortKeywords(core), faction:sortKeywords(faction)};
}
function keywordFooter(unit, leader=null, support=null) {
  const data=combinedKeywordData(unit,leader,support);
  const core=data.core.length ? `<div class="card-section keyword-footer"><h4>Keywords</h4><p>${data.core.map(escapeHtml).join(', ')}</p></div>` : '';
  const faction=data.faction.length ? `<div class="card-section keyword-footer faction-keywords"><h4>Faction Keywords</h4><p>${data.faction.map(escapeHtml).join(', ')}</p></div>` : '';
  return core+faction;
}
function importantKeywords(unit, leader=null) {
  return combinedKeywordData(unit,leader).core;
}

function detectChapterName(values=[]) {
  const chapterNames = [
    'Space Wolves','Ultramarines','Blood Angels','Dark Angels','Black Templars','Imperial Fists',
    'Salamanders','White Scars','Raven Guard','Iron Hands','Deathwatch','Crimson Fists','Flesh Tearers',
    'Blood Ravens','Carcharodons','Raptors','Minotaurs','Lamenters','Exorcists','Silver Templars'
  ];
  const found = chapterNames.find(ch => values.some(v => String(v).toLowerCase().includes(ch.toLowerCase())));
  return found || '';
}
function chapterPresetForName(name='') {
  const key = slug(name);
  return chapterThemes[key] ? key : 'generic-astartes';
}
function factionNameFor(unit) {
  // Prefer the exact datasheet's imported keywords. Do not infer a Chapter from
  // the roster or selected detachments, because generic Space Marine units in a
  // Chapter roster do not automatically gain that Chapter keyword.
  const unitValues=[...(unit?.tags||[])].filter(Boolean).map(String);
  const chapter = detectChapterName(unitValues);
  if (chapter) return chapter;
  const unitFaction = unitValues.find(v=>/Adeptus Astartes|Space Marines/i.test(v));
  if (unitFaction) return String(unitFaction).replace(/\s*[-–|].*$/, '').trim();
  return 'Adeptus Astartes';
}

function abilityTextWeight(unit){
  const abilities=[...(unit?.abilities||[]),...(unit?.modelAbilities||[]).flatMap(group=>group?.abilities||[])];
  return abilities.reduce((sum,a)=>sum+String(typeof a==='string'?a:(a?.text||a?.description||a?.name||'')).length,0);
}
function printScaleForCard({unit,leader,support,unitWeapons=[],leaderWeapons=[],supportWeapons=[],enhancement=null}){
  const profiles=(unit?.modelProfiles?.length||1)+(leader?1:0)+(support?1:0);
  const weaponRows=unitWeapons.length+leaderWeapons.length+supportWeapons.length;
  const textWeight=abilityTextWeight(unit)+abilityTextWeight(leader)+abilityTextWeight(support)+(enhancement?String(enhancement.text||'').length:0);
  let score=profiles*3+weaponRows*1.45+textWeight/180;
  if(leader) score+=5;
  if(support) score+=7;
  if(leader&&support) score+=8;
  if(score>62) return .62;
  if(score>52) return .68;
  if(score>43) return .74;
  if(score>35) return .82;
  if(score>28) return .90;
  return 1;
}

function combinedSheetLayout(entry, leader, support) {
  if (!leader && !support) return 'model';
  return entry?.datasheetLayout || state.datasheetLayout || 'model';
}

function combinedAbilitiesSection(parts=[]) {
  const groups=parts.map(({unit,label})=>{
    if(!unit) return '';
    const html=abilitiesSection(unit,label);
    if(!html) return '';
    // abilitiesSection already creates a card-section; retain the source identity
    // but place every source consecutively within the shared abilities area.
    return html.replace('class="card-section"','class="card-section combined-ability-source"');
  }).filter(Boolean);
  if(!groups.length) return '';
  return `<div class="combined-abilities"><div class="unit-divider"><span>Abilities</span></div>${groups.join('')}</div>`;
}

function singleUnitBody({unit,unitWeapons,enhancement}) {
  return `
    ${modelStatsBlocks(unit, 'unit-profile', true)}
    ${weaponSection('Ranged Weapons', unitWeapons.filter(w => w.type === 'Ranged'))}
    ${weaponSection('Melee Weapons', unitWeapons.filter(w => w.type === 'Melee'))}
    ${abilitiesSection(unit, 'Abilities', true)}
    ${enhancement ? `<div class="card-section"><h4>Enhancement</h4><div class="ability-group"><strong>${enhancement.name}</strong><p>${enhancement.text}</p></div></div>` : ''}
    ${rulesSection(unit, 'Rules', true)}
    ${keywordFooter(unit)}
    <p class="card-note">Imported from New Recruit. Verify the roster against the latest official publication.</p>`;
}

function groupedBySectionBody({entry,unit,leader,support,leaderWeapons,supportWeapons,unitWeapons,enhancement}) {
  const allWeapons=mergeIdenticalWeaponProfiles([...leaderWeapons,...supportWeapons,...unitWeapons]);
  return `
    <div class="unit-divider"><span>Model Profiles</span></div>
    ${leader ? statsBlock(leader, `${leader.name} — Leader`, 'leader-profile') : ''}
    ${support ? statsBlock(support, `${support.name} — Support`, 'leader-profile support-profile') : ''}
    ${modelStatsBlocks(unit, 'unit-profile')}
    ${weaponSection('Ranged Weapons', allWeapons.filter(w=>w.type==='Ranged'))}
    ${weaponSection('Melee Weapons', allWeapons.filter(w=>w.type==='Melee'))}
    ${combinedAbilitiesSection([
      {unit:leader,label:`${leader?.name||''} — Abilities`},
      {unit:support,label:`${support?.name||''} — Abilities`},
      {unit,label:`${unit.name} — Abilities`}
    ])}
    ${enhancement ? `<div class="card-section"><h4>Enhancement</h4><div class="ability-group"><strong>${enhancement.name}</strong><p>${enhancement.text}</p></div></div>` : ''}
    ${combinedRulesSection([{unit:leader,label:leader?.name},{unit:support,label:support?.name},{unit,label:unit.name}])}
    ${keywordFooter(unit, leader, support)}
    <p class="card-note">Imported from New Recruit. Verify the roster against the latest official publication.</p>`;
}

function groupedByModelBody({unit,leader,support,leaderWeapons,supportWeapons,unitWeapons,enhancement}) {
  return `
    ${leader ? `<div class="attached-banner">Attached Leader</div>${statsBlock(leader, leader.name, 'leader-profile')}${weaponSection(`${leader.name} — Ranged Weapons`, leaderWeapons.filter(w => w.type === 'Ranged'), 'leader-weapons')}${weaponSection(`${leader.name} — Melee Weapons`, leaderWeapons.filter(w => w.type === 'Melee'), 'leader-weapons')}${abilitiesSection(leader, `${leader.name} — Abilities`)}` : ''}
    ${support ? `<div class="attached-banner support-banner">Attached Support</div>${statsBlock(support, support.name, 'leader-profile support-profile')}${weaponSection(`${support.name} — Ranged Weapons`, supportWeapons.filter(w => w.type === 'Ranged'), 'leader-weapons')}${weaponSection(`${support.name} — Melee Weapons`, supportWeapons.filter(w => w.type === 'Melee'), 'leader-weapons')}${abilitiesSection(support, `${support.name} — Abilities`)}` : ''}
    <div class="unit-divider"><span>Other Models in this Unit</span></div>
    ${modelStatsBlocks(unit, 'unit-profile')}
    ${weaponSection(`${unit.name} — Ranged Weapons`, unitWeapons.filter(w => w.type === 'Ranged'))}
    ${weaponSection(`${unit.name} — Melee Weapons`, unitWeapons.filter(w => w.type === 'Melee'))}
    ${abilitiesSection(unit, `${unit.name} — Abilities`)}
    ${enhancement ? `<div class="card-section"><h4>Enhancement</h4><div class="ability-group"><strong>${enhancement.name}</strong><p>${enhancement.text}</p></div></div>` : ''}
    ${combinedRulesSection([{unit:leader,label:leader?.name},{unit:support,label:support?.name},{unit,label:unit.name}])}
    ${keywordFooter(unit, leader, support)}
    <p class="card-note">Imported from New Recruit. Verify the roster against the latest official publication.</p>`;
}

function createCard(entry, unit, isPreview=false) {
  const clone = $('#unitCardTemplate').content.cloneNode(true);
  const card = clone.querySelector('.data-card');
  const style = smartTheme(isPreview ? state.theme : cardStyleFor(entry));
  card.classList.add(`pattern-${style.pattern}`, `chapter-${style.chapter || state.chapterPreset || 'custom'}`);
  card.style.setProperty('--card-primary', style.primary);
  card.style.setProperty('--card-accent', style.accent);
  card.style.setProperty('--card-paper', style.paper);
  card.style.setProperty('--card-ink', style.paperText);
  card.style.setProperty('--card-primary-text', style.primaryText);
  card.style.setProperty('--card-accent-text', style.accentText);
  card.style.setProperty('--card-paper-text', style.paperText);
  clone.querySelector('.card-kicker').textContent = factionNameFor(unit);
  const leaderEntry = entry.leaderId ? state.roster.find(x => x.id === entry.leaderId) : null;
  const leader = leaderEntry ? unitById(leaderEntry.unitId) : null;
  const supportEntry = entry.supportId ? state.roster.find(x => x.id === entry.supportId) : null;
  const support = supportEntry ? unitById(supportEntry.unitId) : null;
  clone.querySelector('.card-title').textContent = [unit.name, leader?.name, support?.name].filter(Boolean).join(' + ');
  const enhancement = allEnhancements().find(e => e.id === (leaderEntry?.enhancementId || entry.enhancementId));
  clone.querySelector('.card-points').textContent = `${unit.points + (leader?.points || 0) + (support?.points || 0) + (enhancement?.points || 0)} pts`;
  const body = clone.querySelector('.card-body');
  const leaderWeapons = leaderEntry && leader ? getEntryWeapons(leaderEntry, leader) : [];
  const supportWeapons = supportEntry && support ? getEntryWeapons(supportEntry, support) : [];
  const unitWeapons = getEntryWeapons(entry, unit);
  const printScale=printScaleForCard({unit,leader,support,unitWeapons,leaderWeapons,supportWeapons,enhancement});
  card.style.setProperty('--print-scale',String(printScale));
  card.dataset.printScale=String(printScale);
  const layout=combinedSheetLayout(entry,leader,support);
  card.dataset.combinedLayout=layout;
  body.innerHTML = !leader && !support
    ? singleUnitBody({unit,unitWeapons,enhancement})
    : layout==='section'
      ? groupedBySectionBody({entry,unit,leader,support,leaderWeapons,supportWeapons,unitWeapons,enhancement})
      : groupedByModelBody({unit,leader,support,leaderWeapons,supportWeapons,unitWeapons,enhancement});
  return clone;
}

function weaponSection(title, weapons, extraClass='') {
  if (!weapons.length) return '';
  return `<div class="card-section ${extraClass}"><h4>${title}</h4><table class="weapon-table"><colgroup><col class="weapon-name-col"><col><col><col><col><col><col></colgroup><thead><tr><th>Weapon</th><th>Rng</th><th>A</th><th>BS/WS</th><th>S</th><th>AP</th><th>D</th></tr></thead><tbody>${weapons.map(w=>`<tr><td><strong>${Number(w.count||1)>1?`<span class="weapon-count">${escapeHtml(w.count)}×</span> `:''}${escapeHtml(w.name)}</strong>${w.keywords?.length?`<div class="weapon-keywords">${w.keywords.map(k=>`<span>${escapeHtml(k)}</span>`).join('')}</div>`:''}</td><td>${escapeHtml(w.range)}</td><td>${escapeHtml(w.a)}</td><td>${escapeHtml(w.skill)}</td><td>${escapeHtml(w.s)}</td><td>${escapeHtml(w.ap)}</td><td>${escapeHtml(w.d)}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderCards() {
  const container = $('#cardsContainer'); container.innerHTML = '';
  const attached = new Set(state.roster.flatMap(x => [x.leaderId,x.supportId]).filter(Boolean));
  const printable = state.roster.filter(x => !attached.has(x.id));
  if (!printable.length) { container.innerHTML = '<div class="empty">Import units to generate datasheets.</div>'; return; }
  printable.forEach(entry => {
    const unit=unitById(entry.unitId);
    const composed=!!(entry.leaderId||entry.supportId);
    const wrapper=document.createElement('div');
    wrapper.className='datasheet-card-wrapper';
    if(composed){
      const controls=document.createElement('div');
      controls.className='datasheet-card-controls';
      const effective=entry.datasheetLayout||state.datasheetLayout||'model';
      controls.innerHTML=`<label><span>${escapeHtml(unit?.name||'Combined datasheet')} layout</span><select><option value="model" ${effective==='model'?'selected':''}>Grouped by model</option><option value="section" ${effective==='section'?'selected':''}>Grouped by section</option></select></label><button type="button" class="ghost use-default">Use default</button>`;
      controls.querySelector('select').addEventListener('change',e=>{entry.datasheetLayout=e.target.value;saveState();renderCards();});
      controls.querySelector('.use-default').addEventListener('click',()=>{delete entry.datasheetLayout;saveState();renderCards();});
      wrapper.append(controls);
    }
    wrapper.append(createCard(entry,unit));
    container.append(wrapper);
  });
}

function cleanCodexText(text='') {
  return String(text)
    .replace(/\r/g, '')
    .replace(/\|\^\^/g, '')
    .replace(/\^\^/g, '')
    .replace(/\*\*/g, '')
    .replace(/__+/g, '')
    .replace(/\[\s*([A-Z][A-Z0-9 -]+)\s*\]/g, '$1')
    .replace(/[•●▪◦]/g, '—')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
function splitStructuredRuleText(text='') {
  const clean=cleanCodexText(text);
  if(!clean) return [];
  // New Recruit can serialise structured characteristics either on separate lines
  // or in a single text node. Only uppercase field labels followed by ':' create
  // a boundary; ordinary words such as "target" inside EFFECT text do not.
  const normalised=clean.replace(/\s+(?=(?:WHEN|TARGET|EFFECT|RESTRICTIONS?|DURATION):)/g,'\n');
  const lines=normalised.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const parts=[];
  let current=null;
  for(const line of lines){
    const match=line.match(/^(WHEN|TARGET|EFFECT|RESTRICTIONS?|DURATION):\s*(.*)$/i);
    if(match){
      current={label:match[1].toUpperCase().replace(/^RESTRICTIONS$/,'RESTRICTION'),value:match[2].trim()};
      parts.push(current);
    } else if(current) {
      current.value=`${current.value} ${line}`.trim();
    } else {
      parts.push({label:'EFFECT',value:line});
    }
  }
  return parts;
}
function uniqueFieldValues(values=[]) {
  const seen=new Set();
  return values.map(v=>cleanCodexText(v)).filter(v=>{
    const key=v.toLowerCase().replace(/\s+/g,' ');
    if(!key || seen.has(key)) return false;
    seen.add(key); return true;
  });
}
function stratagemFields(rule={}) {
  const parts=splitStructuredRuleText(rule.text||'');
  const fromParts=label=>uniqueFieldValues(parts.filter(p=>p.label===label).map(p=>p.value));
  const explicit={
    WHEN:uniqueFieldValues([rule.when]),
    TARGET:uniqueFieldValues([rule.target]),
    EFFECT:uniqueFieldValues([rule.effect]),
    RESTRICTION:uniqueFieldValues([rule.restrictions,rule.restriction]),
    DURATION:uniqueFieldValues([rule.duration])
  };
  const choose=label=>explicit[label].length?explicit[label]:fromParts(label);
  let when=choose('WHEN');
  let target=choose('TARGET');
  let effect=choose('EFFECT');
  let restriction=choose('RESTRICTION');
  const duration=choose('DURATION');
  if(!when.length && rule.phase) when=[cleanCodexText(rule.phase)];
  if(!target.length) target=['One eligible unit described by this Stratagem.'];
  if(!effect.length){
    const unstructured=cleanCodexText(rule.text||'');
    effect=[unstructured || 'Resolve this Stratagem as described by its current rules reference.'];
  }
  if(duration.length) effect=uniqueFieldValues([...effect,...duration.map(v=>`Duration: ${v}`)]);
  return {
    when:when.join(' '),
    target:target.join(' '),
    effect:effect.join(' '),
    restriction:restriction.join(' ')
  };
}
function hasStructuredFields(text='') {
  const parts=splitStructuredRuleText(text);
  const labels=new Set(parts.map(p=>p.label));
  return ['WHEN','TARGET','EFFECT'].every(label=>labels.has(label));
}
function structuredStratagem(rule={}) {
  const fields=stratagemFields(rule);
  return {...rule,when:fields.when,target:fields.target,effect:fields.effect,restrictions:fields.restriction,text:[
    `WHEN: ${fields.when}`,
    `TARGET: ${fields.target}`,
    `EFFECT: ${fields.effect}`,
    fields.restriction && `RESTRICTION: ${fields.restriction}`
  ].filter(Boolean).join('\n')};
}
function mergeStratagemReferences(imported=[], library=[]) {
  const byName=new Map();
  library.forEach(rule => byName.set(normaliseRuleName(rule.name).toLowerCase(), structuredStratagem(rule)));
  imported.forEach(rule => {
    const key=normaliseRuleName(rule.name).toLowerCase();
    // Exact structured New Recruit data is authoritative; otherwise retain the
    // complete library reference instead of replacing it with partial prose.
    if (!byName.has(key) || hasStructuredFields(rule.text)) byName.set(key, structuredStratagem(rule));
  });
  return [...byName.values()];
}
function parseDetachmentRuleSections(text='') {
  const clean=cleanCodexText(text);
  if(!clean) return {body:'', restrictions:[], subRules:[], blocks:[]};

  const restrictionRegex=/(?:^|\n)\s*Restrictions?\s*:\s*/ig;
  const matches=[...clean.matchAll(restrictionRegex)];
  let body=clean;
  const restrictions=[];
  if(matches.length){
    const first=matches[0];
    body=clean.slice(0,first.index).trim();
    for(let i=0;i<matches.length;i++){
      const start=matches[i].index + matches[i][0].length;
      const end=i+1<matches.length ? matches[i+1].index : clean.length;
      const value=clean.slice(start,end).trim();
      if(value) restrictions.push(value);
    }
  }

  // Preserve source order so an affected unit remains next to its upgrade/rule.
  const subRules=[]; const blocks=[]; const proseLines=[];
  const flushProse=()=>{
    const value=proseLines.join('\n').replace(/\n{3,}/g,'\n\n').trim();
    proseLines.length=0;
    if(value) blocks.push({type:'prose',text:value});
  };
  for(const line of body.split('\n')){
    const trimmed=line.trim();
    if(!trimmed){ proseLines.push(''); continue; }
    const bullet=trimmed.match(/^(?:—|-|•|▪|◦|■)\s*(.+)$/);
    if(bullet){
      flushProse();
      const item={name:'',text:bullet[1].trim()}; subRules.push(item); blocks.push({type:'subRule',...item});
      continue;
    }
    const labelled=trimmed.match(/^([A-Z][A-Z0-9 '’\-]{2,60})\s*:\s*(.+)$/);
    if(labelled && !/^(WHEN|TARGET|EFFECT|DURATION|RESTRICTIONS?)$/i.test(labelled[1])){
      flushProse();
      const item={name:labelled[1].trim(),text:labelled[2].trim()}; subRules.push(item); blocks.push({type:'subRule',...item});
      continue;
    }
    proseLines.push(trimmed);
  }
  flushProse();
  restrictions.forEach(value=>blocks.push({type:'restriction',text:value}));
  const proseBody=blocks.filter(b=>b.type==='prose').map(b=>b.text).join('\n\n').trim();
  return {body:proseBody,restrictions,subRules,blocks};
}
function detachmentRuleStructure(rule={}) {
  const parsed=rule.sections || parseDetachmentRuleSections(rule.text||'');
  const blocks=Array.isArray(parsed.blocks)&&parsed.blocks.length ? parsed.blocks : [
    ...(parsed.body?[{type:'prose',text:parsed.body}]:[]),
    ...(Array.isArray(parsed.subRules)?parsed.subRules.map(x=>({type:'subRule',...x})):[]),
    ...(Array.isArray(parsed.restrictions)?parsed.restrictions.map(text=>({type:'restriction',text})):[])
  ];
  return {body:parsed.body||'',restrictions:Array.isArray(parsed.restrictions)?parsed.restrictions:[],subRules:Array.isArray(parsed.subRules)?parsed.subRules:[],blocks};
}
function formatDetachmentRuleText(rule={}) {
  const structure=detachmentRuleStructure(rule);
  const html=(structure.blocks||[]).map(block=>{
    if(block.type==='subRule') return `<div class=\"detachment-subrule\">${block.name?`<strong>${escapeHtml(block.name)}</strong>`:''}<p>${escapeHtml(block.text||'').replace(/\n/g,'<br>')}</p></div>`;
    if(block.type==='restriction') return `<div class=\"detachment-restrictions\"><strong>RESTRICTIONS</strong><p>${escapeHtml(block.text||'').replace(/\n/g,'<br>')}</p></div>`;
    return `<div class=\"detachment-rule-body\">${String(block.text||'').split(/\n\n+/).map(p=>`<p>${escapeHtml(p).replace(/\n/g,'<br>')}</p>`).join('')}</div>`;
  }).join('');
  return `<div class=\"official-rule-text detachment-rule-text\">${html}</div>`;
}
function detachmentRuleHasMeaningfulContent(rule={}) {
  const s=detachmentRuleStructure(rule);
  return Boolean(s.body || s.subRules.length);
}
function ruleExpectationSatisfied(loaded, expected) {
  if(Number.isInteger(expected)) return loaded===expected;
  if(expected && typeof expected==='object'){
    const min=Number.isFinite(expected.min)?expected.min:0;
    const max=Number.isFinite(expected.max)?expected.max:Infinity;
    return loaded>=min && loaded<=max;
  }
  return loaded>0;
}
function ruleExpectationLabel(expected) {
  if(Number.isInteger(expected)) return String(expected);
  if(expected && typeof expected==='object'){
    const min=Number.isFinite(expected.min)?expected.min:null;
    const max=Number.isFinite(expected.max)?expected.max:null;
    if(min!==null && max!==null) return `${min}-${max}`;
    if(min!==null) return `≥${min}`;
    if(max!==null) return `≤${max}`;
  }
  return '≥1';
}
function detachmentStructureCounts(det={}) {
  const rules=Array.isArray(det.rules)?det.rules:[];
  let subRules=0, restrictions=0, withBody=0;
  rules.forEach(rule=>{
    const s=detachmentRuleStructure(rule);
    if(s.body) withBody++;
    subRules+=s.subRules.length;
    restrictions+=s.restrictions.length;
  });
  return {rules:rules.length,withBody,subRules,restrictions};
}

function formatOfficialRuleText(text='') {
  const clean=cleanCodexText(text);
  if (!clean) return '';
  const parts=splitStructuredRuleText(clean);
  if(parts.length && parts.some(p=>['WHEN','TARGET','EFFECT','RESTRICTION','DURATION'].includes(p.label))){
    return `<div class="official-rule-text">${parts.map(p=>`<div class="official-rule-row"><strong>${escapeHtml(p.label)}</strong><p>${escapeHtml(p.value)}</p></div>`).join('')}</div>`;
  }
  return `<div class="official-rule-text"><p>${escapeHtml(clean)}</p></div>`;
}
function ruleCard(rule, extraClass='') {
  const isDetachment=String(extraClass||'').includes('detachment-rule') || rule?.kind==='detachment';
  return `<article class="rule-box official-rule ${extraClass}"><h3>${escapeHtml(cleanCodexText(rule.name))}</h3>${isDetachment?formatDetachmentRuleText(rule):formatOfficialRuleText(rule.text)}</article>`;
}
function stratagemPhaseClass(phase='') {
  const value=String(phase).toLowerCase().replace(/[’]/g,"'");
  if (/opponent|enemy/.test(value)) return 'phase-enemy';
  if (/command/.test(value)) return 'phase-command';
  if (/movement|advance|fall back|reinforcement/.test(value)) return 'phase-movement';
  if (/shooting|shoot/.test(value)) return 'phase-shooting';
  if (/charge/.test(value)) return 'phase-charge';
  if (/fight|combat/.test(value)) return 'phase-fight';
  if (/start|end of (?:your |the |opponent'?s )?(?:turn|battle round)/.test(value)) return 'phase-turn';
  if (/any|multiple|detachment/.test(value)) return 'phase-any';
  return 'phase-special';
}
function stratagemCard(s) {
  const rule=structuredStratagem(s);
  const cp = Number.isFinite(rule.cp) ? rule.cp : 1;
  const phaseClass=stratagemPhaseClass(rule.phase || 'Detachment');
  const fields=stratagemFields(rule);
  const rows=[
    ['WHEN',fields.when],
    ['TARGET',fields.target],
    ['EFFECT',fields.effect],
    fields.restriction ? ['RESTRICTION',fields.restriction] : null
  ].filter(Boolean);
  const body=`<div class="official-rule-text stratagem-fields">${rows.map(([label,value])=>`<div class="official-rule-row"><strong>${label}</strong><p>${escapeHtml(value)}</p></div>`).join('')}</div>`;
  return `<article class="stratagem official-stratagem compact-stratagem-card ${phaseClass}"><header><div class="stratagem-heading"><h3>${escapeHtml(cleanCodexText(rule.name))}</h3><span class="badge phase-badge ${phaseClass}">${escapeHtml(cleanCodexText(rule.phase || 'Detachment'))}</span></div><strong class="cp-badge"><span>${cp}</span><small>CP</small></strong></header>${body}</article>`;
}

function ruleMatchesSearch(rule, search='') {
  if (!search) return true;
  return `${rule.name || ''} ${rule.text || ''} ${rule.phase || ''}`.toLowerCase().includes(search.toLowerCase());
}
function stratagemPhaseMatches(rule, phase='all') {
  if (phase === 'all') return true;
  const hay = `${rule.phase || ''} ${rule.text || ''}`.toLowerCase();
  return phase === 'any' ? /any phase/.test(hay) : hay.includes(phase);
}
function stratagemUsableByArmy(rule) {
  const text = `${rule.name || ''} ${rule.text || ''}`.toLowerCase();
  const armyWords = new Set(state.importedUnits.flatMap(u => [u.name, ...(u.tags || [])]).flatMap(v => String(v).toLowerCase().split(/[^a-z0-9]+/)).filter(w => w.length > 3));
  const explicitTargets = [...text.matchAll(/\b(?:adeptus astartes|space wolves|ultramarines|blood angels|dark angels|black templars|deathwatch|infantry|vehicle|mounted|character|terminator|jump pack|dreadnought|psyker|smoke|grenades)\b/g)].map(m => m[0]);
  if (!explicitTargets.length) return true;
  return explicitTargets.some(target => target === 'adeptus astartes' || armyWords.has(target) || [...armyWords].some(w => target.includes(w) || w.includes(target)));
}
function renderReference() {
  const detachments = allDetachments();
  const rules = state.importedRules || [];
  const search = $('#rulesSearch')?.value.trim() || '';
  const phase = $('#phaseFilter')?.value || 'all';
  const usableOnly = !!$('#usableOnly')?.checked;
  const unitAbilityNames = new Set(state.importedUnits.flatMap(u => (u.modelAbilities || []).flatMap(g => (g.abilities || []).map(a => normaliseRuleName(String(a).split(':')[0]).toLowerCase()))));
  // Never render a selected Detachment Rule a second time under Army Rules.
  // Compare both source IDs and normalised name/text because New Recruit can expose
  // the same rule through more than one traversal path.
  const detachmentRuleKeys = new Set(detachments.flatMap(det => (det.rules || []).flatMap(r => {
    const id=String(r.sourceId||'').trim();
    const name=normaliseRuleName(r.name || '').toLowerCase();
    const text=cleanCodexText(r.text || '').toLowerCase().replace(/\s+/g,' ');
    return [id?`id:${id}`:'',name?`name:${name}`:'',text?`text:${text}`:''].filter(Boolean);
  })));
  let armyRules = rules.filter(r => {
    if(r.kind !== 'army') return false;
    const id=String(r.sourceId||'').trim();
    const name=normaliseRuleName(r.name || '').toLowerCase();
    const text=cleanCodexText(r.text || '').toLowerCase().replace(/\s+/g,' ');
    if(unitAbilityNames.has(name) || isWeaponKeywordExplanation(r.name, r.text)) return false;
    if((id&&detachmentRuleKeys.has(`id:${id}`)) || (name&&detachmentRuleKeys.has(`name:${name}`)) || (text&&detachmentRuleKeys.has(`text:${text}`))) return false;
    return true;
  });
  armyRules = dedupeBy(armyRules,r=>`${normaliseRuleName(r.name||'').toLowerCase()}|${cleanCodexText(r.text||'').toLowerCase().replace(/\s+/g,' ')}`).filter(r => ruleMatchesSearch(r, search));
  const filterStrats = list => list.filter(r => ruleMatchesSearch(r, search) && stratagemPhaseMatches(r, phase) && (!usableOnly || stratagemUsableByArmy(r)));
  const core = filterStrats(coreStratagems);
  $('#referenceDetachmentTitle').textContent = detachmentDisplayName();
  $('#armyRules').innerHTML = armyRules.map(r => ruleCard(r, 'army-rule')).join('') || '<div class="empty">No matching army-wide rules were found in this roster export.</div>';
  $('#coreStratagemList').innerHTML = core.map(stratagemCard).join('') || '<div class="empty">No Core Stratagems match the current filters.</div>';
  $('#referenceRules').innerHTML = detachments.map(det=>{
    const matching=(det.rules||[]).filter(r=>ruleMatchesSearch(r,search));
    return `<section class="detachment-reference-group"><div class="detachment-group-heading"><h3>${escapeHtml(det.name)}</h3><span>${Number(det.dp||0)} DP · ${escapeHtml(det.disposition||'')}</span></div>${matching.map(r=>ruleCard(r,'detachment-rule')).join('')||'<div class="empty">No matching Detachment Rule.</div>'}</section>`;
  }).join('') || '<div class="empty">No detachments found.</div>';
  $('#stratagemList').innerHTML = detachments.map(det=>{
    const strats=filterStrats(det.stratagems||[]);
    return `<section class="detachment-stratagem-group"><div class="detachment-group-heading"><h3>${escapeHtml(det.name)}</h3><span>${strats.length} Stratagem${strats.length===1?'':'s'}</span></div>${strats.length?strats.map(stratagemCard).join(''):'<div class="empty">This detachment has no Stratagems.</div>'}</section>`;
  }).join('') || '<div class="empty">No Detachment Stratagems found.</div>';
}

function printableEntries() {
  const attached = new Set(state.roster.flatMap(x => [x.leaderId,x.supportId]).filter(Boolean));
  return state.roster.filter(x => !attached.has(x.id));
}

function themeTargetEntry() {
  return state.themeTarget === 'global' ? null : state.roster.find(x => x.id === state.themeTarget) || null;
}

function renderThemeTargets() {
  const select = $('#themeTarget');
  if (!select) return;
  const entries = printableEntries();
  if (state.themeTarget !== 'global' && !entries.some(x => x.id === state.themeTarget)) state.themeTarget = 'global';
  select.innerHTML = '<option value="global">Global layout</option>' + entries.map(entry => {
    const unit = unitById(entry.unitId);
    const leaderEntry = entry.leaderId ? state.roster.find(x => x.id === entry.leaderId) : null;
    const leader = leaderEntry ? unitById(leaderEntry.unitId) : null;
    const supportEntry=entry.supportId?state.roster.find(x=>x.id===entry.supportId):null; const support=supportEntry?unitById(supportEntry.unitId):null;
    return `<option value="${entry.id}">${[unit.name,leader?.name,support?.name].filter(Boolean).join(' + ')}</option>`;
  }).join('');
  select.value = state.themeTarget;
}

function syncThemeControls() {
  const entry = themeTargetEntry();
  const style = entry ? cardStyleFor(entry) : state.theme;
  $('#themePrimary').value = style.primary;
  $('#themeAccent').value = style.accent;
  $('#themePaper').value = style.paper;
  $('#themeInk').value = style.ink;
  $('#patternStyle').value = style.pattern;
  $('#chapterPreset').value = state.chapterPreset || 'custom';
  $('#resetUnitTheme').disabled = !entry;
  $('#resetTheme').disabled = !!entry;
  $('#themeTargetStatus').innerHTML = entry
    ? `<span class="link-status linked">Custom layout for ${unitById(entry.unitId).name}</span><p class="muted">Changes apply only to this combined datasheet.</p>`
    : '<span class="link-status available">Global layout</span><p class="muted">Changes apply to every card without its own override.</p>';
}

function applyChapterPreset() {
  const key=$('#chapterPreset').value; state.chapterPreset=key;
  if (key!=='custom' && chapterThemes[key]) {
    const next={...chapterThemes[key]}; const entry=themeTargetEntry();
    if(entry) entry.cardStyle=next; else state.theme=next;
  }
  applyTheme(); saveState(); syncThemeControls(); renderCards(); renderThemePreview();
}
function updateTheme() {
  const next={primary:$('#themePrimary').value,accent:$('#themeAccent').value,paper:$('#themePaper').value,ink:$('#themeInk').value,pattern:$('#patternStyle').value,chapter:state.chapterPreset||'custom'};
  const entry=themeTargetEntry(); if(entry) entry.cardStyle=next; else {state.theme=next; applyTheme();}
  state.chapterPreset='custom'; $('#chapterPreset').value='custom'; saveState(); renderCards(); renderThemePreview(); syncThemeControls();
}
function applyTheme() {
  const computed=applyThemeVariables(document.documentElement.style,state.theme);
  // Keep the user-selected palette, but persist the automatically selected paper ink.
  state.theme={...state.theme,ink:computed.paperText};
}
function renderThemePreview() {
  const preview = $('#themePreview');
  if (!preview) return;
  preview.innerHTML = '';
  const entry = themeTargetEntry();
  if (entry) {
    preview.append(createCard(entry, unitById(entry.unitId)));
    return;
  }
  const sampleUnit = state.importedUnits[0] || {id:'preview-unit', name:'Imported Unit Preview', category:'Adeptus Astartes', points:0, size:'', tags:['Infantry','Adeptus Astartes'], stats:{M:'—',T:'—',SV:'—',W:'—',LD:'—',OC:'—'}, weapons:[], abilities:[], modelAbilities:[]};
  preview.append(createCard({unitId:sampleUnit.id, leaderId:'', supportId:'', enhancementId:'', cardStyle:{}}, sampleUnit, true));
}


function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}



function sourceInspectionStatusClass(inspection){
  if(!inspection) return 'warning';
  if(inspection.edition?.compatible && !(inspection.warnings||[]).length) return 'ok';
  return inspection.edition?.compatible ? 'warning' : 'fail';
}
function renderSourceEditionInspector(){
  const host=$('#sourceEditionInspector'); if(!host) return;
  const x=state.sourceInspection;
  if(!x){host.innerHTML='<p class="muted">Import a New Recruit roster to inspect its source schema.</p>';return;}
  const meta=x.meta||{}, edition=x.edition||{};
  const dets=allDetachments();
  const fallbackCount=dets.filter(d=>String(d.detachmentRuleSource||'').includes('Rules Library') || String(d.referenceSource||'').startsWith('Rules Library')).length;
  const directCount=Math.max(0,dets.length-fallbackCount);
  const profileTypes=Object.entries(x.profileTypes||{}).sort((a,b)=>b[1]-a[1]);
  const charNames=Object.entries(x.characteristicNames||{}).sort((a,b)=>b[1]-a[1]);
  const chapter=detectChapterName([meta.catalogueName,state.importedMeta?.faction,...allUnits().flatMap(u=>u.tags||[])])||'Generic / unresolved';
  const scopeRows=dets.map(d=>({name:d.name,scope:CHAPTER_LIBRARY?.resolveScope?.(d.name)})).filter(x=>x.scope);
  const structured=state.structuredArmyModel;
  const relationshipCount=(structured?.units||[]).reduce((sum,u)=>sum+Object.values(u.relationships||{}).reduce((n,list)=>n+(Array.isArray(list)?list.length:0),0),0);
  host.innerHTML=`
    <div class="source-inspector-status ${sourceInspectionStatusClass(x)}">
      <div><span class="eyebrow">DETECTED SCHEMA</span><strong>${escapeHtml(edition.label||'Unknown')}</strong><small>${escapeHtml(edition.method||'')} · confidence ${Math.round(Number(edition.confidence||0)*100)}%</small></div>
      <span class="source-status-pill">${edition.compatible?'COMPATIBLE':'REVIEW REQUIRED'}</span>
    </div>
    <div class="source-inspector-grid">
      <article><strong>${escapeHtml(meta.generatedBy||'Unknown')}</strong><span>Generator</span></article>
      <article><strong>${escapeHtml(meta.gameSystemRevision||'—')}</strong><span>Game-system revision</span></article>
      <article><strong>${escapeHtml(meta.catalogueRevision||'—')}</strong><span>Catalogue revision</span></article>
      <article><strong>${escapeHtml(chapter)}</strong><span>Chapter discovery</span></article>
      <article><strong>${x.sourceGraph?.selections||0}</strong><span>Selections</span></article>
      <article><strong>${x.sourceGraph?.profiles||0}</strong><span>Profiles</span></article>
      <article><strong>${x.sourceGraph?.rules||0}</strong><span>Rules</span></article>
      <article><strong>${directCount}/${dets.length||0}</strong><span>Detachment rules from ROSZ</span></article>
      <article><strong>${relationshipCount}</strong><span>Preserved ownership links</span></article>
    </div>
    <div class="source-flow"><span>ROSZ</span><b>→</b><span>${escapeHtml(edition.schemaId||'unknown')} schema</span><b>→</b><span>${allUnits().length} structured units</span><b>→</b><span>${fallbackCount} library fallback${fallbackCount===1?'':'s'}</span><b>→</b><span>Print renderer</span></div>
    ${scopeRows.length?`<div class="module-coverage">${scopeRows.map(x=>`<div class="verification-mini ok"><b>${escapeHtml(x.name)}</b><small>New Recruit scope: ${escapeHtml(x.scope.moduleName)}</small></div>`).join('')}</div>`:''}
    ${(x.warnings||[]).length?`<div class="source-warning-list">${x.warnings.map(w=>`<p>⚠ ${escapeHtml(w)}</p>`).join('')}</div>`:'<p class="quality-ok">No edition/schema migration warnings detected.</p>'}
    <div class="source-inspector-details">
      <details><summary>Source metadata</summary><dl class="source-kv">${Object.entries(meta).filter(([,v])=>v).map(([k,v])=>`<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl></details>
      <details><summary>Profile types (${profileTypes.length})</summary><div class="source-chip-list">${profileTypes.map(([n,c])=>`<span>${escapeHtml(n)} <b>${c}</b></span>`).join('')}</div></details>
      <details><summary>Characteristic names (${charNames.length})</summary><div class="source-chip-list">${charNames.map(([n,c])=>`<span class="${(x.unknownCharacteristics||[]).includes(n)?'unknown':''}">${escapeHtml(n)} <b>${c}</b></span>`).join('')}</div></details>
      <details><summary>Faction & role categories</summary><div class="source-chip-list">${[...(x.factionCategories||[]),...(x.roles||[])].map(n=>`<span>${escapeHtml(n)}</span>`).join('')||'<span>None detected</span>'}</div></details>
      <details><summary>Structure-aware ownership</summary>${structured?`<p class="quality-ok">Structured Army Model active.</p><p>${structured.units.length} unit tree(s) · ${relationshipCount} preserved model/weapon/ability/rule/enhancement relationship(s) · ${(structured.detachments||[]).length} detachment tree(s).</p>`:'<p class="muted">Re-import this roster to build the v2.6.1 structured ownership model.</p>'}</details>
      <details><summary>Unknown schema fields</summary>${(x.unknownCharacteristics||[]).length|| (x.unknownProfileTypes||[]).length?`<p><b>Characteristics:</b> ${escapeHtml((x.unknownCharacteristics||[]).join(', ')||'none')}</p><p><b>Profile types:</b> ${escapeHtml((x.unknownProfileTypes||[]).join(', ')||'none')}</p>`:'<p class="quality-ok">All observed profile types and characteristics are recognised by the installed edition schema.</p>'}</details>
    </div>`;
}
function exportSourceInspection(){
  if(!state.sourceInspection){setImportStatus('Import a roster before exporting a source inspection.','error');return;}
  const payload={generatedAt:new Date().toISOString(),appVersion:APP_VERSION,inspection:state.sourceInspection,chapter:detectChapterName([state.importedMeta?.catalogue,state.importedMeta?.faction,...allUnits().flatMap(u=>u.tags||[])]),detachments:allDetachments().map(d=>({name:d.name,dp:d.dp,scope:CHAPTER_LIBRARY?.resolveScope?.(d.name)||null,ruleSource:d.detachmentRuleSource||d.referenceSource||'',libraryStatus:d.libraryStatus||''})),normalized:{units:allUnits().length,weapons:allUnits().reduce((n,u)=>n+(u.weapons||[]).length,0),attachments:allUnits().filter(u=>u.leader||u.support).map(u=>({name:u.name,role:u.support?'Support':'Leader',eligibilitySource:u.attachmentEligibility,eligibleBodyguards:u.eligibleBodyguardNames||[]})),structureAware:Boolean(state.structuredArmyModel),preservedOwnershipLinks:(state.structuredArmyModel?.units||[]).reduce((sum,u)=>sum+Object.values(u.relationships||{}).reduce((n,list)=>n+(Array.isArray(list)?list.length:0),0),0)}};
  downloadJson(`astartes-forge-source-inspection-${slug(state.importedMeta?.name||'roster')}.json`,payload);
}

function exportImportDiagnostics() {
  if (!state.importedUnits.length) {
    setImportStatus('Import a New Recruit roster before exporting diagnostics.', 'error');
    return;
  }
  const report = {
    generatedAt: new Date().toISOString(),
    roster: state.importedMeta,
    importGraph: state.importGraph ? {detachment:state.importGraph.detachment,profileCount:state.importGraph.profileCount,ruleCount:state.importGraph.ruleCount,stratagemCandidates:state.importGraph.stratagemCandidates} : null,
    units: state.importedUnits.map(unit => ({
      name: unit.name,
      models: unit.modelProfiles || [],
      weapons: (unit.weapons || []).map(w => ({
        name: w.name, type: w.type, range: w.range, attacks: w.a, skill: w.skill,
        strength: w.s, ap: w.ap, damage: w.d, keywords: w.keywords || [],
        keywordSource: w.keywordSource || null
      }))
    }))
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug(state.importedMeta?.name || 'new-recruit')}-import-diagnostics.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


function exportDetachmentDiagnostics() {
  try {
    const graph = state.importGraph || {};
    const meta = state.importedMeta || {};
    if (!state.importedUnits.length && !meta.name && !graph.profileCount && !(graph.profiles || []).length) {
      setImportStatus('Import a New Recruit roster before exporting detachment diagnostics.', 'error');
      return;
    }

    const profiles = Array.isArray(graph.profiles) ? graph.profiles : [];
    const rules = Array.isArray(graph.rules) ? graph.rules : [];
    const candidates = Array.isArray(graph.stratagemCandidates) ? graph.stratagemCandidates : [];
    const detachmentData = meta.detachmentData && typeof meta.detachmentData === 'object'
      ? meta.detachmentData
      : {id:'', name:meta.detachment || graph.detachment || '', rules:[], enhancements:[], stratagems:[]};
    const detachmentName = meta.detachment || detachmentData.name || graph.detachment || '';

    const normalisePath = item => Array.isArray(item?.path)
      ? item.path.map(part => String(part || ''))
      : item?.path ? [String(item.path)] : [];
    const matchesDetachmentPath = item => {
      const path = normalisePath(item);
      const characteristics = Array.isArray(item?.characteristics)
        ? item.characteristics.map(c => `${c?.name || ''}: ${c?.value || ''}`).join(' ')
        : '';
      const haystack = `${path.join(' › ')} ${item?.name || ''} ${item?.type || ''} ${characteristics}`.toLowerCase();
      return /detachment|stratagem|enhancement|when|target|effect/.test(haystack)
        || (detachmentName && haystack.includes(String(detachmentName).toLowerCase()));
    };

    const safeClassified = {
      id: detachmentData.id || '',
      name: detachmentData.name || detachmentName,
      rules: Array.isArray(detachmentData.rules) ? detachmentData.rules : [],
      enhancements: Array.isArray(detachmentData.enhancements) ? detachmentData.enhancements : [],
      stratagems: Array.isArray(detachmentData.stratagems) ? detachmentData.stratagems : []
    };

    const report = {
      generatedAt: new Date().toISOString(),
      diagnosticVersion: '2.1.3',
      roster: {
        name: meta.name || '', source: meta.source || '', faction: meta.faction || '',
        catalogue: meta.catalogue || '', selectedDetachment: detachmentName, selectedDetachments: allDetachments().map(d=>({name:d.name,dp:d.dp})),
        points: meta.points ?? null
      },
      classifiedOutput: safeClassified,
      graphSummary: {
        profileCount: graph.profileCount ?? profiles.length,
        ruleCount: graph.ruleCount ?? rules.length,
        candidateCount: candidates.length
      },
      structuredStratagemCandidates: candidates,
      detachmentRelatedProfiles: profiles.filter(matchesDetachmentPath),
      detachmentRelatedRules: rules.filter(matchesDetachmentPath),
      allProfiles: profiles,
      allRules: rules,
      allProfileTypes: [...new Set(profiles.map(p => p?.type).filter(Boolean))].sort(),
      note: 'This diagnostic includes the full parsed profile and rule graph so detachment rules and Stratagems can be traced even when classification failed.'
    };

    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], {type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug(meta.name || 'new-recruit')}-detachment-diagnostics-v2-1-3.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setImportStatus('Detachment diagnostics exported successfully.', 'success');
  } catch (error) {
    console.error('Detachment diagnostics export failed:', error);
    setImportStatus(`Detachment diagnostics failed: <strong>${escapeHtml(error?.message || String(error))}</strong>`, 'error');
  }
}

function setImportStatus(message, type='info') {
  const el = $('#importStatus');
  el.className = `import-status ${type}`;
  el.innerHTML = message;
}

async function parseRosterFile(file) {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.rosz')) {
    const xmlText = await extractRosterXmlFromZip(await file.arrayBuffer());
    return parseRosterXml(xmlText, file.name);
  }
  if (lower.endsWith('.json')) return parseRosterJson(JSON.parse(await file.text()), file.name);
  return parseRosterXml(await file.text(), file.name);
}

async function handleNewRecruitImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  setImportStatus(`Reading <strong>${escapeHtml(file.name)}</strong>…`);
  try {
    const imported = await parseRosterFile(file);
    applyImportedRoster(imported);
    setImportStatus(`<strong>${imported.units.length} units imported.</strong><br>${escapeHtml(imported.name)} · ${imported.points} pts${(imported.detachments||[imported.detachment]).filter(Boolean).length ? ` · ${escapeHtml((imported.detachments||[imported.detachment]).filter(Boolean).join(' + '))}` : ''}`, 'success');
  } catch (error) {
    console.error(error);
    setImportStatus(`<strong>Import failed.</strong><br>${escapeHtml(error.message || 'Unknown error')}`, 'error');
  } finally {
    event.target.value = '';
  }
}

function applyImportedRoster(imported) {
  state.importedUnits = imported.units;
  // Preserve the full parsed New Recruit graph for detachment classification,
  // diagnostics and later re-classification. Earlier builds created this graph
  // but never copied it into state, which made every diagnostic appear empty.
  state.importGraph = imported.importGraph || null;
  state.sourceInspection = imported.sourceInspection || null;
  state.structuredArmyModel = imported.structuredArmyModel || imported.importGraph?.structuredArmyModel || null;
  state.importedRules = imported.rules || [];
  const baseDetachment=imported.detachmentData || {id: imported.detachmentId || 'imported', name: imported.detachment || 'Imported Detachment', rules: [], enhancements: imported.enhancements || [], stratagems: imported.stratagems || []};
  const importedDetachments=(Array.isArray(imported.detachmentsData)&&imported.detachmentsData.length ? imported.detachmentsData : [baseDetachment]).map(d=>mergeDetachmentLibrary(d));
  state.importedMeta = {name: imported.name, source: imported.source, points: imported.points, detachment: imported.detachment, detachments: importedDetachments.map(d=>d.name), detachmentPoints: importedDetachments.reduce((sum,d)=>sum+Number(d.dp||0),0), faction: imported.faction || 'Adeptus Astartes', catalogue: imported.catalogue || '', detachmentData: importedDetachments[0]||mergeDetachmentLibrary(baseDetachment), detachmentsData: importedDetachments, importedAt: new Date().toISOString()};
  state.detachmentId = imported.detachmentId || 'imported';
  const detectedChapter = detectChapterName([imported.faction, imported.catalogue, ...(imported.units||[]).flatMap(u=>u.tags||[])]);
  if (detectedChapter) { state.chapterPreset = chapterPresetForName(detectedChapter); state.theme = {...(chapterThemes[state.chapterPreset] || chapterThemes['generic-astartes'])}; applyTheme(); }
  state.roster = imported.entries;
  $('#rosterTitle').textContent = imported.name || 'Imported army';
  saveState(); renderAll(); switchView('builder');
}

function clearImportedData() {
  const importedIds = new Set(state.importedUnits.map(u => u.id));
  state.roster = state.roster.filter(e => !importedIds.has(e.unitId));
  state.importedUnits = [];
  state.importedRules = [];
  state.importedMeta = null;
  state.importGraph = null;
  state.sourceInspection = null;
  state.structuredArmyModel = null;
  saveState();
  renderAll();
  setImportStatus('Imported roster data removed.', 'info');
}

function collectKeywordQuality(){
  const knownWeapon=[]; const knownUnit=[]; const explained=[]; const unknown=[];
  state.importedUnits.forEach(unit=>{
    (unit.weapons||[]).forEach(weapon=>(weapon.keywords||[]).forEach(keyword=>{
      const c=keywordClassification(keyword,'');
      (c.type==='weapon'?knownWeapon:unknown).push(`${unit.name}: ${keyword}`);
    }));
    (unit.tags||[]).forEach(keyword=>{ const c=keywordClassification(keyword,''); if(c.type==='unit') knownUnit.push(`${unit.name}: ${keyword}`); });
    (unit.modelAbilities||[]).forEach(group=>(group.abilities||[]).forEach(raw=>{
      const parts=String(raw).split(':'); const name=(parts.shift()||'').trim(); const text=parts.join(':').trim();
      const c=keywordClassification(name,text);
      if(c.render==='description') explained.push(`${unit.name}: ${name}`);
    }));
  });
  return {knownWeapon:[...new Set(knownWeapon)],knownUnit:[...new Set(knownUnit)],explained:[...new Set(explained)],unknown:[...new Set(unknown)]};
}
function renderDataQualityDashboard(){
  const host=$('#dataQualityDashboard'); if(!host)return;
  const keywords=collectKeywordQuality(); const units=UNIT_LIBRARY?.coverage?.(state.importedUnits)||{known:0,total:state.importedUnits.length,unknown:[]};
  const moduleCoverage=Object.entries(VERIFICATION_GROUPS).map(([name,detachments])=>({name,total:detachments.length,ready:detachments.filter(det=>RULES_LIBRARY?.lookupDetachment?.(det)?.status==='ready').length}));
  const cards=[
    ['Rules Library',`${allDetachments().filter(d=>RULES_LIBRARY?.lookupDetachment?.(d.name)).length}/${allDetachments().length||0}`],
    ['Chapter modules',`${moduleCoverage.filter(x=>x.ready===x.total).length}/${moduleCoverage.length}`],
    ['Weapon keywords',String(keywords.knownWeapon.length)],
    ['Unit keywords',String(keywords.knownUnit.length)],
    ['Explained abilities',String(keywords.explained.length)],
    ['Parser overrides',String(units.known)],
    ['Official metadata',`${RULES_LIBRARY?.officialSync?.matched||0} checked`],
    ['Unknown weapon keywords',String(keywords.unknown.length)]
  ];
  host.innerHTML=`<div class="quality-grid">${cards.map(([label,value])=>`<article class="quality-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></article>`).join('')}</div><div class="module-coverage">${moduleCoverage.map(x=>`<div class="verification-mini ${x.ready===x.total?'ok':'fail'}"><b>${escapeHtml(x.name)}</b><small>${x.ready}/${x.total} Rules Library entries ready</small></div>`).join('')}</div>${keywords.unknown.length?`<details class="quality-unknown"><summary>Unknown keyword candidates</summary><ul>${keywords.unknown.slice(0,50).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></details>`:'<p class="quality-ok">All imported weapon keywords are classified.</p>'}${units.unknown.length?`<details class="quality-unknown"><summary>Units using lossless ROSZ data without parser overrides (${units.unknown.length})</summary><p>These are not errors. Unit Library entries are exception/override records only; ordinary units stay source-of-truth from New Recruit.</p><p>${escapeHtml(units.unknown.join(', '))}</p></details>`:''}`;
}

async function extractRosterXmlFromZip(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('This .rosz file does not contain a valid ZIP structure.');
  const totalEntries = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  for (let n = 0; n < totalEntries; n++) {
    if (view.getUint32(offset, true) !== 0x02014b50) throw new Error('The ZIP directory could not be read.');
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLen = view.getUint16(offset + 28, true);
    const extraLen = view.getUint16(offset + 30, true);
    const commentLen = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = new TextDecoder().decode(bytes.slice(offset + 46, offset + 46 + nameLen));
    if (/\.(ros|xml)$/i.test(name)) {
      if (view.getUint32(localOffset, true) !== 0x04034b50) throw new Error('The roster entry inside the ZIP file is damaged.');
      const localNameLen = view.getUint16(localOffset + 26, true);
      const localExtraLen = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + localNameLen + localExtraLen;
      const compressed = bytes.slice(start, start + compressedSize);
      let raw;
      if (method === 0) raw = compressed;
      else if (method === 8 && typeof DecompressionStream !== 'undefined') {
        const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        raw = new Uint8Array(await new Response(stream).arrayBuffer());
      } else throw new Error('This browser cannot unpack the compression used by this .rosz file. Use Chrome, Edge, or Firefox, or export the roster as .ros/.xml.');
      return new TextDecoder().decode(raw);
    }
    offset += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error('No .ros or .xml roster was found inside this .rosz file.');
}

function selectionPath(node) {
  const names=[]; let cur=node;
  while(cur){ if(cur.localName==='selection') names.unshift(cur.getAttribute('name')||'(unnamed)'); cur=cur.parentElement; }
  return names;
}
function nearestRosterSelection(node) {
  let current=node;
  while(current){
    if(current.localName==='selection' && current.parentElement?.localName==='selections' && current.parentElement?.parentElement?.localName==='force') return current;
    current=current.parentElement;
  }
  return null;
}
function isCoreStratagemName(name='') {
  return /^(Command Re-?roll|Counter-?offensive|Epic Challenge|Fire Overwatch|Go to Ground|Grenade|Heroic Intervention|Insane Bravery|Rapid Ingress|Smokescreen|Tank Shock)$/i.test(String(name).trim());
}
function pathLooksDetachmentRelated(path=[], detachmentName='') {
  const text=(Array.isArray(path)?path:[]).join(' › ').toLowerCase();
  const det=String(detachmentName||'').toLowerCase();
  return /detachment|stratagem|enhancement/.test(text) || (det && text.includes(det));
}
function buildImportGraph(doc, detachmentInfo=null) {
  const profiles=[...doc.querySelectorAll('profile')].map(p=>({
    name:p.getAttribute('name')||'', type:p.getAttribute('typeName')||'', path:selectionPath(p),
    topSelection: nearestRosterSelection(p)?.getAttribute('name') || '',
    characteristics:[...p.querySelectorAll('characteristic')].map(c=>({name:c.getAttribute('name')||'',value:c.textContent.trim()}))
  }));
  const rules=[...doc.querySelectorAll('rule')].map(r=>({
    name:r.getAttribute('name')||'', path:selectionPath(r), topSelection:nearestRosterSelection(r)?.getAttribute('name')||'', text:textOf(r,'description')
  }));
  const stratagemCandidates=profiles.filter(p=>{
    const labels=p.characteristics.map(c=>String(c.name).trim().toUpperCase());
    const structured=['WHEN','TARGET','EFFECT'].every(k=>labels.includes(k));
    return /stratagem/i.test(p.type) || structured;
  });
  return {detachment:detachmentInfo?.name||'', profileCount:profiles.length, ruleCount:rules.length, stratagemCandidates, profiles, rules};
}

function buildLosslessRosterSourceGraph(doc) {
  const selections=[]; const profiles=[]; const rules=[]; const categories=[]; const costs=[];
  const nodeToId=new WeakMap();
  const selectionNodes=[...doc.querySelectorAll('selection')];
  selectionNodes.forEach((node,index)=>nodeToId.set(node,node.getAttribute('id')||`selection-${index}`));
  const direct=(node,containerName,itemName)=>{
    const container=[...node.children].find(c=>c.localName===containerName);
    return container ? [...container.children].filter(c=>c.localName===itemName) : [];
  };
  const nearestParentSelection=node=>{
    let cur=node.parentElement;
    while(cur){ if(cur.localName==='selection') return cur; cur=cur.parentElement; }
    return null;
  };
  const nearestTopSelection=node=>{
    let cur=node, last=null;
    while(cur){
      if(cur.localName==='selection') last=cur;
      if(cur.parentElement?.localName==='selections' && cur.parentElement?.parentElement?.localName==='force') return cur;
      cur=cur.parentElement;
    }
    return last;
  };
  selectionNodes.forEach((node,index)=>{
    const id=nodeToId.get(node); const parent=nearestParentSelection(node); const top=nearestTopSelection(node);
    const path=selectionPath(node);
    const record={
      id, sourceId:node.getAttribute('id')||'', entryId:node.getAttribute('entryId')||'', entryGroupId:node.getAttribute('entryGroupId')||'',
      name:(node.getAttribute('name')||'').trim(), type:(node.getAttribute('type')||'').toLowerCase(), number:Number(node.getAttribute('number')||1),
      parentId:parent?nodeToId.get(parent):null, topId:top?nodeToId.get(top):id, path, profileIds:[], ruleIds:[], categoryNames:[], costs:[]
    };
    direct(node,'profiles','profile').forEach((profile,profileIndex)=>{
      const profileId=profile.getAttribute('id')||`${id}:profile:${profileIndex}`;
      const characteristics=[...profile.querySelectorAll(':scope > characteristics > characteristic')].map(c=>({id:c.getAttribute('id')||'',name:(c.getAttribute('name')||'').trim(),value:c.textContent.trim()}));
      profiles.push({id:profileId,sourceId:profile.getAttribute('id')||'',ownerSelectionId:id,name:(profile.getAttribute('name')||'').trim(),type:(profile.getAttribute('typeName')||'').trim(),characteristics,path});
      record.profileIds.push(profileId);
    });
    direct(node,'rules','rule').forEach((rule,ruleIndex)=>{
      const ruleId=rule.getAttribute('id')||`${id}:rule:${ruleIndex}`;
      rules.push({id:ruleId,sourceId:rule.getAttribute('id')||'',ownerSelectionId:id,name:(rule.getAttribute('name')||'').trim(),text:textOf(rule,'description'),path});
      record.ruleIds.push(ruleId);
    });
    const categoryNodes=[...direct(node,'categories','category'),...direct(node,'categoryLinks','categoryLink')];
    categoryNodes.forEach((category,categoryIndex)=>{
      const name=(category.getAttribute('name')||'').trim(); if(!name)return;
      categories.push({id:category.getAttribute('id')||`${id}:category:${categoryIndex}`,ownerSelectionId:id,name,path});
      record.categoryNames.push(name);
    });
    direct(node,'costs','cost').forEach((cost,costIndex)=>{
      const item={id:`${id}:cost:${costIndex}`,ownerSelectionId:id,name:(cost.getAttribute('name')||'').trim(),value:Number(cost.getAttribute('value')||0),path};
      costs.push(item); record.costs.push({name:item.name,value:item.value});
    });
    selections.push(record);
  });
  const childMap=new Map();
  selections.forEach(sel=>{ if(sel.parentId){ if(!childMap.has(sel.parentId)) childMap.set(sel.parentId,[]); childMap.get(sel.parentId).push(sel.id); } });
  selections.forEach(sel=>{ sel.childIds=childMap.get(sel.id)||[]; });
  return {version:2,selections,profiles,rules,categories,costs};
}

function buildStructuredSelectionTree(sourceGraph, rootId) {
  const selectionById=new Map((sourceGraph?.selections||[]).map(s=>[s.id,s]));
  const profilesByOwner=new Map(); const rulesByOwner=new Map(); const categoriesByOwner=new Map(); const costsByOwner=new Map();
  const push=(map,key,value)=>{ if(!map.has(key)) map.set(key,[]); map.get(key).push(value); };
  (sourceGraph?.profiles||[]).forEach(x=>push(profilesByOwner,x.ownerSelectionId,x));
  (sourceGraph?.rules||[]).forEach(x=>push(rulesByOwner,x.ownerSelectionId,x));
  (sourceGraph?.categories||[]).forEach(x=>push(categoriesByOwner,x.ownerSelectionId,x));
  (sourceGraph?.costs||[]).forEach(x=>push(costsByOwner,x.ownerSelectionId,x));
  const walk=id=>{
    const sel=selectionById.get(id); if(!sel) return null;
    return {
      id:sel.id, sourceId:sel.sourceId||'', entryId:sel.entryId||'', entryGroupId:sel.entryGroupId||'',
      name:sel.name||'', type:sel.type||'', number:Number(sel.number||1), parentId:sel.parentId||null, path:[...(sel.path||[])],
      profiles:(profilesByOwner.get(id)||[]).map(x=>({...x,characteristics:(x.characteristics||[]).map(c=>({...c}))})),
      rules:(rulesByOwner.get(id)||[]).map(x=>({...x})),
      categories:(categoriesByOwner.get(id)||[]).map(x=>x.name),
      costs:(costsByOwner.get(id)||[]).map(x=>({name:x.name,value:x.value})),
      children:(sel.childIds||[]).map(walk).filter(Boolean)
    };
  };
  return walk(rootId);
}

function flattenStructuredTree(node, out=[]) {
  if(!node) return out; out.push(node); (node.children||[]).forEach(child=>flattenStructuredTree(child,out)); return out;
}

function attachmentEligibilityFromProfiles(profiles=[], role='Leader') {
  const wanted=String(role||'').toLowerCase();
  const profile=(profiles||[]).find(p=>String(p.name||'').trim().toLowerCase()===wanted && /abilities/i.test(p.type||''));
  if(!profile) return {names:[],source:'missing'};
  const text=(profile.characteristics||[]).map(c=>c.value||'').filter(Boolean).join('\n');
  const names=window.ATTACHMENT_LIBRARY?.parseDescription(text)||[];
  return {names,source:names.length?'new-recruit-profile':'profile-without-list',sourceProfileId:profile.id||''};
}
function resolveEligibleHostIds(names=[], units=[]) {
  return (units||[]).filter(host=>!isCharacterUnit(host)&&!isSupportUnit(host) && names.some(name=>window.ATTACHMENT_LIBRARY?.matches(name,host.name))).map(host=>host.id);
}

function normalizeArmyFromSourceGraph(sourceGraph, sourceName='roster.ros') {
  const selectionById=new Map(sourceGraph.selections.map(x=>[x.id,x]));
  const profilesByOwner=new Map(); const rulesByOwner=new Map(); const categoriesByOwner=new Map(); const costsByOwner=new Map();
  const push=(map,key,value)=>{if(!map.has(key))map.set(key,[]);map.get(key).push(value);};
  sourceGraph.profiles.forEach(x=>push(profilesByOwner,x.ownerSelectionId,x));
  sourceGraph.rules.forEach(x=>push(rulesByOwner,x.ownerSelectionId,x));
  sourceGraph.categories.forEach(x=>push(categoriesByOwner,x.ownerSelectionId,x));
  sourceGraph.costs.forEach(x=>push(costsByOwner,x.ownerSelectionId,x));
  const descendants=rootId=>sourceGraph.selections.filter(s=>s.topId===rootId || s.id===rootId);
  const ancestors=selection=>{const out=[];let cur=selection;while(cur){out.push(cur);cur=cur.parentId?selectionById.get(cur.parentId):null;}return out;};
  const nearestModel=(owner,root)=>ancestors(owner).find(s=>s.id===root.id || s.type==='model') || root;
  const unitRoots=sourceGraph.selections.filter(s=>!s.parentId && (s.type==='unit'||s.type==='model'));
  const units=[]; const entries=[];
  unitRoots.forEach((root,index)=>{
    const ownedSelections=descendants(root.id); const ownedIds=new Set(ownedSelections.map(s=>s.id));
    const rootCategories=(categoriesByOwner.get(root.id)||[]).map(c=>c.name);
    const allProfiles=sourceGraph.profiles.filter(p=>ownedIds.has(p.ownerSelectionId));
    const allRules=sourceGraph.rules.filter(r=>ownedIds.has(r.ownerSelectionId));
    const weaponProfiles=allProfiles.filter(p=>/ranged weapons|melee weapons|weapon/i.test(p.type) || graphProfileLooksLikeWeapon(p));
    const weaponOwnerIds=new Set(weaponProfiles.map(p=>p.ownerSelectionId));
    const modelProfiles=[];
    allProfiles.filter(p=>/^(unit|model)$/i.test(p.type) && !graphProfileLooksLikeWeapon(p)).forEach(p=>{
      const owner=selectionById.get(p.ownerSelectionId)||root; const modelOwner=nearestModel(owner,root);
      const stats=statsFromGraphProfile(p);
      if(Object.values(stats).some(v=>v!=='—')) modelProfiles.push({sourceProfileId:p.id,sourceSelectionId:modelOwner.id,name:p.name||modelOwner.name||root.name,stats,count:Number(modelOwner.number||1)});
    });
    const uniqueModelProfiles=dedupeBy(modelProfiles,p=>`${p.sourceSelectionId}|${p.sourceProfileId}`);
    const weapons=weaponProfiles.map((p,i)=>{
      const owner=selectionById.get(p.ownerSelectionId)||root;
      const localRules=rulesByOwner.get(owner.id)||[];
      const modelOwner=nearestModel(owner,root);
      return weaponFromGraphProfile(p,owner,localRules,modelOwner,i);
    });
    // Preserve New Recruit's own presentation layers: profiles of type Abilities
    // remain explained abilities, <rule> elements become title-only Rules, and
    // categories remain Keywords. This prevents core rules such as Deadly Demise
    // from disappearing merely because their prose is intentionally suppressed.
    const abilityItems=[];
    allProfiles.filter(p=>!weaponProfiles.includes(p) && !/^(unit|model)$/i.test(p.type)).forEach(p=>{
      const text=p.characteristics.map(c=>c.name?`${c.name}: ${c.value}`:c.value).filter(Boolean).join(' · ');
      if(!text || !isUnitSpecificAbility(p.name||p.type,text)) return;
      const owner=selectionById.get(p.ownerSelectionId)||root; const modelOwner=nearestModel(owner,root);
      abilityItems.push({sourceProfileId:p.id,sourceSelectionId:owner.id,sourcePath:[...(owner.path||[])],modelSourceSelectionId:modelOwner.id,model:modelOwner.name||root.name,name:p.name||p.type||'Ability',text});
    });
    const abilities=dedupeBy(abilityItems,a=>`${a.model}|${a.name}|${a.text}`);
    const grouped=new Map(); abilities.forEach(a=>{if(!grouped.has(a.model))grouped.set(a.model,[]);grouped.get(a.model).push(`${a.name}: ${a.text}`);});
    const ruleItems=allRules.filter(r=>!weaponOwnerIds.has(r.ownerSelectionId) && r.name).map(r=>{
      const owner=selectionById.get(r.ownerSelectionId)||root; const modelOwner=nearestModel(owner,root);
      return {sourceRuleId:r.id,sourceSelectionId:owner.id,sourcePath:[...(owner.path||[])],modelSourceSelectionId:modelOwner.id,model:modelOwner.name||root.name,name:normaliseRuleName(r.name)};
    });
    const uniqueRules=dedupeBy(ruleItems,r=>`${r.model}|${r.name}`);
    const groupedRules=new Map(); uniqueRules.forEach(r=>{if(!groupedRules.has(r.model))groupedRules.set(r.model,[]);groupedRules.get(r.model).push(r.name);});

    // Invulnerable saves are present either directly as InSv on the Unit profile,
    // or as an Invulnerable Save ability introduced by the selected wargear.
    // Both are exact data from the imported ROSZ; no fallback value is invented.
    const invByModel=new Map();
    const registerInv=(modelId,value,detail)=>{
      const m=String(value||'').match(/(\d+)\+/); if(!m) return;
      const num=Number(m[1]); const current=invByModel.get(modelId);
      if(!current || num<current.num) invByModel.set(modelId,{num,value:`${num}+`,detail:String(detail||value).trim()});
    };
    allProfiles.forEach(p=>{
      const owner=selectionById.get(p.ownerSelectionId)||root; const modelOwner=nearestModel(owner,root);
      if(/^Invulnerable Save$/i.test(p.name||'')){
        const text=p.characteristics.map(c=>c.value).filter(Boolean).join(' '); registerInv(modelOwner.id,text,text);
      }
    });
    uniqueModelProfiles.forEach(mp=>{
      const direct=String(mp.stats?.INV||'').trim();
      if(direct && direct!=='—' && direct!=='-') registerInv(mp.sourceSelectionId,direct,`Invulnerable Save ${direct}`);
      const found=invByModel.get(mp.sourceSelectionId);
      if(found){mp.stats.INV=found.value;mp.stats.INV_DETAIL=found.detail;}
      else {delete mp.stats.INV;delete mp.stats.INV_DETAIL;}
    });

    const selectedEnhancements=ownedSelections.filter(sel=>{
      const ownerCosts=costsByOwner.get(sel.id)||[];
      return ownerCosts.some(c=>/^enhancements?$/i.test(c.name) && Number(c.value)>0);
    }).map(sel=>{
      const modelOwner=nearestModel(sel,root);
      return {
        name:sel.name,sourceSelectionId:sel.id,sourcePath:[...(sel.path||[])],
        ownerModelSourceSelectionId:modelOwner?.id||root.id,ownerModelName:modelOwner?.name||root.name,
        points:(costsByOwner.get(sel.id)||[]).filter(c=>/pts|point/i.test(c.name)).reduce((sum,c)=>sum+c.value,0)
      };
    });
    const directRootPts=(costsByOwner.get(root.id)||[]).filter(c=>/pts|point/i.test(c.name)).reduce((sum,c)=>sum+c.value,0);
    const enhancementPts=ownedSelections.filter(s=>s.id!==root.id).filter(s=>{
      const ownerCosts=costsByOwner.get(s.id)||[];
      return ownerCosts.some(c=>/^enhancements?$/i.test(c.name)) || s.path.some(x=>/enhancement/i.test(x));
    }).flatMap(s=>(costsByOwner.get(s.id)||[]).filter(c=>/pts|point/i.test(c.name))).reduce((sum,c)=>sum+c.value,0);
    const fallbackPts=sourceGraph.costs.filter(c=>ownedIds.has(c.ownerSelectionId)&&/pts|point/i.test(c.name)).reduce((sum,c)=>sum+c.value,0);
    const points=Math.round(directRootPts ? directRootPts+enhancementPts : fallbackPts);
    const modelSelections=ownedSelections.filter(s=>s.type==='model');
    const modelCounts=dedupeBy(modelSelections.map(s=>({sourceSelectionId:s.id,name:s.name,count:Number(s.number||1)})),m=>m.sourceSelectionId);
    const totalModels=modelCounts.reduce((sum,m)=>sum+m.count,0)||Number(root.number||1);
    const supportEligibility=attachmentEligibilityFromProfiles(allProfiles,'Support');
    const leaderEligibility=attachmentEligibilityFromProfiles(allProfiles,'Leader');
    const isSupport=rootCategories.some(c=>/(^|\b)support($|\b)/i.test(c)) || allRules.some(r=>/^support$/i.test(r.name)) || supportEligibility.source!=='missing';
    const isLeader=!isSupport && (rootCategories.some(c=>/(^|\b)leader($|\b)/i.test(c)) || allRules.some(r=>/^leader$/i.test(r.name)) || leaderEligibility.source!=='missing');
    const id=`import-${slug(root.name)}-${root.sourceId||index}`;
    const tags=dedupeBy([...rootCategories,...(isLeader?['Leader']:[]),...(isSupport?['Support']:[])],x=>String(x).toLowerCase());
    const unit={
      id,sourceSelectionId:root.id,sourceEntryId:root.entryId,sourceEntryGroupId:root.entryGroupId,name:root.name||`Imported unit ${index+1}`,
      category:rootCategories.find(c=>!/^(Faction:|Imperium$|Adeptus Astartes$)/i.test(c))||(isLeader?'Character':'Imported unit'),points,
      pointSource:{directRootPts,enhancementPts,fallbackPts,authority:directRootPts?'root-plus-enhancements':'descendant-fallback'},
      size:modelCounts.length?modelCounts.map(m=>`${m.count} ${m.name}`).join(' · '):`${totalModels} model${totalModels===1?'':'s'}`,
      tags,stats:uniqueModelProfiles[0]?.stats||{M:'—',T:'—',SV:'—',W:'—',LD:'—',OC:'—'},modelProfiles:uniqueModelProfiles,weapons,
      abilities:abilities.map(a=>`${a.name}: ${a.text}`),modelAbilities:[...grouped].map(([model,items])=>({model,abilities:items})),
      rules:uniqueRules.map(r=>r.name),modelRules:[...groupedRules].map(([model,rules])=>({model,rules})),selectedEnhancements,
      structuredAbilities:abilities,structuredRules:uniqueRules,
      structure:buildStructuredSelectionTree(sourceGraph,root.id),
      ownership:{
        modelProfileIds:uniqueModelProfiles.map(x=>x.sourceProfileId),
        weaponProfileIds:weapons.map(x=>x.sourceProfileId),
        abilityProfileIds:abilities.map(x=>x.sourceProfileId),
        ruleIds:uniqueRules.map(x=>x.sourceRuleId),
        enhancementSelectionIds:selectedEnhancements.map(x=>x.sourceSelectionId)
      },
      leader:isLeader,support:isSupport,canLead:[],canSupport:[],
      eligibleBodyguardNames:isSupport?supportEligibility.names:leaderEligibility.names,
      attachmentEligibility:(isSupport?supportEligibility.source:leaderEligibility.source),
      attachmentEligibilityProfileId:(isSupport?supportEligibility.sourceProfileId:leaderEligibility.sourceProfileId)||'',
      imported:true,importSource:'New Recruit lossless graph'
    };
    units.push(unit); entries.push({id:crypto.randomUUID(),unitId:id,weaponId:'',enabledWeapons:weapons.map(w=>w.id),leaderId:'',supportId:'',enhancementId:'',cardStyle:{}});
  });
  return {units,entries};
}

function graphProfileLooksLikeWeapon(profile){
  const names=(profile.characteristics||[]).map(c=>c.name||'');
  return names.some(n=>/^(Range|Rng)$/i.test(n)) && names.some(n=>/^(A|Attacks)$/i.test(n)) && names.some(n=>/^(S|Strength)$/i.test(n));
}
function statsFromGraphProfile(profile){
  const get=(...patterns)=>profile.characteristics.find(c=>patterns.some(p=>p.test(c.name||'')))?.value||'—';
  return {M:get(/^M$/i,/Move/i),T:get(/^T$/i,/Toughness/i),SV:get(/^Sv$/i,/^Save$/i),W:get(/^W$/i,/Wounds/i),LD:get(/^Ld$/i,/Leadership/i),OC:get(/^OC$/i,/Objective/i),INV:get(/^InSv$/i,/Invulnerable/i)};
}
function weaponFromGraphProfile(profile,owner,localRules,modelOwner,index){
  const get=(...patterns)=>profile.characteristics.find(c=>patterns.some(p=>p.test(c.name||'')))?.value||'—';
  const range=get(/^Range$/i,/Rng/i); const type=/melee/i.test(range)||/melee/i.test(profile.type)?'Melee':'Ranged';
  const rawName=profile.name||owner.name||`Weapon ${index+1}`;
  const bracketKeywords=[...rawName.matchAll(/\[([^\]]+)\]/g)].flatMap(m=>parseWeaponKeywords(m[1]));
  const displayName=rawName.replace(/\s*\[[^\]]+\]\s*/g,' ').replace(/\s+/g,' ').trim();
  const characteristicText=get(/^Keywords?$/i,/^Abilities?$/i,/^Special$/i);
  const profileKeywords=parseWeaponKeywords(characteristicText==='—'?'':characteristicText);
  const exactLocalKeywords=localRules.flatMap(r=>parseWeaponKeywords(`${r.name} ${r.text}`));
  const keywords=dedupeWeaponKeywords([...profileKeywords,...bracketKeywords,...exactLocalKeywords]);
  return {id:`weapon-${owner.sourceId||owner.id}-${profile.sourceId||profile.id}`,sourceSelectionId:owner.id,sourceProfileId:profile.id,modelSourceSelectionId:modelOwner.id,model:modelOwner.name,
    name:displayName,type,range,a:get(/^A$/i,/Attacks/i),skill:get(/^BS$/i,/^WS$/i,/Skill/i),s:get(/^S$/i,/Strength/i),ap:get(/^AP$/i),d:get(/^D$/i,/Damage/i),keywords,
    count:Math.max(1,Number(owner.number||1)),countSource:'weapon-selection',
    keywordSource:{profile:characteristicText,bracket:bracketKeywords,local:exactLocalKeywords,authority:'exact-local-merge'}};
}


function exactDetachmentRulesFromSelection(detachmentInfo){
  const node=detachmentInfo?.node;
  if(!node) return [];
  const found=[];
  const pushRule=(name,text,sourceType,sourceId='')=>{
    name=String(name||'').trim(); text=String(text||'').trim();
    if(!name||!text) return;
    found.push({kind:'detachment',name,text,sections:parseDetachmentRuleSections(text),sourceType,sourceId,sourceSelectionId:node.getAttribute('id')||'',sourcePath:selectionPath(node)});
  };
  // New Recruit normally stores the selected detachment rule directly below the
  // detachment selection. Read only that exact selection so a rule from another
  // selected detachment can never bleed into this one.
  [...node.children].filter(x=>x.localName==='rules').forEach(rules=>{
    [...rules.children].filter(x=>x.localName==='rule').forEach(rule=>{
      pushRule(rule.getAttribute('name')||detachmentInfo.name,textOf(rule,'description'),'direct-rule',rule.getAttribute('id')||'');
    });
  });
  [...node.children].filter(x=>x.localName==='profiles').forEach(profiles=>{
    [...profiles.children].filter(x=>x.localName==='profile').forEach(profile=>{
      const type=(profile.getAttribute('typeName')||'').trim();
      if(!/detachment rule/i.test(type)) return;
      pushRule(profile.getAttribute('name')||detachmentInfo.name,profileRuleText(profile),'direct-profile',profile.getAttribute('id')||'');
    });
  });
  return dedupeBy(found,r=>`${normaliseRuleName(r.name).toLowerCase()}|${r.text}`);
}

function sourceGraphSelectionForXmlNode(sourceGraph,node){
  if(!sourceGraph||!node) return null;
  const sourceId=node.getAttribute?.('id')||'';
  if(sourceId){ const exact=(sourceGraph.selections||[]).find(s=>s.sourceId===sourceId); if(exact) return exact; }
  const path=selectionPath(node).join(' › ');
  return (sourceGraph.selections||[]).find(s=>(s.path||[]).join(' › ')===path) || null;
}

function buildStructuredArmyModel(sourceGraph, units=[], detachments=[]){
  return {
    version:1,
    units:(units||[]).map(unit=>({
      id:unit.id,name:unit.name,sourceSelectionId:unit.sourceSelectionId,
      tree:unit.structure||null,
      relationships:{
        models:(unit.modelProfiles||[]).map(m=>({sourceSelectionId:m.sourceSelectionId,sourceProfileId:m.sourceProfileId,name:m.name,count:m.count})),
        weapons:(unit.weapons||[]).map(w=>({sourceSelectionId:w.sourceSelectionId,sourceProfileId:w.sourceProfileId,modelSourceSelectionId:w.modelSourceSelectionId,name:w.name,type:w.type,count:w.count})),
        abilities:(unit.structuredAbilities||[]).map(a=>({sourceSelectionId:a.sourceSelectionId,sourceProfileId:a.sourceProfileId,modelSourceSelectionId:a.modelSourceSelectionId,name:a.name})),
        rules:(unit.structuredRules||[]).map(r=>({sourceSelectionId:r.sourceSelectionId,sourceRuleId:r.sourceRuleId,modelSourceSelectionId:r.modelSourceSelectionId,name:r.name})),
        enhancements:(unit.selectedEnhancements||[]).map(e=>({sourceSelectionId:e.sourceSelectionId,ownerModelSourceSelectionId:e.ownerModelSourceSelectionId,ownerModelName:e.ownerModelName,name:e.name}))
      }
    })),
    detachments:(detachments||[]).map(det=>({id:det.id,name:det.name,dp:det.dp,sourceSelectionId:det.sourceSelectionId||'',sourceTree:det.sourceTree||null,rules:(det.rules||[]).map(rule=>({name:rule.name,sourceSelectionId:rule.sourceSelectionId||det.sourceSelectionId||'',sourceId:rule.sourceId||'',sections:detachmentRuleStructure(rule)}))}))
  };
}

function parseRosterXml(xmlText, sourceName='roster.ros') {
  const doc=new DOMParser().parseFromString(xmlText,'application/xml');
  if(doc.querySelector('parsererror')) throw new Error('The roster contains invalid XML.');
  const roster=doc.querySelector('roster'); if(!roster) throw new Error('No New Recruit/BattleScribe roster was found.');
  const name=roster.getAttribute('name')||sourceName.replace(/\.[^.]+$/,'');
  const sourceGraph=buildLosslessRosterSourceGraph(doc);
  const normalized=normalizeArmyFromSourceGraph(sourceGraph,sourceName);
  const sourceMeta=EDITION_SCHEMA_LIBRARY?.rosterMetadata?.(doc) || {};
  const sourceInspection=EDITION_SCHEMA_LIBRARY?.analyse?.(sourceMeta,sourceGraph,normalized) || {meta:sourceMeta,edition:{schemaId:'unknown',label:sourceMeta.gameSystemName||'Unknown',compatible:false},warnings:['Edition Schema Library unavailable.']};
  if(!normalized.units.length) throw new Error('No recognisable units were found in this roster.');
  // New Recruit exports attachment eligibility in the Leader/Support ability profile.
  // Resolve the exported unit names only against bodyguard units actually present in this roster.
  normalized.units.forEach(u=>{
    const eligible=resolveEligibleHostIds(u.eligibleBodyguardNames||[],normalized.units);
    if(u.leader) u.canLead=eligible;
    if(u.support) u.canSupport=eligible;
    if((u.leader||u.support) && !u.eligibleBodyguardNames?.length) u.attachmentEligibility='unknown';
  });
  const detachmentInfos=detectImportedDetachments(doc);
  const detachmentInfo=detachmentInfos[0]||{id:'imported-detachment',name:'Imported Detachment',node:null,dp:0};
  let uniqueRules=dedupeBy(detachmentInfos.flatMap(info=>collectImportedRules(doc,info)),r=>`${r.kind}|${String(r.name).toLowerCase()}|${r.text}`);
  const legacyGraph=buildImportGraph(doc,detachmentInfo);
  const importGraph={...legacyGraph,sourceGraph,sourceInspection,normalization:{version:'2.7.1-structure-aware',units:normalized.units.map(u=>({id:u.id,sourceSelectionId:u.sourceSelectionId,name:u.name,points:u.points,pointSource:u.pointSource,attachmentEligibility:u.attachmentEligibility,eligibleBodyguardNames:u.eligibleBodyguardNames,weapons:u.weapons.map(w=>({id:w.id,sourceSelectionId:w.sourceSelectionId,sourceProfileId:w.sourceProfileId,name:w.name,type:w.type,count:w.count,keywords:w.keywords,keywordSource:w.keywordSource}))}))}};
  importGraph.detachments=detachmentInfos.map(d=>({id:d.id,name:d.name,dp:d.dp}));
  const points=normalized.units.reduce((sum,u)=>sum+(u.points||0),0);
  const force=doc.querySelector('force'); const catalogue=force?.getAttribute('catalogueName')||''; const faction=catalogue||'Adeptus Astartes';
  const detachmentsData=detachmentInfos.map(info=>{
    const exactRules=exactDetachmentRulesFromSelection(info);
    const sourceSelection=sourceGraphSelectionForXmlNode(sourceGraph,info.node);
    const sourceTree=sourceSelection?buildStructuredSelectionTree(sourceGraph,sourceSelection.id):null;
    const importedForThis=uniqueRules.filter(r=>Array.isArray(r.sourcePath)&&r.sourcePath.includes(info.name));
    const fallbackImportedRules=importedForThis.filter(r=>r.kind==='detachment');
    const raw={
      id:info.id,name:info.name,dp:info.dp,sourceSelectionId:sourceSelection?.id||'',sourceTree,
      // Exact New Recruit data is authoritative. Only fall back to the broader
      // collected-rule scan when the selected detachment itself has no rule.
      rules:exactRules.length?exactRules:fallbackImportedRules,
      enhancements:importedForThis.filter(r=>r.kind==='enhancement'),
      stratagems:importedForThis.filter(r=>r.kind==='stratagem'),
      detachmentRuleSource:exactRules.length?'New Recruit exact selection':(fallbackImportedRules.length?'New Recruit related path':'Rules Library fallback')
    };
    const merged=mergeDetachmentLibrary(raw);
    return {...merged,dp:info.dp||merged.dp||0,detachmentRuleSource:raw.detachmentRuleSource};
  });
  const detachmentData=detachmentsData[0]||mergeDetachmentLibrary({id:detachmentInfo.id,name:detachmentInfo.name,dp:detachmentInfo.dp,rules:[],enhancements:[],stratagems:[]});
  const structuredArmyModel=buildStructuredArmyModel(sourceGraph,normalized.units,detachmentsData);
  importGraph.structuredArmyModel=structuredArmyModel;
  return {name,source:sourceName,units:normalized.units,entries:normalized.entries,rules:uniqueRules,points,detachment:detachmentInfo.name,detachments:detachmentInfos.map(d=>d.name),detachmentId:detachmentInfo.id,faction,catalogue,importGraph,sourceInspection,structuredArmyModel,detachmentData,detachmentsData};
}
function directChildrenByLocalName(node, localName) {
  return [...node.children].filter(child => child.localName === localName);
}

function isRosterUnitSelection(selection) {
  const type = (selection.getAttribute('type') || '').toLowerCase();
  if (['unit','model'].includes(type)) return true;
  return !!selection.querySelector('profile[typeName="Unit"], profile[typeName="Model"], profile[typeName*="Unit"]');
}

function unitFromXmlSelection(selection, index) {
  const name = selection.getAttribute('name') || `Imported unit ${index + 1}`;
  const categoryNames = [...selection.querySelectorAll('categoryLink, category')].map(x => x.getAttribute('name')).filter(Boolean);
  const profiles = [...selection.querySelectorAll('profile')];
  const modelStatProfiles = dedupeBy(
    profiles.filter(p => /unit|model/i.test(p.getAttribute('typeName') || '') && !/weapon/i.test(p.getAttribute('typeName') || '') && !looksLikeWeaponProfile(p))
      .map(p => ({name: p.getAttribute('name') || name, stats: statsFromProfile(p)}))
      .filter(p => Object.values(p.stats).some(v => v !== '—')),
    p => `${p.name}|${JSON.stringify(p.stats)}`
  );
  const stats = modelStatProfiles[0]?.stats || {M:'—',T:'—',SV:'—',W:'—',LD:'—',OC:'—'};
  let weapons = dedupeBy(
    profiles.filter(p => /weapon/i.test(p.getAttribute('typeName') || '') || looksLikeWeaponProfile(p)).map((p,i) => weaponFromProfile(p,i)),
    w => `${w.name}|${w.type}|${w.range}|${w.a}|${w.skill}|${w.s}|${w.ap}|${w.d}`
  );
  // Weapon keywords are intentionally read only from the individual weapon profile.
  // Never spread a detached rule across every weapon in the unit.
  const abilityRules = [...selection.querySelectorAll('rule')]
    .filter(r => nearestTopUnitSelection(r) === selection)
    .map(r => ({name:r.getAttribute('name') || 'Ability', text:textOf(r,'description'), model: nearestNamedModelSelection(r, selection)}))
    .filter(r => r.text && isUnitSpecificAbility(r.name, r.text));
  const nonWeaponProfiles = profiles
    .filter(p => !/weapon|unit|model/i.test(p.getAttribute('typeName') || '') && !looksLikeWeaponProfile(p))
    .map(p => ({name:p.getAttribute('name') || p.getAttribute('typeName') || 'Ability', text:profileDescription(p), model: nearestNamedModelSelection(p, selection)}))
    .filter(r => r.text && isUnitSpecificAbility(r.name, r.text));
  const abilities = dedupeBy([...abilityRules,...nonWeaponProfiles], a => `${a.model}|${a.name}|${a.text}`);
  const grouped = new Map();
  abilities.forEach(a => { const key=a.model || name; if(!grouped.has(key)) grouped.set(key,[]); grouped.get(key).push(`${a.name}: ${a.text}`); });
  const points = Math.round([...selection.querySelectorAll('cost')].filter(c => /pts|point/i.test(c.getAttribute('name') || '')).reduce((sum,c) => sum + Number(c.getAttribute('value') || 0), 0));
  const modelCounts = collectModelCounts(selection);
  const totalModels = modelCounts.reduce((sum,m)=>sum+m.count,0) || Number(selection.getAttribute('number') || 1);
  const isSupport = categoryNames.some(c => /(^|\b)support($|\b)/i.test(c)) || abilities.some(a => /^support$/i.test(a.name));
  const isLeader = !isSupport && (categoryNames.some(c => /character|epic hero/i.test(c)) || /character/i.test(name) || abilities.some(a => /^leader$/i.test(a.name)));
  const id = `import-${slug(name)}-${index}-${Math.random().toString(36).slice(2,7)}`;
  const tags = dedupeBy([...categoryNames, ...(isLeader ? ['Character','Leader'] : []), ...(isSupport ? ['Support'] : [])], x => x);
  return {
    id, name, category: categoryNames[0] || (isLeader ? 'Character' : 'Imported unit'), points,
    size: modelCounts.length ? modelCounts.map(m=>`${m.count} ${m.name}`).join(' · ') : `${totalModels} model${totalModels===1?'':'s'}`,
    tags, stats, modelProfiles:modelStatProfiles, weapons,
    abilities: abilities.map(a => `${a.name}: ${a.text}`),
    modelAbilities:[...grouped].map(([model,abilities])=>({model,abilities})),
    leader:isLeader, support:isSupport, canLead:[], canSupport:[], imported:true, importSource:'New Recruit'
  };
}

function looksLikeWeaponProfile(profile) {
  const names = [...profile.querySelectorAll('characteristic')].map(c => c.getAttribute('name') || '');
  return names.some(n => /^(Range|Rng)$/i.test(n)) && names.some(n => /^(A|Attacks)$/i.test(n)) && names.some(n => /^(S|Strength)$/i.test(n));
}

function nearestTopUnitSelection(node) {
  let current = node.parentElement;
  let candidate = null;
  while (current) {
    if (current.localName === 'selection') candidate = current;
    if (current.parentElement?.localName === 'selections' && current.parentElement?.parentElement?.localName === 'force') return current;
    current = current.parentElement;
  }
  return candidate;
}

function nearestNamedModelSelection(node, rootSelection) {
  let current=node.parentElement;
  while(current && current!==rootSelection){
    if(current.localName==='selection' && /model/i.test(current.getAttribute('type')||'')) return current.getAttribute('name') || rootSelection.getAttribute('name');
    current=current.parentElement;
  }
  return rootSelection.getAttribute('name') || 'Unit';
}

function collectModelCounts(selection) {
  const counts = new Map();
  [...selection.querySelectorAll('selection')].forEach(sel=>{
    if(!/model/i.test(sel.getAttribute('type')||'')) return;
    const modelName=sel.getAttribute('name');
    const count=Number(sel.getAttribute('number')||1);
    if(modelName && count>0) counts.set(modelName, (counts.get(modelName)||0)+count);
  });
  return [...counts].map(([name,count])=>({name,count}));
}

function nearestSelection(node) {
  let current = node.parentElement;
  while (current) {
    if (current.localName === 'selection') return current;
    current = current.parentElement;
  }
  return null;
}

const WEAPON_KEYWORD_PATTERN = { test(value=''){ return Boolean(KEYWORD_LIBRARY?.isWeapon?.(value)); } };
function canonicalWeaponKeyword(value='') {
  const raw=String(value).replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ').trim();
  if (/^anti\s*-/i.test(raw)) return raw.replace(/^anti\s*-\s*/i,'Anti-').replace(/\b[a-z]/g,c=>c.toUpperCase());
  if (/^close[\s-]+quarters$/i.test(raw)) return 'Close Quarters';
  const map={
    'twin-linked':'Twin-linked','ignores cover':'Ignores Cover','lethal hits':'Lethal Hits',
    'devastating wounds':'Devastating Wounds','indirect fire':'Indirect Fire','extra attacks':'Extra Attacks',
    'one shot':'One Shot','rapid fire':'Rapid Fire','sustained hits':'Sustained Hits'
  };
  const lower=raw.toLowerCase();
  for(const [key,label] of Object.entries(map)) if(lower===key || lower.startsWith(key+' ')) return label+raw.slice(key.length);
  return raw.replace(/\b\w/g,c=>c.toUpperCase());
}
function weaponKeywordFamily(value='') {
  const canonical=canonicalWeaponKeyword(value);
  const lower=canonical.toLowerCase().replace(/\s+/g,' ').trim();
  const anti=lower.match(/^anti-([^0-9]+?)(?:\s+\d\+)?$/i);
  if(anti) return `anti-${anti[1].trim()}`;
  const parameterised=[
    'rapid fire','sustained hits','melta','blast','cleave','conversion','hunter'
  ];
  const family=parameterised.find(name=>lower===name || lower.startsWith(`${name} `));
  return family || lower.replace(/[\s-]+/g,' ');
}
function dedupeWeaponKeywords(values=[]) {
  // Parameterised weapon rules are mutually exclusive within the same keyword
  // family on a single weapon profile. Preserve the first occurrence because
  // callers provide values in source-authority order (profile -> name -> local).
  const result=[];
  const familyIndex=new Map();
  values.flat().filter(Boolean).forEach(value=>{
    const canonical=canonicalWeaponKeyword(value);
    const family=weaponKeywordFamily(canonical);
    if(!family) return;
    if(familyIndex.has(family)) return;
    familyIndex.set(family,result.length);
    result.push(canonical);
  });
  return result;
}
function parseWeaponKeywords(value='') {
  const raw = String(value || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  const found = [];
  raw.replace(/[\[\]()]/g, '').split(/[,;|•\n]+/).map(x => x.trim()).forEach(part => {
    const clean = part.replace(/^(?:weapon abilities?|abilities?|keywords?)\s*:\s*/i, '').trim();
    if (WEAPON_KEYWORD_PATTERN.test(clean)) found.push(clean);
  });
  const scans = [
    /\banti\s*-\s*[a-z][a-z -]*?\s+\d\+\b/gi,/\bclose[\s-]+quarters\b/gi,/\bpsychic\b/gi,
    /\brapid fire\s+\d+\b/gi,/\bmelta\s+\d+\b/gi,/\bsustained hits\s+\d+\b/gi,
    /\b(?:assault|pistol|heavy|blast|hazardous|torrent|lethal hits|devastating wounds|twin-linked|indirect fire|precision|extra attacks|lance|ignores cover|one shot)\b/gi
  ];
  scans.forEach(rx => { for (const match of raw.matchAll(rx)) found.push(match[0]); });
  return dedupeWeaponKeywords(found);
}
function isUnitSpecificAbility(name='', text='') {
  const n = String(name).trim();
  if (!n || /close[\s-]+quarters/i.test(`${n} ${text}`) || /^psychic$/i.test(n) || /^anti\s*-/i.test(n) || isGenericAbilityName(n) || WEAPON_KEYWORD_PATTERN.test(normaliseRuleName(n)) || isWeaponKeywordExplanation(n, text)) return false;
  if (/^(Oath of Moment|And They Shall Know No Fear|Army Rules?|Core Rules?|Detachment Rules?|Faction Rules?)$/i.test(n)) return false;
  return !/select one model.*equipped|weapon profile|this weapon/i.test(String(text)) || /once per battle|while this model|while this unit|each time this unit|attached unit/i.test(String(text));
}

function classifyImportedRule(name='', text='', detachmentName='') {
  const n=String(name).trim(); const t=String(text).trim(); const combined=`${n} ${t}`;
  if(!n || !t || WEAPON_KEYWORD_PATTERN.test(normaliseRuleName(n)) || isWeaponKeywordExplanation(n,t)) return null;
  const cpMatch = combined.match(/(?:^|\s)([12])\s*CP\b/i);
  if (/stratagem/i.test(combined) || cpMatch || /WHEN:\s*/i.test(t) && /TARGET:\s*/i.test(t) && /EFFECT:\s*/i.test(t)) return {kind:'stratagem', name:n.replace(/\s+[12]\s*CP.*$/i,'').trim(), text:t, cp:cpMatch?Number(cpMatch[1]):1, phase:extractRuleTiming(t)};
  if (/detachment rule/i.test(combined) || (detachmentName && (n.toLowerCase()===detachmentName.toLowerCase() || t.toLowerCase().includes('detachment rule')))) return {kind:'detachment',name:n,text:t};
  if (/Oath of Moment|Templar Vows|army rule|faction rule|Curse of the Wulfen|Sagas/i.test(combined)) return {kind:'army',name:n,text:t};
  if (isUnitSpecificAbility(n,t)) return null;
  return null;
}
function extractRuleTiming(text=''){ const m=String(text).match(/WHEN:\s*([^.;]+)/i); return m?m[1].trim():'Detachment'; }

function isArmyOrDetachmentRule(name='', text='') {
  const combined = `${name} ${text}`;
  if (WEAPON_KEYWORD_PATTERN.test(String(name).trim())) return false;
  return /Oath of Moment|Templar Vows|Space Wolves|Saga|Champions of Russ|Stormlance|detachment rule|army rule/i.test(combined);
}

function detectImportedDetachments(doc) {
  const selections=[...doc.querySelectorAll('selection')];
  const generic=/^(detachment|detachment choice|army detachment|select detachment|configuration|none|no detachment)$/i;
  const cats=sel=>[...sel.querySelectorAll(':scope > categories > category, :scope > categoryLinks > categoryLink')].map(x=>x.getAttribute('name')||'');
  const detachmentParents=selections.filter(sel=>/^detachment(?: choice)?$/i.test((sel.getAttribute('name')||'').trim()));
  let candidates=[];
  detachmentParents.forEach(parent=>{
    [...parent.querySelectorAll(':scope > selections > selection')].forEach(sel=>{
      const name=(sel.getAttribute('name')||'').trim();
      if(name && !generic.test(name)) candidates.push(sel);
    });
  });
  selections.forEach(sel=>{
    const name=(sel.getAttribute('name')||'').trim();
    if(name && !generic.test(name) && cats(sel).some(c=>/^detachment$/i.test(c))) candidates.push(sel);
  });
  candidates=dedupeBy(candidates,sel=>sel.getAttribute('id')||`${sel.getAttribute('name')}|${selectionPath(sel).join('>')}`);
  if(!candidates.length){
    const profile=[...doc.querySelectorAll('profile')].find(p=>/detachment rule/i.test(p.getAttribute('typeName')||''));
    if(profile){ let cur=profile.parentElement; while(cur && cur.localName!=='selection') cur=cur.parentElement; if(cur)candidates=[cur]; }
  }
  return candidates.map(candidate=>{
    const name=(candidate.getAttribute('name')||'Imported Detachment').trim();
    const dpNode=[...candidate.querySelectorAll('cost')].find(c=>/detachment points?/i.test(c.getAttribute('name')||''));
    const dp=Number(dpNode?.getAttribute('value')||0);
    return {id:slug(name),name,node:candidate,dp};
  });
}
function detectImportedDetachment(doc) {
  return detectImportedDetachments(doc)[0] || {id:'imported-detachment',name:'Imported Detachment',node:null,dp:0};
}

function profileRuleText(profile){
  const chars=[...profile.querySelectorAll('characteristic')];
  const labelled=chars.map(c=>({name:(c.getAttribute('name')||'').trim(),value:c.textContent.trim()})).filter(x=>x.value);
  const ordered=['WHEN','TARGET','EFFECT','RESTRICTIONS','DURATION'];
  const structured=[];
  ordered.forEach(label=>labelled.filter(x=>x.name.toUpperCase()===label).forEach(x=>structured.push(`${label}: ${x.value}`)));
  if(structured.length) return structured.join('\n');
  return labelled.map(x=>x.name?`${x.name}: ${x.value}`:x.value).join('\n');
}

function collectImportedRules(doc, detachmentInfo) {
  const out=[];
  const detachmentName=detachmentInfo?.name||'';
  const add=(kind,name,text,extra={})=>{
    name=String(name||'').trim(); text=String(text||'').trim();
    if(!name||!text||isWeaponKeywordExplanation(name,text)||/close[\s-]+quarters/i.test(`${name} ${text}`)||/^psychic$/i.test(name)||/^anti\s*-/i.test(name)) return;
    if(kind==='stratagem' && isCoreStratagemName(name)) return;
    out.push({kind,name,text,...extra});
  };
  // Army/faction rules exported directly on the force are the most reliable
  // source for army-wide rule replacement. This is intentionally name-agnostic:
  // e.g. standard Astartes export Oath of Moment here, while Black Templars
  // export Templar Vows instead. Preserve what New Recruit selected rather than
  // hard-coding a Chapter-specific replacement in the renderer.
  [...doc.querySelectorAll('force > rules > rule')].forEach(r=>{
    const name=(r.getAttribute('name')||'Army Rule').trim();
    const text=textOf(r,'description');
    if(name && text) add('army',name,text,{sourcePath:selectionPath(r),sourceRuleId:r.getAttribute('id')||'',sourceKind:'force-rule'});
  });

  const profiles=[...doc.querySelectorAll('profile')];
  profiles.forEach(p=>{
    const type=(p.getAttribute('typeName')||'').trim();
    const name=(p.getAttribute('name')||type||'Rule').trim();
    const text=profileRuleText(p);
    const characteristicNames=[...p.querySelectorAll('characteristic')].map(c=>(c.getAttribute('name')||'').trim().toUpperCase());
    const structuredStratagem=['WHEN','TARGET','EFFECT'].every(label=>characteristicNames.includes(label));
    const path=selectionPath(p);
    const insideDetachment=!!detachmentInfo?.node && detachmentInfo.node.contains(p);
    const detachmentRelated=insideDetachment || pathLooksDetachmentRelated(path,detachmentName);
    const top=nearestRosterSelection(p);
    const topIsUnit=top ? isRosterUnitSelection(top) : false;

    // A selected detachment's Stratagem profiles can be stored outside the exact
    // detachment selection by New Recruit. Structured WHEN/TARGET/EFFECT profiles
    // are accepted when their path is detachment-related, or when they are a real
    // Stratagem profile outside a roster unit.
    if((/stratagem/i.test(type) && (!topIsUnit || detachmentRelated)) || (structuredStratagem && detachmentRelated)){
      const cp=Number((`${name} ${text}`.match(/([123])\s*CP/i)||[])[1]||1);
      add('stratagem',name.replace(/\s+[123]\s*CP.*$/i,'').trim(),text,{cp,phase:extractRuleTiming(text),sourcePath:path});
    } else if(/enhancement/i.test(type) && detachmentRelated) {
      add('enhancement',name,text,{id:slug(name),points:Number((`${name} ${text}`.match(/(\d+)\s*(?:pts|points)/i)||[])[1]||0),sourcePath:path});
    } else if(/detachment rule/i.test(type) || (insideDetachment && /rule/i.test(type) && !/unit|model|weapon/i.test(type))) {
      add('detachment',name,text,{sourcePath:path});
    } else if(/army rule|faction rule/i.test(type)) {
      add('army',name,text,{sourcePath:path});
    }
  });

  [...doc.querySelectorAll('rule')].forEach(r=>{
    const name=r.getAttribute('name')||'Rule'; const text=textOf(r,'description');
    const path=selectionPath(r);
    let cur=r.parentElement, inDetachment=false;
    while(cur){ if(cur===detachmentInfo?.node) inDetachment=true; cur=cur.parentElement; }
    const related=inDetachment || pathLooksDetachmentRelated(path,detachmentName);
    if(related && /stratagem|\b[123]\s*CP\b|WHEN:.*TARGET:.*EFFECT:/is.test(`${name} ${text}`)) {
      const cp=Number((`${name} ${text}`.match(/([123])\s*CP/i)||[])[1]||1);
      add('stratagem',name.replace(/\s+[123]\s*CP.*$/i,'').trim(),text,{cp,phase:extractRuleTiming(text),sourcePath:path});
    } else if(inDetachment) add('detachment',name,text,{sourcePath:path});
    else if(/army rule|faction rule|oath of moment|templar vows/i.test(`${name} ${text}`)) add('army',name,text,{sourcePath:path});
  });

  // Some exports put the structured characteristics directly below a named
  // selection instead of inside a profile. Scan the full roster, but require a
  // detachment-related path so unit abilities are not misclassified.
  [...doc.querySelectorAll('selection')].forEach(sel=>{
    const name=(sel.getAttribute('name')||'').trim();
    const path=selectionPath(sel);
    if(!name || !pathLooksDetachmentRelated(path,detachmentName)) return;
    const chars=[...sel.querySelectorAll(':scope > profiles > profile > characteristics > characteristic, :scope > characteristics > characteristic')];
    const labels=chars.map(c=>(c.getAttribute('name')||'').trim().toUpperCase());
    if(!['WHEN','TARGET','EFFECT'].every(label=>labels.includes(label))) return;
    const lines=[];
    ['WHEN','TARGET','EFFECT','RESTRICTIONS','DURATION'].forEach(label=>{
      chars.filter(c=>(c.getAttribute('name')||'').trim().toUpperCase()===label).forEach(c=>lines.push(`${label}: ${c.textContent.trim()}`));
    });
    const text=lines.join('\n');
    const cp=Number((`${name} ${text}`.match(/([123])\s*CP/i)||[])[1]||1);
    add('stratagem',name.replace(/\s+[123]\s*CP.*$/i,'').trim(),text,{cp,phase:extractRuleTiming(text),sourcePath:path});
  });
  return dedupeBy(out,r=>`${r.kind}|${r.name.toLowerCase()}|${r.text}`).slice(0,500);
}

function statsFromProfile(profile) {
  const chars = [...profile.querySelectorAll('characteristic')];
  const get = (...patterns) => chars.find(c => patterns.some(p => p.test(c.getAttribute('name') || '')))?.textContent.trim() || '—';
  return {M:get(/^M$/i,/Move/i), T:get(/^T$/i,/Toughness/i), SV:get(/^Sv$/i,/Save/i), W:get(/^W$/i,/Wounds/i), LD:get(/^Ld$/i,/Leadership/i), OC:get(/^OC$/i,/Objective/i)};
}

function nearestWeaponSelection(profile) {
  let current = profile.parentElement;
  while (current) {
    if (current.localName === 'selection') return current;
    current = current.parentElement;
  }
  return null;
}

function directWeaponProfiles(selection) {
  if (!selection) return [];
  return [...selection.querySelectorAll(':scope > profiles > profile')]
    .filter(p => /weapon/i.test(p.getAttribute('typeName') || '') || looksLikeWeaponProfile(p));
}

function localWeaponKeywords(profile) {
  const selection = nearestWeaponSelection(profile);
  if (!selection) return [];
  const siblingWeapons = directWeaponProfiles(selection);
  // A local rule is safe only when this exact selection owns exactly one weapon.
  // This fallback is used only when the weapon profile itself has no keyword data.
  if (siblingWeapons.length !== 1 || siblingWeapons[0] !== profile) return [];
  const keywords=[];
  [...selection.children].forEach(container=>{
    if(container.localName!=='rules') return;
    [...container.children].forEach(node=>{
      if(node.localName!=='rule') return;
      const name=(node.getAttribute('name')||'').trim();
      const text=textOf(node,'description');
      parseWeaponKeywords(`${name} ${text}`).forEach(k=>keywords.push(k));
    });
  });
  return dedupeWeaponKeywords(keywords);
}

function weaponFromProfile(profile, index) {
  const chars = [...profile.querySelectorAll('characteristic')];
  const get = (...patterns) => chars.find(c => patterns.some(p => p.test(c.getAttribute('name') || '')))?.textContent.trim() || '—';
  const typeName = profile.getAttribute('typeName') || '';
  const range = get(/^Range$/i,/Rng/i);
  const inferredType = /melee/i.test(range) || /melee/i.test(typeName) ? 'Melee' : 'Ranged';
  const rawName = profile.getAttribute('name') || `Weapon ${index+1}`;
  const bracketKeywords = [...rawName.matchAll(/\[([^\]]+)\]/g)].flatMap(m => parseWeaponKeywords(m[1]));
  const displayName = rawName.replace(/\s*\[[^\]]+\]\s*/g, ' ').replace(/\s+/g,' ').trim();
  const keywordText = get(/^Keywords?$/i, /^Abilities?$/i, /^Special$/i);
  const profileKeywords = parseWeaponKeywords(keywordText === '—' ? '' : keywordText);
  const localKeywords = profileKeywords.length ? [] : localWeaponKeywords(profile);
  const keywords = dedupeWeaponKeywords([...profileKeywords, ...bracketKeywords, ...localKeywords]);
  return {id:`weapon-${index}-${slug(displayName || 'weapon')}`, name:displayName, type:inferredType, range, a:get(/^A$/i,/Attacks/i), skill:get(/^BS$/i,/^WS$/i,/Skill/i), s:get(/^S$/i,/Strength/i), ap:get(/^AP$/i), d:get(/^D$/i,/Damage/i), keywords, keywordSource:{profile:keywordText, bracket:bracketKeywords, local:localKeywords, authority:profileKeywords.length?'profile':(bracketKeywords.length?'name':'local-fallback')}};
}
function textOf(node, childLocalName) {
  const child = [...node.querySelectorAll('*')].find(x => x.localName === childLocalName);
  return child?.textContent.trim() || '';
}
function profileDescription(profile) {
  const lines = [...profile.querySelectorAll('characteristic')].map(c => `${c.getAttribute('name') || ''}: ${c.textContent.trim()}`).filter(x => !x.endsWith(': '));
  return lines.join(' · ');
}
function slug(value) { return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'unit'; }
function dedupeBy(items, keyFn) { const seen=new Set(); return items.filter(item => { const k=keyFn(item); if(seen.has(k)) return false; seen.add(k); return true; }); }

function parseRosterJson(data, sourceName='roster.json') {
  const root = data.roster || data;
  const candidates = root.units || root.selections || root.force?.units || root.forces?.flatMap?.(f => f.units || f.selections || []) || [];
  if (!Array.isArray(candidates) || !candidates.length) throw new Error('This JSON structure is not recognised. Export as .rosz or .ros instead.');
  const units = candidates.map((item,index) => {
    const profiles = item.profiles || item.profile || [];
    const weaponsRaw = item.weapons || profiles.filter?.(p => /weapon/i.test(p.typeName || p.type || '')) || [];
    const weapons = weaponsRaw.map((w,i) => ({id:`weapon-${i}-${slug(w.name || 'weapon')}`,name:w.name||`Weapon ${i+1}`,type:w.type||(/melee/i.test(w.range||'')?'Melee':'Ranged'),range:w.range||w.characteristics?.Range||'—',a:w.a||w.attacks||w.characteristics?.A||'—',skill:w.skill||w.bs||w.ws||w.characteristics?.BS||w.characteristics?.WS||'—',s:w.s||w.strength||w.characteristics?.S||'—',ap:w.ap||w.characteristics?.AP||'—',d:w.d||w.damage||w.characteristics?.D||'—',keywords:parseWeaponKeywords(w.keywords||w.abilities||w.characteristics?.Keywords||w.characteristics?.Abilities||'')}));
    const categories = item.categories || item.category ? [].concat(item.categories || item.category) : [];
    const support = categories.some(c => /(^|\b)support($|\b)/i.test(typeof c==='string'?c:c.name||''));
    const leader = !support && categories.some(c => /character/i.test(typeof c==='string'?c:c.name||''));
    return {id:`import-${slug(item.name||'unit')}-${index}`,name:item.name||`Imported unit ${index+1}`,category:(typeof categories[0]==='string'?categories[0]:categories[0]?.name)||'Imported unit',points:Number(item.points||item.cost||0),size:String(item.size||item.number||'1 model'),tags:categories.map(c=>typeof c==='string'?c:c.name).filter(Boolean),stats:item.stats||{M:'—',T:'—',SV:'—',W:'—',LD:'—',OC:'—'},weapons,abilities:(item.abilities||[]).map(a=>typeof a==='string'?a:`${a.name||'Ability'}: ${a.text||a.description||''}`),modelAbilities:[{model:item.name||'Unit',abilities:(item.abilities||[]).map(a=>typeof a==='string'?a:`${a.name||'Ability'}: ${a.text||a.description||''}`)}],rules:(item.rules||[]).map(r=>typeof r==='string'?r:(r.name||'Rule')),modelRules:[{model:item.name||'Unit',rules:(item.rules||[]).map(r=>typeof r==='string'?r:(r.name||'Rule'))}],selectedEnhancements:[],leader,support,canLead:[],canSupport:[],imported:true,importSource:'New Recruit JSON'};
  });
  const bodyguards=units.filter(u=>!isCharacterUnit(u)&&!isSupportUnit(u)).map(u=>u.id); units.filter(isCharacterUnit).forEach(u=>{u.leader=true;u.canLead=[...bodyguards]}); units.filter(isSupportUnit).forEach(u=>{u.support=true;u.canSupport=[...bodyguards]});
  const entries=units.map(u=>({id:crypto.randomUUID(),unitId:u.id,weaponId:'',enabledWeapons:u.weapons.map(w=>w.id||w.name),leaderId:'',enhancementId:'',cardStyle:{}}));
  const detachmentName=root.detachment?.name||root.detachment||'';
  const detachmentId=slug(detachmentName || 'imported-detachment');
  const rules=(root.rules||[]).map(r=>typeof r==='string'?classifyImportedRule(r,'',detachmentName):classifyImportedRule(r.name||'',r.text||r.description||'',detachmentName)).filter(Boolean);
  return {name:root.name||sourceName.replace(/\.[^.]+$/,''),source:sourceName,units,entries,rules,points:units.reduce((s,u)=>s+(u.points||0),0),detachment:detachmentName,detachmentId,detachmentData:{id:detachmentId,name:detachmentName||'Imported Detachment',rules:rules.filter(r=>r.kind==='detachment'),enhancements:[],stratagems:rules.filter(r=>r.kind==='stratagem')}};
}

init();


// V4 Print Center -----------------------------------------------------------
function selectedPackSections() {
  return $$('[data-pack-section]').filter(input => input.checked).map(input => input.dataset.packSection);
}

function packOverviewMarkup() {
  const groups = new Map();
  state.roster.forEach(entry => {
    const unit = unitById(entry.unitId); if (!unit) return;
    const key = modelGroup(unit); if (!groups.has(key)) groups.set(key, []);
    const leaderEntry = entry.leaderId ? state.roster.find(x => x.id === entry.leaderId) : null;
    const leader = leaderEntry ? unitById(leaderEntry.unitId) : null;
    const supportEntry = entry.supportId ? state.roster.find(x => x.id === entry.supportId) : null;
    const support = supportEntry ? unitById(supportEntry.unitId) : null;
    const enhancement = allEnhancements().find(e => e.id === (leaderEntry?.enhancementId || entry.enhancementId));
    groups.get(key).push({name:unit.name, points:unit.points + (leader?.points || 0) + (support?.points || 0) + (enhancement?.points || 0), leader:leader?.name, support:support?.name, enhancement:enhancement?.name});
  });
  const order=['Epic Heroes','Characters','Infantry','Mounted & Beasts','Vehicles','Other Units'];
  return `<div class="pack-overview-grid">${[...groups.keys()].sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(group => `<section class="pack-overview-group"><h3>${escapeHtml(group)}</h3>${groups.get(group).map(item => `<div class="pack-overview-unit"><span><strong>${escapeHtml(item.name)}</strong>${item.leader?`<br><small>Leader: ${escapeHtml(item.leader)}</small>`:''}${item.support?`<br><small>Support: ${escapeHtml(item.support)}</small>`:''}${item.enhancement?`<br><small>${escapeHtml(item.enhancement)}</small>`:''}</span><b>${item.points} pts</b></div>`).join('')}</section>`).join('')}</div>`;
}

function selectedEnhancementsMarkup() {
  const cards=[];
  state.roster.forEach(entry => {
    if (!entry.enhancementId) return;
    const enhancement=allEnhancements().find(e=>e.id===entry.enhancementId); const unit=unitById(entry.unitId);
    if(enhancement) cards.push(`<article class="pack-enhancement-card"><h3>${escapeHtml(enhancement.name)}</h3><p><strong>${escapeHtml(unit?.name||'Character')}</strong>${enhancement.points?` · ${enhancement.points} pts`:''}</p>${enhancement.text?`<p>${escapeHtml(cleanImportedText(enhancement.text))}</p>`:''}</article>`);
  });
  return cards.join('') || '<div class="empty">No selected enhancements in this roster.</div>';
}

function buildArmyPackMarkup() {
  // Refresh source views before cloning their final rendered output.
  renderCards(); renderReference();
  const chapter=factionNameFor(state.importedUnits[0]||{});
  const detachment=detachmentDisplayName();
  const rosterName=state.importedMeta?.name || 'Imported Army';
  const cardsHtml=[...document.querySelectorAll('#cardsContainer .data-card')].map(card=>card.outerHTML).join('');
  const armyRulesHtml=($('#armyRules')?.innerHTML||'') + ($('#referenceRules')?.innerHTML||'');
  const coreHtml=$('#coreStratagemList')?.innerHTML||'';
  const detHtml=$('#stratagemList')?.innerHTML||'';
  return `
    <section class="pack-cover" data-pack-output="cover"><p class="pack-chapter">${escapeHtml(chapter)}</p><h1>${escapeHtml(rosterName)}</h1><h2>${escapeHtml(detachment)}</h2><p class="pack-points">${rosterPoints()} POINTS · ${totalDetachmentPoints()} DP</p><p>Astartes Forge Army Pack</p></section>
    <section class="pack-section" data-pack-output="overview"><h2 class="pack-section-title">Army Overview</h2>${packOverviewMarkup()}</section>
    <section class="pack-section pack-datasheets" data-pack-output="datasheets"><h2 class="pack-section-title">Datasheets</h2>${cardsHtml}</section>
    <section class="pack-section" data-pack-output="army-rules"><h2 class="pack-section-title">Army & Detachment Rules</h2>${armyRulesHtml}</section>
    <section class="pack-section pack-rules-grid" data-pack-output="core-stratagems"><h2 class="pack-section-title">Core Stratagems</h2><div class="stratagem-list">${coreHtml}</div></section>
    <section class="pack-section pack-rules-grid" data-pack-output="detachment-stratagems"><h2 class="pack-section-title">${escapeHtml(detachment)} Stratagems</h2><div class="stratagem-list">${detHtml}</div></section>
    <section class="pack-section" data-pack-output="enhancements"><h2 class="pack-section-title">Selected Enhancements</h2>${selectedEnhancementsMarkup()}</section>`;
}

function renderPrintCenter() {
  const preview=$('#packPreview'); if(!preview) return;
  const selected=selectedPackSections();
  const labels={cover:'Cover page',overview:'Army overview',datasheets:'Datasheets','army-rules':'Army & detachment rules','core-stratagems':'Core Stratagems','detachment-stratagems':'Detachment Stratagems',enhancements:'Enhancements'};
  const descriptions={cover:'Chapter, detachment and points',overview:`${state.roster.length} imported roster entries`,datasheets:`${printableEntries().length} combined datasheet pages`,'army-rules':'Army and selected detachment references','core-stratagems':`${coreStratagems.length} compact reference cards`,'detachment-stratagems':`${allDetachments().reduce((n,d)=>n+(d.stratagems||[]).length,0)} selected detachment cards`,enhancements:'Selected Character enhancements'};
  $('#packPreviewTitle').textContent=state.importedMeta?.name || 'No army imported';
  $('#packPageEstimate').textContent=`${selected.length} sections`;
  preview.innerHTML=selected.length?selected.map(key=>`<article class="pack-preview-card"><h3>${labels[key]}</h3><p>${descriptions[key]}</p></article>`).join(''):'<div class="empty">Select at least one section for the army pack.</div>';
}

function generateArmyPack() {
  if(!state.roster.length){ setImportStatus('Import a New Recruit roster before generating an army pack.','error'); switchView('builder'); return; }
  const selected=new Set(selectedPackSections());
  if(!selected.size){ alert('Select at least one section for the army pack.'); return; }
  const output=$('#armyPackPrint');
  output.innerHTML=buildArmyPackMarkup();
  output.querySelectorAll('[data-pack-output]').forEach(section=>section.classList.toggle('pack-hidden',!selected.has(section.dataset.packOutput)));
  document.body.classList.remove('print-rules');
  document.body.classList.add('print-pack');
  requestAnimationFrame(()=>window.print());
}

window.addEventListener('DOMContentLoaded',()=>{ document.getElementById('refreshDataQuality')?.addEventListener('click',renderDataQualityDashboard); renderDataQualityDashboard(); });


// v2.4.1 developer workspace: keep diagnostics compact by allowing only one
// developer subsection to stay expanded at a time.
document.addEventListener('toggle', event=>{
  const target=event.target;
  if(!(target instanceof HTMLDetailsElement) || !target.classList.contains('developer-subpanel') || !target.open) return;
  document.querySelectorAll('.developer-subpanel[open]').forEach(other=>{ if(other!==target) other.open=false; });
}, true);
