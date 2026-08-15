#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
from collections import deque
import json, sys, numpy as np

ROOT=Path(__file__).resolve().parents[2]
SPEC_PATH=ROOT/'docs/design/A4-CHAPTER-FRAME-GOLD-STANDARD.json'
MASTER_PATH=ROOT/'docs/design/A4-FRAME-MASTER-SKELETON.json'
spec=json.loads(SPEC_PATH.read_text())
master=json.loads(MASTER_PATH.read_text())
STANDARD_ID=spec['id']
LANDMARKS=master['landmarksPx']
failed=False

def fail(msg):
    global failed
    print('FAIL '+msg)
    failed=True

def central_component(alpha, threshold):
    mask=alpha<=threshold
    h,w=mask.shape
    cx,cy=w//2,h//2
    if not mask[cy,cx]:
        return np.zeros_like(mask), False
    vis=np.zeros_like(mask,dtype=bool)
    q=deque([(cx,cy)]); vis[cy,cx]=True
    while q:
        x,y=q.popleft()
        for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0<=nx<w and 0<=ny<h and mask[ny,nx] and not vis[ny,nx]:
                vis[ny,nx]=True; q.append((nx,ny))
    return vis, True

def neutral_fraction(rgb, rect, luminance_min, saturation_max):
    x0,y0,x1,y1=rect
    crop=rgb[y0:y1,x0:x1].astype(float)
    mx=crop.max(axis=2); mn=crop.min(axis=2)
    lum=.2126*crop[:,:,0]+.7152*crop[:,:,1]+.0722*crop[:,:,2]
    sat=np.divide(mx-mn,mx,out=np.zeros_like(mx),where=mx!=0)
    return float(((lum>=luminance_min)&(sat<=saturation_max)).mean())

canvas=tuple(spec['canvas']['pixelSize'])
edge=spec['outerEdgeContract']
open_spec=spec['contentOpeningContract']
title=spec['titlePlaqueContract']
alpha_threshold=int(open_spec['alphaThreshold'])

manifests=sorted((ROOT/'assets/art').glob('*/frames/frame-manifest.json'))
for mf in manifests:
    data=json.loads(mf.read_text())
    chapter=data.get('chapter','unknown')
    if data.get('frameStandard')!=STANDARD_ID:
        fail(f'{chapter}: manifest frameStandard must be {STANDARD_ID}')
        continue
    if data.get('geometryMaster')!=STANDARD_ID or data.get('openingMode')!='chapter-native':
        fail(f'{chapter}: geometry/opening contract mismatch')
        continue
    if data.get('layoutLandmarksPx')!=LANDMARKS:
        fail(f'{chapter}: shared layout landmarks changed')
        continue
    for key,fspec in data.get('frames',{}).items():
        path=ROOT/fspec['asset']
        if not path.exists():
            fail(f'{chapter}/{key}: missing asset {fspec["asset"]}')
            continue
        im=Image.open(path).convert('RGBA')
        w,h=im.size
        rgba=np.asarray(im)
        alpha=rgba[:,:,3]
        rgb=rgba[:,:,:3]
        errors=[]
        if (w,h)!=canvas or (w,h)!=tuple(fspec['pixelSize']):
            errors.append(f'size={w}x{h}, expected={canvas[0]}x{canvas[1]}')

        band=int(edge['opaqueBandPx'])
        threshold=int(edge['alphaThreshold'])
        edge_fracs={
          'top':float((alpha[:band,:]>threshold).mean()),
          'bottom':float((alpha[-band:,:]>threshold).mean()),
          'left':float((alpha[:,:band]>threshold).mean()),
          'right':float((alpha[:,-band:]>threshold).mean())
        }
        edge_min=float(edge['minimumOpaqueFractionEachEdge'])
        if any(v+1e-12<edge_min for v in edge_fracs.values()):
            errors.append(f'outerEdge={edge_fracs}')

        z=fspec['safeZone']
        x0=int(w*z['x']); y0=int(h*z['y'])
        x1=int(w*(z['x']+z['width'])); y1=int(h*(z['y']+z['height']))
        safe=float((alpha[y0:y1,x0:x1]<=alpha_threshold).mean())
        if safe<float(z['minimumTransparency']):
            errors.append(f'safeTransparency={safe:.3%}')

        center,center_ok=central_component(alpha,alpha_threshold)
        if not center_ok:
            errors.append('page centre is not transparent')
            bbox=None; area=0.0; center_share=0.0
        else:
            ys,xs=np.where(center)
            bbox=(int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max()))
            area=float(center.mean())
            total_trans=int((alpha<=alpha_threshold).sum())
            center_share=float(center.sum()/total_trans) if total_trans else 0.0
            if center_share<float(open_spec['centralConnectedTransparencyMinimumShare']):
                errors.append(f'centralTransparencyShare={center_share:.5f}')
            amin,amax=open_spec['centralOpeningAreaFraction']
            if not (amin<=area<=amax):
                errors.append(f'openingArea={area:.3%}')
            bb=open_spec['openingBoundingBoxPx']
            if not (bb['minX'][0]<=bbox[0]<=bb['minX'][1]): errors.append(f'openingMinX={bbox[0]}')
            if not (bb['maxX'][0]<=bbox[2]<=bb['maxX'][1]): errors.append(f'openingMaxX={bbox[2]}')
            if not (bb['minY'][0]<=bbox[1]<=bb['minY'][1]): errors.append(f'openingMinY={bbox[1]}')
            if not (bb['maxY'][0]<=bbox[3]<=bb['maxY'][1]): errors.append(f'openingMaxY={bbox[3]}')
            max_asym=int(open_spec['maximumLeftRightMarginDifferencePxAtScanlines'])
            for scan in open_spec['scanlineWidthPx']:
                y=int(scan['y']); xs=np.where(center[y])[0]
                if not len(xs):
                    errors.append(f'opening missing at y={y}')
                    continue
                span=int(xs.max()-xs.min()+1)
                lo,hi=scan['range']
                if not (lo<=span<=hi): errors.append(f'openingWidth@y{y}={span}')
                asym=abs(int(xs.min())-int((w-1)-xs.max()))
                if asym>max_asym: errors.append(f'openingAsymmetry@y{y}={asym}')

        lum_min=float(title['lightNeutralTest']['minimumLuminance'])
        sat_max=float(title['lightNeutralTest']['maximumSaturation'])
        title_results={}
        for zone in title['liveTextSafeZones']:
            val=neutral_fraction(rgb,zone['rectPx'],lum_min,sat_max)
            title_results[zone['name']]=val
            if val<float(zone['minimumLightNeutralFraction']):
                errors.append(f'titleSafe[{zone["name"]}]={val:.3%}')

        ok=not errors
        status='PASS' if ok else 'FAIL'
        print(f"{status} {chapter}/{key}: {w}x{h}, safe={safe:.3%}, edges={{{', '.join(f'{k}:{v:.3f}' for k,v in edge_fracs.items())}}}, opening={bbox}, area={area:.3%}, centreShare={center_share:.3%}, title={{{', '.join(f'{k}:{v:.3f}' for k,v in title_results.items())}}}")
        if errors:
            for e in errors: print('  - '+e)
            failed=True

sys.exit(1 if failed else 0)
