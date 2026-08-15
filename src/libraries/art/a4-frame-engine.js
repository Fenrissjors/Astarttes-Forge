
(function(){
  const MM_PER_INCH = 25.4;
  const A4 = Object.freeze({ widthMm:210, heightMm:297 });

  const frameSchema = Object.freeze({
    version:'3.0.54',
    page:A4,
    safeArea:{
      topMm:18,
      rightMm:15,
      bottomMm:20,
      leftMm:15
    },
    bleedMm:3,
    zones:{
      topFrame:      {x:0,   y:0,   w:210, h:27, z:20, role:'frame'},
      topLeft:       {x:0,   y:0,   w:40,  h:55, z:26, role:'ornament'},
      topRight:      {x:165, y:0,   w:45,  h:55, z:28, role:'emblem-housing'},
      leftRail:      {x:0,   y:23,  w:19,  h:250,z:18, role:'frame'},
      rightRail:     {x:191, y:23,  w:19,  h:250,z:18, role:'frame'},
      lowerLeft:     {x:0,   y:238, w:55,  h:59, z:22, role:'ornament'},
      bottomFrame:   {x:18,  y:270, w:174, h:27, z:24, role:'frame'},
      background:    {x:15,  y:18,  w:180, h:259,z:1,  role:'watermark'},
      heroArtwork:   {x:118, y:22,  w:73,  h:92, z:8,  role:'artwork'},
      standardAccent:{x:149, y:34,  w:42,  h:68, z:7,  role:'artwork'}
    }
  });

  function cssMm(value){ return `${Number(value||0)}mm`; }

  function resolveChapter(unit={}, importedMeta={}) {
    const registry=window.ASTARTES_CHAPTER_VISUAL_REGISTRY||null;
    const values=[unit.chapter,importedMeta.chapter,...(unit.factionKeywords||[]),...(unit.keywords||[])].filter(Boolean);
    if(registry?.detectKey){
      const detected=registry.detect(values);
      if(detected) return detected.key;
      const explicit=String(unit.chapter||importedMeta.chapter||'').trim();
      if(explicit) return registry.resolveKey(explicit);
      return registry.genericKey||'generic-astartes';
    }
    const explicit = String(unit.chapter || importedMeta.chapter || '').trim();
    if(explicit) return explicit.toLowerCase().replace(/\s+/g,'-');
    const faction = [...(unit.factionKeywords||[]), ...(unit.keywords||[])].map(x=>String(x).toLowerCase());
    const known=['space-wolves','blood-angels','dark-angels','black-templars','ultramarines','imperial-fists','salamanders','iron-hands','raven-guard','white-scars'];
    return known.find(k=>faction.some(x=>x.includes(k.replace(/-/g,' ')))) || 'generic-astartes';
  }

  function makeLayer(slotName, asset, packId){
    const zone=frameSchema.zones[slotName];
    if(!zone || !asset) return null;
    const el=document.createElement('img');
    el.className=`codex-art-layer codex-art-${slotName}`;
    el.alt='';
    el.setAttribute('aria-hidden','true');
    el.dataset.slot=slotName;
    el.dataset.pack=packId;
    if(typeof asset!=='string' || !asset.trim()) return null;
    el.src=asset;
    Object.assign(el.style,{
      left:cssMm(zone.x), top:cssMm(zone.y),
      width:cssMm(zone.w), height:cssMm(zone.h),
      zIndex:String(zone.z)
    });
    return el;
  }


  function normaliseSlots(pack={}){
    const raw=pack.slots||{};
    const out={};
    // Legacy v2.9/v3.0 packs used [{slot,src}]. New packs use named slots.
    if(Array.isArray(raw)){
      raw.forEach(item=>{
        if(item && typeof item==='object' && item.slot && item.src) out[item.slot]=item.src;
      });
      // Arrays can also carry named properties added by migration code.
      Object.keys(raw).filter(k=>Number.isNaN(Number(k))).forEach(k=>{
        if(typeof raw[k]==='string') out[k]=raw[k];
      });
    }else{
      Object.entries(raw).forEach(([k,v])=>{
        if(typeof v==='string') out[k]=v;
        else if(v && typeof v==='object' && v.src) out[k]=v.src;
      });
    }
    const alias={
      header:'topFrame',
      corner:'topLeft',
      footer:'bottomFrame',
      watermark:'background',
      accent:'rightRail'
    };
    Object.entries(alias).forEach(([oldKey,newKey])=>{
      if(out[oldKey] && !out[newKey]) out[newKey]=out[oldKey];
    });
    return out;
  }

  function mountFrame(card, pack, options={}){
    if(!card || !pack) return;
    card.querySelectorAll('.codex-art-layer').forEach(n=>n.remove());
    const artRoot=card.querySelector('.codex-art-root') || document.createElement('div');
    artRoot.className='codex-art-root';
    if(!artRoot.parentNode) card.prepend(artRoot);

    const composition=card.dataset.codexComposition || options.composition || 'standard';
    const slots=normaliseSlots(pack);
    const enabled=options.enabledSlots || null;

    Object.entries(slots).forEach(([slot,asset])=>{
      if(enabled && enabled[slot]===false) return;
      if(slot==='heroArtwork' && composition!=='hero') return;
      if(slot==='standardAccent' && composition==='hero') return;
      const layer=makeLayer(slot,asset,pack.id||'unknown');
      if(layer) artRoot.append(layer);
    });

    card.dataset.a4Frame='true';
    card.dataset.artPack=pack.id||'unknown';
    card.style.setProperty('--safe-top',cssMm(frameSchema.safeArea.topMm));
    card.style.setProperty('--safe-right',cssMm(frameSchema.safeArea.rightMm));
    card.style.setProperty('--safe-bottom',cssMm(frameSchema.safeArea.bottomMm));
    card.style.setProperty('--safe-left',cssMm(frameSchema.safeArea.leftMm));
  }


  function frameAssetFor(pack,format='a4Portrait'){return pack?.frameAssets?.[format]||'';}
  function mountSeamlessFrame(card,pack,options={}){
    if(!card||!pack)return null;
    card.querySelectorAll(':scope > .print-page-surface,:scope > .codex-seamless-frame,:scope > .codex-art-root,:scope > .codex-art-layer').forEach(x=>x.remove());
    card.dataset.a4Frame='true';
    card.dataset.artPack=pack.id||'generic-astartes';
    if(pack.frameGeometryMaster) card.dataset.frameGeometry=pack.frameGeometryMaster;
    else card.removeAttribute('data-frame-geometry');
    const format=options.format||'a4Portrait';
    const src=frameAssetFor(pack,format);
    if(!src||options.enabled===false)return null;

    // v3.0.24: explicit physical layer stack. The selected print surface is
    // its own A4 layer behind the transparent artwork; structural content
    // containers never paint a page-sized background.
    const surface=document.createElement('div');
    surface.className='print-page-surface';
    surface.setAttribute('aria-hidden','true');
    card.prepend(surface);

    const el=document.createElement('img');
    el.className='codex-seamless-frame';
    el.alt='';
    el.setAttribute('aria-hidden','true');
    el.dataset.frameFormat=format;
    el.src=src;
    Object.assign(el.style,{
      position:'absolute',
      inset:'0',
      width:'100%',
      height:'100%',
      objectFit:'fill',
      objectPosition:'center',
      pointerEvents:'none',
      zIndex:'10'
    });
    surface.after(el);
    return el;
  }

  function artworkGeometryFor(chapter=''){
    return window.ASTARTES_FRAME_GEOMETRY_LIBRARY?.resolve?.(chapter)||null;
  }
  function geometryBoxMm(chapter='',boxName='titleBoxPx'){
    const geometry=artworkGeometryFor(chapter);
    const box=geometry?.[boxName];
    return box ? window.ASTARTES_FRAME_GEOMETRY_LIBRARY?.boxToMm?.(box,geometry.canvasPx) : null;
  }

  window.ASTARTES_A4_FRAME_ENGINE={
    version:'3.0.46',
    frameSchema,
    resolveChapter,
    normaliseSlots,
    mountFrame,
    mountSeamlessFrame,
    frameAssetFor,
    artworkGeometryFor,geometryBoxMm,
    mmToPx(mm,dpi=96){ return mm/MM_PER_INCH*dpi; }
  };
})();
