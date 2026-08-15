#!/usr/bin/env python3
from pathlib import Path
import json, sys
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[2]
CHAPTERS=['space-wolves','ultramarines','blood-angels','dark-angels','black-templars','imperial-fists']
CONTRACT='artwork-geometry-px-v1'
fail=[]
for ch in CHAPTERS:
    mf=ROOT/f'assets/art/{ch}/frames/frame-manifest.json'; png=ROOT/f'assets/art/{ch}/frames/{ch}-a4-portrait.png'
    d=json.loads(mf.read_text()); g=d.get('artworkGeometry',{})
    if d.get('geometryContract')!=CONTRACT: fail.append(f'{ch}: missing geometry contract')
    canvas=g.get('canvasPx',{})
    if [canvas.get('width'),canvas.get('height')]!=[2480,3508]: fail.append(f'{ch}: canvas mismatch')
    b=g.get('titleBoxPx',{}); vals=[b.get(k) for k in ('x','y','width','height')]
    if not all(isinstance(v,(int,float)) for v in vals): fail.append(f'{ch}: titleBoxPx incomplete'); continue
    x,y,w,h=map(int,vals)
    if x<0 or y<0 or w<=0 or h<=0 or x+w>2480 or y+h>3508: fail.append(f'{ch}: titleBoxPx outside canvas')
    pad=g.get('titlePaddingPx',{}); l,r,t,bt=[int(pad.get(k,0)) for k in ('left','right','top','bottom')]
    if l+r>=w or t+bt>=h: fail.append(f'{ch}: title padding consumes title box')
    arr=np.array(Image.open(png).convert('RGBA')); crop=arr[y+t:y+h-bt,x+l:x+w-r]
    rgb=crop[:,:,:3].astype(float); a=crop[:,:,3]; mx=rgb.max(2); mn=rgb.min(2); lum=.2126*rgb[:,:,0]+.7152*rgb[:,:,1]+.0722*rgb[:,:,2]; sat=(mx-mn)/np.maximum(mx,1)
    calm=((a>240)&(lum>145)&(sat<.28)).mean()
    if calm<.97: fail.append(f'{ch}: title text-safe pixels only {calm:.3%} calm/light')
    panel=g.get('panelBoxPx',{})
    if int(panel.get('width',0))!=1896: fail.append(f'{ch}: panel width contract changed')
    print(f'PASS: {ch} titleBoxPx={x},{y},{w},{h}; calm/light={calm:.3%}')
js=(ROOT/'src/libraries/art/frame-geometry-library.js').read_text()
for ch in CHAPTERS:
    g=json.loads((ROOT/f'assets/art/{ch}/frames/frame-manifest.json').read_text())['artworkGeometry']; compact=json.dumps(g,separators=(',',':'))
    if f"'{ch}': Object.freeze({compact})" not in js: fail.append(f'{ch}: runtime geometry library drifted from manifest')
if fail:
    [print('FAIL:',x) for x in fail]; sys.exit(1)
print('Frame geometry contract verification complete.')
