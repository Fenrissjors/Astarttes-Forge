#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import numpy as np
import json, sys, zlib, base64

ROOT=Path(__file__).resolve().parents[1]
CONTRACT=ROOT/"config"/"artwork-geometry-contract.json"

def packed_mask(encoded, shape, bitorder="big"):
    raw=zlib.decompress(base64.b64decode(encoded))
    bits=np.unpackbits(np.frombuffer(raw,dtype=np.uint8),bitorder=bitorder)
    return bits[:shape[0]*shape[1]].reshape(shape).astype(bool)

def edge_ratio(gray,zone,threshold):
    g=gray.astype(np.int16)
    edge=np.zeros_like(gray,dtype=bool)
    edge[:,1:] |= np.abs(g[:,1:]-g[:,:-1]) >= threshold
    edge[1:,:] |= np.abs(g[1:,:]-g[:-1,:]) >= threshold
    return float(edge[zone].mean()) if zone.any() else 1.0

def main():
    if len(sys.argv)!=2:
        print("Usage: python tools/validate_artwork_geometry.py <chapter-frame.png>")
        return 2
    candidate=Path(sys.argv[1])
    if not candidate.exists():
        print(f"ERROR: file not found: {candidate}")
        return 2

    with open(CONTRACT,encoding="utf-8") as f: contract=json.load(f)
    with open(ROOT/contract["master"]["geometryFile"],encoding="utf-8") as f: geo=json.load(f)

    target=(contract["productionCanvas"]["width"],contract["productionCanvas"]["height"])
    native=(geo["authority"]["sourceSize"]["width"],geo["authority"]["sourceSize"]["height"])
    shape=tuple(geo["encoding"]["shape"])
    lim=contract["validation"]["thresholds"]
    failures=[]

    im=Image.open(candidate).convert("RGBA")
    original_size=im.size
    if original_size!=target:
        failures.append(f"canvas expected {target[0]}x{target[1]}, got {original_size[0]}x{original_size[1]}")
        im=im.resize(target,Image.Resampling.LANCZOS)

    prod=np.array(im)
    a=prod[:,:,3]
    edge_alpha=np.concatenate([a[0,:],a[-1,:],a[:,0],a[:,-1]])
    edge_nonopaque=float((edge_alpha<lim["outerEdgeMinAlpha"]).mean())
    if edge_nonopaque>lim["maxOuterEdgeNonOpaqueRatio"]:
        failures.append(f"outer edge non-opaque ratio {edge_nonopaque:.6%}")

    nat=np.array(im.resize(native,Image.Resampling.NEAREST))
    na=nat[:,:,3]
    nrgb=nat[:,:,:3]
    gray=(0.2126*nrgb[:,:,0]+0.7152*nrgb[:,:,1]+0.0722*nrgb[:,:,2]).astype(np.uint8)

    opening=packed_mask(geo["centralOpening"]["packedMask"],shape,geo["encoding"]["bitOrder"])
    title=packed_mask(geo["titleSafeZone"]["packedMask"],shape,geo["encoding"]["bitOrder"])
    points=packed_mask(geo["pointsSafeZone"]["packedMask"],shape,geo["encoding"]["bitOrder"])

    cand_trans=na<=geo["centralOpening"]["alphaThreshold"]
    ys,xs=np.where(opening)
    margin=15
    y0=max(0,int(ys.min())-margin); y1=min(shape[0],int(ys.max())+margin+1)
    x0=max(0,int(xs.min())-margin); x1=min(shape[1],int(xs.max())+margin+1)
    mismatch=float(np.logical_xor(cand_trans,opening)[y0:y1,x0:x1].mean())
    if mismatch>lim["maxCentralOpeningMismatchRatio"]:
        failures.append(f"central opening mismatch {mismatch:.6%} > {lim['maxCentralOpeningMismatchRatio']:.6%}")

    metrics={"centralOpeningMismatchRatio":mismatch,"outerEdgeNonOpaqueRatio":edge_nonopaque}
    for name,zone,maxedge in (("title",title,lim["maxTitleZoneEdgeRatio"]),("points",points,lim["maxPointsZoneEdgeRatio"])):
        opaque=float((na[zone]>=lim["safeZoneMinAlpha"]).mean())
        er=edge_ratio(gray,zone,lim["gradientThreshold"])
        metrics[name+"ZoneOpaqueRatio"]=opaque
        metrics[name+"ZoneEdgeRatio"]=er
        if opaque<lim["minSafeZoneOpaqueRatio"]:
            failures.append(f"{name} safe-zone opacity {opaque:.6%} < {lim['minSafeZoneOpaqueRatio']:.6%}")
        if er>maxedge:
            failures.append(f"{name} safe-zone edge ratio {er:.6%} > {maxedge:.6%}")

    report={"validator":"Astartes Forge Artwork Geometry Validator","contractVersion":contract["contractVersion"],
            "file":str(candidate),"status":"PASS" if not failures else "FAIL","metrics":metrics,"failures":failures}
    print(json.dumps(report,indent=2))
    return 0 if not failures else 1

if __name__=="__main__":
    raise SystemExit(main())
