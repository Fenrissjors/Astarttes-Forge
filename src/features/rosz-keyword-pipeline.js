/* Astartes Forge — generic ROSZ keyword pipeline
 * Source of truth: New Recruit category/categoryLink data.
 *
 * Audit finding (v4 multifaction): normalizeArmyFromSourceGraph only copied
 * categories owned directly by the unit root. New Recruit can place effective
 * datasheet keywords on model selections beneath that root (including keywords
 * added by detachment rules). The native datasheet renderer then applied a
 * second static whitelist, so valid source keywords such as Vanguard Invader
 * could be imported yet hidden.
 *
 * This feature fixes both losses generically:
 *  1. collect unit/model categories across the complete unit source tree;
 *  2. preserve them as sourceKeywords and effective unit.tags;
 *  3. render every real source keyword instead of requiring a hardcoded list.
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

  // These describe roster/export structure rather than a unit's rules identity.
  // Keep this deliberately small: source categories should be preserved by
  // default, not guessed away by faction-specific whitelists.
  const technicalPatterns=[
    /^configuration$/i,/^detachment$/i,/^detachment choice$/i,/^army$/i,
    /^roster$/i,/^force$/i,/^uncategorised$/i,/^uncategorized$/i,
    /^shared$/i,/^root$/i,/^selection$/i
  ];
  function isTechnical(value=''){
    const text=clean(value);
    return technicalPatterns.some(pattern=>pattern.test(text));
  }

  function sourceCategoriesForUnit(sourceGraph,unit){
    const rootId=unit?.sourceSelectionId;
    if(!rootId||!sourceGraph) return unique(unit?.tags||[]);
    const selections=sourceGraph.selections||[];
    const allowedIds=new Set(
      selections
        .filter(selection=>(selection.id===rootId||selection.topId===rootId) && /^(unit|model)$/i.test(selection.type||''))
        .map(selection=>selection.id)
    );
    allowedIds.add(rootId);
    const source=(sourceGraph.categories||[])
      .filter(category=>allowedIds.has(category.ownerSelectionId))
      .map(category=>category.name)
      .filter(name=>!isTechnical(name));
    return unique(source);
  }

  function projectSourceKeywords(imported,sourceGraph){
    if(!imported||!Array.isArray(imported.units)) return imported;
    imported.units.forEach(unit=>{
      const sourceKeywords=sourceCategoriesForUnit(sourceGraph,unit);
      unit.sourceKeywords=sourceKeywords;
      // tags is the established effective-keyword channel used by cards, print,
      // filters and eligibility. Leader/Support are app relationship metadata and
      // are retained if they were added by the normalizer.
      const relationship=(unit.tags||[]).filter(value=>/^(leader|support)$/i.test(clean(value)));
      unit.tags=unique([...sourceKeywords,...relationship]);
    });
    return imported;
  }

  // Wrap the lossless ROSZ normalizer. This leaves JSON imports untouched and
  // keeps the source graph as the authority for .ros/.rosz files.
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
    try{ if(typeof global.isFactionKeyword==='function'&&global.isFactionKeyword(text)) return true; }catch(_){ }
    return activeFactionLabels().has(key(text));
  }
  function canonicalFaction(value=''){
    return clean(value).replace(/^faction(?: keyword)?\s*:\s*/i,'');
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

  // Replace the old static whitelist for imported source categories. The source
  // graph itself is now the admission criterion. This means future factions and
  // detachment-added keywords require no Astartes Forge code changes.
  global.unitKeywordData=function(unit){
    if(!unit) return {core:[],faction:[]};
    const values=unique([...(unit.sourceKeywords||unit.tags||[]),...(unit.leader?['Leader','Character']:[]),...(unit.support?['Support']:[])]);
    const core=[]; const faction=[];
    values.filter(value=>!isTechnical(value)).forEach(value=>{
      if(sourceFactionKeyword(value)) faction.push(canonicalFaction(value));
      else core.push(value);
    });
    return {core:sort(core),faction:sort(faction)};
  };

  global.ASTARTES_ROSZ_KEYWORD_PIPELINE=Object.freeze({
    version:'1.0.0',
    project:projectSourceKeywords,
    sourceCategoriesForUnit,
    isTechnical
  });
})(window);
