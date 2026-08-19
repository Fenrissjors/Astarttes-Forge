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
      emblem:false,
      weathering:false,
      bannerDepth:false,
      illustrations:false,
      watermark:false
    },
    printSurface:'#d9cfb7',
    emblem:{remoteFile:'',local:''},
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
})(window);
