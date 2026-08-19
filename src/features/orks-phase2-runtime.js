/* Astartes Forge — Orks Phase 2 runtime hardening
 * - remove generic keyword-explanation rules from Detachment Rule cards
 * - merge current Orks reference Stratagems into New Recruit detachment data
 * - enforce faction-aware artwork gating on every A4 frame route
 * - keep the Themes artwork control disabled until the active faction has artwork
 * - normalise non-breaking punctuation observed in New Recruit Orks exports
 */
(function(global){
  'use strict';

  const activeFaction=()=>{
    try{return global.ASTARTES_ACTIVE_FACTION?.()||state?.factionKey||state?.importedMeta?.factionKey||'adeptus-astartes';}
    catch(_){return 'adeptus-astartes';}
  };
  const factionAllowsAstartesArtwork=()=>activeFaction()==='adeptus-astartes';

  const ruleIsReferenceExplanation=rule=>{
    const name=String(rule?.name||'').trim();
    const text=String(rule?.text||rule?.description||'');
    if(typeof isWeaponKeywordExplanation==='function' && isWeaponKeywordExplanation(name,text)) return true;
    return /^(sustained hits|lethal hits|devastating wounds|precision|blast|torrent|melta|rapid fire|anti-|ignores cover)$/i.test(name);
  };

  // New Recruit can serialise a detachment rule together with a generic weapon
  // keyword explanation referenced by that rule. Such explanations belong to the
  // shared keyword system, not to the Detachment Rule panel.
  if(typeof mergeDetachmentLibrary==='function'){
    const originalMergeDetachmentLibrary=mergeDetachmentLibrary;
    mergeDetachmentLibrary=function(detachmentData={}){
      const cleaned={...detachmentData};
      if(Array.isArray(detachmentData.rules)) cleaned.rules=detachmentData.rules.filter(rule=>!ruleIsReferenceExplanation(rule));
      return originalMergeDetachmentLibrary(cleaned);
    };
  }

  function cleanPersistedDetachmentRules(){
    try{
      const meta=state?.importedMeta;
      if(!meta) return;
      const cleanList=list=>(list||[]).filter(rule=>!ruleIsReferenceExplanation(rule));
      if(Array.isArray(meta.detachmentsData)) meta.detachmentsData=meta.detachmentsData.map(d=>({...d,rules:cleanList(d.rules)}));
      if(meta.detachmentData) meta.detachmentData={...meta.detachmentData,rules:cleanList(meta.detachmentData.rules)};
    }catch(error){console.warn('Could not clean persisted detachment rules.',error);}
  }

  // The rules extension loads after app.js, so a roster restored from storage may
  // still carry the pre-Phase-2 merged detachment (0 Stratagems / no library map).
  // Re-run the shared merge once for Orks so the live state immediately reaches the
  // same result as a fresh import.
  function rehydratePersistedOrksDetachment(){
    try{
      if(activeFaction()!=='orks' || typeof mergeDetachmentLibrary!=='function' || !state?.importedMeta) return;
      const meta=state.importedMeta;
      const raw=Array.isArray(meta.detachmentsData)&&meta.detachmentsData.length
        ? meta.detachmentsData
        : (meta.detachmentData?[meta.detachmentData]:[]);
      if(!raw.length) return;
      const merged=raw.map(d=>mergeDetachmentLibrary({...d,rules:(d.rules||[]).filter(rule=>!ruleIsReferenceExplanation(rule))}));
      meta.detachmentsData=merged;
      meta.detachmentData=merged[0]||meta.detachmentData;
      meta.detachments=merged.map(d=>d.name).filter(Boolean);
      if(typeof saveState==='function') saveState();
    }catch(error){console.warn('Could not rehydrate persisted Orks detachment.',error);}
  }

  // Hard block Space Marine frame mounting for non-Astartes factions. This closes
  // the lower-level route used by createCard(), even when a stored UI setting still
  // says that artwork is enabled.
  const engine=global.ASTARTES_A4_FRAME_ENGINE;
  if(engine?.mountSeamlessFrame){
    const originalMountSeamlessFrame=engine.mountSeamlessFrame.bind(engine);
    engine.mountSeamlessFrame=function(card,pack,options={}){
      if(!factionAllowsAstartesArtwork()){
        card?.removeAttribute?.('data-a4-frame');
        card?.removeAttribute?.('data-art-pack');
        card?.querySelectorAll?.(':scope > .print-page-surface,:scope > .codex-seamless-frame,:scope > .codex-art-root,:scope > .codex-art-layer').forEach(x=>x.remove());
        return null;
      }
      return originalMountSeamlessFrame(card,pack,options);
    };
  }
  if(engine?.mountFrame){
    const originalMountFrame=engine.mountFrame.bind(engine);
    engine.mountFrame=function(card,pack,options={}){
      if(!factionAllowsAstartesArtwork()) return null;
      return originalMountFrame(card,pack,options);
    };
  }

  // Disable the artwork checkbox for factions without a registered artwork system,
  // but keep the saved Space Marine preference untouched for when the user switches
  // back to an Adeptus Astartes roster.
  if(typeof syncCleanPrintControls==='function'){
    const originalSyncCleanPrintControls=syncCleanPrintControls;
    syncCleanPrintControls=function(){
      originalSyncCleanPrintControls();
      const frame=document.getElementById('printThemeFrame');
      const frameRow=document.getElementById('printThemeFrameRow');
      const hint=document.getElementById('printThemeFormatHint');
      if(!factionAllowsAstartesArtwork()){
        if(frame){frame.checked=false;frame.disabled=true;}
        if(frameRow) frameRow.hidden=false;
        if(hint) hint.textContent='A4 artwork is not available for this faction yet. A4 clean and A5 clean layouts remain fully supported.';
      }
    };
  }

  // New Recruit Orks data contains NBSP/non-breaking hyphens. They are semantically
  // harmless but can produce visually odd punctuation/wrapping in compact cards.
  if(typeof cleanCodexText==='function'){
    const originalCleanCodexText=cleanCodexText;
    cleanCodexText=function(text=''){
      return originalCleanCodexText(String(text||'')
        .replace(/\u00a0/g,' ')
        .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g,'-')
        .replace(/\s+([,.;:!?])/g,'$1'));
    };
  }

  cleanPersistedDetachmentRules();
  rehydratePersistedOrksDetachment();
  if(typeof syncCleanPrintControls==='function') syncCleanPrintControls();
  if(typeof renderReference==='function') renderReference();
  if(typeof renderValidation==='function') renderValidation();
})(window);
