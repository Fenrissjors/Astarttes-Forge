/* Astartes Forge — ROSZ keyword pipeline
 * New Recruit category/categoryLink data is the source of truth.
 *
 * Audit finding: normalizeArmyFromSourceGraph only copied categories owned by
 * the unit root. Effective keywords can live on model selections beneath that
 * root, and the datasheet renderer then hid unfamiliar keywords behind a static
 * whitelist. This bridge fixes both losses generically without faction rules.
 */
(function(global){
  'use strict';

  const clean=value=>String(value||'').replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ').trim();
  const key=value=>clean(value).toLowerCase();
  const unique=values=>{
    const out=[]; const seen=new Set();
    (values||[]).forEach(value=>{
      const text=clean(value); const id=key(text);
      if(!id||seen.has(id)) return;
      seen.add(id); out.push(text);
    });
    return out;
  };

  const technicalPatterns=[
    /^configuration$/i,/^detachment$/i,/^detachment choice$/i,/^army$/i,
    /^roster$/i,/^force$/i,/^uncategorised$/i,/^uncategorized$/i,
    /^shared$/i,/^root$/i,/^selection$/i
  ];
  const isTechnical=value=>technicalPatterns.some(pattern=>pattern.test(clean(value)));

  function sourceCategoriesForUnit(sourceGraph,unit){
    const rootId=unit?.sourceSelectionId;
    if(!rootId||!sourceGraph) return unique(unit?.tags||[]);
    const allowedIds=new Set(
      (sourceGraph.selections||[])
        .filter(selection=>(selection.id===rootId||selection.topId===rootId) && /^(unit|model)$/i.test(selection.type||''))
        .map(selection=>selection.id)
    );
    allowedIds.add(rootId);
    return unique((sourceGraph.categories||[])
      .filter(category=>allowedIds.has(category.ownerSelectionId))
      .map(category=>category.name)
      .filter(name=>!isTechnical(name)));
  }

  function projectSourceKeywords(imported,sourceGraph){
    if(!imported||!Array.isArray(imported.units)) return imported;
    imported.units.forEach(unit=>{
      const sourceKeywords=sourceCategoriesForUnit(sourceGraph,unit);
      unit.sourceKeywords=sourceKeywords;
      const relationship=(unit.tags||[]).filter(value=>/^(leader|support)$/i.test(clean(value)));
      unit.tags=unique([...sourceKeywords,...relationship]);
    });
    return imported;
  }

  // Wrap the source-graph normalizer before the user imports a roster.
  if(typeof global.normalizeArmyFromSourceGraph==='function'){
    const previous=global.normalizeArmyFromSourceGraph;
    global.normalizeArmyFromSourceGraph=function(sourceGraph,...args){
      return projectSourceKeywords(previous.call(this,sourceGraph,...args),sourceGraph);
    };
  }

  function activeFactionLabels(){
    const labels=new Set(['imperium','adeptus astartes','space marines','orks','tyranids']);
    try{
      const meta=global.state?.importedMeta||{};
      [meta.faction,meta.factionName,meta.factionKey,global.ASTARTES_ACTIVE_FACTION?.()].filter(Boolean).forEach(value=>labels.add(key(value)));
    }catch(_){ }
    return labels;
  }
  function sourceFactionKeyword(value=''){
    const text=clean(value);
    if(/^faction(?: keyword)?\s*:/i.test(text)) return true;
    try{if(typeof global.isFactionKeyword==='function'&&global.isFactionKeyword(text)) return true;}catch(_){ }
    return activeFactionLabels().has(key(text));
  }
  function canonicalUnit(value=''){
    try{return global.KEYWORD_LIBRARY?.canonicalUnit?.(value)||clean(value);}catch(_){return clean(value);}
  }
  function sort(values=[]){
    const order=Array.isArray(global.KEYWORD_DISPLAY_ORDER)?global.KEYWORD_DISPLAY_ORDER:[];
    return unique(values.map(canonicalUnit)).sort((a,b)=>{
      const ai=order.findIndex(item=>a===item||a.startsWith(item+' '));
      const bi=order.findIndex(item=>b===item||b.startsWith(item+' '));
      const av=ai<0?999:ai, bv=bi<0?999:bi;
      return av-bv||a.localeCompare(b);
    });
  }

  // The old renderer admitted only KEYWORD_LIBRARY.isUnit(...) values. For ROSZ
  // imports the source category itself is authoritative, so unfamiliar but valid
  // keywords (Vanguard Invader, Burrower, future faction keywords, etc.) render
  // automatically instead of requiring library updates.
  //
  // Faction keywords remain preserved in sourceKeywords/unit.tags for rules,
  // filters and eligibility, but are deliberately omitted from the datasheet
  // footer because the faction identity is already shown in the card header.
  global.unitKeywordData=function(unit){
    if(!unit) return {core:[],faction:[]};
    const values=unique([...(unit.sourceKeywords||unit.tags||[]),...(unit.leader?['Leader','Character']:[]),...(unit.support?['Support']:[])]);
    const core=[];
    values.filter(value=>!isTechnical(value)).forEach(value=>{
      if(!sourceFactionKeyword(value)) core.push(value);
    });
    return {core:sort(core),faction:[]};
  };

  global.ASTARTES_ROSZ_KEYWORD_PIPELINE=Object.freeze({
    version:'1.0.1-hide-faction-footer',
    project:projectSourceKeywords,
    sourceCategoriesForUnit,
    isTechnical,
    isFactionKeyword:sourceFactionKeyword
  });
})(window);
