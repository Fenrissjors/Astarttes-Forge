#!/usr/bin/env python3
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
def rd(p): return (R/p).read_text(encoding='utf-8')
def wr(p,s):
 q=R/p; q.parent.mkdir(parents=True,exist_ok=True); q.write_text(s,encoding='utf-8')
def one(p,a,b):
 s=rd(p); n=s.count(a)
 if n!=1: raise SystemExit(f'{p}: expected 1 match, got {n}: {a[:60]!r}')
 wr(p,s.replace(a,b,1))
G='src/libraries/chapters/chapter-visual-registry.js'
for x in ['space-wolves','ultramarines','blood-angels']:
 old=f"a4Frame:'assets/art/{x}/frames/{x}-a4-portrait.png',frameReady:true"
 one(G,old,old.replace(',frameReady:true',",renderer:'adaptive-datasheet',frameReady:true"))
one(G,"version:'3.0.50-explicit-pixel-typography'","version:'3.0.52-unified-adaptive-artwork'")
one('src/libraries/chapters/decoration-pack-library.js',"version:'3.0.50'","version:'3.0.52'")
one('src/libraries/art/a4-frame-engine.js',"version:'3.0.5'","version:'3.0.52'")
one('index.html','v3.0.50 Explicit Pixel Typography Fit','v3.0.52 Unified Adaptive Artwork')
one('README.md','# Astartes Forge v3.0.50 — Explicit Pixel Typography Fit','# Astartes Forge v3.0.52 — Unified Adaptive Artwork')
ch=rd('CHANGELOG.md')
if '## v3.0.52 — Unified Adaptive Artwork' not in ch:
 notes='''## v3.0.52 — Unified Adaptive Artwork\n\n- Space Wolves, Ultramarines, Blood Angels, and Dark Angels now share the user-approved adaptive A4 datasheet renderer.\n- The validated Golden frame PNGs are unchanged; only renderer routing/layout behaviour changes.\n- v3.0.51 measurable-print fitting is preserved. A5 and A4-without-artwork remain unchanged.\n\n## v3.0.51 — Measurable Print Fit\n\n- Exposes the hidden physical print DOM off-screen before adaptive fitting so the fitter measures real 210 mm geometry.\n- Runs the A4/A5 fit twice with a synchronous layout pass before printing.\n\n'''
 wr('CHANGELOG.md',ch.replace('# Changelog\n\n','# Changelog\n\n'+notes,1))
for p in ['assets/art/dark-angels/frames/frame-manifest.json','assets/art/dark-angels/frames/validation-report.json']:
 d=json.loads(rd(p)); d['version']='3.0.52'; wr(p,json.dumps(d,indent=2,ensure_ascii=False)+'\n')
