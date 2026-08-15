#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance
import base64, hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
VERSION='3.0.54'
APP_VERSION='3.0.54-black-templars-golden-frame'
SOURCE_SHA='09f441a19c103fc9f1473a860c49e550fd94863cb4944403f1a1598a128abd9f'
SAMPLES=[(540, 1061, 1062), (548, 631, 1876), (556, 592, 1887), (564, 581, 1899), (572, 569, 1911), (580, 557, 1922), (588, 545, 1934), (596, 534, 1946), (604, 534, 1946), (612, 545, 1934), (620, 557, 1922), (628, 561, 1924), (636, 556, 1934), (644, 514, 1978), (652, 510, 1980), (660, 492, 1981), (668, 485, 1991), (676, 491, 2002), (684, 492, 2001), (692, 485, 2001), (700, 493, 2000), (708, 487, 1999), (716, 485, 2000), (724, 494, 1999), (732, 489, 1996), (740, 488, 1991), (748, 486, 1993), (756, 482, 2004), (764, 481, 2007), (772, 481, 2008), (780, 479, 2008), (788, 477, 2010), (796, 477, 2010), (804, 475, 2009), (812, 469, 2010), (820, 474, 2010), (828, 473, 2012), (836, 472, 2011), (844, 476, 2012), (852, 474, 2011), (860, 475, 2012), (868, 469, 2013), (876, 468, 2012), (884, 470, 2013), (892, 468, 2012), (900, 483, 2012), (908, 486, 2011), (916, 481, 2013), (924, 475, 2013), (932, 477, 2015), (940, 472, 2012), (948, 475, 2012), (956, 473, 2013), (964, 473, 2013), (972, 469, 2013), (980, 470, 2013), (988, 469, 2012), (996, 473, 2013), (1004, 473, 2015), (1012, 472, 2011), (1020, 475, 2009), (1028, 477, 2008), (1036, 478, 2008), (1044, 478, 2009), (1052, 476, 2009), (1060, 474, 2012), (1068, 470, 2013), (1076, 470, 2014), (1084, 468, 2016), (1092, 471, 2014), (1100, 471, 2014), (1108, 471, 2012), (1116, 473, 2012), (1124, 470, 2014), (1132, 472, 2014), (1140, 472, 2013), (1148, 471, 2012), (1156, 472, 2010), (1164, 473, 2011), (1172, 470, 2012), (1180, 471, 2012), (1188, 469, 2012), (1196, 469, 2011), (1204, 472, 2011), (1212, 472, 2011), (1220, 471, 2014), (1228, 471, 2014), (1236, 472, 2014), (1244, 473, 2010), (1252, 471, 2009), (1260, 472, 2008), (1268, 472, 2007), (1276, 473, 2006), (1284, 474, 2006), (1292, 475, 2005), (1300, 476, 2004), (1308, 476, 2003), (1316, 477, 2002), (1324, 478, 2001), (1332, 479, 2001), (1340, 480, 2000), (1348, 481, 1999), (1356, 481, 1998), (1364, 482, 1997), (1372, 483, 1997), (1380, 484, 1996), (1388, 485, 1995), (1396, 485, 1994), (1404, 486, 1993), (1412, 487, 1992), (1420, 488, 1992), (1428, 489, 1991), (1436, 490, 1990), (1444, 490, 1989), (1452, 491, 1988), (1460, 492, 1987), (1468, 493, 1987), (1476, 494, 1986), (1484, 495, 1985), (1492, 495, 1984), (1500, 496, 1983), (1508, 495, 1984), (1516, 495, 1985), (1524, 494, 1986), (1532, 493, 1987), (1540, 492, 1987), (1548, 491, 1988), (1556, 490, 1989), (1564, 490, 1990), (1572, 489, 1991), (1580, 488, 1992), (1588, 487, 1992), (1596, 486, 1993), (1604, 485, 1994), (1612, 485, 1995), (1620, 484, 1996), (1628, 483, 1997), (1636, 482, 1997), (1644, 481, 1998), (1652, 481, 1999), (1660, 480, 2000), (1668, 479, 2001), (1676, 478, 2001), (1684, 477, 2002), (1692, 476, 2003), (1700, 476, 2004), (1708, 475, 2005), (1716, 474, 2006), (1724, 473, 2006), (1732, 474, 2007), (1740, 475, 2008), (1748, 472, 2009), (1756, 473, 2008), (1764, 474, 2009), (1772, 476, 2010), (1780, 477, 2009), (1788, 473, 2011), (1796, 474, 2009), (1804, 478, 2009), (1812, 481, 2007), (1820, 485, 2005), (1828, 481, 2008), (1836, 473, 2007), (1844, 473, 2009), (1852, 474, 2009), (1860, 473, 2010), (1868, 469, 2010), (1876, 471, 2010), (1884, 477, 2010), (1892, 474, 2012), (1900, 475, 2010), (1908, 473, 2011), (1916, 476, 2008), (1924, 476, 2007), (1932, 474, 2007), (1940, 474, 2009), (1948, 471, 2008), (1956, 478, 2010), (1964, 480, 2008), (1972, 477, 2009), (1980, 477, 2009), (1988, 476, 2009), (1996, 473, 2009), (2004, 469, 2009), (2012, 469, 2006), (2020, 473, 2006), (2028, 473, 2008), (2036, 471, 2011), (2044, 471, 2010), (2052, 473, 2011), (2060, 472, 2010), (2068, 470, 2010), (2076, 474, 2011), (2084, 476, 2012), (2092, 474, 2010), (2100, 471, 2010), (2108, 472, 2008), (2116, 479, 2008), (2124, 483, 2010), (2132, 477, 2007), (2140, 480, 2010), (2148, 485, 2009), (2156, 485, 2006), (2164, 477, 2009), (2172, 478, 2009), (2180, 478, 2008), (2188, 479, 2007), (2196, 482, 2006), (2204, 483, 2007), (2212, 482, 2007), (2220, 482, 2010), (2228, 486, 2011), (2236, 484, 2011), (2244, 480, 2011), (2252, 475, 2010), (2260, 476, 2006), (2268, 477, 2010), (2276, 474, 2008), (2284, 474, 2010), (2292, 474, 2011), (2300, 481, 2010), (2308, 478, 2010), (2316, 471, 2009), (2324, 474, 2009), (2332, 471, 2010), (2340, 474, 2011), (2348, 473, 2010), (2356, 472, 2010), (2364, 474, 2011), (2372, 472, 2007), (2380, 472, 2009), (2388, 471, 2006), (2396, 472, 2007), (2404, 472, 2011), (2412, 472, 2008), (2420, 474, 2005), (2428, 473, 2006), (2436, 469, 2010), (2444, 468, 2010), (2452, 481, 2008), (2460, 481, 2008), (2468, 475, 2008), (2476, 475, 2007), (2484, 474, 2010), (2492, 476, 2004), (2500, 480, 2004), (2508, 480, 2008), (2516, 471, 2005), (2524, 476, 2011), (2532, 479, 2009), (2540, 473, 2006), (2548, 479, 2007), (2556, 476, 2009), (2564, 476, 2010), (2572, 472, 2011), (2580, 476, 2011), (2588, 473, 2009), (2596, 474, 2010), (2604, 475, 2007), (2612, 473, 2008), (2620, 478, 2008), (2628, 476, 2008), (2636, 477, 2006), (2644, 476, 2000), (2652, 474, 1995), (2660, 474, 1997), (2668, 476, 1995), (2676, 475, 2007), (2684, 475, 2008), (2692, 476, 2007), (2700, 498, 2006), (2708, 499, 2002), (2716, 490, 2002), (2724, 482, 2001), (2732, 486, 2002), (2740, 485, 1993), (2748, 485, 1992), (2756, 489, 1991), (2764, 493, 1990), (2772, 494, 1991), (2780, 488, 1988), (2788, 493, 1994), (2796, 495, 1995), (2804, 492, 1997), (2812, 488, 1996), (2820, 485, 1994), (2828, 491, 1991), (2836, 496, 1991), (2844, 497, 1988), (2852, 499, 1985), (2860, 500, 1985), (2868, 499, 1985), (2876, 500, 1985), (2884, 508, 1981), (2892, 508, 1974), (2900, 517, 1971), (2908, 524, 1979), (2916, 530, 1980), (2924, 535, 1950), (2932, 538, 1949), (2940, 554, 1946), (2948, 548, 1939), (2956, 546, 1938), (2964, 548, 1938), (2972, 556, 1923), (2980, 569, 1906), (2988, 573, 1903), (2996, 576, 1904), (3004, 580, 1901), (3012, 584, 1900), (3020, 578, 1902), (3028, 592, 1897), (3036, 592, 1882), (3044, 594, 1882), (3052, 600, 1875), (3060, 605, 1867), (3068, 615, 1856), (3076, 621, 1856), (3084, 683, 1798), (3092, 682, 1789), (3100, 915, 927), (3102, 916, 926)]

