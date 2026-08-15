#!/usr/bin/env python3
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def rd(p): return (R/p).read_text(encoding='utf-8')
def wr(p,s): (R/p).write_text(s,encoding='utf-8')
def one(p,a,b):
 s=rd(p); n=s.count(a)
 if n!=1: raise SystemExit(f'{p}: expected 1 match, got {n}: {a[:70]!r}')
 wr(p,s.replace(a,b,1))
def all_(p,a,b,n=1):
 s=rd(p); c=s.count(a)
 if c<n: raise SystemExit(f'{p}: expected >= {n}, got {c}: {a[:70]!r}')
 wr(p,s.replace(a,b))

P='src/core/app.js'; s=rd(P)
if "const APP_VERSION = '3.0.52-unified-adaptive-artwork'" in s: raise SystemExit(0)
if "const APP_VERSION = '3.0.50-explicit-pixel-typography'" not in s: raise SystemExit('Unexpected baseline')
one(P,"const APP_VERSION = '3.0.50-explicit-pixel-typography';","const APP_VERSION = '3.0.52-unified-adaptive-artwork';")
one(P,"""  window.addEventListener('beforeprint', () => {
    // Re-fit against the actual print-media cascade. A5 cards can gain a few
    // pixels when the browser switches from screen preview to print layout.
    const printRoot=$('#armyPackPrint') || document;
    fitAllAdaptiveA5Cards(printRoot);
    fitAllAdaptiveArtworkPages(printRoot);
    // Force one synchronous layout pass, then verify the mounted print geometry
    // again before the browser snapshots the page.
    void document.body.offsetHeight;
    fitAllAdaptiveA5Cards(printRoot);
    fitAllAdaptiveArtworkPages(printRoot);
  });""","""  window.addEventListener('beforeprint', () => {
    // Chromium can fire beforeprint while #armyPackPrint is still display:none.
    const printRoot=$('#armyPackPrint');
    fitMountedPrintRoot(printRoot);
  });""")
one(P,"""/* v3.0.50 — Dark Angels unified datasheet prototype.
   This deliberately reuses the normal print datasheet DOM/components instead
   of rebuilding them inside .artwork-print-page. Only the artwork shell/title
   placement is specialized so we can compare both renderer architectures. */
function canUseDarkAngelsDatasheetPrototype(entry,unit){
  const settings=cleanPrintSettings();
  if(settings.layout==='a4-two-a5' || settings.frame===false) return false;
  const chapterKey=artworkChapterKeyForEntry(entry,unit);
  if(chapterKey!=='dark-angels') return false;
  const profile=window.ASTARTES_CHAPTER_VISUAL_REGISTRY?.resolve?.(chapterKey)||null;
  return Boolean(profile?.artwork?.renderer==='adaptive-datasheet' && profile?.artwork?.a4Frame);
}""","""/* v3.0.52 — Unified adaptive datasheet artwork renderer.
   Validated Chapter frames can opt into the user-approved Dark Angels renderer
   through artwork.renderer === 'adaptive-datasheet'. */
function canUseAdaptiveDatasheetArtwork(entry,unit){
  const settings=cleanPrintSettings();
  if(settings.layout==='a4-two-a5' || settings.frame===false) return false;
  const chapterKey=artworkChapterKeyForEntry(entry,unit);
  const profile=window.ASTARTES_CHAPTER_VISUAL_REGISTRY?.resolve?.(chapterKey)||null;
  return Boolean(profile?.artwork?.renderer==='adaptive-datasheet' && profile?.artwork?.frameReady && profile?.artwork?.a4Frame);
}""")
all_(P,"card?.classList?.contains('adaptive-datasheet-artwork-prototype')","card?.classList?.contains('adaptive-datasheet-artwork')",2)
one(P,"root?.querySelectorAll?.('.adaptive-datasheet-artwork-prototype').forEach(fitAdaptiveArtworkToPage);","root?.querySelectorAll?.('.adaptive-datasheet-artwork').forEach(fitAdaptiveArtworkToPage);")
one(P,"""function buildDarkAngelsDatasheetPrototype(entry,unit){
  const card=fragmentCardElement(createCard(entry,unit,'print'));
  if(!card) return null;
  card.classList.add('dark-angels-datasheet-prototype','adaptive-datasheet-artwork-prototype');
  card.dataset.prototypeRenderer='adaptive-datasheet-artwork';
  card.dataset.prototypeChapter='dark-angels';
  applyAdaptiveArtworkPrototype(card);
  return card;
}""","""function buildAdaptiveDatasheetArtwork(entry,unit){
  const chapterKey=artworkChapterKeyForEntry(entry,unit);
  const profile=window.ASTARTES_CHAPTER_VISUAL_REGISTRY?.resolve?.(chapterKey)||null;
  if(profile?.artwork?.renderer!=='adaptive-datasheet' || !profile?.artwork?.frameReady || !profile?.artwork?.a4Frame) return null;
  const card=fragmentCardElement(createCard(entry,unit,'print'));
  if(!card) return null;
  card.classList.add('adaptive-datasheet-artwork','adaptive-datasheet-artwork-prototype');
  card.dataset.artworkRenderer='adaptive-datasheet';
  card.dataset.artworkChapter=chapterKey;
  card.dataset.prototypeRenderer='adaptive-datasheet-artwork';
  card.dataset.prototypeChapter=chapterKey;
  applyAdaptiveArtworkPrototype(card);
  return card;
}""")
one(P,"if(canUseDarkAngelsDatasheetPrototype(entry,unit)) return buildDarkAngelsDatasheetPrototype(entry,unit);","if(canUseAdaptiveDatasheetArtwork(entry,unit)) return buildAdaptiveDatasheetArtwork(entry,unit);")
one(P,"""function printDatasheetsOnly(){
  if(!state.roster.length){switchView('builder');return;}
  const output=$('#armyPackPrint');""","""function fitMountedPrintRoot(root){
  if(!root) return;
  const body=document.body;
  const alreadyMeasuring=body.classList.contains('print-measure-layout');
  if(!alreadyMeasuring) body.classList.add('print-measure-layout');
  try{
    void root.offsetHeight;
    fitAllAdaptiveArtworkPages(root); fitAllAdaptiveA5Cards(root);
    void root.offsetHeight;
    fitAllAdaptiveArtworkPages(root); fitAllAdaptiveA5Cards(root);
    root.dataset.lastMeasuredAt=String(Date.now());
  }finally{ if(!alreadyMeasuring) body.classList.remove('print-measure-layout'); }
}
function printDatasheetsOnly(){
  if(!state.roster.length){switchView('builder');return;}
  const output=$('#armyPackPrint');""")
