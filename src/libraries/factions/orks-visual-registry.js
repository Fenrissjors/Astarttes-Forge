/* Astartes Forge — Orks visual registration
 * Extends the shared visual registry with the validated Orks faction artwork.
 */
(function(global){
  'use strict';
  const registry=global.ASTARTES_CHAPTER_VISUAL_REGISTRY;
  if(!registry?.profiles) return;

  const profile={
    id:'orks',
    name:'Orks',
    aliases:['Orks'],
    theme:{
      primary:'#3f4a2f',
      accent:'#8f2f24',
      paper:'#e7dcc2',
      ink:'#171812',
      pattern:'chapter',
      chapter:'orks',
      decorations:false,
      decorationIntensity:0,
      emblem:true,
      weathering:false,
      bannerDepth:false,
      illustrations:false,
      watermark:false
    },
    printSurface:'#d9cfb7',
    // Use the actual Games Workshop Orks insignia hosted by Lexicanum,
    // matching the external emblem strategy already used by Astartes chapters.
    emblem:{remoteFile:'Orks-tiny.png',local:''},
    artwork:{
      frameStandard:registry.a4FrameStandard||'a4-chapter-frame-gold-v1',
      geometryMaster:registry.a4GeometryMaster||'a4-chapter-frame-gold-v1',
      label:'Ork scrap-forge',
      decorationLabel:'SCRAP · RIVETS · CHECKERS',
      titleSurface:'#d7c6a8',
      a4Frame:'assets/art/orks/frames/orks-a4-portrait.png',
      frameManifest:'assets/art/orks/frames/frame-manifest.json',
      geometryContract:'artwork-geometry-px-v1',
      renderer:'adaptive-datasheet',
      frameReady:true,
      candidateFrame:false,
      validationStatus:'PASS'
    }
  };

  registry.profiles.orks=profile;

  // The faction presentation key now resolves directly to the production Orks
  // visual profile rather than the temporary no-art fallback used during Phase 2.
  const faction=global.ASTARTES_FACTION_LIBRARY?.factions?.orks;
  if(faction){
    faction.presentationFallback='orks';
    faction.presentation=Object.freeze({...profile.theme,id:'orks',chapterSurface:profile.printSurface});
  }

  // chapter-library originally suppressed Chapter emblems for every non-Astartes
  // faction while Orks had no visual pack. Orks now has a real faction insignia,
  // so restore the shared emblem slot only for Orks while leaving future factions
  // safely opt-in.
  global.addEventListener('DOMContentLoaded',()=>{
    const previous=global.chapterEmblemMarkup;
    if(typeof previous!=='function') return;
    const emblemSrc=registry.emblemUrl?.('orks') || 'https://wh40k.lexicanum.com/wiki/Special:Redirect/file/Orks-tiny.png';
    global.chapterEmblemMarkup=function(chapterKey,label){
      let active='';
      try{ active=global.ASTARTES_ACTIVE_FACTION?.()||global.state?.factionKey||global.state?.importedMeta?.factionKey||''; }catch(_){ /* noop */ }
      const key=String(chapterKey||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      if(active==='orks'||key==='orks'){
        return `<img src="${emblemSrc}" alt="" aria-hidden="true" style="display:block;width:100%;height:100%;object-fit:contain;object-position:center;image-rendering:auto">`;
      }
      return previous(chapterKey,label);
    };
    if(typeof global.renderAll==='function') global.renderAll();
  });
})(window);
