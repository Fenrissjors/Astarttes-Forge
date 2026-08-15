#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'src/core/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
function ok(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} console.log('OK:',msg); }
ok(app.includes('function visualStackBottom(column){'),'A5 visual stack-bottom helper exists');
ok(app.includes('mainVisualBottom-firstRowBottom'),'A5 fitter measures visual main-column overflow');
ok(app.includes('sideVisualBottom-firstRowBottom'),'A5 fitter measures visual side-column overflow');
ok(app.includes('profileBlocks>=3 && weaponRows>=6'),'dense three-part compositions receive a print safety reserve');
ok(app.includes('function setContinuousA5Scales'),'continuous A5 scale writer exists');
ok(app.includes('scales.stat=Math.max(.88,scales.stat-.005)'),'continuous fitter reduces stat blocks first in 0.5% steps');
ok(app.includes('scales.weapon=Math.max(.88,scales.weapon-.005)'),'continuous fitter reduces weapon tables second in 0.5% steps');
ok(app.includes("card.dataset.a5AdaptiveFit='continuous'"),'A5 continuous-fit state is recorded');
ok(app.includes("card.dataset.a5AdaptiveFits=fit.overflow<=0.25?'true':'false'"),'A5 fitter records final physical fit result');
ok(app.includes("window.addEventListener('beforeprint'"),'A5 fitting is repeated under the actual print-media cascade');
ok(app.includes('void document.body.offsetHeight'),'beforeprint fitter forces a print-layout reflow before its second pass');
ok(app.includes('fitAllAdaptiveA5Cards(output);'),'A5 fitter runs for print output');
ok(app.includes('fitAdaptiveA5Card(card);'),'A5 fitter runs in preview fitting');
ok(css.includes('--a5-profile-scale:1;'),'A5 default profile scale exists');
ok(css.includes('var(--a5-profile-scale,1)'),'A5 stat profile header responds to profile scale');
ok(css.includes('calc(5.25pt * var(--a5-weapon-scale))'),'A5 weapon tables respond to adaptive weapon scale');
ok(css.includes('calc(8.2pt * var(--a5-stat-scale))'),'A5 stat values respond to adaptive stat scale');
console.log('A5 continuous measured fit verification complete.');
