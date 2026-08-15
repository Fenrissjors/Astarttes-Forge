(function(){
  const REGISTRY=window.ASTARTES_CHAPTER_VISUAL_REGISTRY||null;
  const A='assets/art/illustrated/';
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
  Object.values(packs).forEach(pack=>{ pack.engine='illustrated-codex'; pack.layers=pack.slots; pack.compositions={hero:true,standard:true,dense:true}; });
  
  Object.values(packs).forEach(pack=>{
    pack.engine='a4-illustrated-frame';
    pack.slots = pack.slots || {};
    // v3.0.1 slot aliases. Existing assets stay usable, richer raster/transparent
    // assets can be dropped in later without renderer changes.
    if(pack.slots.header && !pack.slots.topFrame) pack.slots.topFrame=pack.slots.header;
    if(pack.slots.corner && !pack.slots.topLeft) pack.slots.topLeft=pack.slots.corner;
    if(pack.slots.footer && !pack.slots.bottomFrame) pack.slots.bottomFrame=pack.slots.footer;
    if(pack.slots.watermark && !pack.slots.background) pack.slots.background=pack.slots.watermark;
    if(pack.slots.accent && !pack.slots.rightRail) pack.slots.rightRail=pack.slots.accent;
  });

  
  if(packs['space-wolves']){
    Object.assign(packs['space-wolves'].slots,{
      topFrame:'assets/art/space-wolves/top-frame.png',
      topLeft:'assets/art/space-wolves/top-left.png',
      leftRail:'assets/art/space-wolves/left-rail.png',
      rightRail:'assets/art/space-wolves/right-rail.png',
      bottomFrame:'assets/art/space-wolves/bottom-frame.png',
      background:'assets/art/space-wolves/rune-watermark.png'
    });
  }


  // V3.0.3: convert every legacy slot array into a plain named object.
  Object.values(packs).forEach(pack=>{
    const old=pack.slots||[];
    const named={};
    if(Array.isArray(old)){
      old.forEach(item=>{if(item?.slot && item?.src) named[item.slot]=item.src;});
      Object.keys(old).filter(k=>Number.isNaN(Number(k))).forEach(k=>{
        if(typeof old[k]==='string') named[k]=old[k];
      });
    }else Object.assign(named,old);
    const alias={header:'topFrame',corner:'topLeft',footer:'bottomFrame',watermark:'background',accent:'rightRail'};
    Object.entries(alias).forEach(([a,b])=>{if(named[a]&&!named[b])named[b]=named[a];});
    pack.slots=named;
  });


  // v3.0.24: the visual registry owns Chapter labels and seamless A4 frame
  // routing. Legacy illustrated slots remain fallback data until each Chapter
  // receives its own full-page frame asset.
  if(REGISTRY?.list){
    REGISTRY.list().forEach(profile=>{
      const pack=packs[profile.id] || (packs[profile.id]={id:profile.id,slots:{}});
      pack.label=profile.artwork?.label || pack.label || profile.name;
      pack.frameGeometryMaster=profile.artwork?.geometryMaster || REGISTRY.a4GeometryMaster || '';
      const frame=REGISTRY.frameAsset?.(profile.id,'a4Portrait') || '';
      if(frame){
        pack.frameAssets={...(pack.frameAssets||{}),a4Portrait:frame};
        // A seamless physical renderer and legacy slot layers must never stack.
        pack.slots={};
      }
    });
  }

  window.ASTARTES_DECORATION_PACK_LIBRARY={
    version:'3.0.53',packs,
    resolve(chapter='generic-astartes'){
      const key=REGISTRY?.resolveKey?.(chapter) || chapter;
      return packs[key]||packs['generic-astartes'];
    }
  };
})();
