#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'../..');
global.window={};

function load(rel){
  const code=fs.readFileSync(path.join(root,rel),'utf8');
  vm.runInThisContext(code,{filename:rel});
}
function assert(condition,message){
  if(!condition){console.error(`FAIL: ${message}`); process.exitCode=1;}
  else console.log(`PASS: ${message}`);
}

load('src/libraries/chapters/chapter-visual-registry.js');
const r=window.ASTARTES_CHAPTER_VISUAL_REGISTRY;
assert(!!r,'visual registry loads');
assert(r.version==='3.0.52-unified-adaptive-artwork','registry version is 3.0.52-unified-adaptive-artwork');
assert(r.a4GeometryMaster==='a4-chapter-frame-gold-v1','neutral A4 Golden Standard is the shared frame contract');
assert(r.a4FrameStandard==='a4-chapter-frame-gold-v1','registry exposes the A4 Golden Standard id');

const expected={
  'space-wolves':['#354a5f','#b31f2b','#efe4ca','#e4edf1'],
  'ultramarines':['#164b9b','#d4af37','#f0e4c8','#e7edf8'],
  'blood-angels':['#9f171c','#f0c245','#f1e3c7','#f7e8e6'],
  'dark-angels':['#173b2b','#d8c9a7','#eee2c8','#e6eee8'],
  'black-templars':['#17191d','#d8cbb0','#eee1c7','#ececed'],
  'imperial-fists':['#c99f00','#a72820','#f1e4c4','#fbf3cf'],
  'salamanders':['#176f45','#151515','#ead9bd','#e5f1e9'],
  'white-scars':['#e4e0d6','#b51f2e','#f0e4ca','#f4f2ed'],
  'raven-guard':['#1c2028','#aeb7c2','#ebe0c8','#eceef1'],
  'iron-hands':['#17191d','#9ba5af','#e9dfca','#eceeef'],
  'deathwatch':['#111318','#aeb6bf','#ebe0c9','#eceeef'],
  'crimson-fists':['#183d79','#b21f2d','#eee2c9','#e8edf6'],
  'flesh-tearers':['#68151b','#17191d','#ecddc5','#f3e6e7'],
  'generic-astartes':['#334155','#b8963e','#eee2c8','#e9edf1']
};
for(const [id,[primary,accent,paper,surface]] of Object.entries(expected)){
  const p=r.resolve(id);
  assert(p.id===id,`${id} resolves to its own profile`);
  assert(p.theme.primary===primary && p.theme.accent===accent && p.theme.paper===paper,`${id} palette preserved from v3.0.17`);
  assert(p.printSurface===surface,`${id} chapter-light surface preserved`);
  assert(p.artwork.geometryMaster==='a4-chapter-frame-gold-v1',`${id} uses the shared A4 geometry master`);
}

const detectionCases=[
  [['Adeptus Astartes','Space Wolves'],'Space Wolves','space-wolves'],
  [['Space Marines - Ultramarines'],'Ultramarines','ultramarines'],
  [['Adeptus Astartes','Blood Angels'],'Blood Angels','blood-angels'],
  [['Adeptus Astartes','Dark Angels'],'Dark Angels','dark-angels'],
  [['Adeptus Astartes','Black Templars'],'Black Templars','black-templars'],
  [['Adeptus Astartes','Imperial Fists'],'Imperial Fists','imperial-fists'],
  [['Adeptus Astartes','Salamanders'],'Salamanders','salamanders'],
  [['Adeptus Astartes','White Scars'],'White Scars','white-scars'],
  [['Adeptus Astartes','Raven Guard'],'Raven Guard','raven-guard'],
  [['Adeptus Astartes','Iron Hands'],'Iron Hands','iron-hands'],
  [['Adeptus Astartes','Blood Ravens'],'Blood Ravens','generic-astartes'],
  [['Adeptus Astartes'],'Generic Adeptus Astartes','generic-astartes']
];
for(const [values,name,key] of detectionCases){
  assert(r.detectName(values)===name,`detectName(${values.join(' | ')}) => ${name}`);
  assert(r.detectKey(values)===key,`detectKey(${values.join(' | ')}) => ${key}`);
}


