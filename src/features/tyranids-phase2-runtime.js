/* Astartes Forge — Tyranids Phase 2 runtime
 * Keeps New Recruit rule ownership intact while removing only known reference
 * explanations that are serialised beside a Tyranids detachment rule.
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
      if(typeof saveState==='function') saveState();
      if(typeof renderReference==='function') renderReference();
      if(typeof renderValidation==='function') renderValidation();
    }catch(error){console.warn('Could not rehydrate Tyranids detachment reference data.',error);}
  }

  global.addEventListener('DOMContentLoaded',rehydrate);
})(window);
