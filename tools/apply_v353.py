#!/usr/bin/env python3
from pathlib import Path
import json

R=Path(__file__).resolve().parents[1]

def read(rel): return (R/rel).read_text(encoding='utf-8')
def write(rel,text):
    p=R/rel; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(text,encoding='utf-8')
def replace_once(rel,old,new,required=True):
    s=read(rel)
    if old not in s:
        if required: raise SystemExit(f'{rel}: expected text not found: {old[:100]!r}')
        return
    write(rel,s.replace(old,new,1))

def add_after(rel,needle,addition):
    s=read(rel)
    if addition.strip() in s: return
    if needle not in s: raise SystemExit(f'{rel}: insertion anchor missing')
    write(rel,s.replace(needle,needle+addition,1))

# ---------------------------------------------------------------------------
# Versions / docs
# ---------------------------------------------------------------------------
replace_once('src/core/app.js',"const APP_VERSION = '3.0.52-unified-adaptive-artwork';","const APP_VERSION = '3.0.53-artwork-geometry-contract';")
replace_once('README.md','# Astartes Forge v3.0.52 — Unified Adaptive Artwork','# Astartes Forge v3.0.53 — Artwork Geometry Contract')
replace_once('index.html','v3.0.52 Unified Adaptive Artwork','v3.0.53 Artwork Geometry Contract')

ch=read('CHANGELOG.md')
entry="""## v3.0.53 — Artwork Geometry Contract

- Every validated A4 artwork frame now carries an exact native-pixel `titleBoxPx` in its frame manifest.
- Ultramarines and Blood Angels use their own measured title positions instead of inheriting the Dark Angels coordinates.
- Space Wolves and Dark Angels retain their already-approved title placement.
- The renderer converts native 2480×3508 PNG coordinates into physical A4 millimetres and fits long unit names inside that frame-defined title box.
- The 160.5 mm information-panel width remains unchanged.

"""
if entry not in ch:
    if not ch.startswith('# Changelog\n'):
        raise SystemExit('CHANGELOG.md: unexpected header')
    ch=ch.replace('# Changelog\n\n','# Changelog\n\n'+entry,1)
    write('CHANGELOG.md',ch)
write('docs/RELEASE-v3.0.53.md',"""# Astartes Forge v3.0.53 — Artwork Geometry Contract

Each validated A4 artwork PNG now has a native-pixel geometry contract. The title box travels with the frame metadata, is converted to physical A4 geometry at render time, and long unit names are fitted inside that exact box. Ultramarines and Blood Angels therefore no longer inherit the Dark Angels title coordinates. Golden artwork PNGs remain unchanged.
""")

