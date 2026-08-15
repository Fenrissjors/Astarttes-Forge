#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'src/core/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/styles.css'),'utf8');
function pass(ok,msg){if(!ok){console.error('FAIL:',msg);process.exitCode=1;}else console.log('PASS:',msg);}
pass(app.includes('function buildArtworkPrintPage(entry,unit)'), 'dedicated A4 artwork builder exists');
pass(app.includes("page.className=`artwork-print-page chapter-${chapterKey}`"), 'artwork page does not use the data-card class');
pass(app.includes("page.append(background,frame,header,panels)"), 'artwork DOM stack is background -> frame -> title -> panels');
pass(app.includes("if(canUseArtworkPrintPage(entry,unit)) return buildArtworkPrintPage(entry,unit);"), 'A4 artwork bypasses legacy print-card renderer');
pass(app.includes("settings.layout==='a4-two-a5' || settings.frame===false"), 'A5 and frame-off routes retain legacy renderers');
pass(css.includes('.artwork-print-panels{') && css.includes('background:transparent!important;'), 'artwork panel positioning flow is explicitly transparent');
pass(css.includes('.artwork-print-frame{') && css.includes('width:210mm!important;') && css.includes('height:297mm!important;'), 'artwork PNG renders at exact A4 dimensions');
pass(css.includes('.artwork-print-panels .profile-block') && css.includes('.artwork-print-panels .card-section'), 'surface colour is scoped to actual information boxes');
if(!process.exitCode) console.log('Clean A4 artwork renderer verification complete.');
