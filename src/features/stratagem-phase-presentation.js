/* Astartes Forge — phase-driven Stratagem presentation
 * Phase-coloured spine, phase icon, upright CP badge, and exact phase filtering.
 * The dropdown classifies Stratagems from their formal phase field only; rule
 * body text never influences which phase a card belongs to.
 */
(function(){
  'use strict';

  function phaseIconMarkup(phaseClass){
    const common='viewBox="0 0 64 64" aria-hidden="true" focusable="false"';
    const icons={
      'phase-command':`<svg ${common}><path d="M10 46h44l-4 8H14zM12 22l12 11 8-20 8 20 12-11-5 20H17z" fill="currentColor"/></svg>`,
      'phase-movement':`<svg ${common}><path d="M9 16l16 16L9 48l7 7 23-23L16 9zM31 16l16 16-16 16 7 7 23-23L38 9z" fill="currentColor"/></svg>`,
      'phase-shooting':`<svg ${common}><circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" stroke-width="6"/><path d="M32 4v14M32 46v14M4 32h14M46 32h14" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`,
      'phase-charge':`<svg ${common}><path d="M32 5L8 32h15v27h18V32h15z" fill="currentColor"/></svg>`,
      'phase-fight':`<svg ${common}><path d="M13 8l18 18-7 7L6 15zM51 8L33 26l7 7 18-18zM20 29l8 8-13 18H6v-9zM44 29l-8 8 13 18h9v-9z" fill="currentColor"/></svg>`,
      'phase-enemy':`<svg ${common}><path d="M7 17h34l-9-9 7-7 21 21-21 21-7-7 9-9H7zM57 47H23l9 9-7 7L4 42l21-21 7 7-9 9h34z" fill="currentColor"/></svg>`,
      'phase-any':`<svg ${common}><path d="M18 7h28v8c0 8-5 14-10 17 5 3 10 9 10 17v8H18v-8c0-8 5-14 10-17-5-3-10-9-10-17zm9 8c0 6 2 9 5 12 3-3 5-6 5-12zm0 34h10c0-6-2-9-5-12-3 3-5 6-5 12z" fill="currentColor"/></svg>`,
      'phase-turn':`<svg ${common}><path d="M6 12l22 20L6 52zM30 12l22 20-22 20z" fill="currentColor"/></svg>`,
      'phase-special':`<svg ${common}><path d="M32 6l7 18 19 1-15 12 5 19-16-10-16 10 5-19L6 25l19-1z" fill="currentColor"/></svg>`
    };
    return icons[phaseClass] || icons['phase-special'];
  }

  function formalPhaseCategory(rawPhase=''){
    const phase=String(rawPhase||'')
      .toLowerCase()
      .replace(/[’]/g,"'")
      .replace(/\s+/g,' ')
      .trim();

    if(/\bany phase\b/.test(phase)) return 'any';
    if(/\bcommand phase\b/.test(phase)) return 'command';
    if(/\bmovement phase\b|\breinforcement step\b/.test(phase)) return 'movement';
    if(/\bshooting phase\b/.test(phase)) return 'shooting';
    if(/\bcharge phase\b/.test(phase)) return 'charge';
    if(/\bfight phase\b|\bcombat phase\b/.test(phase)) return 'fight';
    if(/\bstart of\b|\bend of\b|\bturn\b|\bbattle round\b/.test(phase)) return 'turn';
    return 'special';
  }

  stratagemPhaseMatches=function(rule,selectedPhase='all'){
    if(selectedPhase==='all') return true;
    return formalPhaseCategory(rule?.phase||'')===selectedPhase;
  };

  stratagemCard=function(s){
    const rule=structuredStratagem(s);
    const cp=Number.isFinite(rule.cp)?rule.cp:1;
    const phaseClass=stratagemPhaseClass(rule.phase||'Detachment');
    const fields=stratagemFields(rule);
    const rows=[['WHEN',fields.when],['TARGET',fields.target],['EFFECT',fields.effect],['RESTRICTION',fields.restriction]].filter(([,value])=>value);
    const turnLabel=/opponent|enemy/i.test(rule.phase||fields.when||'')?'THEIR TURN':/fight|charge|shoot|move|command/i.test(rule.phase||fields.when||'')?'YOUR TURN':'ANY TURN';
    return `<article class="stratagem official-stratagem warhammer-stratagem ${phaseClass}">
      <div class="stratagem-spine"><span class="phase-mark" title="${escapeHtml(cleanCodexText(rule.phase||'Detachment'))}">${phaseIconMarkup(phaseClass)}</span><span class="cp-diamond"><b>${cp}</b><small>CP</small></span><span class="turn-tag">${turnLabel}</span></div>
      <div class="stratagem-content"><header><div class="stratagem-heading"><h3>${escapeHtml(cleanCodexText(rule.name))}</h3><span class="stratagem-type">${escapeHtml(cleanCodexText(rule.phase||'Detachment Stratagem'))}</span></div></header>
      <div class="stratagem-fields">${rows.map(([label,value])=>`<div class="stratagem-field field-${label.toLowerCase()}"><strong>${label}:</strong><p>${escapeHtml(value)}</p></div>`).join('')}</div></div>
    </article>`;
  };

  if(typeof renderReference==='function') renderReference();
})();

// Multi-faction Phase 2 loader. Kept here temporarily because this feature file
// is already part of the stable post-app runtime chain. The Orks library mutates
// the existing Rules Library in-place, then the runtime hardening re-merges any
// already imported Ork detachment and enforces artwork gating.
(function(){
  'use strict';
  if(window.__astartesOrksPhase2Loader) return;
  window.__astartesOrksPhase2Loader=true;

  function loadScript(src,onload){
    const existing=document.querySelector(`script[data-af-dynamic="${src}"]`);
    if(existing){ if(onload) onload(); return; }
    const script=document.createElement('script');
    script.src=src;
    script.dataset.afDynamic=src;
    script.onload=()=>onload?.();
    script.onerror=()=>console.warn(`Could not load ${src}`);
    document.head.append(script);
  }

  loadScript('src/libraries/factions/orks-rules-library.js',()=>{
    loadScript('src/features/orks-phase2-runtime.js');
  });
})();