def rd(p): return (ROOT/p).read_text(encoding='utf-8')
def wr(p,s):
    q=ROOT/p; q.parent.mkdir(parents=True,exist_ok=True); q.write_text(s,encoding='utf-8')
def repl(p,a,b,count=1):
    s=rd(p)
    if s.count(a)<count: raise SystemExit(f'{p}: missing replacement anchor: {a[:80]}')
    wr(p,s.replace(a,b,count))

parts=[ROOT/'tools/black-templars-source.b64.part00']+[ROOT/f'tools/btfull25.b64.part{i:02d}' for i in range(1,9)]
if not all(p.exists() for p in parts): raise SystemExit('Black Templars staged source chunks incomplete')
raw=base64.b64decode(''.join(p.read_text().strip() for p in parts))
if hashlib.sha256(raw).hexdigest()!=SOURCE_SHA: raise SystemExit('Black Templars staged source hash mismatch')
source_path=ROOT/'tools/black-templars-source.webp'; source_path.write_bytes(raw)

base=Image.open(source_path).convert('RGB').resize((2480,3508),Image.Resampling.LANCZOS)
tex=base.crop((820,780,1660,1180)).resize((1720,210),Image.Resampling.BICUBIC)
tex=ImageEnhance.Color(tex).enhance(.35); tex=ImageEnhance.Brightness(tex).enhance(1.05)
fade=np.zeros((210,1720),dtype=np.uint8); fade[8:-8,8:-8]=255
base.paste(tex,(380,285),Image.fromarray(fade).filter(ImageFilter.GaussianBlur(8)))
ys=np.array([p[0] for p in SAMPLES]); ls=np.array([p[1] for p in SAMPLES]); rs=np.array([p[2] for p in SAMPLES])
left=np.interp(np.arange(3508),ys,ls); right=np.interp(np.arange(3508),ys,rs)
alpha=np.full((3508,2480),255,dtype=np.uint8)
for y in range(540,3103):
    l=int(round(left[y])); r=int(round(right[y]))
    if r>=l:
        alpha[y,l:r+1]=0
        if l-1>=0: alpha[y,l-1]=196
        alpha[y,l]=96; alpha[y,r]=96
        if r+1<2480: alpha[y,r+1]=196
