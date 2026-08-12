(function(){
  const A='assets/ornaments/illustrated/';
  const packs={
    'space-wolves':{id:'space-wolves',label:'Fenris illustrated',slots:[
      {slot:'header',src:A+'space-wolves-ice-crown.svg'},
      {slot:'corner',src:A+'space-wolves-wolf-pelt.svg'},
      {slot:'footer',src:A+'space-wolves-rune-bone.svg'},
      {slot:'watermark',src:A+'space-wolves-rune-watermark.svg'},
      {slot:'accent',src:A+'space-wolves-talismans.svg'}]},
    'ultramarines':{id:'ultramarines',label:'Macragge laurels',slots:[{slot:'corner',src:A+'ultramarines-laurels.svg'},{slot:'watermark',src:A+'ultramarines-watermark.svg'}]},
    'blood-angels':{id:'blood-angels',label:'Sanguinary baroque',slots:[{slot:'corner',src:A+'blood-angels-winged-scroll.svg'},{slot:'watermark',src:A+'blood-angels-watermark.svg'}]},
    'dark-angels':{id:'dark-angels',label:'Unforgiven gothic',slots:[{slot:'corner',src:A+'dark-angels-gothic-scroll.svg'},{slot:'footer',src:A+'dark-angels-seals.svg'}]},
    'black-templars':{id:'black-templars',label:'Crusade reliquary',slots:[{slot:'corner',src:A+'black-templars-chain.svg'},{slot:'footer',src:A+'black-templars-parchment.svg'}]},
    'imperial-fists':{id:'imperial-fists',label:'Bastion plate',slots:[{slot:'header',src:A+'imperial-fists-bastion.svg'},{slot:'corner',src:A+'imperial-fists-rivets.svg'}]},
    'salamanders':{id:'salamanders',label:'Nocturne forge',slots:[{slot:'corner',src:A+'salamanders-scales.svg'},{slot:'footer',src:A+'salamanders-burned-edge.svg'},{slot:'watermark',src:A+'salamanders-watermark.svg'}]},
    'white-scars':{id:'white-scars',label:'Chogorian storm',slots:[{slot:'header',src:A+'white-scars-lightning.svg'},{slot:'corner',src:A+'white-scars-tassel.svg'}]},
    'raven-guard':{id:'raven-guard',label:'Deliverance shadow',slots:[{slot:'corner',src:A+'raven-guard-feathers.svg'},{slot:'watermark',src:A+'raven-guard-watermark.svg'}]},
    'iron-hands':{id:'iron-hands',label:'Medusan machine',slots:[{slot:'corner',src:A+'iron-hands-cog.svg'},{slot:'footer',src:A+'iron-hands-cables.svg'}]},
    'deathwatch':{id:'deathwatch',label:'Watch fortress',slots:[{slot:'corner',src:A+'deathwatch-metal.svg'},{slot:'footer',src:A+'deathwatch-scroll.svg'}]},
    'generic-astartes':{id:'generic-astartes',label:'Astartes gothic',slots:[{slot:'corner',src:A+'generic-gothic.svg'},{slot:'watermark',src:A+'generic-watermark.svg'}]}
  };
  window.ASTARTES_DECORATION_PACK_LIBRARY={
    version:'2.9.3',packs,
    resolve(chapter='generic-astartes'){return packs[chapter]||packs['generic-astartes'];}
  };
})();
