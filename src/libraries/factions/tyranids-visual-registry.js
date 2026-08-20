/* Astartes Forge — Tyranids visual registration
 * Registers the validated Tyranids faction artwork before app.js snapshots
 * presentation/theme maps, matching the proven Orks visual-registry pattern.
 */
(function(global){
  'use strict';

  const registry=global.ASTARTES_CHAPTER_VISUAL_REGISTRY;
  if(!registry?.profiles) return;

  // Retired standalone presentation presets. Source labels may still occur in
  // imported rosters, but these no longer have their own visual profiles.
  delete registry.profiles['crimson-fists'];
  delete registry.profiles['flesh-tearers'];

  const profile={
    id:'tyranids',
    name:'Tyranids',
    aliases:['Tyranids','Xenos - Tyranids'],
    theme:{
      primary:'#5a3472',
      accent:'#9b2f55',
      paper:'#eee2cf',
      ink:'#19131d',
      pattern:'chapter',
      chapter:'tyranids',
      decorations:false,
      decorationIntensity:0,
      emblem:false,
      weathering:false,
      bannerDepth:false,
      illustrations:false,
      watermark:false
    },
    printSurface:'#eadff0',
    emblem:{remoteFile:'',local:''},
    artwork:{
      frameStandard:registry.a4FrameStandard||'a4-chapter-frame-gold-v1',
      geometryMaster:registry.a4GeometryMaster||'a4-chapter-frame-gold-v1',
      label:'Tyranid bio-construct',
      decorationLabel:'CHITIN · TALONS · BIOMASS',
      titleSurface:'#eee2cf',
      titleText:'#4d2a61',
      a4Frame:'assets/art/tyranids/frames/tyranids-a4-portrait.png',
      frameManifest:'assets/art/tyranids/frames/frame-manifest.json',
      geometryContract:'artwork-geometry-px-v1',
      renderer:'adaptive-datasheet',
      frameReady:true,
      candidateFrame:false,
      validationStatus:'PASS'
    }
  };

  registry.profiles.tyranids=profile;

  // Keep faction routing in sync with the production visual profile.
  const faction=global.ASTARTES_FACTION_LIBRARY?.factions?.tyranids;
  if(faction){
    faction.presentationFallback='tyranids';
    faction.presentation=Object.freeze({...profile.theme,id:'tyranids',chapterSurface:profile.printSurface});
  }
})(window);
