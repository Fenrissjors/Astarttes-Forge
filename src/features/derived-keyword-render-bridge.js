/* Astartes Forge — Derived Keyword Render Bridge
 * Makes permanent detachment-derived keywords first-class datasheet keywords.
 *
 * Core app.js intentionally filters unit keywords through IMPORTANT_UNIT_KEYWORDS.
 * Detachment-granted keywords can be valid without existing in that static core
 * catalogue, so this bridge extends that recognition path and projects derived
 * values into unit.unitKeywords before any screen/print renderer runs.
 */
(function(global){
  'use strict';

  const normalise=value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const unique=values=>{
    const out=[]; const seen=new Set();
    (values||[]).filter(Boolean).forEach(value=>{
      const text=String(value).trim(); const key=normalise(text);
      if(!key||seen.has(key)) return;
      seen.add(key); out.push(text);
    });
    return out;
  };

  function stateUnits(){
    try{return Array.isArray(state?.importedUnits)?state.importedUnits:[];}catch(_){return [];}
  }

  function knownDerivedKeywords(){
    const fromEffects=(global.ASTARTES_DERIVED_KEYWORD_ENGINE?.effects?.()||[]).flatMap(effect=>effect?.add||[]);
    const fromUnits=stateUnits().flatMap(unit=>unit?.derivedKeywords||[]);
    return unique([...fromEffects,...fromUnits]);
  }

  function installKeywordRecognition(){
    // IMPORTANT_UNIT_KEYWORDS is a global lexical binding from app.js, not a
    // window property. Classic scripts can still access and extend its mutable
    // test method. This is the actual gate used by unitKeywordData().
    try{
      if(typeof IMPORTANT_UNIT_KEYWORDS==='undefined'||!IMPORTANT_UNIT_KEYWORDS||IMPORTANT_UNIT_KEYWORDS.__derivedExtended) return;
      const previousTest=typeof IMPORTANT_UNIT_KEYWORDS.test==='function'
        ? IMPORTANT_UNIT_KEYWORDS.test.bind(IMPORTANT_UNIT_KEYWORDS)
        : (()=>false);
      IMPORTANT_UNIT_KEYWORDS.test=function(value=''){
        if(previousTest(value)) return true;
        const key=normalise(value);
        return knownDerivedKeywords().some(keyword=>normalise(keyword)===key);
      };
      IMPORTANT_UNIT_KEYWORDS.__derivedExtended=true;
    }catch(error){
      console.warn('Could not extend unit-keyword recognition for derived keywords.',error);
    }
  }

  function projectUnit(unit){
    const engine=global.ASTARTES_DERIVED_KEYWORD_ENGINE;
    const base=unique(unit?.baseKeywords||unit?.tags||[]);
    const derived=unique(unit?.derivedKeywords||[]);
    const effective=unique(engine?.effectiveKeywords?.(unit)||[...base,...derived]);

    // tags is the effective semantic set used by eligibility/filter logic.
    unit.tags=effective;

    // unitKeywordData() renders from unit.unitKeywords plus unit.tags, with the
    // IMPORTANT_UNIT_KEYWORDS gate above. Keep factionKeywords untouched:
    // Burrower/Battleline/etc are UNIT keywords, not faction keywords.
    unit.unitKeywords=unique([...(Array.isArray(unit.unitKeywords)?unit.unitKeywords:[]),...derived]);
    unit.keywords=unique([...(Array.isArray(unit.keywords)?unit.keywords:[]),...derived]);

    if(Array.isArray(unit.categories)) unit.categories=unique([...unit.categories,...derived]);
    if(unit.sourceMeta&&typeof unit.sourceMeta==='object'){
      if(Array.isArray(unit.sourceMeta.keywords)) unit.sourceMeta.keywords=unique([...unit.sourceMeta.keywords,...derived]);
      if(Array.isArray(unit.sourceMeta.categories)) unit.sourceMeta.categories=unique([...unit.sourceMeta.categories,...derived]);
    }
  }

  function projectAll(){
    installKeywordRecognition();
    try{global.ASTARTES_DERIVED_KEYWORD_ENGINE?.apply?.({persist:false});}catch(_){ }
    stateUnits().forEach(projectUnit);
  }

  function wrapRenderer(name){
    let fn;
    try{fn=eval(name);}catch(_){fn=global[name];}
    if(typeof fn!=='function'||fn.__derivedKeywordWrapped) return;
    const wrapped=function(...args){
      projectAll();
      return fn.apply(this,args);
    };
    wrapped.__derivedKeywordWrapped=true;
    // Top-level function declarations in app.js are also window properties in
    // this non-module build, so assigning here updates normal UI calls.
    try{global[name]=wrapped;}catch(_){ }
  }

  function refresh(){
    projectAll();
    try{if(typeof renderCards==='function') renderCards();}catch(_){ }
    try{if(typeof renderThemePreview==='function') renderThemePreview();}catch(_){ }
    try{if(typeof renderPrintCenter==='function') renderPrintCenter();}catch(_){ }
  }

  function install(){
    installKeywordRecognition();
    projectAll();
    ['renderAll','renderCards','renderThemePreview','renderPrintCenter','generateArmyPack'].forEach(wrapRenderer);
    // A final render is intentional: the normal card renderer now sees the
    // derived keyword as a legitimate unit keyword and puts it in its own
    // existing KEYWORDS footer. No DOM text fallback is used anymore.
    refresh();
  }

  global.ASTARTES_DERIVED_KEYWORD_RENDER_BRIDGE=Object.freeze({
    projectAll,
    refresh,
    recognised:knownDerivedKeywords
  });
  global.addEventListener('DOMContentLoaded',install);
})(window);
