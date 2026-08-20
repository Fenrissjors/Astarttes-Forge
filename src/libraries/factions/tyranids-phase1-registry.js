/* Astartes Forge — Tyranids Phase 1 faction foundation
 * New Recruit remains authoritative for roster identity and rules.
 * Phase 1 registers faction detection + clean presentation only; artwork and
 * reference-completion rules are deliberately deferred to later phases.
 */
(function(global){
  'use strict';

  const library=global.ASTARTES_FACTION_LIBRARY;
  if(!library?.factions) return;

  const presentation=Object.freeze({
    id:'tyranids-default',
    primary:'#5a3472',
    accent:'#9b2f55',
    paper:'#eee2cf',
    ink:'#19131d',
    chapterSurface:'#eadff0',
    pattern:'chapter',
    chapter:'tyranids-default',
    decorations:false,
    decorationIntensity:0,
    emblem:false,
    weathering:false,
    bannerDepth:false,
    illustrations:false,
    watermark:false
  });

  library.factions.tyranids={
    id:'tyranids', name:'Tyranids', family:'xenos',
    cataloguePatterns:[/^xenos\s*-\s*tyranids$/i,/\btyranids\b/i],
    factionPatterns:[/^tyranids$/i],
    categoryPatterns:[/^faction:\s*tyranids$/i],
    chapterSystem:false,
    presentationFallback:'tyranids-default',
    presentation
  };

  // presentationFor/list were created before this registration but resolve the
  // live factions object, so the new faction becomes available immediately.
  global.addEventListener('DOMContentLoaded',()=>{
    if(typeof global.ASTARTES_ACTIVE_FACTION!=='function') return;

    // Keep the faction label exact on shared datasheet/reference surfaces.
    if(typeof global.factionNameFor==='function'){
      const previous=global.factionNameFor;
      global.factionNameFor=function(unit){
        if(global.ASTARTES_ACTIVE_FACTION?.()==='tyranids') return 'Tyranids';
        return previous(unit);
      };
    }

    // Phase 1 intentionally has no faction artwork or emblem. The existing
    // non-Astartes safety gate therefore remains authoritative.
    if(global.ASTARTES_ACTIVE_FACTION?.()==='tyranids'){
      if(typeof global.syncCleanPrintControls==='function') global.syncCleanPrintControls();
      if(typeof global.renderAll==='function') global.renderAll();
    }
  });
})(window);
