/* Astartes Forge — exact Stratagem phase filtering
 * The phase dropdown must classify Stratagems from their formal phase field only.
 * Rule body text (WHEN / TARGET / EFFECT / RESTRICTION) must never influence
 * which phase a card belongs to.
 */
(function(){
  'use strict';

  function formalPhaseCategory(rawPhase=''){
    const phase=String(rawPhase||'')
      .toLowerCase()
      .replace(/[’]/g,"'")
      .replace(/\s+/g,' ')
      .trim();

    // "Any phase" is its own exact category and must not be treated as every phase.
    if(/\bany phase\b/.test(phase)) return 'any';

    // Turn ownership is deliberately ignored for the dropdown category:
    // "Shooting phase" and "Opponent Shooting phase" are both Shooting.
    if(/\bcommand phase\b/.test(phase)) return 'command';
    if(/\bmovement phase\b|\breinforcement step\b/.test(phase)) return 'movement';
    if(/\bshooting phase\b/.test(phase)) return 'shooting';
    if(/\bcharge phase\b/.test(phase)) return 'charge';
    if(/\bfight phase\b|\bcombat phase\b/.test(phase)) return 'fight';

    // These currently have no dedicated dropdown option, so they remain visible
    // under All phases only rather than being guessed into another phase.
    if(/\bstart of\b|\bend of\b|\bturn\b|\bbattle round\b/.test(phase)) return 'turn';
    return 'special';
  }

  // Override the legacy matcher after app.js has loaded. renderReference() resolves
  // this function at call time, so no renderer/data changes are necessary.
  stratagemPhaseMatches=function(rule, selectedPhase='all'){
    if(selectedPhase==='all') return true;
    return formalPhaseCategory(rule?.phase||'')===selectedPhase;
  };

  // Re-render once so an already selected filter immediately uses the exact matcher.
  if(typeof renderReference==='function') renderReference();
})();
