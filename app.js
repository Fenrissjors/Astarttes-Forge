const APP_VERSION = '2.0.1-multi-detachment-fix';
const RULES_LIBRARY = window.ASTARTES_RULES_LIBRARY || null;
const VERIFICATION_DETACHMENTS = [
  'Gladius Task Force','Anvil Siege Force','Firestorm Assault Force','Ironstorm Spearhead','Stormlance Task Force',
  'Vanguard Spearhead','First Company Task Force','Librarius Conclave','Fulguris Task Force','Subversion Assets',
  'Champions of Fenris','Legends of Saga and Song','Veterans of the Fang','Saga of the Beastslayer',
  'Saga of the Bold','Saga of the Great Wolf','Saga of the Hunter'
];
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
  { name: 'Command Re-roll', cp: 1, phase: 'Any phase', text: 'After an eligible roll for a friendly unit or model, re-roll that roll. For a multi-die roll, re-roll one die, except Charge rolls, which are re-rolled in full.' },
  { name: 'Epic Challenge', cp: 1, phase: 'Fight phase', text: 'After a friendly Character unit is selected to fight, one Character model in that unit gains Precision on its melee weapons until the end of the phase.' },
  { name: 'Insane Bravery', cp: 1, phase: 'Command phase', text: 'Before an eligible Battle-shock roll, that roll is automatically successful. This Stratagem can only be used once per battle.' },
  { name: 'Explosives', cp: 1, phase: 'Shooting phase', text: 'An eligible Explosives or Grenades unit can select a visible enemy within 8 inches and roll six dice; each 4+ inflicts 1 mortal wound.' },
  { name: 'Crushing Impact', cp: 1, phase: 'Charge phase', text: 'After a Monster or Vehicle ends a Charge move, resolve the mortal-wound roll described by the current Core Rules.' },
  { name: 'Rapid Ingress', cp: 1, phase: 'Opponent Movement phase', text: 'At the end of your opponent’s Movement phase, an eligible unit in Strategic Reserves makes an Ingress move. It cannot be used in the first battle round.' },
  { name: 'Fire Overwatch', cp: 1, phase: 'Opponent Movement phase', text: 'At the end of your opponent’s Movement phase, an eligible unengaged non-Titanic unit makes Snap Shooting against one visible enemy within 24 inches.' },
  { name: 'Smokescreen', cp: 1, phase: 'Opponent Shooting phase', text: 'At the start of your opponent’s Shooting phase, select a friendly Smoke unit. It and units obscured by it gain the Benefit of Cover for the phase.' },
  { name: 'Heroic Intervention', cp: 1, phase: 'Opponent Charge phase', text: 'At the end of your opponent’s Charge phase, an eligible unengaged unit resolves a charge using an allowed intervention mode.' },
  { name: 'Counteroffensive', cp: 2, phase: 'Opponent Fight phase', text: 'After an enemy unit resolves its attacks, an eligible friendly unit gains Fights First for the phase and must be the next friendly unit selected to fight.' }
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

// Official public fallback summaries for the 11th-edition Space Wolves Faction Pack.
// Imported New Recruit text always takes precedence. These summaries are used only
// when an export contains the detachment name but omits its rules or Stratagems.
const officialSpaceWolvesFallbacks = {
  'champions-of-fenris': {
    name: 'Champions of Fenris', source: 'Astartes Forge concise reference',
    rules: [{kind:'detachment', name:'The Great Wolf Watches', text:'At the end of your opponent’s Charge phase, eligible Adeptus Astartes Infantry and Walker units close to enemy units can declare a counter-charge. A successful counter-charge does not grant a Charge bonus. While they are not Battle-shocked, Adeptus Astartes Terminator models also have improved Objective Control. Your army can include Space Wolves units, but no Adeptus Astartes units from another Chapter.'}],
    stratagems: [
      {kind:'stratagem',name:'Preytaker’s Eye',cp:1,phase:'Shooting or Fight phase',text:'WHEN: When an eligible Adeptus Astartes Infantry unit is selected before it shoots or fights.\nTARGET: That Infantry unit.\nEFFECT: Choose Lethal Hits or Sustained Hits 1; its weapons gain the selected keyword until the end of the phase.'},
      {kind:'stratagem',name:'Armour of Contempt',cp:1,phase:"Opponent’s Shooting or Fight phase",text:'WHEN: Just after an enemy unit selects its targets.\nTARGET: One Adeptus Astartes unit selected as a target.\nEFFECT: Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'},
      {kind:'stratagem',name:'Runes of Claiming',cp:1,phase:'End of your Command phase',text:'WHEN: At the end of your Command phase.\nTARGET: One Adeptus Astartes Infantry or Walker unit within range of an objective it controls.\nEFFECT: That objective remains under your control until the opponent’s Level of Control exceeds yours at the end of a phase.'},
      {kind:'stratagem',name:'Chilling Howl',cp:1,phase:"Opponent’s Command phase",text:'WHEN: During your opponent’s Command phase.\nTARGET: One Adeptus Astartes Terminator unit.\nEFFECT: Nearby enemy units must take Battle-shock tests, with an additional penalty if they are Below Half-strength.'},
      {kind:'stratagem',name:'Stalking Wolves',cp:1,phase:"Opponent’s Shooting phase",text:'WHEN: Just after an enemy unit selects its targets.\nTARGET: One Adeptus Astartes Infantry unit selected as a target.\nEFFECT: Models in that unit gain Stealth until the end of the phase.'},
      {kind:'stratagem',name:'Onrushing Storm',cp:1,phase:"End of opponent’s Fight phase",text:'WHEN: At the end of your opponent’s Fight phase.\nTARGET: One unengaged Adeptus Astartes Terminator unit.\nEFFECT: Remove that unit from the battlefield and place it into Strategic Reserves.'}
    ]
  },
  'legends-of-saga-and-song': {
    name: 'Legends of Saga and Song', source: 'Warhammer Community Space Wolves Faction Pack v1.0',
    rules: [{kind:'detachment', name:'Loping Charge', text:'Friendly Adeptus Astartes Terminator units add 1 to Charge rolls. Space Wolves units are permitted, but units from other Adeptus Astartes Chapters are restricted.'}],
    stratagems: [
      {kind:'stratagem',name:'Fangs of the Pack',cp:1,phase:'Fight phase',text:'When an eligible Terminator unit fights, its melee attacks gain Precision for the phase.'},
      {kind:'stratagem',name:'Chilling Howl',cp:1,phase:"Opponent's Command phase",text:'A nearby enemy takes a Battle-shock test, with an additional penalty if it is below half-strength.'},
      {kind:'stratagem',name:'Wings of the Blizzard',cp:1,phase:"End of opponent's Fight phase",text:'An eligible unengaged Terminator unit is placed into Strategic Reserves.'}
    ]
  },
  'veterans-of-the-fang': {
    name: 'Veterans of the Fang', source: 'Warhammer Community Space Wolves Faction Pack v1.0',
    rules: [{kind:'detachment', name:'Old Greymanes', text:'Grey Hunters remain eligible to shoot when they start an action, and one Grey Hunters unit can be split into two five-model units during Declare Battle Formations. Space Wolves units are permitted, but units from other Adeptus Astartes Chapters are restricted.'}],
    stratagems: [
      {kind:'stratagem',name:'Grizzled Killers',cp:1,phase:'Fight phase',text:'An eligible Grey Hunters unit chooses Sustained Hits 1 or Lethal Hits for its melee attacks that phase.'},
      {kind:'stratagem',name:'Icy Calm',cp:1,phase:'Movement phase',text:'A Grey Hunters unit that Advances or Falls Back remains eligible to start an action.'},
      {kind:'stratagem',name:'Blade-keen Senses',cp:1,phase:'Start of your Shooting phase',text:'Select a visible enemy near an eligible Grey Hunters unit; that enemy gains a short detection range for the phase.'}
    ]
  },
  'saga-of-the-great-wolf': {
    name: 'Saga of the Great Wolf', source: 'Warhammer Community Space Wolves Faction Pack v1.0',
    rules: [{kind:'detachment', name:'Master of Wolves', text:'At the start of your Command phase, activate one Hunting Pack for your army: improved Advance and Charge reliability, improved ranged Hit rolls, or a choice of Lethal Hits or Sustained Hits 1 in melee. Each pack is normally selected once; Logan Grimnar enables one repeat once per battle.'}],
    stratagems: [
      {kind:'stratagem',name:'The Foe Foreseen',cp:1,phase:"Opponent's Shooting or Fight phase",text:'When an eligible unit is targeted, worsen the Armour Penetration of attacks against it by 1 for the phase.'},
      {kind:'stratagem',name:"Grimnar's Command",cp:1,phase:'Command phase',text:'Give one unit a selected Hunting Pack effect until your next Command phase, independently of the army-wide active pack.'},
      {kind:'stratagem',name:'Fenrisian Ferocity',cp:1,phase:'Movement or Charge phase',text:'An eligible Mounted or Walker unit can move horizontally through non-Titanic models and terrain while resolving its move.'},
      {kind:'stratagem',name:'Unrelenting Hunters',cp:1,phase:'Movement phase',text:'An eligible unit remains able to charge after Falling Back; Space Wolves units also remain able to charge after Advancing.'},
      {kind:'stratagem',name:'Eye of the Pack',cp:1,phase:'Shooting phase',text:'An eligible unit adds 1 to Wound rolls for its attacks that phase.'},
      {kind:'stratagem',name:'Battle Instincts',cp:1,phase:"Opponent's Shooting phase",text:'After an enemy shoots, the targeted Space Wolves unit can make a Normal move of up to D6 inches.'}
    ]
  }
};
function officialFallbackFor(detachmentName='') {
  const key = slug(detachmentName);
  return officialSpaceWolvesFallbacks[key] || null;
}




