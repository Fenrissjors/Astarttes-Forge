/* Astartes Forge Chapter + Faction Library
 * Chapter metadata remains separate from roster facts, while the faction registry
 * is the first shared contract used by both Adeptus Astartes and Orks.
 * New Recruit remains the source of truth for imported roster identity.
 */
(function(global){
  'use strict';

  const modules = {
    'generic-astartes': {
      id:'generic-astartes', name:'Generic Adeptus Astartes', chapterKeywords:['Adeptus Astartes'],
      verificationDetachments:[
        'Gladius Task Force','Anvil Siege Force','Firestorm Assault Force','Ironstorm Spearhead','Stormlance Task Force',
        'Vanguard Spearhead','First Company Task Force','Librarius Conclave','Fulguris Task Force','Subversion Assets',
        'Armoured Speartip','Bastion Task Force','Ceramite Sentinels','Headhunter Task Force','Orbital Assault Force'
      ],
      readyExtras:['Vengeful Hosts']
    },
    'space-wolves': {
      id:'space-wolves', name:'Space Wolves', chapterKeywords:['Space Wolves'],
      verificationDetachments:[
        'Champions of Fenris','Legends of Saga and Song','Veterans of the Fang','Saga of the Beastslayer',
        'Saga of the Bold','Saga of the Great Wolf','Saga of the Hunter'
      ],
      readyExtras:[]
    },
    'blood-angels': {
      id:'blood-angels', name:'Blood Angels', chapterKeywords:['Blood Angels'],
      verificationDetachments:[
        'Legacy of Grace','Encarmine Speartip','Wrath of the Doomed','The Angelic Host','The Lost Brethren',
        'Angelic Inheritors','Liberator Assault Group','Rage-cursed Onslaught'
      ],
      readyExtras:[]
    },
    'ultramarines': {
      id:'ultramarines', name:'Ultramarines', chapterKeywords:['Ultramarines'], scopeSource:'new-recruit',
      verificationDetachments:['Blade of Ultramar','Reclamation Force'], readyExtras:[]
    },
    'imperial-fists': {
      id:'imperial-fists', name:'Imperial Fists', chapterKeywords:['Imperial Fists'], scopeSource:'new-recruit',
      verificationDetachments:["Emperor's Shield"], readyExtras:[]
    },
    'salamanders': {
      id:'salamanders', name:'Salamanders', chapterKeywords:['Salamanders'], scopeSource:'new-recruit',
      verificationDetachments:["Forgefather's Seekers"], readyExtras:[]
    },
    'iron-hands': {
      id:'iron-hands', name:'Iron Hands', chapterKeywords:['Iron Hands'], scopeSource:'new-recruit',
      verificationDetachments:['Hammer of Avernii'], readyExtras:[]
    },
    'raven-guard': {
      id:'raven-guard', name:'Raven Guard', chapterKeywords:['Raven Guard'], scopeSource:'new-recruit',
      verificationDetachments:['Shadowmark Talon'], readyExtras:[]
    },
    'white-scars': {
      id:'white-scars', name:'White Scars', chapterKeywords:['White Scars'], scopeSource:'new-recruit',
      verificationDetachments:['Spearpoint Task Force'], readyExtras:[]
    },
    'black-templars': {
      id:'black-templars', name:'Black Templars', chapterKeywords:['Black Templars'],
      verificationDetachments:[
        "Marshal's Household",'The Living Miracle','Wrathful Procession','Companions of Vehemence',
        'Godhammer Assault Force','Vindication Task Force'
      ],
      readyExtras:[]
    },
    'dark-angels': {
      id:'dark-angels', name:'Dark Angels', chapterKeywords:['Dark Angels'],
      verificationDetachments:[
        'Dark Age Arsenal','Darkflight Pursuit','Interrogation Conclave','Company of Hunters',
        'Inner Circle Task Force',"Lion's Blade Task Force",'Unforgiven Task Force','Wrath of the Rock'
      ],
      readyExtras:[]
    }
  };

  const normalise=value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const verificationGroups=Object.fromEntries(Object.values(modules).map(m=>[m.name,[...m.verificationDetachments]]));
  const detachmentScopeIndex={};
  for(const module of Object.values(modules)){
    for(const name of [...module.verificationDetachments,...module.readyExtras]){
      detachmentScopeIndex[normalise(name)]={moduleId:module.id,moduleName:module.name,source:module.scopeSource||'library'};
    }
  }

  global.ASTARTES_CHAPTER_LIBRARY=Object.freeze({
    version:'2.9.0-faction-foundation', modules, verificationGroups, detachmentScopeIndex,
    resolveScope:(name='')=>detachmentScopeIndex[normalise(name)]?{...detachmentScopeIndex[normalise(name)]}:null,
    listModules:()=>Object.values(modules).map(m=>({...m,verificationDetachments:[...m.verificationDetachments],readyExtras:[...m.readyExtras]}))
  });

  // Phase 1 multi-faction contract. Detection uses explicit New Recruit metadata;
  // ordinary rule/body text is deliberately not considered faction evidence.
  const factions={
    'adeptus-astartes': {
      id:'adeptus-astartes',
      name:'Adeptus Astartes',
      family:'imperium',
      cataloguePatterns:[/space marines/i,/adeptus astartes/i],
      factionPatterns:[/adeptus astartes/i],
      categoryPatterns:[/^faction:\s*(?:adeptus astartes|space marines)$/i],
      chapterSystem:true,
      presentationFallback:'generic-astartes'
    },
    'orks': {
      id:'orks',
      name:'Orks',
      family:'xenos',
      cataloguePatterns:[/^xenos\s*-\s*orks$/i,/\borks\b/i],
      factionPatterns:[/^orks$/i],
      categoryPatterns:[/^faction:\s*orks$/i],
      chapterSystem:false,
      presentationFallback:'generic-astartes'
    }
  };

  function values(input){
    if(Array.isArray(input)) return input.flatMap(values);
    if(input===null||input===undefined) return [];
    return [String(input).trim()].filter(Boolean);
  }
  function firstMatching(patterns,list){
    for(const item of list){
      for(const pattern of patterns||[]){
        if(pattern.test(item)) return item;
      }
    }
    return '';
  }
  function detectFaction(context={}){
    const catalogues=values([context.catalogue,context.catalogueName,context.catalogues]);
    const factionNames=values([context.faction,context.factionName,context.factions]);
    const categories=values([context.categories,context.tags,context.factionCategories]);
    let best=null;
    for(const faction of Object.values(factions)){
      const catalogue=firstMatching(faction.cataloguePatterns,catalogues);
      const explicitFaction=firstMatching(faction.factionPatterns,factionNames);
      const category=firstMatching(faction.categoryPatterns,categories);
      const score=(catalogue?4:0)+(explicitFaction?3:0)+(category?2:0);
      if(!score) continue;
      const candidate={
        id:faction.id,name:faction.name,family:faction.family,
        chapterSystem:faction.chapterSystem,
        presentationFallback:faction.presentationFallback,
        score,
        evidence:{catalogue, faction:explicitFaction, category}
      };
      if(!best || candidate.score>best.score) best=candidate;
    }
    return best;
  }

  global.ASTARTES_FACTION_LIBRARY=Object.freeze({
    version:'1.0.0-multifaction-foundation',
    factions,
    detect:detectFaction,
    resolve:id=>factions[id]||null,
    list:()=>Object.values(factions).map(f=>({id:f.id,name:f.name,family:f.family,chapterSystem:f.chapterSystem,presentationFallback:f.presentationFallback}))
  });

  // Compatibility bridge for the existing renderer during Phase 1. It wraps the
  // import application step after app.js has initialised, keeping importer/parser
  // behaviour untouched while adding a first-class faction identity to state.
  global.addEventListener('DOMContentLoaded',()=>{
    if(typeof applyImportedRoster!=='function' || typeof state!=='object') return;

    const detectFromImported=imported=>detectFaction({
      catalogue:imported?.catalogue,
      faction:imported?.faction,
      categories:(imported?.units||[]).flatMap(unit=>unit?.tags||[])
    });
    const detectFromState=()=>detectFaction({
      catalogue:state.importedMeta?.catalogue,
      faction:state.importedMeta?.faction,
      categories:(state.importedUnits||[]).flatMap(unit=>unit?.tags||[])
    });
    const activeFaction=()=>state.factionKey || state.importedMeta?.factionKey || detectFromState()?.id || 'adeptus-astartes';
    global.ASTARTES_ACTIVE_FACTION=activeFaction;

    // Restore faction identity for rosters persisted by the browser.
    const restored=detectFromState();
    if(restored){
      state.factionKey=restored.id;
      if(state.importedMeta) state.importedMeta={...state.importedMeta,factionKey:restored.id,faction:restored.name,factionDetection:restored};
    }

    const originalApplyImportedRoster=applyImportedRoster;
    applyImportedRoster=function(imported){
      originalApplyImportedRoster(imported);
      const detected=detectFromImported(imported) || detectFromState();
      if(!detected) return;
      state.factionKey=detected.id;
      state.importedMeta={
        ...state.importedMeta,
        factionKey:detected.id,
        faction:detected.name,
        factionDetection:detected
      };

      // Until a faction-specific visual pack exists, non-Astartes factions use the
      // neutral clean datasheet palette and must never inherit Space Marine artwork.
      if(!detected.chapterSystem){
        state.chapterPreset='generic-astartes';
        state.theme={...(chapterThemes['generic-astartes']||defaultTheme)};
        if(typeof applyTheme==='function') applyTheme();
      }
      if(typeof saveState==='function') saveState();
      if(typeof renderAll==='function') renderAll();
    };

    if(typeof factionNameFor==='function'){
      const originalFactionNameFor=factionNameFor;
      factionNameFor=function(unit){
        const detected=activeFaction();
        if(detected==='orks') return 'Orks';
        return originalFactionNameFor(unit);
      };
    }

    if(typeof canUseArtworkPrintPage==='function'){
      const originalCanUseArtworkPrintPage=canUseArtworkPrintPage;
      canUseArtworkPrintPage=function(entry,unit){
        if(activeFaction()!=='adeptus-astartes') return false;
        return originalCanUseArtworkPrintPage(entry,unit);
      };
    }
    if(typeof canUseAdaptiveDatasheetArtwork==='function'){
      const originalCanUseAdaptiveDatasheetArtwork=canUseAdaptiveDatasheetArtwork;
      canUseAdaptiveDatasheetArtwork=function(entry,unit){
        if(activeFaction()!=='adeptus-astartes') return false;
        return originalCanUseAdaptiveDatasheetArtwork(entry,unit);
      };
    }
    if(typeof chapterEmblemMarkup==='function'){
      const originalChapterEmblemMarkup=chapterEmblemMarkup;
      chapterEmblemMarkup=function(chapterKey,label){
        if(activeFaction()!=='adeptus-astartes') return '';
        return originalChapterEmblemMarkup(chapterKey,label);
      };
    }
  });
})(window);
