/* Astartes Forge — runtime keyword extension registry
 * Allows permanent faction/detachment effects to register additional unit
 * keywords without changing the static core keyword catalogue.
 *
 * This script MUST load after keyword-library.js and before app.js so app.js's
 * captured KEYWORD_LIBRARY reference sees the extensible isUnit() contract.
 */
(function(global){
  'use strict';
  const base=global.ASTARTES_KEYWORD_LIBRARY;
  if(!base) return;

  const runtimeUnitKeywords=new Set();
  const key=value=>String(base.canonicalUnit?.(value)||value||'').trim().toLowerCase();
  const baseIsUnit=typeof base.isUnit==='function' ? base.isUnit.bind(base) : (()=>false);

  function registerUnitKeywords(values=[]){
    (Array.isArray(values)?values:[values]).filter(Boolean).forEach(value=>runtimeUnitKeywords.add(key(value)));
    return [...runtimeUnitKeywords];
  }
  function isUnit(value=''){
    return baseIsUnit(value) || runtimeUnitKeywords.has(key(value));
  }

  // Replace the frozen static object with another frozen facade. The Set lives
  // in this closure, so registrations remain dynamic even though the public
  // registry object itself stays immutable.
  const extended=Object.freeze({
    ...base,
    isUnit,
    registerRuntimeUnitKeywords:registerUnitKeywords,
    runtimeUnitKeywords:()=>[...runtimeUnitKeywords]
  });
  global.ASTARTES_KEYWORD_LIBRARY=extended;

  function syncDerivedKeywordCatalogue(){
    try{
      const engine=global.ASTARTES_DERIVED_KEYWORD_ENGINE;
      if(!engine) return;
      (engine.effects?.()||[]).forEach(effect=>registerUnitKeywords(effect?.add||[]));
      engine.apply?.({persist:false});
      if(typeof global.renderCards==='function') global.renderCards();
      if(typeof global.renderThemePreview==='function') global.renderThemePreview();
      if(typeof global.renderPrintCenter==='function') global.renderPrintCenter();
    }catch(error){
      console.warn('Could not sync derived keywords with the unit-keyword catalogue.',error);
    }
  }

  global.ASTARTES_RUNTIME_KEYWORD_REGISTRY=Object.freeze({
    version:'1.0.0',
    registerUnitKeywords,
    has:value=>runtimeUnitKeywords.has(key(value)),
    list:()=>[...runtimeUnitKeywords],
    syncDerived:syncDerivedKeywordCatalogue
  });

  // Derived effects are registered by feature scripts later in the document.
  // By DOMContentLoaded all scripts have evaluated, so synchronise once before
  // normal user interaction starts. Later registrations can call syncDerived().
  global.addEventListener('DOMContentLoaded',syncDerivedKeywordCatalogue);
})(window);