# ---------------------------------------------------------------------------
# Runtime geometry library: generated mirror of frame manifests.
# ---------------------------------------------------------------------------
geometry={
 'space-wolves': {"titleBoxPx":{"x":310,"y":286,"width":1864,"height":224},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":True},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}},
 'ultramarines': {"titleBoxPx":{"x":422,"y":287,"width":1625,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":True},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}},
 'blood-angels': {"titleBoxPx":{"x":380,"y":259,"width":1714,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":True},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}},
 'dark-angels': {"titleBoxPx":{"x":310,"y":286,"width":1864,"height":224},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":True},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}
}
lines=[]
for key,g in geometry.items():
    compact=json.dumps(g,separators=(',',':')).replace('true','true').replace('false','false')
    lines.append(f"    '{key}': Object.freeze({compact})")
geo_js="""(function(){
  const CONTRACT='artwork-geometry-px-v1';
  const geometries=Object.freeze({
%s
  });
  function pxToMmX(px,canvas=2480){ return Number(px||0)/canvas*210; }
  function pxToMmY(px,canvas=3508){ return Number(px||0)/canvas*297; }
  function boxToMm(box,canvas={width:2480,height:3508}){
    if(!box) return null;
    return {x:pxToMmX(box.x,canvas.width),y:pxToMmY(box.y,canvas.height),width:pxToMmX(box.width,canvas.width),height:pxToMmY(box.height,canvas.height)};
  }
  function resolve(chapter=''){
    const key=String(chapter||'').toLowerCase().trim().replace(/\\s+/g,'-');
    return geometries[key]||null;
  }
  function manifestPath(chapter=''){
    const key=String(chapter||'').toLowerCase().trim().replace(/\\s+/g,'-');
    return geometries[key]?`assets/art/${key}/frames/frame-manifest.json`:'';
  }
  window.ASTARTES_FRAME_GEOMETRY_LIBRARY={version:'3.0.53',contract:CONTRACT,geometries,resolve,manifestPath,boxToMm,pxToMmX,pxToMmY};
})();
""" % ',\n'.join(lines)
write('src/libraries/art/frame-geometry-library.js',geo_js)

# Load geometry before visual registry.
idx=read('index.html')
script='  <script src="src/libraries/art/frame-geometry-library.js"></script>\n'
anchor='  <script src="src/libraries/chapters/chapter-visual-registry.js"></script>\n'
if script not in idx:
    if anchor not in idx: raise SystemExit('index.html: registry script anchor missing')
    idx=idx.replace(anchor,script+anchor,1)
    write('index.html',idx)

# ---------------------------------------------------------------------------
# Frame manifests: geometry travels with each PNG.
# ---------------------------------------------------------------------------
for chapter,g in geometry.items():
    rel=f'assets/art/{chapter}/frames/frame-manifest.json'
    d=json.loads(read(rel))
    d['version']='3.0.53'
    d['geometryContract']='artwork-geometry-px-v1'
    d['artworkGeometry']=g
    write(rel,json.dumps(d,indent=2,ensure_ascii=False)+'\n')

# ---------------------------------------------------------------------------
# Chapter registry and frame engine expose the contract.
# ---------------------------------------------------------------------------
reg='src/libraries/chapters/chapter-visual-registry.js'
s=read(reg)
s=s.replace("version:'3.0.52-unified-adaptive-artwork'","version:'3.0.53-artwork-geometry-contract'",1)
for chapter in geometry:
    asset=f"a4Frame:'assets/art/{chapter}/frames/{chapter}-a4-portrait.png',"
    repl=asset+f"frameManifest:'assets/art/{chapter}/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',"
    if repl not in s:
        if asset not in s: raise SystemExit(f'{reg}: missing {chapter} frame asset')
        s=s.replace(asset,repl,1)
write(reg,s)
replace_once('src/libraries/chapters/decoration-pack-library.js',"version:'3.0.52',packs","version:'3.0.53',packs")

eng='src/libraries/art/a4-frame-engine.js'
s=read(eng).replace("version:'3.0.52'","version:'3.0.53'",1)
if 'function artworkGeometryFor(' not in s:
    anchor='  window.ASTARTES_A4_FRAME_ENGINE={\n'
    funcs="""  function artworkGeometryFor(chapter=''){
    return window.ASTARTES_FRAME_GEOMETRY_LIBRARY?.resolve?.(chapter)||null;
  }
  function geometryBoxMm(chapter='',boxName='titleBoxPx'){
    const geometry=artworkGeometryFor(chapter);
    const box=geometry?.[boxName];
    return box ? window.ASTARTES_FRAME_GEOMETRY_LIBRARY?.boxToMm?.(box,geometry.canvasPx) : null;
  }

"""
    if anchor not in s: raise SystemExit(f'{eng}: export anchor missing')
    s=s.replace(anchor,funcs+anchor,1)
    s=s.replace('    frameAssetFor,\n','    frameAssetFor,\n    artworkGeometryFor,geometryBoxMm,\n',1)
write(eng,s)

# ---------------------------------------------------------------------------
# App: read geometry, convert native pixels to A4 mm, fit title inside box.
# ---------------------------------------------------------------------------
app='src/core/app.js'
s=read(app)
geo_block="""
const ARTWORK_GEOMETRY_CONTRACT='artwork-geometry-px-v1';
function artworkGeometryForChapter(chapterKey=''){
  return window.ASTARTES_FRAME_GEOMETRY_LIBRARY?.resolve?.(chapterKey)||null;
}
function pxBoxToCssMm(box,canvas={width:2480,height:3508}){
  if(!box) return null;
  return {x:Number(box.x||0)/Number(canvas.width||2480)*210,y:Number(box.y||0)/Number(canvas.height||3508)*297,width:Number(box.width||0)/Number(canvas.width||2480)*210,height:Number(box.height||0)/Number(canvas.height||3508)*297};
}
function applyArtworkGeometryContract(card,chapterKey=''){
  if(!card) return null;
  const geometry=artworkGeometryForChapter(chapterKey);
  if(!geometry) return null;
  const canvas=geometry.canvasPx||{width:2480,height:3508};
  const title=pxBoxToCssMm(geometry.titleBoxPx,canvas);
  const panel=geometry.panelBoxPx||null;
  const pad=geometry.titlePaddingPx||{};
  if(title){
    card.style.setProperty('--art-title-left',`${title.x.toFixed(4)}mm`);
    card.style.setProperty('--art-title-top',`${title.y.toFixed(4)}mm`);
    card.style.setProperty('--art-title-width',`${title.width.toFixed(4)}mm`);
    card.style.setProperty('--art-title-height',`${title.height.toFixed(4)}mm`);
  }
  const pxX=px=>Number(px||0)/Number(canvas.width||2480)*210;
  const pxY=px=>Number(px||0)/Number(canvas.height||3508)*297;
  card.style.setProperty('--art-title-pad-top',`${pxY(pad.top).toFixed(4)}mm`);
  card.style.setProperty('--art-title-pad-right',`${pxX(pad.right).toFixed(4)}mm`);
  card.style.setProperty('--art-title-pad-bottom',`${pxY(pad.bottom).toFixed(4)}mm`);
  card.style.setProperty('--art-title-pad-left',`${pxX(pad.left).toFixed(4)}mm`);
  const typography=geometry.titleTypography||{};
  card.style.setProperty('--art-title-font-max',`${Number(typography.maxTitlePt||15)}pt`);
  card.style.setProperty('--art-title-font-min',`${Number(typography.minTitlePt||8.5)}pt`);
  card.style.setProperty('--art-kicker-font',`${Number(typography.kickerPt||6.5)}pt`);
  card.style.setProperty('--art-points-font',`${Number(typography.pointsPt||9)}pt`);
  card.style.setProperty('--art-title-font',`${Number(typography.maxTitlePt||15)}pt`);
  if(panel){
    card.style.setProperty('--adaptive-body-top',`${pxY(panel.y).toFixed(4)}mm`);
    card.style.setProperty('--adaptive-body-width',`${pxX(panel.width).toFixed(4)}mm`);
  }
  card.dataset.frameGeometryContract=ARTWORK_GEOMETRY_CONTRACT;
  card.dataset.frameGeometryManifest=window.ASTARTES_FRAME_GEOMETRY_LIBRARY?.manifestPath?.(chapterKey)||'';
  card.dataset.frameTitleBoxPx=geometry.titleBoxPx?[geometry.titleBoxPx.x,geometry.titleBoxPx.y,geometry.titleBoxPx.width,geometry.titleBoxPx.height].join(','):'';
  return geometry;
}
function fitArtworkTitleToBox(card){
  if(!card?.classList?.contains('adaptive-datasheet-artwork')) return;
  const header=card.querySelector(':scope > .card-header');
  const title=header?.querySelector?.('.card-title');
  const textWrap=header?.querySelector?.(':scope > div:first-child');
  if(!header||!title||!textWrap) return;
  const chapterKey=card.dataset.artworkChapter||card.dataset.artPack||'';
  const geometry=artworkGeometryForChapter(chapterKey);
  const typo=geometry?.titleTypography||{};
  const max=Number(typo.maxTitlePt||15),min=Number(typo.minTitlePt||8.5);
  const fits=pt=>{
    card.style.setProperty('--art-title-font',`${pt.toFixed(3)}pt`);
    void header.offsetWidth;
    return title.scrollWidth<=textWrap.clientWidth+0.5 && title.scrollHeight<=textWrap.clientHeight+0.5 && header.scrollHeight<=header.clientHeight+0.5;
  };
  if(fits(max)){ card.dataset.artworkTitleFitPt=max.toFixed(2); card.dataset.artworkTitleOverflow='false'; return; }
  if(!fits(min)){ card.dataset.artworkTitleFitPt=min.toFixed(2); card.dataset.artworkTitleOverflow='true'; return; }
  let lo=min,hi=max;
  for(let i=0;i<12;i++){ const mid=(lo+hi)/2; if(fits(mid)) lo=mid; else hi=mid; }
  fits(lo);
  card.dataset.artworkTitleFitPt=lo.toFixed(2);
  card.dataset.artworkTitleOverflow='false';
}
"""
anchor="const ADAPTIVE_ARTWORK_BASE={top:'50.6mm',width:'160.5mm',gapMm:2.15,radiusMm:2.0};"
if 'const ARTWORK_GEOMETRY_CONTRACT=' not in s:
    if anchor not in s: raise SystemExit(f'{app}: adaptive base anchor missing')
    s=s.replace(anchor,geo_block+'\n'+anchor,1)
fit_anchor="function fitAdaptiveArtworkToPage(card){\n  if(!card?.classList?.contains('adaptive-datasheet-artwork')) return;\n"
if 'fitArtworkTitleToBox(card);' not in s:
    if fit_anchor not in s: raise SystemExit(f'{app}: fit function anchor missing')
    s=s.replace(fit_anchor,fit_anchor+'  fitArtworkTitleToBox(card);\n',1)
build_anchor="  card.dataset.prototypeChapter=chapterKey;\n  applyAdaptiveArtworkPrototype(card);"
if 'applyArtworkGeometryContract(card,chapterKey);' not in s:
    if build_anchor not in s: raise SystemExit(f'{app}: build adaptive anchor missing')
    s=s.replace(build_anchor,"  card.dataset.prototypeChapter=chapterKey;\n  applyArtworkGeometryContract(card,chapterKey);\n  applyAdaptiveArtworkPrototype(card);",1)
write(app,s)

# ---------------------------------------------------------------------------
# CSS: title geometry is now driven by per-frame variables.
# ---------------------------------------------------------------------------
css='assets/css/styles.css'
s=read(css)
old="""  left:26.2mm!important;
  top:24.2mm!important;
  width:157.8mm!important;
  min-height:19mm!important;
  height:19mm!important;
  margin:0!important;
  padding:1.8mm 6.4mm!important;"""
new="""  left:var(--art-title-left,26.2mm)!important;
  top:var(--art-title-top,24.2mm)!important;
  width:var(--art-title-width,157.8mm)!important;
  min-height:0!important;
  height:var(--art-title-height,19mm)!important;
  margin:0!important;
  padding:var(--art-title-pad-top,1.8mm) var(--art-title-pad-right,6.4mm) var(--art-title-pad-bottom,1.8mm) var(--art-title-pad-left,6.4mm)!important;"""
if new not in s:
    if old not in s: raise SystemExit(f'{css}: header geometry block missing')
    s=s.replace(old,new,1)
extra="""
.data-card.adaptive-datasheet-artwork[data-render-mode="print"][data-physical-format="a4Portrait"] > .card-header > div:first-child{min-width:0!important;flex:1 1 auto!important;overflow:hidden!important;}
.data-card.adaptive-datasheet-artwork[data-render-mode="print"][data-physical-format="a4Portrait"] > .card-header .card-title{font-size:var(--art-title-font,var(--art-title-font-max,15pt))!important;line-height:1.02!important;white-space:nowrap!important;overflow:visible!important;}
.data-card.adaptive-datasheet-artwork[data-render-mode="print"][data-physical-format="a4Portrait"] > .card-header .card-kicker{font-size:var(--art-kicker-font,6.5pt)!important;}
.data-card.adaptive-datasheet-artwork[data-render-mode="print"][data-physical-format="a4Portrait"] > .card-header .card-points{font-size:var(--art-points-font,9pt)!important;flex:0 0 auto!important;}
"""
anchor_css=".data-card.adaptive-datasheet-artwork[data-render-mode=\"print\"][data-physical-format=\"a4Portrait\"] > .card-header .card-title,\n"
if extra.strip() not in s:
    if anchor_css not in s: raise SystemExit(f'{css}: title style anchor missing')
    s=s.replace(anchor_css,extra+anchor_css,1)
write(css,s)

# ---------------------------------------------------------------------------
# Tests and version assertions.
# ---------------------------------------------------------------------------
t='tests/scripts/verify-runtime-hardening.js'
s=read(t).replace("const APP_VERSION = '3.0.52-unified-adaptive-artwork'","const APP_VERSION = '3.0.53-artwork-geometry-contract'").replace('v3.0.52 app version','v3.0.53 app version')
write(t,s)

t='tests/scripts/verify-chapter-visual-registry.js'
s=read(t).replace("r.version==='3.0.52-unified-adaptive-artwork'","r.version==='3.0.53-artwork-geometry-contract'").replace('registry version is 3.0.52-unified-adaptive-artwork','registry version is 3.0.53-artwork-geometry-contract').replace("d.version==='3.0.52'","d.version==='3.0.53'").replace('decoration library consumes v3.0.52 registry','decoration library consumes v3.0.53 registry')
marker="for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){ assert(r.resolve(id).artwork.renderer==='adaptive-datasheet',`${id} uses the approved adaptive datasheet renderer`); }"
extra_test="\nfor(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){\n  assert(r.resolve(id).artwork.geometryContract==='artwork-geometry-px-v1',`${id} declares the artwork geometry contract`);\n  assert(!!r.resolve(id).artwork.frameManifest,`${id} publishes its frame manifest path`);\n}"
if extra_test.strip() not in s:
    if marker not in s: raise SystemExit(f'{t}: renderer test anchor missing')
    s=s.replace(marker,marker+extra_test,1)
write(t,s)

t='tests/scripts/verify-dark-angels-prototype.js'
s=read(t)
s=s.replace("ok(css.includes('left:26.2mm!important;') && css.includes('top:24.2mm!important;'),'title uses absolute A4 coordinates');","ok(css.includes('left:var(--art-title-left,26.2mm)!important;') && css.includes('top:var(--art-title-top,24.2mm)!important;'),'title uses per-frame geometry variables');")
write(t,s)

write('tests/scripts/verify-artwork-title-geometry.js',"""#!/usr/bin/env node
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'src/core/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
const idx=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}
ok(idx.includes('src/libraries/art/frame-geometry-library.js'),'frame geometry runtime library is loaded');
ok(app.includes("ARTWORK_GEOMETRY_CONTRACT='artwork-geometry-px-v1'"),'renderer declares pixel geometry contract');
ok(app.includes('function applyArtworkGeometryContract'),'renderer applies per-frame geometry');
ok(app.includes('function fitArtworkTitleToBox'),'title receives a measured fit inside its own box');
ok(css.includes('left:var(--art-title-left,26.2mm)!important'),'title x comes from frame geometry');
ok(css.includes('top:var(--art-title-top,24.2mm)!important'),'title y comes from frame geometry');
ok(css.includes('width:var(--art-title-width,157.8mm)!important'),'title width comes from frame geometry');
ok(css.includes('height:var(--art-title-height,19mm)!important'),'title height comes from frame geometry');
ok(css.includes('white-space:nowrap!important'),'title is kept on one line while fitting');
""")

write('tests/scripts/verify-frame-geometry-contract.py',"""#!/usr/bin/env python3
from pathlib import Path
import json, sys
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[2]
CHAPTERS=['space-wolves','ultramarines','blood-angels','dark-angels']
CONTRACT='artwork-geometry-px-v1'
fail=[]
for ch in CHAPTERS:
    mf=ROOT/f'assets/art/{ch}/frames/frame-manifest.json'; png=ROOT/f'assets/art/{ch}/frames/{ch}-a4-portrait.png'
    d=json.loads(mf.read_text()); g=d.get('artworkGeometry',{})
    if d.get('geometryContract')!=CONTRACT: fail.append(f'{ch}: missing geometry contract')
    canvas=g.get('canvasPx',{})
    if [canvas.get('width'),canvas.get('height')]!=[2480,3508]: fail.append(f'{ch}: canvas mismatch')
    b=g.get('titleBoxPx',{}); vals=[b.get(k) for k in ('x','y','width','height')]
    if not all(isinstance(v,(int,float)) for v in vals): fail.append(f'{ch}: titleBoxPx incomplete'); continue
    x,y,w,h=map(int,vals)
    if x<0 or y<0 or w<=0 or h<=0 or x+w>2480 or y+h>3508: fail.append(f'{ch}: titleBoxPx outside canvas')
    pad=g.get('titlePaddingPx',{}); l,r,t,bt=[int(pad.get(k,0)) for k in ('left','right','top','bottom')]
    if l+r>=w or t+bt>=h: fail.append(f'{ch}: title padding consumes title box')
    arr=np.array(Image.open(png).convert('RGBA')); crop=arr[y+t:y+h-bt,x+l:x+w-r]
    rgb=crop[:,:,:3].astype(float); a=crop[:,:,3]; mx=rgb.max(2); mn=rgb.min(2); lum=.2126*rgb[:,:,0]+.7152*rgb[:,:,1]+.0722*rgb[:,:,2]; sat=(mx-mn)/np.maximum(mx,1)
    calm=((a>240)&(lum>145)&(sat<.28)).mean()
    if calm<.97: fail.append(f'{ch}: title text-safe pixels only {calm:.3%} calm/light')
    panel=g.get('panelBoxPx',{})
    if int(panel.get('width',0))!=1896: fail.append(f'{ch}: panel width contract changed')
    print(f'PASS: {ch} titleBoxPx={x},{y},{w},{h}; calm/light={calm:.3%}')
js=(ROOT/'src/libraries/art/frame-geometry-library.js').read_text()
for ch in CHAPTERS:
    g=json.loads((ROOT/f'assets/art/{ch}/frames/frame-manifest.json').read_text())['artworkGeometry']; compact=json.dumps(g,separators=(',',':'))
    if f"'{ch}': Object.freeze({compact})" not in js: fail.append(f'{ch}: runtime geometry library drifted from manifest')
if fail:
    [print('FAIL:',x) for x in fail]; sys.exit(1)
print('Frame geometry contract verification complete.')
""")

print('v3.0.53 semantic migration applied')
