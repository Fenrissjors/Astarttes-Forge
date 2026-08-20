/* Astartes Forge — Derived Keyword Render Bridge
 * Makes permanent detachment-derived keywords visible in all datasheet renderers.
 * The core engine remains authoritative; this bridge only projects its result
 * into legacy/new render shapes that do not yet read unit.tags directly.
 */
(function(global){
  'use strict';

  const normalise=value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const unique=values=>{
    const out=[]; const seen=new Set();
    (values||[]).filter(Boolean).forEach(value=>{
      const text=String(value).trim(); const key=normalise(text);
      if(!key||seen.has(key)) return; seen.add(key); out.push(text);
    });
    return out;
  };

  function stateUnits(){
    try{return Array.isArray(state?.importedUnits)?state.importedUnits:[];}catch(_){return [];}
  }

  function projectUnit(unit){
    const engine=global.ASTARTES_DERIVED_KEYWORD_ENGINE;
    const effective=engine?.effectiveKeywords?.(unit) || unique([...(unit?.tags||[]),...(unit?.derivedKeywords||[])]);
    if(!effective.length) return;

    // Project to common renderer data shapes. Existing arrays are preserved and
    // only missing effective keywords are added.
    unit.tags=unique(effective);
    unit.keywords=unique([...(Array.isArray(unit.keywords)?unit.keywords:[]),...effective]);
    unit.factionKeywords=unique([...(Array.isArray(unit.factionKeywords)?unit.factionKeywords:[]),...effective]);
    if(Array.isArray(unit.categories)) unit.categories=unique([...unit.categories,...effective]);

    // Some imported units keep keyword/category metadata under sourceMeta.
    if(unit.sourceMeta && typeof unit.sourceMeta==='object'){
      if(Array.isArray(unit.sourceMeta.keywords)) unit.sourceMeta.keywords=unique([...unit.sourceMeta.keywords,...effective]);
      if(Array.isArray(unit.sourceMeta.categories)) unit.sourceMeta.categories=unique([...unit.sourceMeta.categories,...effective]);
    }
  }

  function projectAll(){
    try{ global.ASTARTES_DERIVED_KEYWORD_ENGINE?.apply?.({persist:false}); }catch(_){ }
    stateUnits().forEach(projectUnit);
  }

  function unitForCard(card){
    const title=card.querySelector('.card-title,[data-unit-name],h1,h2,h3')?.textContent?.trim()||'';
    if(!title) return null;
    const key=normalise(title);
    return stateUnits().find(unit=>normalise(unit?.name||'')===key || key.includes(normalise(unit?.name||'')) || normalise(unit?.name||'').includes(key))||null;
  }

  function decorateRenderedKeywords(root=document){
    projectAll();
    const cards=[...root.querySelectorAll('.data-card,.clean-datasheet,.datasheet-card,.print-datasheet,[data-unit-card]')];
    cards.forEach(card=>{
      const unit=unitForCard(card);
      const derived=unique(unit?.derivedKeywords||[]);
      if(!unit||!derived.length) return;

      const existing=[...card.querySelectorAll('*')].find(el=>{
        const t=(el.textContent||'').trim();
        return /^(keywords?|faction keywords?)\s*:/i.test(t) && el.children.length<8;
      });
      if(existing){
        derived.forEach(keyword=>{
          if(!new RegExp(`(^|[,;:\\s])${keyword.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}($|[,;\\s])`,'i').test(existing.textContent||'')){
            existing.textContent=(existing.textContent||'').replace(/\s*$/,'') + `, ${keyword}`;
          }
        });
        return;
      }

      // Legacy card renderer has no keyword row at all. Add a small semantic row
      // inside the card body so screen and print stay consistent.
      let row=card.querySelector('.derived-keyword-row');
      if(!row){
        row=document.createElement('div');
        row.className='derived-keyword-row';
        row.style.cssText='margin-top:8px;padding-top:6px;border-top:1px solid rgba(0,0,0,.18);font-size:.78em;line-height:1.25;letter-spacing:.02em;';
        (card.querySelector('.card-body,.datasheet-body,.print-card-body')||card).appendChild(row);
      }
      row.innerHTML=`<strong>KEYWORDS:</strong> ${derived.map(x=>String(x)).join(', ')}`;
    });
  }

  function wrapRenderer(name){
    const fn=global[name];
    if(typeof fn!=='function'||fn.__derivedKeywordWrapped) return;
    const wrapped=function(...args){
      projectAll();
      const result=fn.apply(this,args);
      queueMicrotask(()=>decorateRenderedKeywords(document));
      return result;
    };
    wrapped.__derivedKeywordWrapped=true;
    global[name]=wrapped;
  }

  function install(){
    projectAll();
    ['renderAll','renderCards','renderThemePreview','renderPrintCenter','generateArmyPack'].forEach(wrapRenderer);
    decorateRenderedKeywords(document);

    // Keep projected keywords visible after any renderer replaces card DOM.
    const roots=['cardsContainer','themePreview','armyPackPrint'].map(id=>document.getElementById(id)).filter(Boolean);
    roots.forEach(root=>{
      const observer=new MutationObserver(()=>decorateRenderedKeywords(root));
      observer.observe(root,{childList:true,subtree:true});
    });
  }

  global.ASTARTES_DERIVED_KEYWORD_RENDER_BRIDGE=Object.freeze({projectAll,decorate:decorateRenderedKeywords});
  global.addEventListener('DOMContentLoaded',install);
})(window);
