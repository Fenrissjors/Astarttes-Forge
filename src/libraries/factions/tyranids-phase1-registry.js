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

  // Shared cleanup for escaped New Recruit rich-text markers. This is intentionally
  // faction-agnostic because the same residue can appear in Astartes/Orks exports.
  function stripImportedMarkup(value=''){
    return String(value||'')
      .replace(/\\\*\\\*/g,'')
      .replace(/\\\^\\\^/g,'')
      .replace(/\*\*/g,'')
      .replace(/\^\^/g,'')
      .replace(/\|\^\^/g,'')
      .replace(/\u00a0/g,' ')
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g,'-')
      .replace(/\s+([,.;:!?])/g,'$1');
  }

  global.addEventListener('DOMContentLoaded',()=>{
    if(typeof global.ASTARTES_ACTIVE_FACTION!=='function') return;

    // Keep non-Astartes faction labels exact on datasheets and print output.
    if(typeof global.factionNameFor==='function'){
      const previous=global.factionNameFor;
      global.factionNameFor=function(unit){
        const active=global.ASTARTES_ACTIVE_FACTION?.();
        if(active==='tyranids') return 'Tyranids';
        return previous(unit);
      };
    }

    // Extend the existing central text cleaner rather than adding a Tyranid-only
    // renderer exception. This also cleans the same residual markers for existing factions.
    if(typeof global.cleanCodexText==='function'){
      const previousClean=global.cleanCodexText;
      global.cleanCodexText=function(text=''){
        return stripImportedMarkup(previousClean(stripImportedMarkup(text)));
      };
    }

    // Safety-net for text paths that render imported description text without going
    // through cleanCodexText. Restrict this to user-facing rules/datasheet/print areas.
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

    const observer=new MutationObserver(()=>cleanUserFacing());
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});

    if(global.ASTARTES_ACTIVE_FACTION?.()==='tyranids'){
      if(typeof global.syncCleanPrintControls==='function') global.syncCleanPrintControls();
      if(typeof global.renderAll==='function') global.renderAll();
    }
    cleanUserFacing();
  });
})(window);
