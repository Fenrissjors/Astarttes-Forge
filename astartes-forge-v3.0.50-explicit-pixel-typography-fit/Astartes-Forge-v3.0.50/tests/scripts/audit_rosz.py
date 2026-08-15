#!/usr/bin/env python3
"""Inventory the regression ROSZ corpus without guessing game data.
New Recruit remains the source of roster composition; this script records what
is actually present in each export so importer changes can be regression-tested.
"""
from __future__ import annotations
import hashlib, json, re, zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[2]
ROSTERS=ROOT/'tests'/'rosters'
OUT=ROOT/'tests'/'audit'/'rosz-corpus-audit.json'

def local(tag): return tag.rsplit('}',1)[-1]
def attr(el,key,default=''): return el.attrib.get(key,default)

def read_xml(path:Path):
    raw=path.read_bytes()
    with zipfile.ZipFile(path) as z:
        xml_names=[n for n in z.namelist() if n.lower().endswith('.ros') or n.lower().endswith('.xml')]
        if not xml_names: raise ValueError('no roster XML')
        data=z.read(xml_names[0])
    return raw, ET.fromstring(data)

def text_of_rule(rule):
    parts=[]
    for el in rule.iter():
        if local(el.tag) in {'description','text'} and el.text: parts.append(el.text.strip())
    return '\n'.join(parts)

records=[]; seen={}; all_rule_names=set(); all_profiles=set(); all_categories=set(); deadly=set(); role_rules=set(); detachment_hits=set()
for path in sorted(ROSTERS.rglob('*.rosz')):
    raw,root=read_xml(path)
    sha=hashlib.sha256(raw).hexdigest()
    duplicate_of=seen.get(sha)
    if not duplicate_of: seen[sha]=str(path.relative_to(ROOT))
    rules=[]; profiles=[]; categories=[]; selections=[]; costs=[]
    for el in root.iter():
        t=local(el.tag)
        if t=='selection': selections.append({'name':attr(el,'name'),'id':attr(el,'id'),'entryId':attr(el,'entryId'),'type':attr(el,'type'),'number':attr(el,'number')})
        elif t=='rule':
            name=attr(el,'name').strip();
            if name: rules.append(name); all_rule_names.add(name)
            if re.match(r'^deadly demise\b',name,re.I): deadly.add(name)
            if re.match(r'^(leader|support)\b',name,re.I): role_rules.add(name)
        elif t=='profile':
            name=attr(el,'name').strip(); typ=attr(el,'typeName').strip()
            if name: profiles.append({'name':name,'type':typ,'id':attr(el,'id')}); all_profiles.add(typ)
            if 'detachment' in typ.lower(): detachment_hits.add(name)
        elif t=='category':
            name=attr(el,'name').strip()
            if name: categories.append(name); all_categories.add(name)
        elif t=='cost': costs.append({'name':attr(el,'name'),'value':attr(el,'value')})
    records.append({
        'file':str(path.relative_to(ROOT)), 'sha256':sha, 'duplicateOf':duplicate_of,
        'counts':{'selections':len(selections),'profiles':len(profiles),'rules':len(rules),'categories':len(categories),'costs':len(costs)},
        'ruleNames':sorted(set(rules)), 'profileTypes':sorted(set(x['type'] for x in profiles if x['type'])),
        'factionCategories':sorted(set(c.replace('Faction: ','') for c in categories if c.startswith('Faction: '))),
        'deadlyDemiseVariants':sorted(set(x for x in rules if re.match(r'^deadly demise\b',x,re.I))),
        'roleRules':sorted(set(x for x in rules if re.match(r'^(leader|support)\b',x,re.I)))
    })

result={
    'schema':'astartes-forge-rosz-corpus-audit-v1',
    'rosterFiles':len(records), 'uniqueRosterFiles':len(seen),
    'records':records,
    'observed':{
        'ruleNames':sorted(all_rule_names), 'profileTypes':sorted(x for x in all_profiles if x),
        'factionCategories':sorted(x for x in all_categories if x.startswith('Faction: ')),
        'deadlyDemiseVariants':sorted(deadly), 'leaderSupportRules':sorted(role_rules),
        'detachmentProfileNames':sorted(detachment_hits)
    },
    'principles':[
        'Do not infer roster facts when the exact selection/profile/rule/category/cost exists in ROSZ.',
        'Keep source IDs through normalization so model/weapon ownership can be traced.',
        'Use the Rules Library only for content that the selected roster export does not contain.'
    ]
}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(f"PASS: audited {len(records)} roster files ({len(seen)} unique by SHA-256).")
print('Observed Deadly Demise variants:', ', '.join(sorted(deadly)) or 'none')
print('Output:',OUT.relative_to(ROOT))
