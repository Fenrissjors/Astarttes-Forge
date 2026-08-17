#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
import argparse, json, zlib, base64

ROOT=Path(__file__).resolve().parents[1]
CONTRACT=ROOT/"config"/"artwork-geometry-contract.json"

def packed_mask(encoded, shape, bitorder="big"):
    raw=zlib.decompress(base64.b64decode(encoded))
    bits=np.unpackbits(np.frombuffer(raw,dtype=np.uint8),bitorder=bitorder)
    return bits[:shape[0]*shape[1]].reshape(shape).astype(bool)

def erode(mask, radius):
    if radius <= 0: return mask.copy()
    size=radius*2+1
    return np.array(Image.fromarray(mask.astype(np.uint8)*255,"L").filter(ImageFilter.MinFilter(size)))==255

def edge_map(gray, threshold):
    g=gray.astype(np.int16)
    edge=np.zeros_like(gray,dtype=bool)
    edge[:,1:] |= np.abs(g[:,1:]-g[:,:-1]) >= threshold
    edge[1:,:] |= np.abs(g[1:,:]-g[:-1,:]) >= threshold
    return edge

def zone_edge_ratio(edge, zone): return float(edge[zone].mean()) if zone.any() else 1.0

def main():
    ap=argparse.ArgumentParser(description="Astartes Forge Artwork Geometry Validator v1.2")
    ap.add_argument("candidate")
    ap.add_argument("--production", action="store_true", help="Require exact 2480x3508 production resolution.")
    args=ap.parse_args()
    candidate=Path(args.candidate)
    if not candidate.exists():
        print(json.dumps({"status":"ERROR","error":f"file not found: {candidate}"},indent=2)); return 2

    with open(CONTRACT,encoding="utf-8") as f: contract=json.load(f)
    with open(ROOT/contract["master"]["geometryFile"],encoding="utf-8") as f: geo=json.load(f)
    prod_size=(contract["productionCanvas"]["width"],contract["productionCanvas"]["height"])
    native_size=(geo["authority"]["sourceSize"]["width"],geo["authority"]["sourceSize"]["height"])
    native_ref=(contract["nativeReferenceCanvas"]["width"],contract["nativeReferenceCanvas"]["height"])
    shape=tuple(geo["encoding"]["shape"]); lim=contract["validation"]["thresholds"]
    failures=[]; warnings=[]
    im=Image.open(candidate).convert("RGBA"); original_size=im.size

    if args.production:
        if original_size!=prod_size: failures.append(f"production canvas expected {prod_size[0]}x{prod_size[1]}, got {original_size[0]}x{original_size[1]}")
    else:
        if original_size==native_ref: warnings.append("validated as native SOURCE_ONLY reference; production asset must be 2480x3508")
        elif original_size!=prod_size: failures.append(f"canvas must be native reference {native_ref[0]}x{native_ref[1]} or production {prod_size[0]}x{prod_size[1]}, got {original_size[0]}x{original_size[1]}")

    arr=np.array(im); a=arr[:,:,3]
    edge_alpha=np.concatenate([a[0,:],a[-1,:],a[:,0],a[:,-1]])
    edge_nonopaque=float((edge_alpha<lim["outerEdgeMinAlpha"]).mean())
    if edge_nonopaque>lim["maxOuterEdgeNonOpaqueRatio"]: failures.append(f"outer edge non-opaque ratio {edge_nonopaque:.6%}")

    nat=np.array(im.resize(native_size,Image.Resampling.NEAREST)); na=nat[:,:,3]; nrgb=nat[:,:,:3]
    gray=(0.2126*nrgb[:,:,0]+0.7152*nrgb[:,:,1]+0.0722*nrgb[:,:,2]).astype(np.uint8)
    opening=packed_mask(geo["centralOpening"]["packedMask"],shape,geo["encoding"]["bitOrder"])
    title=packed_mask(geo["titleSafeZone"]["packedMask"],shape,geo["encoding"]["bitOrder"])
    points=packed_mask(geo["pointsSafeZone"]["packedMask"],shape,geo["encoding"]["bitOrder"])

    cand_trans=na<=geo["centralOpening"]["alphaThreshold"]
    ys,xs=np.where(opening); margin=15
    y0=max(0,int(ys.min())-margin); y1=min(shape[0],int(ys.max())+margin+1)
    x0=max(0,int(xs.min())-margin); x1=min(shape[1],int(xs.max())+margin+1)
    mismatch=float(np.logical_xor(cand_trans,opening)[y0:y1,x0:x1].mean())
    if mismatch>lim["maxCentralOpeningMismatchRatio"]: failures.append(f"central opening mismatch {mismatch:.6%} > {lim['maxCentralOpeningMismatchRatio']:.6%}")

    edge=edge_map(gray,lim["gradientThreshold"]); core_r=lim["titleCoreErosionPxNative"]; deep_r=lim["titleDeepCoreErosionPxNative"]
    title_core=erode(title,core_r); points_core=erode(points,core_r); title_deep=erode(title,deep_r); points_deep=erode(points,deep_r)
    metrics={"centralOpeningMismatchRatio":mismatch,"outerEdgeNonOpaqueRatio":edge_nonopaque}
    for name,zone,core,deep,max_core,max_deep in (("title",title,title_core,title_deep,lim["maxTitleCoreEdgeRatio"],lim["maxTitleDeepCoreEdgeRatio"]),("points",points,points_core,points_deep,lim["maxPointsCoreEdgeRatio"],lim["maxPointsDeepCoreEdgeRatio"])):
        opaque=float((na[zone]>=lim["safeZoneMinAlpha"]).mean()); core_ratio=zone_edge_ratio(edge,core); deep_ratio=zone_edge_ratio(edge,deep)
        metrics[name+"ZoneOpaqueRatio"]=opaque; metrics[name+"CoreEdgeRatio"]=core_ratio; metrics[name+"DeepCoreEdgeRatio"]=deep_ratio
        if opaque<lim["minSafeZoneOpaqueRatio"]: failures.append(f"{name} safe-zone opacity {opaque:.6%} < {lim['minSafeZoneOpaqueRatio']:.6%}")
        if core_ratio>max_core: failures.append(f"{name} core edge ratio {core_ratio:.6%} > {max_core:.6%}")
        if deep_ratio>max_deep: failures.append(f"{name} deep-core obstruction ratio {deep_ratio:.6%} > {max_deep:.6%}")

    if failures: status="FAIL"; exit_code=1
    elif warnings: status="PASS_SOURCE_ONLY"; exit_code=0
    else: status="PASS"; exit_code=0
    print(json.dumps({"validator":"Astartes Forge Artwork Geometry Validator","validatorVersion":"1.2.0","contractVersion":contract["contractVersion"],"mode":"production" if args.production else "auto","file":str(candidate),"inputSize":{"width":original_size[0],"height":original_size[1]},"status":status,"metrics":metrics,"warnings":warnings,"failures":failures},indent=2))
    return exit_code

if __name__=="__main__": raise SystemExit(main())
