#!/usr/bin/env python3
from pathlib import Path
import zipfile, xml.etree.ElementTree as ET, json, collections
ROOT=Path(__file__).resolve().parents[1]/'rosters'
rows=[]
for path in sorted(ROOT.rglob('*.rosz')):
    with zipfile.ZipFile(path) as z:
        data=z.read(z.namelist()[0])
    root=ET.fromstring(data)
    force=next((x for x in root.iter() if x.tag.endswith('force')),None)
    types=collections.Counter(); chars=collections.Counter()
    for el in root.iter():
        if el.tag.endswith('profile'): types[el.attrib.get('typeName','')]+=1
        elif el.tag.endswith('characteristic'): chars[el.attrib.get('name','')]+=1
    rows.append({
      'file':str(path.relative_to(ROOT)),
      'gameSystemName':root.attrib.get('gameSystemName',''),
      'gameSystemId':root.attrib.get('gameSystemId',''),
      'gameSystemRevision':root.attrib.get('gameSystemRevision',''),
      'generatedBy':root.attrib.get('generatedBy',''),
      'catalogueName':force.attrib.get('catalogueName','') if force is not None else '',
      'catalogueRevision':force.attrib.get('catalogueRevision','') if force is not None else '',
      'profileTypes':dict(types),'characteristics':dict(chars)
    })
out=Path(__file__).resolve().parents[1]/'audit'/'edition-corpus-audit.json'
out.write_text(json.dumps({'files':rows},indent=2),encoding='utf-8')
print(f'PASS: audited {len(rows)} ROSZ files -> {out}')
