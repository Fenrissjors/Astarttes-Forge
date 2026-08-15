#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'src/core/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exitCode=1;}else console.log('PASS:',m);}
const measure=app.slice(app.indexOf('function measureA4PanelPixels(card)'), app.indexOf('function setA4ColumnScale'));
ok(app.includes('function measureA4PanelPixels(card)'), 'panel-to-pixel measurement exists');
ok(app.includes('adaptiveVisiblePanels(body)'), 'all visible datasheet panels are inspected');
ok(app.includes('rect.bottom-safeBottom'), 'panel bottoms are compared to physical A4 safe bottom');
ok(!measure.includes('scrollHeight'), 'structural scrollHeight is not used as A4 fit authority');
ok(app.includes('function findLargestPixelFit'), 'bracket and binary largest-fitting search exists');
ok(app.includes("mode:(main&&side)?'columns':'flat'"), 'pixel fitter detects column and flat composed layouts');
ok(app.includes("if(mode==='flat')"), 'flat composed layouts enter the generic fit path');
ok(app.includes('function applyA4TypographyVars(target,scale=1)'), 'explicit typography scale writer exists');
ok(app.includes("target.style.setProperty('--a4-desc-font',pt(A4_TYPE_BASE.description*s))"), 'description point size is explicitly recalculated');
ok(app.includes('description:12'), 'description baseline is exactly 12pt');
ok(css.includes('font-size:var(--a4-desc-font,12pt)!important'), 'Dark Angels descriptions consume explicit 12pt variable');
ok(css.includes('font-size:var(--a4-section-header-font,13.2pt)!important'), 'section headers consume a larger explicit font variable');
ok(css.includes('font-size:var(--a4-weapon-font,9.4pt)!important'), 'weapon tables consume explicit fitted font size');
ok(app.includes("ADAPTIVE_ARTWORK_BASE={top:'50.6mm',width:'160.5mm'"), 'approved panel width remains fixed');
ok(css.includes('width:var(--adaptive-body-width,160.5mm)!important;'), 'CSS keeps the approved panel width fixed');
ok(app.includes("card.dataset.adaptiveScaleEffective='true'"), 'successful scaling is recorded');
ok(!/Deathwing Knights|Inner Circle Companions|Azrael|Ezekiel|Captain in Terminator Armour/.test(app), 'no unit-specific hard fixes exist');
if(!process.exitCode) console.log('A4 explicit panel-to-pixel fit verification complete.');
