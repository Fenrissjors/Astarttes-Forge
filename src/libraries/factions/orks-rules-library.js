/* Astartes Forge — Orks rules-library extension
 * Phase 2 multi-faction support.
 * New Recruit remains authoritative for roster composition, selected enhancements
 * and imported detachment rules. This extension supplies concise reference data
 * for rules that are not serialised into the roster export, especially Stratagems.
 */
(function(global){
  'use strict';

  const base=global.ASTARTES_RULES_LIBRARY;
  if(!base) return;

  const stratagem=(name,cp,phase,when,target,effect,restrictions='')=>({
    kind:'stratagem',name,cp,phase,when,target,effect,restrictions,
    text:[
      when&&`WHEN: ${when}`,
      target&&`TARGET: ${target}`,
      effect&&`EFFECT: ${effect}`,
      restrictions&&`RESTRICTIONS: ${restrictions}`
    ].filter(Boolean).join('\n')
  });

  const orksDetachments={
    'freebooter-krew':{
      id:'freebooter-krew',
      name:'Freebooter Krew',
      faction:'Orks',
      disposition:'Take and Hold',
      dp:2,
      status:'ready',
      availability:'faction-pack',
      sourceType:'new-recruit+current-reference-summary',
      rules:[{
        kind:'detachment',
        name:'Here Be Loot',
        text:'At the start of your Command phase, choose one objective as your loot objective until your next Command phase. Attacks made by Orks Infantry, Mounted or Walker models gain Sustained Hits 1 when the attacking unit or its target is within range of that objective.'
      }],
      enhancements:[],
      stratagems:[
        stratagem('Bash and Grab',1,'Fight phase','During the Fight phase.','One Orks unit that has not fought this phase.','Until the end of the phase, attacks made by that unit against an enemy within range of the loot objective can re-roll Wound rolls.'),
        stratagem('Grab and Bash',1,'Command phase','During your Command phase.','One non-Gretchin Orks unit within range of the loot objective.','Until your next Command phase, treat the Waaagh! as active for that unit even if the army-wide Waaagh! has already been called.'),
        stratagem('Boardin’ Rush',1,'Movement phase','During your Movement phase.','One Orks unit that has not moved this phase.','Until the end of the phase, when that unit Advances, add 6 inches to its Move instead of making an Advance roll.'),
        stratagem('Deck Fraggers',1,'Shooting phase','During your Shooting phase.','One Orks unit that has not shot this phase.','Until the end of the phase, its ranged weapons gain Blast when targeting Infantry units.'),
        stratagem('Rolling Loot-Heap',1,'Shooting phase','During your Shooting phase.','One Flash Gitz unit that has not shot this phase.','Until the end of the phase, ranged weapons equipped by that unit gain Anti-Vehicle 4+.'),
        stratagem('Krump and Run',1,'Opponent Movement phase','Just after an enemy unit Falls Back during your opponent’s Movement phase.','One Orks unit that was within Engagement Range of that enemy at the start of the phase and is now unengaged.','That unit can make a Normal move of up to 6 inches.')
      ],
      verification:{
        expected:{rules:1,enhancements:null,stratagems:6},
        stratagemNames:['Bash and Grab','Grab and Bash','Boardin’ Rush','Deck Fraggers','Rolling Loot-Heap','Krump and Run']
      }
    }
  };

  const normalise=base.normalise || (value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''));

  // app.js captures ASTARTES_RULES_LIBRARY once at startup. The nested detachments
  // object is intentionally mutable, so extend it in-place first; the original
  // lookupDetachment closure will then immediately see Freebooter Krew too.
  if(base.detachments && typeof base.detachments==='object'){
    Object.assign(base.detachments,orksDetachments);
  }

  const baseLookup=base.lookupDetachment.bind(base);
  const lookupDetachment=(nameOrId='')=>{
    const key=normalise(nameOrId);
    const item=orksDetachments[key];
    if(item) return JSON.parse(JSON.stringify(item));
    return baseLookup(nameOrId);
  };

  const combinedDetachments={...(base.detachments||{}),...orksDetachments};
  const manifest={
    ...(base.manifest||{}),
    version:'2.9.0-multifaction-orks-phase2',
    updated:'2026-08-19',
    readyDetachments:Object.values(combinedDetachments).filter(x=>x.status==='ready').length,
    cataloguedDetachments:Object.values(combinedDetachments).filter(x=>x.status==='catalogued').length,
    totalDetachments:Object.keys(combinedDetachments).length
  };

  global.ASTARTES_RULES_LIBRARY=Object.freeze({
    ...base,
    manifest,
    detachments:combinedDetachments,
    lookupDetachment,
    listDetachments:()=>Object.values(combinedDetachments).map(x=>JSON.parse(JSON.stringify(x)))
  });
})(window);
