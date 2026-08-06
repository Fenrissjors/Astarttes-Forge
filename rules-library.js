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
      enhancements:[],
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
      disposition:'Purge the Foe', dp:1, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'The Great Wolf Watches',text:'At the end of your opponent’s Charge phase, eligible Adeptus Astartes Infantry and Walker units within 6 inches of one or more enemy units can declare a counter-charge. A successful counter-charge does not grant a Charge bonus. While they are not Battle-shocked, Adeptus Astartes Terminator models also add 1 to their Objective Control characteristic. Your army can include Space Wolves units, but no Adeptus Astartes units from another Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Wolves’ Wisdom',text:'Extends the range at which the bearer’s unit can use The Great Wolf Watches.'},
        {kind:'enhancement',name:'Foes’ Fate',text:'Makes it more dangerous for enemy units to Fall Back from the bearer’s Terminator unit.'},
        {kind:'enhancement',name:'Fangrune Pendant',text:'Allows the bearer’s Terminator unit to shoot and charge after Falling Back.'},
        {kind:'enhancement',name:'Longstrider',text:'Allows the bearer’s unit to re-roll Charge rolls.'}
      ],
      stratagems:[
        stratagem('Preytaker’s Eye',1,'Shooting or Fight phase','When an eligible Adeptus Astartes Infantry unit is selected before it shoots or fights.','That Infantry unit.','Choose Lethal Hits or Sustained Hits 1; its weapons gain the selected keyword until the end of the phase.'),
        stratagem('Armour of Contempt',1,"Opponent’s Shooting or Fight phase",'Just after an enemy unit selects its targets.','One Adeptus Astartes unit selected as a target.','Worsen the Armour Penetration of attacks against that unit by 1 while those attacks are resolved.'),
        stratagem('Runes of Claiming',1,'End of your Command phase','At the end of your Command phase.','One Adeptus Astartes Infantry or Walker unit within 3 inches of an objective marker it controls.','That objective remains under your control until the opponent’s Level of Control exceeds yours at the end of a phase.'),
        stratagem('Chilling Howl',1,"Opponent’s Command phase",'During your opponent’s Command phase.','One Adeptus Astartes Terminator unit.','Each enemy unit within 6 inches must take a Battle-shock test; subtract 1 from that test if the enemy unit is Below Half-strength.'),
        stratagem('Stalking Wolves',1,"Opponent’s Shooting phase",'Just after an enemy unit selects its targets.','One Adeptus Astartes Infantry unit selected as a target.','Models in that unit gain Stealth until the end of the phase.'),
        stratagem('Onrushing Storm',1,"End of opponent’s Fight phase",'At the end of your opponent’s Fight phase.','One unengaged Adeptus Astartes Terminator unit.','Remove that unit from the battlefield and place it into Strategic Reserves.')
      ]
    },
    'legends-of-saga-and-song': {
      id:'legends-of-saga-and-song', name:'Legends of Saga and Song', faction:'Space Wolves', chapters:['space-wolves'],
      disposition:'Take and Hold', dp:1, status:'ready', sourceType:'concise-reference',
      rules:[{kind:'detachment',name:'Loping Charge',text:'Friendly Adeptus Astartes Terminator units add 1 to Charge rolls. The army can include Space Wolves units but no units drawn from another Adeptus Astartes Chapter.'}],
      enhancements:[
        {kind:'enhancement',name:'Fierce Example',text:'While the bearer’s unit is within 6 inches of another friendly Space Wolves unit, add 1 to Battle-shock and Leadership tests made for that friendly unit.'},
        {kind:'enhancement',name:'Thirst for Glory',text:'Upgrade that rewards an eligible unit for closing with and defeating the enemy.'}
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
        {kind:'enhancement',name:'Weaver of Sagas',text:'Wolf Priest only. Once per battle round, remove Battle-shock from one friendly unit within 6 inches, or from one Grey Hunters unit within 12 inches.'}
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
    ['blade-of-ultramar','Blade of Ultramar','Adeptus Astartes',['ultramarines'],'Priority Assets',3,'public-pack'],
    ['ceramite-sentinels','Ceramite Sentinels','Adeptus Astartes',['imperial-fists'],'Take and Hold',3,'public-pack'],
    ['emperors-shield',"Emperor\'s Shield",'Adeptus Astartes',['all'],'Priority Assets',2,'public-pack'],
    ['firestorm-assault-force','Firestorm Assault Force','Adeptus Astartes',['all'],'Purge the Foe',2,'codex'],
    ['forgefathers-seekers',"Forgefather\'s Seekers",'Adeptus Astartes',['salamanders'],'Purge the Foe',2,'public-pack'],
    ['gladius-task-force','Gladius Task Force','Adeptus Astartes',['all'],'Priority Assets',3,'codex'],
    ['hammer-of-avernii','Hammer of Avernii','Adeptus Astartes',['iron-hands'],'Priority Assets',2,'public-pack'],
    ['headhunter-task-force','Headhunter Task Force','Adeptus Astartes',['all'],'Priority Assets',2,'public-pack'],
    ['ironstorm-spearhead','Ironstorm Spearhead','Adeptus Astartes',['all'],'Purge the Foe',2,'codex'],
    ['orbital-assault-force','Orbital Assault Force','Adeptus Astartes',['all'],'Take and Hold',2,'public-pack'],
    ['reclamation-force','Reclamation Force','Adeptus Astartes',['all'],'Take and Hold',2,'public-pack'],
    ['shadowmark-talon','Shadowmark Talon','Adeptus Astartes',['raven-guard'],'Disruption',2,'public-pack'],
    ['spearpoint-task-force','Spearpoint Task Force','Adeptus Astartes',['white-scars'],'Disruption',2,'public-pack'],
    ['stormlance-task-force','Stormlance Task Force','Adeptus Astartes',['all'],'Disruption',3,'codex'],
    ['vanguard-spearhead','Vanguard Spearhead','Adeptus Astartes',['all'],'Reconnaissance',2,'codex'],

    // Dark Angels
    ['dark-age-arsenal','Dark Age Arsenal','Dark Angels',['dark-angels'],'Priority Assets',1,'public-pack'],
    ['darkflight-pursuit','Darkflight Pursuit','Dark Angels',['dark-angels'],'Reconnaissance',1,'public-pack'],
    ['interrogation-conclave','Interrogation Conclave','Dark Angels',['dark-angels'],'Purge the Foe',1,'public-pack'],
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


  // Verification expectations are deliberately separate from loaded content.
  // A catalogue entry cannot pass merely because both loaded and expected counts are zero.
  const verificationExpectations = {
    'gladius-task-force': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Honour the Chapter','Only in Death Does Duty End','Adaptive Strategy','Storm of Fire','Squad Tactics']},
    'anvil-siege-force': {detachmentRules:1, enhancements:0, stratagems:6,
      stratagemNames:['Armour of Contempt','Rigid Discipline','Not One Backwards Step','No Threat Too Great','Battle Drill Recall','Hail of Vengeance']},
    'firestorm-assault-force': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Crucible of Battle','Rapid Embarkation','Immolation Protocols','Onslaught of Fire','Burning Vengeance']},
    'ironstorm-spearhead': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Mercy is Weakness','Ancient Fury','Power of the Machine Spirit','Vengeful Animus','Unbowed Conviction']},
    'stormlance-task-force': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Blitzing Fusillade','Full Throttle','Ride Hard, Ride Fast','Wind-swift Evasion','Shock Assault']},
    'vanguard-spearhead': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','A Deadly Prize','Calculated Feint','Strike from the Shadows','Guerrilla Tactics','Surgical Strikes']},
    'first-company-task-force': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Armour of Contempt','Heroes of the Chapter','Legendary Fortitude','Duty and Honour','Orbital Teleportarium','Terrifying Proficiency']},
    'librarius-conclave': {detachmentRules:1, enhancements:5, stratagems:0},
    'fulguris-task-force': {detachmentRules:1, enhancements:2, stratagems:3,
      stratagemNames:['Data-link Augury','Reactive Evasion','Anti-grav Surge']},
    'subversion-assets': {detachmentRules:1, enhancements:2, stratagems:3,
      stratagemNames:['Adaptive Operations','Strike from the Shadows','Cloaked Position']},
    'champions-of-fenris': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Preytaker’s Eye','Armour of Contempt','Runes of Claiming','Chilling Howl','Stalking Wolves','Onrushing Storm']},
    'legends-of-saga-and-song': {detachmentRules:1, enhancements:2, stratagems:3, stratagemNames:['Fangs of the Pack','Chilling Howl','Wings of the Blizzard']},
    'veterans-of-the-fang': {detachmentRules:1, enhancements:2, stratagems:3, stratagemNames:['Blade-keen Senses','Icy Calm','Grizzled Killers']},
    'saga-of-the-beastslayer': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Unbridled Ferocity','Shock Cavalry','Pinning Fire','Thunderous Pursuit','Impetuosity','Coordinated Strike']},
    'saga-of-the-bold': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Inspiring Presence','Champion’s Guidance','Birth of a Saga','Alpha Strike','Heroic Resolve','Countercharge']},
    'saga-of-the-great-wolf': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['The Foe Foreseen','Grimnar’s Command','Fenrisian Ferocity','Unrelenting Hunters','Eye of the Pack','Battle Instincts']},
    'saga-of-the-hunter': {detachmentRules:1, enhancements:4, stratagems:6, stratagemNames:['Envelop and Ensnare','Territorial Advantage','Overwhelming Onslaught','Chosen Prey','Bounding Advance','Marked for Destruction']},
    'vengeful-hosts': {detachmentRules:1, enhancements:2, stratagems:3, stratagemNames:['Meteoric Onslaught','Know No Fear','Purge by Sectors']}
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
    'marshals-household-detachment':'marshals-household'
  };

  const manifest = {
    id:'astartes-forge-rules-library', version:'0.8.0', schemaVersion:'1.0',
    updated:'2026-08-06', language:'en', contentPolicy:'concise-reference',
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
    manifest, detachments, aliases, normalise, lookupDetachment,
    listDetachments: () => Object.values(detachments).map(x=>({...x}))
  });
})(window);
