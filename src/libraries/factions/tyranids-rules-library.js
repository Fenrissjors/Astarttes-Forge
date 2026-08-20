/* Astartes Forge — Tyranids Rules Library
 * 11th-edition Tyranids detachment registry for the 10-roster verification set.
 * New Recruit remains authoritative for selected roster composition and imported
 * detachment-rule text. This file supplies reference-completion for DP,
 * dispositions, Enhancement catalogues and Stratagem catalogues.
 */
(function(global){
  'use strict';
  const base=global.ASTARTES_RULES_LIBRARY;
  if(!base) return;

  const S=(name,phase,summary,cp=1)=>({kind:'stratagem',name,cp,phase,when:phase,target:'See detachment Stratagem conditions.',effect:summary,text:`WHEN: ${phase}\nTARGET: See detachment Stratagem conditions.\nEFFECT: ${summary}`});
  const E=(name,points)=>({kind:'enhancement',name,points,text:`${points} pts`});
  const R=(name,text)=>({kind:'detachment',name,text});
  const D=(id,name,dp,disposition,rules,enhancements,stratagems,tags=[])=>({
    id,name,faction:'Tyranids',dp,disposition,tags,status:'ready',availability:'faction-pack',
    sourceType:'new-recruit+verified-reference',rules,enhancements,stratagems,
    verification:{expected:{rules:rules.length,enhancements:enhancements.length,stratagems:stratagems.length},stratagemNames:stratagems.map(x=>x.name),enhancementNames:enhancements.map(x=>x.name)}
  });

  const tyranidsDetachments={
    'ambush-predators':D('ambush-predators','Ambush Predators',1,'Disruption',[
      R('Mindhunger','Deathleaper, Lictor and Neurolictor gain Deep Strike; Lictor and Neurolictor attacks into Character units can re-roll Hit rolls of 1.')
    ],[
      E('Cryptophotaic Camouflage (Upgrade)',15),E('Encircling Horrors (Upgrade)',20)
    ],[
      S('Hypersensory Adaptations','Shooting phase','A selected ambush organism can expose a nearby visible enemy by increasing its detection range.'),
      S('Counterpredation','Fight phase','Selected ambush organisms gain extra Strength and AP when attacking a hidden unit.'),
      S('Scanner Gheist',"End of opponent's Fight phase",'An unengaged Deathleaper, Lictor or Neurolictor can return to Strategic Reserves.')
    ]),

    'assimilation-swarm':D('assimilation-swarm','Assimilation Swarm',2,'Priority Assets',[
      R('Feed the Swarm','In the Command phase, each Harvester can regenerate one nearby Tyranids unit, healing a model or restoring destroyed Infantry models.')
    ],[
      E('Biophagic Flow (Aura)',10),E('Instinctive Defence',15),E('Parasitic Biomorphology',25),E('Regenerating Monstrosity',20)
    ],[
      S('Broodguard Impulse','Any phase','After a Harvester is destroyed, friendly Tyranids gain a lasting Wound bonus against the unit that destroyed it.'),
      S('Reclaim Biomass','Any phase','When a Tyranids unit is destroyed, a nearby Harvester can immediately regenerate another nearby Tyranids unit.'),
      S('Tyrannoformed','Command phase','A Harvester can secure an objective marker you control.'),
      S('Ablative Carapace',"Opponent's Shooting or Fight phase",'A targeted Harvester gains Feel No Pain, improved while on an objective you control.',2),
      S('Secure Biomass','Fight phase','A Tyranids unit gains Lethal Hits in melee, with improved critical-hit behaviour for Harvesters.'),
      S('Rapacious Hunger','Fight phase','A Tyranids unit that just destroyed an enemy unit immediately regenerates.')
    ]),

    'crusher-stampede':D('crusher-stampede','Crusher Stampede',2,'Purge the Foe',[
      R('Enraged Behemoths','Tyranids Monsters become more accurate as they take damage, and undamaged non-Battle-shocked Monsters gain Objective Control.')
    ],[
      E('Enraged Reserves',20),E('Monstrous Nemesis',25),E('Null Nodules',10),E('Ominous Presence',15)
    ],[
      S('Corrosive Viscera',"Opponent's Shooting or Fight phase",'A destroyed grounded Monster with Deadly Demise automatically triggers its mortal-wound effect.'),
      S('Rampaging Monstrosities','Fight phase','A Tyranids Monster can re-roll Hit rolls in melee.'),
      S('Savage Roar','Fight phase','A targeted Monster forces Battle-shock and imposes Hit penalties, with an additional Wound penalty on failure.'),
      S('Untrammelled Ferocity','Movement phase','A Tyranids Monster can move through models and low terrain, with risk when passing through taller terrain.'),
      S('Swarm-guided Salvoes','Shooting phase','A Tyranids Monster gains Ignores Cover and can ignore Ballistic Skill/Hit modifiers.'),
      S('Massive Impact','Charge phase','A charging Tyranids Monster can inflict mortal wounds on an engaged enemy unit.')
    ]),

    'invasion-fleet':D('invasion-fleet','Invasion Fleet',3,'Take and Hold',[
      R('Hyper-adaptations','At the start of the first battle round choose a lasting adaptation: Sustained Hits into Infantry/Swarm, Lethal Hits into Monsters/Vehicles, or Precision on Critical Hits into Characters.')
    ],[
      E('Adaptive Biology',25),E('Alien Cunning',30),E('Perfectly Adapted',15),E('Synaptic Linchpin',20)
    ],[
      S('Rapid Regeneration',"Opponent's Shooting or Fight phase",'A targeted Tyranids unit gains Feel No Pain, improved while within Synapse Range.'),
      S('Adrenal Surge','Fight phase','Selected Tyranids units score Critical Hits on unmodified 5+ in melee.',2),
      S('Death Frenzy','Fight phase','Destroyed models can sometimes fight before removal if they have not fought this phase.'),
      S('Overrun','Fight phase','A Tyranids unit gains extra Consolidation movement or can make a Normal move if in Synapse and unengaged.'),
      S('Predatory Imperative','Command phase','Temporarily apply an additional Hyper-adaptation to selected Tyranids units.'),
      S('Endless Swarm','Command phase','Restore destroyed models to selected Endless Multitude units.')
    ]),

    'subterranean-assault':D('subterranean-assault','Subterranean Assault',3,'Disruption',[
      R('Keywords','Mawloc and Trygon units gain Burrower; up to two Trygons can gain Character during muster and can receive Enhancements or become Warlord.'),
      R('Surprise Assault','Tyranids re-roll Hit rolls of 1. Burrowers arriving from Reserves create Tunnel Markers that can be used to deploy later Reserve units closer to the enemy.')
    ],[
      E('Synaptic Strategy',15),E('Tremor Senses',20),E('Trygon Prime',20),E('Vanguard Intellect',15)
    ],[
      S('Adaptive Optimisation','Command phase','A Mawloc or Trygon gains Synapse until the next Command phase.'),
      S('Replenishing Swarms','Movement phase','A unit near a Tunnel Marker heals a model or restores destroyed 1-Wound models.'),
      S('Enfilading Emergence','Movement phase','A unit arriving from Reserves gains Sustained Hits 1 and Ignores Cover through the next Fight phase.'),
      S('Tunnel Network','Movement phase','A unit near one Tunnel Marker can redeploy near another Tunnel Marker.'),
      S('Swarming Assault','Charge phase','A Monster arriving as Reinforcements lets nearby Tyranids re-roll Charge rolls.'),
      S('Retreat Below',"End of opponent's Fight phase",'Eligible Tyranids/Burrower units can be removed into Strategic Reserves.')
    ],['Burrower']),

    'synaptic-nexus':D('synaptic-nexus','Synaptic Nexus',2,'Disruption',[
      R('Synaptic Imperatives','At the start of each battle round choose one once-per-battle Synaptic Imperative, granting Synapse-range units either a 5+ invulnerable save, improved Advance/Charge rolls, or +1 to melee Hit rolls.')
    ],[
      E('Power of the Hive Mind',10),E('Psychostatic Disruption',30),E('Synaptic Control',20),E('The Dirgeheart of Kharis (Aura)',15)
    ],[
      S('The Smothering Shadow','Any phase','After an enemy fails Battle-shock near a Synapse unit, roll dice to inflict mortal wounds.'),
      S('Synaptic Channelling','Command phase','A Synapse unit extends Synapse Range around itself for the turn.'),
      S('Irresistible Will','Shooting or Fight phase','Nearby Tyranids can re-roll Hit and Wound rolls of 1 against a designated visible enemy.'),
      S('Reinforced Hive Node',"Opponent's Shooting or Fight phase",'Worsen the AP of attacks targeting a selected Synapse unit.'),
      S('Imperative Dominance','Command phase','Apply a chosen Synaptic Imperative to one unit even if it has already been used.'),
      S('Override Instincts','Movement phase','A Tyranids unit in Synapse that Fell Back remains eligible to shoot and charge.')
    ]),

    'talons-of-the-norn-queen':D('talons-of-the-norn-queen','Talons of the Norn Queen',1,'Take and Hold',[
      R('Higher Imperatives','Norn Emissary and Norn Assimilator units gain Protean Purpose, letting each unit reselect its Singular Purpose once per battle in your Command phase.')
    ],[
      E('Destabilising Predation (Upgrade)',20),E('Synaptoprescience (Upgrade)',25)
    ],[
      S('Lesser Prey','Fight phase','A Norn Assimilator or Norn Emissary gains +2 Strength on melee attacks.'),
      S('Catalytic Biofortification','Any phase','A Norn Assimilator gains Feel No Pain 4+ against mortal wounds.'),
      S('Tanglestrike Rounds','Shooting phase','After a Norn Assimilator shoots, one hit enemy becomes tethered and loses Movement until your next Command phase.')
    ],['Norn']),

    'unending-swarm':D('unending-swarm','Unending Swarm',2,'Take and Hold',[
      R('Insurmountable Odds','When enemy shooting destroys models from an Endless Multitude unit, that unit can make a Surge move of up to D6 inches.')
    ],[
      E('Adrenalised Onslaught',15),E('Naturalised Camouflage',30),E('Piercing Talons',25),E('Relentless Hunger',20)
    ],[
      S('Synaptic Goading','Any phase','Improve a Synapse-range Endless Multitude unit’s Surge move and allow it to move toward an objective.'),
      S('Unending Waves','Any phase','Once per battle, replace a destroyed Endless Multitude unit in Strategic Reserves at Starting Strength.',2),
      S('Teeming Masses',"Opponent's Shooting or Fight phase",'A targeted Endless Multitude unit imposes -1 to Hit.'),
      S('Swarming Masses','Shooting or Fight phase','An Endless Multitude unit gains Sustained Hits 1 and, at 15+ models, scores Critical Hits on 5+.'),
      S('Bounding Advance','Movement phase','An Endless Multitude unit uses a fixed +6-inch Advance instead of rolling.'),
      S('Preservation Imperative',"Opponent's Shooting phase",'Treat an Endless Multitude unit as containing fewer than five models for Blast.')
    ],['Endless Multitude']),

    'vanguard-onslaught':D('vanguard-onslaught','Vanguard Onslaught',2,'Reconnaissance',[
      R('Questing Tendrils','Tyranids units can charge after Falling Back; Vanguard Invader units can also charge after Advancing.'),
      R('Vanguard Prime','Deathleaper loses Hunter Organism and can be selected as your Warlord.')
    ],[
      E('Chameleonic',15),E('Hunting Grounds',30),E('Neuronode',20),E('Stalker',10)
    ],[
      S('Surprise Assault','Shooting or Fight phase','A Vanguard Invader forces Battle-shock on a targeted enemy and gains Hit bonuses, plus Wound bonuses on a failed test.'),
      S('Assassin Beasts','Fight phase','Vanguard Invader Infantry melee weapons gain Precision.'),
      S('Seeded Broods','Movement phase','Selected Reserve units count the battle round as one higher for deployment timing.'),
      S('Hypersensory Scillia',"Opponent's Movement phase",'Selected nearby Vanguard Invader/Tyranids Infantry units can make a 6-inch reactive Normal move.',2),
      S('Unseen Lurkers',"Opponent's Shooting phase",'A targeted Vanguard Invader gains a range-based targeting restriction for the phase.'),
      S('Invisible Hunter',"End of opponent's Fight phase",'Eligible Vanguard Invader or Tyranids Infantry units can return to Strategic Reserves.')
    ],['Vanguard Invader']),

    'warrior-bioform-onslaught':D('warrior-bioform-onslaught','Warrior Bioform Onslaught',1,'Take and Hold',[
      R('Leader-beasts','Tyranid Warriors units gain Tyranid Warriors and Battleline; Tyranid Warriors, Tyranid Prime with lash whip and Winged Tyranid Prime models gain a 5+ invulnerable save.')
    ],[
      E('Elevated Might',30),E('Ocular Adaptation',20)
    ],[
      S('Alien Physiology',"Opponent's Shooting or Fight phase",'Attacks stronger than a targeted Tyranid Warriors unit’s Toughness suffer -1 to Wound.'),
      S('Parasitic Payload','Shooting phase','A Tyranid Warriors unit’s ranged attacks gain Ignores Cover.'),
      S('Synaptic Micronodes','Movement phase','Secure an objective controlled by a Tyranid Warriors unit at the end of Movement.')
    ],['Tyranid Warriors'])
  };

  const normalise=base.normalise || (value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''));
  if(base.detachments && typeof base.detachments==='object') Object.assign(base.detachments,tyranidsDetachments);

  const previousLookup=base.lookupDetachment?.bind(base);
  if(previousLookup){
    base.lookupDetachment=function(nameOrId=''){
      const key=normalise(nameOrId);
      const item=tyranidsDetachments[key];
      return item ? JSON.parse(JSON.stringify(item)) : previousLookup(nameOrId);
    };
  }

  global.ASTARTES_TYRANIDS_RULES_LIBRARY=Object.freeze({
    version:'1.0.0-11e-tyranids',
    faction:'Tyranids',
    detachments:tyranidsDetachments,
    lookup:nameOrId=>{
      const item=tyranidsDetachments[normalise(nameOrId)];
      return item ? JSON.parse(JSON.stringify(item)) : null;
    },
    list:()=>Object.values(tyranidsDetachments).map(x=>JSON.parse(JSON.stringify(x)))
  });
})(window);
