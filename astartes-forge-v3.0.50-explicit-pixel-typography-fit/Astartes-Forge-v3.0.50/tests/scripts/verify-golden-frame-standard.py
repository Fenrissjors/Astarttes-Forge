#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, sys
ROOT=Path(__file__).resolve().parents[2]
SPEC=ROOT/'docs/design/A4-CHAPTER-FRAME-GOLD-STANDARD.json'
spec=json.loads(SPEC.read_text())
failed=False

def check(ok,msg):
    global failed
    print(('PASS: ' if ok else 'FAIL: ')+msg)
    failed |= not ok

check(spec['id']=='a4-chapter-frame-gold-v1','golden standard id is a4-chapter-frame-gold-v1')
check(spec['canvas']['pixelSize']==[2480,3508],'golden raster is 2480x3508')
check(spec['canvas']['physicalMm']==[210,297],'golden physical page is A4 210x297 mm')
check(spec['canvas']['overscanMm']==[0,0,0,0],'golden artwork uses zero overscan')
check(spec['layerContract']==['A4 full-page background colour','chapter artwork frame','live title text','individual live information panels'],'clean four-layer contract is locked')

for chapter,ref in spec['referenceFrames'].items():
    path=ROOT/ref['asset']
    check(path.exists(),f'{chapter} golden asset exists')
    if path.exists():
        digest=hashlib.sha256(path.read_bytes()).hexdigest()
        check(digest==ref['sha256'],f'{chapter} golden PNG hash is unchanged')
    manifest=path.parent/'frame-manifest.json'
    check(manifest.exists(),f'{chapter} manifest exists')
    if manifest.exists():
        m=json.loads(manifest.read_text())
        check(m.get('goldenReference') is True,f'{chapter} is marked goldenReference')
        check(m.get('frameStandard')==spec['id'],f'{chapter} uses the golden standard')
        check(m.get('lockedSha256')==ref['sha256'],f'{chapter} manifest hash matches standard')
        check(m.get('outerEdgePolicy')=='straight-full-bleed-a4',f'{chapter} uses straight full-bleed A4 edge policy')
        check(m.get('openingMode')=='chapter-native',f'{chapter} keeps a chapter-native opening')

registry=(ROOT/'src/libraries/chapters/chapter-visual-registry.js').read_text()
check("const A4_FRAME_STANDARD='a4-chapter-frame-gold-v1';" in registry and 'const A4_GEOMETRY_MASTER=A4_FRAME_STANDARD;' in registry,'visual registry uses neutral golden frame standard')
for chapter in spec['referenceFrames']:
    check(f"'{chapter}'" in registry and 'frameReady:true' in registry,f'{chapter} remains represented by a frameReady profile')

sys.exit(1 if failed else 0)
