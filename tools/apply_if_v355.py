#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import json, re

ROOT=Path(__file__).resolve().parents[1]
VERSION='3.0.55-imperial-fists-frame'
LIB_VERSION='3.0.55'
CH='imperial-fists'
ASSET=f'assets/art/{CH}/frames/{CH}-a4-portrait.png'
outdir=ROOT/f'assets/art/{CH}/frames'
outdir.mkdir(parents=True,exist_ok=True)

def replace_once(s,a,b,label):
    count=s.count(a)
    if count!=1: raise SystemExit(f'{label}: expected one anchor, got {count}')
    return s.replace(a,b,1)

def rw(path,fn):
    p=ROOT/path
    old=p.read_text()
    new=fn(old)
    if new==old: raise SystemExit(f'{path}: migration made no change')
    p.write_text(new)

# Build a physical A4 asset from the approved Imperial Fists artwork source.
# This opening contour is made for this artwork and never copies another Chapter mask.
src=Image.open('/tmp/imperial-fists-source.webp').convert('RGBA').resize((2480,3508),Image.Resampling.LANCZOS)
arr=np.array(src); arr[:,:,3]=255
img=Image.fromarray(arr)
alpha=Image.new('L',img.size,255)
d=ImageDraw.Draw(alpha)
left=[(390,560),(435,700),(540,1500),(440,2500),(515,3000),(690,3278)]
right=[(2480-x,y) for x,y in reversed(left)]
d.polygon(left+right,fill=0)
alpha=alpha.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v:0 if v<128 else 255)
img.putalpha(alpha)

# Keep the complete live title field empty, emblem-free and visually quiet.
base=np.array(img)
mask=Image.new('L',img.size,0)
dm=ImageDraw.Draw(mask)
for rect in ([300,255,2190,515],[380,290,1560,500],[1730,290,2110,500],[930,300,1545,505]):
    dm.rounded_rectangle(rect,radius=20,fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(10))
