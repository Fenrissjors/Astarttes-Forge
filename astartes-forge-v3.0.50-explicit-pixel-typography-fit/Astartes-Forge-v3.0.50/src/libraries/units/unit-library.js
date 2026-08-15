(function(global){
  const entries = {
    'wolf-scouts': {name:'Wolf Scouts', faction:'Space Wolves', parserNotes:['Keep weapon rules local to their exact weapon selection.'], knownWeapons:['Bolt pistol','Thunderclap','Runic stave']},
    'bjorn-the-fell-handed': {name:'Bjorn the Fell-Handed', faction:'Space Wolves', parserNotes:['Heavy flamer is a valid selected weapon profile.']},
    'arjac-rockfist': {name:'Arjac Rockfist', faction:'Space Wolves', parserNotes:['Foehammer legitimately has separate ranged and melee profiles.']}
  };
  const slug = value => String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  global.UNIT_LIBRARY = Object.freeze({
    version:'2.4.4-datasheet-structure',
    entries,
    lookup(name=''){ return entries[slug(name)] || null; },
    coverage(units=[]){
      const names=[...new Set((units||[]).map(u=>u?.name).filter(Boolean))];
      const known=names.filter(name=>Boolean(this.lookup(name)));
      return {total:names.length,known:known.length,unknown:names.filter(name=>!this.lookup(name))};
    }
  });
})(window);