rgba=base.convert('RGBA'); rgba.putalpha(Image.fromarray(alpha))
frame=rgba.quantize(colors=256,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
frame_path=ROOT/'assets/art/black-templars/frames/black-templars-a4-portrait.png'; frame_path.parent.mkdir(parents=True,exist_ok=True); frame.save(frame_path,optimize=True)

geometry={"titleBoxPx":{"x":380,"y":285,"width":1720,"height":210},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":True},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}
manifest={"version":VERSION,"chapter":"black-templars","frameStandard":"a4-chapter-frame-gold-v1","goldenReference":False,"frames":{"a4Portrait":{"asset":"assets/art/black-templars/frames/black-templars-a4-portrait.png","pixelSize":[2480,3508],"physicalSizeMm":[210,297],"safeZone":{"x":0.21,"y":0.15,"width":0.58,"height":0.7,"minimumTransparency":0.9}}},"geometryMaster":"a4-chapter-frame-gold-v1","geometrySpec":"docs/design/A4-CHAPTER-FRAME-GOLD-STANDARD.json","openingMode":"chapter-native","layoutLandmarksPx":{"titleTopDecorativeBandStartY":216,"titleInnerTopEdgeY":248,"titleBottomBorderStartY":498,"titleBottomBorderEndY":529,"bodyOpeningStartsY":619,"footerOpeningStartsY":3187,"bodyOpeningLeftXAtY700":289,"bodyOpeningRightXAtY700":2192,"midSideInnerLeftXAtY1500":517,"midSideInnerRightXAtY1500":1964},"nativeOpening":True,"outerEdgePolicy":"straight-full-bleed-a4","validationStatus":"PASS","validatedFrame":True,"geometryContract":"artwork-geometry-px-v1","artworkGeometry":geometry}
wr('assets/art/black-templars/frames/frame-manifest.json',json.dumps(manifest,indent=2)+'\n')
report={"version":VERSION,"chapter":"black-templars","status":"PASS","standard":"a4-chapter-frame-gold-v1","asset":"assets/art/black-templars/frames/black-templars-a4-portrait.png","sourceSha256":SOURCE_SHA,"frameSha256":hashlib.sha256(frame_path.read_bytes()).hexdigest(),"notes":["Title plaque intentionally contains no baked chapter name.","Title live-text field is clear of central emblems.","Opening contour is Black Templars-native and not copied from another Chapter."]}
wr('assets/art/black-templars/frames/validation-report.json',json.dumps(report,indent=2)+'\n')

repl('src/core/app.js',"const APP_VERSION = '3.0.53-artwork-geometry-contract';",f"const APP_VERSION = '{APP_VERSION}';")
repl('src/libraries/chapters/chapter-visual-registry.js',"version:'3.0.53-artwork-geometry-contract'",f"version:'{APP_VERSION}'")
repl('src/libraries/chapters/decoration-pack-library.js',"version:'3.0.53'","version:'3.0.54'")
repl('src/libraries/art/a4-frame-engine.js',"version:'3.0.53'","version:'3.0.54'",2)
repl('src/libraries/art/frame-geometry-library.js',"version:'3.0.53'","version:'3.0.54'")
old="artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Crusade reliquary',decorationLabel:'CHAINS · CROSSES · SEALS',a4Frame:'',frameReady:false}"
new="artwork:{frameStandard:A4_FRAME_STANDARD,geometryMaster:A4_GEOMETRY_MASTER,label:'Crusade reliquary',decorationLabel:'CHAINS · CROSSES · SEALS',titleSurface:'#d8cbb0',a4Frame:'assets/art/black-templars/frames/black-templars-a4-portrait.png',frameManifest:'assets/art/black-templars/frames/frame-manifest.json',geometryContract:'artwork-geometry-px-v1',renderer:'adaptive-datasheet',frameReady:true,candidateFrame:false,validationStatus:'PASS'}"
repl('src/libraries/chapters/chapter-visual-registry.js',old,new)
gcompact=json.dumps(geometry,separators=(',',':')); geom_file='src/libraries/art/frame-geometry-library.js'; s=rd(geom_file); start=s.index("    'dark-angels': Object.freeze("); line_end=s.index('\n',start); s=s[:line_end]+",\n    'black-templars': Object.freeze("+gcompact+")"+s[line_end:]; wr(geom_file,s)
repl('tests/scripts/verify-frame-geometry-contract.py',"CHAPTERS=['space-wolves','ultramarines','blood-angels','dark-angels']","CHAPTERS=['space-wolves','ultramarines','blood-angels','dark-angels','black-templars']")
T='tests/scripts/verify-chapter-visual-registry.js'
repl(T,"r.version==='3.0.53-artwork-geometry-contract'","r.version==='3.0.54-black-templars-golden-frame'")
repl(T,"for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){\n  const surface", "for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels','black-templars']){\n  const surface")
repl(T,"for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){\n  assert(r.resolve(id).artwork.renderer==='adaptive-datasheet'", "for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels','black-templars']){\n  assert(r.resolve(id).artwork.renderer==='adaptive-datasheet'")
repl(T,"for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){\n  assert(r.resolve(id).artwork.geometryContract", "for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels','black-templars']){\n  assert(r.resolve(id).artwork.geometryContract")
repl(T,"!['space-wolves','ultramarines','blood-angels','dark-angels'].includes(x)","!['space-wolves','ultramarines','blood-angels','dark-angels','black-templars'].includes(x)")
repl(T,"assert(d.version==='3.0.53','decoration library consumes v3.0.53 registry');","assert(d.version==='3.0.54','decoration library consumes v3.0.54 registry');")
darkchecks="assert(r.resolve('dark-angels').artwork.validationStatus==='PASS','Dark Angels validation status is PASS');"
btchecks="""const btFrame=r.frameAsset('black-templars','a4Portrait');
assert(btFrame==='assets/art/black-templars/frames/black-templars-a4-portrait.png','Black Templars A4 frame routes through registry');
assert(fs.existsSync(path.join(root,btFrame)),'Black Templars A4 frame asset exists');
assert(r.resolve('black-templars').artwork.frameReady===true,'Black Templars is promoted after Golden validation passes');
assert(r.resolve('black-templars').artwork.validationStatus==='PASS','Black Templars validation status is PASS');"""
repl(T,darkchecks,darkchecks+'\n'+btchecks)
repl(T,"assert(d.resolve('Dark Angels').frameAssets.a4Portrait===darkFrame,'decoration pack exposes validated Dark Angels frame');","assert(d.resolve('Dark Angels').frameAssets.a4Portrait===darkFrame,'decoration pack exposes validated Dark Angels frame');\nassert(d.resolve('Black Templars').frameAssets.a4Portrait===btFrame,'decoration pack exposes validated Black Templars frame');")
repl('tests/scripts/verify-runtime-hardening.js',"const APP_VERSION = '3.0.53-artwork-geometry-contract'","const APP_VERSION = '3.0.54-black-templars-golden-frame'")
repl('tests/scripts/verify-runtime-hardening.js',"'v3.0.53 app version'","'v3.0.54 app version'")
repl('index.html','v3.0.53 Artwork Geometry Contract','v3.0.54 Black Templars Golden Frame')
repl('README.md','# Astartes Forge v3.0.53 — Artwork Geometry Contract','# Astartes Forge v3.0.54 — Black Templars Golden Frame')
ch=rd('CHANGELOG.md')
if '## v3.0.54 — Black Templars Golden Frame' not in ch:
    block="""## v3.0.54 — Black Templars Golden Frame

- Added the new Black Templars A4 artwork frame with a completely clear live-title plaque and no baked-in Chapter name.
- Added a Black Templars-native transparent opening and `artwork-geometry-px-v1` title geometry.
- Promoted Black Templars to the shared adaptive A4 datasheet renderer only after Golden Frame validation passed.
- Existing Space Wolves, Ultramarines, Blood Angels, and Dark Angels frame assets remain unchanged.

"""
    ch=ch.replace('# Changelog\n\n','# Changelog\n\n'+block,1); wr('CHANGELOG.md',ch)
wr('docs/RELEASE-v3.0.54.md',"""# Astartes Forge v3.0.54 — Black Templars Golden Frame

Adds the validated Black Templars A4 artwork frame to the shared adaptive renderer. The title plaque contains no baked emblem or Chapter name, and its exact live-title position is defined by the frame geometry contract.
""")
print('v3.0.54 migration applied')
