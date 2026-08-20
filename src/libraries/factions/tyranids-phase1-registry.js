/* Astartes Forge — Tyranids faction foundation
 * New Recruit remains authoritative for roster identity and rules.
 * Visual artwork registration lives in tyranids-visual-registry.js so it is
 * available before the shared print/theme libraries snapshot their registries.
 */
(function(global){
  'use strict';

  const library=global.ASTARTES_FACTION_LIBRARY;
  if(!library?.factions) return;

  const presentation=Object.freeze({
    id:'tyranids',
    primary:'#5a3472',
    accent:'#9b2f55',
    paper:'#eee2cf',
    ink:'#19131d',
    chapterSurface:'#eadff0',
    pattern:'chapter',
    chapter:'tyranids',
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
    presentationFallback:'tyranids',
    presentation
  };

  // Shared New Recruit rich-text cleanup. Accept both literal markdown markers
  // and their backslash-escaped ROSZ forms, e.g. \*\*^^Infantry^^\*\*.
  function stripImportedMarkup(value=''){
    return String(value||'')
      .replace(/\\?\*\\?\*/g,'')
      .replace(/\\?\^\\?\^/g,'')
      .replace(/\|\s*/g,' ')
      .replace(/\u00a0/g,' ')
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g,'-')
      .replace(/\s+([,.;:!?])/g,'$1')
      .replace(/[ \t]{2,}/g,' ');
  }
  global.ASTARTES_STRIP_IMPORTED_MARKUP=stripImportedMarkup;

  global.addEventListener('DOMContentLoaded',()=>{
    if(typeof global.ASTARTES_ACTIVE_FACTION!=='function') return;

    // Keep the faction label exact for Tyranid datasheets and print output.
    if(typeof global.factionNameFor==='function'){
      const previous=global.factionNameFor;
      global.factionNameFor=function(unit){
        if(global.ASTARTES_ACTIVE_FACTION?.()==='tyranids') return 'Tyranids';
        return previous(unit);
      };
    }

    if(typeof global.cleanCodexText==='function'){
      const previousClean=global.cleanCodexText;
      global.cleanCodexText=function(text=''){
        return stripImportedMarkup(previousClean(stripImportedMarkup(text)));
      };
    }

    const cleanRenderedTree=root=>{
      if(!root) return;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      const nodes=[]; let node;
      while((node=walker.nextNode())) nodes.push(node);
      for(const textNode of nodes){
        const cleaned=stripImportedMarkup(textNode.nodeValue);
        if(cleaned!==textNode.nodeValue) textNode.nodeValue=cleaned;
      }
    };

    const cleanUserFacing=()=>{
      document.querySelectorAll('#cardsContainer,#themePreview,#armyPackPrint,#armyRules,#referenceRules,#stratagemList,#coreStratagemList').forEach(cleanRenderedTree);
      if(global.ASTARTES_ACTIVE_FACTION?.()==='tyranids'){
        document.querySelectorAll('.card-kicker,.print-card-kicker,.datasheet-faction,.unit-faction').forEach(el=>{
          if(/adeptus\s+astartes/i.test(el.textContent||'')) el.textContent='Tyranids';
        });
      }
    };

    // Keep normal UI clean continuously and force a synchronous cleanup at the
    // two print boundaries so detached/generated print pages cannot race the observer.
    const observer=new MutationObserver(cleanUserFacing);
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    global.addEventListener('beforeprint',cleanUserFacing);
    document.addEventListener('click',event=>{
      if(event.target?.closest?.('#generateArmyPack,#printRules')){
        cleanUserFacing();
        queueMicrotask(cleanUserFacing);
        requestAnimationFrame(cleanUserFacing);
      }
    },true);

    if(global.ASTARTES_ACTIVE_FACTION?.()==='tyranids'){
      if(typeof global.syncCleanPrintControls==='function') global.syncCleanPrintControls();
      if(typeof global.renderAll==='function') global.renderAll();
    }
    cleanUserFacing();
  });
})(window);
