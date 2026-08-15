#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'src/core/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
function ok(v,m){ if(!v){console.error(`FAIL: ${m}`);process.exitCode=1;} else console.log(`PASS: ${m}`); }
ok(app.includes('function canUseAdaptiveDatasheetArtwork'),'shared adaptive artwork route exists');
ok(!app.includes("chapterKey!=='dark-angels'"),'adaptive renderer is no longer hard-coded to Dark Angels');
ok(app.includes("profile?.artwork?.renderer==='adaptive-datasheet'"),'Dark Angels adaptive renderer selection is independent of candidate status');
ok(app.includes("fragmentCardElement(createCard(entry,unit,'print'))"),'adaptive renderer reuses real print datasheet components');
ok(app.includes('function measureA4PanelPixels(card)'),'real panel pixel measurement exists');
ok(app.includes('function findLargestPixelFit'),'largest-fitting pixel search exists');
ok(app.includes('fitMountedPrintRoot(output);'),'printed output receives measurable pixel fit before printing');
ok(app.includes('function applyA4TypographyVars(target,scale=1)'),'explicit typography writer exists');
ok(app.includes("card.dataset.adaptiveMeasuredTier=mode==='flat'?'pixel-explicit-flat':'pixel-explicit-columns'"),'fit result records flat versus column mode');
ok(app.includes('function shouldShowGroupedModelLabel'),'composed-unit label de-duplication helper exists');
ok(css.includes('.rule-title-group>strong{margin-bottom:calc(2px * var(--print-scale));font-size:calc(5.15pt * var(--print-scale));letter-spacing:.08em}'),'normal print rules source labels remain reduced');
ok(css.includes('.artwork-print-panels .rule-title-group>strong'),'clean artwork rules source labels remain reduced');
ok(css.includes('border:0!important;') && css.includes('padding:0!important;'),'legacy data-card border/padding is removed');
ok(css.includes('> .codex-seamless-frame,') && css.includes('top:0!important;'),'art frame is pinned to the A4 origin');
ok(css.includes('left:26.2mm!important;') && css.includes('top:24.2mm!important;'),'title uses absolute A4 coordinates');
ok(css.includes('top:var(--adaptive-body-top,50.6mm)!important;'),'panel stack uses fixed A4 top');
ok(css.includes('width:var(--adaptive-body-width,160.5mm)!important;'),'panel width remains fixed');
ok(css.includes('.data-card.adaptive-datasheet-artwork') && css.includes('font-size:var(--a4-desc-font,12pt)!important'),'shared adaptive description typography is explicitly controlled');
if(!process.exitCode) console.log('Unified adaptive artwork pixel-fit verification complete.');
