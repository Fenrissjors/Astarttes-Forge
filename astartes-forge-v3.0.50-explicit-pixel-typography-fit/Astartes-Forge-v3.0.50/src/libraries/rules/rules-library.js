/* Astartes Forge Rules Library
 * Versioned, data-only reference registry. New Recruit supplies roster composition;
 * this library supplies concise printable rule references when ROSZ omits them.
 */
(function (global) {
  'use strict';

  const normalise = (value='') => String(value)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const stratagem = (name, cp, phase, when, target, effect, restrictions='') => ({
    kind: 'stratagem', name, cp, phase, when, target, effect, restrictions,
    text: [
      when && `WHEN: ${when}`,
      target && `TARGET: ${target}`,
      effect && `EFFECT: ${effect}`,
      restrictions && `RESTRICTIONS: ${restrictions}`
    ].filter(Boolean).join('\n')
  });

  const detachments = {
    'anvil-siege-force': {
      id:'anvil-siege-force', name:'Anvil Siege Force', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Take and Hold', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Shield of the Imperium',text:'Ranged weapons carried by Adeptus Astartes models gain Heavy. If a weapon already has Heavy and its unit Remained Stationary, add 1 to that weapon’s Wound rolls.'}],
      enhancements:[
        {kind:'enhancement',name:'Architect of War',points:25,text:'Rules text is taken from the selected New Recruit enhancement when present; this library entry preserves the official name and points for validation.'},
        {kind:'enhancement',name:'Fleet Commander',points:15,text:'Rules text is taken from the selected New Recruit enhancement when present; this library entry preserves the official name and points for validation.'},
        {kind:'enhancement',name:'Indomitable Fury',points:20,text:'Rules text is taken from the selected New Recruit enhancement when present; this library entry preserves the official name and points for validation.'},
        {kind:'enhancement',name:'Stoic Defender',points:15,text:'Rules text is taken from the selected New Recruit enhancement when present; this library entry preserves the official name and points for validation.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Rigid Discipline',1,'End of Fight phase','At the end of the Fight phase.','One Adeptus Astartes unit within Engagement Range.','That unit can make a Fall Back move of up to 6 inches.','It must finish wholly within your deployment zone or within 3 inches of an objective marker.'),
        stratagem('Not One Backwards Step',1,'Command phase','During your Command phase.','One Adeptus Astartes Infantry unit within 3 inches of an objective marker.','Double the Objective Control characteristic of its models until the end of the turn.','That unit must Remain Stationary this turn.'),
        stratagem('No Threat Too Great',2,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Its ranged attacks can re-roll Wound rolls against Monster or Vehicle units for the phase.'),
        stratagem('Battle Drill Recall',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Its ranged weapons gain Sustained Hits 1. If it Remained Stationary, unmodified Hit rolls of 5+ are Critical Hits.'),
        stratagem('Hail of Vengeance',1,"Opponent’s Shooting phase",'Just after an enemy unit finishes shooting.','One Adeptus Astartes unit that lost one or more models to those attacks.','The surviving unit can immediately shoot at the attacking unit, subject to normal eligibility restrictions.')
      ]
    },
    'fulguris-task-force': {
      id:'fulguris-task-force', name:'Fulguris Task Force', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Disruption', dp:1, status:'ready', availability:'public-pack', sourceType:'official-public-pack-summary',
      rules:[{kind:'detachment',name:'Skystrike',text:'Your listed Land Speeder and Storm Speeder units gain the Speeder keyword. In your first Movement phase, friendly Speeder units can make an ingress move.'}],
      enhancements:[
        {kind:'enhancement',name:'Bellicose Weapon Spirits Upgrade',text:'Speeder unit only. Re-roll Damage rolls and rolls that determine a weapon’s Attacks characteristic.'},
        {kind:'enhancement',name:'Raptorial Cogitator Core Upgrade',text:'Speeder unit only. The unit’s ranged attacks ignore cover.'}
      ],
      stratagems:[
        stratagem('Data-link Augury',1,'Shooting phase','When a friendly Speeder unit is selected to shoot.','That Speeder unit.','Select one enemy unit within 24 inches. Increase that enemy unit’s detection range by 6 inches until your unit has shot.'),
        stratagem('Reactive Evasion',1,"Opponent’s Movement phase",'When an enemy unit ends a move within 8 inches of a friendly unengaged Speeder unit.','That Speeder unit.','It can make a Normal move of D3+3 inches.'),
        stratagem('Anti-grav Surge',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One friendly unengaged Speeder unit.','Place that unit into Strategic Reserves.')
      ]
    },
    'librarius-conclave': {
      id:'librarius-conclave', name:'Librarius Conclave', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Reconnaissance', dp:1, status:'ready', availability:'public-pack', sourceType:'official-public-pack-summary',
      rules:[{kind:'detachment',name:'Psychic Disciplines',text:'At the start of each battle round, choose Biomancy, Divination, Pyromancy, Telekinesis or Telepathy. Friendly Adeptus Astartes Psyker units gain the chosen discipline until the end of that battle round.'}],
      enhancements:[
        {kind:'enhancement',name:'Celerity',text:'Psyker model only. The unit can charge after Advancing; with Biomancy active, it can also charge after Falling Back.'},
        {kind:'enhancement',name:'Prescience',text:'Psyker model only, excluding Terminators. Once per turn, after an enemy ends a move within 8 inches, this unengaged unit can make a Normal move; With Divination active, that Normal move is up to 6 inches instead of D6 inches.'},
        {kind:'enhancement',name:'Obfuscation',text:'Psyker model only. The unit cannot be targeted by snap shooting attacks; Telepathy also reduces its detection range.'},
        {kind:'enhancement',name:'Temporal Corridor',text:'Psyker model only. At the end of the opponent’s Fight phase, place the unit into Strategic Reserves; Telekinesis also grants Deep Strike.'},
        {kind:'enhancement',name:'Fusillade',text:'Psyker model only. The unit’s ranged attacks gain Anti-Monster/Vehicle 5+; Pyromancy also grants Sustained Hits 1.'}
      ],
      stratagems:[]
    },
    'subversion-assets': {
      id:'subversion-assets', name:'Subversion Assets', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Reconnaissance', dp:1, status:'ready', availability:'public-pack', sourceType:'official-public-pack-summary',
      rules:[{kind:'detachment',name:'Nowhere to Hide',text:'Friendly Phobos and Scout Squad units can mark one visible enemy within 12 inches as detected in your Shooting phase. A detected unit has 3 inches more detection range.'}],
      enhancements:[
        {kind:'enhancement',name:'Shroud Field',text:'Phobos model only. The bearer has Lone Operative and Stealth.'},
        {kind:'enhancement',name:'Death in the Dark Upgrade',text:'Infantry Phobos unit only. Add 1 to Hit rolls for attacks that target a hidden unit.'}
      ],
      stratagems:[
        stratagem('Adaptive Operations',1,'Shooting phase','When a friendly Phobos or Scout Squad unit starts an action.','That unit.','Starting the action does not prevent the unit from being eligible to shoot.'),
        stratagem('Strike from the Shadows',1,'Shooting phase','After a friendly Phobos or Scout Squad unit has shot.','That unit.','Those attacks do not prevent the unit from being hidden.'),
        stratagem('Cloaked Position',1,"Start of opponent’s Movement phase",'At the start of your opponent’s Movement phase.','One friendly unengaged Phobos or Scout Squad unit.','Reduce that unit’s detection range by 3 inches until the end of the turn.')
      ]
    },

    'gladius-task-force': {
      id:'gladius-task-force', name:'Gladius Task Force', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Priority Assets', dp:3, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Combat Doctrines',text:'At the start of your Command phase, select one Combat Doctrine that has not already been selected this battle. Until your next Command phase, your Adeptus Astartes units gain that doctrine: advance and shoot; advance and charge; or fall back, shoot and charge, as appropriate to the selected doctrine.'}],
      enhancements:[
        {kind:'enhancement',name:'Artificer Armour',text:'The bearer has a 2+ Save characteristic and Feel No Pain 5+ against mortal wounds.'},
        {kind:'enhancement',name:'The Honour Vehement',text:'Add 1 to the Attacks and Strength characteristics of the bearer’s melee weapons; while the Assault Doctrine is active, add 2 instead.'},
        {kind:'enhancement',name:'Adept of the Codex',text:'The bearer’s unit can benefit from the Tactical Doctrine even when another doctrine is active for the army.'},
        {kind:'enhancement',name:'Fire Discipline',text:'While the bearer leads a unit, its ranged weapons gain Sustained Hits 1. While the Devastator Doctrine is active, that unit can also re-roll Advance rolls.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Honour the Chapter',1,'Fight phase','When one Adeptus Astartes unit is selected to fight.','That unit.','Add 1 to the Armour Penetration characteristic of its melee weapons; while the Assault Doctrine is active, add 2 instead.'),
        stratagem('Only in Death Does Duty End',2,'Fight phase','Just after an enemy unit selects targets.','One Adeptus Astartes unit that was selected as a target.','Destroyed models in that unit can fight before being removed, provided they have not already fought this phase.'),
        stratagem('Adaptive Strategy',1,'Command phase','During your Command phase.','One Adeptus Astartes unit.','Select a Combat Doctrine. That unit gains that doctrine until your next Command phase, even if it was already selected earlier in the battle.'),
        stratagem('Storm of Fire',1,'Shooting phase','When an Adeptus Astartes unit that has not shot is selected to shoot.','That unit.','Add 1 to the Armour Penetration characteristic of its ranged weapons; while the Devastator Doctrine is active, those attacks also have Ignores Cover.'),
        stratagem('Squad Tactics',1,"Opponent’s Movement phase",'Just after an enemy unit ends a move within 8 inches.','One Adeptus Astartes Infantry or Mounted unit within 8 inches of that enemy unit.','Your unit can make a Normal move of up to D6 inches; while the Tactical Doctrine is active, it can move up to 6 inches instead.')
      ]
    },
    'firestorm-assault-force': {
      id:'firestorm-assault-force', name:'Firestorm Assault Force', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Purge the Foe', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Close-range Eradication',text:'Ranged weapons equipped by Adeptus Astartes models gain Assault. Each time such a weapon targets a unit within 12 inches, add 1 to that weapon’s Strength characteristic.'}],
      enhancements:[
        {kind:'enhancement',name:'Champion of Humanity',text:'While the bearer leads a unit, models in that unit can ignore modifiers to their characteristics and to their attack rolls, except modifiers to saving throws.'},
        {kind:'enhancement',name:'War-tempered Artifice',text:'Add 3 to the Strength characteristic of the bearer’s melee weapons.'},
        {kind:'enhancement',name:'Forged in Battle',text:'While the bearer leads a unit, once per turn one Hit roll or saving throw for that unit can be changed to an unmodified 6.'},
        {kind:'enhancement',name:'Adamantine Mantle',text:'Reduce the Damage characteristic of attacks allocated to the bearer, subject to the enhancement’s minimum.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Crucible of Battle',1,'Shooting or Fight phase','When an Adeptus Astartes unit is selected to shoot or fight.','That unit.','Add 1 to Wound rolls for attacks that target the closest eligible enemy unit.'),
        stratagem('Rapid Embarkation',1,"Opponent’s Charge phase",'Just after an enemy unit selects charge targets.','One Adeptus Astartes Infantry unit selected as a charge target and one friendly Transport within 6 inches.','Your Infantry unit can embark within that Transport if every model can do so; the charge is then resolved against any remaining targets.'),
        stratagem('Immolation Protocols',2,'Shooting phase','When an Adeptus Astartes unit is selected to shoot.','That unit.','Torrent weapons equipped by models in that unit gain Devastating Wounds for the phase.'),
        stratagem('Onslaught of Fire',1,'Shooting phase','When an Adeptus Astartes unit that disembarked from a Transport this turn is selected to shoot.','That unit.','Its ranged attacks ignore cover; add 1 to Hit rolls for attacks against the closest eligible target.'),
        stratagem('Burning Vengeance',1,"Opponent’s Shooting phase",'Just after an enemy unit finishes shooting at an Adeptus Astartes Transport.','One unit embarked within that Transport.','That unit can disembark and then shoot at the attacking enemy unit, subject to normal eligibility restrictions.')
      ]
    },
    'ironstorm-spearhead': {
      id:'ironstorm-spearhead', name:'Ironstorm Spearhead', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Purge the Foe', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Armoured Wrath',text:'Once per phase for each Adeptus Astartes unit, when that unit makes an attack, you can re-roll one Hit roll, one Wound roll or one Damage roll.'}],
      enhancements:[
        {kind:'enhancement',name:'Target Augury Web',text:'Techmarine only. In your Command phase, select one Adeptus Astartes Vehicle unit within 6 inches; its weapons gain Lethal Hits until your next Command phase.'},
        {kind:'enhancement',name:'Master of Machine War',text:'In your Command phase, select one Adeptus Astartes Vehicle unit within 6 inches; it remains eligible to shoot after Advancing or Falling Back until your next Command phase.'},
        {kind:'enhancement',name:'Adept of the Omnissiah',text:'Techmarine only. Once per battle round, reduce the Damage of an attack allocated to an Adeptus Astartes Vehicle model within 6 inches to 0.'},
        {kind:'enhancement',name:'The Flesh is Weak',text:'The bearer has Feel No Pain 4+.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Mercy is Weakness',2,'Shooting or Fight phase','When an Adeptus Astartes unit is selected to shoot or fight.','That unit.','Against enemy units below Starting Strength, unmodified Hit rolls of 5+ score Critical Hits and the unit gains Sustained Hits 1.'),
        stratagem('Ancient Fury',1,'Command phase','During your Command phase.','One Adeptus Astartes Walker model.','Until your next Command phase, add 1 to its Move, Toughness, Leadership and Objective Control characteristics and add 1 to its Hit rolls.'),
        stratagem('Power of the Machine Spirit',1,"Opponent’s Shooting phase",'Just after an enemy unit finishes shooting.','One Adeptus Astartes Vehicle unit that lost one or more wounds to those attacks.','That Vehicle can shoot as if it were your Shooting phase, but can only target the enemy unit that just attacked it.'),
        stratagem('Vengeful Animus',1,'Any phase','Just after an Adeptus Astartes Vehicle model is destroyed.','That destroyed model.','Do not roll for Deadly Demise: treat the result as an unmodified 6, then resolve its mortal wounds against every unit within the listed Deadly Demise distance.'),
        stratagem('Unbowed Conviction',1,'Command phase','During your Command phase.','One Adeptus Astartes Vehicle unit below Starting Strength.','Until your next Command phase, that unit ignores modifiers to its characteristics and to its attack rolls, except saving throws.')
      ]
    },
    'stormlance-task-force': {
      id:'stormlance-task-force', name:'Stormlance Task Force', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Disruption', dp:3, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Lightning Assault',text:'Adeptus Astartes units are eligible to declare a charge in a turn in which they Advanced or Fell Back.'}],
      enhancements:[
        {kind:'enhancement',name:'Fury of the Storm',text:'Mounted model only. After the bearer’s unit completes a Charge move, add 1 to the Strength and Armour Penetration characteristics of the bearer’s melee weapons until the end of the turn.'},
        {kind:'enhancement',name:'Hunter’s Instincts',text:'Mounted model only. The bearer’s unit can be placed into Strategic Reserves more flexibly and can arrive earlier than normal.'},
        {kind:'enhancement',name:'Feinting Withdrawal',text:'The bearer’s unit can shoot after Falling Back.'},
        {kind:'enhancement',name:'Portents of Wisdom',text:'While the bearer leads a unit, re-roll Advance rolls and Charge rolls made for that unit.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Blitzing Fusillade',1,'Shooting phase','When an Adeptus Astartes unit is selected to shoot.','That unit.','Its ranged weapons gain Assault; if they already have Assault, they also gain Sustained Hits 1.'),
        stratagem('Full Throttle',1,'Movement phase','When an Adeptus Astartes Mounted or Vehicle unit Advances.','That unit.','Do not roll for the Advance; add a fixed maximum-style distance to its Move instead.'),
        stratagem('Ride Hard, Ride Fast',1,"Opponent’s Shooting phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes Mounted or Vehicle unit.','Subtract 1 from the Hit roll and Wound roll for attacks that target that unit.'),
        stratagem('Wind-swift Evasion',1,"Opponent’s Movement phase",'Just after an enemy unit ends a move.','One Adeptus Astartes Infantry or Mounted unit within 8 inches of that enemy unit.','Your unit can make a Normal move of up to 6 inches.'),
        stratagem('Shock Assault',1,'Charge phase','Just after an Adeptus Astartes unit ends a Charge move.','That unit.','Select one enemy unit within Engagement Range; roll dice based on the charging unit’s models and inflict mortal wounds for successful results.')
      ]
    },
    'vanguard-spearhead': {
      id:'vanguard-spearhead', name:'Vanguard Spearhead', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Reconnaissance', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Shadow Masters',text:'Each time a ranged attack targets an Adeptus Astartes unit from your army, unless the attacking model is within 12 inches, the target has the benefit of cover.'}],
      enhancements:[
        {kind:'enhancement',name:'The Blade Driven Deep',text:'Infantry model only. The bearer’s unit gains Infiltrators.'},
        {kind:'enhancement',name:'Ghostweave Cloak',text:'The bearer gains Lone Operative and Stealth.'},
        {kind:'enhancement',name:'Execute and Redeploy',text:'After the bearer’s unit shoots, it can make a short Normal move and cannot charge that turn.'},
        {kind:'enhancement',name:'Shadow War Veteran',text:'Once per turn, when your opponent targets an Adeptus Astartes unit within 12 inches with a Stratagem, increase the CP cost of that use by 1.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('A Deadly Prize',1,'Command phase','During your Command phase.','One Adeptus Astartes Infantry or Mounted unit within 3 inches of an objective marker you control.','That objective remains under your control if you move away, and can damage enemy units that later move within 3 inches.'),
        stratagem('Calculated Feint',1,"Opponent’s Charge phase",'Just after an enemy unit declares a charge.','One Adeptus Astartes Infantry unit within 12 inches of that enemy unit.','Your unit can make a Normal move of up to D6 inches; Phobos and Scout units can move up to 6 inches instead.'),
        stratagem('Strike from the Shadows',1,'Shooting phase','When an Adeptus Astartes Infantry unit is selected to shoot.','That unit.','Improve its Ballistic Skill characteristic by 1 and add 1 to the Armour Penetration characteristic of its ranged weapons against targets more than 12 inches away.'),
        stratagem('Guerrilla Tactics',1,'End of opponent’s Fight phase','At the end of your opponent’s Fight phase.','Up to two Phobos or Scout units, or one other Adeptus Astartes Infantry unit.','Remove the selected units from the battlefield and place them into Strategic Reserves.'),
        stratagem('Surgical Strikes',2,'Fight phase','When an Adeptus Astartes Infantry unit is selected to fight.','That unit.','Its melee weapons gain Precision for the phase, allowing attacks to be allocated to visible Character models in Attached units.')
      ]
    },
    'first-company-task-force': {
      id:'first-company-task-force', name:'1st Company Task Force', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Priority Assets', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Extremis-level Threat',text:'Once per battle, in your Command phase, you can intensify your Oath of Moment. Until your next Command phase, attacks against your Oath target can also re-roll Wound rolls.'}],
      enhancements:[
        {kind:'enhancement',name:'The Imperium’s Sword',text:'After the bearer’s unit completes a Charge move, add 1 to the Attacks and Strength characteristics of the bearer’s melee weapons until the end of the turn.'},
        {kind:'enhancement',name:'Fear Made Manifest',text:'Enemy units within 6 inches of the bearer suffer penalties when taking Battle-shock tests, with a chance to lose models when they fail.'},
        {kind:'enhancement',name:'Iron Resolve',text:'The bearer has Feel No Pain 5+. Once per battle, when the bearer is destroyed before it has fought, it can fight before being removed.'},
        {kind:'enhancement',name:'Rites of War',text:'While the bearer leads a unit, add 1 to the Objective Control characteristic of models in that unit.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Heroes of the Chapter',1,'Fight phase','When an Adeptus Astartes unit is selected to fight.','That unit.','Add 1 to melee Hit rolls. If the unit has the Veteran keyword and targets your Oath of Moment target, also add 1 to Wound rolls.'),
        stratagem('Legendary Fortitude',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One Terminator, Bladeguard Veteran, Sternguard Veteran or Vanguard Veteran unit selected as a target.','Subtract 1 from the Damage characteristic of attacks allocated to that unit for the phase.'),
        stratagem('Duty and Honour',1,'Command phase','During your Command phase.','One Adeptus Astartes unit.','Add 1 to the Objective Control characteristic of models in that unit; one objective marker within 3 inches remains under your control after the unit moves away.'),
        stratagem('Orbital Teleportarium',1,'End of opponent’s Fight phase','At the end of your opponent’s Fight phase.','One Terminator unit.','Remove that unit from the battlefield and place it into Strategic Reserves; it can return using Deep Strike.'),
        stratagem('Terrifying Proficiency',1,'Fight phase','Just after an eligible Veteran unit destroys an enemy unit.','That Veteran unit.','Each enemy unit within 6 inches must take a Battle-shock test; subtract 1 from that test for units within 3 inches of the destroyed unit.')
      ]
    },

    'champions-of-fenris': {
      id:'champions-of-fenris', name:'Champions of Fenris', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Purge the Foe', dp:1, status:'ready', sourceType:'official-public-pack-summary',
      rules:[{kind:'detachment',name:'The Great Wolf Watches',text:'Friendly Adeptus Astartes Infantry Character units have Countercharge. Once per battle round for each such unit, you can target it with the Heroic Intervention Stratagem even if another unit has already been targeted with that Stratagem this phase; doing so does not prevent another use of Heroic Intervention that phase. Your army can include Space Wolves units, but no Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'A Giant Amongst Giants',points:15,text:'Adeptus Astartes Infantry model only. Add 2 to the bearer’s Wounds characteristic and add 1 to the Strength characteristic of the bearer’s melee weapons.'},
        {kind:'enhancement',name:'Preyslayer',points:15,text:'Adeptus Astartes Infantry model only. The bearer’s unit can re-roll Advance rolls and Countercharge rolls.'}
      ],
      stratagems:[
        stratagem('Wolf Totems',1,'Any phase','When a friendly Adeptus Astartes Infantry Character model suffers a mortal wound.','That model’s unit.','Models in that unit have Feel No Pain 5+ against mortal wounds for the phase.'),
        stratagem('Runes of Claiming',1,'End of Movement phase','At the end of your Movement phase.','One friendly Adeptus Astartes Infantry Character unit within 3 inches of an objective marker it controls.','That objective marker remains under your control until your opponent’s Level of Control over it is greater than yours at the end of a phase.'),
        stratagem('Stalk Between Worlds',1,"Opponent’s Shooting phase",'Just after an enemy unit selects its targets.','One friendly Adeptus Astartes Infantry Character unit selected as a target.','Models in that unit have Stealth until the end of the phase.')
      ]
    },
    'legends-of-saga-and-song': {
      id:'legends-of-saga-and-song', name:'Legends of Saga and Song', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Take and Hold', dp:1, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Loping Charge',text:'Friendly Adeptus Astartes Terminator units add 1 to Charge rolls. The army can include Space Wolves units but no units drawn from another Adeptus Astartes Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Fierce Example (Upgrade)',points:25,text:'Wolf Guard Terminators unit only. Add 1 to the Toughness characteristic of models in the bearer’s unit.'},
        {kind:'enhancement',name:'Thirst for Glory (Upgrade)',points:15,text:'Adeptus Astartes Terminator model only. Add 1 to the Objective Control characteristic of models in the bearer’s unit.'}
      ],
      stratagems:[
        stratagem('Fangs of the Pack',1,'Fight phase','When an eligible Terminator unit is selected to fight.','That Terminator unit.','Its melee weapons gain Precision until the end of the phase.'),
        stratagem('Chilling Howl',1,"Opponent’s Command phase",'During the opponent’s Command phase.','One enemy unit within 6 inches of an eligible Space Wolves Terminator unit.','That enemy unit takes a Battle-shock test, subtract 1 from the test if that enemy unit is Below Half-strength.'),
        stratagem('Wings of the Blizzard',1,"End of opponent’s Fight phase",'At the end of the opponent’s Fight phase.','One eligible unengaged Terminator unit.','Remove it from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'veterans-of-the-fang': {
      id:'veterans-of-the-fang', name:'Veterans of the Fang', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Disruption', dp:1, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Old Greymanes',text:'Grey Hunters remain eligible to shoot when they start an action. During Declare Battle Formations, one Grey Hunters unit can be split into two five-model units.'}],
      enhancements:[
        {kind:'enhancement',name:'Eye of the Hunter',text:'Wolf Guard Battle Leader only. The unit’s ranged attacks gain Assault and Ignores Cover, and add 1 to their Armour Penetration characteristic.'},
        {kind:'enhancement',name:'Weaver of Sagas',points:15,text:'Wolf Priest only. Once per battle round, remove Battle-shock from one friendly unit within 6 inches, or from one Grey Hunters unit within 18 inches.'}
      ],
      stratagems:[
        stratagem('Blade-keen Senses',1,'Shooting phase','At the start of your Shooting phase.','One friendly unengaged Grey Hunters unit.','Select one visible enemy unit within 12 inches; increase that enemy unit’s detection range by 6 inches until the end of the phase.'),
        stratagem('Icy Calm',1,'Movement phase','When a Grey Hunters unit is selected to Advance or Fall Back.','That Grey Hunters unit.','The move does not prevent it from being eligible to start an action.'),
        stratagem('Grizzled Killers',1,'Fight phase','When a Grey Hunters unit is selected to fight.','That Grey Hunters unit.','Choose Lethal Hits or Sustained Hits 1 for its melee weapons until the end of the phase.')
      ]
    },
    'saga-of-the-beastslayer': {
      id:'saga-of-the-beastslayer', name:'Saga of the Beastslayer', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Purge the Foe', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Legendary Slayers',text:'Attacks made by Adeptus Astartes models gain Lethal Hits against Character, Monster and Vehicle units. After the Saga is completed by destroying enough such units, Lethal Hits applies against all targets.'}],
      enhancements:[
        {kind:'enhancement',name:'Elder’s Guidance',text:'Once per battle, add 1 to the Armour Penetration characteristic of melee weapons in the bearer’s Blood Claws unit for one Fight phase.'},
        {kind:'enhancement',name:'Helm of the Beastslayer',text:'Reduce the Armour Penetration of attacks made by Character, Monster or Vehicle models against the bearer’s unit.'},
        {kind:'enhancement',name:'Hunter’s Guile',text:'After deployment, redeploy up to three eligible Thunderwolf Cavalry, Wulfen or Blood Claws units, including into Strategic Reserves.'},
        {kind:'enhancement',name:'Wolf-touched',text:'Add 2 inches to the bearer’s Move characteristic.'}
      ],
      stratagems:[
        stratagem('Unbridled Ferocity',1,'Fight phase','When a Space Wolves unit is selected to fight.','That unit.','Add 1 to Wound rolls for its attacks until the end of the phase.'),
        stratagem('Shock Cavalry',1,'Movement or Charge phase','When a Thunderwolf Cavalry unit is selected to move or charge.','That Thunderwolf Cavalry unit.','Its models can move through non-Titanic models and low terrain while resolving the move.'),
        stratagem('Pinning Fire',1,'Shooting phase','When an Adeptus Astartes unit is selected to shoot.','That unit.','After it shoots, one hit Character, Monster or Vehicle unit becomes pinned, reducing its Move and Charge rolls until your next Shooting phase.'),
        stratagem('Thunderous Pursuit',1,"Opponent’s Movement phase",'Just after an enemy unit within 9 inches ends a Normal, Advance or Fall Back move.','One eligible unengaged Adeptus Astartes unit.','It makes a Normal move of D6 inches, or 6 inches if it is Space Wolves Infantry or Thunderwolf Cavalry.'),
        stratagem('Impetuosity',1,"Opponent’s Shooting phase",'After an enemy unit shoots an eligible unengaged Wulfen Infantry or Blood Claws unit.','That targeted unit.','It makes a surge move of up to D6 inches.'),
        stratagem('Coordinated Strike',1,"End of opponent’s Fight phase",'At the end of the opponent’s Fight phase.','One Space Wolves unit wholly within 6 inches of a battlefield edge and not engaged.','Remove it and place it into Strategic Reserves.')
      ]
    },
    'saga-of-the-bold': {
      id:'saga-of-the-bold', name:'Saga of the Bold', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Priority Assets', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Heroes All',text:'Space Wolves Character units can re-roll one Hit, Wound or Damage roll when selected to shoot or fight. Complete three different Boasts to allow all Adeptus Astartes units to re-roll one Hit roll, one Wound roll and one Damage roll each time they are selected to shoot or fight.'}],
      enhancements:[
        {kind:'enhancement',name:'Braggart’s Steel',text:'Add 1 to the Strength characteristic of the bearer’s melee weapons; after its unit achieves a Boast, also add 1 to their Damage characteristic.'},
        {kind:'enhancement',name:'Hordeslayer',text:'While there are more enemy models than friendly models within 6 inches of the bearer, add 1 to the Attacks characteristic of its melee weapons; after its unit achieves a Boast, add 2 instead.'},
        {kind:'enhancement',name:'Skjald',text:'Gain 1CP when a Space Wolves Character unit achieves a Boast while the bearer is on the battlefield.'},
        {kind:'enhancement',name:'Thunderwolf’s Fortitude',text:'Once per battle, the destroyed bearer can return as close as possible to where it was destroyed, outside Engagement Range, with D3 wounds remaining.'}
      ],
      stratagems:[
        stratagem('Inspiring Presence',1,'Fight phase','When an Adeptus Astartes Character unit is selected to fight.','That Character unit.','Its melee weapons gain Lethal Hits until the end of the phase.'),
        stratagem('Champion’s Guidance',1,'Shooting or Fight phase','When a Space Wolves Character unit is selected to shoot or fight.','That Character unit.','Re-roll Hit rolls for its attacks until the end of the phase.'),
        stratagem('Birth of a Saga',1,'Command phase','During your Command phase.','One Wolf Guard Headtaker or Wolf Guard Terminator Pack Leader model.','That model gains the Character keyword until your next Command phase.'),
        stratagem('Alpha Strike',1,'Charge phase','During your Charge phase.','One Adeptus Astartes Character unit.','It remains eligible to declare a charge after Advancing.'),
        stratagem('Heroic Resolve',2,"Opponent’s Shooting phase",'Just after a Space Wolves Character unit is selected as a target.','That Character unit.','Subtract 1 from the Damage characteristic of attacks allocated to it for the phase.'),
        stratagem('Countercharge',2,"End of opponent’s Charge phase",'At the end of the opponent’s Charge phase.','One eligible Adeptus Astartes Character unit within 6 inches of one or more enemy units.','It declares and resolves a charge as though it were your Charge phase, without gaining a Charge bonus.')
      ]
    },
    'saga-of-the-hunter': {
      id:'saga-of-the-hunter', name:'Saga of the Hunter', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Disruption', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Pack’s Quarry',text:'Space Wolves melee attacks gain +1 to Hit when the target is engaged by another friendly unit or is outnumbered. After the Saga is completed by destroying enough enemy units in melee, those attacks also gain +1 to Wound.'}],
      enhancements:[
        {kind:'enhancement',name:'Fenrisian Grit',text:'The bearer gains Feel No Pain 4+.'},
        {kind:'enhancement',name:'Feral Rage',text:'Add 1 to the Attacks characteristic of the bearer’s melee weapons; after its unit completes a Charge move, add 2 instead until the end of the turn.'},
        {kind:'enhancement',name:'Swift Hunter',text:'Models in the bearer’s Space Wolves unit gain Scouts 7 inches.'},
        {kind:'enhancement',name:'Wolf Master',text:'In your Command phase, grant Lethal Hits to teeth and claws and Tyrnak and Fenrir weapons in one Space Wolves unit within 6 inches.'}
      ],
      stratagems:[
        stratagem('Envelop and Ensnare',1,'Fight phase','When an eligible Space Wolves unit is selected to fight.','That unit.','Its Pile-in and Consolidation moves can be up to 6 inches and need not move closer to the nearest model, provided they end as close as possible to the nearest enemy unit.'),
        stratagem('Territorial Advantage',1,'Fight phase','Just after an Adeptus Astartes unit destroys an enemy unit.','That victorious unit.','One objective it controls remains under your control until the opponent’s control level exceeds yours at the end of a phase.'),
        stratagem('Overwhelming Onslaught',1,'Fight phase','Just after an enemy unit selects targets.','Two Adeptus Astartes units engaging it, or one Space Wolves Beasts unit.','Subtract 1 from Hit rolls for attacks made by that enemy unit for the phase.'),
        stratagem('Chosen Prey',1,'Movement phase','Just after a Space Wolves unit Falls Back.','That Space Wolves unit.','It remains eligible to shoot and declare a charge that turn.'),
        stratagem('Bounding Advance',1,'Movement or Charge phase','When a Space Wolves Infantry or Beasts unit is selected to move or charge.','That unit.','Its models can move through non-Titanic models while resolving the move.'),
        stratagem('Marked for Destruction',1,'Shooting phase','During your Shooting phase.','Two Adeptus Astartes units that have not shot.','Select one enemy visible to both; those units can only target it and re-roll Wound rolls of 1 for the phase.')
      ]
    },
    'saga-of-the-great-wolf': {
      id:'saga-of-the-great-wolf', name:'Saga of the Great Wolf', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Take and Hold', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Master of Wolves',text:'At the start of your Command phase, activate one Hunting Pack for your army: re-roll Advance and Charge rolls, add 1 to ranged Hit rolls, or grant Lethal Hits or Sustained Hits 1 to melee weapons. Each pack is normally used once per battle; Logan Grimnar enables one repeat.'}],
      enhancements:[
        {kind:'enhancement',name:'Chariots of the Storm',text:'Add 2 inches to the Move characteristic of models in the bearer’s unit and add 1 to Charge rolls made for that unit.'},
        {kind:'enhancement',name:'Grimnar’s Mark',text:'Wolf Guard Terminator leader only. While the bearer leads a unit, add 1 to the Objective Control characteristic of models in that unit and re-roll Battle-shock tests made for it.'},
        {kind:'enhancement',name:'Howlmaw',text:'Enemy units within 6 inches of the bearer subtract 1 from Battle-shock tests; while within Engagement Range of the bearer’s unit, they also subtract 1 from Objective Control.'},
        {kind:'enhancement',name:'Skjald’s Foretelling',text:'Once per battle, after deployment, redeploy one friendly Adeptus Astartes unit or place it into Strategic Reserves, regardless of normal Strategic Reserves limits.'}
      ],
      stratagems:[
        stratagem('The Foe Foreseen',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against it by 1 for the phase.'),
        stratagem('Grimnar’s Command',1,'Command phase','During your Command phase.','One Adeptus Astartes unit.','Give that unit one Hunting Pack effect until your next Command phase, independently of the army-wide active pack.'),
        stratagem('Fenrisian Ferocity',1,'Movement or Charge phase','During your Movement or Charge phase.','One eligible Mounted or Walker unit.','It can move horizontally through non-Titanic models and terrain while resolving its move, but cannot finish an ordinary move within Engagement Range.'),
        stratagem('Unrelenting Hunters',1,'Movement phase','During your Movement phase.','One Adeptus Astartes unit that has not moved.','It can charge after Falling Back; if it is a Space Wolves unit, it can also charge after Advancing.'),
        stratagem('Eye of the Pack',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Add 1 to its Wound rolls for the phase.'),
        stratagem('Battle Instincts',1,"Opponent’s Shooting phase",'Just after an enemy unit finishes shooting.','One Space Wolves unit that was targeted.','It can make a Normal move of up to D6 inches.')
      ]
    },

    'legacy-of-grace': {
      id:'legacy-of-grace', name:'Legacy of Grace', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Priority Assets', dp:1, status:'ready', availability:'public-pack', sourceType:'concise-reference', tags:['grace'],
      rules:[{kind:'detachment',name:'Legacy of the Angel',text:'Friendly Blood Angels Infantry Character units, excluding Commander Dante units, add 1 to Advance rolls and add 1 to Charge rolls. This Detachment has the Grace tag and cannot be selected with another Grace Detachment.'}],
      enhancements:[
        {kind:'enhancement',name:'Aureole of the Angel',points:20,text:'Adeptus Astartes model only. Subtract 3 inches from the detection range of the bearer’s unit.'},
        {kind:'enhancement',name:'Blood Boil',points:10,text:'Adeptus Astartes Psyker model only. The bearer’s Psychic attacks gain Anti against non-Monster and non-Vehicle targets on 5+, and the bearer can re-roll Damage rolls for those Psychic attacks.'}
      ],
      stratagems:[
        stratagem('Aura of the Angel’s Grace',1,"Opponent’s Shooting phase",'When an enemy unit selects a friendly Adeptus Astartes Character unit as a target.','That Character unit.','Until the end of the phase, models in that unit have a 5+ invulnerable save.'),
        stratagem('Soul-darkened Fury',1,"Opponent’s Movement phase",'When an enemy unit engaged with a friendly Adeptus Astartes Character unit is selected to Fall Back.','That Adeptus Astartes Character unit.','The enemy unit must use Desperate Escape when it Falls Back. If that enemy unit is Battle-shocked, subtract 1 from its Desperate Escape tests.'),
        stratagem('Martial Paragon',1,'Shooting or Fight phase','When a friendly Adeptus Astartes Character unit is selected to attack.','That Adeptus Astartes Character unit.','Choose Lethal Hits or Sustained Hits 1; attacks made by that unit gain the selected ability until the end of the phase.')
      ]
    },
    'encarmine-speartip': {
      id:'encarmine-speartip', name:'Encarmine Speartip', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Disruption', dp:1, status:'ready', availability:'public-pack', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Wrath of Angels',text:'When a friendly Sanguinary Guard unit is selected to Fall Back, that move does not prevent that unit from being eligible to shoot or declare a charge later that turn.'}],
      enhancements:[
        {kind:'enhancement',name:'Angelic Executioner',points:25,text:'Adeptus Astartes Jump Pack model only. Each time the bearer’s unit is selected to fight, choose Lethal Hits or Sustained Hits 1; its melee attacks gain the selected ability until the end of the phase.'},
        {kind:'enhancement',name:'Shadow of Abomination',points:25,text:'Adeptus Astartes Jump Pack model only. Once per battle, when the bearer’s unit is selected to fight, add 1 to the Damage characteristic of the bearer’s melee weapons until the end of the phase.'}
      ],
      stratagems:[
        stratagem('Judgement of the Golden Host',1,'Charge phase','When a friendly Sanguinary Guard unit ends a Charge move.','That Sanguinary Guard unit.','Select one enemy unit engaged with it. Roll one D6 for each model in your unit engaged with that enemy unit; for each 3+, that enemy unit suffers 1 mortal wound.'),
        stratagem('Blinding Blurs of Vengeance',1,"Opponent’s Shooting phase",'When an enemy unit selects a friendly Sanguinary Guard unit as a target.','That Sanguinary Guard unit.','Until the end of the phase, models in that unit have Stealth.'),
        stratagem('Inexorable Valour',1,"Opponent’s Movement phase",'When an enemy unit that was engaged with a friendly Sanguinary Guard unit ends a Fall Back move and that Sanguinary Guard unit is unengaged.','That Sanguinary Guard unit.','That unit can make a Normal move of up to D3+3 inches.')
      ]
    },
    'wrath-of-the-doomed': {
      id:'wrath-of-the-doomed', name:'Wrath of the Doomed', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Purge the Foe', dp:1, status:'ready', availability:'public-pack', sourceType:'concise-reference', tags:['doomed'],
      rules:[{kind:'detachment',name:'Fanatical Celerity',text:'When a friendly Death Company unit is selected to Advance, you can have that unit suffer D3+1 mortal wounds. If you do, that Advance does not prevent it from declaring a charge later that turn. This Detachment has the Doomed tag and cannot be selected with another Doomed Detachment.'}],
      enhancements:[
        {kind:'enhancement',name:'Instinctive Interception',points:10,text:'Death Company model only. When the bearer’s unit is targeted with Heroic Intervention, reduce that use of the Stratagem by 1CP.'},
        {kind:'enhancement',name:"On the Archtraitor's Bridge",points:20,text:'Death Company model only. Add 2 to the Attacks characteristic of the bearer’s melee weapons.'}
      ],
      stratagems:[
        stratagem('No Barrier to Retribution',1,'Movement or Charge phase','When a friendly Death Company Dreadnought unit is selected to make a Normal, Advance or Charge move.','That Death Company Dreadnought unit.','That unit gains Mobile while resolving that move.'),
        stratagem('Rage-fuelled Response',1,"Opponent’s Shooting phase",'After an enemy unit that targeted a friendly unengaged Death Company unit has finished shooting.','That Death Company unit.','That unit can make a Surge move of up to D6 inches.'),
        stratagem('Death Begets Vengeance',1,'Any phase','When a friendly Death Company unit is destroyed by an enemy unit.','That enemy unit.','That enemy unit becomes hated until the end of the battle. Friendly Death Company units add 1 to Wound rolls for attacks that target a hated unit.')
      ]
    },
    'the-angelic-host': {
      id:'the-angelic-host', name:'The Angelic Host', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Disruption', dp:2, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Upon Wings of Fire',text:'At the end of your opponent’s turn, select eligible Adeptus Astartes Jump Pack units and place them into Strategic Reserves: up to 1 in Incursion, 2 in Strike Force or 3 in Onslaught. Those units must make an Ingress move in your next Movement phase, including during the first battle round.'}],
      enhancements:[
        {kind:'enhancement',name:'Archangel’s Shard',points:15,text:'Adeptus Astartes Jump Pack model only. The bearer’s melee weapons gain Anti-Chaos 5+ and Lance.'},
        {kind:'enhancement',name:'Artisan of War',points:20,text:'Adeptus Astartes Jump Pack model only. Change the Armour Penetration characteristic of the bearer’s weapons by 1 step in the more penetrating direction (for example, AP 0 becomes AP -1), and change the bearer’s Save characteristic to 2+.'},
        {kind:'enhancement',name:'Gleaming Pinions',points:25,text:'Adeptus Astartes Jump Pack model only. In your opponent’s Movement phase, when an enemy unit ends a move within 8 inches of the bearer’s unengaged unit, that unit can make a Normal move of up to 6 inches.'},
        {kind:'enhancement',name:'Visage of Death',points:15,text:'Adeptus Astartes Jump Pack model only. In the Battle-shock step of your opponent’s Command phase, each enemy non-Monster and non-Vehicle unit within Engagement Range of the bearer must take a Battle-shock test.'}
      ],
      stratagems:[
        stratagem('Unbridled Ardour',1,'Any phase','When one friendly Adeptus Astartes unit is destroyed.','That destroyed unit.','Until the end of the battle, friendly Sanguinary Guard units can re-roll Hit rolls and Wound rolls for attacks that target the enemy unit that destroyed your unit.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Angel’s Sacrifice',1,'Fight phase','At the start of the Fight phase.','One Adeptus Astartes Jump Pack unit.','Until the end of the phase, each enemy model within Engagement Range of that unit must select it as the target of all of that model’s attacks.'),
        stratagem('Martial Exemplars',1,'Fight phase','When one Adeptus Astartes Jump Pack unit is selected to fight.','That Jump Pack unit.','Until the end of the phase, its melee weapons gain Lethal Hits and Precision.'),
        stratagem('Descent of Angels',1,'Movement phase','When an Adeptus Astartes Jump Pack unit arrives using Deep Strike.','That Jump Pack unit.','Set that unit up more than 6 inches horizontally from all enemy models.','That unit cannot declare a charge in the same turn.'),
        stratagem('Death From The Skies',1,'Movement phase','Just after an Adeptus Astartes Jump Pack unit Advances or Falls Back.','That Jump Pack unit.','Until the end of the turn, that unit remains eligible to shoot and declare a charge.')
      ]
    },
    'the-lost-brethren': {
      id:'the-lost-brethren', name:'The Lost Brethren', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Purge the Foe', dp:2, status:'ready', sourceType:'concise-reference', tags:['doomed'],
      rules:[{kind:'detachment',name:'A Noble Death in Combat',text:'Death Company Marines and Death Company Marines with Bolt Rifles gain Battleline. Each time a Death Company model makes a melee attack, re-roll a Wound roll of 1 if its unit is below Starting Strength; if its unit is Below Half-strength, you can re-roll the Wound roll instead.'}],
      enhancements:[
        {kind:'enhancement',name:'Blood Shard',points:25,text:'Death Company model only. The first time the bearer is destroyed, roll one D6 at the end of the phase. On a 2+, return it as close as possible to where it was destroyed, unengaged, with 3 wounds remaining.'},
        {kind:'enhancement',name:'Sanguinius’ Grace',points:20,text:'Death Company model only. Once per battle, at the end of the Fight phase, if the bearer is within Engagement Range of at least 3 enemy models, the bearer can fight one additional time.'},
        {kind:'enhancement',name:'To Slay The Warmaster',points:15,text:'Death Company model only. Once per battle, at the start of the Fight phase, select one enemy Character unit within Engagement Range of the bearer and roll six D6; for each 4+, one Character model in that unit suffers 1 mortal wound.'},
        {kind:'enhancement',name:'Vengeful Onslaught',points:10,text:'Death Company model only. If the bearer is destroyed, until the end of your next turn, add 1 to Hit rolls made by friendly Death Company models.'}
      ],
      stratagems:[
        stratagem('Glorious Sacrifice',1,'Any phase','When a Death Company unit is destroyed while within 3 inches of an objective marker you controlled.','That destroyed Death Company unit.','That objective marker remains under your control until your opponent’s Level of Control over it is greater than yours at the end of a phase.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Final Retribution',1,'Fight phase','Just after an enemy unit selects a Death Company unit as a target.','That Death Company unit.','Until the end of the phase, each destroyed model that has not fought rolls one D6, adding 1 if the unit is within 12 inches of a friendly Chaplain. On a 4+, that model can fight before it is removed.'),
        stratagem('Furious Onslaught',1,'Fight phase','Just before a Death Company unit Piles In.','That Death Company unit.','Models in that unit can Pile In up to D3+3 inches instead of 3 inches. If the unit is within 12 inches of a friendly Chaplain or is below Starting Strength, it can Pile In up to 6 inches.'),
        stratagem('Lost to Rage',1,'Fight phase','When a Death Company unit that is below Starting Strength is selected to fight.','That Death Company unit.','Until the end of the phase, add 1 to the Attacks, Strength and Armour Penetration characteristics of its melee weapons. Unless the unit is within 12 inches of a friendly Chaplain, those melee weapons also gain Hazardous.'),
        stratagem('Wrathful Rampage',1,'Movement phase','Just after a Death Company unit Advances.','That Death Company unit.','Until the end of the turn, that unit can declare a charge. If it is within 12 inches of a friendly Chaplain or below Starting Strength, it can also shoot after Advancing.')
      ]
    },
    'angelic-inheritors': {
      id:'angelic-inheritors', name:'Angelic Inheritors', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Priority Assets', dp:3, status:'ready', sourceType:'concise-reference', tags:['grace'],
      rules:[{kind:'detachment',name:'Legacy of the Angel',text:'At the start of the first battle round, select two Angelic Legacy abilities for your Adeptus Astartes Character units: Sanguinary Grace lets them shoot and charge after Falling Back; Carmine Wrath lets them re-roll Hit rolls of 1 and Wound rolls of 1; Their Appointed Hour lets them re-roll Advance and Charge rolls.'}],
      enhancements:[
        {kind:'enhancement',name:'Blazing Icon',points:20,text:'Adeptus Astartes Infantry model only. Enemy units cannot use Fire Overwatch to shoot at the bearer’s unit.'},
        {kind:'enhancement',name:'Ordained Sacrifice',points:25,text:'Adeptus Astartes model only. The first time the bearer is destroyed, roll one D6 at the end of the phase. On a 2+, return it unengaged, as close as possible to where it was destroyed, with 3 wounds remaining as a one-model unit.'},
        {kind:'enhancement',name:'Prescient Flash',points:20,text:'Adeptus Astartes model only. Models in the bearer’s unit gain Scouts 6 inches.'},
        {kind:'enhancement',name:'Troubling Visions',points:15,text:'Adeptus Astartes model only. Once per battle in your Command phase, all three Angelic Legacy abilities are active for the bearer’s unit until the start of your next Command phase.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Focused Fury',1,'Fight phase','When an Adeptus Astartes unit is selected to fight.','That unit.','Until the end of the phase, its melee weapons gain Lethal Hits. If that unit is a Character unit, those weapons also gain Lance.'),
        stratagem('Instant of Grace',1,'Command phase','During your Command phase.','One Adeptus Astartes Infantry unit.','Select one non-Character model in that unit. Until the start of your next Command phase, that model gains the Character keyword.'),
        stratagem('Strike Now For Glory',1,'Shooting phase','When an Adeptus Astartes unit is selected to shoot.','That unit.','Until the end of the phase, its ranged weapons gain Sustained Hits 1.'),
        stratagem('In The Shadow Of Great Wings',1,"Opponent’s Shooting phase",'Just after an enemy unit selects a friendly Adeptus Astartes Character unit as a target.','That Character unit.','Until the end of the phase, that unit can only be selected as the target of a ranged attack if the attacking model is within 18 inches.'),
        stratagem('Unto The Burning Skies',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One Adeptus Astartes Jump Pack unit that is not within Engagement Range, unless it is The Sanguinor.','Remove that unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'liberator-assault-group': {
      id:'liberator-assault-group', name:'Liberator Assault Group', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Take and Hold', dp:3, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'The Red Thirst',text:'Each time an Adeptus Astartes unit that made a Charge move this turn is selected to fight, until the end of the phase add 1 to the Attacks characteristic and add 2 to the Strength characteristic of melee weapons equipped by models in that unit.'}],
      enhancements:[
        {kind:'enhancement',name:'Gift of Foresight',points:15,text:'Adeptus Astartes model only. Once per battle round, after making one Hit roll, Wound roll or saving throw for the bearer, treat that result as an unmodified 6.'},
        {kind:'enhancement',name:'Icon of the Angel',points:20,text:'Adeptus Astartes model only. When an enemy non-Monster and non-Vehicle unit within Engagement Range of the bearer’s unit Falls Back, its models take Desperate Escape tests as if Battle-shocked. If that enemy unit is also Battle-shocked, subtract 1 from those tests.'},
        {kind:'enhancement',name:'Rage-fuelled Warrior',points:35,text:'Adeptus Astartes model only. Once per battle, at the start of the Fight phase, the bearer’s melee weapons gain Sustained Hits 3 until the end of the phase.'},
        {kind:'enhancement',name:'Speed of the Primarch',points:25,text:'Adeptus Astartes model only. Once per battle, at the start of the Fight phase, models in the bearer’s unit gain Fights First until the end of the phase.'}
      ],
      stratagems:[
        stratagem('Angelic Grace',1,'Any phase','Just after a friendly Adeptus Astartes unit has a mortal wound allocated to it.','That Adeptus Astartes unit.','Until the end of the phase, models in that unit have Feel No Pain 5+ against mortal wounds.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Savage Echoes',1,"Opponent’s Charge phase",'When an Adeptus Astartes unit is charged by an enemy unit.','That Adeptus Astartes unit.','Choose Strength or Attacks and add 1 to that characteristic for its melee weapons until the end of the turn. Alternatively, make the unit Battle-shocked and add 1 to both Strength and Attacks.'),
        stratagem('Red Rampage',1,'Fight phase','When an Adeptus Astartes unit is selected to fight.','That unit.','Choose Lance or Lethal Hits; its melee weapons gain that ability until the end of the phase. Alternatively, make the unit Battle-shocked and give its melee weapons both Lance and Lethal Hits.'),
        stratagem('Aggressive Onslaught',1,'Movement phase','Just after an Adeptus Astartes unit Advances.','That unit.','Until the end of the turn, it remains eligible either to shoot or declare a charge. Alternatively, make it Battle-shocked and it remains eligible to both shoot and declare a charge.'),
        stratagem('Relentless Assault',1,'Movement phase','Just after an Adeptus Astartes unit Falls Back.','That unit.','Until the end of the turn, it remains eligible either to shoot or declare a charge. Alternatively, make it Battle-shocked and it remains eligible to both shoot and declare a charge.')
      ]
    },
    'rage-cursed-onslaught': {
      id:'rage-cursed-onslaught', name:'Rage-cursed Onslaught', faction:'Blood Angels', chapters:['blood-angels'],
      disposition:'Purge the Foe', dp:3, status:'ready', sourceType:'concise-reference', tags:['doomed'],
      rules:[{kind:'detachment',name:'Maddened Ferocity',text:'Each time an Adeptus Astartes model makes a melee attack, re-roll a Wound roll of 1. When an Adeptus Astartes unit that made a Charge move this turn is selected to fight, add 1 to the Attacks characteristic of its melee weapons until the end of the phase; if that unit is Battle-shocked, add 2 instead.'}],
      enhancements:[
        {kind:'enhancement',name:'Angel’s Fang',points:25,text:'Adeptus Astartes model only. The bearer’s melee attacks gain Sustained Hits 2 when they target Character, Monster or Vehicle units.'},
        {kind:'enhancement',name:'Carmine Reliquary',points:30,text:'Chaplain model only. Models in the bearer’s unit gain Scouts 6 inches. Each time an Adeptus Astartes unit within 6 inches of the bearer takes a Battle-shock test, you can re-roll the result.'},
        {kind:'enhancement',name:'Master of the Red Thirst',points:25,text:'Adeptus Astartes model only. Once per battle, at the start of the Fight phase, models in the bearer’s unit gain Fights First until the end of the phase.'},
        {kind:'enhancement',name:'Sanguinary Tear',points:35,text:'Adeptus Astartes model only. While a friendly Death Company unit is within 6 inches of the bearer, add 1 to the Strength characteristic of weapons equipped by models in that unit.'}
      ],
      stratagems:[
        stratagem('A Grim Warning',1,'Any phase','When a Blood Angels unit is destroyed while within 3 inches of an objective marker you controlled at the end of the previous phase.','That destroyed Blood Angels unit.','That objective marker remains under your control until your opponent’s Level of Control over it is greater than yours at the end of a phase.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Insensate Rampage',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects a Death Company unit as a target.','That Death Company unit.','Until the end of the phase, models in that unit have Feel No Pain 5+.'),
        stratagem('Limb from Limb',1,'Fight phase','When an Adeptus Astartes unit that made a Charge move this turn is selected to fight.','That unit.','Choose Strength or Armour Penetration and add 1 to that characteristic for its melee weapons until the end of the phase. Alternatively, make the unit Battle-shocked and add 1 to both Strength and Armour Penetration.'),
        stratagem('Deathless Duty',2,'Fight phase','Just after an enemy unit selects a Death Company unit as a target.','That Death Company unit.','Until the end of the phase, each destroyed model that has not fought can fight after the attacking unit finishes its attacks, then that model is removed.'),
        stratagem('Red Wrath',1,'Movement phase','Just after an Adeptus Astartes unit Advances.','That unit.','Until the end of the turn, it remains eligible either to shoot or declare a charge. Alternatively, make it Battle-shocked and it remains eligible to both shoot and declare a charge.')
      ]
    },


    // Black Templars -------------------------------------------------------
    // New Recruit remains authoritative for selected roster composition,
    // Detachment Rules, attachments and wargear. These entries provide
    // concise printable reference data that ROSZ does not always include.
    'marshals-household': {
      id:'marshals-household', name:"Marshal's Household", faction:'Black Templars', chapters:['black-templars'],
      disposition:'Priority Assets', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Faith-Fuelled Resolve',text:'Friendly Sword Brethren Squad units have +1 Objective Control. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Fervent Exemplars (Upgrade)',points:10,text:'Sword Brethren Squad unit only. Add 1 to Charge rolls made for this unit.'},
        {kind:'enhancement',name:'Inheritors of Sigismund (Upgrade)',points:15,text:'Sword Brethren Squad unit only. This unit has Fights First.'}
      ],
      stratagems:[
        stratagem('Blade of Detestation',1,'Charge phase','When a friendly Sword Brethren Squad unit ends a Charge move.','That Sword Brethren Squad unit.','Select one engaged enemy unit. Roll one D6 for each model in your unit engaged with it; each 4+ inflicts 1 mortal wound, to a maximum of 6 mortal wounds.'),
        stratagem('Slayers of Abominations',1,'Fight phase','When a friendly Sword Brethren Squad unit is selected to fight.','That Sword Brethren Squad unit.','Until the end of the phase, its melee attacks that target a Monster or Vehicle unit have +2 Strength.'),
        stratagem('Unsparing Execution',1,"Opponent’s Movement phase",'When an enemy unit engaged with a friendly Sword Brethren Squad unit is selected to Fall Back.','That Sword Brethren Squad unit.','The enemy unit must use the Desperate Escape mode. If that enemy unit is Battle-shocked, subtract 1 from its Hazard rolls.')
      ]
    },
    'the-living-miracle': {
      id:'the-living-miracle', name:'The Living Miracle', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Disruption', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Anointed Champion',text:'When a friendly Emperor’s Champion unit is selected to fight, that model can re-roll one Hit roll and one Wound roll for its melee attacks. Enhancements selected from this detachment do not count towards the total number of Enhancements in your army. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Guiding Omens',points:15,text:'Emperor’s Champion model only. At the start of the first battle round, select up to three listed omen abilities for this model for the battle; the imported New Recruit enhancement remains authoritative for the chosen options and their full text.'}
      ],
      stratagems:[]
    },
    'wrathful-procession': {
      id:'wrathful-procession', name:'Wrathful Procession', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Take and Hold', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Chant of Deathless Devotion',text:'Friendly Chaplain units have a 5+ invulnerable save against ranged attacks. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Adaptable Executioner',points:20,text:'Execrator model only. When this unit is selected to fight, choose Cleave 1 or Precision for this model’s melee attacks.'},
        {kind:'enhancement',name:'Benediction of Fury',points:15,text:'Chaplain model only. This model’s melee attacks have Devastating Wounds.'}
      ],
      stratagems:[
        stratagem('Castigate the Demagogues',1,'Fight phase','When a friendly Chaplain unit is selected to fight.','That Chaplain unit.','Until the end of the phase, its melee attacks have Precision.'),
        stratagem('Fuelled By Faith',1,'Any phase','When a friendly Chaplain unit suffers a mortal wound.','That Chaplain unit.','Until the end of the phase, that unit has Feel No Pain 4+ against mortal wounds.'),
        stratagem('Rite of Perfervid Wrath',1,'Fight phase','When a friendly Chaplain unit is selected to fight.','That Chaplain unit.','Until the end of the phase, its melee attacks have +1 Strength.')
      ]
    },
    'companions-of-vehemence': {
      id:'companions-of-vehemence', name:'Companions of Vehemence', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Purge the Foe', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Righteous Fervour',text:'Re-roll Advance and Charge rolls made for Adeptus Astartes units from your army. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Incendiary Animus',points:25,text:'Chaplain or Judiciar model only. Improve the Armour Penetration characteristic of melee weapons equipped by models in the bearer’s unit by 1.'},
        {kind:'enhancement',name:'Merciless Denunciation',points:25,text:'Chaplain or Judiciar model only. Each time a model in the bearer’s unit makes a melee attack, you can re-roll the Hit roll.'},
        {kind:'enhancement',name:'Oathbound Exemplar',points:15,text:'Adeptus Astartes Infantry model only. Add 1 to Advance rolls made for the bearer’s unit. If the mission uses Actions, that unit can start an Action in a turn in which it Advanced.'},
        {kind:'enhancement',name:'Zealous Vanguard',points:20,text:'Adeptus Astartes model only. Models in the bearer’s unit have Scouts 6 inches.'}
      ],
      stratagems:[
        stratagem('Devout Push',1,'Fight phase','During the Fight phase.','One Adeptus Astartes Infantry unit that has not been selected to fight this phase.','Until the end of the phase, each model in the unit can move up to 6 inches when it Piles In or Consolidates instead of up to 3 inches.','A unit cannot be targeted with this and Hearts Hardened to Duty in the same phase unless it has Chaplain or Judiciar.'),
        stratagem('Hearts Hardened to Duty',1,'Fight phase','Just before an Adeptus Astartes Infantry unit Consolidates.','That Adeptus Astartes Infantry unit.','Until the end of the phase, its models do not need to end Consolidation moves closer to the closest enemy model or unit.'),
        stratagem('For The Emperor’s Honour!',1,'Fight phase','During the Fight phase.','One Adeptus Astartes Infantry unit that has not been selected to fight this phase.','Until the end of the phase, melee weapons equipped by models in that unit have Precision.'),
        stratagem('Pious Enmity',1,'Fight phase','During the Fight phase.','One Chaplain or Judiciar unit that has not been selected to fight this phase.','Until the end of the phase, re-roll Hit rolls of 1 for its melee attacks. If the target is a Monster or Vehicle, also re-roll Wound rolls of 1.'),
        stratagem('Heresy Begets Retribution',1,"Opponent’s Movement phase",'Just after an enemy unit ends a Normal, Advance or Fall Back move.','One Chaplain or Judiciar unit within 8 inches of that enemy unit and not within Engagement Range.','That unit can make a Surge move of up to D6 inches.'),
        stratagem('Dread Crusaders',1,"Opponent’s Charge phase",'Just after an enemy unit declares a charge.','One Adeptus Astartes Infantry unit selected as a target of that charge.','That enemy unit must take a Battle-shock test, subtracting 1 from the result.')
      ]
    },
    'godhammer-assault-force': {
      id:'godhammer-assault-force', name:'Godhammer Assault Force', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Purge the Foe', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Shock and Awe',text:'When an Adeptus Astartes unit declares a charge after disembarking from a Transport this turn, select one charge target; it must take a Battle-shock test. Each time a model in an Adeptus Astartes unit makes a melee attack after disembarking from a Transport this turn, add 1 to the Hit roll.'}],
      enhancements:[
        {kind:'enhancement',name:'Augury Servo-Host',points:15,text:'Adeptus Astartes model only. At the start of your Shooting phase, select one visible enemy unit within 12 inches of the bearer; until the end of the phase, models in that unit cannot have the Benefit of Cover.'},
        {kind:'enhancement',name:'Battle-Psalm Precentor',points:10,text:'Adeptus Astartes model only. When the bearer’s unit declares a charge and an enemy takes a Battle-shock test because of Shock and Awe, subtract 1 from that test.'},
        {kind:'enhancement',name:'Herald of Sacred Slaughter',points:15,text:'Adeptus Astartes model only. If the bearer starts the battle embarked within a Dedicated Transport, that Dedicated Transport has Scouts 9 inches.'},
        {kind:'enhancement',name:'Paragon of Fury',points:25,text:'Adeptus Astartes model only. Add 2 to the Strength characteristic of the bearer’s melee weapons. If the bearer disembarked from a Transport this turn, add 1 to the Damage characteristic of its melee attacks.'}
      ],
      stratagems:[
        stratagem('A Ceaseless Cause',1,'End of Fight phase','At the end of the Fight phase.','One Adeptus Astartes Infantry unit that was eligible to fight this phase.','If that unit is not within Engagement Range, it can make a Normal move of up to 6 inches.','It cannot embark within a Transport at the end of this move if it disembarked from a Transport this turn.'),
        stratagem('Uncompromising Egress',1,'Movement phase','During your Movement phase.','One Land Raider model that has not been selected to move this phase.','One Adeptus Astartes unit embarked within it can disembark and be set up wholly within 6 inches of the Land Raider, including within Engagement Range of enemy units.'),
        stratagem('Gauntlet of The God-Emperor',1,'Movement phase','During your Movement phase.','One Adeptus Astartes Vehicle model that has not been selected to move this phase.','Until the end of the phase, when it makes a Normal or Advance move it can move horizontally through terrain features.'),
        stratagem('Focused Hatred',1,'Charge phase','Just after you make a Charge roll for an Adeptus Astartes unit that disembarked from a Transport this turn.','That Adeptus Astartes unit.','Until the end of the phase, when the unit makes a Charge move, its models can move through models, but can only end within Engagement Range of units it declared a charge against.'),
        stratagem('Condemnatory Info-Screed',1,'Fight phase','During your Fight phase.','One Adeptus Astartes unit that has not been selected to fight this phase.','Until the end of the phase, if a model disembarked from a Transport this turn, re-roll Wound rolls of 1 for its attacks; if that Transport has the Land Raider keyword, re-roll the Wound roll instead.'),
        stratagem('Blessed Hull',2,"Opponent’s Shooting phase",'Just after an enemy unit has selected its targets.','One Adeptus Astartes Vehicle unit selected as a target of one or more attacks.','Until the end of the phase, each time an attack is allocated to a model in that unit, subtract 1 from the Damage characteristic of that attack.')
      ]
    },
    'vindication-task-force': {
      id:'vindication-task-force', name:'Vindication Task Force', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Priority Assets', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Purge and Sanctify',text:'When an attack targets an Ancient unit within range of one or more objective markers and that attack’s Strength is greater than the unit’s Toughness, subtract 1 from the Wound roll. When a friendly Crusader Squad makes a Surge move, it can move towards the closest objective instead of selecting a normal Surge target.'}],
      enhancements:[
        {kind:'enhancement',name:'Consecrating Aura',points:25,text:'Adeptus Astartes model only. Models in the bearer’s unit have a 5+ invulnerable save.'},
        {kind:'enhancement',name:'Imperialis of the Eternal Crusade',points:15,text:'Ancient model only. When an enemy unit selects the bearer’s unit as a charge target, subtract 2 from that Charge roll; this is not cumulative with other negative Charge modifiers.'},
        {kind:'enhancement',name:'Orb of the Emperor’s Aegis',points:10,text:'Adeptus Astartes model only. Models in the bearer’s unit have Deep Strike.'},
        {kind:'enhancement',name:'Warden of Honour',points:20,text:'Crusade Ancient model only. While the bearer is leading a unit, add 1 to D6 rolls made for its Vengeful Exhortation ability.'}
      ],
      stratagems:[
        stratagem('Refusal to Yield',1,'Any phase','Just after an Ancient model from your army is destroyed.','That Ancient model, even though it was just destroyed.','At the end of the phase, set the model back up as close as possible to where it was destroyed, unengaged, with its full wounds remaining.','The same model cannot be targeted with this Stratagem more than once per battle.'),
        stratagem('Litanies of Purgation',1,'Fight phase','During the Fight phase.','One Adeptus Astartes unit that has not been selected to fight this phase.','Until the end of the phase, improve the Armour Penetration characteristic of an attack by 1 if the attacking unit or target unit is within range of one or more objective markers.'),
        stratagem('Spoor of the Unholy',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes unit that has not been selected to shoot or fight this phase.','Until the end of the phase, its ranged weapons have Ignores Cover and its models can ignore modifiers to Ballistic Skill, Weapon Skill and Hit rolls.'),
        stratagem('Reclaim Our Honour!',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit destroys an Ancient model that has not been targeted with Refusal to Yield this phase.','One Adeptus Astartes unit visible to that enemy unit.','Until the end of the battle, each time an Adeptus Astartes model from your army attacks that enemy unit, add 1 to the Hit roll.','You cannot target that Ancient model with Refusal to Yield this phase.'),
        stratagem('Recitation of the Revered',1,"Opponent’s Shooting phase",'Just after an enemy unit has selected its targets.','One Ancient unit selected as a target of one or more attacks.','Until the end of the phase, subtract 1 from Hit rolls for attacks that target that unit.'),
        stratagem('Perfervid Intervention',2,"End of opponent’s Charge phase",'At the end of your opponent’s Charge phase.','One Adeptus Astartes unit within 6 inches of one or more enemy units that would be eligible to declare a charge against them.','That unit now declares and resolves a charge that only targets one or more of those enemy units.','Even if successful, the unit does not receive a Charge bonus this turn.')
      ]
    },

    // Dark Angels ---------------------------------------------------------
    // New Recruit remains authoritative for the selected Detachment Rule.
    // These entries provide the current compact printable reference for
    // Enhancements and Stratagems when the ROSZ roster does not include them.
    'dark-age-arsenal': {
      id:'dark-age-arsenal', name:'Dark Age Arsenal', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Priority Assets', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Invocations of Ancient Fury',text:'Plasma weapon profiles used by friendly Adeptus Astartes units gain +1 Strength. The army can include Dark Angels units, but cannot include Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Entreaty of Perpetual Ardour (Upgrade)',points:15,text:'Hellblaster Squad only. Its snap shooting attacks hit on unmodified Hit rolls of 5+.'},
        {kind:'enhancement',name:'Petition of Stability (Upgrade)',points:15,text:'Adeptus Astartes unit only. Add 6 inches to the Range characteristic of its plasma attacks.'}
      ],
      stratagems:[
        stratagem('Searing Bursts',1,'Shooting phase','After a friendly Hellblaster Squad has shot.','That Hellblaster Squad.','Select one enemy unit hit by its plasma ranged attacks. Until the start of your next turn, subtract 2 inches from that enemy unit’s Move characteristic.'),
        stratagem('No Sacrifice Too Great',1,'Shooting phase','When a friendly Adeptus Astartes unit is selected to shoot.','That Adeptus Astartes unit.','Until the end of the phase, add 1 to the Strength characteristic of its Hazardous plasma ranged attacks.'),
        stratagem('Revelation of Guilt',1,'Shooting phase','When a friendly Adeptus Astartes unit is selected to shoot.','That Adeptus Astartes unit.','Until the end of the phase, add 1 to Hit rolls for its plasma ranged attacks.')
      ]
    },
    'darkflight-pursuit': {
      id:'darkflight-pursuit', name:'Darkflight Pursuit', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Reconnaissance', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Black-winged Vigilance',text:'Ranged attacks made by friendly Ravenwing Fly units have Ignores Cover. The army can include Dark Angels units, but cannot include Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Nightforged Battery (Upgrade)',points:15,text:'Land Speeder Vengeance only. Re-roll rolls that determine a weapon’s Attacks characteristic and re-roll Hazard rolls for this unit.'},
        {kind:'enhancement',name:'Thundercowl Turbines (Upgrade)',points:15,text:'Ravenwing Fly unit only. In your first Movement phase, this unit can make an ingress move.'}
      ],
      stratagems:[
        stratagem('Wings of Shadow',1,"Opponent’s Shooting phase",'When an enemy unit targets a friendly Ravenwing Fly unit.','That Ravenwing Fly unit.','Until the end of the phase, that unit has Stealth.'),
        stratagem('Skyborne Surveillance',1,'Shooting phase','After a friendly Ravenwing Fly unit has shot.','That Ravenwing Fly unit.','Until the end of the phase, visible enemy units within 6 inches of it have +3 inches Detection Range.'),
        stratagem('We Are Vengeance',1,"Opponent’s Shooting phase",'After an enemy unit that targeted a friendly unengaged Ravenwing Fly unit has shot.','That Ravenwing Fly unit.','That unit can make a Normal move of up to D3+3 inches.')
      ]
    },
    'interrogation-conclave': {
      id:'interrogation-conclave', name:'Interrogation Conclave', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Take and Hold', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Dread Catechism',text:'In the Fight phase, when a friendly Chaplain unit destroys an enemy unit, enemy units within 6 inches of that Chaplain make a Battle-shock roll. Enemy units within 6 inches of a friendly Chaplain also have -1 Leadership. The army can include Dark Angels units, but cannot include Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Inescapable Interrogation',points:20,text:'Chaplain model only. Ranged attacks made by the bearer’s unit have Ignores Cover.'},
        {kind:'enhancement',name:'Limitless Zeal',points:10,text:'Chaplain model only. Add 1 to Charge rolls made for the bearer’s unit.'}
      ],
      stratagems:[
        stratagem('Terrifying Zeal',1,'Charge phase','When a friendly Chaplain unit ends a Charge move.','That Chaplain unit.','Select one engaged enemy unit other than a Monster or Vehicle. It makes a Leadership roll; if that roll fails, subtract 1 from Hit rolls for its attacks until the end of the turn.'),
        stratagem('Exacting Punishment',1,'Shooting or Fight phase','When a friendly Chaplain unit is selected to attack.','That Chaplain unit.','Until the end of the phase, its attacks have Precision.'),
        stratagem('Wages of Cowardice',1,"Opponent’s Movement phase",'When an enemy unit that was engaged with a friendly Chaplain ends a Fall Back move and that Chaplain is now unengaged.','That Chaplain unit.','That unit can make a Normal move of up to D3+3 inches.')
      ]
    },
    'company-of-hunters': {
      id:'company-of-hunters', name:'Company of Hunters', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Disruption', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Masters of Manoeuvre',text:'Friendly Adeptus Astartes units can shoot after Falling Back and their ranged attacks have Assault. Friendly Adeptus Astartes Mounted units can also declare a charge after Advancing or Falling Back. Outrider Squad units gain Battleline.'}],
      enhancements:[
        {kind:'enhancement',name:'Master of Manoeuvre',points:15,text:'Ravenwing model only. If the bearer’s unit starts in Strategic Reserves, it does not count toward the Strategic Reserves points limit and treats the battle round as one higher when arriving.'},
        {kind:'enhancement',name:'Master-crafted Weapon',points:10,text:'Ravenwing model only. Melee weapons equipped by the bearer have Precision.'},
        {kind:'enhancement',name:'Mounted Strategist',points:30,text:'Ravenwing model only. Re-roll Advance and Charge rolls made for the bearer’s unit.'},
        {kind:'enhancement',name:'Recon Hunter',points:20,text:'Ravenwing model only. Models in the bearer’s unit have Scouts 9 inches.'}
      ],
      stratagems:[
        stratagem('Hunter’s Trail',1,'Command phase','During the Command phase.','One Ravenwing Mounted unit within range of an objective marker you control.','That objective remains under your control until your opponent’s Level of Control over it is greater than yours at the end of a phase.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Talon Strike',1,'Fight phase','When a friendly Adeptus Astartes unit is selected to fight.','That Adeptus Astartes unit.','Until the end of the phase, its melee attacks have Lance.'),
        stratagem('Death on the Wind',1,'Movement phase','When a friendly Adeptus Astartes unit ends an Advance move.','That Adeptus Astartes unit.','That Advance move does not prevent the unit from being eligible to declare a charge this turn.'),
        stratagem('High-speed Focus',1,"Opponent’s Shooting phase",'Just after an enemy unit selects a Ravenwing unit as a target.','That Ravenwing unit.','Until the end of the phase, subtract 1 from Hit rolls for attacks that target that unit.'),
        stratagem('Rapid Reappraisal',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One Ravenwing unit that is not within Engagement Range.','Remove that unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'inner-circle-task-force': {
      id:'inner-circle-task-force', name:'Inner Circle Task Force', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Priority Assets', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Vowed Target',text:'At the start of your Movement phase, choose a Defensive Footing objective you control or one or more Aggressive Push objectives you do not control as Vowed objectives until your next Movement phase. Deathwing Infantry units add 1 to Wound rolls when attacking units within range of a Vowed objective.'}],
      enhancements:[
        {kind:'enhancement',name:'Champion of the Deathwing',points:15,text:'Deathwing model only. The bearer’s melee weapons have Lethal Hits; while within range of a Vowed objective, unmodified Hit rolls of 5+ are Critical Hits.'},
        {kind:'enhancement',name:'Deathwing Assault',points:30,text:'Deathwing model with Deep Strike only. The bearer’s unit can arrive using Deep Strike in the first, second or third Movement phase regardless of mission rules.'},
        {kind:'enhancement',name:'Eye of the Unseen',points:10,text:'Deathwing model only. Each time you target the bearer’s unit with a Stratagem, roll one D6, adding 1 within range of a Vowed objective; on 5+, gain 1CP.'},
        {kind:'enhancement',name:'Singular Will',points:20,text:'Deathwing model only. When the bearer’s unit Piles In or Consolidates, its models can move an additional 3 inches.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Martial Mastery',1,'Fight phase','When a Deathwing Infantry unit that has not fought is selected.','That Deathwing Infantry unit.','Until the end of the phase, re-roll Wound rolls of 1. If the unit is within range of a Vowed objective, re-roll all Wound rolls instead.'),
        stratagem('Duty Unto Death',1,'Fight phase','Just after an enemy unit selects a Deathwing unit as a target.','That Deathwing unit.','Until the end of the phase, when an unfought model in the unit is destroyed, roll D6, adding 1 within range of a Vowed objective. On 4+, it can fight after the attacking unit finishes, then is removed.'),
        stratagem('Relic Teleportarium',1,'Movement phase','When a Deathwing unit is arriving using Deep Strike.','That Deathwing unit.','Set the unit up more than 6 inches horizontally from all enemy models.','That unit cannot declare a charge this turn.'),
        stratagem('Wrath of the Lion',1,'Charge phase','Just after a Deathwing Infantry unit ends a Charge move.','That Deathwing Infantry unit.','Select one engaged enemy unit and roll D6 for each model in your unit, adding 1 to each roll if the enemy is within range of a Vowed objective. Each 4+ causes 1 mortal wound, to a maximum of 3.'),
        stratagem('Unmatched Fortitude',1,"Opponent’s Shooting phase",'Just after an enemy unit selects a Deathwing Infantry unit as a target.','That Deathwing Infantry unit.','Until the end of the phase, if an attack’s Strength is greater than the unit’s Toughness, subtract 1 from that attack’s Wound roll.')
      ]
    },
    'lions-blade-task-force': {
      id:'lions-blade-task-force', name:"Lion's Blade Task Force", faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Purge the Foe', dp:2, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:"In the Lion's Claws",text:'Enemy non-Monster/non-Vehicle units Falling Back while within Engagement Range of Ravenwing units take Desperate Escape tests, with -1 to those tests if Battle-shocked. Deathwing units add 2 to Charge rolls when a target is engaged by a friendly Ravenwing unit.'}],
      enhancements:[
        {kind:'enhancement',name:'Calibanite Armaments',points:15,text:'Adeptus Astartes model only. Add 1 to the Damage characteristic of the bearer’s melee weapons.'},
        {kind:'enhancement',name:'Fulgus Magna',points:20,text:'Deathwing model only. Once per battle at the end of your opponent’s turn, if unengaged, remove the bearer’s unit and place it into Strategic Reserves.'},
        {kind:'enhancement',name:'Lord of the Hunt',points:15,text:'Ravenwing model only. The bearer’s unit can shoot and charge after Falling Back, and can re-roll Desperate Escape tests.'},
        {kind:'enhancement',name:'Stalwart Champion',points:15,text:'Captain, Chaplain or Lieutenant only. While the bearer’s unit is not Battle-shocked, add 1 to the Objective Control characteristic of its models.'}
      ],
      stratagems:[
        stratagem('Overpowering Exaction',1,'Command or Fight phase','During your Command phase or at the start of the Fight phase.','One Adeptus Astartes unit.','Select one enemy unit within Engagement Range. It takes a Battle-shock test; if your unit is Deathwing or Ravenwing, subtract 1 from that test.','Once per battle round.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Strength in Unity',1,'Fight phase','Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','If the attacking enemy is engaged with Ravenwing, subtract 1 from its Hit rolls. If it is engaged with Deathwing and its attack Strength exceeds the target’s Toughness, subtract 1 from its Wound rolls.','A unit cannot be targeted by this and Armour of Contempt in the same phase.'),
        stratagem('Knights of Iron',1,'Movement or Charge phase','During your Movement phase or Charge phase.','One Ravenwing unit.','Until the end of the phase, models in that unit can move horizontally through terrain features while making Normal, Advance or Charge moves.'),
        stratagem('Illuminating Fire',1,'Shooting phase','Just after a Ravenwing unit selects targets.','That Ravenwing unit.','Select one enemy unit within 12 inches that it targeted. Until the end of the phase, friendly Deathwing units add 1 to Wound rolls when attacking that enemy unit.'),
        stratagem('Inescapable Wrath',2,"End of opponent’s Charge phase",'At the end of your opponent’s Charge phase.','One Deathwing Infantry or Deathwing Walker unit within 6 inches of an enemy unit that it could charge.','That unit immediately declares and resolves a charge against one or more of those enemy units.','Even if successful, the unit receives no Charge bonus this turn.')
      ]
    },
    'unforgiven-task-force': {
      id:'unforgiven-task-force', name:'Unforgiven Task Force', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Take and Hold', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Grim Resolve',text:'Battle-shocked Adeptus Astartes units from your army have Objective Control 1 instead of 0. In your Command phase, select one Adeptus Astartes unit; until your next Command phase, add 1 to the Objective Control characteristic of its models.'}],
      enhancements:[
        {kind:'enhancement',name:'Pennant of Remembrance',points:10,text:'Ancient model only. While leading a unit, its models have Feel No Pain 6+; while that unit is Battle-shocked, they have Feel No Pain 4+ instead.'},
        {kind:'enhancement',name:'Shroud of Heroes',points:25,text:'Adeptus Astartes model only. The first time the bearer is destroyed, at the end of the phase roll D6; on 2+, return it near where it was destroyed with 3 wounds remaining, or full wounds if it was Battle-shocked.'},
        {kind:'enhancement',name:'Stubborn Tenacity',points:15,text:'Adeptus Astartes model only. While leading a unit below Starting Strength, models add 1 to Hit rolls; if that unit is also Battle-shocked, they also add 1 to Wound rolls.'},
        {kind:'enhancement',name:'Weapons of the First Legion',points:15,text:'Adeptus Astartes model only. Add 1 to the Attacks, Strength and Damage characteristics of the bearer’s melee weapons; add 2 instead while the bearer is Battle-shocked.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Unforgiven Fury',1,'Shooting or Fight phase','When an Adeptus Astartes unit that has not attacked is selected to shoot or fight.','That Adeptus Astartes unit.','Until the end of the phase, its weapons have Lethal Hits. If one or more friendly Adeptus Astartes units are Battle-shocked, unmodified Hit rolls of 5+ are Critical Hits.'),
        stratagem('Intractable',1,'Movement phase','Just after an Adeptus Astartes unit Falls Back.','That Adeptus Astartes unit.','Until the end of the turn, that unit can shoot and declare a charge despite Falling Back.'),
        stratagem('Fire Discipline',1,'Shooting phase','When an Adeptus Astartes unit that has not shot is selected.','That Adeptus Astartes unit.','Until the end of the phase, its ranged weapons have Assault, Heavy and Ignores Cover.'),
        stratagem('Grim Retribution',1,"Opponent’s Shooting phase",'Just after an enemy unit has shot and destroyed one or more models in an Adeptus Astartes unit.','That damaged Adeptus Astartes unit.','That unit can immediately shoot, but can only target the enemy unit that just attacked it and only if it is an eligible target.'),
        stratagem('Unbreakable Lines',2,"Opponent’s Charge phase",'Just after an enemy unit ends a Charge move.','One Adeptus Astartes unit within Engagement Range of that enemy unit.','Until the end of the turn, subtract 1 from Wound rolls for attacks that target your unit.')
      ]
    },
    'wrath-of-the-rock': {
      id:'wrath-of-the-rock', name:'Wrath of the Rock', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Priority Assets', dp:3, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Dutiful Tenacity',text:'When an attack targets a friendly Adeptus Astartes Infantry or Mounted unit and that attack’s Strength is greater than the unit’s Toughness, subtract 1 from the Wound roll.'}],
      enhancements:[
        {kind:'enhancement',name:'Ancient Weapons',points:25,text:'Adeptus Astartes model only. Improve the Strength of the bearer’s melee weapons by 2, and improve their Armour Penetration and Damage by 1.'},
        {kind:'enhancement',name:'Deathwing Assault',points:15,text:'Deathwing model with Deep Strike only. The bearer’s unit can arrive using Deep Strike in the first, second or third Movement phase regardless of mission rules.'},
        {kind:'enhancement',name:'Lord of the Ravenwing',points:10,text:'Ravenwing model only. Re-roll Advance and Charge rolls made for the bearer’s unit.'},
        {kind:'enhancement',name:'Tempered in Battle (Aura)',points:10,text:'Adeptus Astartes model only. Friendly Adeptus Astartes units within 6 inches can re-roll Battle-shock and Leadership tests.'}
      ],
      stratagems:[
        stratagem('Inescapable Justice',2,'Any phase','Just after your Oath of Moment target is destroyed.','One Adeptus Astartes Character unit on the battlefield.','Select one visible enemy unit within 12 inches. It becomes your Oath of Moment target until the start of your next Command phase.'),
        stratagem('Lion’s Will',1,'Command phase','During your Command phase.','One Adeptus Astartes unit within Engagement Range.','Until your next Command phase, add 1 to the Objective Control characteristic of its models. Until the end of the turn, if it is not Deathwing, Ravenwing or Vehicle, also add 1 to its Hit rolls.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Tactical Mastery',1,'Movement phase','During your Movement phase.','One Adeptus Astartes unit.','Until the end of the turn, that unit can shoot and charge after Advancing. If it has Ravenwing, it can also shoot and charge after Falling Back.'),
        stratagem('Relics of the Dark Age',1,'Shooting phase','When an Adeptus Astartes Infantry or Mounted unit that has not shot is selected.','That Adeptus Astartes Infantry or Mounted unit.','Until the end of the phase, add 2 to the Strength characteristic of ranged weapons equipped by models in that unit.'),
        stratagem('Leonine Aggression',1,"End of opponent’s Charge phase",'At the end of your opponent’s Charge phase.','One Adeptus Astartes unit within 3 inches of an enemy unit, or one Deathwing unit within 6 inches of an enemy unit.','That unit immediately declares and resolves a charge against one or more of those enemy units.','Even if successful, the unit receives no Charge bonus this turn.')
      ]
    },

    'vengeful-hosts': {
      id:'vengeful-hosts', name:'Vengeful Hosts', faction:'Adeptus Astartes', chapters:['all'],
      disposition:'Take and Hold', dp:1, status:'ready', availability:'public-pack', sourceType:'official-public-pack-summary',
      rules:[{kind:'detachment',name:'Imperator Unleashed',text:'In a turn in which a friendly Adeptus Astartes Fly Infantry unit made an ingress move or Charge move, models in that unit can re-roll Hit rolls of 1 when making attacks.'}],
      enhancements:[
        {kind:'enhancement',name:'Avenging Angel',points:20,text:'Adeptus Astartes Fly Infantry model only. After this unit ends an ingress move, select one enemy unit within 9 inches. That enemy unit takes a Battle-shock test; subtract 1 from that test.'},
        {kind:'enhancement',name:'Orksbane',points:20,text:'Adeptus Astartes Fly Infantry model only. The bearer gains the Orksbane weapon profile described by the current Vengeful Hosts reference.'}
      ],
      stratagems:[
        stratagem('Meteoric Onslaught',1,'Fight phase','When a friendly Adeptus Astartes Fly Infantry unit that made a Charge move this turn is selected to fight.','That Fly Infantry unit.','Add 1 to the Strength characteristic of melee weapons equipped by models in that unit until the end of the phase.'),
        stratagem('Know No Fear',1,'Command phase','During your Command phase.','One friendly Battle-shocked Adeptus Astartes unit. This Stratagem can target that unit even though it is Battle-shocked.','That unit is no longer Battle-shocked.'),
        stratagem('Purge by Sectors',1,'End of Fight phase','At the end of the Fight phase.','One friendly unengaged Adeptus Astartes Fly Infantry unit that was eligible to fight this phase.','That unit can make a Normal move of up to D3+3 inches.')
      ]
    },


    // First Founding / expanded Space Marines ---------------------------------
    // Detachment rules are sourced from the exact New Recruit roster first.
    // These entries provide chapter-scope metadata plus concise printable
    // Enhancement/Stratagem fallbacks where ROSZ does not include them.
    'armoured-speartip': {
      id:'armoured-speartip', name:'Armoured Speartip', faction:'Adeptus Astartes', chapters:['all'],
      scope:{type:'generic',source:'new-recruit'}, disposition:'Take and Hold', dp:3, status:'ready', availability:'public-pack', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Rapid Deployment',text:'After a friendly Adeptus Astartes unit disembarks from a non-Fly Transport that made a Normal or Advance move this phase, it can make an additional Normal move: up to D6 inches, or D3+3 inches if the Transport is a Heavy Transport. Non-Fly Adeptus Astartes Transports with 14+ Wounds gain Heavy Transport.'}],
      enhancements:[
        {kind:'enhancement',name:'Armoured Commander',points:25,text:'Once per turn in your Movement phase, improve the arrival timing of one friendly Transport in Strategic Reserves by treating the battle round as one higher.'},
        {kind:'enhancement',name:'Liberator',points:15,text:'An objective you control remains yours after the Command phase while the bearer or its Heavy Transport is within range, until the opponent has the greater Level of Control at the end of a phase.'},
        {kind:'enhancement',name:'Shock Deployment',points:20,text:'Terminator or Gravis model only. If its unit disembarked this turn, the unit’s ranged weapons gain Sustained Hits 1 for the Shooting phase.'},
        {kind:'enhancement',name:'Tip of the Spear',points:40,text:'If the bearer starts the battle embarked in a Transport, that Transport gains Scouts 6 inches.'}
      ],
      stratagems:[
        stratagem('Machine Wrath',1,'Any phase','Just after a friendly Heavy Transport with Deadly Demise is destroyed and you rolled a 6 for Deadly Demise.','That destroyed Heavy Transport.','Before resolving Deadly Demise or Emergency Disembarkation, it can make a Normal or Fall Back move, passing Desperate Escape tests automatically and moving through non-Monster/non-Vehicle enemy models without ending engaged.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Rapid Embarkation',1,'End of Fight phase','At the end of the Fight phase.','One unengaged Adeptus Astartes Infantry unit and one friendly Heavy Transport it can embark within.','If the Infantry unit is wholly within 6 inches of that Heavy Transport, it can embark within it.'),
        stratagem('Ceramite Sledgehammer',1,'Movement phase','During your Movement phase.','One Adeptus Astartes Transport that has not moved.','For the phase it can move horizontally through terrain. If it is a Heavy Transport, it can also pass through non-Monster/non-Vehicle enemy models, but cannot end engaged.'),
        stratagem('Advanced Deployment',1,'Movement phase','During your Movement phase.','One Adeptus Astartes Transport that has not moved.','Until the end of the phase, units can disembark from it after it Advances. Those units count as having made a Normal move and normally cannot charge unless the Transport has Assault Ramp.'),
        stratagem('Purgation Doctrine',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Until the end of the phase, add 1 to Hit rolls for its attacks; if it disembarked from a Heavy Transport this turn, also add 1 to Wound rolls.')
      ]
    },
    'bastion-task-force': {
      id:'bastion-task-force', name:'Bastion Task Force', faction:'Adeptus Astartes', chapters:['all'],
      scope:{type:'generic',source:'new-recruit'}, disposition:'Take and Hold', dp:2, status:'ready', availability:'public-pack', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Interlocking Tactics',text:'Friendly Adeptus Astartes Battleline units can shoot, charge and start Actions after Advancing or Falling Back. After a Battleline unit attacks, one enemy unit it hit becomes auspex scanned until end of turn; friendly Adeptus Astartes attacks against an auspex scanned unit re-roll Hit rolls of 1.'}],
      enhancements:[
        {kind:'enhancement',name:'Blades of Valour',points:15,text:'Improve the AP of the bearer’s and its Battleline unit’s melee weapons by 1.'},
        {kind:'enhancement',name:'Bombast Omnivox',points:15,text:'When the bearer’s unit is targeted by a Stratagem, roll D6, adding 1 if Battleline; on 4+ gain 1CP.'},
        {kind:'enhancement',name:'Eye of the Primarch',points:10,text:'The bearer’s and its Battleline unit’s ranged weapons gain Precision.'},
        {kind:'enhancement',name:'Hero of the Chapter',points:20,text:'While leading a unit, the bearer gains the Battleline keyword.'}
      ],
      stratagems:[
        stratagem('Codex Discipline',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes unit that has not shot or fought.','Until end of phase, re-roll Hit rolls of 1; against an auspex scanned target, also re-roll Wound rolls of 1.'),
        stratagem('Guided Disruption',1,'Shooting or Fight phase','Just after a friendly Battleline unit finishes its attacks.','That Battleline unit.','If those attacks auspex scan a non-Monster/non-Vehicle enemy, that enemy is pinned until your next turn: -2 Move and -2 to Charge rolls.'),
        stratagem('Light of Vengeance',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes unit that has not shot or fought.','Choose Lethal Hits or Sustained Hits 1. Its weapons gain that ability while targeting an auspex scanned unit, or while the unit has Battleline.'),
        stratagem('Shock Bombardment',1,'Shooting or Fight phase','Just after a friendly Battleline unit finishes its attacks.','That Battleline unit.','If those attacks auspex scan an enemy, that enemy is suppressed until your next turn; subtract 1 from Hit rolls for its attacks.'),
        stratagem('Angels Defiant',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes Battleline unit.','Until end of phase, subtract 1 from Wound rolls for attacks whose Strength is greater than the unit’s Toughness.'),
        stratagem('Heresy Undone',1,'Shooting or Charge phase','During your Shooting or Charge phase.','One Adeptus Astartes unit excluding Battleline.','Until end of phase, it can shoot and charge after Advancing or Falling Back, but all affected attacks/charges must target auspex scanned enemies.')
      ]
    },
    'ceramite-sentinels': {
      id:'ceramite-sentinels', name:'Ceramite Sentinels', faction:'Adeptus Astartes', chapters:['all'],
      scope:{type:'generic',source:'new-recruit'}, disposition:'Take and Hold', dp:3, status:'ready', availability:'public-pack', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Adaptive Defence',text:'Adeptus Astartes models whose unit is within a terrain feature re-roll Hit rolls of 1 and Wound rolls of 1. Units become Entrenched while within terrain, not set up this turn, and no model has moved more than 3 inches this turn.'}],
      enhancements:[
        {kind:'enhancement',name:'Castellum Omnivox',points:20,text:'After the bearer’s unit Falls Back, choose whether it can perform an Action or shoot and charge that turn.'},
        {kind:'enhancement',name:'Defensive Mastery',points:25,text:'After deployment, redeploy up to three Adeptus Astartes units; they may instead be placed into Strategic Reserves regardless of normal reserve count.'},
        {kind:'enhancement',name:'Honour Indefatigable',points:25,text:'Gravis model only. The first time the bearer is destroyed, on 2+ return it near where it fell, unengaged, with full wounds.'},
        {kind:'enhancement',name:'Spy-skull Data Link',points:15,text:'Ranged weapons in the bearer’s unit gain Ignores Cover.'}
      ],
      stratagems:[
        stratagem('Unyielding Might',1,'Command phase','During the Command phase.','One Adeptus Astartes unit within Engagement Range.','Until your next Command phase, add 1 to the Objective Control characteristic of its models.'),
        stratagem('Priority Strike',2,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes Infantry or Mounted unit that has not shot or fought.','Until end of phase, its attacks against Character, Monster or Vehicle units can re-roll Wound rolls.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Stand to the End',1,'Fight phase','Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Until end of phase, destroyed models that have not fought remain on a 4+ to fight after the attacker; add 1 to the roll if the unit is Entrenched.'),
        stratagem('Augmented Targeting',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Choose Sustained Hits 1 or Lethal Hits for its ranged weapons. If Entrenched, those weapons gain both instead.'),
        stratagem('Evasive Repositioning',1,"Opponent’s Shooting phase",'Just after an enemy unit has shot.','One targeted Adeptus Astartes Infantry or Mounted unit.','Your unit can make a Normal move of up to D6 inches; if Entrenched, re-roll the D6.')
      ]
    },
    'headhunter-task-force': {
      id:'headhunter-task-force', name:'Headhunter Task Force', faction:'Adeptus Astartes', chapters:['all'],
      scope:{type:'generic',source:'new-recruit'}, disposition:'Priority Assets', dp:2, status:'ready', availability:'public-pack', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Target Sighted',text:'Eligible non-Fly Adeptus Astartes Vehicles gain Tank Ace. Up to three Tank Ace units can gain Character during Muster Armies. Tank Aces Advance a flat 6 inches and, when shooting without Advancing that turn, can re-roll the Damage roll.'}],
      enhancements:[
        {kind:'enhancement',name:'Astartes Tank Ace',points:40,text:'Vehicle model only. Friendly Adeptus Astartes Vehicles within 6 inches have Assault on ranged weapons in your Shooting phase.'},
        {kind:'enhancement',name:'Firestorm Coordinators',points:20,text:'Vehicle model only. The bearer’s ranged weapons gain Sustained Hits 1.'},
        {kind:'enhancement',name:'Gunnery Honours',points:20,text:'Vehicle model only. Once per phase, re-roll one Hit roll, one Wound roll and one Damage roll for the bearer.'},
        {kind:'enhancement',name:'Redoubtable Machine Spirit',points:25,text:'Vehicle model only. The bearer gains a 5+ invulnerable save and regains 1 lost wound at the end of your Command phase.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Target Weak Point',1,'Shooting phase','During your Shooting phase.','One Tank Ace unit that has not shot.','Until end of phase, ranged attacks against Monster or Vehicle units improve AP by 1.','A unit cannot also be targeted by Kill Shot in the same phase.'),
        stratagem('Kill Shot',1,'Shooting phase','During your Shooting phase.','One Tank Ace unit that has not shot.','Until end of phase, attacks against Monster or Vehicle units re-roll Wound rolls of 1; if the target is below Starting Strength, re-roll the Wound roll instead.','A unit cannot also be targeted by Target Weak Point in the same phase.'),
        stratagem('Rapid Gunnery',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Until end of phase, it is eligible to shoot in a turn in which it Fell Back.'),
        stratagem('Reactive Repositioning',1,"Opponent’s Movement phase",'Just after an enemy unit ends a Normal, Advance or Fall Back move.','One Tank Ace unit within 8 inches, excluding units containing a 16+ Wounds model.','Your unit can make a Normal move of up to D6 inches.'),
        stratagem('Machine Vengeance',1,"Opponent’s Shooting phase",'Just after an enemy unit has shot.','One targeted Tank Ace unit, excluding units containing a 16+ Wounds model.','Your unit can shoot as if it were your Shooting phase, but only at that enemy unit if it is visible and eligible.')
      ]
    },
    'orbital-assault-force': {
      id:'orbital-assault-force', name:'Orbital Assault Force', faction:'Adeptus Astartes', chapters:['all'],
      scope:{type:'generic',source:'new-recruit'}, disposition:'Take and Hold', dp:2, status:'ready', availability:'public-pack', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Rapid-drop Deployment',text:'At Declare Battle Formations, give Deep Strike to 2/3/4 eligible Adeptus Astartes units in Incursion/Strike Force/Onslaught. Attacks made by units set up this turn re-roll Wound rolls of 1; units that disembarked from a Drop Pod this turn also re-roll Hit rolls of 1.'}],
      enhancements:[
        {kind:'enhancement',name:'Dedicated Gunship',points:15,text:'Terminator model only. Once per battle at the end of the opponent’s Fight phase, if unengaged, place the bearer’s unit into Strategic Reserves.'},
        {kind:'enhancement',name:'Laurels of Thunder',points:15,text:'Re-roll Charge rolls for the bearer’s unit in a turn in which it was set up on the battlefield.'},
        {kind:'enhancement',name:'Orbital Uplink Reliquary',points:25,text:'After deployment, redeploy up to three Adeptus Astartes units; they can instead enter Strategic Reserves regardless of the normal reserve count.'},
        {kind:'enhancement',name:'Veteran of the Vanguard',points:20,text:'Models in the bearer’s unit gain Scouts 6 inches.'}
      ],
      stratagems:[
        stratagem('Suppression Strafing',1,'Command phase','During the Command phase.','One Adeptus Astartes unit.','Select one visible enemy within 18 inches. It takes a Battle-shock test at -1; if failed, it is suppressed until your next turn and subtracts 1 from Hit rolls.','Cannot be used more than once per battle round.'),
        stratagem('Tactical Decapitation',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes unit that has not shot or fought.','Until end of phase, its weapons gain Precision and attacks against Character units add 1 to Hit rolls.'),
        stratagem('Shock Onslaught',1,'Fight phase','During the Fight phase.','One Adeptus Astartes unit that has not fought.','Until end of phase, models in the unit can Pile In and Consolidate up to 6 inches instead of 3 inches.'),
        stratagem('Auto-sense Coordination',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes unit that has not shot or fought.','Choose Lethal Hits or Sustained Hits 1. Its weapons gain the selected ability if the unit disembarked from a Drop Pod this turn or targets an enemy within 12 inches.'),
        stratagem('Blind Screen',1,"Opponent’s Shooting phase",'Just after an enemy unit selects targets.','One targeted non-Titanic Adeptus Astartes unit and one friendly Smoke Vehicle or Drop Pod within 9 inches.','Until end of phase, both units have Stealth and Benefit of Cover against ranged attacks.'),
        stratagem('Onward for The Emperor',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One Adeptus Astartes Infantry unit not set up this turn and one friendly Transport it can embark within.','If the Infantry unit is wholly within 6 inches of the Transport, it can embark within it.')
      ]
    },
    'blade-of-ultramar': {
      id:'blade-of-ultramar', name:'Blade of Ultramar', faction:'Adeptus Astartes', chapters:['ultramarines'],
      scope:{type:'chapter',chapters:['ultramarines'],source:'new-recruit'}, disposition:'Priority Assets', dp:3, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Mastered Doctrines',text:'At the start of up to three Command phases, select Devastator, Tactical or Assault Doctrine for all friendly Adeptus Astartes units until your next Command phase. Each doctrine is normally selected only once per battle; Marneus Calgar permits reuse. Devastator enables shooting after Advancing; Tactical enables shooting and charging after Falling Back; Assault enables charging after Advancing.'}],
      enhancements:[
        {kind:'enhancement',name:'Armour of Antoninus',points:10,text:'The bearer has Save 2+ and Feel No Pain 5+.'},
        {kind:'enhancement',name:'Oath of Macragge',points:15,text:'Add 1 to Attacks and Strength of the bearer’s melee weapons, or add 2 while its unit is under Assault Doctrine.'},
        {kind:'enhancement',name:'Student of the Codex',points:20,text:'At the start of your Command phase, the bearer’s unit can use Tactical Doctrine instead of the army’s current doctrine until your next Command phase.'},
        {kind:'enhancement',name:'Veteran of Behemoth',points:25,text:'While leading, ranged weapons in the bearer’s unit gain Sustained Hits 1; under Devastator Doctrine the unit can also re-roll Advance rolls.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Tactical Foresight',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Until end of phase, if an attack’s Strength is at least the unit’s Toughness, subtract 1 from its Wound roll.'),
        stratagem('Courage and Honour!',1,'Fight phase','During the Fight phase.','One Adeptus Astartes unit.','Until end of phase, its melee weapons gain Lance; if under Assault Doctrine, improve their AP by 1 as well.'),
        stratagem('Ultramarian Adaptivity',1,'Command phase','During your Command phase.','One Adeptus Astartes unit.','Choose Devastator, Tactical or Assault Doctrine; that doctrine applies to this unit until your next Command phase instead of the army doctrine, even if already used.'),
        stratagem('Exemplary Vigilance',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Until end of phase, ranged weapons gain Ignores Cover; if under Devastator Doctrine, improve their AP by 1 as well.'),
        stratagem('Practical Tactics',1,"Opponent’s Movement phase",'Just after an enemy unit ends a Normal, Advance or Fall Back move.','One unengaged Adeptus Astartes Infantry or Mounted unit within 8 inches.','Your unit can make a Normal move of up to D6 inches, or up to 6 inches if under Tactical Doctrine.')
      ]
    },
    'reclamation-force': {
      id:'reclamation-force', name:'Reclamation Force', faction:'Adeptus Astartes', chapters:['ultramarines'],
      scope:{type:'chapter',chapters:['ultramarines'],source:'new-recruit'}, disposition:'Take and Hold', dp:2, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Oath of Reclamation',text:'Friendly Adeptus Astartes melee attacks against a unit within range of an objective marker improve AP by 1. When an attack targets a friendly Adeptus Astartes unit within range of an objective you controlled at the start of the phase, subtract 1 from the Wound roll if the attack’s Strength exceeds the unit’s Toughness or the unit has the Titus keyword.'}],
      enhancements:[
        {kind:'enhancement',name:'Avenging Avatar',points:10,text:'During the opponent’s Battle-shock step, enemy units below Starting Strength within 9 inches of the bearer must take a Battle-shock test.'},
        {kind:'enhancement',name:'Liberatum',points:25,text:'The bearer can re-roll Hit and Wound rolls for attacks against enemies within range of an objective marker.'},
        {kind:'enhancement',name:'Scroll of Proclamation',points:15,text:'When charging an enemy within range of an objective and within 12 inches, the bearer’s unit can re-roll the Charge roll but must finish engaged with one of those enemies.'},
        {kind:'enhancement',name:'Seals of Reconquest',points:20,text:'Models in the bearer’s unit gain a 5+ invulnerable save.'}
      ],
      stratagems:[
        stratagem('Crusading Conquerors',1,'End of Command phase','At the end of the Command phase.','One Adeptus Astartes unit.','Until your next Command phase, add 1 to the Objective Control characteristic of its models.'),
        stratagem('Furious Dedication',1,'Charge or Fight phase','During your Charge phase or the Fight phase.','One Adeptus Astartes unit that has not charged or fought.','Until end of turn, add 2 to Charge rolls and add 1 to the Attacks characteristic of its melee weapons.','Cannot be used more than once per turn.'),
        stratagem('Fight to the End',1,'Fight phase','Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Until end of phase, destroyed models that have not fought remain on a 4+ to fight after the attacker, then are removed.'),
        stratagem('Scions of Guilliman',1,'Movement phase','Just after a friendly Adeptus Astartes unit ends a Fall Back move.','That Adeptus Astartes unit.','Until end of turn, it can shoot and charge despite having Fallen Back.'),
        stratagem('Ultramarian Destiny',1,'Movement phase','During your Movement phase.','One Adeptus Astartes unit.','Choose an objective marker you control that the unit is within range of; it remains under your control until the opponent has greater Level of Control at the end of a phase.'),
        stratagem('Marching Ever On',1,"Opponent’s Movement phase",'Just after an enemy unit Falls Back.','One Adeptus Astartes unit that was engaged with that enemy at the start of the phase.','Your unit can make a Normal move of up to D6+1 inches.')
      ]
    },
    'emperors-shield': {
      id:'emperors-shield', name:"Emperor's Shield", faction:'Adeptus Astartes', chapters:['imperial-fists'],
      scope:{type:'chapter',chapters:['imperial-fists'],source:'new-recruit'}, disposition:'Purge the Foe', dp:2, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Wrath of Dorn',text:'Models with Oath of Moment re-roll Wound rolls of 1 against the Oath target. Models in a Darnath Lysander unit can re-roll the Wound roll against that target.'}],
      enhancements:[
        {kind:'enhancement',name:'Champion of the Feast',points:25,text:'Add 1 to the Attacks characteristic of the bearer’s melee weapons; once per battle, also add 1 Attacks to other melee weapons in its unit for the phase.'},
        {kind:'enhancement',name:'Disciple of Rhetoricus',points:10,text:'Terminator only. Improve bearer OC by 1; once per battle, also add 1 OC to the other models in its unit for the phase.'},
        {kind:'enhancement',name:'Indomitable Champion',points:20,text:'Terminator only. The first time the bearer is destroyed, on 2+ return it near where it fell, unengaged, with 3 wounds.'},
        {kind:'enhancement',name:'Malodraxian Standard',points:20,text:'Ancient only. If an incoming attack’s Strength exceeds the unit’s Toughness, subtract 1 from its Wound roll.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Fury of the First',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Terminator, Bladeguard, Sternguard or Vanguard Veteran unit that has not shot or fought.','Until end of phase, add 1 to Hit rolls; if below Starting Strength, also add 1 to Wound rolls.'),
        stratagem('Obdurate Vengeance',1,'Fight phase','Just after an enemy unit selects targets.','One targeted Terminator, Bladeguard, Sternguard or Vanguard Veteran unit.','Until end of phase, destroyed models that have not fought remain on a 3+ to fight after the attacker, then are removed.'),
        stratagem('Wrathful Conquerors',1,'Movement phase','During your Movement phase.','One Terminator, Bladeguard, Sternguard or Vanguard Veteran unit within range of an objective you control.','That objective remains yours until the opponent has the greater Level of Control at the end of a phase.'),
        stratagem('Disciplined Extermination',1,'Shooting phase','During your Shooting phase.','One Terminator, Bladeguard, Sternguard or Vanguard Veteran unit that has not shot.','Until end of phase, its ranged weapons gain Ignores Cover and improve AP by 1.'),
        stratagem('Dropship Extraction',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One unengaged Adeptus Astartes Terminator unit.','Remove the unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'forgefathers-seekers': {
      id:'forgefathers-seekers', name:"Forgefather's Seekers", faction:'Adeptus Astartes', chapters:['salamanders'],
      scope:{type:'chapter',chapters:['salamanders'],source:'new-recruit'}, disposition:'Priority Assets', dp:2, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:"Vulkan's Quest",text:'Ranged weapons of friendly Adeptus Astartes models gain Assault. When those attacks target a unit within 12 inches, add 1 to Strength. If Vulkan He’stan is included, friendly Infernus Squads gain additional Action/shooting flexibility.'}],
      enhancements:[
        {kind:'enhancement',name:'Adamantine Mantle',points:20,text:'Reduce incoming Damage by 1; against Melta or Torrent attacks, change Damage to 1 instead.'},
        {kind:'enhancement',name:'Forged in Battle',points:15,text:'While leading, once per turn change one Hit roll or saving throw made for a model in the unit to an unmodified 6.'},
        {kind:'enhancement',name:'Immolator',points:10,text:'Add 1 to the Attacks characteristic of Torrent weapons in the bearer’s unit.'},
        {kind:'enhancement',name:'War-tempered Artifice',points:25,text:'Infantry only. Add 3 to the Strength characteristic of the bearer’s melee weapons.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Crucible of Battle',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes Infantry unit that has not shot or fought.','Until end of phase, add 1 to Wound rolls when it attacks the closest eligible target within 6 inches.'),
        stratagem('Wrathful Inferno',1,'Movement phase','Just after a friendly Adeptus Astartes Infantry unit Falls Back.','That unit.','Until end of turn, it is eligible to shoot despite having Fallen Back.'),
        stratagem('Immolation Protocols',2,'Shooting phase','During your Shooting phase.','One Adeptus Astartes unit that has not shot.','Until end of phase, Torrent weapons in the unit gain Devastating Wounds.'),
        stratagem('Burning Vengeance',1,"Opponent’s Shooting phase",'Just after an enemy unit has shot.','One targeted Adeptus Astartes Transport.','One embarked unit can disembark as in your Movement phase and then shoot only at that enemy unit, if eligible.'),
        stratagem('Blazing Earth',1,"Opponent’s Charge phase",'At the start of your opponent’s Charge phase.','One Adeptus Astartes unit with one or more Torrent weapons.','Select one visible non-Monster/non-Vehicle/non-Fly enemy within 12 inches; subtract 2 from its Charge rolls for the phase.')
      ]
    },
    'hammer-of-avernii': {
      id:'hammer-of-avernii', name:'Hammer of Avernii', faction:'Adeptus Astartes', chapters:['iron-hands'],
      scope:{type:'chapter',chapters:['iron-hands'],source:'new-recruit'}, disposition:'Purge the Foe', dp:2, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Calculated Annihilation',text:'Models with Oath of Moment re-roll Wound rolls of 1 against the Oath target. Once per battle round after that target is destroyed, if Caanok Var is on the battlefield, a visible enemy he selects becomes your new Oath target.'}],
      enhancements:[
        {kind:'enhancement',name:'Iron Laurel',points:10,text:'Improve bearer OC by 1; once per battle, also add 1 OC to other models in its unit for the phase.'},
        {kind:'enhancement',name:'Medusan Roar',points:30,text:'Enemy non-Monster/non-Vehicle units within 6 inches lose one model when they fail Battle-shock; once per battle, destroy D3 models instead.'},
        {kind:'enhancement',name:'Spiritus Ferrum',points:25,text:'Add 1 to the Attacks characteristic of the bearer’s melee weapons; once per battle, also add 1 Attacks to other melee weapons in its unit for the phase.'},
        {kind:'enhancement',name:'Steel Font',points:15,text:'Terminator only. In your Command phase, return one destroyed Bodyguard model to the bearer’s unit.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Ruthless Butchery',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Dreadnought, Terminator, Bladeguard, Sternguard or Vanguard Veteran unit that has not shot or fought.','Until end of phase, add 1 to Hit rolls; if below Starting Strength, also add 1 to Wound rolls.'),
        stratagem('Dominator Beacon',1,'Movement phase','During your Movement phase.','One Dreadnought, Terminator, Bladeguard, Sternguard or Vanguard Veteran unit within range of an objective you control.','That objective remains yours until the opponent controls it at the end of a phase.'),
        stratagem('Cogitated Ferocity',1,'Fight phase','During your Fight phase.','One Dreadnought, Terminator, Bladeguard, Sternguard or Vanguard Veteran unit that has not fought.','Choose Sustained Hits 1 or Lethal Hits; its melee weapons gain the selected ability until end of phase.'),
        stratagem('Augmetic Fortitude',1,"Opponent’s Charge phase",'Just after an enemy unit ends a Charge move.','One engaged Terminator, Bladeguard, Sternguard or Vanguard Veteran unit.','Until end of turn, subtract 1 from the Damage characteristic of attacks allocated to its models.'),
        stratagem('Dropship Extraction',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One unengaged Adeptus Astartes Terminator unit.','Remove the unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'shadowmark-talon': {
      id:'shadowmark-talon', name:'Shadowmark Talon', faction:'Adeptus Astartes', chapters:['raven-guard'],
      scope:{type:'chapter',chapters:['raven-guard'],source:'new-recruit'}, disposition:'Disruption', dp:2, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Masters of Shadow',text:'Ranged attacks against friendly Adeptus Astartes units grant the target Benefit of Cover unless the attacker is within 12 inches. If Aethon Shaan is on the battlefield, once per battle round Into Darkness can be used for 0CP.'}],
      enhancements:[
        {kind:'enhancement',name:'Blackwing Shroud',points:25,text:'Infantry only. While leading, models in the bearer’s unit gain Infiltrators.'},
        {kind:'enhancement',name:'Coronal Susurrant',points:30,text:'Phobos only. Once per turn, when an enemy uses a Stratagem on a unit within 12 inches, increase that use’s CP cost by 1.'},
        {kind:'enhancement',name:'Hunter’s Instincts',points:25,text:'If the bearer’s unit is in Strategic Reserves, treat the battle round as one higher when setting it up.'},
        {kind:'enhancement',name:'Umbral Raptor',points:15,text:'The bearer gains Stealth and Lone Operative.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Lay Low the Tyrants',1,'Fight phase','During the Fight phase.','One Adeptus Astartes Infantry unit that has not fought.','Until end of phase, its melee weapons gain Precision.'),
        stratagem('Feint and Thrust',1,'Movement phase','During your Movement phase.','One Adeptus Astartes unit.','Until end of turn, it can shoot and charge after Falling Back; if Phobos or Scout Squad, it can also shoot and charge after Advancing.'),
        stratagem('Stunning Fusillade',1,'Shooting phase','During your Shooting phase.','One Adeptus Astartes Infantry unit that has not shot.','Until end of phase, ranged attacks against enemies more than 12 inches away improve Ballistic Skill and AP by 1; if an enemy model is destroyed, its unit takes a Battle-shock test.'),
        stratagem('Raptorial Vigilance',1,"Opponent’s Movement phase",'Just after an enemy unit ends a Normal, Advance or Fall Back move.','One unengaged Adeptus Astartes Infantry or Mounted unit within 8 inches.','Your unit can make a Normal move of up to D6 inches, or up to 6 inches if Phobos or Scout Squad.'),
        stratagem('Into Darkness',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','Up to two unengaged Phobos/Scout units, or one other unengaged Adeptus Astartes Infantry unit.','Remove the targeted unit(s) from the battlefield and place them into Strategic Reserves.')
      ]
    },
    'spearpoint-task-force': {
      id:'spearpoint-task-force', name:'Spearpoint Task Force', faction:'Adeptus Astartes', chapters:['white-scars'],
      scope:{type:'chapter',chapters:['white-scars'],source:'new-recruit'}, disposition:'Disruption', dp:2, status:'ready', availability:'chapter-scoped', sourceType:'new-recruit-scope+current-reference',
      rules:[{kind:'detachment',name:'Storm-Swift Onslaught',text:'Friendly Adeptus Astartes units can declare a charge after Advancing or Falling Back. If Suboden Khan’s unit destroys an enemy in the Fight phase and is unengaged at the end of the phase, it can make a Normal move of up to 6 inches.'}],
      enhancements:[
        {kind:'enhancement',name:'Chogorian Huntmaster',points:25,text:'Mounted only. If the bearer’s unit is in Strategic Reserves, treat the battle round as one higher when setting it up.'},
        {kind:'enhancement',name:'Hunter’s Eye',points:20,text:'Ranged weapons in the bearer’s unit gain Sustained Hits 1 and Ignores Cover.'},
        {kind:'enhancement',name:'Spearpoint Paragon',points:25,text:'Improve Strength and AP of the bearer’s melee weapons by 1; after it Charges, improve both by 2 instead until end of turn.'},
        {kind:'enhancement',name:"Stormseers' Wisdom",points:15,text:'While leading, the bearer’s unit can re-roll Advance rolls.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration of attacks against that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Spear Thrust and Sabre Swing',1,'Fight phase','During the Fight phase.','One Adeptus Astartes unit that has not fought.','Choose Lance or Lethal Hits for its melee weapons; if Mounted, those weapons gain both until end of phase.'),
        stratagem('Mobile Lethality',1,'Movement phase','During your Movement phase.','One Adeptus Astartes unit.','Until end of turn, it is eligible to shoot after Advancing or Falling Back.'),
        stratagem("Hunter's Instincts",1,"Opponent’s Movement phase",'Just after an enemy unit ends a Normal, Advance or Fall Back move.','One unengaged Adeptus Astartes Infantry or Mounted unit within 8 inches.','Your unit can make a Normal move of up to 6 inches.'),
        stratagem('Evasive Manoeuvres',1,"Opponent’s Shooting phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes Mounted or Fly Vehicle unit.','Until end of phase, subtract 1 from Wound rolls for attacks targeting that unit.'),
        stratagem('Withdraw and Regroup',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One unengaged Adeptus Astartes Mounted or Fly Vehicle unit.','Remove the unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
  };

  const catalogue = [
    // Codex: Space Marines and Chapter formations
    ['fulguris-task-force','Fulguris Task Force','Adeptus Astartes',['all'],'Disruption',1,'public-pack'],
    ['librarius-conclave','Librarius Conclave','Adeptus Astartes',['all'],'Reconnaissance',1,'public-pack'],
    ['subversion-assets','Subversion Assets','Adeptus Astartes',['all'],'Reconnaissance',1,'public-pack'],
    ['first-company-task-force','1st Company Task Force','Adeptus Astartes',['all'],'Priority Assets',2,'codex'],
    ['anvil-siege-force','Anvil Siege Force','Adeptus Astartes',['all'],'Take and Hold',2,'ready'],
    ['armoured-speartip','Armoured Speartip','Adeptus Astartes',['all'],'Take and Hold',3,'public-pack'],
    ['bastion-task-force','Bastion Task Force','Adeptus Astartes',['all'],'Take and Hold',2,'public-pack'],
    ['blade-of-ultramar','Blade of Ultramar','Adeptus Astartes',['ultramarines'],'Priority Assets',3,'chapter-scoped'],
    ['ceramite-sentinels','Ceramite Sentinels','Adeptus Astartes',['all'],'Take and Hold',3,'public-pack'],
    ['emperors-shield',"Emperor\'s Shield",'Adeptus Astartes',['imperial-fists'],'Purge the Foe',2,'chapter-scoped'],
    ['firestorm-assault-force','Firestorm Assault Force','Adeptus Astartes',['all'],'Purge the Foe',2,'codex'],
    ['forgefathers-seekers',"Forgefather\'s Seekers",'Adeptus Astartes',['salamanders'],'Priority Assets',2,'chapter-scoped'],
    ['gladius-task-force','Gladius Task Force','Adeptus Astartes',['all'],'Priority Assets',3,'codex'],
    ['hammer-of-avernii','Hammer of Avernii','Adeptus Astartes',['iron-hands'],'Purge the Foe',2,'chapter-scoped'],
    ['headhunter-task-force','Headhunter Task Force','Adeptus Astartes',['all'],'Priority Assets',2,'public-pack'],
    ['ironstorm-spearhead','Ironstorm Spearhead','Adeptus Astartes',['all'],'Purge the Foe',2,'codex'],
    ['orbital-assault-force','Orbital Assault Force','Adeptus Astartes',['all'],'Take and Hold',2,'public-pack'],
    ['reclamation-force','Reclamation Force','Adeptus Astartes',['ultramarines'],'Take and Hold',2,'chapter-scoped'],
    ['shadowmark-talon','Shadowmark Talon','Adeptus Astartes',['raven-guard'],'Disruption',2,'chapter-scoped'],
    ['spearpoint-task-force','Spearpoint Task Force','Adeptus Astartes',['white-scars'],'Disruption',2,'chapter-scoped'],
    ['stormlance-task-force','Stormlance Task Force','Adeptus Astartes',['all'],'Disruption',3,'codex'],
    ['vanguard-spearhead','Vanguard Spearhead','Adeptus Astartes',['all'],'Reconnaissance',2,'codex'],

    // Dark Angels
    ['dark-age-arsenal','Dark Age Arsenal','Dark Angels',['dark-angels'],'Priority Assets',1,'public-pack'],
    ['darkflight-pursuit','Darkflight Pursuit','Dark Angels',['dark-angels'],'Reconnaissance',1,'public-pack'],
    ['interrogation-conclave','Interrogation Conclave','Dark Angels',['dark-angels'],'Take and Hold',1,'public-pack'],
    ['company-of-hunters','Company of Hunters','Dark Angels',['dark-angels'],'Disruption',2,'codex'],
    ['inner-circle-task-force','Inner Circle Task Force','Dark Angels',['dark-angels'],'Priority Assets',2,'codex'],
    ['lions-blade-task-force',"Lion\'s Blade Task Force",'Dark Angels',['dark-angels'],'Purge the Foe',2,'public-pack'],
    ['unforgiven-task-force','Unforgiven Task Force','Dark Angels',['dark-angels'],'Take and Hold',2,'codex'],
    ['wrath-of-the-rock','Wrath of the Rock','Dark Angels',['dark-angels'],'Priority Assets',3,'public-pack'],

    // Blood Angels
    ['encarmine-speartip','Encarmine Speartip','Blood Angels',['blood-angels'],'Disruption',1,'public-pack'],
    ['legacy-of-grace','Legacy of Grace','Blood Angels',['blood-angels'],'Priority Assets',1,'public-pack'],
    ['wrath-of-the-doomed','Wrath of the Doomed','Blood Angels',['blood-angels'],'Purge the Foe',1,'public-pack'],
    ['angelic-inheritors','Angelic Inheritors','Blood Angels',['blood-angels'],'Priority Assets',3,'codex'],
    ['liberator-assault-group','Liberator Assault Group','Blood Angels',['blood-angels'],'Take and Hold',3,'codex'],
    ['rage-cursed-onslaught','Rage-cursed Onslaught','Blood Angels',['blood-angels'],'Purge the Foe',3,'codex'],
    ['the-angelic-host','The Angelic Host','Blood Angels',['blood-angels'],'Disruption',2,'codex'],
    ['the-lost-brethren','The Lost Brethren','Blood Angels',['blood-angels'],'Purge the Foe',2,'codex'],

    // Space Wolves
    ['champions-of-fenris','Champions of Fenris','Space Wolves',['space-wolves'],'Purge the Foe',1,'public-pack'],
    ['legends-of-saga-and-song','Legends of Saga and Song','Space Wolves',['space-wolves'],'Take and Hold',1,'public-pack'],
    ['veterans-of-the-fang','Veterans of the Fang','Space Wolves',['space-wolves'],'Disruption',1,'public-pack'],
    ['saga-of-the-beastslayer','Saga of the Beastslayer','Space Wolves',['space-wolves'],'Purge the Foe',2,'codex'],
    ['saga-of-the-bold','Saga of the Bold','Space Wolves',['space-wolves'],'Priority Assets',2,'codex'],
    ['saga-of-the-great-wolf','Saga of the Great Wolf','Space Wolves',['space-wolves'],'Take and Hold',2,'ready'],
    ['saga-of-the-hunter','Saga of the Hunter','Space Wolves',['space-wolves'],'Disruption',2,'codex'],

    // Black Templars
    ['marshals-household',"Marshal\'s Household",'Black Templars',['black-templars'],'Priority Assets',1,'public-pack'],
    ['the-living-miracle','The Living Miracle','Black Templars',['black-templars'],'Purge the Foe',1,'public-pack'],
    ['wrathful-procession','Wrathful Procession','Black Templars',['black-templars'],'Take and Hold',1,'public-pack'],
    ['companions-of-vehemence','Companions of Vehemence','Black Templars',['black-templars'],'Purge the Foe',2,'codex'],
    ['godhammer-assault-force','Godhammer Assault Force','Black Templars',['black-templars'],'Disruption',2,'codex'],
    ['vindication-task-force','Vindication Task Force','Black Templars',['black-templars'],'Priority Assets',2,'codex'],

    // Deathwatch
    ['black-spear-task-force','Black Spear Task Force','Deathwatch',['deathwatch'],'Priority Assets',3,'codex']
  ];

  for (const [id,name,faction,chapters,disposition,dp,availability] of catalogue) {
    if (!detachments[id]) {
      detachments[id] = {
        id, name, faction, chapters, disposition, dp,
        status: availability === 'ready' ? 'ready' : 'catalogued',
        availability,
        sourceType: availability === 'public-pack' ? 'official-public-pack' : 'codex-reference',
        rules:[], enhancements:[], stratagems:[],
        notice: availability === 'public-pack'
          ? 'Detachment is registered from the official 11th-edition public Faction Pack. Concise rule cards are still being transcribed and reviewed.'
          : 'Detachment is registered with official 11th-edition metadata. Full rule text is codex/app content and is not bundled until a verified concise reference is prepared.'
      };
    } else {
      Object.assign(detachments[id], {disposition, dp, chapters, faction, availability});
    }
  }


  // Gold Master metadata synchronisation.
  // New Recruit remains authoritative for selected roster content. This pass only
  // aligns the static fallback catalogue with current official names, DP,
  // dispositions and enhancement costs. Existing concise descriptions are kept
  // when they map to the same official enhancement name.
  const officialReference = global.ASTARTES_OFFICIAL_REFERENCE || null;
  const officialSync = {checked:0, matched:0, enhancementEntries:0, provisional:0};
  if (officialReference) {
    for (const [refId, ref] of Object.entries(officialReference.refs || {})) {
      const det = detachments[refId];
      if (!det) continue;
      officialSync.checked += 1;
      det.dp = ref.dp;
      det.disposition = ref.disposition;
      det.officialMetadataVersion = officialReference.version;
      det.officialMetadataChecked = officialReference.updated;
      det.officialSourceStatus = ref.sourceStatus || 'current-mfm';
      if (ref.sourceStatus === 'official-post-mfm') officialSync.provisional += 1;
      const oldEnhancements = [...(det.enhancements || [])];
      det.enhancements = (ref.enhancements || []).map(meta => {
        const existing = oldEnhancements.find(item => normalise(item.name) === normalise(meta.name));
        const base = existing ? {...existing} : {
          kind:'enhancement', name:meta.name,
          text:'When this Enhancement is selected in New Recruit, its roster-exported rule text is used. This fallback entry preserves current official metadata for validation.'
        };
        base.name = meta.name;
        if (meta.points == null) delete base.points; else base.points = meta.points;
        return base;
      });
      officialSync.enhancementEntries += det.enhancements.length;
      officialSync.matched += 1;
    }
  }


  // Verification expectations are deliberately separate from loaded content.
  // A catalogue entry cannot pass merely because both loaded and expected counts are zero.
  const verificationExpectations = {
    'gladius-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Honour the Chapter','Only in Death Does Duty End','Adaptive Strategy','Storm of Fire','Squad Tactics']},
    'anvil-siege-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6,
      stratagemNames:['Armour of Contempt','Rigid Discipline','Not One Backwards Step','No Threat Too Great','Battle Drill Recall','Hail of Vengeance']},
    'firestorm-assault-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Crucible of Battle','Rapid Embarkation','Immolation Protocols','Onslaught of Fire','Burning Vengeance']},
    'ironstorm-spearhead': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Mercy is Weakness','Ancient Fury','Power of the Machine Spirit','Vengeful Animus','Unbowed Conviction']},
    'stormlance-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Blitzing Fusillade','Full Throttle','Ride Hard, Ride Fast','Wind-swift Evasion','Shock Assault']},
    'vanguard-spearhead': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','A Deadly Prize','Calculated Feint','Strike from the Shadows','Guerrilla Tactics','Surgical Strikes']},
    'first-company-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Heroes of the Chapter','Legendary Fortitude','Duty and Honour','Orbital Teleportarium','Terrifying Proficiency']},
    'librarius-conclave': {detachmentRules:{min:1}, enhancements:5, stratagems:0},
    'fulguris-task-force': {detachmentRules:{min:1}, enhancements:2, stratagems:3,
      stratagemNames:['Data-link Augury','Reactive Evasion','Anti-grav Surge']},
    'subversion-assets': {detachmentRules:{min:1}, enhancements:2, stratagems:3,
      stratagemNames:['Adaptive Operations','Strike from the Shadows','Cloaked Position']},
    'champions-of-fenris': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Wolf Totems','Runes of Claiming','Stalk Between Worlds']},
    'legends-of-saga-and-song': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Fangs of the Pack','Chilling Howl','Wings of the Blizzard']},
    'veterans-of-the-fang': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Blade-keen Senses','Icy Calm','Grizzled Killers']},
    'saga-of-the-beastslayer': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Unbridled Ferocity','Shock Cavalry','Pinning Fire','Thunderous Pursuit','Impetuosity','Coordinated Strike']},
    'saga-of-the-bold': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Inspiring Presence','Champion’s Guidance','Birth of a Saga','Alpha Strike','Heroic Resolve','Countercharge']},
    'saga-of-the-great-wolf': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['The Foe Foreseen','Grimnar’s Command','Fenrisian Ferocity','Unrelenting Hunters','Eye of the Pack','Battle Instincts']},
    'saga-of-the-hunter': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Envelop and Ensnare','Territorial Advantage','Overwhelming Onslaught','Chosen Prey','Bounding Advance','Marked for Destruction']},
    'legacy-of-grace': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Aura of the Angel’s Grace','Soul-darkened Fury','Martial Paragon']},
    'encarmine-speartip': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Judgement of the Golden Host','Blinding Blurs of Vengeance','Inexorable Valour']},
    'wrath-of-the-doomed': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['No Barrier to Retribution','Rage-fuelled Response','Death Begets Vengeance']},
    'the-angelic-host': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Unbridled Ardour','Armour of Contempt','Angel’s Sacrifice','Martial Exemplars','Descent of Angels','Death From The Skies']},
    'the-lost-brethren': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Glorious Sacrifice','Armour of Contempt','Final Retribution','Furious Onslaught','Lost to Rage','Wrathful Rampage']},
    'angelic-inheritors': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Focused Fury','Instant of Grace','Strike Now For Glory','In The Shadow Of Great Wings','Unto The Burning Skies']},
    'liberator-assault-group': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Angelic Grace','Armour of Contempt','Savage Echoes','Red Rampage','Aggressive Onslaught','Relentless Assault']},
    'rage-cursed-onslaught': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['A Grim Warning','Armour of Contempt','Insensate Rampage','Limb from Limb','Deathless Duty','Red Wrath']},
    'armoured-speartip': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Machine Wrath','Armour of Contempt','Rapid Embarkation','Ceramite Sledgehammer','Advanced Deployment','Purgation Doctrine']},
    'bastion-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Codex Discipline','Guided Disruption','Light of Vengeance','Shock Bombardment','Angels Defiant','Heresy Undone']},
    'ceramite-sentinels': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Unyielding Might','Priority Strike','Armour of Contempt','Stand to the End','Augmented Targeting','Evasive Repositioning']},
    'headhunter-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Target Weak Point','Kill Shot','Rapid Gunnery','Reactive Repositioning','Machine Vengeance']},
    'orbital-assault-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Suppression Strafing','Tactical Decapitation','Shock Onslaught','Auto-sense Coordination','Blind Screen','Onward for The Emperor']},
    'blade-of-ultramar': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Tactical Foresight','Courage and Honour!','Ultramarian Adaptivity','Exemplary Vigilance','Practical Tactics']},
    'reclamation-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Crusading Conquerors','Furious Dedication','Fight to the End','Scions of Guilliman','Ultramarian Destiny','Marching Ever On']},
    'emperors-shield': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Fury of the First','Obdurate Vengeance','Wrathful Conquerors','Disciplined Extermination','Dropship Extraction']},
    'forgefathers-seekers': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Crucible of Battle','Wrathful Inferno','Immolation Protocols','Burning Vengeance','Blazing Earth']},
    'hammer-of-avernii': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Ruthless Butchery','Dominator Beacon','Cogitated Ferocity','Augmetic Fortitude','Dropship Extraction']},
    'shadowmark-talon': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Lay Low the Tyrants','Feint and Thrust','Stunning Fusillade','Raptorial Vigilance','Into Darkness']},
    'spearpoint-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Spear Thrust and Sabre Swing','Mobile Lethality',"Hunter's Instincts",'Evasive Manoeuvres','Withdraw and Regroup']},


    // Black Templars -------------------------------------------------------
    // New Recruit remains authoritative for selected roster composition,
    // Detachment Rules, attachments and wargear. These entries provide
    // concise printable reference data that ROSZ does not always include.
    'marshals-household': {
      id:'marshals-household', name:"Marshal's Household", faction:'Black Templars', chapters:['black-templars'],
      disposition:'Priority Assets', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Faith-Fuelled Resolve',text:'Friendly Sword Brethren Squad units have +1 Objective Control. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Fervent Exemplars (Upgrade)',points:10,text:'Sword Brethren Squad unit only. Add 1 to Charge rolls made for this unit.'},
        {kind:'enhancement',name:'Inheritors of Sigismund (Upgrade)',points:15,text:'Sword Brethren Squad unit only. This unit has Fights First.'}
      ],
      stratagems:[
        stratagem('Blade of Detestation',1,'Charge phase','When a friendly Sword Brethren Squad unit ends a Charge move.','That Sword Brethren Squad unit.','Select one engaged enemy unit. Roll one D6 for each model in your unit engaged with it; each 4+ inflicts 1 mortal wound, to a maximum of 6 mortal wounds.'),
        stratagem('Slayers of Abominations',1,'Fight phase','When a friendly Sword Brethren Squad unit is selected to fight.','That Sword Brethren Squad unit.','Until the end of the phase, its melee attacks that target a Monster or Vehicle unit have +2 Strength.'),
        stratagem('Unsparing Execution',1,"Opponent’s Movement phase",'When an enemy unit engaged with a friendly Sword Brethren Squad unit is selected to Fall Back.','That Sword Brethren Squad unit.','The enemy unit must use the Desperate Escape mode. If that enemy unit is Battle-shocked, subtract 1 from its Hazard rolls.')
      ]
    },
    'the-living-miracle': {
      id:'the-living-miracle', name:'The Living Miracle', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Disruption', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Anointed Champion',text:'When a friendly Emperor’s Champion unit is selected to fight, that model can re-roll one Hit roll and one Wound roll for its melee attacks. Enhancements selected from this detachment do not count towards the total number of Enhancements in your army. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Guiding Omens',points:15,text:'Emperor’s Champion model only. At the start of the first battle round, select up to three listed omen abilities for this model for the battle; the imported New Recruit enhancement remains authoritative for the chosen options and their full text.'}
      ],
      stratagems:[]
    },
    'wrathful-procession': {
      id:'wrathful-procession', name:'Wrathful Procession', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Take and Hold', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Chant of Deathless Devotion',text:'Friendly Chaplain units have a 5+ invulnerable save against ranged attacks. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Adaptable Executioner',points:20,text:'Execrator model only. When this unit is selected to fight, choose Cleave 1 or Precision for this model’s melee attacks.'},
        {kind:'enhancement',name:'Benediction of Fury',points:15,text:'Chaplain model only. This model’s melee attacks have Devastating Wounds.'}
      ],
      stratagems:[
        stratagem('Castigate the Demagogues',1,'Fight phase','When a friendly Chaplain unit is selected to fight.','That Chaplain unit.','Until the end of the phase, its melee attacks have Precision.'),
        stratagem('Fuelled By Faith',1,'Any phase','When a friendly Chaplain unit suffers a mortal wound.','That Chaplain unit.','Until the end of the phase, that unit has Feel No Pain 4+ against mortal wounds.'),
        stratagem('Rite of Perfervid Wrath',1,'Fight phase','When a friendly Chaplain unit is selected to fight.','That Chaplain unit.','Until the end of the phase, its melee attacks have +1 Strength.')
      ]
    },
    'companions-of-vehemence': {
      id:'companions-of-vehemence', name:'Companions of Vehemence', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Purge the Foe', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Righteous Fervour',text:'Re-roll Advance and Charge rolls made for Adeptus Astartes units from your army. The army can include Black Templars units, but cannot include Adeptus Astartes units drawn from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Incendiary Animus',points:25,text:'Chaplain or Judiciar model only. Improve the Armour Penetration characteristic of melee weapons equipped by models in the bearer’s unit by 1.'},
        {kind:'enhancement',name:'Merciless Denunciation',points:25,text:'Chaplain or Judiciar model only. Each time a model in the bearer’s unit makes a melee attack, you can re-roll the Hit roll.'},
        {kind:'enhancement',name:'Oathbound Exemplar',points:15,text:'Adeptus Astartes Infantry model only. Add 1 to Advance rolls made for the bearer’s unit. If the mission uses Actions, that unit can start an Action in a turn in which it Advanced.'},
        {kind:'enhancement',name:'Zealous Vanguard',points:20,text:'Adeptus Astartes model only. Models in the bearer’s unit have Scouts 6 inches.'}
      ],
      stratagems:[
        stratagem('Devout Push',1,'Fight phase','During the Fight phase.','One Adeptus Astartes Infantry unit that has not been selected to fight this phase.','Until the end of the phase, each model in the unit can move up to 6 inches when it Piles In or Consolidates instead of up to 3 inches.','A unit cannot be targeted with this and Hearts Hardened to Duty in the same phase unless it has Chaplain or Judiciar.'),
        stratagem('Hearts Hardened to Duty',1,'Fight phase','Just before an Adeptus Astartes Infantry unit Consolidates.','That Adeptus Astartes Infantry unit.','Until the end of the phase, its models do not need to end Consolidation moves closer to the closest enemy model or unit.'),
        stratagem('For The Emperor’s Honour!',1,'Fight phase','During the Fight phase.','One Adeptus Astartes Infantry unit that has not been selected to fight this phase.','Until the end of the phase, melee weapons equipped by models in that unit have Precision.'),
        stratagem('Pious Enmity',1,'Fight phase','During the Fight phase.','One Chaplain or Judiciar unit that has not been selected to fight this phase.','Until the end of the phase, re-roll Hit rolls of 1 for its melee attacks. If the target is a Monster or Vehicle, also re-roll Wound rolls of 1.'),
        stratagem('Heresy Begets Retribution',1,"Opponent’s Movement phase",'Just after an enemy unit ends a Normal, Advance or Fall Back move.','One Chaplain or Judiciar unit within 8 inches of that enemy unit and not within Engagement Range.','That unit can make a Surge move of up to D6 inches.'),
        stratagem('Dread Crusaders',1,"Opponent’s Charge phase",'Just after an enemy unit declares a charge.','One Adeptus Astartes Infantry unit selected as a target of that charge.','That enemy unit must take a Battle-shock test, subtracting 1 from the result.')
      ]
    },
    'godhammer-assault-force': {
      id:'godhammer-assault-force', name:'Godhammer Assault Force', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Purge the Foe', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Shock and Awe',text:'When an Adeptus Astartes unit declares a charge after disembarking from a Transport this turn, select one charge target; it must take a Battle-shock test. Each time a model in an Adeptus Astartes unit makes a melee attack after disembarking from a Transport this turn, add 1 to the Hit roll.'}],
      enhancements:[
        {kind:'enhancement',name:'Augury Servo-Host',points:15,text:'Adeptus Astartes model only. At the start of your Shooting phase, select one visible enemy unit within 12 inches of the bearer; until the end of the phase, models in that unit cannot have the Benefit of Cover.'},
        {kind:'enhancement',name:'Battle-Psalm Precentor',points:10,text:'Adeptus Astartes model only. When the bearer’s unit declares a charge and an enemy takes a Battle-shock test because of Shock and Awe, subtract 1 from that test.'},
        {kind:'enhancement',name:'Herald of Sacred Slaughter',points:15,text:'Adeptus Astartes model only. If the bearer starts the battle embarked within a Dedicated Transport, that Dedicated Transport has Scouts 9 inches.'},
        {kind:'enhancement',name:'Paragon of Fury',points:25,text:'Adeptus Astartes model only. Add 2 to the Strength characteristic of the bearer’s melee weapons. If the bearer disembarked from a Transport this turn, add 1 to the Damage characteristic of its melee attacks.'}
      ],
      stratagems:[
        stratagem('A Ceaseless Cause',1,'End of Fight phase','At the end of the Fight phase.','One Adeptus Astartes Infantry unit that was eligible to fight this phase.','If that unit is not within Engagement Range, it can make a Normal move of up to 6 inches.','It cannot embark within a Transport at the end of this move if it disembarked from a Transport this turn.'),
        stratagem('Uncompromising Egress',1,'Movement phase','During your Movement phase.','One Land Raider model that has not been selected to move this phase.','One Adeptus Astartes unit embarked within it can disembark and be set up wholly within 6 inches of the Land Raider, including within Engagement Range of enemy units.'),
        stratagem('Gauntlet of The God-Emperor',1,'Movement phase','During your Movement phase.','One Adeptus Astartes Vehicle model that has not been selected to move this phase.','Until the end of the phase, when it makes a Normal or Advance move it can move horizontally through terrain features.'),
        stratagem('Focused Hatred',1,'Charge phase','Just after you make a Charge roll for an Adeptus Astartes unit that disembarked from a Transport this turn.','That Adeptus Astartes unit.','Until the end of the phase, when the unit makes a Charge move, its models can move through models, but can only end within Engagement Range of units it declared a charge against.'),
        stratagem('Condemnatory Info-Screed',1,'Fight phase','During your Fight phase.','One Adeptus Astartes unit that has not been selected to fight this phase.','Until the end of the phase, if a model disembarked from a Transport this turn, re-roll Wound rolls of 1 for its attacks; if that Transport has the Land Raider keyword, re-roll the Wound roll instead.'),
        stratagem('Blessed Hull',2,"Opponent’s Shooting phase",'Just after an enemy unit has selected its targets.','One Adeptus Astartes Vehicle unit selected as a target of one or more attacks.','Until the end of the phase, each time an attack is allocated to a model in that unit, subtract 1 from the Damage characteristic of that attack.')
      ]
    },
    'vindication-task-force': {
      id:'vindication-task-force', name:'Vindication Task Force', faction:'Black Templars', chapters:['black-templars'],
      disposition:'Priority Assets', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Purge and Sanctify',text:'When an attack targets an Ancient unit within range of one or more objective markers and that attack’s Strength is greater than the unit’s Toughness, subtract 1 from the Wound roll. When a friendly Crusader Squad makes a Surge move, it can move towards the closest objective instead of selecting a normal Surge target.'}],
      enhancements:[
        {kind:'enhancement',name:'Consecrating Aura',points:25,text:'Adeptus Astartes model only. Models in the bearer’s unit have a 5+ invulnerable save.'},
        {kind:'enhancement',name:'Imperialis of the Eternal Crusade',points:15,text:'Ancient model only. When an enemy unit selects the bearer’s unit as a charge target, subtract 2 from that Charge roll; this is not cumulative with other negative Charge modifiers.'},
        {kind:'enhancement',name:'Orb of the Emperor’s Aegis',points:10,text:'Adeptus Astartes model only. Models in the bearer’s unit have Deep Strike.'},
        {kind:'enhancement',name:'Warden of Honour',points:20,text:'Crusade Ancient model only. While the bearer is leading a unit, add 1 to D6 rolls made for its Vengeful Exhortation ability.'}
      ],
      stratagems:[
        stratagem('Refusal to Yield',1,'Any phase','Just after an Ancient model from your army is destroyed.','That Ancient model, even though it was just destroyed.','At the end of the phase, set the model back up as close as possible to where it was destroyed, unengaged, with its full wounds remaining.','The same model cannot be targeted with this Stratagem more than once per battle.'),
        stratagem('Litanies of Purgation',1,'Fight phase','During the Fight phase.','One Adeptus Astartes unit that has not been selected to fight this phase.','Until the end of the phase, improve the Armour Penetration characteristic of an attack by 1 if the attacking unit or target unit is within range of one or more objective markers.'),
        stratagem('Spoor of the Unholy',1,'Shooting or Fight phase','During your Shooting phase or the Fight phase.','One Adeptus Astartes unit that has not been selected to shoot or fight this phase.','Until the end of the phase, its ranged weapons have Ignores Cover and its models can ignore modifiers to Ballistic Skill, Weapon Skill and Hit rolls.'),
        stratagem('Reclaim Our Honour!',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit destroys an Ancient model that has not been targeted with Refusal to Yield this phase.','One Adeptus Astartes unit visible to that enemy unit.','Until the end of the battle, each time an Adeptus Astartes model from your army attacks that enemy unit, add 1 to the Hit roll.','You cannot target that Ancient model with Refusal to Yield this phase.'),
        stratagem('Recitation of the Revered',1,"Opponent’s Shooting phase",'Just after an enemy unit has selected its targets.','One Ancient unit selected as a target of one or more attacks.','Until the end of the phase, subtract 1 from Hit rolls for attacks that target that unit.'),
        stratagem('Perfervid Intervention',2,"End of opponent’s Charge phase",'At the end of your opponent’s Charge phase.','One Adeptus Astartes unit within 6 inches of one or more enemy units that would be eligible to declare a charge against them.','That unit now declares and resolves a charge that only targets one or more of those enemy units.','Even if successful, the unit does not receive a Charge bonus this turn.')
      ]
    },

    // Dark Angels ---------------------------------------------------------
    // New Recruit remains authoritative for the selected Detachment Rule.
    // These entries provide the current compact printable reference for
    // Enhancements and Stratagems when the ROSZ roster does not include them.
    'dark-age-arsenal': {
      id:'dark-age-arsenal', name:'Dark Age Arsenal', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Priority Assets', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Invocations of Ancient Fury',text:'Plasma weapon profiles used by friendly Adeptus Astartes units gain +1 Strength. The army can include Dark Angels units, but cannot include Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Entreaty of Perpetual Ardour (Upgrade)',points:15,text:'Hellblaster Squad only. Its snap shooting attacks hit on unmodified Hit rolls of 5+.'},
        {kind:'enhancement',name:'Petition of Stability (Upgrade)',points:15,text:'Adeptus Astartes unit only. Add 6 inches to the Range characteristic of its plasma attacks.'}
      ],
      stratagems:[
        stratagem('Searing Bursts',1,'Shooting phase','After a friendly Hellblaster Squad has shot.','That Hellblaster Squad.','Select one enemy unit hit by its plasma ranged attacks. Until the start of your next turn, subtract 2 inches from that enemy unit’s Move characteristic.'),
        stratagem('No Sacrifice Too Great',1,'Shooting phase','When a friendly Adeptus Astartes unit is selected to shoot.','That Adeptus Astartes unit.','Until the end of the phase, add 1 to the Strength characteristic of its Hazardous plasma ranged attacks.'),
        stratagem('Revelation of Guilt',1,'Shooting phase','When a friendly Adeptus Astartes unit is selected to shoot.','That Adeptus Astartes unit.','Until the end of the phase, add 1 to Hit rolls for its plasma ranged attacks.')
      ]
    },
    'darkflight-pursuit': {
      id:'darkflight-pursuit', name:'Darkflight Pursuit', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Reconnaissance', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Black-winged Vigilance',text:'Ranged attacks made by friendly Ravenwing Fly units have Ignores Cover. The army can include Dark Angels units, but cannot include Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Nightforged Battery (Upgrade)',points:15,text:'Land Speeder Vengeance only. Re-roll rolls that determine a weapon’s Attacks characteristic and re-roll Hazard rolls for this unit.'},
        {kind:'enhancement',name:'Thundercowl Turbines (Upgrade)',points:15,text:'Ravenwing Fly unit only. In your first Movement phase, this unit can make an ingress move.'}
      ],
      stratagems:[
        stratagem('Wings of Shadow',1,"Opponent’s Shooting phase",'When an enemy unit targets a friendly Ravenwing Fly unit.','That Ravenwing Fly unit.','Until the end of the phase, that unit has Stealth.'),
        stratagem('Skyborne Surveillance',1,'Shooting phase','After a friendly Ravenwing Fly unit has shot.','That Ravenwing Fly unit.','Until the end of the phase, visible enemy units within 6 inches of it have +3 inches Detection Range.'),
        stratagem('We Are Vengeance',1,"Opponent’s Shooting phase",'After an enemy unit that targeted a friendly unengaged Ravenwing Fly unit has shot.','That Ravenwing Fly unit.','That unit can make a Normal move of up to D3+3 inches.')
      ]
    },
    'interrogation-conclave': {
      id:'interrogation-conclave', name:'Interrogation Conclave', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Take and Hold', dp:1, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Dread Catechism',text:'In the Fight phase, when a friendly Chaplain unit destroys an enemy unit, enemy units within 6 inches of that Chaplain make a Battle-shock roll. Enemy units within 6 inches of a friendly Chaplain also have -1 Leadership. The army can include Dark Angels units, but cannot include Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Inescapable Interrogation',points:20,text:'Chaplain model only. Ranged attacks made by the bearer’s unit have Ignores Cover.'},
        {kind:'enhancement',name:'Limitless Zeal',points:10,text:'Chaplain model only. Add 1 to Charge rolls made for the bearer’s unit.'}
      ],
      stratagems:[
        stratagem('Terrifying Zeal',1,'Charge phase','When a friendly Chaplain unit ends a Charge move.','That Chaplain unit.','Select one engaged enemy unit other than a Monster or Vehicle. It makes a Leadership roll; if that roll fails, subtract 1 from Hit rolls for its attacks until the end of the turn.'),
        stratagem('Exacting Punishment',1,'Shooting or Fight phase','When a friendly Chaplain unit is selected to attack.','That Chaplain unit.','Until the end of the phase, its attacks have Precision.'),
        stratagem('Wages of Cowardice',1,"Opponent’s Movement phase",'When an enemy unit that was engaged with a friendly Chaplain ends a Fall Back move and that Chaplain is now unengaged.','That Chaplain unit.','That unit can make a Normal move of up to D3+3 inches.')
      ]
    },
    'company-of-hunters': {
      id:'company-of-hunters', name:'Company of Hunters', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Disruption', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Masters of Manoeuvre',text:'Friendly Adeptus Astartes units can shoot after Falling Back and their ranged attacks have Assault. Friendly Adeptus Astartes Mounted units can also declare a charge after Advancing or Falling Back. Outrider Squad units gain Battleline.'}],
      enhancements:[
        {kind:'enhancement',name:'Master of Manoeuvre',points:15,text:'Ravenwing model only. If the bearer’s unit starts in Strategic Reserves, it does not count toward the Strategic Reserves points limit and treats the battle round as one higher when arriving.'},
        {kind:'enhancement',name:'Master-crafted Weapon',points:10,text:'Ravenwing model only. Melee weapons equipped by the bearer have Precision.'},
        {kind:'enhancement',name:'Mounted Strategist',points:30,text:'Ravenwing model only. Re-roll Advance and Charge rolls made for the bearer’s unit.'},
        {kind:'enhancement',name:'Recon Hunter',points:20,text:'Ravenwing model only. Models in the bearer’s unit have Scouts 9 inches.'}
      ],
      stratagems:[
        stratagem('Hunter’s Trail',1,'Command phase','During the Command phase.','One Ravenwing Mounted unit within range of an objective marker you control.','That objective remains under your control until your opponent’s Level of Control over it is greater than yours at the end of a phase.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Talon Strike',1,'Fight phase','When a friendly Adeptus Astartes unit is selected to fight.','That Adeptus Astartes unit.','Until the end of the phase, its melee attacks have Lance.'),
        stratagem('Death on the Wind',1,'Movement phase','When a friendly Adeptus Astartes unit ends an Advance move.','That Adeptus Astartes unit.','That Advance move does not prevent the unit from being eligible to declare a charge this turn.'),
        stratagem('High-speed Focus',1,"Opponent’s Shooting phase",'Just after an enemy unit selects a Ravenwing unit as a target.','That Ravenwing unit.','Until the end of the phase, subtract 1 from Hit rolls for attacks that target that unit.'),
        stratagem('Rapid Reappraisal',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One Ravenwing unit that is not within Engagement Range.','Remove that unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'inner-circle-task-force': {
      id:'inner-circle-task-force', name:'Inner Circle Task Force', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Priority Assets', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Vowed Target',text:'At the start of your Movement phase, choose a Defensive Footing objective you control or one or more Aggressive Push objectives you do not control as Vowed objectives until your next Movement phase. Deathwing Infantry units add 1 to Wound rolls when attacking units within range of a Vowed objective.'}],
      enhancements:[
        {kind:'enhancement',name:'Champion of the Deathwing',points:15,text:'Deathwing model only. The bearer’s melee weapons have Lethal Hits; while within range of a Vowed objective, unmodified Hit rolls of 5+ are Critical Hits.'},
        {kind:'enhancement',name:'Deathwing Assault',points:30,text:'Deathwing model with Deep Strike only. The bearer’s unit can arrive using Deep Strike in the first, second or third Movement phase regardless of mission rules.'},
        {kind:'enhancement',name:'Eye of the Unseen',points:10,text:'Deathwing model only. Each time you target the bearer’s unit with a Stratagem, roll one D6, adding 1 within range of a Vowed objective; on 5+, gain 1CP.'},
        {kind:'enhancement',name:'Singular Will',points:20,text:'Deathwing model only. When the bearer’s unit Piles In or Consolidates, its models can move an additional 3 inches.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Martial Mastery',1,'Fight phase','When a Deathwing Infantry unit that has not fought is selected.','That Deathwing Infantry unit.','Until the end of the phase, re-roll Wound rolls of 1. If the unit is within range of a Vowed objective, re-roll all Wound rolls instead.'),
        stratagem('Duty Unto Death',1,'Fight phase','Just after an enemy unit selects a Deathwing unit as a target.','That Deathwing unit.','Until the end of the phase, when an unfought model in the unit is destroyed, roll D6, adding 1 within range of a Vowed objective. On 4+, it can fight after the attacking unit finishes, then is removed.'),
        stratagem('Relic Teleportarium',1,'Movement phase','When a Deathwing unit is arriving using Deep Strike.','That Deathwing unit.','Set the unit up more than 6 inches horizontally from all enemy models.','That unit cannot declare a charge this turn.'),
        stratagem('Wrath of the Lion',1,'Charge phase','Just after a Deathwing Infantry unit ends a Charge move.','That Deathwing Infantry unit.','Select one engaged enemy unit and roll D6 for each model in your unit, adding 1 to each roll if the enemy is within range of a Vowed objective. Each 4+ causes 1 mortal wound, to a maximum of 3.'),
        stratagem('Unmatched Fortitude',1,"Opponent’s Shooting phase",'Just after an enemy unit selects a Deathwing Infantry unit as a target.','That Deathwing Infantry unit.','Until the end of the phase, if an attack’s Strength is greater than the unit’s Toughness, subtract 1 from that attack’s Wound roll.')
      ]
    },
    'lions-blade-task-force': {
      id:'lions-blade-task-force', name:"Lion's Blade Task Force", faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Purge the Foe', dp:2, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:"In the Lion's Claws",text:'Enemy non-Monster/non-Vehicle units Falling Back while within Engagement Range of Ravenwing units take Desperate Escape tests, with -1 to those tests if Battle-shocked. Deathwing units add 2 to Charge rolls when a target is engaged by a friendly Ravenwing unit.'}],
      enhancements:[
        {kind:'enhancement',name:'Calibanite Armaments',points:15,text:'Adeptus Astartes model only. Add 1 to the Damage characteristic of the bearer’s melee weapons.'},
        {kind:'enhancement',name:'Fulgus Magna',points:20,text:'Deathwing model only. Once per battle at the end of your opponent’s turn, if unengaged, remove the bearer’s unit and place it into Strategic Reserves.'},
        {kind:'enhancement',name:'Lord of the Hunt',points:15,text:'Ravenwing model only. The bearer’s unit can shoot and charge after Falling Back, and can re-roll Desperate Escape tests.'},
        {kind:'enhancement',name:'Stalwart Champion',points:15,text:'Captain, Chaplain or Lieutenant only. While the bearer’s unit is not Battle-shocked, add 1 to the Objective Control characteristic of its models.'}
      ],
      stratagems:[
        stratagem('Overpowering Exaction',1,'Command or Fight phase','During your Command phase or at the start of the Fight phase.','One Adeptus Astartes unit.','Select one enemy unit within Engagement Range. It takes a Battle-shock test; if your unit is Deathwing or Ravenwing, subtract 1 from that test.','Once per battle round.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Strength in Unity',1,'Fight phase','Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','If the attacking enemy is engaged with Ravenwing, subtract 1 from its Hit rolls. If it is engaged with Deathwing and its attack Strength exceeds the target’s Toughness, subtract 1 from its Wound rolls.','A unit cannot be targeted by this and Armour of Contempt in the same phase.'),
        stratagem('Knights of Iron',1,'Movement or Charge phase','During your Movement phase or Charge phase.','One Ravenwing unit.','Until the end of the phase, models in that unit can move horizontally through terrain features while making Normal, Advance or Charge moves.'),
        stratagem('Illuminating Fire',1,'Shooting phase','Just after a Ravenwing unit selects targets.','That Ravenwing unit.','Select one enemy unit within 12 inches that it targeted. Until the end of the phase, friendly Deathwing units add 1 to Wound rolls when attacking that enemy unit.'),
        stratagem('Inescapable Wrath',2,"End of opponent’s Charge phase",'At the end of your opponent’s Charge phase.','One Deathwing Infantry or Deathwing Walker unit within 6 inches of an enemy unit that it could charge.','That unit immediately declares and resolves a charge against one or more of those enemy units.','Even if successful, the unit receives no Charge bonus this turn.')
      ]
    },
    'unforgiven-task-force': {
      id:'unforgiven-task-force', name:'Unforgiven Task Force', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Take and Hold', dp:2, status:'ready', availability:'codex', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Grim Resolve',text:'Battle-shocked Adeptus Astartes units from your army have Objective Control 1 instead of 0. In your Command phase, select one Adeptus Astartes unit; until your next Command phase, add 1 to the Objective Control characteristic of its models.'}],
      enhancements:[
        {kind:'enhancement',name:'Pennant of Remembrance',points:10,text:'Ancient model only. While leading a unit, its models have Feel No Pain 6+; while that unit is Battle-shocked, they have Feel No Pain 4+ instead.'},
        {kind:'enhancement',name:'Shroud of Heroes',points:25,text:'Adeptus Astartes model only. The first time the bearer is destroyed, at the end of the phase roll D6; on 2+, return it near where it was destroyed with 3 wounds remaining, or full wounds if it was Battle-shocked.'},
        {kind:'enhancement',name:'Stubborn Tenacity',points:15,text:'Adeptus Astartes model only. While leading a unit below Starting Strength, models add 1 to Hit rolls; if that unit is also Battle-shocked, they also add 1 to Wound rolls.'},
        {kind:'enhancement',name:'Weapons of the First Legion',points:15,text:'Adeptus Astartes model only. Add 1 to the Attacks, Strength and Damage characteristics of the bearer’s melee weapons; add 2 instead while the bearer is Battle-shocked.'}
      ],
      stratagems:[
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Unforgiven Fury',1,'Shooting or Fight phase','When an Adeptus Astartes unit that has not attacked is selected to shoot or fight.','That Adeptus Astartes unit.','Until the end of the phase, its weapons have Lethal Hits. If one or more friendly Adeptus Astartes units are Battle-shocked, unmodified Hit rolls of 5+ are Critical Hits.'),
        stratagem('Intractable',1,'Movement phase','Just after an Adeptus Astartes unit Falls Back.','That Adeptus Astartes unit.','Until the end of the turn, that unit can shoot and declare a charge despite Falling Back.'),
        stratagem('Fire Discipline',1,'Shooting phase','When an Adeptus Astartes unit that has not shot is selected.','That Adeptus Astartes unit.','Until the end of the phase, its ranged weapons have Assault, Heavy and Ignores Cover.'),
        stratagem('Grim Retribution',1,"Opponent’s Shooting phase",'Just after an enemy unit has shot and destroyed one or more models in an Adeptus Astartes unit.','That damaged Adeptus Astartes unit.','That unit can immediately shoot, but can only target the enemy unit that just attacked it and only if it is an eligible target.'),
        stratagem('Unbreakable Lines',2,"Opponent’s Charge phase",'Just after an enemy unit ends a Charge move.','One Adeptus Astartes unit within Engagement Range of that enemy unit.','Until the end of the turn, subtract 1 from Wound rolls for attacks that target your unit.')
      ]
    },
    'wrath-of-the-rock': {
      id:'wrath-of-the-rock', name:'Wrath of the Rock', faction:'Dark Angels', chapters:['dark-angels'],
      disposition:'Priority Assets', dp:3, status:'ready', availability:'public-pack', sourceType:'current-reference-summary',
      rules:[{kind:'detachment',name:'Dutiful Tenacity',text:'When an attack targets a friendly Adeptus Astartes Infantry or Mounted unit and that attack’s Strength is greater than the unit’s Toughness, subtract 1 from the Wound roll.'}],
      enhancements:[
        {kind:'enhancement',name:'Ancient Weapons',points:25,text:'Adeptus Astartes model only. Improve the Strength of the bearer’s melee weapons by 2, and improve their Armour Penetration and Damage by 1.'},
        {kind:'enhancement',name:'Deathwing Assault',points:15,text:'Deathwing model with Deep Strike only. The bearer’s unit can arrive using Deep Strike in the first, second or third Movement phase regardless of mission rules.'},
        {kind:'enhancement',name:'Lord of the Ravenwing',points:10,text:'Ravenwing model only. Re-roll Advance and Charge rolls made for the bearer’s unit.'},
        {kind:'enhancement',name:'Tempered in Battle (Aura)',points:10,text:'Adeptus Astartes model only. Friendly Adeptus Astartes units within 6 inches can re-roll Battle-shock and Leadership tests.'}
      ],
      stratagems:[
        stratagem('Inescapable Justice',2,'Any phase','Just after your Oath of Moment target is destroyed.','One Adeptus Astartes Character unit on the battlefield.','Select one visible enemy unit within 12 inches. It becomes your Oath of Moment target until the start of your next Command phase.'),
        stratagem('Lion’s Will',1,'Command phase','During your Command phase.','One Adeptus Astartes unit within Engagement Range.','Until your next Command phase, add 1 to the Objective Control characteristic of its models. Until the end of the turn, if it is not Deathwing, Ravenwing or Vehicle, also add 1 to its Hit rolls.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects targets.','One targeted Adeptus Astartes unit.','Worsen the Armour Penetration characteristic of attacks targeting that unit by 1 while the attacking unit resolves those attacks.'),
        stratagem('Tactical Mastery',1,'Movement phase','During your Movement phase.','One Adeptus Astartes unit.','Until the end of the turn, that unit can shoot and charge after Advancing. If it has Ravenwing, it can also shoot and charge after Falling Back.'),
        stratagem('Relics of the Dark Age',1,'Shooting phase','When an Adeptus Astartes Infantry or Mounted unit that has not shot is selected.','That Adeptus Astartes Infantry or Mounted unit.','Until the end of the phase, add 2 to the Strength characteristic of ranged weapons equipped by models in that unit.'),
        stratagem('Leonine Aggression',1,"End of opponent’s Charge phase",'At the end of your opponent’s Charge phase.','One Adeptus Astartes unit within 3 inches of an enemy unit, or one Deathwing unit within 6 inches of an enemy unit.','That unit immediately declares and resolves a charge against one or more of those enemy units.','Even if successful, the unit receives no Charge bonus this turn.')
      ]
    },

    'marshals-household': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Blade of Detestation','Slayers of Abominations','Unsparing Execution']},
    'the-living-miracle': {detachmentRules:{min:1}, enhancements:1, stratagems:0},
    'wrathful-procession': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Castigate the Demagogues','Fuelled By Faith','Rite of Perfervid Wrath']},
    'companions-of-vehemence': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Devout Push','Hearts Hardened to Duty','For The Emperor’s Honour!','Pious Enmity','Heresy Begets Retribution','Dread Crusaders']},
    'godhammer-assault-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['A Ceaseless Cause','Uncompromising Egress','Gauntlet of The God-Emperor','Focused Hatred','Condemnatory Info-Screed','Blessed Hull']},
    'vindication-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Refusal to Yield','Litanies of Purgation','Spoor of the Unholy','Reclaim Our Honour!','Recitation of the Revered','Perfervid Intervention']},

    'dark-age-arsenal': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Searing Bursts','No Sacrifice Too Great','Revelation of Guilt']},
    'darkflight-pursuit': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Wings of Shadow','Skyborne Surveillance','We Are Vengeance']},
    'interrogation-conclave': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Terrifying Zeal','Exacting Punishment','Wages of Cowardice']},
    'company-of-hunters': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Hunter’s Trail','Armour of Contempt','Talon Strike','Death on the Wind','High-speed Focus','Rapid Reappraisal']},
    'inner-circle-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Martial Mastery','Duty Unto Death','Relic Teleportarium','Wrath of the Lion','Unmatched Fortitude']},
    'lions-blade-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Overpowering Exaction','Armour of Contempt','Strength in Unity','Knights of Iron','Illuminating Fire','Inescapable Wrath']},
    'unforgiven-task-force': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Unforgiven Fury','Intractable','Fire Discipline','Grim Retribution','Unbreakable Lines']},
    'wrath-of-the-rock': {detachmentRules:{min:1}, enhancements:4, stratagems:6, stratagemNames:['Inescapable Justice','Lion’s Will','Armour of Contempt','Tactical Mastery','Relics of the Dark Age','Leonine Aggression']},
    'vengeful-hosts': {detachmentRules:{min:1}, enhancements:2, stratagems:3, stratagemNames:['Meteoric Onslaught','Know No Fear','Purge by Sectors']}
  };

  for (const [id, expected] of Object.entries(verificationExpectations)) {
    if (detachments[id]) detachments[id].verification = {expected};
  }


  const aliases = {
    'anvil-siege-force-detachment':'anvil-siege-force',
    'saga-of-great-wolf':'saga-of-the-great-wolf',
    'the-saga-of-the-great-wolf':'saga-of-the-great-wolf',
    'first-company-task-force':'first-company-task-force',
    '1st-company-task-force':'first-company-task-force',
    'lions-blade':'lions-blade-task-force',
    'lion-s-blade-task-force':'lions-blade-task-force',
    'marshals-household-detachment':'marshals-household',
    'angelic-host':'the-angelic-host',
    'rage-cursed-onslaught-detachment':'rage-cursed-onslaught'
  };

  const manifest = {
    id:'astartes-forge-rules-library', version:'2.8.0-chapter-scope-first-founding', schemaVersion:'1.1',
    updated:'2026-08-12', language:'en', contentPolicy:'concise-reference',
    readyDetachments:Object.values(detachments).filter(x=>x.status==='ready').length,
    cataloguedDetachments:Object.values(detachments).filter(x=>x.status==='catalogued').length,
    totalDetachments:Object.keys(detachments).length
  };

  const lookupDetachment = (nameOrId='') => {
    const raw = normalise(nameOrId);
    const id = aliases[raw] || raw;
    const item = detachments[id];
    return item ? JSON.parse(JSON.stringify(item)) : null;
  };

  global.ASTARTES_RULES_LIBRARY = Object.freeze({
    manifest, detachments, aliases, normalise, lookupDetachment, officialSync,
    listDetachments: () => Object.values(detachments).map(x=>({...x}))
  });
})(window);
