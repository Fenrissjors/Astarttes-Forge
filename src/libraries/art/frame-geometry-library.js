(function(){
  const CONTRACT='artwork-geometry-px-v1';
  const geometries=Object.freeze({
    'space-wolves': Object.freeze({"titleBoxPx":{"x":310,"y":286,"width":1864,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'ultramarines': Object.freeze({"titleBoxPx":{"x":422,"y":287,"width":1625,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'blood-angels': Object.freeze({"titleBoxPx":{"x":380,"y":259,"width":1714,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'dark-angels': Object.freeze({"titleBoxPx":{"x":310,"y":286,"width":1864,"height":224},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'black-templars': Object.freeze({"titleBoxPx":{"x":380,"y":285,"width":1720,"height":210},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'imperial-fists': Object.freeze({"titleBoxPx":{"x":360,"y":280,"width":1760,"height":205},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'white-scars': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'raven-guard': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'iron-hands': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'salamanders': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'deathwatch': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'generic-astartes': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490}}),
    'orks': Object.freeze({"titleBoxPx":{"x":380,"y":280,"width":1720,"height":180},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":21,"right":76,"bottom":21,"left":76},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490},"openingBoundingBoxPx":{"left":426,"top":572,"right":2054,"bottom":3291},"validationStatus":"PASS","alphaMaskMaster":"blood-angels"}),
    'tyranids': Object.freeze({"titleBoxPx":{"x":330,"y":220,"width":1820,"height":220},"canvasPx":{"width":2480,"height":3508},"titlePaddingPx":{"top":28,"right":90,"bottom":28,"left":90},"titleTypography":{"maxTitlePt":15.0,"minTitlePt":8.5,"kickerPt":6.5,"pointsPt":9.0,"singleLine":true},"panelBoxPx":{"x":292,"y":598,"width":1896,"bottom":3490},"openingBoundingBoxPx":{"left":418,"top":551,"right":2063,"bottom":3298},"openingAreaRatio":0.4632,"validationStatus":"PASS","alphaMaskMaster":"blood-angels"})
  });
  function pxToMmX(px,canvas=2480){ return Number(px||0)/canvas*210; }
  function pxToMmY(px,canvas=3508){ return Number(px||0)/canvas*297; }
  function boxToMm(box,canvas={width:2480,height:3508}){
    if(!box) return null;
    return {x:pxToMmX(box.x,canvas.width),y:pxToMmY(box.y,canvas.height),width:pxToMmX(box.width,canvas.width),height:pxToMmY(box.height,canvas.height)};
  }
  function resolve(chapter=''){
    const key=String(chapter||'').toLowerCase().trim().replace(/\s+/g,'-');
    return geometries[key]||null;
  }
  function manifestPath(chapter=''){
    const key=String(chapter||'').toLowerCase().trim().replace(/\s+/g,'-');
    return geometries[key]?`assets/art/${key}/frames/frame-manifest.json`:'';
  }
  window.ASTARTES_FRAME_GEOMETRY_LIBRARY={version:'4.0.2-tyranids-title-fit',contract:CONTRACT,geometries,resolve,manifestPath,boxToMm,pxToMmX,pxToMmY};
})();
