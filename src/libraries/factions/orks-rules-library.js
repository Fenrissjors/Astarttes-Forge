/* Astartes Forge — Orks Rules Library
 * Complete 11th-edition Orks detachment registry for the 13-detachment
 * verification set. New Recruit remains authoritative for roster selections and
 * imported rule text; this library supplies reference-completion, counts and
 * Stratagem metadata when ROSZ does not serialise the full catalogue.
 */
(function(global){
  'use strict';
  const base=global.ASTARTES_RULES_LIBRARY;
  if(!base) return;

  const S=(name,phase,summary,cp=1)=>({kind:'stratagem',name,cp,phase,when:phase,target:'See detachment Stratagem conditions.',effect:summary,text:`WHEN: ${phase}\nTARGET: See detachment Stratagem conditions.\nEFFECT: ${summary}`});
  const E=(name,points)=>({kind:'enhancement',name,points,text:`${points} pts`});
  const D=(id,name,dp,disposition,ruleName,ruleText,enhancements,stratagems,tags=[])=>({
    id,name,faction:'Orks',dp,disposition,tags,status:'ready',availability:'faction-pack',
    sourceType:'new-recruit+verified-reference',
    rules:[{kind:'detachment',name:ruleName,text:ruleText}],enhancements,stratagems,
    verification:{expected:{rules:1,enhancements:enhancements.length,stratagems:stratagems.length},stratagemNames:stratagems.map(x=>x.name),enhancementNames:enhancements.map(x=>x.name)}
  });

  const orksDetachments={
    'blitz-brigade':D('blitz-brigade','Blitz Brigade',2,'Reconnaissance','Eager for the Fight','Orks units that disembark from a Transport can re-roll Advance and Charge rolls that turn.',[
      E('Blitzkaptin',25),E('Runnin’ Boots',10),E('Supercharged Squig Oil',10),E('Tuff Git',5)
    ],[
      S('Mount up, Ladz','Fight phase','Nearby Orks Infantry can embark in a suitable Transport at the end of the Fight phase.'),
      S('Mekanised Brutality','Movement phase','A Battlewagon or Rig can move and still let disembarking passengers remain eligible to charge.'),
      S('Run ’em Down','Movement phase','Selected heavy Ork vehicles/monsters become eligible to charge after Advancing.'),
      S('Armoured Duellists','Shooting phase','An Orks Vehicle gains bonuses to Hit and Wound against Monsters or Vehicles.'),
      S('Impervious','Opponent Shooting phase','A Battlewagon or Rig becomes harder to wound with attacks stronger than its Toughness.'),
      S('Yooz in Trouble Now','Opponent Shooting phase','After a wagon/rig is hit, embarked Orks Infantry can disembark and surge forward.')
    ],['Wagons']),

    'bully-boyz':D('bully-boyz','Bully Boyz',2,'Purge the Foe','Da Boss Is Watchin’','If a Warboss is present, a second Waaagh! can be called for Warboss, Nobz and Meganobz units.',[
      E('Big Gob',20),E('Da Biggest Boss',15),E('Tellyporta',25),E('’Eadstompa',10)
    ],[
      S('Armed To Da Teef','Shooting & Fight phase','Nobz or Meganobz improve their attack reliability, with a stronger benefit during a Waaagh!.'),
      S('Too Arrogant To Die','Opponent Shooting & Fight phase','Destroyed Nobz/Meganobz can sometimes shoot or fight before removal.'),
      S('Always Lookin’ Fer A Fight','Fight phase','Nobz/Meganobz that destroy an enemy can make a longer Consolidation move.'),
      S("Krushin' Impact",'Charge phase','Charging Nobz/Meganobz can inflict mortal wounds on an engaged enemy.'),
      S('Cut’ Em Down','Opponent Movement phase','An enemy Falling Back from Nobz/Meganobz is forced into Desperate Escape tests.'),
      S('Hulking Brutes','Opponent Shooting phase','Incoming ranged attacks against Nobz/Meganobz have worsened AP.')
    ]),

    'da-big-hunt':D('da-big-hunt','Da Big Hunt',2,'Purge the Foe','Da Hunt Is On','Choose an enemy Monster, Vehicle or Character as Prey; Beast Snagga units gain charge and armour-penetration benefits against it.',[
      E('Glory Hog',30),E('Proper Killy',15),E('Skrag Every Stash!',25),E('Surly As A Squiggoth',20)
    ],[
      S('Drag It Down','Fight phase','Beast Snaggas gain Sustained Hits in melee and improved critical hits against the Prey.'),
      S('Unstoppable Momentum','Charge phase','A charging mounted Beast Snagga unit can inflict mortal wounds.'),
      S('Dat One’s Even Bigga!','Charge phase','A Beast Snagga unit can charge after Advancing/Falling Back and re-roll its charge toward the Prey.'),
      S('Where D’ya Fink You’re Going?','Opponent Movement phase','Beast Snaggas can pursue an enemy after it Falls Back.'),
      S('Stalkin’ Taktiks','Opponent Shooting phase','Beast Snaggas gain defensive benefits against ranged attacks.'),
      S('Instinctive Hunters','Fight phase','An unengaged Beast Snagga unit can return to Strategic Reserves at the end of the opponent’s Fight phase.')
    ]),

    'dread-mob':D('dread-mob','Dread Mob',2,'Priority Assets','Try Dat Button!','Meks, Orks Walkers and Grots Vehicles generate a weapon effect when selected to shoot or fight; they may deliberately push the result at additional risk.',[
      E('Gitfinder Gogglez',10),E('Press It Fasta!',35),E('Smoky Gubbinz',15),E('Supa-glowy Fing',20)
    ],[
      S('Klankin’ Klaws','Fight phase','An Orks Walker improves melee Strength and can push for extra Damage with Hazardous.'),
      S('Superfuelled Boiler','Movement phase','An Orks Walker improves its Advance and gains Assault on ranged weapons.'),
      S('Bigger Shells For Bigger Gitz','Shooting phase','Mek/Walker/Grots Vehicle attacks improve against Monsters/Vehicles, with an optional hazardous push.'),
      S('Dakka! Dakka! Dakka!','Shooting phase','Walkers/Grots Vehicles improve Hit re-rolls, with a stronger hazardous push option.'),
      S('Conniving Runts','Opponent Movement phase','Nearby Gretchin can damage a moving enemy and then make a Normal move.'),
      S('Extra Gubbinz','Opponent Shooting phase','A non-Titanic Walker/Grots Vehicle reduces incoming ranged Damage.')
    ]),

    'equatorial-hordes':D('equatorial-hordes','Equatorial Hordes',1,'Disruption','Jungle Know-wotz','Up to three friendly Mob/Kommandos units gain Scouts 6" for the battle.',[
      E('Kunnin’ Hunta',25),E('Unkillable Scourge',25)
    ],[
      S('Dey’re Over ‘Ere','Shooting phase','A Mob/Kommandos unit can improve detection range against a nearby visible enemy.'),
      S('Stragglerz','Command phase','A Mob/Kommandos unit restores lost wounds.'),
      S('Concealed Krumpin’','Shooting & Fight phase','A hidden Mob unit gains Lethal Hits for its attacks.')
    ]),

    'freebooter-krew':D('freebooter-krew','Freebooter Krew',2,'Take and Hold','Here Be Loot','Choose a loot objective each Command phase; nearby Orks Infantry, Mounted and Walker attacks gain Sustained Hits 1.',[
      E('Bionik Workshop',15),E('Da Kaptin',10),E('Git-Spotter Squig',20),E('Razgit’s Magik Map',25)
    ],[
      S('Bash and Grab','Fight phase','Re-roll Wound rolls against enemies within range of the loot objective.'),
      S('Grab and Bash','Command phase','A non-Gretchin Orks unit on the loot objective treats the Waaagh! as active.'),
      S('Boardin’ Rush','Movement phase','An Orks unit uses a fixed 6-inch Advance bonus instead of rolling.'),
      S('Deck Fraggers','Shooting phase','Ranged weapons gain Blast when targeting Infantry.'),
      S('Rolling Loot-Heap','Shooting phase','Flash Gitz gain Anti-Vehicle 4+ on ranged weapons.'),
      S('Krump and Run','Opponent Movement phase','An Orks unit can move after an engaged enemy Falls Back.')
    ]),

    'green-tide':D('green-tide','Green Tide',3,'Take and Hold','Mob Mentality','Boyz gain an invulnerable save, improved while the unit contains at least ten models.',[
      E('Bloodthirsty Belligerence',15),E('Brutal But Kunnin’',25),E('Ferocious Show Off',10),E('Raucous Warcaller',20)
    ],[
      S('Competitive Streak','Fight phase','Boyz improve Wound re-rolls, with a stronger benefit at ten or more models.'),
      S('Bulldozer Brutality','Fight phase','Engaged Boyz can fight from deeper within the mob.'),
      S('Braggin’ Rights','Command phase','Two nearby Boyz units count as having at least ten models for relevant rules.'),
      S('Come On Ladz!','Command phase','Return destroyed non-Character Boyz models to the unit.'),
      S('Tide of Muscle','Charge phase','Boyz improve Charge rolls and can re-roll them when the mob is large enough.'),
      S('Go Get ’Em!','Opponent Shooting phase','Unengaged Boyz can surge after being shot by an enemy unit.')
    ]),

    'kult-of-speed':D('kult-of-speed','Kult of Speed',2,'Disruption','Adrenaline Junkies','Speed Freeks remain eligible to shoot and charge after Advancing or Falling Back.',[
      E('Fasta Than Yooz',35),E('Speed Makes Right',25),E('Squig-hide Tyres',15),E('Wazblasta',10)
    ],[
      S('Speediest Freeks','Opponent Shooting & Fight phase','Speed Freeks/Trukks gain an invulnerable save, improved for lighter Vehicles.'),
      S('Squig Flingin’','Movement phase','After moving, a Speed Freeks/Trukk unit can force a nearby enemy to take a penalised Battle-shock test.'),
      S('Dakkastorm','Shooting phase','Speed Freeks gain Sustained Hits, stronger against close targets.'),
      S('Blitza Fire','Shooting phase','Speed Freeks gain Lethal Hits and improved Critical Hits against close targets.'),
      S('Full Throttle','Charge phase','Charging Speed Freeks improve their melee Wound rolls.'),
      S('More Gitz Over ’Ere!','Opponent Movement phase','Unengaged Speed Freeks can make a reactive Normal move after a nearby enemy moves.')
    ]),

    'more-dakka':D('more-dakka','More Dakka!',1,'Disruption','Dakka! Dakka! Dakka!','Orks Infantry ranged attacks gain Assault and, while the Waaagh! is active, Sustained Hits 1.',[
      E('Da Gobshot Thunderbuss',15),E('Dead Shiny Shootas (Upgrade)',15)
    ],[
      S('Speshul Shells','Shooting phase','Close-range Orks Infantry shooting improves Armour Penetration.'),
      S('Call Dat Dakka?','Opponent Shooting phase','An Orks Infantry unit can answer enemy shooting with snap shooting at that attacker.'),
      S('Long, Uncontrolled Bursts','Shooting phase','Orks Infantry ranged attacks gain Ignores Cover.')
    ]),

    'rollin-deff':D('rollin-deff',"Rollin' Deff",1,'Priority Assets','Thundering Wagons','Battlewagons and Rigs become Wagons; Wagons re-roll charges and can use a fixed Advance result.',[
      E('Boarding Ramps (Upgrade)',10),E('Targetin’ Gizmos (Upgrade)',15)
    ],[
      S('Impending Crunch','Charge phase','A Wagon completing a charge forces engaged enemies to take penalised Battle-shock tests.'),
      S('Devastating Drift','Fight phase','A charging Wagon gains Cleave 1 on melee attacks.'),
      S('Brutal Broadside','Shooting phase','A Battlewagon gains Rapid Fire X on eligible ranged attacks.')
    ],['Wagons']),

    'speedwaaagh':D('speedwaaagh','Speedwaaagh!',2,'Reconnaissance','Turbo Boostas','Speed Freeks and Trukks can turbo to a fixed 24-inch straight-line Move and gain Assault, but cannot charge that turn.',[
      E('Dakkamek',25),E('Kustom Shokk Box',10),E('Master Meknologist',20),E('Supa-Burny Fuel',15)
    ],[
      S('On Da Move','Movement phase','An Orks unit can shoot and charge after Advancing or Falling Back unless it used turbo.'),
      S('Mobile Dakkastorm','Shooting phase','After Speed Freeks/Trukk shooting hits an enemy, other matching units gain Strength against that target.'),
      S('Speshul Ammo','Shooting phase','Eligible Orks ranged weapons gain Anti-Monster 4+ and Anti-Vehicle 4+.'),
      S('Ded Killy Construction','Fight phase','Speed Freeks/Trukks gain Lance and improved melee Damage after charging.'),
      S('Dust Trails','Opponent Shooting phase','An Orks unit gains the Benefit of Cover against incoming shooting.'),
      S('Evasive Manoova','Fight phase','An unengaged Speed Freeks/Trukk unit can return to Strategic Reserves.')
    ]),

    'taktikal-brigade':D('taktikal-brigade','Taktikal Brigade',1,'Reconnaissance','Lissen ’Ere','Stormboyz gain Battleline; Boyz, Kommandos and Stormboyz can Advance/Fall Back without losing action eligibility.',[
      E('Mork’s Kunnin’',20),E('Slippery Git',15)
    ],[
      S('Taktikal Retreat','Movement phase','Kommandos/Stormboyz can Fall Back and remain eligible to charge.'),
      S('On to da Next','Opponent Movement phase','An unengaged Boyz/Kommandos/Stormboyz unit can make a Normal move after the opponent moves.'),
      S('Ded Sneaky','Fight phase','An unengaged Kommandos/Stormboyz unit can be placed into Strategic Reserves.')
    ]),

    'war-horde':D('war-horde','War Horde',3,'Take and Hold','Get Stuck In','Melee weapons equipped by Orks models have Sustained Hits 1.',[
      E('Follow Me Ladz',25),E('Headwoppa’s Killchoppa',20),E('Kunnin’ but Brutal',15),E('Supa-Cybork Body',15)
    ],[
      S('Careen!','Any phase','A destroyed Orks Vehicle with a successful Deadly Demise can move before resolving the explosion.'),
      S('Orks is Never Beaten','Fight phase','Destroyed Orks models can fight before removal if they have not fought yet.',2),
      S('Unbridled Carnage','Fight phase','An Orks unit scores melee Critical Hits on a 5+ for the phase.'),
      S('’Ard as Nails','Opponent Shooting & Fight phase','Eligible Orks units impose a penalty on incoming Wound rolls.'),
      S('Mob Rule','Command phase','A large Mob can remove Battle-shock from nearby Orks Infantry.'),
      S('’Ere We Go','Movement phase','Orks Infantry improve Advance and Charge rolls for the turn.')
    ])
  };

  const normalise=base.normalise || (value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''));
  if(base.detachments && typeof base.detachments==='object') Object.assign(base.detachments,orksDetachments);
  const baseLookup=base.lookupDetachment.bind(base);
  const lookupDetachment=(nameOrId='')=>{
    const key=normalise(nameOrId);
    const item=orksDetachments[key];
    return item ? JSON.parse(JSON.stringify(item)) : baseLookup(nameOrId);
  };
  const combinedDetachments={...(base.detachments||{}),...orksDetachments};
  const manifest={...(base.manifest||{}),version:'3.0.0-multifaction-orks-complete',updated:'2026-08-19',readyDetachments:Object.values(combinedDetachments).filter(x=>x.status==='ready').length,cataloguedDetachments:Object.values(combinedDetachments).filter(x=>x.status==='catalogued').length,totalDetachments:Object.keys(combinedDetachments).length,orksDetachments:13};
  global.ASTARTES_RULES_LIBRARY=Object.freeze({...base,manifest,detachments:combinedDetachments,lookupDetachment,listDetachments:()=>Object.values(combinedDetachments).map(x=>JSON.parse(JSON.stringify(x)))});
})(window);