for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){
  const surface=r.resolve(id).artwork?.titleSurface;
  assert(/^#[0-9a-f]{6}$/i.test(surface||''),`${id} artwork exposes a title-surface contrast swatch`);
}


for(const id of ['space-wolves','ultramarines','blood-angels']){
  const p=r.resolve(id);
  assert(p.artwork.frameStandard==='a4-chapter-frame-gold-v1',`${id} declares the Golden Frame Standard`);
  assert(p.artwork.goldenReference===true,`${id} is a locked golden reference`);
}

const swFrame=r.frameAsset('space-wolves','a4Portrait');
assert(swFrame==='assets/art/space-wolves/frames/space-wolves-a4-portrait.png','Space Wolves A4 frame routes through registry');
assert(fs.existsSync(path.join(root,swFrame)),'Space Wolves A4 frame asset exists');
const ultraFrame=r.frameAsset('ultramarines','a4Portrait');
assert(ultraFrame==='assets/art/ultramarines/frames/ultramarines-a4-portrait.png','Ultramarines A4 frame routes through registry');
assert(fs.existsSync(path.join(root,ultraFrame)),'Ultramarines A4 frame asset exists');
const bloodFrame=r.frameAsset('blood-angels','a4Portrait');
assert(bloodFrame==='assets/art/blood-angels/frames/blood-angels-a4-portrait.png','Blood Angels A4 frame routes through registry');
assert(fs.existsSync(path.join(root,bloodFrame)),'Blood Angels A4 frame asset exists');
const darkFrame=r.frameAsset('dark-angels','a4Portrait');
assert(darkFrame==='assets/art/dark-angels/frames/dark-angels-a4-portrait.png','Dark Angels validated A4 frame routes through registry');
assert(fs.existsSync(path.join(root,darkFrame)),'Dark Angels validated A4 frame asset exists');
assert(r.resolve('dark-angels').artwork.frameReady===true,'Dark Angels is promoted after Golden validation passes');
assert(r.resolve('dark-angels').artwork.candidateFrame===false,'Dark Angels is no longer marked as a candidate frame');
assert(r.resolve('dark-angels').artwork.validationStatus==='PASS','Dark Angels validation status is PASS');
for(const id of ['space-wolves','ultramarines','blood-angels','dark-angels']){ assert(r.resolve(id).artwork.renderer==='adaptive-datasheet',`${id} uses the approved adaptive datasheet renderer`); }
for(const id of Object.keys(expected).filter(x=>!['space-wolves','ultramarines','blood-angels','dark-angels'].includes(x))){
  assert(r.frameAsset(id,'a4Portrait')==='',`${id} has an empty A4 frame slot ready for future artwork`);
}

load('src/libraries/chapters/decoration-pack-library.js');
const d=window.ASTARTES_DECORATION_PACK_LIBRARY;
assert(d.version==='3.0.52','decoration library consumes v3.0.52 registry');
assert(d.resolve('Space Wolves').frameAssets.a4Portrait===swFrame,'decoration pack gets Space Wolves frame from registry');
assert(d.resolve('Ultramarines').frameAssets.a4Portrait===ultraFrame,'decoration pack gets Ultramarines frame from registry');
assert(d.resolve('Ultramarines').label==='Macragge laurels','decoration pack label comes from registry profile');
assert(d.resolve('Space Wolves').frameGeometryMaster==='a4-chapter-frame-gold-v1','Space Wolves pack exposes master frame geometry');
assert(d.resolve('Ultramarines').frameGeometryMaster==='a4-chapter-frame-gold-v1','Ultramarines pack exposes master frame geometry');
assert(d.resolve('Blood Angels').frameAssets.a4Portrait===bloodFrame,'decoration pack gets Blood Angels frame from registry');
assert(d.resolve('Blood Angels').label==='Sanguinary baroque','Blood Angels decoration pack label comes from registry profile');
assert(d.resolve('Blood Angels').frameGeometryMaster==='a4-chapter-frame-gold-v1','Blood Angels pack exposes master frame geometry');
assert(d.resolve('Dark Angels').frameAssets.a4Portrait===darkFrame,'decoration pack exposes validated Dark Angels frame');

for(const p of r.list().filter(x=>x.artwork?.frameReady)){
  assert(p.artwork.frameStandard==='a4-chapter-frame-gold-v1',`${p.id} cannot be frameReady outside the Golden Frame Standard`);
  assert(!!p.artwork.a4Frame,`${p.id} frameReady profile has an A4 asset path`);
}

if(process.exitCode){process.exit(process.exitCode);} else console.log('Chapter visual registry verification complete.');
