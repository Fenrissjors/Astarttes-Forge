#!/usr/bin/env python3
"""Validate v2.8.0 New Recruit detachment scope fixtures.

This deliberately treats the user's New Recruit catalogue availability as the
authoritative scope signal. It does not try to enforce army legality itself.
"""
from pathlib import Path
import zipfile, xml.etree.ElementTree as ET, json, re, sys

ROOT=Path(__file__).resolve().parents[2]
ROSTERS=ROOT/'tests'/'rosters'
EXPECTED={
 'Armoured Speartip':('generic-astartes','Take and Hold',3),
 'Bastion Task Force':('generic-astartes','Take and Hold',2),
 'Ceramite Sentinels':('generic-astartes','Take and Hold',3),
 'Headhunter Task Force':('generic-astartes','Priority Assets',2),
 'Orbital Assault Force':('generic-astartes','Take and Hold',2),
 'Blade of Ultramar':('ultramarines','Priority Assets',3),
 'Reclamation Force':('ultramarines','Take and Hold',2),
 "Emperor's Shield":('imperial-fists','Purge the Foe',2),
 "Forgefather's Seekers":('salamanders','Priority Assets',2),
 'Hammer of Avernii':('iron-hands','Purge the Foe',2),
 'Shadowmark Talon':('raven-guard','Disruption',2),
 'Spearpoint Task Force':('white-scars','Disruption',2),
}
EXPECTED_FOLDERS={
 'generic-astartes':'generic','ultramarines':'ultramarines','imperial-fists':'imperial-fists',
 'salamanders':'salamanders','iron-hands':'iron-hands','raven-guard':'raven-guard','white-scars':'white-scars'
}
def local(tag): return tag.rsplit('}',1)[-1]
def roster_root(path):
    with zipfile.ZipFile(path) as z:
        member=next(n for n in z.namelist() if n.endswith('.ros') or n.endswith('.xml'))
        return ET.fromstring(z.read(member))
def inspect(path):
    root=roster_root(path)
    for sel in (x for x in root.iter() if local(x.tag)=='selection'):
        name=sel.attrib.get('name','')
        if name not in EXPECTED: continue
        dp=None; disposition=''
        for x in sel.iter():
            if local(x.tag)=='cost' and x.attrib.get('name')=='Detachment Points':
                try: dp=int(float(x.attrib.get('value','0')))
                except: pass
            if local(x.tag)=='category':
                n=x.attrib.get('name','')
                if n in {'Take and Hold','Priority Assets','Purge the Foe','Disruption','Reconnaissance'}:
                    disposition=n
        return name,disposition,dp
    return None
results=[]; errors=[]
for det,(scope,disp,dp) in EXPECTED.items():
    folder=ROSTERS/EXPECTED_FOLDERS[scope]
    candidates=list(folder.glob('*.rosz'))
    match=None
    for p in candidates:
        data=inspect(p)
        if data and data[0]==det:
            match=(p,data); break
    if not match:
        errors.append(f'Missing fixture: {det} in {folder.name}')
        continue
    p,(name,actual_disp,actual_dp)=match
    ok=(actual_disp==disp and actual_dp==dp)
    results.append({'detachment':det,'scope':scope,'file':str(p.relative_to(ROOT)),'disposition':actual_disp,'dp':actual_dp,'ok':ok})
    if not ok: errors.append(f'{det}: expected {disp} {dp}DP, got {actual_disp} {actual_dp}DP')
out={'version':'2.8.0','authority':'New Recruit catalogue availability','results':results,'errors':errors}
(ROOT/'tests/audit/chapter-scope-audit.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
if errors:
    print('FAIL:'); [print(' -',e) for e in errors]; sys.exit(1)
print(f"PASS: {len(results)}/{len(EXPECTED)} chapter-scope fixtures match New Recruit metadata.")
print('Output: tests/audit/chapter-scope-audit.json')