one('tests/browser/a4-flat-flow-fit-harness.html','data-card dark-angels-datasheet-prototype adaptive-datasheet-artwork-prototype','data-card adaptive-datasheet-artwork adaptive-datasheet-artwork-prototype')
one('tests/scripts/verify-runtime-hardening.js',"ok(app.includes(\"const APP_VERSION = '3.0.50-explicit-pixel-typography'\"),'v3.0.50 app version');","ok(app.includes(\"const APP_VERSION = '3.0.52-unified-adaptive-artwork'\"),'v3.0.52 app version');")
T='tests/scripts/verify-chapter-visual-registry.js'
one(T,"assert(r.version==='3.0.50-explicit-pixel-typography','registry version is 3.0.50-explicit-pixel-typography');","assert(r.version==='3.0.52-unified-adaptive-artwork','registry version is 3.0.52-unified-adaptive-artwork');")
one(T,"assert(r.resolve('dark-angels').artwork.renderer==='adaptive-datasheet','Dark Angels keeps the approved adaptive datasheet renderer');","for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){ assert(r.resolve(id).artwork.renderer==='adaptive-datasheet',`${id} uses the approved adaptive datasheet renderer`); }")
one(T,"assert(d.version==='3.0.50','decoration library consumes v3.0.50 registry');","assert(d.version==='3.0.52','decoration library consumes v3.0.52 registry');")
T='tests/scripts/verify-dark-angels-prototype.js'
for a,b in [
("ok(app.includes('function canUseDarkAngelsDatasheetPrototype'),'Dark Angels prototype route exists');","ok(app.includes('function canUseAdaptiveDatasheetArtwork'),'shared adaptive artwork route exists');"),
("ok(app.includes(\"chapterKey!=='dark-angels'\"),'prototype is restricted to Dark Angels');","ok(!app.includes(\"chapterKey!=='dark-angels'\"),'adaptive renderer is no longer hard-coded to Dark Angels');"),
("ok(app.includes(\"fragmentCardElement(createCard(entry,unit,'print'))\"),'prototype reuses real print datasheet components');","ok(app.includes(\"fragmentCardElement(createCard(entry,unit,'print'))\"),'adaptive renderer reuses real print datasheet components');"),
("ok(app.includes('fitAllAdaptiveArtworkPages(output);'),'printed output receives measured fit before printing');","ok(app.includes('fitMountedPrintRoot(output);'),'printed output receives measurable pixel fit before printing');"),
("ok(css.includes('font-size:var(--a4-desc-font,12pt)!important'),'Dark Angels description typography is explicitly controlled');","ok(css.includes('.data-card.adaptive-datasheet-artwork') && css.includes('font-size:var(--a4-desc-font,12pt)!important'),'shared adaptive description typography is explicitly controlled');"),
("if(!process.exitCode) console.log('Dark Angels explicit pixel-fit verification complete.');","if(!process.exitCode) console.log('Unified adaptive artwork pixel-fit verification complete.');")]: one(T,a,b)
T='tests/scripts/verify-a5-adaptive-fit.js'
one(T,"ok(app.includes('void document.body.offsetHeight'),'beforeprint fitter forces a print-layout reflow before its second pass');\nok(app.includes('fitAllAdaptiveA5Cards(output);'),'A5 fitter runs for print output');","ok(app.includes('function fitMountedPrintRoot(root)') && app.includes('void root.offsetHeight'),'measurable print fitter forces physical-layout reflow before its second pass');\nok(app.includes('fitMountedPrintRoot(output);') && app.includes('fitAllAdaptiveA5Cards(root);'),'A5 fitter runs through measurable print output');")
wr('tests/scripts/verify-measurable-print-fit.js','''#!/usr/bin/env node\nconst fs=require('fs'),path=require('path'),r=path.resolve(__dirname,'../..');const a=fs.readFileSync(path.join(r,'src/core/app.js'),'utf8'),c=fs.readFileSync(path.join(r,'assets/css/styles.css'),'utf8');function o(v,m){if(!v){console.error('FAIL:',m);process.exitCode=1}else console.log('PASS:',m)}o(a.includes('function fitMountedPrintRoot(root)'),'measurable fitter exists');o(a.includes("body.classList.add('print-measure-layout')"),'measurement mode exists');o(a.includes('fitMountedPrintRoot(output);'),'print output uses measurable fit');o(c.includes('body.print-pack.print-measure-layout #armyPackPrint'),'hidden print root becomes measurable');o(c.includes('width:210mm!important'),'physical width preserved');\n''')
wr('docs/RELEASE-v3.0.51.md','# Astartes Forge v3.0.51 — Measurable Print Fit\n\nMakes the hidden print DOM measurable before adaptive fitting.\n')
wr('docs/RELEASE-v3.0.52.md','''# Astartes Forge v3.0.52 — Unified Adaptive Artwork\n\nSpace Wolves, Ultramarines, Blood Angels, and Dark Angels share the validated adaptive A4 datasheet renderer. Golden artwork assets are unchanged. A5 and A4 without artwork remain on their previous paths.\n''')
print('metadata/tests migration applied')
