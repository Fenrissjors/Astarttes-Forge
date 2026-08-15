/* Astartes Forge — Official reference metadata
 * Gold Master reference set cross-checked against Games Workshop 11th-edition
 * Faction Packs / Munitorum Field Manual current as of 2026-08-07.
 * This file intentionally stores metadata (names, DP, dispositions, enhancement
 * names/points) rather than reproducing long official rules text.
 */
(function(global){
  'use strict';
  const E=(name,points)=>({name,points});
  const refs={
    'gladius-task-force':{name:'Gladius Task Force',faction:'Adeptus Astartes',dp:3,disposition:'Priority Assets',enhancements:[E('Adept of the Codex',20),E('Artificer Armour',10),E('Fire Discipline',25),E('The Honour Vehement',15)]},
    'anvil-siege-force':{name:'Anvil Siege Force',faction:'Adeptus Astartes',dp:2,disposition:'Take and Hold',enhancements:[E('Architect of War',25),E('Fleet Commander',15),E('Indomitable Fury',20),E('Stoic Defender',15)]},
    'armoured-speartip':{name:'Armoured Speartip',faction:'Adeptus Astartes',dp:3,disposition:'Take and Hold',scope:['all'],scopeSource:'new-recruit',enhancements:[E('Armoured Commander',25),E('Liberator',15),E('Shock Deployment',20),E('Tip of the Spear',40)]},
    'bastion-task-force':{name:'Bastion Task Force',faction:'Adeptus Astartes',dp:2,disposition:'Take and Hold',scope:['all'],scopeSource:'new-recruit',enhancements:[E('Blades of Valour',15),E('Bombast Omnivox',15),E('Eye of the Primarch',10),E('Hero of the Chapter',20)]},
    'ceramite-sentinels':{name:'Ceramite Sentinels',faction:'Adeptus Astartes',dp:3,disposition:'Take and Hold',scope:['all'],scopeSource:'new-recruit',enhancements:[E('Castellum Omnivox',20),E('Defensive Mastery',25),E('Honour Indefatigable',25),E('Spy-skull Data Link',15)]},
    'headhunter-task-force':{name:'Headhunter Task Force',faction:'Adeptus Astartes',dp:2,disposition:'Priority Assets',scope:['all'],scopeSource:'new-recruit',enhancements:[E('Astartes Tank Ace',40),E('Firestorm Coordinators',20),E('Gunnery Honours',20),E('Redoubtable Machine Spirit',25)]},
    'orbital-assault-force':{name:'Orbital Assault Force',faction:'Adeptus Astartes',dp:2,disposition:'Take and Hold',scope:['all'],scopeSource:'new-recruit',enhancements:[E('Dedicated Gunship',15),E('Laurels of Thunder',15),E('Orbital Uplink Reliquary',25),E('Veteran of the Vanguard',20)]},
    'blade-of-ultramar':{name:'Blade of Ultramar',faction:'Adeptus Astartes',dp:3,disposition:'Priority Assets',scope:['ultramarines'],scopeSource:'new-recruit',enhancements:[E('Armour of Antoninus',10),E('Oath of Macragge',15),E('Student of the Codex',20),E('Veteran of Behemoth',25)]},
    'reclamation-force':{name:'Reclamation Force',faction:'Adeptus Astartes',dp:2,disposition:'Take and Hold',scope:['ultramarines'],scopeSource:'new-recruit',enhancements:[E('Avenging Avatar',10),E('Liberatum',25),E('Scroll of Proclamation',15),E('Seals of Reconquest',20)]},
    'emperors-shield':{name:"Emperor's Shield",faction:'Adeptus Astartes',dp:2,disposition:'Purge the Foe',publishedDisposition:'Priority Assets',scope:['imperial-fists'],scopeSource:'new-recruit',sourceStatus:'new-recruit-authoritative-scope',enhancements:[E('Champion of the Feast',25),E('Disciple of Rhetoricus',10),E('Indomitable Champion',20),E('Malodraxian Standard',20)]},
    'forgefathers-seekers':{name:"Forgefather's Seekers",faction:'Adeptus Astartes',dp:2,disposition:'Priority Assets',publishedDisposition:'Purge the Foe',scope:['salamanders'],scopeSource:'new-recruit',sourceStatus:'new-recruit-authoritative-scope',enhancements:[E('Adamantine Mantle',20),E('Forged in Battle',15),E('Immolator',10),E('War-tempered Artifice',25)]},
    'hammer-of-avernii':{name:'Hammer of Avernii',faction:'Adeptus Astartes',dp:2,disposition:'Purge the Foe',publishedDisposition:'Priority Assets',scope:['iron-hands'],scopeSource:'new-recruit',sourceStatus:'new-recruit-authoritative-scope',enhancements:[E('Iron Laurel',10),E('Medusan Roar',30),E('Spiritus Ferrum',25),E('Steel Font',15)]},
    'shadowmark-talon':{name:'Shadowmark Talon',faction:'Adeptus Astartes',dp:2,disposition:'Disruption',scope:['raven-guard'],scopeSource:'new-recruit',enhancements:[E('Blackwing Shroud',25),E('Coronal Susurrant',30),E("Hunter's Instincts",25),E('Umbral Raptor',15)]},
    'spearpoint-task-force':{name:'Spearpoint Task Force',faction:'Adeptus Astartes',dp:2,disposition:'Disruption',scope:['white-scars'],scopeSource:'new-recruit',enhancements:[E('Chogorian Huntmaster',25),E("Hunter's Eye",20),E('Spearpoint Paragon',25),E("Stormseers' Wisdom",15)]},
    'firestorm-assault-force':{name:'Firestorm Assault Force',faction:'Adeptus Astartes',dp:2,disposition:'Purge the Foe',enhancements:[E('Adamantine Mantle',20),E('Champion of Humanity',10),E('Forged in Battle',15),E('War-tempered Artifice',25)]},
    'ironstorm-spearhead':{name:'Ironstorm Spearhead',faction:'Adeptus Astartes',dp:2,disposition:'Purge the Foe',enhancements:[E('Adept of the Omnissiah',35),E('Master of Machine War',20),E('Target Augury Web',30),E('The Flesh Is Weak',10)]},
    'stormlance-task-force':{name:'Stormlance Task Force',faction:'Adeptus Astartes',dp:3,disposition:'Disruption',enhancements:[E('Feinting Withdrawal',10),E('Fury of the Storm',25),E('Hunter’s Instincts',25),E('Portents of Wisdom',15)],chapterOverrides:{'blood-angels':{dp:2},'deathwatch':{dp:2}}},
    'vanguard-spearhead':{name:'Vanguard Spearhead',faction:'Adeptus Astartes',dp:2,disposition:'Reconnaissance',enhancements:[E('Execute and Redeploy',20),E('Ghostweave Cloak',15),E('Shadow War Veteran',30),E('The Blade Driven Deep',25)]},
    'first-company-task-force':{name:'1st Company Task Force',faction:'Adeptus Astartes',dp:2,disposition:'Priority Assets',enhancements:[E('Fear Made Manifest',30),E('Iron Resolve',15),E('Rites of War',10),E('The Imperium’s Sword',25)]},
    'librarius-conclave':{name:'Librarius Conclave',faction:'Adeptus Astartes',dp:1,disposition:'Reconnaissance',enhancements:[E('Celerity',35),E('Fusillade',20),E('Obfuscation',25),E('Prescience',20),E('Temporal Corridor',15)]},
    'fulguris-task-force':{name:'Fulguris Task Force',faction:'Adeptus Astartes',dp:1,disposition:'Disruption',enhancements:[E('Bellicose Weapon Spirits (Upgrade)',15),E('Raptorial Cogitator Core (Upgrade)',15)]},
    'subversion-assets':{name:'Subversion Assets',faction:'Adeptus Astartes',dp:1,disposition:'Reconnaissance',enhancements:[E('Death in the Dark (Upgrade)',15),E('Shroud Field',20)]},

    'champions-of-fenris':{name:'Champions of Fenris',faction:'Space Wolves',dp:1,disposition:'Purge the Foe',enhancements:[E('A Giant Amongst Giants',15),E('Preyslayer',15)],stratagems:['Wolf Totems','Runes of Claiming','Stalk Between Worlds']},
    'legends-of-saga-and-song':{name:'Legends of Saga and Song',faction:'Space Wolves',dp:1,disposition:'Take and Hold',enhancements:[E('Fierce Example (Upgrade)',25),E('Thirst for Glory (Upgrade)',15)],stratagems:['Fangs of the Pack','Chilling Howl','Wings of the Blizzard']},
    'veterans-of-the-fang':{name:'Veterans of the Fang',faction:'Space Wolves',dp:1,disposition:'Disruption',enhancements:[E('Eye of the Hunter',20),E('Weaver of Sagas',15)],stratagems:['Blade-keen Senses','Icy Calm','Grizzled Killers']},
    'saga-of-the-beastslayer':{name:'Saga of the Beastslayer',faction:'Space Wolves',dp:2,disposition:'Purge the Foe',enhancements:[E('Elder’s Guidance',20),E('Helm of the Beastslayer',15),E('Hunter’s Guile',20),E('Wolf-touched',15)]},
    'saga-of-the-bold':{name:'Saga of the Bold',faction:'Space Wolves',dp:2,disposition:'Priority Assets',enhancements:[E('Braggart’s Steel',20),E('Hordeslayer',15),E('Skjald',15),E('Thunderwolf’s Fortitude',25)]},
    'saga-of-the-great-wolf':{name:'Saga of the Great Wolf',faction:'Space Wolves',dp:2,disposition:'Take and Hold',enhancements:[E('Chariots of the Storm',25),E('Grimnar’s Mark',20),E('Howlmaw',15),E('Skjald’s Foretelling',25)]},
    'saga-of-the-hunter':{name:'Saga of the Hunter',faction:'Space Wolves',dp:2,disposition:'Disruption',enhancements:[E('Fenrisian Grit',15),E('Feral Rage',10),E('Swift Hunter',20),E('Wolf Master',5)]},


    'dark-age-arsenal':{name:'Dark Age Arsenal',faction:'Dark Angels',dp:1,disposition:'Priority Assets',enhancements:[E('Entreaty of Perpetual Ardour (Upgrade)',15),E('Petition of Stability (Upgrade)',15)],stratagems:['Searing Bursts','No Sacrifice Too Great','Revelation of Guilt']},
    'darkflight-pursuit':{name:'Darkflight Pursuit',faction:'Dark Angels',dp:1,disposition:'Reconnaissance',enhancements:[E('Nightforged Battery (Upgrade)',15),E('Thundercowl Turbines (Upgrade)',15)],stratagems:['Wings of Shadow','Skyborne Surveillance','We Are Vengeance']},
    'interrogation-conclave':{name:'Interrogation Conclave',faction:'Dark Angels',dp:1,disposition:'Take and Hold',enhancements:[E('Inescapable Interrogation',20),E('Limitless Zeal',10)],stratagems:['Terrifying Zeal','Exacting Punishment','Wages of Cowardice']},
    'company-of-hunters':{name:'Company of Hunters',faction:'Dark Angels',dp:2,disposition:'Disruption',enhancements:[E('Master of Manoeuvre',15),E('Master-crafted Weapon',10),E('Mounted Strategist',30),E('Recon Hunter',20)],stratagems:['Hunter’s Trail','Armour of Contempt','Talon Strike','Death on the Wind','High-speed Focus','Rapid Reappraisal']},
    'inner-circle-task-force':{name:'Inner Circle Task Force',faction:'Dark Angels',dp:2,disposition:'Priority Assets',enhancements:[E('Champion of the Deathwing',15),E('Deathwing Assault',30),E('Eye of the Unseen',10),E('Singular Will',20)],stratagems:['Armour of Contempt','Martial Mastery','Duty Unto Death','Relic Teleportarium','Wrath of the Lion','Unmatched Fortitude']},
    'lions-blade-task-force':{name:"Lion's Blade Task Force",faction:'Dark Angels',dp:2,disposition:'Purge the Foe',enhancements:[E('Calibanite Armaments',15),E('Fulgus Magna',20),E('Lord of the Hunt',15),E('Stalwart Champion',15)],stratagems:['Overpowering Exaction','Armour of Contempt','Strength in Unity','Knights of Iron','Illuminating Fire','Inescapable Wrath']},
    'unforgiven-task-force':{name:'Unforgiven Task Force',faction:'Dark Angels',dp:2,disposition:'Take and Hold',enhancements:[E('Pennant of Remembrance',10),E('Shroud of Heroes',25),E('Stubborn Tenacity',15),E('Weapons of the First Legion',15)],stratagems:['Armour of Contempt','Unforgiven Fury','Intractable','Fire Discipline','Grim Retribution','Unbreakable Lines']},
    'wrath-of-the-rock':{name:'Wrath of the Rock',faction:'Dark Angels',dp:3,disposition:'Priority Assets',enhancements:[E('Ancient Weapons',25),E('Deathwing Assault',15),E('Lord of the Ravenwing',10),E('Tempered in Battle (Aura)',10)],stratagems:['Inescapable Justice','Lion’s Will','Armour of Contempt','Tactical Mastery','Relics of the Dark Age','Leonine Aggression']},

    'legacy-of-grace':{name:'Legacy of Grace',faction:'Blood Angels',dp:1,disposition:'Priority Assets',enhancements:[E('Aureole of the Angel',20),E('Blood Boil',10)]},
    'encarmine-speartip':{name:'Encarmine Speartip',faction:'Blood Angels',dp:1,disposition:'Disruption',enhancements:[E('Angelic Executioner',25),E('Shadow of Abomination',25)]},
    'wrath-of-the-doomed':{name:'Wrath of the Doomed',faction:'Blood Angels',dp:1,disposition:'Purge the Foe',enhancements:[E('Instinctive Interception',10),E("On the Archtraitor's Bridge",20)]},
    'the-angelic-host':{name:'The Angelic Host',faction:'Blood Angels',dp:2,disposition:'Disruption',enhancements:[E('Archangel’s Shard',15),E('Artisan of War',20),E('Gleaming Pinions',25),E('Visage of Death',15)]},
    'the-lost-brethren':{name:'The Lost Brethren',faction:'Blood Angels',dp:2,disposition:'Purge the Foe',enhancements:[E('Blood Shard',25),E('Sanguinius’ Grace',20),E('To Slay The Warmaster',15),E('Vengeful Onslaught',10)]},
    'angelic-inheritors':{name:'Angelic Inheritors',faction:'Blood Angels',dp:3,disposition:'Priority Assets',enhancements:[E('Blazing Icon',20),E('Ordained Sacrifice',25),E('Prescient Flash',20),E('Troubling Visions',15)]},
    'liberator-assault-group':{name:'Liberator Assault Group',faction:'Blood Angels',dp:3,disposition:'Take and Hold',enhancements:[E('Gift of Foresight',15),E('Icon of the Angel',20),E('Rage-fuelled Warrior',35),E('Speed of the Primarch',25)]},
    'rage-cursed-onslaught':{name:'Rage-cursed Onslaught',faction:'Blood Angels',dp:3,disposition:'Purge the Foe',enhancements:[E('Angel’s Fang',25),E('Carmine Reliquary',30),E('Master of the Red Thirst',25),E('Sanguinary Tear',35)]},

    'marshals-household':{name:"Marshal's Household",faction:'Black Templars',dp:1,disposition:'Priority Assets',enhancements:[E('Fervent Exemplars (Upgrade)',10),E('Inheritors of Sigismund (Upgrade)',15)],stratagems:['Blade of Detestation','Slayers of Abominations','Unsparing Execution']},
    'the-living-miracle':{name:'The Living Miracle',faction:'Black Templars',dp:1,disposition:'Disruption',enhancements:[E('Guiding Omens',15)],stratagems:[]},
    'wrathful-procession':{name:'Wrathful Procession',faction:'Black Templars',dp:1,disposition:'Take and Hold',enhancements:[E('Adaptable Executioner',20),E('Benediction of Fury',15)],stratagems:['Castigate the Demagogues','Fuelled By Faith','Rite of Perfervid Wrath']},
    'companions-of-vehemence':{name:'Companions of Vehemence',faction:'Black Templars',dp:2,disposition:'Purge the Foe',enhancements:[E('Incendiary Animus',25),E('Merciless Denunciation',25),E('Oathbound Exemplar',15),E('Zealous Vanguard',20)],stratagems:['Devout Push','Hearts Hardened to Duty','For The Emperor’s Honour!','Pious Enmity','Heresy Begets Retribution','Dread Crusaders']},
    'godhammer-assault-force':{name:'Godhammer Assault Force',faction:'Black Templars',dp:2,disposition:'Purge the Foe',enhancements:[E('Augury Servo-Host',15),E('Battle-Psalm Precentor',10),E('Herald of Sacred Slaughter',15),E('Paragon of Fury',25)],stratagems:['A Ceaseless Cause','Uncompromising Egress','Gauntlet of The God-Emperor','Focused Hatred','Condemnatory Info-Screed','Blessed Hull']},
    'vindication-task-force':{name:'Vindication Task Force',faction:'Black Templars',dp:2,disposition:'Priority Assets',enhancements:[E('Consecrating Aura',25),E('Imperialis of the Eternal Crusade',15),E('Orb of the Emperor’s Aegis',10),E('Warden of Honour',20)],stratagems:['Refusal to Yield','Litanies of Purgation','Spoor of the Unholy','Reclaim Our Honour!','Recitation of the Revered','Perfervid Intervention']},

    // Added after the v1.0 Munitorum snapshot. Rule identity is official; selected
    // costs continue to come from New Recruit until GW publishes matching MFM metadata.
    'vengeful-hosts':{name:'Vengeful Hosts',faction:'Adeptus Astartes',dp:1,disposition:'Take and Hold',enhancements:[E('Avenging Angel',null),E('Orksbane',null)],sourceStatus:'official-post-mfm'}
  };
  const normalise=value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  function lookup(nameOrId=''){const k=normalise(nameOrId);return refs[k]?JSON.parse(JSON.stringify(refs[k])):null;}
  function resolve(nameOrId='',chapter=''){
    const item=lookup(nameOrId); if(!item)return null;
    const override=item.chapterOverrides?.[normalise(chapter)];
    return override?{...item,...override}:item;
  }
  global.ASTARTES_OFFICIAL_REFERENCE=Object.freeze({
    version:'2026-08-12-first-founding-scope',updated:'2026-08-12',refs,lookup,resolve,normalise,
    sources:{coreRules:'GW Core Rules 2026',spaceMarinesMfm:'GW Munitorum Field Manual v1.0',spaceWolvesMfm:'GW Munitorum Field Manual v1.0',bloodAngelsMfm:'GW Munitorum Field Manual v1.0',darkAngelsMfm:'GW Munitorum Field Manual / current New Recruit metadata',spaceWolvesFactionPack:'GW Space Wolves Faction Pack v1.0',bloodAngelsFactionPack:'GW Blood Angels Faction Pack v1.0',darkAngelsFactionPack:'GW Dark Angels Faction Pack / current 11th-edition reference',blackTemplarsMfm:'GW Munitorum Field Manual / current New Recruit metadata',blackTemplarsFactionPack:'GW Black Templars Faction Pack / current 11th-edition reference',firstFoundingScope:'New Recruit catalogue availability + GW Munitorum metadata'}
  });
})(window);
