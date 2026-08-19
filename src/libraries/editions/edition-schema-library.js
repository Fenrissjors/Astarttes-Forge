(function(global){
  const VERSION='1.1.0-orks-dread-mob';
  const normalise=v=>String(v||'').replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ').trim();
  const uniq=items=>[...new Set((items||[]).filter(Boolean))];
  const schemas={
    '11th':{
      id:'11th',label:'Warhammer 40,000 11th Edition',
      gameSystemPatterns:[/Warhammer\s*40,?000\s*11th\s*Edition/i],
      unitCharacteristics:['M','T','Sv','W','Ld','OC','InSv'],
      weaponCharacteristics:['Range','A','BS','WS','S','AP','D','Keywords','Abilities','Special','Description','Capacity','Button Effect'],
      knownProfileTypes:['Unit','Model','Abilities','Ranged Weapons','Melee Weapons','Detachment Rule','Stratagem','Enhancement','Transport','Try Dat Button!'],
      notes:'Current Astartes Forge reference schema. Includes Orks Dread Mob Try Dat Button! table profiles.'
    }
  };
  function rosterMetadata(doc){
    const roster=doc?.querySelector?.('roster'); const force=doc?.querySelector?.('force');
    return {
      rosterName:roster?.getAttribute('name')||'',
      generatedBy:roster?.getAttribute('generatedBy')||'',
      battleScribeVersion:roster?.getAttribute('battleScribeVersion')||'',
      gameSystemId:roster?.getAttribute('gameSystemId')||'',
      gameSystemName:roster?.getAttribute('gameSystemName')||'',
      gameSystemRevision:roster?.getAttribute('gameSystemRevision')||'',
      catalogueId:force?.getAttribute('catalogueId')||'',
      catalogueName:force?.getAttribute('catalogueName')||'',
      catalogueRevision:force?.getAttribute('catalogueRevision')||''
    };
  }
  function detect(meta={},graph=null){
    const explicit=Object.values(schemas).find(schema=>schema.gameSystemPatterns.some(p=>p.test(meta.gameSystemName||'')));
    if(explicit) return {schemaId:explicit.id,label:explicit.label,confidence:1,method:'gameSystemName',compatible:true};
    const charNames=uniq((graph?.profiles||[]).flatMap(p=>(p.characteristics||[]).map(c=>normalise(c.name))));
    let best=null;
    Object.values(schemas).forEach(schema=>{
      const expected=uniq([...schema.unitCharacteristics,...schema.weaponCharacteristics]);
      const hits=expected.filter(x=>charNames.some(y=>y.toLowerCase()===x.toLowerCase())).length;
      const score=expected.length?hits/expected.length:0;
      if(!best||score>best.score) best={schemaId:schema.id,label:schema.label,score};
    });
    if(best&&best.score>=.45) return {schemaId:best.schemaId,label:best.label,confidence:Number(best.score.toFixed(2)),method:'structural fingerprint',compatible:true};
    return {schemaId:'unknown',label:meta.gameSystemName||'Unknown edition/schema',confidence:0,method:'unrecognised',compatible:false};
  }
  function analyse(meta={},graph=null,normalization=null){
    const edition=detect(meta,graph); const schema=schemas[edition.schemaId]||null;
    const countMap=values=>values.reduce((m,v)=>{v=normalise(v)||'(blank)';m[v]=(m[v]||0)+1;return m;},{});
    const profileTypes=countMap((graph?.profiles||[]).map(p=>p.type));
    const characteristicNames=countMap((graph?.profiles||[]).flatMap(p=>(p.characteristics||[]).map(c=>c.name)));
    const categories=uniq((graph?.categories||[]).map(c=>normalise(c.name))).sort();
    const costTypes=uniq((graph?.costs||[]).map(c=>normalise(c.name))).sort();
    const knownChars=schema?uniq([...schema.unitCharacteristics,...schema.weaponCharacteristics]).map(x=>x.toLowerCase()):[];
    const unknownCharacteristics=Object.keys(characteristicNames).filter(x=>x!=='(blank)'&&!knownChars.includes(x.toLowerCase())).sort();
    const knownTypes=schema?(schema.knownProfileTypes||[]).map(x=>x.toLowerCase()):[];
    const unknownProfileTypes=Object.keys(profileTypes).filter(x=>x!=='(blank)'&&!knownTypes.some(k=>x.toLowerCase()===k||x.toLowerCase().includes(k.toLowerCase()))).sort();
    const factionCategories=categories.filter(x=>/^Faction:/i.test(x)||/^(Imperium|Adeptus Astartes|Space Wolves|Blood Angels|Dark Angels|Deathwatch|Black Templars|Orks)$/i.test(x));
    const roles=categories.filter(x=>/^(Character|Leader|Support|Infantry|Vehicle|Monster|Mounted|Battleline|Epic Hero|Psyker|Fly|Walker|Aircraft|Transport|Dedicated Transport)$/i.test(x));
    const warnings=[];
    if(!edition.compatible) warnings.push('Edition/schema is not recognised by the installed Edition Schema Library.');
    if(unknownCharacteristics.length) warnings.push(`${unknownCharacteristics.length} characteristic name(s) are not mapped by the current edition schema.`);
    if(unknownProfileTypes.length) warnings.push(`${unknownProfileTypes.length} profile type(s) are not mapped by the current edition schema.`);
    return {
      libraryVersion:VERSION,meta,edition,
      sourceGraph:{version:graph?.version||null,selections:graph?.selections?.length||0,profiles:graph?.profiles?.length||0,rules:graph?.rules?.length||0,categories:graph?.categories?.length||0,costs:graph?.costs?.length||0},
      profileTypes,characteristicNames,unknownCharacteristics,unknownProfileTypes,categories,costTypes,factionCategories,roles,
      normalizedUnits:normalization?.units?.length||0,warnings
    };
  }
  global.ASTARTES_EDITION_SCHEMA_LIBRARY={version:VERSION,schemas,rosterMetadata,detect,analyse};
})(window);
