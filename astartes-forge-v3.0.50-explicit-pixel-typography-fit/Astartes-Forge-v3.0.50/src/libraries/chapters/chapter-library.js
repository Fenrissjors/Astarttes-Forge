/* Astartes Forge Chapter Library
 * Describes chapter modules separately from the renderer/importer.
 * This is intentionally metadata-only: roster facts still come from New Recruit,
 * while rules content comes from rules-library.js.
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
    version:'2.8.0-chapter-scope-first-founding', modules, verificationGroups, detachmentScopeIndex,
    resolveScope:(name='')=>detachmentScopeIndex[normalise(name)]?{...detachmentScopeIndex[normalise(name)]}:null,
    listModules:()=>Object.values(modules).map(m=>({...m,verificationDetachments:[...m.verificationDetachments],readyExtras:[...m.readyExtras]}))
  });
})(window);
