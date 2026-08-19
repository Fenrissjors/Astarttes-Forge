/* Astartes Forge — Orks Phase 2 runtime hardening
 * - remove generic keyword-explanation rules from Detachment Rule cards
 * - merge current Orks reference Stratagems into New Recruit detachment data
 * - enforce faction-aware artwork gating on every A4 frame route
 * - keep the Themes artwork control disabled until the active faction has artwork
 * - normalise non-breaking punctuation observed in New Recruit Orks exports
 * - use the registered faction palette for clean datasheets and print surfaces
 * - normalise source-integrity coverage for merged/duplicate provenance rows
 */
(function(global){
  'use strict';

  const activeFaction=()=>{
    try{return global.ASTARTES_ACTIVE_FACTION?.()||state?.factionKey||state?.importedMeta?.factionKey||'adeptus-astartes';}
    catch(_){return 'adeptus-astartes';}
  };
  const factionAllowsAstartesArtwork=()=>activeFaction()==='adeptus-astartes';
  const factionPresentation=()=>global.ASTARTES_FACTION_LIBRARY?.presentationFor?.(activeFaction())||null;

  const ruleIsReferenceExplanation=rule=>{
    const name=String(rule?.name||'').trim();
    const text=String(rule?.text||rule?.description||'');
    if(typeof isWeaponKeywordExplanation==='function' && isWeaponKeywordExplanation(name,text)) return true;
    return /^(sustained hits|lethal hits|devastating wounds|precision|blast|torrent|melta|rapid fire|anti-|ignores cover)$/i.test(name);
  };

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
      const meta=state?.importedMeta; if(!meta) return;
      const cleanList=list=>(list||[]).filter(rule=>!ruleIsReferenceExplanation(rule));
      if(Array.isArray(meta.detachmentsData)) meta.detachmentsData=meta.detachmentsData.map(d=>({...d,rules:cleanList(d.rules)}));
      if(meta.detachmentData) meta.detachmentData={...meta.detachmentData,rules:cleanList(meta.detachmentData.rules)};
    }catch(error){console.warn('Could not clean persisted detachment rules.',error);}
  }

  function rehydratePersistedOrksDetachment(){
    try{
      if(activeFaction()!=='orks'||typeof mergeDetachmentLibrary!=='function'||!state?.importedMeta) return;
      const meta=state.importedMeta;
      const raw=Array.isArray(meta.detachmentsData)&&meta.detachmentsData.length?meta.detachmentsData:(meta.detachmentData?[meta.detachmentData]:[]);
      if(!raw.length) return;
      const merged=raw.map(d=>mergeDetachmentLibrary({...d,rules:(d.rules||[]).filter(rule=>!ruleIsReferenceExplanation(rule))}));
      meta.detachmentsData=merged; meta.detachmentData=merged[0]||meta.detachmentData; meta.detachments=merged.map(d=>d.name).filter(Boolean);
      if(typeof saveState==='function') saveState();
    }catch(error){console.warn('Could not rehydrate persisted Orks detachment.',error);}
  }

  const engine=global.ASTARTES_A4_FRAME_ENGINE;
  if(engine?.mountSeamlessFrame){
    const originalMountSeamlessFrame=engine.mountSeamlessFrame.bind(engine);
    engine.mountSeamlessFrame=function(card,pack,options={}){
      if(!factionAllowsAstartesArtwork()){
        card?.removeAttribute?.('data-a4-frame'); card?.removeAttribute?.('data-art-pack');
        card?.querySelectorAll?.(':scope > .print-page-surface,:scope > .codex-seamless-frame,:scope > .codex-art-root,:scope > .codex-art-layer').forEach(x=>x.remove());
        return null;
      }
      return originalMountSeamlessFrame(card,pack,options);
    };
  }
  if(engine?.mountFrame){
    const originalMountFrame=engine.mountFrame.bind(engine);
    engine.mountFrame=function(card,pack,options={}){if(!factionAllowsAstartesArtwork()) return null; return originalMountFrame(card,pack,options);};
  }

  if(typeof printSurfaceFor==='function'){
    const originalPrintSurfaceFor=printSurfaceFor;
    printSurfaceFor=function(mode='parchment',chapter='generic-astartes'){
      const palette=factionPresentation();
      if(palette){
        if(mode==='white') return '#ffffff';
        if(mode==='chapter') return palette.chapterSurface||palette.paper;
        return palette.paper||'#e7dcc2';
      }
      return originalPrintSurfaceFor(mode,chapter);
    };
  }

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

  if(typeof cleanCodexText==='function'){
    const originalCleanCodexText=cleanCodexText;
    cleanCodexText=function(text=''){
      return originalCleanCodexText(String(text||'').replace(/\u00a0/g,' ').replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g,'-').replace(/\s+([,.;:!?])/g,'$1'));
    };
  }

  // sourceIntegrityReport previously used the raw expected profile array length
  // as its denominator. New Recruit can repeat the same source profile id in the
  // graph, while the validator correctly tracks represented ids in a Set. That
  // produced misleading output such as 23/37 despite complete provenance.
  if(typeof sourceIntegrityReport==='function'){
    const originalSourceIntegrityReport=sourceIntegrityReport;
    sourceIntegrityReport=function(imported,mergedDetachments=[]){
      const result=originalSourceIntegrityReport(imported,mergedDetachments);
      try{
        const graph=imported?.importGraph?.sourceGraph;
        if(!graph||!result?.detail||typeof graphProfileLooksLikeWeapon!=='function') return result;
        const selections=new Map((graph.selections||[]).map(x=>[x.id,x]));
        const unitRootIds=new Set((imported.units||[]).map(u=>u.sourceSelectionId).filter(Boolean));
        const expectedIds=new Set((graph.profiles||[]).filter(profile=>{
          if(!graphProfileLooksLikeWeapon(profile)) return false;
          const owner=selections.get(profile.ownerSelectionId);
          return Boolean(owner&&unitRootIds.has(owner.topId||owner.id));
        }).map(profile=>profile.id).filter(Boolean));
        if(!expectedIds.size) return result;
        const match=result.detail.match(/(\d+)\/(\d+) unit weapon source profiles represented/);
        if(!match) return result;
        const represented=Number(match[1]);
        result.detail=result.detail.replace(match[0],`${represented}/${expectedIds.size} unique unit weapon source profiles represented`);
      }catch(error){console.warn('Could not normalise source-integrity coverage.',error);}
      return result;
    };
  }

  cleanPersistedDetachmentRules();
  rehydratePersistedOrksDetachment();
  if(typeof syncCleanPrintControls==='function') syncCleanPrintControls();
  if(typeof renderReference==='function') renderReference();
  if(typeof renderValidation==='function') renderValidation();
})();
