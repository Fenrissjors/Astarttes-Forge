#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'../..');
const app=fs.readFileSync(path.join(root,'src/core/app.js'),'utf8');
function ok(cond,msg){ if(!cond){console.error('FAIL:',msg);process.exitCode=1;} else console.log('PASS:',msg); }
ok(app.includes("const APP_VERSION = '3.0.50-explicit-pixel-typography'"),'v3.0.50 app version');
ok(app.includes('function makeRuntimeId('),'compatible runtime ID generator exists');
ok(!app.includes('crypto.randomUUID()'),'no direct crypto.randomUUID dependency remains');
ok(app.includes('function storageJson('),'safe JSON storage loader exists');
ok(!/JSON\.parse\(localStorage\.getItem/.test(app),'startup does not parse localStorage directly');
ok(!/localStorage\.setItem/.test(app),'writes are routed through safe storage wrapper');
ok(app.includes("$('#importNewRecruit')?.addEventListener"),'import binding cannot crash init if control is absent');
if(process.exitCode) process.exit(process.exitCode); else console.log('Runtime hardening verification complete.');
