(function(global){
  const aliases = Object.freeze({
    // Keep this table for spelling variants only. Eligibility itself comes from New Recruit.
    '1st company task force':'first company task force'
  });
  function normalize(value=''){
    return String(value||'')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/\u00a0/g,' ')
      .toLowerCase()
      .replace(/&/g,' and ')
      .replace(/\bthe\b/g,' ')
      .replace(/[^a-z0-9]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function canonical(value=''){
    const key=normalize(value);
    return aliases[key] || key;
  }
  function parseDescription(text=''){
    const source=String(text||'').replace(/\r/g,'').replace(/\u00a0/g,' ');
    const marker=/this model can be attached to the following units\s*:/i;
    const match=marker.exec(source);
    if(!match) return [];
    const tail=source.slice(match.index+match[0].length);
    const out=[];
    for(const raw of tail.split('\n')){
      const line=raw.replace(/^[\s■•▪◼◆●➤►*-]+/,'').trim();
      if(!line) {
        if(out.length) break;
        continue;
      }
      if(/^(you can attach|if you do|unless otherwise|before the battle)/i.test(line)) break;
      // Some catalogue records accidentally place two names on one bullet.
      const parts=line.split(/\s*,\s*(?=[A-Z][A-Z\s'-]+(?:SQUAD|TEAM|GUARD|HEROES|COMPANIONS|VETERANS)\b)/);
      parts.map(x=>x.trim()).filter(Boolean).forEach(x=>out.push(x));
    }
    return [...new Map(out.map(name=>[canonical(name),name])).values()];
  }
  function matches(eligibleName, unitName){
    return canonical(eligibleName)===canonical(unitName);
  }
  global.ATTACHMENT_LIBRARY=Object.freeze({version:'2.4.4-datasheet-structure',normalize,canonical,parseDescription,matches});
})(window);
