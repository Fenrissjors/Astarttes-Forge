#!/usr/bin/env node
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
