(function(global){
  const normalise = value => String(value || '')
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/[\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const weaponPatterns = [
    /^assault$/i,/^blast(?:\s+(?:d?\d+(?:\+\d+)?|x))?$/i,/^close[\s-]+quarters$/i,/^devastating wounds$/i,
    /^extra attacks$/i,/^hazardous$/i,/^heavy$/i,/^ignores cover$/i,
    /^indirect fire$/i,/^lance$/i,/^lethal hits$/i,/^one[\s-]+shot$/i,
    /^pistol$/i,/^precision$/i,/^psychic$/i,/^torrent$/i,/^twin-linked$/i,
    /^rapid fire(?:\s+(?:d?\d+(?:\+\d+)?|x))?$/i,/^melta(?:\s+(?:d?\d+(?:\+\d+)?|x))?$/i,/^sustained hits(?:\s+(?:d?\d+(?:\+\d+)?|x))?$/i,
    /^anti$/i,/^anti\s*-\s*.+?(?:\s+\d\+)?$/i,/^cleave(?:\s+(?:d?\d+(?:\+\d+)?|x))?$/i,/^conversion(?:\s+.+)?$/i,/^hunter(?:\s*[-:]?\s*.+)?$/i
  ];

  const unitPatterns = [
    /^deep strike$/i,/^leader$/i,/^support$/i,/^scouts?(?:\s+\d+")?$/i,/^stealth$/i,
    /^infiltrators?$/i,/^lone operative(?:\s+\d+")?$/i,/^feel no pain(?:\s+\d+\+)?$/i,
    /^deadly demise(?:\s+.+)?$/i,/^fights first$/i,/^fights on death(?:\s+\d+\+)?$/i,
    /^firing deck(?:\s+\d+)?$/i,/^heal(?:\s+(?:d?\d+(?:\+\d+)?|x))?$/i,/^hover$/i,/^plunging fire$/i,/^surge moves?$/i,/^invulnerable save(?:\s+\d+\+)?$/i,
    /^supreme commander$/i,/^battleline$/i,/^fly$/i,/^character$/i,/^epic hero$/i,
    /^infantry$/i,/^mounted$/i,/^vehicle$/i,/^monster$/i,/^beast$/i,/^swarm$/i,
    /^walker$/i,/^dreadnought$/i,/^psyker$/i,/^grenades$/i,/^smoke$/i,
    /^terminator$/i,/^jump pack$/i,/^cavalry$/i,/^dedicated transport$/i,
    /^titanic$/i,/^aircraft$/i,/^transport$/i
  ];

  const wrappers = /^(?:core|faction|keywords?|abilities?|weapon abilities?|wargear abilities?)$/i;

  function matches(patterns, value){
    const clean = normalise(value);
    return patterns.some(pattern => pattern.test(clean));
  }

  function classify(name='', text=''){
    const cleanName = normalise(name);
    const cleanText = normalise(text);
    if (!cleanName) return {type:'unknown', render:'description', canonical:''};
    if (matches(weaponPatterns, cleanName)) return {type:'weapon', render:'keyword', canonical:canonicalWeapon(cleanName)};
    if (matches(unitPatterns, cleanName)) return {type:'unit', render:'keyword', canonical:canonicalUnit(cleanName)};
    if (wrappers.test(cleanName)) {
      const nested = cleanText.split(':')[0].trim();
      if (matches(weaponPatterns, nested)) return {type:'weapon', render:'keyword', canonical:canonicalWeapon(nested)};
      if (matches(unitPatterns, nested)) return {type:'unit', render:'keyword', canonical:canonicalUnit(nested)};
    }
    return {type:'ability', render:'description', canonical:cleanName};
  }

  function canonicalWeapon(value=''){
    const raw = normalise(value);
    if (/^anti\s*-/i.test(raw)) return raw.replace(/^anti\s*-\s*/i,'Anti-').replace(/\b[a-z]/g,c=>c.toUpperCase());
    if (/^close[\s-]+quarters$/i.test(raw)) return 'Close Quarters';
    const map = {
      'twin-linked':'Twin-linked','ignores cover':'Ignores Cover','lethal hits':'Lethal Hits',
      'devastating wounds':'Devastating Wounds','indirect fire':'Indirect Fire','extra attacks':'Extra Attacks',
      'one shot':'One Shot','rapid fire':'Rapid Fire','sustained hits':'Sustained Hits','feel no pain':'Feel No Pain'
    };
    const lower=raw.toLowerCase();
    for(const [key,label] of Object.entries(map)) if(lower===key || lower.startsWith(key+' ')) return label+raw.slice(key.length);
    return raw.replace(/\b\w/g,c=>c.toUpperCase());
  }

  function canonicalUnit(value=''){
    const raw = normalise(value);
    const map = {'deep strike':'Deep Strike','support':'Support','lone operative':'Lone Operative','fights first':'Fights First','supreme commander':'Supreme Commander','deadly demise':'Deadly Demise','feel no pain':'Feel No Pain','firing deck':'Firing Deck','invulnerable save':'Invulnerable Save'};
    const lower=raw.toLowerCase();
    for(const [key,label] of Object.entries(map)) if(lower===key || lower.startsWith(key+' ')) return label+raw.slice(key.length);
    return raw.replace(/\b\w/g,c=>c.toUpperCase());
  }

  global.KEYWORD_LIBRARY = Object.freeze({
    version:'2.5.1-datasheet-cleanup',
    weaponPatterns,
    unitPatterns,
    classify,
    isWeapon:(value)=>matches(weaponPatterns,value),
    isUnit:(value)=>matches(unitPatterns,value),
    isKeyword:(value)=>matches(weaponPatterns,value)||matches(unitPatterns,value),
    canonicalWeapon,
    canonicalUnit,
    normalise
  });
})(window);
