/* Astartes Forge — Tyranids Phase 2 runtime
 * Keeps New Recruit rule ownership intact while removing only known reference
 * explanations that are serialised beside a Tyranids detachment rule.
 *
 * v4 multifaction addition: this file also hosts the first implementation of the
 * faction-neutral Derived Keyword Engine. Detachment effects are declarative;
 * the engine preserves imported source keywords and publishes effective tags to
 * every existing datasheet/rules/print consumer.
 */
(function(global){
  'use strict';

  const activeFaction=()=>{
    try{return global.ASTARTES_ACTIVE_FACTION?.()||state?.factionKey||state?.importedMeta?.factionKey||'';}
    catch(_){return '';}
  };
  const normalise=value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  function cleanTyranidRules(detachment={}){
    if(activeFaction()!=='tyranids') return detachment;
    const detachmentKey=normalise(detachment.name||detachment.id||'');
    const rules=Array.isArray(detachment.rules)?detachment.rules:[];
    const cleaned=rules.filter(rule=>{
      const name=normalise(rule?.name||'');
      // Ambush Predators exports Deep Strike as a reference explanation beside
      // Mindhunger. It is not a second detachment-owned rule.
      if(detachmentKey==='ambush-predators' && name==='deep-strike') return false;
      // Invasion Fleet keyword explanations are already removed by the generic
      // reference filter installed by the shared Orks runtime. Keep this guard
      // as a faction-local fallback in case that implementation changes later.
      if(detachmentKey==='invasion-fleet' && ['sustained-hits','lethal-hits','precision'].includes(name)) return false;
      // Do NOT remove Subterranean Assault's deliberately generic 'Keywords'
      // rule: it changes Mawloc/Trygon keywords and army construction.
      return true;
    });
    return {...detachment,rules:cleaned};
  }

  if(typeof mergeDetachmentLibrary==='function'){
    const previous=mergeDetachmentLibrary;
    mergeDetachmentLibrary=function(detachmentData={}){
      return previous(cleanTyranidRules(detachmentData));
    };
  }

  // Derived Keyword Engine -------------------------------------------------
  // Imported New Recruit tags remain the source-of-truth in baseKeywords.
  // Permanent detachment effects are layered on top and copied back to unit.tags
  // so all existing consumers (cards, print, filters, eligibility, validators)
  // see the same effective keyword set without faction-specific renderer hacks.
  const permanentTimings=new Set(['army-construction','battle-permanent']);
  const effectRegistry=[];

  const uniqueKeywords=values=>{
    const out=[];
    const seen=new Set();
    (values||[]).filter(Boolean).forEach(value=>{
      const text=String(value).trim();
      const key=normalise(text);
      if(!key||seen.has(key)) return;
      seen.add(key); out.push(text);
    });
    return out;
  };

  function registerKeywordEffects(effects=[]){
    (Array.isArray(effects)?effects:[effects]).forEach(effect=>{
      if(!effect||!effect.id||!effect.detachment||!permanentTimings.has(effect.timing)) return;
      const id=normalise(effect.id);
      const index=effectRegistry.findIndex(item=>normalise(item.id)===id);
      const frozen=Object.freeze({...effect,add:Object.freeze([...(effect.add||[])])});
      if(index>=0) effectRegistry[index]=frozen; else effectRegistry.push(frozen);
    });
  }

  function activeDetachmentKeys(){
    try{
      const meta=state?.importedMeta||{};
      const values=[];
      (meta.detachmentsData||[]).forEach(d=>values.push(d?.name,d?.id));
      if(meta.detachmentData){ values.push(meta.detachmentData.name,meta.detachmentData.id); }
      (meta.detachments||[]).forEach(value=>values.push(value));
      if(typeof currentDetachment==='function'){
        const det=currentDetachment(); values.push(det?.name,det?.id);
      }
      return new Set(values.filter(Boolean).map(normalise));
    }catch(_){ return new Set(); }
  }

  function unitMatchesEffect(unit,effect){
    const targets=effect.targets||{};
    const unitName=normalise(unit?.name||'');
    const base=uniqueKeywords(unit?.baseKeywords||unit?.tags||[]);
    const baseKeys=new Set(base.map(normalise));

    if(Array.isArray(targets.unitNames)&&targets.unitNames.length){
      const names=new Set(targets.unitNames.map(normalise));
      if(!names.has(unitName)) return false;
    }
    if(Array.isArray(targets.unitNamePatterns)&&targets.unitNamePatterns.length){
      const raw=String(unit?.name||'');
      if(!targets.unitNamePatterns.some(pattern=>pattern instanceof RegExp ? pattern.test(raw) : new RegExp(String(pattern),'i').test(raw))) return false;
    }
    if(Array.isArray(targets.baseKeywordsAll)&&targets.baseKeywordsAll.some(k=>!baseKeys.has(normalise(k)))) return false;
    if(Array.isArray(targets.baseKeywordsAny)&&targets.baseKeywordsAny.length&&!targets.baseKeywordsAny.some(k=>baseKeys.has(normalise(k)))) return false;
    if(Array.isArray(targets.excludeUnitNames)&&targets.excludeUnitNames.map(normalise).includes(unitName)) return false;
    return true;
  }

  function applyDerivedKeywords(options={}){
    try{
      if(typeof state==='undefined'||!Array.isArray(state?.importedUnits)) return {changed:false,applied:[]};
      const faction=normalise(activeFaction());
      const activeDetachments=activeDetachmentKeys();
      const applicable=effectRegistry.filter(effect=>(!effect.faction||normalise(effect.faction)===faction)&&activeDetachments.has(normalise(effect.detachment))&&permanentTimings.has(effect.timing));
      const applied=[];
      let changed=false;

      state.importedUnits.forEach(unit=>{
        // Capture immutable-ish source keywords once. Existing derived metadata is
        // never promoted into the source layer when the active detachment changes.
        if(!Array.isArray(unit.baseKeywords)) unit.baseKeywords=uniqueKeywords(unit.tags||[]);
        else unit.baseKeywords=uniqueKeywords(unit.baseKeywords);

        const derived=[];
        const provenance=[];
        applicable.forEach(effect=>{
          if(!unitMatchesEffect(unit,effect)) return;
          (effect.add||[]).forEach(keyword=>{
            if(!keyword) return;
            derived.push(keyword);
            provenance.push({keyword:String(keyword),effectId:effect.id,detachment:effect.detachment,sourceRule:effect.sourceRule||'',timing:effect.timing});
            applied.push({unitId:unit.id||'',unitName:unit.name||'',keyword:String(keyword),effectId:effect.id});
          });
        });

        const nextDerived=uniqueKeywords(derived);
        const nextTags=uniqueKeywords([...(unit.baseKeywords||[]),...nextDerived]);
        if(JSON.stringify(unit.tags||[])!==JSON.stringify(nextTags)||JSON.stringify(unit.derivedKeywords||[])!==JSON.stringify(nextDerived)) changed=true;
        unit.derivedKeywords=nextDerived;
        unit.derivedKeywordSources=provenance.filter((item,index,array)=>array.findIndex(other=>normalise(other.keyword)===normalise(item.keyword)&&other.effectId===item.effectId)===index);
        unit.tags=nextTags;
      });

      if(changed&&options.persist&&typeof saveState==='function') saveState();
      return {changed,applied,activeDetachments:[...activeDetachments]};
    }catch(error){
      console.warn('Could not apply derived detachment keywords.',error);
      return {changed:false,applied:[],error:String(error?.message||error)};
    }
  }

  // Tyranids permanent detachment keyword effects -------------------------
  // Subterranean Assault: Mawloc and Trygon gain BURROWER at army construction.
  registerKeywordEffects({
    id:'tyranids-subterranean-assault-burrower',
    faction:'tyranids',
    detachment:'subterranean-assault',
    sourceRule:'Keywords',
    timing:'army-construction',
    targets:{unitNames:['Mawloc','Trygon']},
    add:['Burrower']
  });

  // Warrior Bioform Onslaught: both Tyranid Warrior datasheets gain the
  // TYRANID WARRIORS and BATTLELINE keywords for the duration of the battle.
  // Match by canonical datasheet names; patterns tolerate punctuation/case
  // differences from New Recruit without matching unrelated Warrior units.
  registerKeywordEffects({
    id:'tyranids-warrior-bioform-onslaught-warrior-keywords',
    faction:'tyranids',
    detachment:'warrior-bioform-onslaught',
    sourceRule:'Leader-beasts',
    timing:'battle-permanent',
    targets:{
      unitNamePatterns:[
        '^Tyranid Warriors with Melee Bio[- ]?weapons$',
        '^Tyranid Warriors with Ranged Bio[- ]?weapons$'
      ]
    },
    add:['Tyranid Warriors','Battleline']
  });

  global.ASTARTES_DERIVED_KEYWORD_ENGINE=Object.freeze({
    version:'1.1.0',
    register:registerKeywordEffects,
    apply:applyDerivedKeywords,
    effects:()=>effectRegistry.map(effect=>({...effect,add:[...(effect.add||[])]})),
    effectiveKeywords:unit=>uniqueKeywords([...(unit?.baseKeywords||unit?.tags||[]),...(unit?.derivedKeywords||[])])
  });

  // Ensure every normal whole-app render sees the effective keyword layer first.
  if(typeof renderAll==='function'){
    const previousRenderAll=renderAll;
    renderAll=function(){ applyDerivedKeywords(); return previousRenderAll(); };
  }

  function rehydrate(){
    try{
      if(activeFaction()!=='tyranids'||typeof mergeDetachmentLibrary!=='function'||!state?.importedMeta) return;
      const meta=state.importedMeta;
      const raw=Array.isArray(meta.detachmentsData)&&meta.detachmentsData.length?meta.detachmentsData:(meta.detachmentData?[meta.detachmentData]:[]);
      if(!raw.length) return;
      const merged=raw.map(d=>mergeDetachmentLibrary(cleanTyranidRules(d)));
      meta.detachmentsData=merged;
      meta.detachmentData=merged[0]||meta.detachmentData;
      meta.detachments=merged.map(d=>d.name).filter(Boolean);
      applyDerivedKeywords({persist:false});
      if(typeof saveState==='function') saveState();
      if(typeof renderCards==='function') renderCards();
      if(typeof renderThemePreview==='function') renderThemePreview();
      if(typeof renderPrintCenter==='function') renderPrintCenter();
      if(typeof renderReference==='function') renderReference();
      if(typeof renderValidation==='function') renderValidation();
    }catch(error){console.warn('Could not rehydrate Tyranids detachment reference data.',error);}
  }

  global.addEventListener('DOMContentLoaded',rehydrate);
})(window);
