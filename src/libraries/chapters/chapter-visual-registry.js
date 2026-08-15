/* Astartes Forge Chapter Visual Registry
 * v3.0.46 — Adaptive Panel Sizing Pass
 *
 * Single source of truth for Chapter presentation and ROSZ visual routing.
 * Roster/rules facts remain owned by the importer and rules libraries.
 *
 * Add future A4 frame artwork by setting artwork.a4Frame on the matching
 * Chapter profile. The renderer does not need chapter-specific code changes.
 */
(function(global){
  'use strict';

  const GENERIC='generic-astartes';
  const LEXICANUM_FILE_REDIRECT='https://wh40k.lexicanum.com/wiki/Special:Redirect/file/';
  const A4_FRAME_STANDARD='a4-chapter-frame-gold-v1';
  const A4_GEOMETRY_MASTER=A4_FRAME_STANDARD;

  const baseTheme=(chapter, overrides={})=>({
    primary:'#334155',
    accent:'#b8963e',
    paper:'#eee2c8',
    ink:'#171717',
    pattern:'chapter',
    chapter,
    decorations:true,
    decorationIntensity:38,
    emblem:true,
    weathering:true,
    bannerDepth:true,
    illustrations:true,
    watermark:true,
    ...overrides
  });

  const profiles={
    'space-wolves': {
      id:'space-wolves', name:'Space Wolves', aliases:['Space Wolves'],
      theme:baseTheme('space-wolves',{primary:'#354a5f',accent:'#b31f2b',paper:'#efe4ca',ink:'#211d16',decorationIntensity:72}),
      printSurface:'#e4edf1',
      emblem:{remoteFile:'Spacewolvesymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,goldenReference:true,label:'Fenris illustrated',decorationLabel:'RUNES · ICE · PELTS',titleSurface:'#bfc8d4',a4Frame:'assets/art/space-wolves/frames/space-wolves-a4-portrait.png',frameManifest:'assets/art/space-wolves/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true}
    },
    'ultramarines': {
      id:'ultramarines', name:'Ultramarines', aliases:['Ultramarines'],
      theme:baseTheme('ultramarines',{primary:'#164b9b',accent:'#d4af37',paper:'#f0e4c8',ink:'#211d16',decorationIntensity:48}),
      printSurface:'#e7edf8',
      emblem:{remoteFile:'Ultramarinessymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,goldenReference:true,label:'Macragge laurels',decorationLabel:'LAURELS · ROMAN ORNAMENT',titleSurface:'#d7d1c9',a4Frame:'assets/art/ultramarines/frames/ultramarines-a4-portrait.png',frameManifest:'assets/art/ultramarines/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true}
    },
    'blood-angels': {
      id:'blood-angels', name:'Blood Angels', aliases:['Blood Angels'],
      theme:baseTheme('blood-angels',{primary:'#9f171c',accent:'#f0c245',paper:'#f1e3c7',ink:'#241813',decorationIntensity:58}),
      printSurface:'#f7e8e6',
      emblem:{remoteFile:'Bloodangelsymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,goldenReference:true,label:'Sanguinary baroque',decorationLabel:'WINGS · DROPS · SEALS',titleSurface:'#dacdbd',a4Frame:'assets/art/blood-angels/frames/blood-angels-a4-portrait.png',frameManifest:'assets/art/blood-angels/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true}
    },
    'dark-angels': {
      id:'dark-angels', name:'Dark Angels', aliases:['Dark Angels'],
      theme:baseTheme('dark-angels',{primary:'#173b2b',accent:'#d8c9a7',paper:'#eee2c8',ink:'#171c16',decorationIntensity:54}),
      printSurface:'#e6eee8',
      emblem:{remoteFile:'Darkangelsymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Unforgiven gothic',decorationLabel:'HOODS · WINGS · PARCHMENT',titleSurface:'#dccdb7',a4Frame:'assets/art/dark-angels/frames/dark-angels-a4-portrait.png',frameManifest:'assets/art/dark-angels/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true,candidateFrame:false,validationStatus:'PASS'}
    },
    'black-templars': {
      id:'black-templars', name:'Black Templars', aliases:['Black Templars'],
      theme:baseTheme('black-templars',{primary:'#17191d',accent:'#d8cbb0',paper:'#eee1c7',ink:'#171513',decorationIntensity:62}),
      printSurface:'#ececed',
      emblem:{remoteFile:'BlackTemplarssymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Crusade reliquary',decorationLabel:'CHAINS · CROSSES · SEALS',a4Frame:'',frameReady:false}
    },
    'imperial-fists': {
      id:'imperial-fists', name:'Imperial Fists', aliases:['Imperial Fists'],
      theme:baseTheme('imperial-fists',{primary:'#c99f00',accent:'#a72820',paper:'#f1e4c4',ink:'#211b10',decorationIntensity:48}),
      printSurface:'#fbf3cf',
      emblem:{remoteFile:'IFsymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Bastion plate',decorationLabel:'FORTRESS · INDUSTRIAL',a4Frame:'',frameReady:false}
    },
    'salamanders': {
      id:'salamanders', name:'Salamanders', aliases:['Salamanders'],
      theme:baseTheme('salamanders',{primary:'#176f45',accent:'#151515',paper:'#ead9bd',ink:'#191812',decorationIntensity:70}),
      printSurface:'#e5f1e9',
      emblem:{remoteFile:'Salamanderssymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Nocturne forge',decorationLabel:'SCALES · SCORCHED PARCHMENT',a4Frame:'',frameReady:false}
    },
    'white-scars': {
      id:'white-scars', name:'White Scars', aliases:['White Scars'],
      theme:baseTheme('white-scars',{primary:'#e4e0d6',accent:'#b51f2e',paper:'#f0e4ca',ink:'#171717',decorationIntensity:46}),
      printSurface:'#f4f2ed',
      emblem:{remoteFile:'WhiteScarssymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Chogorian storm',decorationLabel:'LIGHTNING · WIND MARKS',a4Frame:'',frameReady:false}
    },
    'raven-guard': {
      id:'raven-guard', name:'Raven Guard', aliases:['Raven Guard'],
      theme:baseTheme('raven-guard',{primary:'#1c2028',accent:'#aeb7c2',paper:'#ebe0c8',ink:'#171717',decorationIntensity:52}),
      printSurface:'#eceef1',
      emblem:{remoteFile:'RavenGuardsymbol.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Deliverance shadow',decorationLabel:'FEATHERS · SHADOW TEARS',a4Frame:'',frameReady:false}
    },
    'iron-hands': {
      id:'iron-hands', name:'Iron Hands', aliases:['Iron Hands'],
      theme:baseTheme('iron-hands',{primary:'#17191d',accent:'#9ba5af',paper:'#e9dfca',ink:'#171717',decorationIntensity:52}),
      printSurface:'#eceeef',
      emblem:{remoteFile:'Iron_Hands-logo.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Medusan machine',decorationLabel:'MECHANICAL · CABLES',a4Frame:'',frameReady:false}
    },
    'deathwatch': {
      id:'deathwatch', name:'Deathwatch', aliases:['Deathwatch'],
      theme:baseTheme('deathwatch',{primary:'#111318',accent:'#aeb6bf',paper:'#ebe0c9',ink:'#171717',decorationIntensity:54}),
      printSurface:'#eceeef',
      emblem:{remoteFile:'Deathwatchsymbol2.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Watch fortress',decorationLabel:'WATCH HERALDRY · METAL',a4Frame:'',frameReady:false}
    },
    'crimson-fists': {
      id:'crimson-fists', name:'Crimson Fists', aliases:['Crimson Fists'],
      theme:baseTheme('crimson-fists',{primary:'#183d79',accent:'#b21f2d',paper:'#eee2c9',ink:'#171717',decorationIntensity:48}),
      printSurface:'#e8edf6',
      emblem:{remoteFile:'Aquila1transparent.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Crimson bastion',decorationLabel:'FISTS · BASTION · SCARS',a4Frame:'',frameReady:false}
    },
    'flesh-tearers': {
      id:'flesh-tearers', name:'Flesh Tearers', aliases:['Flesh Tearers'],
      theme:baseTheme('flesh-tearers',{primary:'#68151b',accent:'#17191d',paper:'#ecddc5',ink:'#1a1112',decorationIntensity:60}),
      printSurface:'#f3e6e7',
      emblem:{remoteFile:'Aquila1transparent.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Cretacian fury',decorationLabel:'SAW · BLOOD · IRON',a4Frame:'',frameReady:false}
    },
    'generic-astartes': {
      id:'generic-astartes', name:'Generic Adeptus Astartes', aliases:['Adeptus Astartes','Space Marines'],
      theme:baseTheme('generic-astartes'),
      printSurface:'#e9edf1',
      emblem:{remoteFile:'Aquila1transparent.png',local:''},
      artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Astartes gothic',decorationLabel:'AQUILA · PURITY SEALS',a4Frame:'',frameReady:false}
    }
  };

  // Names that the importer should preserve as a Chapter/faction label even if
  // they currently use the generic visual profile. This matches v3.0.17 behaviour.
  const genericVisualDetections=[
    'Blood Ravens','Carcharodons','Raptors','Minotaurs','Lamenters','Exorcists','Silver Templars'
  ].map(name=>({name,key:GENERIC,aliases:[name]}));

  const detectionEntries=[
    ...Object.values(profiles).flatMap(profile=>(profile.aliases||[profile.name]).map(alias=>({name:profile.name,key:profile.id,alias}))),
    ...genericVisualDetections.flatMap(entry=>entry.aliases.map(alias=>({name:entry.name,key:entry.key,alias})))
  ];

  const normalise=value=>String(value||'').trim().toLowerCase();
  const slug=value=>String(value||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function resolveKey(value=''){
    const key=slug(value);
    return profiles[key] ? key : GENERIC;
  }
  function resolve(value=''){
    return profiles[resolveKey(value)] || profiles[GENERIC];
  }
  function detect(values=[]){
    const source=(Array.isArray(values)?values:[values]).filter(Boolean).map(v=>normalise(v));
    if(!source.length) return null;
    // Preserve v3.0.17 semantics: named Chapters/successors win over broad
    // 'Adeptus Astartes' or 'Space Marines' labels that can coexist in ROSZ.
    const genericAliases=new Set(profiles[GENERIC].aliases||[]);
    const specific=detectionEntries.filter(x=>x.key!==GENERIC || !genericAliases.has(x.alias));
    const broadGeneric=detectionEntries.filter(x=>x.key===GENERIC && genericAliases.has(x.alias));
    const ordered=specific.concat(broadGeneric);
    return ordered.find(entry=>source.some(v=>v.includes(normalise(entry.alias)))) || null;
  }
  function detectName(values=[]){return detect(values)?.name || '';}
  function detectKey(values=[]){return detect(values)?.key || GENERIC;}
  function themeFor(value=''){return {...resolve(value).theme};}
  function themeMap(){return Object.fromEntries(Object.entries(profiles).map(([key,p])=>[key,{...p.theme}]));}
  function surfaceFor(value=''){return resolve(value).printSurface || profiles[GENERIC].printSurface;}
  function surfaceMap(){return Object.fromEntries(Object.entries(profiles).map(([key,p])=>[key,p.printSurface]));}
  function emblemUrl(value=''){
    const emblem=resolve(value).emblem||{};
    if(emblem.local) return emblem.local;
    const file=emblem.remoteFile || profiles[GENERIC].emblem.remoteFile;
    return `${LEXICANUM_FILE_REDIRECT}${encodeURIComponent(file)}`;
  }
  function frameAsset(value='',format='a4Portrait'){
    if(format!=='a4Portrait') return '';
    return resolve(value).artwork?.a4Frame || '';
  }
  function list(){return Object.values(profiles).map(p=>({
    id:p.id,name:p.name,aliases:[...(p.aliases||[])],theme:{...p.theme},printSurface:p.printSurface,
    emblem:{...(p.emblem||{})},artwork:{...(p.artwork||{})}
  }));}

  const api={
    version:'3.0.53-artwork-geometry-contract',
    genericKey:GENERIC,
    a4GeometryMaster:A4_GEOMETRY_MASTER,a4FrameStandard:A4_FRAME_STANDARD,
    profiles,
    resolveKey,resolve,detect,detectName,detectKey,themeFor,themeMap,surfaceFor,surfaceMap,emblemUrl,frameAsset,list
  };
  global.ASTARTES_CHAPTER_VISUAL_REGISTRY=Object.freeze(api);
})(window);
