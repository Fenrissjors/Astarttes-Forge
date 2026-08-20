/* Astartes Forge — Tyranids faction foundation + production visual registration
 * New Recruit remains authoritative for roster identity and rules.
 * Tyranids now owns a validated faction presentation profile and A4 artwork route.
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
    // Register Tyranids in the shared visual registry only after all libraries
    // have loaded. This keeps the existing script order stable and gives the
    // faction the same adaptive A4 renderer contract as approved factions.
    const visualRegistry=global.ASTARTES_CHAPTER_VISUAL_REGISTRY;
    if(visualRegistry?.profiles){
      visualRegistry.profiles.tyranids={
        id:'tyranids',
        name:'Tyranids',
        aliases:['Tyranids','Xenos - Tyranids'],
        theme:{...presentation},
        printSurface:'#eadff0',
        emblem:{remoteFile:'',local:''},
        artwork:{
          frameStandard:visualRegistry.a4FrameStandard||'a4-chapter-frame-gold-v1',
          geometryMaster:visualRegistry.a4GeometryMaster||'a4-chapter-frame-gold-v1',
          label:'Tyranid bio-construct',
          decorationLabel:'CHITIN · TALONS · BIOMASS',
          titleSurface:'#eee2cf',
          a4Frame:'assets/art/tyranids/frames/tyranids-a4-portrait.png',
          frameManifest:'assets/art/tyranids/frames/frame-manifest.json',
          geometryContract:'artwork-geometry-px-v1',
          renderer:'adaptive-datasheet',
          frameReady:true,
          candidateFrame:false,
          validationStatus:'PASS'
        }
      };
      library.factions.tyranids.presentationFallback='tyranids';
      library.factions.tyranids.presentation=Object.freeze({...presentation});
    }

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
