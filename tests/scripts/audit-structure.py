#!/usr/bin/env python3
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import json, hashlib

ROOT=Path(__file__).resolve().parents[2]
ROSTERS=ROOT/'tests'/'rosters'

def local(tag): return tag.rsplit('}',1)[-1]
def load_xml(path):
    if path.suffix.lower()=='.rosz':
        with ZipFile(path) as z:
            names=[n for n in z.namelist() if n.lower().endswith(('.ros','.xml'))]
            if not names: raise RuntimeError('no roster XML')
            return z.read(names[0])
    return path.read_bytes()

def children(node, name): return [c for c in list(node) if local(c.tag)==name]

def audit(path):
    data=load_xml(path); root=ET.fromstring(data)
    sels=[x for x in root.iter() if local(x.tag)=='selection']
    profiles=[x for x in root.iter() if local(x.tag)=='profile']
    rules=[x for x in root.iter() if local(x.tag)=='rule']
    direct_profile_owners=0; direct_rule_owners=0; nested_links=0; weapon_profiles=0
    for sel in sels:
        for cont in children(sel,'profiles'):
            for p in children(cont,'profile'):
                direct_profile_owners+=1
                if 'weapon' in (p.attrib.get('typeName','').lower()): weapon_profiles+=1
        for cont in children(sel,'rules'):
            direct_rule_owners += len(children(cont,'rule'))
        for cont in children(sel,'selections'):
            nested_links += len(children(cont,'selection'))
    return {
        'file':str(path.relative_to(ROOT)), 'sha256':hashlib.sha256(data).hexdigest(),
        'selections':len(sels),'nestedSelectionLinks':nested_links,'profiles':len(profiles),
        'directProfileOwnerships':direct_profile_owners,'weaponProfiles':weapon_profiles,
        'rules':len(rules),'directRuleOwnerships':direct_rule_owners,
        'structureUseful': nested_links>0 and direct_profile_owners>0
    }

rows=[]
for path in sorted(ROSTERS.rglob('*')):
    if path.suffix.lower() not in {'.rosz','.ros','.xml'}: continue
    try: rows.append(audit(path))
    except Exception as e: rows.append({'file':str(path.relative_to(ROOT)),'error':str(e),'structureUseful':False})
unique={}
for r in rows:
    unique.setdefault(r.get('sha256',r['file']),r)
summary={
 'files':len(rows),'unique':len(unique),'structureUseful':sum(bool(r.get('structureUseful')) for r in rows),
 'nestedSelectionLinks':sum(r.get('nestedSelectionLinks',0) for r in rows),
 'directProfileOwnerships':sum(r.get('directProfileOwnerships',0) for r in rows),
 'directRuleOwnerships':sum(r.get('directRuleOwnerships',0) for r in rows),
 'weaponProfiles':sum(r.get('weaponProfiles',0) for r in rows)
}
out={'summary':summary,'files':rows}
output=ROOT/'tests'/'audit'/'structure-corpus-audit.json'; output.write_text(json.dumps(out,indent=2))
if summary['structureUseful'] != summary['files']:
    raise SystemExit(f"FAIL: structure useful in {summary['structureUseful']}/{summary['files']} files")
print(f"PASS: structure-aware ownership confirmed in {summary['files']} roster files; {summary['nestedSelectionLinks']} parent/child links, {summary['directProfileOwnerships']} direct profile ownerships, {summary['directRuleOwnerships']} direct rule ownerships.")
print('Output:',output.relative_to(ROOT))
