/* Astartes Forge — Tyranids Phase 2 runtime
 * Keeps New Recruit rule ownership intact while removing only known reference
 * explanations that are serialised beside a Tyranids detachment rule.
 *
 * Unit keywords are intentionally NOT derived here. New Recruit's ROSZ
 * category/categoryLink data remains the source of truth and is handled by the
 * generic ROSZ keyword pipeline.
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
      if(detachmentKey==='ambush-predators' && name==='deep-strike') return false;
      if(detachmentKey==='invasion-fleet' && ['sustained-hits','lethal-hits','precision'].includes(name)) return false;
      // Subterranean Assault's 'Keywords' entry is a real detachment rule and
      // must remain visible; only its resulting unit keywords come from ROSZ.
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
      if(typeof renderCards==='function') renderCards();
      if(typeof renderThemePreview==='function') renderThemePreview();
      if(typeof renderPrintCenter==='function') renderPrintCenter();
      if(typeof renderReference==='function') renderReference();
      if(typeof renderValidation==='function') renderValidation();
    }catch(error){console.warn('Could not rehydrate Tyranids detachment reference data.',error);}
  }

  global.addEventListener('DOMContentLoaded',rehydrate);
})(window);