one(P,"""  fitAllAdaptiveArtworkPages(output);
  fitAllAdaptiveA5Cards(output);
  requestAnimationFrame(()=>window.print());""","""  fitMountedPrintRoot(output);
  requestAnimationFrame(()=>window.print());""")
one(P,"""  fitAllAdaptiveArtworkPages(output);
  fitAllAdaptiveA5Cards(output);
  // Keep the browser print dialog inside the original user click.""","""  fitMountedPrintRoot(output);
  // Keep the browser print dialog inside the original user click.""")

C='assets/css/styles.css'; css=rd(C)
block='''

/* V3.0.51 — MEASURABLE PRINT DOM */
body.print-pack.print-measure-layout #print-center{display:block!important;position:fixed!important;left:-12000px!important;top:0!important;width:210mm!important;margin:0!important;padding:0!important;opacity:0!important;pointer-events:none!important;z-index:-9999!important}
body.print-pack.print-measure-layout #print-center > :not(#armyPackPrint){display:none!important}
body.print-pack.print-measure-layout #armyPackPrint{display:block!important;position:relative!important;width:210mm!important;margin:0!important;padding:0!important}
body.print-pack.print-measure-layout #armyPackPrint .print-sheet,body.print-pack.print-measure-layout #armyPackPrint .data-card{display:block!important;transform:none!important}
body.print-pack.print-measure-layout #armyPackPrint .data-card[data-render-mode="print"]{font-size:calc(9.4pt * var(--print-scale,1))!important}
body.print-pack.print-measure-layout #armyPackPrint .data-card[data-render-mode="print"] .card-body{line-height:calc(1.28 - (1 - var(--print-scale,1)) * .28)!important}
'''
anchor='\n@media print{\n body.print-pack{background:white!important}'
if 'V3.0.51 — MEASURABLE PRINT DOM' not in css:
 if anchor not in css: raise SystemExit('CSS print anchor missing')
 css=css.replace(anchor,block+anchor,1)
css=css.replace('.data-card.dark-angels-datasheet-prototype','.data-card.adaptive-datasheet-artwork')
css=css.replace('color:var(--art-title-text,#173b2b)!important','color:var(--art-title-text,#111318)!important')
wr(C,css)
print('core migration applied')
