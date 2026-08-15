/* Astartes Forge Gold Master validation
 * Run from repository root: node tests/scripts/verify-libraries.js
 */
global.window=global;
require('../../src/libraries/keywords/keyword-library.js');
require('../../src/libraries/chapters/chapter-library.js');
require('../../src/libraries/reference/official-reference-library.js');
require('../../src/libraries/rules/rules-library.js');

const rules=window.ASTARTES_RULES_LIBRARY;
const groups=window.ASTARTES_CHAPTER_LIBRARY.verificationGroups;
const official=window.ASTARTES_OFFICIAL_REFERENCE;
const keywords=window.KEYWORD_LIBRARY;
const failures=[];
const warnings=[];
const norm=v=>String(v||'').toLowerCase().replace(/[’']/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

function equalEnhancements(actual=[], expected=[]){
  const a=new Map(actual.map(x=>[norm(x.name),x]));
  for(const e of expected){
    const item=a.get(norm(e.name));
    if(!item){ failures.push(`missing enhancement: ${e.name}`); continue; }
    if(e.points!=null && Number(item.points)!==Number(e.points)) failures.push(`${e.name}: points ${item.points} != ${e.points}`);
  }
  if(actual.length!==expected.length) failures.push(`enhancement count ${actual.length}/${expected.length}`);
}

let verifiedCount=0;
for(const [group,names] of Object.entries(groups)){
  for(const name of names){
    const det=rules.lookupDetachment(name);
    const expected=det?.verification?.expected;
    if(!det){ failures.push(`${group}: missing ${name}`); continue; }
    if(det.status!=='ready'){ failures.push(`${group}: ${name} is ${det.status}`); continue; }
    if(!expected){ failures.push(`${group}: ${name} has no verification manifest`); continue; }
    const ruleCount=(det.rules||[]).length;
    const ruleExpected=expected.detachmentRules;
    const ruleOk=Number.isInteger(ruleExpected)
      ? ruleCount===ruleExpected
      : (ruleExpected&&typeof ruleExpected==='object'
        ? ruleCount>=(Number.isFinite(ruleExpected.min)?ruleExpected.min:0) && ruleCount<=(Number.isFinite(ruleExpected.max)?ruleExpected.max:Infinity)
        : ruleCount>0);
    if(!ruleOk) failures.push(`${name}: rules ${ruleCount} invalid`);
    if((det.enhancements||[]).length!==expected.enhancements) failures.push(`${name}: enhancements ${(det.enhancements||[]).length}/${expected.enhancements}`);
    if((det.stratagems||[]).length!==expected.stratagems) failures.push(`${name}: stratagems ${(det.stratagems||[]).length}/${expected.stratagems}`);
    const actualNames=new Set((det.stratagems||[]).map(x=>x.name));
    for(const strat of expected.stratagemNames||[]) if(!actualNames.has(strat)) failures.push(`${name}: missing stratagem ${strat}`);
    for(const strat of det.stratagems||[]){
      if(!strat.name || !Number.isFinite(Number(strat.cp)) || !strat.phase || !strat.when || !strat.target || !strat.effect){
        failures.push(`${name}: incomplete stratagem card ${strat.name||'(unnamed)'}`);
      }
    }
    for(const rule of det.rules||[]) if(!rule.name || !String(rule.text||'').trim()) failures.push(`${name}: empty detachment rule`);

    const ref=official.resolve(name, det.faction);
    if(ref){
      if(Number(det.dp)!==Number(ref.dp)) failures.push(`${name}: DP ${det.dp} != official ${ref.dp}`);
      if(norm(det.disposition)!==norm(ref.disposition)) failures.push(`${name}: disposition ${det.disposition} != official ${ref.disposition}`);
      const before=failures.length;
      equalEnhancements(det.enhancements||[],ref.enhancements||[]);
      // Prefix bare enhancement errors with detachment name.
      for(let i=before;i<failures.length;i++) if(!failures[i].startsWith(name+':')) failures[i]=`${name}: ${failures[i]}`;
    } else warnings.push(`${name}: no official metadata reference`);
    verifiedCount++;
  }
}

// Ready extras are audited too, but post-MFM metadata may intentionally lack points.
for(const module of window.ASTARTES_CHAPTER_LIBRARY.listModules()){
  for(const name of module.readyExtras||[]){
    const det=rules.lookupDetachment(name); if(!det){failures.push(`ready extra missing: ${name}`);continue;}
    const ref=official.resolve(name,det.faction);
    if(ref){
      if(Number(det.dp)!==Number(ref.dp)) failures.push(`${name}: DP ${det.dp} != reference ${ref.dp}`);
      if(norm(det.disposition)!==norm(ref.disposition)) failures.push(`${name}: disposition mismatch`);
      const a=new Set((det.enhancements||[]).map(x=>norm(x.name)));
      for(const e of ref.enhancements||[]) if(!a.has(norm(e.name))) failures.push(`${name}: missing enhancement ${e.name}`);
    }
  }
}

const keywordCases={
  weapon:['Assault','Blast','Close-quarters','Close Quarters','Hazardous','Heavy','Ignores Cover','Lance','Lethal Hits','Pistol','Precision','Psychic','Torrent','Twin-linked','Rapid Fire 2','Melta 2','Sustained Hits 1','Anti','Anti-Infantry 4+','Anti-Vehicle 3+','Blast 2','One-Shot','Cleave 2','Conversion','Hunter Vehicle'],
  unit:['Leader','Support','Deep Strike','Scouts 6"','Stealth','Feel No Pain 5+','Deadly Demise 1','Deadly Demise D3','Deadly Demise D6','Deadly Demise D6+2','Deadly Demise 2D6','Fights First','Fly','Character','Epic Hero','Vehicle','Titanic','Heal 2','Lone Operative 12"','Plunging Fire','Surge Move']
};
for(const k of keywordCases.weapon) if(!keywords.isWeapon(k)) failures.push(`keyword classifier: ${k} should be weapon keyword`);
for(const k of keywordCases.unit) if(!keywords.isUnit(k)) failures.push(`keyword classifier: ${k} should be unit keyword`);
for(const k of ['Deadly Demise D6+2','Support','Leader']) if(keywords.classify(k,'').render!=='keyword') failures.push(`keyword renderer: ${k} should be keyword-only`);

if(rules.officialSync?.matched < 25) failures.push(`official metadata sync only matched ${rules.officialSync?.matched||0} entries`);

if(failures.length){
  console.error('GOLD MASTER AUDIT FAILED');
  console.error(failures.map(x=>`- ${x}`).join('\n'));
  if(warnings.length) console.error('\nWarnings:\n'+warnings.map(x=>`- ${x}`).join('\n'));
  process.exit(1);
}
console.log(`PASS: ${verifiedCount} verification detachments are internally consistent.`);
console.log(`PASS: official metadata synchronized for ${rules.officialSync.matched} ready/reference detachments.`);
console.log('PASS: core weapon/unit keyword regression cases, including Deadly Demise D6+2.');
console.log(`Rules Library: ${rules.manifest.readyDetachments} ready / ${rules.manifest.totalDetachments} catalogued total.`);
if(warnings.length) console.log('Warnings: '+warnings.join('; '));
