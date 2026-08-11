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
        'Vanguard Spearhead','First Company Task Force','Librarius Conclave','Fulguris Task Force','Subversion Assets'
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
    'dark-angels': {
      id:'dark-angels', name:'Dark Angels', chapterKeywords:['Dark Angels'],
      verificationDetachments:[
        'Dark Age Arsenal','Darkflight Pursuit','Interrogation Conclave','Company of Hunters',
        'Inner Circle Task Force',"Lion's Blade Task Force",'Unforgiven Task Force','Wrath of the Rock'
      ],
      readyExtras:[]
    }
  };
  const verificationGroups=Object.fromEntries(Object.values(modules).map(m=>[m.name,[...m.verificationDetachments]]));
  global.ASTARTES_CHAPTER_LIBRARY=Object.freeze({
    version:'2.6.0-dark-angels-module', modules, verificationGroups,
    listModules:()=>Object.values(modules).map(m=>({...m,verificationDetachments:[...m.verificationDetachments],readyExtras:[...m.readyExtras]}))
  });
})(window);