// V3 rules registry. New Recruit roster files identify the selected detachment but
// usually do not include its Stratagem cards. Imported text always wins; this
// registry supplies concise reference summaries when the roster omits them.
const V3_DETACHMENT_LIBRARY = {
  'anvil-siege-force': {
    name:'Anvil Siege Force', faction:'Adeptus Astartes', disposition:'Take and Hold', dp:2,
    rules:[{kind:'detachment',name:'Shield of the Imperium',text:'Ranged weapons carried by Adeptus Astartes models gain Heavy. If a weapon already has Heavy and its unit Remained Stationary, improve that weapon’s Wound roll by 1.'}],
    stratagems:[
      {kind:'stratagem',name:'Armour of Contempt',cp:1,phase:"Opponent’s Shooting or Fight phase",text:'WHEN: Just after an enemy unit selects targets.\nTARGET: One targeted Adeptus Astartes unit.\nEFFECT: Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'},
      {kind:'stratagem',name:'Rigid Discipline',cp:1,phase:'End of Fight phase',text:'WHEN: End of the Fight phase.\nTARGET: One Adeptus Astartes unit within Engagement Range.\nEFFECT: It can make a Fall Back move of up to 6 inches.\nRESTRICTIONS: It must finish wholly within your deployment zone or within range of an objective marker.'},
      {kind:'stratagem',name:'Not One Backwards Step',cp:1,phase:'Command phase',text:'WHEN: Your Command phase.\nTARGET: One Adeptus Astartes Infantry unit within range of an objective marker.\nEFFECT: Double the Objective Control of its models until end of turn.\nRESTRICTIONS: The unit must Remain Stationary this turn.'},
      {kind:'stratagem',name:'No Threat Too Great',cp:2,phase:'Shooting phase',text:'WHEN: Your Shooting phase.\nTARGET: One Adeptus Astartes unit that has not shot.\nEFFECT: Its ranged attacks can re-roll Wound rolls against Monster or Vehicle units for the phase.'},
      {kind:'stratagem',name:'Battle Drill Recall',cp:1,phase:'Shooting phase',text:'WHEN: Your Shooting phase.\nTARGET: One Adeptus Astartes unit that has not shot.\nEFFECT: Its ranged weapons gain Sustained Hits 1. If the unit Remained Stationary, unmodified Hit rolls of 5+ are Critical Hits.'},
      {kind:'stratagem',name:'Hail of Vengeance',cp:1,phase:"Opponent’s Shooting phase",text:'WHEN: Just after an enemy unit finishes shooting.\nTARGET: One Adeptus Astartes unit that lost one or more models to those attacks.\nEFFECT: The surviving unit can immediately shoot back at the attacking unit, following the Stratagem’s normal eligibility restrictions.'}
    ]
  },
  'saga-of-the-great-wolf': {
    name:'Saga of the Great Wolf', faction:'Space Wolves', disposition:'Take and Hold', dp:2,
    rules:[{kind:'detachment',name:'Master of Wolves',text:'At the start of your Command phase, activate one Hunting Pack for your army: re-roll Advance and Charge rolls, add 1 to ranged Hit rolls, or grant Lethal Hits or Sustained Hits 1 to melee weapons. Each pack is normally used once per battle; Logan Grimnar enables one repeat.'}],
    stratagems:[
      {kind:'stratagem',name:'The Foe Foreseen',cp:1,phase:"Opponent’s Shooting or Fight phase",text:'WHEN: Just after an enemy selects targets.\nTARGET: One targeted Adeptus Astartes unit.\nEFFECT: Worsen the Armour Penetration of attacks against it by 1 for the phase.'},
      {kind:'stratagem',name:"Grimnar’s Command",cp:1,phase:'Command phase',text:'WHEN: Your Command phase.\nTARGET: One Adeptus Astartes unit.\nEFFECT: Give that unit one Hunting Pack effect until your next Command phase, independently of the army-wide active pack.'},
      {kind:'stratagem',name:'Fenrisian Ferocity',cp:1,phase:'Movement or Charge phase',text:'WHEN: Your Movement or Charge phase.\nTARGET: One eligible Mounted or Walker unit.\nEFFECT: It can move horizontally through non-Titanic models and terrain while resolving its move, but cannot finish an ordinary move within Engagement Range.'},
      {kind:'stratagem',name:'Unrelenting Hunters',cp:1,phase:'Movement phase',text:'WHEN: Your Movement phase.\nTARGET: One Adeptus Astartes unit that has not moved.\nEFFECT: It can charge after Falling Back; if it is a Space Wolves unit, it can also charge after Advancing.'},
      {kind:'stratagem',name:'Eye of the Pack',cp:1,phase:'Shooting phase',text:'WHEN: Your Shooting phase.\nTARGET: One Adeptus Astartes unit that has not shot.\nEFFECT: Add 1 to its Wound rolls for the phase.'},
      {kind:'stratagem',name:'Battle Instincts',cp:1,phase:"Opponent’s Shooting phase",text:'WHEN: Just after an enemy unit finishes shooting.\nTARGET: One Space Wolves unit that was targeted.\nEFFECT: It can make a Normal move of up to D6 inches.'}
    ]
  }
};
function mergeDetachmentLibrary(detachmentData={}) {
  const key=slug(detachmentData.name||detachmentData.id||'');
  const libraryEntry=RULES_LIBRARY?.lookupDetachment?.(detachmentData.name||detachmentData.id||'');
  const fallback=libraryEntry || V3_DETACHMENT_LIBRARY[key] || officialFallbackFor(detachmentData.name||'');
  if(!fallback) return detachmentData;
  const importedRules=Array.isArray(detachmentData.rules)?detachmentData.rules:[];
  const importedStrats=Array.isArray(detachmentData.stratagems)?detachmentData.stratagems:[];
  const importedEnh=Array.isArray(detachmentData.enhancements)?detachmentData.enhancements:[];
  const libraryRuleNames=new Set((fallback.rules||[]).map(r=>normaliseRuleName(r.name||'').toLowerCase()));
  const validImportedStrats=importedStrats.filter(r=>!libraryRuleNames.has(normaliseRuleName(r.name||'').toLowerCase()));
  const mergedStrats=mergeStratagemReferences(validImportedStrats,fallback.stratagems||[]);
  const preferLibrary = key === 'champions-of-fenris';
  return {
    ...fallback,...detachmentData,id:key||detachmentData.id,
    rules: preferLibrary ? (fallback.rules||[]) : (importedRules.length ? importedRules : (fallback.rules||[])),
    stratagems: mergedStrats,
    enhancements: importedEnh.length ? importedEnh : (fallback.enhancements||[]),
    referenceSource: libraryEntry ? `Rules Library ${RULES_LIBRARY.manifest.version}` : (validImportedStrats.length ? 'New Recruit import' : 'Built-in concise reference'),
    libraryStatus: libraryEntry?.status || 'legacy',
    libraryVersion: libraryEntry ? RULES_LIBRARY.manifest.version : ''
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
  importGraph: JSON.parse(localStorage.getItem('fenrisImportGraph') || 'null')
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
const attachedToEntry = (leaderEntryId) => state.roster.find(entry => entry.leaderId === leaderEntryId);
const isCharacterUnit = (unit) => !!unit && (unit.leader === true || (unit.tags || []).some(tag => /(^|\b)character($|\b)/i.test(tag)) || /character/i.test(unit.category || ''));
function canLeaderJoin(leader, host) {
  if (!leader || !host || isCharacterUnit(host)) return false;
  if (Array.isArray(leader.canLead) && leader.canLead.length) return leader.canLead.includes(host.id);
  return !!leader.imported;
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
  localStorage.setItem('fenrisImportGraph', JSON.stringify(state.importGraph));
}

function init() {
  applyTheme();
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
  const attached=state.roster.map(x=>x.leaderId).filter(Boolean);
  const duplicate=attached.some((id,i)=>attached.indexOf(id)!==i);
  const libraryReady=Boolean(det?.libraryStatus==='ready'||det?.referenceSource?.startsWith('Rules Library'));
  return [
    {id:'import',label:'Roster import',ok:state.importedUnits.length>0,detail:`${state.importedUnits.length} units`},
    {id:'detachment',label:'Detachment match',ok:VERIFICATION_DETACHMENTS.some(n=>verificationKey(n)===verificationKey(det?.name||'')),detail:det?.name||'Not found'},
    {id:'stats',label:'Model statblocks',ok:missingStats.length===0,detail:missingStats.length?`${missingStats.length} incomplete`:'Complete'},
    {id:'weapons',label:'Weapon profiles',ok:invalidWeapons.length===0,detail:invalidWeapons.length?`${invalidWeapons.length} invalid`:'Parsed'},
    {id:'leaders',label:'Leader attachments',ok:!duplicate,detail:duplicate?'Duplicate attachment':'Unique'},
    {id:'library',label:'Rules Library mapping',ok:libraryReady,detail:det?.libraryStatus||det?.referenceSource||'Not mapped'},
    {id:'rule',label:'Detachment rule',ok:Boolean(det?.rules?.length),detail:`${det?.rules?.length||0} loaded`},
    {id:'stratagems',label:'Detachment Stratagems',ok:(det?.stratagems?.length||0)>=(libraryEntry?.stratagems?.length||0) && Boolean(libraryEntry?.status==='ready'),detail:`${det?.stratagems?.length||0} loaded · ${libraryEntry?.stratagems?.length||0} expected`},
    {id:'pack',label:'Army Pack generator',ok:Boolean(state.roster.length&&$('#generateArmyPack')),detail:'Available'}
  ];
}
function runCurrentVerification(){
  const det=currentDetachment(); const key=verificationKey(det?.name||'');
  if(!key || !VERIFICATION_DETACHMENTS.some(n=>verificationKey(n)===key)){ alert('Import one of the supported Generic Astartes or Space Wolves test rosters first.'); return; }
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
  current.innerHTML=`<div class="verification-summary"><div class="verification-ring" style="--progress:${pct}%"><span>${verified}/10</span></div><div><strong>${verified} detachments verified</strong><div class="verification-progress" style="--progress:${pct}%"><i></i></div><small class="muted">Automated checks plus manual datasheet, rules and print review.</small></div></div>`;
  if(eligible && state.importedUnits.length){
    const checks=rec?.automated?Object.entries(rec.automated).map(([id,x])=>({id,label:id.replace(/(^|_)(\w)/g,(_,a,b)=>' '+b.toUpperCase()).trim(),...x})):currentVerificationChecks();
    const manual=rec?.manual||{datasheets:false,rules:false,print:false};
    current.innerHTML+=`<article class="verification-current-card"><h4>${escapeHtml(det.name)}</h4><small class="muted">Current roster · ${verificationStatus(rec).toUpperCase()}</small><div class="verification-check-grid">${checks.map(c=>`<div class="verification-mini ${c.ok?'ok':'fail'}"><b>${c.ok?'✓':'×'} ${escapeHtml(c.label)}</b><small>${escapeHtml(c.detail||'')}</small></div>`).join('')}</div><div class="verification-manual"><label><input type="checkbox" data-verify-manual="datasheets" ${manual.datasheets?'checked':''}> Datasheets visually checked</label><label><input type="checkbox" data-verify-manual="rules" ${manual.rules?'checked':''}> Rules cards checked</label><label><input type="checkbox" data-verify-manual="print" ${manual.print?'checked':''}> Army Pack PDF checked</label></div></article>`;
    current.querySelectorAll('[data-verify-manual]').forEach(input=>input.addEventListener('change',e=>setManualVerification(key,e.target.dataset.verifyManual,e.target.checked)));
  } else current.innerHTML+=`<p class="muted">Import one of the supported Generic Astartes or Space Wolves rosters and press <strong>Run verification</strong>.</p>`;
  dashboard.innerHTML=`<div class="verification-table"><div class="verification-row header"><span>Detachment</span><span>Status</span><span>Checks</span><span>Last tested</span></div>${VERIFICATION_DETACHMENTS.map(name=>{const k=verificationKey(name),r=verificationState[k],status=verificationStatus(r),auto=Object.values(r?.automated||{}),pass=auto.filter(x=>x.ok).length,date=r?.checkedAt?new Date(r.checkedAt).toLocaleDateString():'—';return `<div class="verification-row"><strong>${escapeHtml(name)}</strong><span class="verification-status ${status}">${status.toUpperCase()}</span><span>${auto.length?`${pass}/${auto.length}`:'—'}</span><span>${date}</span></div>`}).join('')}</div>`;
}
function exportVerificationReport(){
  const report={generatedAt:new Date().toISOString(),appVersion:APP_VERSION,scope:'10 Generic Adeptus Astartes + 7 Space Wolves detachments',summary:{verified:VERIFICATION_DETACHMENTS.filter(n=>verificationStatus(verificationState[verificationKey(n)])==='verified').length,total:VERIFICATION_DETACHMENTS.length},detachments:VERIFICATION_DETACHMENTS.map(name=>({name,status:verificationStatus(verificationState[verificationKey(name)]),...(verificationState[verificationKey(name)]||{})}))};
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
    Number.isInteger(expectedRules) ? loadedRules===expectedRules : false,
    !libraryEntry ? 'No Rules Library entry' : !expectation ? 'No verification expectation configured' : `${loadedRules} loaded · ${expectedRules} expected`,
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


function libraryPrecisionIssues(entry){
  if(!entry) return ['No Rules Library entry'];
  const banned=[
    /\bnearby\b/i,/\bclose enough\b/i,/\bclose to\b/i,/\bwithin range\b/i,
    /\bimproved (?:reliability|resilience|survivability|protection|output|benefit)\b/i,
    /\bstronger\b/i,/\bsmall number\b/i,/\blonger range\b/i,
    /\bimprove(?:s|d)?\b(?![^.]{0,60}\b(?:by|to|add|subtract)\s*(?:D?\d|one|two))/i
  ];
  const issues=[];
  const scan=(label,text)=>{ const value=String(text||''); for(const rule of banned){ if(rule.test(value)){ issues.push(`${label}: ${value}`); break; } } };
  (entry.rules||[]).forEach(x=>scan(`Rule ${x.name}`,x.text));
  (entry.enhancements||[]).forEach(x=>scan(`Enhancement ${x.name}`,x.text));
  (entry.stratagems||[]).forEach(x=>{ scan(`Stratagem ${x.name} WHEN`,x.when); scan(`Stratagem ${x.name} TARGET`,x.target); scan(`Stratagem ${x.name} EFFECT`,x.effect); scan(`Stratagem ${x.name} RESTRICTIONS`,x.restrictions); });
  return issues;
}

function batchCheck(id,label,ok,detail=''){ return {id,label,ok:Boolean(ok),detail:String(detail||'')}; }
function analyseImportedRoster(imported,fileName=''){
  const baseDetachment=imported.detachmentData || {id:imported.detachmentId||'imported',name:imported.detachment||'Imported Detachment',rules:[],enhancements:imported.enhancements||[],stratagems:imported.stratagems||[]};
  const merged=mergeDetachmentLibrary(baseDetachment);
  const libraryEntry=RULES_LIBRARY?.lookupDetachment?.(merged.name||merged.id||'')||null;
  const expectation=libraryEntry?.verification?.expected||null;
  const units=imported.units||[];
  const entries=imported.entries||[];
  const weapons=units.flatMap(u=>(u.weapons||[]).map(w=>({unit:u.name,...w})));
  const missingStats=units.filter(u=>!u.stats||['M','T','SV','W','LD','OC'].some(k=>u.stats[k]===undefined||u.stats[k]===null||String(u.stats[k]).trim()===''));
  const invalidWeapons=weapons.filter(w=>[w.name,w.type,w.range,w.a,w.skill,w.s,w.ap,w.d].some(v=>v===undefined||v===null||String(v).trim()===''));
  const duplicateLeaderIds=entries.map(e=>e.leaderId).filter(Boolean).filter((id,i,a)=>a.indexOf(id)!==i);
  const loadedRules=(merged.rules||[]).length, loadedStrats=(merged.stratagems||[]).length, loadedEnh=(merged.enhancements||[]).length;
  const expectedRules=expectation?.detachmentRules, expectedStrats=expectation?.stratagems, expectedEnh=expectation?.enhancements;
  const checks=[
    batchCheck('parse','ROSZ parsed',units.length>0,`${units.length} units · ${entries.length} entries`),
    batchCheck('detachment','Detachment recognised',Boolean(imported.detachment),imported.detachment||'No detachment found'),
    batchCheck('library','Rules Library match',Boolean(libraryEntry),libraryEntry?`${libraryEntry.name} · ${libraryEntry.status}`:'No library entry'),
    batchCheck('stats','Model statblocks',missingStats.length===0,missingStats.length?missingStats.map(u=>u.name).slice(0,4).join(', '):'Complete'),
    batchCheck('weapons','Weapon profiles',invalidWeapons.length===0,invalidWeapons.length?invalidWeapons.slice(0,4).map(w=>`${w.unit}: ${w.name}`).join(', '):`${weapons.length} parsed`),
    batchCheck('leaders','Leader uniqueness',duplicateLeaderIds.length===0,duplicateLeaderIds.length?`${duplicateLeaderIds.length} duplicate attachment(s)`:'Unique'),
    batchCheck('rules','Detachment rules',Number.isInteger(expectedRules)?loadedRules===expectedRules:Boolean(loadedRules),Number.isInteger(expectedRules)?`${loadedRules}/${expectedRules}`:`${loadedRules} loaded; no manifest expectation`),
    batchCheck('stratagems','Detachment Stratagems',Number.isInteger(expectedStrats)?loadedStrats===expectedStrats:false,!libraryEntry?'No library entry':!expectation?`${loadedStrats} loaded; no verification manifest`:`${loadedStrats}/${expectedStrats}`),
    batchCheck('enhancements','Enhancements',Number.isInteger(expectedEnh)?loadedEnh===expectedEnh:false,!libraryEntry?'No library entry':!expectation?`${loadedEnh} loaded; no verification manifest`:`${loadedEnh}/${expectedEnh}`),
    batchCheck('precision','Precise values and distances',libraryPrecisionIssues(libraryEntry).length===0,libraryPrecisionIssues(libraryEntry).length?libraryPrecisionIssues(libraryEntry).slice(0,3).join(' | '):'All modifiers and distances are numeric')
  ];
  return {id:crypto.randomUUID(),fileName,name:imported.name||fileName,detachment:imported.detachment||merged.name||'',points:imported.points||0,units:units.length,passed:checks.filter(c=>c.ok).length,total:checks.length,checks,imported};
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
  host.innerHTML=`<div class="batch-results-grid">${results.map(r=>{const ok=r.passed===r.total;return `<article class="batch-result-card ${ok?'pass':'fail'}"><div class="batch-result-head"><div><h4>${escapeHtml(r.detachment||r.name)}</h4><small>${escapeHtml(r.fileName)} · ${r.units} units · ${r.points} pts</small></div><span class="batch-score">${r.passed}/${r.total}</span></div><div class="batch-checks">${r.checks.map(c=>`<div class="batch-check ${c.ok?'ok':'fail'}"><span class="batch-check-icon">${c.ok?'✓':'×'}</span><div><b>${escapeHtml(c.label)}</b><small>${escapeHtml(c.detail)}</small></div></div>`).join('')}</div>${batchTestRuntime.importedById.has(r.id)?`<div class="batch-actions"><button class="ghost" data-load-batch="${r.id}" type="button">Load in app</button></div>`:''}</article>`}).join('')}</div>`;
}
function loadBatchRoster(id){
  const imported=batchTestRuntime.importedById.get(id); if(!imported)return;
  applyImportedRoster(imported); setImportStatus(`<strong>Loaded from Batch Test Lab.</strong><br>${escapeHtml(imported.name)} · ${imported.points} pts · ${escapeHtml(imported.detachment||'')}`,'success');
  document.querySelector('.developer-panel')?.removeAttribute('open');
}

function renderAll() {
  renderImportInspector();
  renderVerificationDashboard();
  renderTestLab();
  $('#pointsTotal').textContent = rosterPoints();
  renderRoster(); renderValidation(); renderCards(); renderReference(); renderThemeTargets(); syncThemeControls(); renderThemePreview(); renderPrintCenter();
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
  state.roster.push({ id: crypto.randomUUID(), unitId: unit.id, weaponId: unit.weaponOptions?.[0]?.id || '', enabledWeapons: unit.imported ? (unit.weapons || []).map(w => w.id || w.name) : null, leaderId: '', enhancementId: '', cardStyle: {} });
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
      const unit = unitById(entry.unitId); const linkedHost = unit.leader ? attachedToEntry(entry.id) : null;
      const validLeaders = state.roster.filter(other => { const leader=unitById(other.unitId); if(!leader||!isCharacterUnit(leader)||!canLeaderJoin(leader,unit)) return false; const usedBy=attachedToEntry(other.id); return !usedBy||usedBy.id===entry.id; });
      const article=document.createElement('article'); article.className=`roster-unit compact-unit ${linkedHost?'leader-linked':''}`;
      const status=linkedHost?`<span class="link-status linked">Attached to ${escapeHtml(unitById(linkedHost.unitId).name)}</span>`:unit.leader?'<span class="link-status available">Not attached</span>':(entry.leaderId?`<span class="link-status linked">Leader: ${escapeHtml(unitById(state.roster.find(x=>x.id===entry.leaderId)?.unitId)?.name||'')}</span>`:'');
      article.innerHTML=`<div class="roster-unit-header"><div><h3>${escapeHtml(unit.name)}</h3><div class="meta">${escapeHtml(unit.size)} · ${unit.points} pts</div>${status}</div><button class="small-button remove">Remove</button></div><div class="config-grid compact-config">
      ${!unit.leader?`<label>Attached Leader<select class="leader-select"><option value="">None</option>${validLeaders.map(l=>`<option value="${l.id}" ${entry.leaderId===l.id?'selected':''}>${escapeHtml(unitById(l.unitId).name)}</option>`).join('')}</select></label>`:''}
      </div>`;
      article.querySelector('.remove').addEventListener('click',()=>{state.roster=state.roster.filter(x=>x.id!==entry.id).map(x=>x.leaderId===entry.id?{...x,leaderId:''}:x);saveState();renderAll();});
      article.querySelector('.leader-select')?.addEventListener('change',e=>{const requested=e.target.value;if(requested)state.roster.forEach(other=>{if(other.id!==entry.id&&other.leaderId===requested)other.leaderId=''});entry.leaderId=requested;saveState();renderAll();});
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
  const attached=state.roster.map(x=>x.leaderId).filter(Boolean);
  const duplicate=attached.some((id,i)=>attached.indexOf(id)!==i);
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
    {label:'Leader attachments are unique',ok:!duplicate,detail:duplicate?'A Leader is attached more than once':'No duplicate attachments'},
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
function getEntryWeapons(entry, unit) {
  if (!unit) return [];
  const selected = unit.weaponOptions?.find(w => w.id === entry.weaponId);
  const base = [...(unit.weapons || []), ...(selected ? [selected] : []), ...(unit.fixedWeapons || [])];
  // New Recruit already contains the selected loadout. Imported weapons are therefore
  // read-only in the Army Builder and always included on the generated datasheet.
  return base;
}

function statsBlock(unit, label, className='') {
  return `<section class="profile-block ${className}"><div class="profile-label">${label}</div><div class="stats">${Object.entries(unit.stats).map(([k,v]) => `<div class="stat"><b>${v}</b><span>${k}</span></div>`).join('')}</div></section>`;
}

function modelStatsBlocks(unit, className='') {
  const profiles = Array.isArray(unit.modelProfiles) && unit.modelProfiles.length
    ? unit.modelProfiles
    : [{name: unit.name, stats: unit.stats}];

  // Models with an identical characteristic profile share one stat block. This keeps
  // Sergeants, Pack Leaders and regular squad members together when their rules are
  // mechanically identical, while genuinely different models remain separate.
  const groups = new Map();
  profiles.forEach(profile => {
    const stats = profile.stats || unit.stats;
    const key = ['M','T','SV','W','LD','OC'].map(k => String(stats?.[k] ?? '—')).join('|');
    if (!groups.has(key)) groups.set(key, {stats, names:[]});
    const name = profile.name || unit.name;
    if (!groups.get(key).names.includes(name)) groups.get(key).names.push(name);
  });

  return [...groups.values()].map(group => {
    const label = groups.size === 1
      ? unit.name
      : group.names.join(' / ');
    return statsBlock({stats:group.stats}, label, className);
  }).join('');
}

function shortRuleText(text='', max=220) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = cut.lastIndexOf('.');
  return `${(sentence > 90 ? cut.slice(0, sentence + 1) : cut.replace(/\s+\S*$/, ''))}…`;
}

function normaliseRuleName(name='') { return String(name).replace(/[‐‑‒–—−]/g,'-').replace(/[\[\]()]/g,'').replace(/\s+/g,' ').replace(/\s*-\s*/g,'-').trim(); }
function isGenericAbilityName(name='') {
  const n = normaliseRuleName(name);
  return /^(core|faction|keywords?|abilities?|weapon abilities?|wargear abilities?|leader|deep strike|feel no pain(?: \d+\+)?|deadly demise(?: \w+)?|scouts?(?: \d+\")?|stealth|lone operative|infiltrators?|fights first|firing deck(?: \d+)?|hover|invulnerable save(?: \d+\+)?|supreme commander|battleline|assault|pistol|heavy|blast|hazardous|torrent|precision|twin-linked|devastating wounds|lethal hits|sustained hits(?: \d+)?|ignores cover|indirect fire|extra attacks|lance|one shot|rapid fire(?: \d+)?|melta(?: \d+)?|anti\s*-\s*.+|close quarters)$/i.test(n);
}
function isWeaponKeywordExplanation(name='', text='') {
  // Close Quarters and Anti-X are always weapon keywords in this app, never prose abilities.
  if (/\bclose[\s-]+quarters\b/i.test(`${name} ${text}`) || /\banti\s*-\s*[a-z0-9 ]+(?:\s+\d\+)?\b/i.test(String(name))) return true;
  const n = normaliseRuleName(name);
  const t = normaliseRuleName(text);
  const raw = normaliseRuleName(`${name} ${text}`);
  const keywordTitle = /^(?:anti-(?:x|[a-z0-9 ][^:;,.]*\d\+)|close quarters|assault|pistol|heavy|blast|hazardous|torrent|precision|twin-linked|devastating wounds|lethal hits|sustained hits(?: \d+)?|ignores cover|indirect fire|extra attacks|lance|one shot|rapid fire(?: \d+)?|melta(?: \d+)?)$/i;
  const prefixedKeyword = /^(?:(?:weapon|wargear) abilities?[: -]*)?(?:anti-(?:x|[^:;,.]+)|close quarters)(?:\b|:)/i;
  const officialKeywordExplanation = /(?:critical wound|unmodified wound roll|targets? a unit with the matching keyword|within engagement range|ranged weapons? equipped by models? in this unit)/i;
  return WEAPON_KEYWORD_PATTERN.test(n)
    || keywordTitle.test(n)
    || /^(weapon abilities?|\[[^\]]+\])$/i.test(n)
    || prefixedKeyword.test(n)
    || prefixedKeyword.test(t)
    || prefixedKeyword.test(raw)
    || ((/anti-|close quarters/i.test(raw)) && officialKeywordExplanation.test(raw))
    || (/weapon/i.test(t) && /attacks?|equipped|target|hit roll|wound roll/i.test(t) && (WEAPON_KEYWORD_PATTERN.test(n) || keywordTitle.test(n)));
}

function abilitiesSection(unit, heading) {
  const groups = (unit.modelAbilities?.length ? unit.modelAbilities : [{model:unit.name, abilities:unit.abilities || []}])
    .map(group => ({
      model: group.model,
      abilities: (group.abilities || []).filter(Boolean)
        .filter(raw => !/\bclose[\s-]+quarters\b/i.test(String(raw)) && !isWeaponKeywordExplanation(String(raw), String(raw)))
        .map(a => {
          const raw = String(a).trim();
          const parts = raw.split(':');
          let name = parts.shift() || '';
          let text = parts.join(':').trim();
          // Some New Recruit exports wrap keyword rules as “Abilities: Anti-X: …”.
          // Inspect and discard the nested keyword title rather than rendering it as prose.
          if (/^(?:abilities?|weapon abilities?|wargear abilities?)$/i.test(name.trim()) && /^(?:anti-(?:x|[^:]+)|close quarters)(?:\b|:)/i.test(text)) return null;
          return {name: name.trim(), text: String(text || name.trim()).trim()};
        }).filter(a => a && a.text && !/\bclose[\s-]+quarters\b/i.test(`${a.name} ${a.text}`) && !isGenericAbilityName(a.name) && !isWeaponKeywordExplanation(a.name, a.text))
    })).filter(group => group.abilities.length);
  if (!groups.length) return '';
  return `<div class="card-section"><h4>${heading}</h4><div class="ability-groups">${groups.map(group => `<div class="ability-group"><strong>${escapeHtml(group.model)}</strong><ul class="ability-list">${group.abilities.map(a => `<li><b>${escapeHtml(a.name)}</b>${a.text && a.text !== a.name ? ` — ${escapeHtml(a.text)}` : ''}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
}

const IMPORTANT_UNIT_KEYWORDS = /^(Character|Infantry|Mounted|Vehicle|Monster|Beast|Swarm|Walker|Dreadnought|Fly|Psyker|Grenades|Smoke|Terminator|Jump Pack|Cavalry|Battleline|Dedicated Transport|Epic Hero|Titanic|Aircraft|Transport)$/i;
function importantKeywords(unit, leader=null) {
  return [...new Set([...(unit?.tags || []), ...(leader?.tags || [])]
    .map(x => String(x).trim())
    .filter(x => IMPORTANT_UNIT_KEYWORDS.test(x)))];
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
  const values=[...(unit?.tags||[]), state.importedMeta?.faction, state.importedMeta?.catalogue, state.importedMeta?.detachment].filter(Boolean).map(String);
  const chapter = detectChapterName(values);
  if (chapter) return chapter;
  const faction = values.find(v=>/Adeptus Astartes|Space Marines/i.test(v));
  if (faction) return String(faction).replace(/\s*[-–|].*$/, '').trim();
  return 'Adeptus Astartes';
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
  clone.querySelector('.card-title').textContent = leader ? `${unit.name} + ${leader.name}` : unit.name;
  const enhancement = allEnhancements().find(e => e.id === (leaderEntry?.enhancementId || entry.enhancementId));
  clone.querySelector('.card-points').textContent = `${unit.points + (leader?.points || 0) + (enhancement?.points || 0)} pts`;
  const body = clone.querySelector('.card-body');
  const leaderWeapons = leaderEntry && leader ? getEntryWeapons(leaderEntry, leader) : [];
  const unitWeapons = getEntryWeapons(entry, unit);
  body.innerHTML = `
    ${leader ? `<div class="attached-banner">Attached Leader</div>${statsBlock(leader, leader.name, 'leader-profile')}${weaponSection(`${leader.name} — Ranged Weapons`, leaderWeapons.filter(w => w.type === 'Ranged'), 'leader-weapons')}${weaponSection(`${leader.name} — Melee Weapons`, leaderWeapons.filter(w => w.type === 'Melee'), 'leader-weapons')}${abilitiesSection(leader, `${leader.name} — Abilities`)}` : ''}
    <div class="unit-divider"><span>Other Models in this Unit</span></div>
    ${modelStatsBlocks(unit, 'unit-profile')}
    ${weaponSection(`${unit.name} — Ranged Weapons`, unitWeapons.filter(w => w.type === 'Ranged'))}
    ${weaponSection(`${unit.name} — Melee Weapons`, unitWeapons.filter(w => w.type === 'Melee'))}
    ${abilitiesSection(unit, `${unit.name} — Abilities`)}
    ${enhancement ? `<div class="card-section"><h4>Enhancement</h4><div class="ability-group"><strong>${enhancement.name}</strong><p>${enhancement.text}</p></div></div>` : ''}
    ${importantKeywords(unit, leader).length ? `<div class="card-section"><h4>Important Keywords</h4><p>${importantKeywords(unit, leader).map(escapeHtml).join(', ')}</p></div>` : ''}
    <p class="card-note">Imported from New Recruit. Verify the roster against the latest official publication.</p>`;
  return clone;
}

function weaponSection(title, weapons, extraClass='') {
  if (!weapons.length) return '';
  return `<div class="card-section ${extraClass}"><h4>${title}</h4><table class="weapon-table"><colgroup><col class="weapon-name-col"><col><col><col><col><col><col></colgroup><thead><tr><th>Weapon</th><th>Rng</th><th>A</th><th>BS/WS</th><th>S</th><th>AP</th><th>D</th></tr></thead><tbody>${weapons.map(w=>`<tr><td><strong>${escapeHtml(w.name)}</strong>${w.keywords?.length?`<div class="weapon-keywords">${w.keywords.map(k=>`<span>${escapeHtml(k)}</span>`).join('')}</div>`:''}</td><td>${escapeHtml(w.range)}</td><td>${escapeHtml(w.a)}</td><td>${escapeHtml(w.skill)}</td><td>${escapeHtml(w.s)}</td><td>${escapeHtml(w.ap)}</td><td>${escapeHtml(w.d)}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderCards() {
  const container = $('#cardsContainer'); container.innerHTML = '';
  const attached = new Set(state.roster.map(x => x.leaderId).filter(Boolean));
  const printable = state.roster.filter(x => !attached.has(x.id));
  if (!printable.length) { container.innerHTML = '<div class="empty">Import units to generate datasheets.</div>'; return; }
  printable.forEach(entry => container.append(createCard(entry, unitById(entry.unitId))));
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
function hasStructuredFields(text='') {
  const clean=cleanCodexText(text);
  return ['WHEN','TARGET','EFFECT'].every(label => new RegExp(`(?:^|\\n)${label}:`, 'i').test(clean));
}
function structuredStratagem(rule={}) {
  const clean=cleanCodexText(rule.text || '');
  if (hasStructuredFields(clean)) return {...rule,text:clean};
  const phase=cleanCodexText(rule.phase || 'Any phase');
  const targetMatch=clean.match(/(?:one|an)\s+(?:eligible\s+)?([^.;]+?\bunit\b)/i);
  const target=targetMatch ? `One eligible ${targetMatch[1].trim()}.` : 'One eligible unit described by this Stratagem.';
  return {...rule,text:`WHEN: ${phase}.\nTARGET: ${target}\nEFFECT: ${clean || 'Resolve this Stratagem as described by its current rules reference.'}`};
}
function mergeStratagemReferences(imported=[], library=[]) {
  const byName=new Map();
  // Prefer the library first because it is consistently structured. Imported entries
  // replace it only when they contain a full WHEN/TARGET/EFFECT rules block.
  library.forEach(rule => byName.set(normaliseRuleName(rule.name).toLowerCase(), structuredStratagem(rule)));
  imported.forEach(rule => {
    const key=normaliseRuleName(rule.name).toLowerCase();
    if (!byName.has(key) || hasStructuredFields(rule.text)) byName.set(key, structuredStratagem(rule));
  });
  return [...byName.values()];
}
function formatOfficialRuleText(text='') {
  const clean=cleanCodexText(text);
  if (!clean) return '';
  const labels=['WHEN','TARGET','EFFECT','RESTRICTIONS','DURATION'];
  const escaped=labels.join('|');
  const regex=new RegExp(`(?:^|\\n|\\s)(WHEN|TARGET|EFFECT|RESTRICTIONS|DURATION):\\s*([\\s\\S]*?)(?=(?:\\n|\\s)(?:${escaped}):|$)`,'gi');
  const parts=[]; let match;
  while ((match=regex.exec(clean))) parts.push({label:match[1].toUpperCase(),value:match[2].trim()});
  if (parts.length) return `<div class="official-rule-text">${parts.map(p=>`<div class="official-rule-row"><strong>${p.label}</strong><p>${escapeHtml(p.value)}</p></div>`).join('')}</div>`;
  return `<div class="official-rule-text"><p>${escapeHtml(clean)}</p></div>`;
}
function ruleCard(rule, extraClass='') {
  return `<article class="rule-box official-rule ${extraClass}"><h3>${escapeHtml(cleanCodexText(rule.name))}</h3>${formatOfficialRuleText(rule.text)}</article>`;
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
  return `<article class="stratagem official-stratagem compact-stratagem-card ${phaseClass}"><header><div class="stratagem-heading"><h3>${escapeHtml(cleanCodexText(rule.name))}</h3><span class="badge phase-badge ${phaseClass}">${escapeHtml(cleanCodexText(rule.phase || 'Detachment'))}</span></div><strong class="cp-badge"><span>${cp}</span><small>CP</small></strong></header>${formatOfficialRuleText(rule.text)}</article>`;
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
  let armyRules = rules.filter(r => r.kind === 'army' && !unitAbilityNames.has(normaliseRuleName(r.name || '').toLowerCase()) && !isWeaponKeywordExplanation(r.name, r.text));
  armyRules = armyRules.filter(r => ruleMatchesSearch(r, search));
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
  const attached = new Set(state.roster.map(x => x.leaderId).filter(Boolean));
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
    return `<option value="${entry.id}">${unit.name}${leader ? ` + ${leader.name}` : ''}</option>`;
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
  preview.append(createCard({unitId:sampleUnit.id, leaderId:'', enhancementId:'', cardStyle:{}}, sampleUnit, true));
}


function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
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
  saveState(); renderAll(); setImportStatus('Imported roster data removed.', 'info');
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

function parseRosterXml(xmlText, sourceName='roster.ros') {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('The roster contains invalid XML.');
  const roster = doc.querySelector('roster');
  if (!roster) throw new Error('No New Recruit/BattleScribe roster was found.');
  const name = roster.getAttribute('name') || sourceName.replace(/\.[^.]+$/, '');
  const topSelections = directChildrenByLocalName(roster, 'forces').flatMap(f => directChildrenByLocalName(f, 'force')).flatMap(f => directChildrenByLocalName(f, 'selections')).flatMap(s => directChildrenByLocalName(s, 'selection'));
  const unitSelections = topSelections.filter(sel => isRosterUnitSelection(sel));
  const units = [];
  const entries = [];
  unitSelections.forEach((selection, index) => {
    const unit = unitFromXmlSelection(selection, index);
    units.push(unit);
    entries.push({id: crypto.randomUUID(), unitId: unit.id, weaponId:'', enabledWeapons: unit.weapons.map(w => w.id || w.name), leaderId:'', enhancementId:'', cardStyle:{}});
  });
  if (!units.length) throw new Error('No recognisable units were found in this roster.');
  const nonLeaderIds = units.filter(u => !isCharacterUnit(u)).map(u => u.id);
  units.filter(isCharacterUnit).forEach(u => { u.leader = true; u.canLead = [...nonLeaderIds]; });
  const detachmentInfos = detectImportedDetachments(doc);
  const detachmentInfo = detachmentInfos[0] || {id:'imported-detachment',name:'Imported Detachment',node:null,dp:0};
  let uniqueRules = dedupeBy(detachmentInfos.flatMap(info => collectImportedRules(doc, info)), r => `${r.kind}|${String(r.name).toLowerCase()}|${r.text}`);
  const importGraph = buildImportGraph(doc, detachmentInfo);
  importGraph.detachments = detachmentInfos.map(d=>({id:d.id,name:d.name,dp:d.dp}));

  // Safety pass: any structured Stratagem profile present in the parsed graph
  // but missed by the first classifier is added here. Restrict this to profiles
  // outside top-level roster units or with a detachment-related path, so unit
  // abilities are not mistaken for Detachment Stratagems.
  const recoveredStratagems = (importGraph.stratagemCandidates || []).flatMap(candidate => {
    const path = Array.isArray(candidate.path) ? candidate.path : [];
    const related = pathLooksDetachmentRelated(path, detachmentInfo?.name || '');
    const topSelection = String(candidate.topSelection || '');
    const topUnit = topSelection && units.some(u => u.name.toLowerCase() === topSelection.toLowerCase());
    if (topUnit && !related) return [];
    const fields = Object.fromEntries((candidate.characteristics || []).map(c => [String(c.name || '').trim().toUpperCase(), String(c.value || '').trim()]));
    if (!fields.WHEN || !fields.TARGET || !fields.EFFECT) return [];
    const text = ['WHEN','TARGET','EFFECT','RESTRICTIONS','DURATION'].filter(k => fields[k]).map(k => `${k}: ${fields[k]}`).join('\n');
    const cp = Number((`${candidate.name} ${text}`.match(/([123])\s*CP/i) || [])[1] || 1);
    return [{kind:'stratagem', name:String(candidate.name || 'Imported Stratagem').replace(/\s+[123]\s*CP.*$/i,'').trim(), text, cp, phase:extractRuleTiming(text), sourcePath:path}];
  });
  uniqueRules = dedupeBy([...uniqueRules, ...recoveredStratagems], r => `${r.kind}|${String(r.name).toLowerCase()}|${r.text}`).slice(0,500);
  const points = units.reduce((sum,u) => sum + (u.points || 0), 0);
  const force = doc.querySelector('force');
  const catalogue = force?.getAttribute('catalogueName') || '';
  const faction = catalogue || 'Adeptus Astartes';
  const detachmentsData=detachmentInfos.map(info=>{
    const directRules=info.node ? [...info.node.querySelectorAll(':scope > rules > rule')].map(r=>({kind:'detachment',name:r.getAttribute('name')||info.name,text:textOf(r,'description')})).filter(r=>r.text) : [];
    const importedForThis=uniqueRules.filter(r=>Array.isArray(r.sourcePath) && r.sourcePath.includes(info.name));
    const raw={id:info.id,name:info.name,dp:info.dp,rules:directRules.length?directRules:importedForThis.filter(r=>r.kind==='detachment'),enhancements:importedForThis.filter(r=>r.kind==='enhancement'),stratagems:importedForThis.filter(r=>r.kind==='stratagem')};
    return {...mergeDetachmentLibrary(raw),dp:info.dp || mergeDetachmentLibrary(raw).dp || 0};
  });
  const detachmentData=detachmentsData[0] || mergeDetachmentLibrary({id:detachmentInfo.id,name:detachmentInfo.name,dp:detachmentInfo.dp,rules:[],enhancements:[],stratagems:[]});
  return {name, source:sourceName, units, entries, rules:uniqueRules, points, detachment:detachmentInfo.name, detachments:detachmentInfos.map(d=>d.name), detachmentId:detachmentInfo.id, faction, catalogue, importGraph, detachmentData, detachmentsData};
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
  const isLeader = categoryNames.some(c => /character|epic hero/i.test(c)) || /character/i.test(name) || abilities.some(a => /^leader$/i.test(a.name));
  const id = `import-${slug(name)}-${index}-${Math.random().toString(36).slice(2,7)}`;
  const tags = dedupeBy([...categoryNames, ...(isLeader ? ['Character'] : [])], x => x);
  return {
    id, name, category: categoryNames[0] || (isLeader ? 'Character' : 'Imported unit'), points,
    size: modelCounts.length ? modelCounts.map(m=>`${m.count} ${m.name}`).join(' · ') : `${totalModels} model${totalModels===1?'':'s'}`,
    tags, stats, modelProfiles:modelStatProfiles, weapons,
    abilities: abilities.map(a => `${a.name}: ${a.text}`),
    modelAbilities:[...grouped].map(([model,abilities])=>({model,abilities})),
    leader:isLeader, canLead:[], imported:true, importSource:'New Recruit'
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

const WEAPON_KEYWORD_PATTERN = /^(Assault|Pistol|Heavy|Rapid Fire(?:\s+\d+)?|Melta(?:\s+\d+)?|Blast|Hazardous|Torrent|Lethal Hits|Sustained Hits(?:\s+\d+)?|Devastating Wounds|Twin-linked|Indirect Fire|Precision|Anti\s*-\s*[^,;]+|Extra Attacks|Lance|Ignores Cover|One Shot|Close[\s-]+Quarters|Psychic)$/i;
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
function dedupeWeaponKeywords(values=[]) {
  const result=[]; const seen=new Set();
  values.flat().filter(Boolean).forEach(value=>{
    const canonical=canonicalWeaponKeyword(value); const key=canonical.toLowerCase().replace(/[\s-]+/g,' ');
    if(!seen.has(key)){seen.add(key);result.push(canonical);}
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
  if (/Oath of Moment|army rule|faction rule|Curse of the Wulfen|Sagas/i.test(combined)) return {kind:'army',name:n,text:t};
  if (isUnitSpecificAbility(n,t)) return null;
  return null;
}
function extractRuleTiming(text=''){ const m=String(text).match(/WHEN:\s*([^.;]+)/i); return m?m[1].trim():'Detachment'; }

function isArmyOrDetachmentRule(name='', text='') {
  const combined = `${name} ${text}`;
  if (WEAPON_KEYWORD_PATTERN.test(String(name).trim())) return false;
  return /Oath of Moment|Space Wolves|Saga|Champions of Russ|Stormlance|detachment rule|army rule/i.test(combined);
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
    else if(/army rule|faction rule|oath of moment/i.test(`${name} ${text}`)) add('army',name,text,{sourcePath:path});
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
  const keywords = dedupeWeaponKeywords([...bracketKeywords, ...profileKeywords, ...localKeywords]);
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
    const leader = categories.some(c => /character/i.test(typeof c==='string'?c:c.name||''));
    return {id:`import-${slug(item.name||'unit')}-${index}`,name:item.name||`Imported unit ${index+1}`,category:(typeof categories[0]==='string'?categories[0]:categories[0]?.name)||'Imported unit',points:Number(item.points||item.cost||0),size:String(item.size||item.number||'1 model'),tags:categories.map(c=>typeof c==='string'?c:c.name).filter(Boolean),stats:item.stats||{M:'—',T:'—',SV:'—',W:'—',LD:'—',OC:'—'},weapons,abilities:(item.abilities||item.rules||[]).map(a=>typeof a==='string'?a:`${a.name||'Ability'}: ${a.text||a.description||''}`),modelAbilities:[{model:item.name||'Unit',abilities:(item.abilities||item.rules||[]).map(a=>typeof a==='string'?a:`${a.name||'Ability'}: ${a.text||a.description||''}`)}],leader,canLead:[],imported:true,importSource:'New Recruit JSON'};
  });
  const nonLeaders=units.filter(u=>!isCharacterUnit(u)).map(u=>u.id); units.filter(isCharacterUnit).forEach(u=>{u.leader=true;u.canLead=[...nonLeaders]});
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
    const enhancement = allEnhancements().find(e => e.id === (leaderEntry?.enhancementId || entry.enhancementId));
    groups.get(key).push({name:unit.name, points:unit.points + (leader?.points || 0) + (enhancement?.points || 0), leader:leader?.name, enhancement:enhancement?.name});
  });
  const order=['Epic Heroes','Characters','Infantry','Mounted & Beasts','Vehicles','Other Units'];
  return `<div class="pack-overview-grid">${[...groups.keys()].sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(group => `<section class="pack-overview-group"><h3>${escapeHtml(group)}</h3>${groups.get(group).map(item => `<div class="pack-overview-unit"><span><strong>${escapeHtml(item.name)}</strong>${item.leader?`<br><small>Attached: ${escapeHtml(item.leader)}</small>`:''}${item.enhancement?`<br><small>${escapeHtml(item.enhancement)}</small>`:''}</span><b>${item.points} pts</b></div>`).join('')}</section>`).join('')}</div>`;
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
  const cardsHtml=$('#cardsContainer')?.innerHTML || '';
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