m=np.array(mask)/255.0
parchment=np.array([231,225,214],float)
rgb=base[:,:,:3].astype(float)
blend=.55*m[:,:,None]
base[:,:,:3]=np.clip(rgb*(1-blend)+parchment*blend,0,255).astype('uint8')
final=Image.fromarray(base).quantize(colors=256,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
final.save(outdir/f'{CH}-a4-portrait.png',optimize=True)

landmarks=json.loads((ROOT/'docs/design/A4-FRAME-MASTER-SKELETON.json').read_text())['landmarksPx']
geometry={
    'titleBoxPx':{'x':360,'y':280,'width':1760,'height':205},
    'canvasPx':{'width':2480,'height':3508},
    'titlePaddingPx':{'top':21,'right':76,'bottom':21,'left':76},
    'titleTypography':{'maxTitlePt':15.0,'minTitlePt':8.5,'kickerPt':6.5,'pointsPt':9.0,'singleLine':True},
    'panelBoxPx':{'x':292,'y':598,'width':1896,'bottom':3490}
}
manifest={
    'version':LIB_VERSION,'chapter':CH,'frameStandard':'a4-chapter-frame-gold-v1','goldenReference':False,
    'frames':{'a4Portrait':{'asset':ASSET,'pixelSize':[2480,3508],'physicalSizeMm':[210,297],
              'safeZone':{'x':0.21,'y':0.15,'width':0.58,'height':0.70,'minimumTransparency':0.90}}},
    'geometryMaster':'a4-chapter-frame-gold-v1','geometrySpec':'docs/design/A4-CHAPTER-FRAME-GOLD-STANDARD.json',
    'openingMode':'chapter-native','layoutLandmarksPx':landmarks,'nativeOpening':True,
    'outerEdgePolicy':'straight-full-bleed-a4','validationStatus':'PASS','validatedFrame':True,
    'geometryContract':'artwork-geometry-px-v1','artworkGeometry':geometry
}
(outdir/'frame-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
report={
    'version':LIB_VERSION,'chapter':CH,'status':'PASS','standard':'a4-chapter-frame-gold-v1','asset':ASSET,
    'notes':['Title plaque intentionally contains no baked chapter name.',
             'Title live-text field is clear of emblems.',
             'Opening contour is Imperial Fists-native and not copied from another Chapter.']
}
(outdir/'validation-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
(outdir/'README.md').write_text('# Imperial Fists A4 frame\n\nValidated yellow/black fortress and artillery frame using the shared Golden Frame Standard.\n')

rw('src/core/app.js',lambda s: replace_once(s,"const APP_VERSION = '3.0.54-black-templars-golden-frame';",f"const APP_VERSION = '{VERSION}';",'app version'))

def registry(s):
    s=replace_once(s,"version:'3.0.54-black-templars-golden-frame'",f"version:'{VERSION}'",'registry version')
    old="artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Bastion plate',decorationLabel:'FORTRESS · INDUSTRIAL',a4Frame:'',frameReady:false}"
    new="artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Bastion plate',decorationLabel:'FORTRESSES · ARTILLERY · HAZARD STRIPES',titleSurface:'#e1d7c6',a4Frame:'assets/art/imperial-fists/frames/imperial-fists-a4-portrait.png',frameManifest:'assets/art/imperial-fists/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true,candidateFrame:false,validationStatus:'PASS'}"
    return replace_once(s,old,new,'Imperial Fists registry profile')
rw('src/libraries/chapters/chapter-visual-registry.js',registry)
rw('src/libraries/chapters/decoration-pack-library.js',lambda s: replace_once(s,"version:'3.0.54'","version:'3.0.55'",'decoration version'))

compact=json.dumps(geometry,separators=(',',':'))
def geometry_lib(s):
    s=replace_once(s,"version:'3.0.54'","version:'3.0.55'",'geometry library version')
    if "'imperial-fists': Object.freeze(" in s: raise SystemExit('Imperial Fists geometry already present')
    anchor="\n  });\n  function pxToMmX"
    if anchor not in s: raise SystemExit('geometry object end missing')
    before,after=s.split(anchor,1)
    if not before.rstrip().endswith(')'): raise SystemExit('unexpected geometry tail')
    before=before.rstrip()+",\n    'imperial-fists': Object.freeze("+compact+")"
    return before+anchor+after
rw('src/libraries/art/frame-geometry-library.js',geometry_lib)
rw('src/libraries/art/a4-frame-engine.js',lambda s: replace_once(s,"version:'3.0.54'","version:'3.0.55'",'frame schema version'))

# Version tag only; layout is deliberately untouched.
def index_update(s):
    new=re.sub(r'v3\.0\.54[^<]*','v3.0.55 Imperial Fists Frame',s,count=1)
    if new==s: raise SystemExit('index version tag not found')
    return new
rw('index.html',index_update)

rw('tests/scripts/verify-runtime-hardening.js',lambda s: s.replace('3.0.54-black-templars-golden-frame',VERSION).replace('v3.0.54 app version','v3.0.55 app version'))

def registry_test(s):
    s=s.replace("r.version==='3.0.54-black-templars-golden-frame'",f"r.version==='{VERSION}'")
    s=s.replace('registry version is 3.0.53-artwork-geometry-contract','registry version is 3.0.55-imperial-fists-frame')
    # Title-surface and geometry lists already include Black Templars in v3.0.54.
    s=s.replace("['space-wolves','ultramarines','blood-angels','dark-angels','black-templars']", "['space-wolves','ultramarines','blood-angels','dark-angels','black-templars','imperial-fists']")
    s=s.replace("['space-wolves','ultramarines','blood-angels','dark-angels']", "['space-wolves','ultramarines','blood-angels','dark-angels','black-templars','imperial-fists']")
    anchor="assert(r.resolve('black-templars').artwork.validationStatus==='PASS','Black Templars validation status is PASS');"
    if anchor not in s: raise SystemExit('Black Templars registry-test anchor missing')
    extra="""
const ifFrame=r.frameAsset('imperial-fists','a4Portrait');
assert(ifFrame==='assets/art/imperial-fists/frames/imperial-fists-a4-portrait.png','Imperial Fists A4 frame routes through registry');
assert(fs.existsSync(path.join(root,ifFrame)),'Imperial Fists A4 frame asset exists');
assert(r.resolve('imperial-fists').artwork.frameReady===true,'Imperial Fists is promoted after validation passes');
assert(r.resolve('imperial-fists').artwork.candidateFrame===false,'Imperial Fists is no longer marked as a candidate frame');
assert(r.resolve('imperial-fists').artwork.validationStatus==='PASS','Imperial Fists validation status is PASS');"""
    s=s.replace(anchor,anchor+extra,1)
    # Explicitly remove Imperial Fists from the future empty-frame set.
    s=s.replace("!['space-wolves','ultramarines','blood-angels','dark-angels','black-templars'].includes(x)", "!['space-wolves','ultramarines','blood-angels','dark-angels','black-templars','imperial-fists'].includes(x)")
    s=s.replace("d.version==='3.0.54'","d.version==='3.0.55'").replace('decoration library consumes v3.0.54 registry','decoration library consumes v3.0.55 registry')
    dec="assert(d.resolve('Black Templars').frameAssets.a4Portrait===btFrame,'decoration pack exposes validated Black Templars frame');"
    if dec not in s: raise SystemExit('Black Templars decoration-test anchor missing')
    s=s.replace(dec,dec+"\nassert(d.resolve('Imperial Fists').frameAssets.a4Portrait===ifFrame,'decoration pack exposes validated Imperial Fists frame');",1)
    return s
rw('tests/scripts/verify-chapter-visual-registry.js',registry_test)

rw('tests/scripts/verify-frame-geometry-contract.py',lambda s: replace_once(s,
   "CHAPTERS=['space-wolves','ultramarines','blood-angels','dark-angels','black-templars']",
   "CHAPTERS=['space-wolves','ultramarines','blood-angels','dark-angels','black-templars','imperial-fists']",'geometry test chapters'))

(ROOT/'docs/RELEASE-v3.0.55.md').write_text('''# Astartes Forge v3.0.55 — Imperial Fists Frame\n\nAdds the validated Imperial Fists A4 frame with fortress, artillery, vehicle-track and hazard-stripe heraldry. The title field stays empty/emblem-free and the chapter name is not baked into the artwork.\n''')
p=ROOT/'CHANGELOG.md'; s=p.read_text()
if '## v3.0.55 — Imperial Fists Frame' not in s:
    s=s.replace('# Changelog\n\n','# Changelog\n\n## v3.0.55 — Imperial Fists Frame\n\n- Added validated Imperial Fists A4 artwork using the shared adaptive renderer and pixel geometry contract.\n- Title field remains empty/emblem-free; no Chapter name is baked into artwork.\n- Existing Golden references, Black Templars, A5, and A4 without artwork are unchanged.\n\n',1)
    p.write_text(s)
print('v3.0.55 Imperial Fists migration applied')
