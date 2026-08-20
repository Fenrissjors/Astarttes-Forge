/* Astartes Forge — multifaction visual registration
 * Registers production Orks visuals and the Phase 1 Tyranids clean-theme profile.
 */
(function(global){
  'use strict';
  const registry=global.ASTARTES_CHAPTER_VISUAL_REGISTRY;
  if(!registry?.profiles) return;

  const orkProfile={
    id:'orks',name:'Orks',aliases:['Orks'],
    theme:{primary:'#3f4a2f',accent:'#8f2f24',paper:'#e7dcc2',ink:'#171812',pattern:'chapter',chapter:'orks',decorations:false,decorationIntensity:0,emblem:true,weathering:false,bannerDepth:false,illustrations:false,watermark:false},
    printSurface:'#d9cfb7',emblem:{remoteFile:'Orks-tiny.png',local:''},
    artwork:{frameStandard:registry.a4FrameStandard||'a4-chapter-frame-gold-v1',geometryMaster:registry.a4GeometryMaster||'a4-chapter-frame-gold-v1',label:'Ork scrap-forge',decorationLabel:'SCRAP · RIVETS · CHECKERS',titleSurface:'#d7c6a8',a4Frame:'assets/art/orks/frames/orks-a4-portrait.png',frameManifest:'assets/art/orks/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true,candidateFrame:false,validationStatus:'PASS'}
  };
  registry.profiles.orks=orkProfile;

  const factionLibrary=global.ASTARTES_FACTION_LIBRARY;
  const orkFaction=factionLibrary?.factions?.orks;
  if(orkFaction){
    orkFaction.presentationFallback='orks';
    orkFaction.presentation=Object.freeze({...orkProfile.theme,id:'orks',chapterSurface:orkProfile.printSurface});
  }

  // Tyranids Phase 1: detection and a clean faction-native palette only.
  // No artwork/emblem is enabled until those assets are separately validated.
  const tyranidTheme={primary:'#5a3472',accent:'#9b2f55',paper:'#eee2cf',ink:'#19131d',pattern:'chapter',chapter:'tyranids-default',decorations:false,decorationIntensity:0,emblem:false,weathering:false,bannerDepth:false,illustrations:false,watermark:false};
  if(factionLibrary?.factions){
    factionLibrary.factions.tyranids={
      id:'tyranids',name:'Tyranids',family:'xenos',
      cataloguePatterns:[/^xenos\s*-\s*tyranids$/i,/\btyranids\b/i],
      factionPatterns:[/^tyranids$/i],categoryPatterns:[/^faction:\s*tyranids$/i],
      chapterSystem:false,presentationFallback:'tyranids-default',
      presentation:Object.freeze({...tyranidTheme,id:'tyranids-default',chapterSurface:'#eadff0'})
    };
  }
  registry.profiles['tyranids-default']={
    id:'tyranids-default',name:'Tyranids',aliases:['Tyranids'],theme:tyranidTheme,
    printSurface:'#eadff0',emblem:{remoteFile:'',local:''},
    artwork:{frameStandard:registry.a4FrameStandard||'a4-chapter-frame-gold-v1',geometryMaster:registry.a4GeometryMaster||'a4-chapter-frame-gold-v1',label:'Tyranids clean',decorationLabel:'',a4Frame:'',frameReady:false,candidateFrame:false,validationStatus:'PHASE-1'}
  };

  global.addEventListener('DOMContentLoaded',()=>{
    const previous=global.chapterEmblemMarkup;
    if(typeof previous==='function'){
      const emblemSrc=registry.emblemUrl?.('orks')||'https://wh40k.lexicanum.com/wiki/Special:Redirect/file/Orks-tiny.png';
      global.chapterEmblemMarkup=function(chapterKey,label){
        let active='';
        try{active=global.ASTARTES_ACTIVE_FACTION?.()||global.state?.factionKey||global.state?.importedMeta?.factionKey||'';}catch(_){ }
        const key=String(chapterKey||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        if(active==='orks'||key==='orks') return `<img src="${emblemSrc}" alt="" aria-hidden="true" style="display:block;width:100%;height:100%;object-fit:contain;object-position:center;image-rendering:auto">`;
        if(active==='tyranids'||key==='tyranids'||key==='tyranids-default') return '';
        return previous(chapterKey,label);
      };
    }
    if(typeof global.renderAll==='function') global.renderAll();
  });
})(window);
