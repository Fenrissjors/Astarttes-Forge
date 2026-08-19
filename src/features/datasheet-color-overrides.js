/* Astartes Forge — clean datasheet colour coding
 * Per-datasheet primary colour overrides are intentionally presentation-only.
 * They apply to A5 and to A4 when no artwork frame is being rendered.
 * A4 artwork frames remain immutable and ignore stored overrides.
 */
(function(){
  'use strict';

  const originalRenderCards=renderCards;
  const originalPrintCardElement=printCardElement;
  const originalRebuildThemePreview=rebuildThemePreview;

  function cleanColourOverrideAllowed(entry,unit){
    if(!entry||!unit) return false;
    const settings=cleanPrintSettings();
    if(settings.layout==='a4-two-a5') return true;
    if(settings.frame===false) return true;
    // If A4 artwork is enabled globally but this specific datasheet has no
    // usable artwork renderer, it is still a clean A4 datasheet and may be coded.
    return !canUseAdaptiveDatasheetArtwork(entry,unit) && !canUseArtworkPrintPage(entry,unit);
  }

  function entryPrimaryColour(entry){
    const stored=String(entry?.primaryOverride||'').trim();
    return /^#[0-9a-f]{6}$/i.test(stored)
      ? normaliseHex(stored)
      : smartTheme(state.theme||defaultTheme).primary;
  }

  function applyPrimaryOverride(card,entry,unit){
    if(!card||!cleanColourOverrideAllowed(entry,unit)) return card;
    const stored=String(entry?.primaryOverride||'').trim();
    if(!/^#[0-9a-f]{6}$/i.test(stored)) return card;
    const primary=normaliseHex(stored);
    const text=readableText(primary);
    card.style.setProperty('--card-primary',primary);
    card.style.setProperty('--card-primary-text',text);
    card.dataset.primaryOverride=primary;
    card.dataset.primaryOverrideText=text;
    card.dataset.primaryOverrideContrast=contrastRatio(primary,text).toFixed(2);
    return card;
  }

  function colourControl(entry,unit,card){
    const control=document.createElement('div');
    control.className='datasheet-color-control';
    control.dataset.entryId=entry.id;

    const label=document.createElement('label');
    label.className='datasheet-color-label';
    const text=document.createElement('span');
    text.textContent='Hoofdkleur';
    const picker=document.createElement('input');
    picker.type='color';
    picker.className='datasheet-primary-picker';
    picker.value=entryPrimaryColour(entry);
    picker.setAttribute('aria-label',`Hoofdkleur voor ${unit.name}`);
    picker.title='Pas alleen de hoofdkleur van deze datasheet aan';

    picker.addEventListener('input',event=>{
      entry.primaryOverride=normaliseHex(event.target.value);
      applyPrimaryOverride(card,entry,unit);
    });
    picker.addEventListener('change',()=>{
      saveState();
      renderThemePreview();
      renderPrintCenter();
    });

    label.append(text,picker);
    control.append(label);
    return control;
  }

  function mountColourControls(){
    const entries=printableEntries();
    const wrappers=[...document.querySelectorAll('#cardsContainer > .functional-datasheet-wrapper')];
    wrappers.forEach((wrapper,index)=>{
      wrapper.querySelector(':scope > .datasheet-color-control')?.remove();
      const entry=entries[index];
      const unit=entry?unitById(entry.unitId):null;
      const card=wrapper.querySelector('.data-card');
      if(!entry||!unit||!card||!cleanColourOverrideAllowed(entry,unit)) return;
      applyPrimaryOverride(card,entry,unit);
      wrapper.prepend(colourControl(entry,unit,card));
    });
  }

  // Functional Datasheets view: add exactly one colour picker per eligible card.
  renderCards=function(){
    originalRenderCards();
    mountColourControls();
  };

  // Print/Army Pack: apply the override only after the renderer has resolved to
  // a clean card. Artwork renderers therefore never receive the custom colour.
  printCardElement=function(entry){
    const card=originalPrintCardElement(entry);
    const unit=entry?unitById(entry.unitId):null;
    return applyPrimaryOverride(card,entry,unit);
  };

  // Output format / artwork toggle changes also change picker eligibility.
  rebuildThemePreview=function(){
    originalRebuildThemePreview();
    renderCards();
  };

  // app.js initialises before this feature script is loaded, so refresh the
  // current datasheet view once to mount the controls for an already-saved roster.
  renderCards();
})();
