/*
 * Explanatory, source-guided choreography; not an engineering drawing or a plant schedule.
 * Recognizable equipment comes from clipped layers of the existing generated raster artwork.
 * Geometric overlays depict material, fields and functional cutaways, not replacement equipment.
 * ProcessMotion.update is the ONLY clock: pause and scrubbing freeze every movable part.
 */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const XLINK = 'http://www.w3.org/1999/xlink';
  const clamp = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
  const lerp = (a,b,t) => a+(b-a)*clamp(t);
  const range = (t,a,b) => clamp((t-a)/(b-a));
  const smooth = t => {t=clamp(t);return t*t*(3-2*t);};
  const windowOn = (t,a,b) => t>=a&&t<b;
  const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let active = null;
  const plateCache = new Map();
  const stageCells = [0,1,2,3,4,5,0,1,2,3,2,4,5,null,null];
  const titles = ['Excavate and load ore','Crush and concentrate','Mix, separate and settle','Convert a chemical feed to metal','Melt, cool and flake','Load, seal and fracture','Collide and classify powder','Orient and compact grains','Load, seal and densify','Feed, grind and remove material','Apply a source and diffuse','Immerse and protect the surface','Pulse once; retain magnetization','Measure against a specification','A qualified magnet produces motion'];
  const shape = {
    armBoom:'<path d="M191 236L211 244L294 171L290 154L276 158L194 224Z"/>',
    armDipper:'<path d="M280 154L296 160L324 216L326 236L310 243L304 221L279 176Z"/>',
    bucket:'<path d="M298 214L328 216L345 231L341 251L316 259L298 248Z"/>',
    crusherWheel:'<ellipse cx="148" cy="241" rx="44" ry="55"/>',
    electrode:'<path d="M224 97H247V231L242 240H229L224 231Z"/>',
    castingWheel:'<ellipse cx="242" cy="264" rx="78" ry="90"/>',
    castingCrucible:'<path d="M306 75Q321 66 350 82L377 101Q393 109 389 124L363 174Q352 184 330 176L281 150Z"/>',
    hdDoor:'<path clip-rule="evenodd" d="M373 220a61 111 0 1 0 122 0a61 111 0 1 0 -122 0Z M264 243L365 239L428 263L426 297L300 310L263 288Z"/>',
    hdTray:'<path d="M264 243L365 239L428 263L426 297L300 310L263 288Z"/>',
    ram:'<path d="M238 158H279V224H309V269H205V224H238Z"/>',
    furnaceDoor:'<path d="M21 127L53 118L96 142L133 194L139 284L120 333L80 354L41 337L18 294Z"/>',
    furnaceTray:'<path d="M146 246L248 242L275 265L272 289L144 292Z"/>',
    grindWheel:'<ellipse cx="320" cy="192" rx="40" ry="59"/>',
    workTable:'<path d="M142 214L220 212L268 229L268 279L159 287L140 266Z"/>',
    coatingPieces:'<path d="M101 137L141 137L141 190L101 185Z M244 138L282 138L282 191L244 188Z M365 151L407 151L407 208L365 207Z"/>',
    magnetPart:'<path d="M103 203L160 201L177 214L176 262L123 261L104 245Z"/>'
  };
  function part(name, clipShape, body='', extra='') {
    const id=`pm-${name}`;
    active.clips += `<clipPath id="${id}">${clipShape}</clipPath>`;
    return `<g data-motion-part="${name}" ${extra}><g clip-path="url(#${id})">${sprite(active.original)}</g>${body}</g>`;
  }
  function sprite(src, attrs='') {
    const cell=active.cell??4, x=(cell%3)*512, y=Math.floor(cell/3)*512;
    return `<image href="${src}" x="${-x}" y="${-y}" width="1536" height="1024" ${attrs}/>`;
  }
  function ore(x,y,size=16) {return `<path class="motion-ore" d="M${x-size*.6} ${y-size*.25}l${size*.35} ${-size*.55} ${size*.8} ${size*.2} ${size*.3} ${size*.6}-${size*.4} ${size*.65}-${size*.85} ${-size*.05}Z"/>`;}
  function block(x,y,w=35,h=21,attrs='') {return `<g ${attrs}><rect class="motion-metal" x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5"/><path fill="#d4ddd8" opacity=".7" d="M${x} ${y}l7 -5h${w}l-7 5Z"/><path fill="#59675e" d="M${x+w} ${y}l7 -5v${h}l-7 5Z"/></g>`;}
  function grain(x,y,r=5) {return `<path class="motion-powder" d="M${x-r} ${y}l${r*.7} ${-r*.85} ${r*1.2} ${r*.3} ${r*.35} ${r} ${-r} ${r*.4}Z"/>`;}
  function caption(text,x=256,y=474,cls='motion-caption') {
    const limit=x<125||x>375?19:43;
    const words=String(text).split(' '),lines=[''];
    words.forEach(word=>{if((lines[lines.length-1]+' '+word).trim().length>limit)lines.push(word);else lines[lines.length-1]=(lines[lines.length-1]+' '+word).trim();});
    return `<text class="${cls}" text-anchor="middle" x="${x}" y="${y}">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?22:0}">${escape(line)}</tspan>`).join('')}</text>`;
  }
  function overlayPanel(title,body,x=30,y=355,w=452,h=100) {return `<g data-functional-cutaway="true"><rect class="motion-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>${caption(title,x+w/2,y+23,'motion-note')}${body}</g>`;}
  function inOut(input, output) {return `<g data-material-state="input" data-state-shape="${escape(input)}" data-token="input"><rect class="motion-panel" x="8" y="10" width="205" height="60" rx="5"/>${caption(input,110,34,'motion-note')}</g><g data-material-state="output" data-state-shape="${escape(output)}" data-token="output"><rect class="motion-panel" x="299" y="10" width="205" height="60" rx="5"/>${caption(output,401,34,'motion-output-label')}</g>`;}
  function el(name){return active.svg.querySelector(`[data-motion-part="${name}"]`);}
  function set(name, attrs){const n=el(name);if(n)Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));}
  function visible(name,on){set(name,{opacity:on?1:0});}
  function transform(name,s){set(name,{transform:s});}
  function queryAttr(selector, attrs){active.svg.querySelectorAll(selector).forEach(n=>Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v))));}
  function loading(t){return smooth(range(t,.04,.22));}
  function operation(t){return range(t,.26,.74);}
  function unloading(t){return smooth(range(t,.79,.96));}
  function localTransform(x,y,a=0,dx=0,dy=0){return `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${a.toFixed(2)} ${x} ${y})`;}
  // Rotation in the wheel's own plane, projected back to the original fixed ellipse.
  // An ordinary SVG rotation would incorrectly rotate the projected silhouette itself.
  function projectedRotation(x,y,rx,ry,a){return `translate(${x} ${y}) scale(1 ${(ry/rx).toFixed(6)}) rotate(${a.toFixed(3)}) scale(1 ${(rx/ry).toFixed(6)}) translate(${-x} ${-y})`;}
  function rotatedPoint(x,y,cx,cy,angle){const a=angle*Math.PI/180,dx=x-cx,dy=y-cy;return {x:cx+dx*Math.cos(a)-dy*Math.sin(a),y:cy+dx*Math.sin(a)+dy*Math.cos(a)};}
  const builders = [
    function mine(){
      const carried=`<g data-motion-part="bucket-load" data-material-state="ore-in-bucket">${[0,1,2,3].map(i=>ore(312+i%2*10,237+Math.floor(i/2)*7,8)).join('')}</g>`;
      const arm=part('excavator-boom',shape.armBoom,part('excavator-dipper',shape.armDipper,part('excavator-bucket',shape.bucket,carried)));
      let rocks='';for(let i=0;i<7;i++)rocks+=`<g data-motion-part="ore-${i}" data-material-state="ore-falling-into-truck">${ore(0,0,9)}</g>`;
      return {html:arm+rocks+`<g data-motion-part="truck-ore" data-material-state="mined-ore">${[0,1,2,3,4,5].map(i=>ore(330+i%3*19,303-Math.floor(i/3)*10,16)).join('')}</g>`+inOut('Deposit / ore','Loaded mined ore')+caption('Dig → lift the loaded bucket → load the truck',256,455,'motion-note'),frame(t){
        const dig=range(t,.06,.34), lift=range(t,.34,.60), tip=range(t,.61,.79),returning=range(t,.85,1);
        const boom= t<.34?lerp(-14,13,smooth(dig)):t<.60?lerp(13,-19,smooth(lift)):t<.85?-19:lerp(-19,-14,smooth(returning));
        const dipper=t<.34?lerp(-15,15,dig):lerp(15,-20,lift),bucket=lerp(0,63,tip);
        transform('excavator-boom',localTransform(200,242,boom));
        transform('excavator-dipper',localTransform(285,167,dipper));transform('excavator-bucket',localTransform(318,238,bucket));
        set('bucket-load',{opacity:range(t,.24,.34)*(1-range(t,.62,.76))});
        let lip=rotatedPoint(325,245,318,238,bucket);lip=rotatedPoint(lip.x,lip.y,285,167,dipper);lip=rotatedPoint(lip.x,lip.y,200,242,boom);
        for(let i=0;i<7;i++){const start=.64+i*.014,fall=range(t,start,start+.15),x=lerp(lip.x,337+i%3*15,fall),y=lerp(lip.y,300-Math.floor(i/3)*7,fall);transform(`ore-${i}`,`translate(${x.toFixed(2)} ${y.toFixed(2)})`);visible(`ore-${i}`,t>=start&&fall<1);}
        set('truck-ore',{opacity:range(t,.70,.84),'data-progress':tip.toFixed(3)});
      }};
    },
    function upgrade(){
      let feed='';for(let i=0;i<5;i++)feed+=`<g data-motion-part="crusher-feed-${i}">${ore(151+i*17,99-(i%2)*20,21)}</g>`;
      let output='';for(let i=0;i<13;i++)output+=`<g data-motion-part="crushed-${i}">${ore(117+(i%5)*12,302+Math.floor(i/5)*9,7)}</g>`;
      const wheel=part('crusher-wheel',shape.crusherWheel,`<path stroke="#cdb581" stroke-width="4" d="M148 194V241L179 270"/>`);
      const functional=overlayPanel('Concentrate minerals; reject tailings',`<g data-motion-part="separator-agitator" transform="translate(370 243)"><path stroke="#c6d1c8" stroke-width="6" d="M-35 0H35"/></g><g data-motion-part="concentrate" data-material-state="concentrate">${[0,1,2,3].map(i=>grain(345+i*15,413,7)).join('')}</g><g data-motion-part="tailings" data-material-state="tailings">${[0,1,2,3].map(i=>ore(180+i*18,435,7)).join('')}</g><g data-motion-part="separation-streams"><path class="motion-gas-flow" d="M82 405H276L329 414M276 405V437H247"/></g>`,30,365,452,94);
      return{html:wheel+feed+output+functional+inOut('Ore + water','Concentrate + tailings'),frame(t){
        const p=operation(t);transform('crusher-wheel',projectedRotation(148,241,44,55,p*650));
        for(let i=0;i<5;i++){const f=range(t,.02+i*.025,.38+i*.02);transform(`crusher-feed-${i}`,`translate(0 ${f*90})`);visible(`crusher-feed-${i}`,f<1);}
        for(let i=0;i<13;i++){const f=range(t,.31+i*.009,.73+i*.006);set(`crushed-${i}`,{opacity:t>.28?1:0,transform:`translate(${f*110} ${f*30})`});}
        transform('separator-agitator',`translate(370 243) scale(${Math.cos(p*Math.PI*10).toFixed(3)} 1)`);
        set('separation-streams',{opacity:windowOn(t,.32,.78)?.8:0});queryAttr('[data-motion-part="separation-streams"] path',{'stroke-dashoffset':-p*90});
        set('concentrate',{opacity:range(t,.55,.82),transform:`translate(${unloading(t)*62} 0)`});set('tailings',{opacity:range(t,.45,.75)});
      }};
    },
    function separate(){
      let liquids='';for(let i=0;i<4;i++)liquids+=`<g data-motion-part="settler-${i}" data-material-state="two-liquid-phases"><path fill="#b8985c" opacity=".88" d="M${176+i*57} ${283-i*17}l38 -12 15 10-38 12Z"/><path fill="#6d9574" opacity=".95" d="M${176+i*57} ${291-i*17}l38 -12 15 6-38 12Z"/></g>`;
      let streams='';for(let i=0;i<6;i++)streams+=`<g data-motion-part="phase-ribbon-${i}"><path fill="${i%2?'#c5ab73':'#88b99a'}" d="M151 ${329-i*18}h23v7h-23Z"/></g>`;
      let droplets='';for(let i=0;i<12;i++)droplets+=`<g data-motion-part="extraction-drop-${i}"><circle cx="${271+i%6*18}" cy="${411+Math.floor(i/6)*17}" r="4" fill="${i%2?'#b99860':'#729b7d'}"/></g>`;
      const panel=overlayPanel('Mix → settle into two liquid phases',`<g data-motion-part="mixer-cross-section"><path stroke="#bbc9bd" stroke-width="4" d="M140 411H203M172 400V441"/></g><rect fill="#49624e" x="258" y="400" width="120" height="45"/>${droplets}<g data-motion-part="settled-phases"><rect fill="#b99860" x="258" y="400" width="120" height="16"/><rect fill="#729b7d" x="258" y="416" width="120" height="29"/></g><path class="motion-arrow" d="M213 423H248"/><g data-motion-part="separated-product" data-material-state="separated-NdPr-chemical-stream"><path fill="#9e8050" stroke="#d6c191" d="M399 409h31v26h-31Z"/>${caption('NdPr',414,452,'motion-note')}</g>`,30,365,452,94);
      return{html:liquids+streams+panel+inOut('Mixed chemical stream','Separated chemical stream'),frame(t){
        const p=operation(t);transform('mixer-cross-section',localTransform(172,411,Math.sin(p*30)*45));
        const settle=range(t,.37,.67);set('settled-phases',{opacity:settle});for(let i=0;i<12;i++)set(`extraction-drop-${i}`,{opacity:1-settle,transform:`translate(${Math.sin(p*17+i)*4} ${Math.cos(p*19+i)*4})`});
        for(let i=0;i<4;i++)set(`settler-${i}`,{opacity:range(t,.12+i*.07,.35+i*.07),'data-progress':p.toFixed(3)});
        for(let i=0;i<6;i++){const f=clamp((p+i/6)%1);set(`phase-ribbon-${i}`,{opacity:windowOn(t,.2,.76)?1:0,transform:`translate(${f*240} ${-f*74})`});}
        set('separated-product',{opacity:range(t,.68,.89),transform:`translate(${unloading(t)*20} 0)`});
      }};
    },
    function metal(){
      const electrodes=[0,1,2].map(i=>part(`electrode-${i}`,`<rect x="${224+i*52}" y="93" width="24" height="151"/>`)).join('');
      let feed='';for(let i=0;i<8;i++)feed+=`<g data-motion-part="oxide-${i}" data-material-state="oxide-feed">${grain(165+i*22,65+i%2*7,6)}</g>`;
      const pool=`<path data-motion-part="conversion-pool" data-material-state="molten-conversion-feed" fill="url(#motion-melt)" d="M190 236Q284 210 384 235V257Q280 283 190 257Z"/>`;
      let ions='';for(let i=0;i<6;i++)ions+=`<g data-motion-part="conversion-ion-${i}"><circle fill="#d7bb80" cx="${147+i*15}" cy="410" r="3"/></g>`;
      const deposit=`<g data-motion-part="metal-deposit" data-material-state="metal-collecting"><path fill="#b9c5bd" d="M139 435H243V446H139Z"/></g>`;
      return{html:pool+electrodes+feed+`<g data-motion-part="metal-output" data-material-state="metal">${block(357,326,60,31)}</g>`+overlayPanel('Chemical feed → metallic feedstock',`<g data-motion-part="electrolysis-cutaway"><path stroke="#d9b472" stroke-width="3" d="M160 405V430M183 405V430M206 405V430"/><path fill="#cd9661" d="M139 431H243V446H139Z"/>${ions}${deposit}<path class="motion-arrow" d="M258 427H315"/>${block(331,417,51,25)}</g>`,30,365,452,94)+inOut('Rare-earth chemical feed','Metal / master alloy'),frame(t){
        const load=loading(t);for(let i=0;i<8;i++){set(`oxide-${i}`,{opacity:t<.30?1:0,transform:`translate(0 ${load*157})`});}
        for(let i=0;i<3;i++)transform(`electrode-${i}`,`translate(0 ${lerp(-13,7,load)})`);
        for(let i=0;i<6;i++){const p=operation(t),f=clamp((p*2+i/6)%1);set(`conversion-ion-${i}`,{opacity:windowOn(t,.28,.72)?1:0,transform:`translate(${(i%2?-1:1)*f*8} ${f*24})`});}
        const collecting=range(t,.30,.72);transform('metal-deposit',`translate(0 446) scale(1 ${collecting}) translate(0 -446)`);
        set('conversion-pool',{opacity:lerp(.3,1,load)});set('metal-output',{opacity:range(t,.73,.89),transform:`translate(${unloading(t)*31} 0)`});
      }};
    },
    function casting(){
      const wheel=part('casting-wheel',shape.castingWheel,`<path stroke="#e1bea1" stroke-width="3" opacity=".55" d="M242 182V264L289 302"/>`);
      let charges='';for(let i=0;i<4;i++)charges+=`<g data-motion-part="charge-${i}" data-material-state="weighed-alloy-feedstock">${block(320+i%2*18,52-Math.floor(i/2)*14,15,10)}</g>`;
      const bath=`<g data-motion-part="casting-bath" data-material-state="molten-alloy"><ellipse fill="url(#motion-melt)" cx="340" cy="109" rx="36" ry="12" transform="rotate(28 340 109)"/><path fill="none" stroke="#fff2bb" stroke-width="2" d="M315 102Q338 96 365 121"/></g>`;
      const opening=`<ellipse fill="#2b3a2f" stroke="#c8b99c" stroke-width="1.5" cx="340" cy="109" rx="36" ry="12" transform="rotate(28 340 109)"/>`;
      const crucible=part('casting-crucible',shape.castingCrucible,opening+bath+charges);
      const pour=`<path data-motion-part="casting-pour-outline" fill="none" stroke="#102218" stroke-width="22" stroke-linecap="round" d="M287 150Q281 172 275 186"/><path data-motion-part="casting-melt" data-material-state="pouring-molten-alloy" fill="none" stroke="#ff9e3d" stroke-width="15" stroke-linecap="round" d="M287 150Q281 172 275 186"/><path data-motion-part="casting-pour-core" fill="none" stroke="#fff5c6" stroke-width="5" stroke-linecap="round" d="M287 150Q281 172 275 186"/><g data-motion-part="casting-contact" data-material-state="molten-alloy-contacting-cooled-roll"><ellipse cx="275" cy="186" rx="13" ry="8" fill="#102218"/><ellipse cx="275" cy="186" rx="10" ry="6" fill="#ffad4d"/><ellipse cx="275" cy="185" rx="5" ry="3" fill="#fff5c6"/></g>`;
      const ribbon=`<path data-motion-part="casting-hot-outline" fill="none" stroke="#102218" stroke-width="17" stroke-linecap="round" d="M275 186Q322 211 320 267" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><path data-motion-part="casting-hot-strip" data-material-state="alloy-cooling-on-roll" fill="none" stroke="#ffb357" stroke-width="10" stroke-linecap="round" d="M275 186Q322 211 320 267" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><path data-motion-part="casting-hot-core" fill="none" stroke="#ffefbb" stroke-width="3" stroke-linecap="round" d="M275 186Q322 211 320 267" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><path data-motion-part="casting-ribbon" data-material-state="solid-alloy-strip" fill="none" stroke="#d9e0d6" stroke-width="6" stroke-linecap="round" d="M320 267C321 291 323 321 330 347" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>`;
      let flowStreaks='';for(let i=0;i<3;i++)flowStreaks+=`<g data-motion-part="casting-flow-${i}"><path fill="none" stroke="#fffbe7" stroke-width="3" stroke-linecap="round" d="M0 -3L0 3"/></g>`;
      const pourLabel=`<g data-motion-part="casting-pour-label"><path class="motion-leader" d="M167 154L263 178"/>${caption('Molten alloy',116,119,'motion-note')}${caption('合金熔液',116,143,'motion-note')}</g>`;
      let flakes='';for(let i=0;i<9;i++)flakes+=`<g data-motion-part="flake-${i}" data-material-state="thin-alloy-flakes"><path class="motion-metal" d="M322 347l17 -4 2 4-18 4Z"/></g>`;
      const collector=`<g data-functional-cutaway="true"><path fill="#23382c" stroke="#92a999" stroke-width="2" d="M337 378H437L450 393L352 401Z"/><path fill="none" stroke="#92a999" stroke-width="2" d="M352 401V409H450V393"/></g>`;
      const labels=`<path class="motion-leader" d="M382 158L430 163"/>${caption('Melting crucible',420,183,'motion-note')}${caption('熔炼坩埚',420,208,'motion-note')}<path class="motion-leader" d="M162 287L94 300"/>${caption('Water-cooled roll',91,326,'motion-note')}${caption('水冷辊 · 甩带',91,350,'motion-note')}${caption('Flake collector',400,432,'motion-note')}${caption('合金片收集',400,454,'motion-note')}<g data-motion-part="casting-status">${caption('Solid charge → melt bath',256,476,'motion-note')}</g>`;
      return{html:wheel+crucible+pour+ribbon+flowStreaks+collector+flakes+labels+pourLabel+inOut('Metal / master-alloy charge','Rapidly cooled alloy flakes'),frame(t){
        const load=smooth(range(t,.02,.17)),melt=smooth(range(t,.18,.36)),pouring=windowOn(t,.43,.78),tip=smooth(range(t,.36,.46)),returning=smooth(range(t,.78,.90));
        const angle=lerp(-23,9,tip)-returning*32;
        transform('casting-crucible',localTransform(311,177,angle));
        for(let i=0;i<4;i++){const x=320+i%2*18,y=52-Math.floor(i/2)*14;set(`charge-${i}`,{opacity:1-melt,transform:`translate(${-load*4} ${load*(54+Math.floor(i/2)*14)}) translate(${x+7.5} ${y+5}) scale(${1-melt*.86}) translate(${-x-7.5} ${-y-5})`});}
        set('casting-bath',{opacity:range(t,.15,.27)*(1-range(t,.70,.81))});
        const lip=rotatedPoint(287,150,311,177,angle);
        const jet={opacity:pouring?1:0,d:`M${lip.x.toFixed(2)} ${lip.y.toFixed(2)}Q279 167 275 186`};set('casting-melt',jet);set('casting-pour-outline',jet);set('casting-pour-core',jet);set('casting-contact',{opacity:pouring?1:0});set('casting-pour-label',{opacity:range(t,.30,.43)*(1-range(t,.78,.90))});
        for(let i=0;i<3;i++){const f=(range(t,.43,.78)*6+i/3)%1,q=1-f,x=q*q*lip.x+2*q*f*279+f*f*275,y=q*q*lip.y+2*q*f*167+f*f*186;set(`casting-flow-${i}`,{opacity:pouring?1:0,transform:`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(25)`});}
        const roll=range(t,.39,.86);transform('casting-wheel',projectedRotation(242,264,78,90,roll*620));
        const stripAttrs={opacity:windowOn(t,.43,.87)?1:0,'stroke-dashoffset':(1-range(t,.43,.52))*100};set('casting-hot-strip',stripAttrs);set('casting-hot-outline',stripAttrs);set('casting-hot-core',stripAttrs);
        set('casting-ribbon',{opacity:windowOn(t,.50,.90)?1:0,'stroke-dashoffset':(1-range(t,.50,.62))*100});
        for(let i=0;i<9;i++){const start=.59+i*.027,f=range(t,start,start+.20);set(`flake-${i}`,{opacity:t>=start?1:0,transform:`translate(${f*(26+i%3*18)} ${f*(30+Math.floor(i/3)*11)}) rotate(${f*(i%2?32:-24)} 330 347)`});}
        const status=t<.18?'Load the weighed metal charge':t<.36?'Heat: solid charge becomes a melt bath':t<.46?'Tip the crucible toward the cooled roll':t<.79?'Pour → rapid cooling → thin strip':t<.90?'Strip breaks into thin alloy flakes':'Cooled flakes proceed to powder making';
        const statusNode=el('casting-status');if(statusNode.dataset.status!==status){statusNode.innerHTML=caption(status,256,476,'motion-note');statusNode.dataset.status=status;}
        active.svg.dataset.materialState=t<.18?'solid-alloy-charge':t<.36?'charge-melting':t<.46?'molten-alloy-ready-to-pour':t<.79?'strip-solidifying-on-cooled-roll':'thin-solid-alloy-flakes';
      }};
    },
    function hd(){
      const door=part('hd-door',shape.hdDoor), tray=part('hd-tray',shape.hdTray);
      // The chamber opening is left of the open door. An opaque backing closes the
      // entire aperture; the retained raster door supplies its recognizable surface.
      // This schematic backing also prevents transparent crop edges exposing the tray.
      const seal=`<g data-motion-part="hd-seal"><ellipse class="motion-metal" cx="320" cy="225" rx="98" ry="131"/></g>`;
      const closedLabel=`<g data-motion-part="hd-closed-label">${caption('CHAMBER CLOSED',320,109,'motion-note')}</g>`;
      let chunks='';for(let i=0;i<8;i++)chunks+=`<g data-motion-part="hd-chunk-${i}">${block(94+i%4*38,393+Math.floor(i/4)*22,28,13)}</g>`;
      let broken='';for(let i=0;i<28;i++)broken+=`<g data-motion-part="hd-grain-${i}" data-material-state="coarse-powder">${grain(289+i%7*23,397+Math.floor(i/7)*12,5)}</g>`;
      const gas=`<g data-motion-part="hd-hydrogen"><path class="motion-gas-flow" d="M103 118V151H205V195"/><text class="motion-note" x="54" y="112">H₂ in</text></g>`;
      return{html:tray+seal+door+closedLabel+gas+overlayPanel('Cutaway: flakes break into coarse powder',chunks+broken+`<path class="motion-arrow" d="M240 426H270"/>`,30,365,452,94)+inOut('Alloy flakes + hydrogen','Coarse brittle powder'),frame(t){
        const load=loading(t),open=1-smooth(range(t,.21,.31)),out=unloading(t);
        const closure=clamp(1-open-out*(1-open));
        set('hd-tray',{opacity:1-smooth(range(closure,.35,.78)),transform:`translate(${-load*55+out*55} ${-load*8+out*8})`});
        // The existing raster door actually closes; the inside view is never presented as open during operation.
        set('hd-door',{opacity:1,transform:`translate(${lerp(434,320,closure)} ${lerp(220,225,closure)}) scale(${lerp(1,1.60,closure)} ${lerp(1,1.18,closure)}) translate(-434 -220)`});
        set('hd-seal',{opacity:smooth(range(closure,.35,.85))});set('hd-closed-label',{opacity:closure>.95?1:0});
        set('hd-hydrogen',{opacity:closure>.95&&windowOn(t,.32,.65)?1:0});queryAttr('[data-motion-part="hd-hydrogen"] path',{'stroke-dashoffset':-operation(t)*90});
        for(let i=0;i<8;i++){const f=range(t,.35,.70);set(`hd-chunk-${i}`,{opacity:1-f,transform:`translate(${Math.sin(i*5)*f*14} ${Math.cos(i*2)*f*12})`});}
        for(let i=0;i<28;i++){const f=range(t,.40,.76);set(`hd-grain-${i}`,{opacity:f,transform:`translate(${(1-f)*-100} ${(1-f)*-15})`});}
      }};
    },
    function milling(){
      let feed='', grains='';for(let i=0;i<7;i++)feed+=`<g data-motion-part="mill-feed-${i}">${grain(66+i%3*15,275+Math.floor(i/3)*14,8)}</g>`;
      for(let i=0;i<24;i++)grains+=`<g data-motion-part="mill-grain-${i}" data-material-state="fine-powder">${grain(142+i%6*17,408+Math.floor(i/6)*8,3.5)}</g>`;
      let chamber='';for(let i=0;i<12;i++)chamber+=`<g data-motion-part="jet-chamber-grain-${i}">${grain(180+i%3*12,231+Math.floor(i/3)*15,3.5)}</g>`;
      const machineFlow=`<g data-motion-part="jet-gas-path"><path class="motion-gas-flow" d="M129 296L167 316M261 298L221 316M194 298V91Q225 65 280 74H362V168"/></g><g data-functional-cutaway="true"><path fill="#142019e6" stroke="#8ba293" stroke-width="1.2" d="M169 215H218V313H169Z"/>${chamber}</g><g data-motion-part="cyclone-discharge" data-material-state="fine-powder-discharge">${[0,1,2,3,4].map(i=>grain(373+i%2*9,291+Math.floor(i/2)*12,3)).join('')}</g>`;
      const panel=overlayPanel('Cutaway: gas collision + classification',`<path class="motion-arrow" d="M80 405L140 430M80 448L140 430M251 405L211 430"/>${grains}<path class="motion-arrow" d="M262 430H321"/><g data-motion-part="classified-powder" data-material-state="classified-fine-powder">${Array.from({length:16},(_,i)=>grain(351+i%4*18,410+Math.floor(i/4)*11,3)).join('')}</g>`,30,365,452,94);
      return{html:machineFlow+feed+panel+inOut('Coarse powder + gas','Classified fine powder')+caption('Gas collisions; the cyclone collects powder',256,474,'motion-note'),frame(t){
        const p=operation(t);for(let i=0;i<7;i++){const f=range(t,.04+i*.018,.29+i*.018);set(`mill-feed-${i}`,{opacity:f<1?1:0,transform:`translate(${f*94} ${f*26})`});}
        set('jet-gas-path',{opacity:windowOn(t,.24,.77)?.8:0});queryAttr('[data-motion-part="jet-gas-path"] path',{'stroke-dashoffset':-p*120});
        for(let i=0;i<12;i++){const dx=Math.sin(p*24+i*2)*10,dy=Math.cos(p*21+i)*9;set(`jet-chamber-grain-${i}`,{opacity:windowOn(t,.25,.75)?1:0,transform:`translate(${dx} ${dy})`});}
        set('cyclone-discharge',{opacity:range(t,.48,.77),transform:`translate(0 ${unloading(t)*22})`});
        for(let i=0;i<24;i++){const v=windowOn(t,.28,.77)?1:range(t,.18,.29);const dx=Math.sin(p*22+i*2)*19*(1-p),dy=Math.cos(p*17+i)*12*(1-p);set(`mill-grain-${i}`,{opacity:v,transform:`translate(${dx} ${dy})`});}
        set('classified-powder',{opacity:range(t,.57,.91),transform:`translate(${unloading(t)*45} 0)`});
      }};
    },
    function pressing(){
      const ram=part('press-ram',shape.ram);
      let grains='';for(let i=0;i<15;i++)grains+=`<g data-motion-part="press-grain-${i}" data-material-state="oriented-powder"><path class="motion-powder" d="M-6 -3H6V3H-6Z"/><path stroke="#d6b270" stroke-width="2" d="M-4 0H4M-4 0L-1 -2M-4 0L-1 2M4 0L1 -2M4 0L1 2"/></g>`;
      const field=`<g data-motion-part="press-field"><path class="motion-field" d="M182 305H331M182 327H331M182 347H331"/></g>`;
      const pressPowder=`<g data-motion-part="press-powder" data-material-state="powder-bed"><path class="motion-powder" d="M217 307H294V347H217Z"/></g>`;
      return{html:ram+`<path fill="none" stroke="#a5b7ab" stroke-width="3" d="M214 303V350H301V303"/>`+field+pressPowder+grains+`<g data-motion-part="green-body" data-material-state="compacted-green-body">${block(215,327,80,20)}</g>`+inOut('Fine anisotropic powder','Aligned green body')+caption('↔ markers: crystal axes; not working poles',256,455,'motion-note'),frame(t){
        const p=range(t,.29,.68),orient=range(t,.23,.44),release=unloading(t);transform('press-ram',`translate(0 ${p*65-release*65})`);
        set('press-field',{opacity:windowOn(t,.21,.73)?.8:0});set('press-powder',{opacity:1-p,transform:`translate(0 347) scale(1 ${1-p*.67}) translate(0 -347)`});
        for(let i=0;i<15;i++){const x=226+i%5*14,y=312+Math.floor(i/5)*11*(1-p*.70);const angle=lerp((i*53)%180,0,smooth(orient));set(`press-grain-${i}`,{opacity:t<.77?1:0,transform:`translate(${x} ${y+p*22}) rotate(${angle})`});}
        set('green-body',{opacity:range(t,.64,.79),transform:`translate(${release*75} 0)`});
      }};
    },
    function sinter(){return furnace(false);},
    function machining(){
      const wheel=part('grinding-wheel',shape.grindWheel,`<path stroke="#edf3ed" stroke-width="3" opacity=".7" d="M320 140V192L343 230"/>`),table=part('workpiece-table',shape.workTable);
      let scrap='';for(let i=0;i<15;i++)scrap+=`<g data-motion-part="scrap-${i}" data-material-state="machining-scrap">${grain(300,235,2.8)}</g>`;
      const output=`<g data-motion-part="dimensioned-part" data-material-state="dimensioned-magnet">${block(366,297,42,23)}</g>`;
      return{html:table+wheel+`<g data-motion-part="stock-block" data-material-state="sintered-stock">${block(173,201,51,33)}</g>`+scrap+output+inOut('Sintered block','Dimensioned part + scrap')+caption('The workpiece advances into the rotating grinding wheel',256,451,'motion-note'),frame(t){
        const p=operation(t),feed=smooth(range(t,.20,.66)),withdraw=unloading(t);transform('grinding-wheel',`translate(-7 -21) ${projectedRotation(320,192,40,59,p*1480)}`);transform('workpiece-table',`translate(${feed*77-withdraw*52} 0)`);
        set('stock-block',{opacity:t<.85?1:0,transform:`translate(${feed*77-withdraw*52} 0) translate(173 201) scale(${1-feed*.15} 1) translate(-173 -201)`});
        for(let i=0;i<15;i++){const f=clamp((p+i/15)%1);set(`scrap-${i}`,{opacity:windowOn(t,.37,.74)?1:0,transform:`translate(${f*(25+i%4*8)} ${f*83})`});}
        set('dimensioned-part',{opacity:range(t,.81,.94),transform:`translate(${withdraw*26} 0)`});
      }};
    },
    function diffusion(){return furnace(true);},
    function coating(){
      const hang=part('coating-racks',shape.coatingPieces);
      let shells='';for(let i=0;i<3;i++)shells+=`<g data-motion-part="coated-surface-${i}" data-material-state="coated-component"><path fill="#d5c09a" stroke="#eee6ce" stroke-width="2" d="M${101+i*133} ${137+i*5}l37 0v49l-37 -5Z"/></g>`;
      active.extraDefs=(active.extraDefs||'')+'<clipPath id="pm-coating-visible"><path d="M83 80H160V212H83Z M219 80H298V224H219Z M350 80H426V237H350Z"/></clipPath>';
      const wires=[0,1,2].map(i=>`<path data-motion-part="coating-wire-${i}" fill="none" stroke="#c9d5cd" stroke-width="2" d="M${120+i*133} 105V137"/>`).join('');
      const bath=`<g data-motion-part="coating-current"><path class="motion-gas-flow" d="M91 254H146M231 266H288M360 277H414"/></g>`;
      return{html:wires+`<g clip-path="url(#pm-coating-visible)">${hang+shells}</g>`+bath+inOut('Prepared magnet surfaces','Protected coated parts')+caption('Lower into bath → coat the surface → withdraw',256,448,'motion-note'),frame(t){
        const down=smooth(range(t,.12,.32)),up=smooth(range(t,.71,.92)),depth=(down-up)*62;transform('coating-racks',`translate(0 ${depth})`);
        for(let i=0;i<3;i++)set(`coated-surface-${i}`,{opacity:range(t,.46,.78)*.8,transform:`translate(0 ${depth})`});
        for(let i=0;i<3;i++)set(`coating-wire-${i}`,{d:`M${120+i*133} 105V${137+i*5+depth}`});set('coating-current',{opacity:windowOn(t,.34,.70)?.6:0});queryAttr('[data-motion-part="coating-current"] path',{'stroke-dashoffset':-operation(t)*60});
      }};
    },
    function magnetize(){
      const piece=part('magnet-part',shape.magnetPart);
      const fields=`<g data-motion-part="magnetizing-pulse"><ellipse class="motion-field" cx="129" cy="242" rx="83" ry="60"/><ellipse class="motion-field" cx="129" cy="242" rx="112" ry="82"/><path class="motion-arrow" d="M214 279V195"/>${caption('Pulse field ↑',276,185,'motion-note')}</g>`;
      let arrows='';for(let i=0;i<6;i++)arrows+=`<g data-motion-part="domain-${i}"><path class="motion-grain-arrow" d="M-6 0H6"/></g>`;
      let insetArrows='';for(let i=0;i<6;i++)insetArrows+=`<g data-motion-part="magnetic-direction-${i}"><path class="motion-grain-arrow" d="M-13 0H13"/></g>`;
      const inset=`<g data-functional-cutaway="true"><rect class="motion-panel" x="276" y="283" width="222" height="111" rx="6"/>${caption('Magnetic directions',387,307,'motion-note')}${insetArrows}</g>`;
      const charge=`<g data-motion-part="capacitor-charge"><rect class="motion-panel" x="366" y="225" width="66" height="17"/><rect data-charge-bar="true" x="369" y="228" width="0" height="11" fill="#cbb276"/></g>`;
      return{html:piece+fields+arrows+inset+charge+inOut('Unmagnetized part','Magnetized part')+caption('↑↓ = magnetic directions on fixed crystal axes',256,411,'motion-note')+`<g data-motion-part="magnet-status">${caption('Before: opposing directions; little net magnetization',256,450,'motion-note')}</g>`,frame(t){
        const loaded=loading(t),out=unloading(t),dx=(1-loaded)*-75+out*90-15;transform('magnet-part',`translate(${dx} 14)`);
        const pulse=windowOn(t,.46,.56);set('magnetizing-pulse',{opacity:pulse?1:0});const align=t>=.56;
        queryAttr('[data-charge-bar]',{width:t<.46?range(t,.20,.45)*60:0});
        for(let i=0;i<6;i++){const switched=t>=.46+(i+1)*(.10/6),angle=switched?-90:i%2?-90:90;set(`domain-${i}`,{opacity:loaded>.7?1:0,transform:`translate(${120+(i%2)*24+dx} ${229+Math.floor(i/2)*15}) rotate(${angle})`});set(`magnetic-direction-${i}`,{transform:`translate(${321+(i%3)*66} ${334+Math.floor(i/3)*39}) rotate(${angle})`,'data-direction':angle===-90?'up':'down'});}
        active.svg.dataset.materialState=align?'magnetized-persistent-poles':pulse?'magnetizing-field-applied':'unmagnetized-component';
        const status=align?'After: field off; net magnetization remains ↑':pulse?'During: strong pulse field applied ↑':'Before: opposing directions; little net magnetization';
        const statusNode=el('magnet-status');if(statusNode.dataset.status!==status){statusNode.innerHTML=caption(status,256,450,'motion-note');statusNode.dataset.status=status;}
      }};
    },
    function inspection(){
      const graph=`<rect class="motion-panel" x="46" y="165" width="265" height="228" rx="10"/><path stroke="#789583" stroke-width="2" fill="none" d="M74 349H286M276 370V194"/><text class="motion-note" x="284" y="200">B</text><text class="motion-note" x="72" y="369">−H</text><path data-motion-part="test-trace" fill="none" stroke="#d2af73" stroke-width="4" d="M276 220C217 220 154 247 118 309C92 353 109 355 94 355" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>${caption('Illustrative demagnetization curve',178,421,'motion-note')}`;
      const fixture=`<g data-functional-cutaway="true"><path fill="none" stroke="#bbc8bc" stroke-width="6" d="M318 196V254H426V196"/><g data-motion-part="caliper-left"><path fill="none" stroke="#d6c494" stroke-width="5" d="M319 216H335V239H327"/></g><g data-motion-part="caliper-right"><path fill="none" stroke="#d6c494" stroke-width="5" d="M424 216H408V239H417"/></g>${caption('Dimension check',372,278,'motion-note')}</g>`;
      const partBlock=`<g data-motion-part="test-component" data-material-state="candidate-part">${block(340,205,61,34)}</g><g data-motion-part="acceptance" data-material-state="illustrative-within-specification"><rect class="motion-panel" x="328" y="300" width="138" height="68" rx="6"/><path fill="none" stroke="#87b794" stroke-width="7" d="M355 316L369 331L399 303"/>${caption('Example: within spec',393,389,'motion-note')}</g>`;
      return{html:graph+fixture+partBlock+inOut('Candidate magnet','Accepted / rework / reject')+caption('Property curve and checks are illustrative',256,466,'motion-note'),frame(t){
        set('test-trace',{'stroke-dashoffset':(1-range(t,.30,.71))*100});transform('test-component',`translate(0 ${(1-loading(t))*-75})`);const contact=smooth(range(t,.25,.39));transform('caliper-left',`translate(${contact*5} 0)`);transform('caliper-right',`translate(${-contact*5} 0)`);set('acceptance',{opacity:range(t,.76,.91)});
      }};
    },
    function application(){
      // Functional motor diagram, not an asserted OEM reconstruction. The existing cooled-roll raster supplies a recognizable metallic rotor.
      const rotor=part('working-rotor',shape.castingWheel,`<path stroke="#bd9d63" stroke-width="8" d="M242 199V219M242 310V330M186 264H202M282 264H298"/>`);
      let stator='';for(let i=0;i<6;i++){const a=i*Math.PI/3,cx=242+Math.cos(a)*105,cy=264+Math.sin(a)*117;stator+=`<g data-motion-part="stator-coil-${i}" transform="rotate(${i*60} ${cx} ${cy})"><rect class="motion-brass" x="${cx-18}" y="${cy-27}" width="36" height="54" rx="5"/><path stroke="#765730" stroke-width="2" d="M${cx-16} ${cy-17}h32M${cx-16} ${cy-7}h32M${cx-16} ${cy+3}h32M${cx-16} ${cy+13}h32"/><rect data-energized-coil="${i}" x="${cx-18}" y="${cy-27}" width="36" height="54" rx="5" fill="#f0cd81" opacity="0"/></g>`;}
      const poles=`<g data-motion-part="rotor-poles"><rect fill="#a36646" x="225" y="180" width="34" height="20" rx="3"/><rect fill="#688f7c" x="225" y="327" width="34" height="20" rx="3"/>${caption('N',242,196,'motion-note')}${caption('S',242,343,'motion-note')}</g>`;
      return{html:`<g data-functional-cutaway="true"><ellipse fill="#15231d" stroke="#879f8b" stroke-width="5" cx="242" cy="264" rx="135" ry="150"/>${stator}${rotor}${poles}<g data-motion-part="rotating-stator-field"><path class="motion-field" d="M137 262Q242 179 347 262"/><path class="motion-arrow" d="M169 233L202 216"/></g></g>`+inOut('Magnets + electrical power','Torque / useful motion')+caption('Powered stator field drives the permanent-magnet rotor',256,449,'motion-note'),frame(t){const p=operation(t),angle=p*1080;transform('working-rotor',projectedRotation(242,264,78,90,angle));transform('rotor-poles',projectedRotation(242,264,78,90,angle));transform('rotating-stator-field',localTransform(242,264,angle));for(let i=0;i<6;i++)queryAttr(`[data-energized-coil="${i}"]`,{opacity:windowOn(t,.26,.74)?Math.max(0,Math.cos((angle-i*60)*Math.PI/180))*.8:0});active.svg.dataset.materialState='qualified-magnet-in-powered-motor';}};
    }
  ];
  function furnace(diffusion){
    const door=part('furnace-door',shape.furnaceDoor),tray=part('furnace-tray',shape.furnaceTray);
    const seal=`<g data-motion-part="furnace-seal"><ellipse class="motion-metal" cx="193" cy="284" rx="101" ry="133"/><ellipse fill="#58685d" stroke="#ceb479" stroke-width="6" cx="193" cy="284" rx="82" ry="113"/>${caption('SEALED',193,287,'motion-note')}</g>`;
    const panelBase=overlayPanel(diffusion?'Cutaway: source → grain boundaries':'Cutaway: porosity shrinks','',30,365,452,94);
    let holes='';for(let i=0;i<14;i++)holes+=`<circle data-motion-part="pore-${i}" cx="${133+i%5*20}" cy="${399+Math.floor(i/5)*15}" r="${i%3+3}" fill="#263d30"/>`;
    let boundaries='';for(let i=0;i<3;i++)boundaries+=`<path data-motion-part="diffusion-boundary-${i}" d="M${153+i*31} 391V405L${142+i*31} 416L${150+i*31} 440" fill="none" stroke="#c5a165" stroke-width="4" stroke-dasharray="70" stroke-dashoffset="70"/>`;
    const sourceFilm=diffusion?`<path data-motion-part="diffusion-source-film" d="M113 389H245" fill="none" stroke="#e5c07c" stroke-width="6"/>`:'';
    const inset=`<g data-motion-part="thermal-body" data-material-state="${diffusion?'source-coated-magnet':'green-body'}"><rect class="motion-metal" x="113" y="390" width="132" height="52" rx="3"/>${diffusion?boundaries:holes}${sourceFilm}</g><path class="motion-arrow" d="M268 416H311"/><g data-motion-part="thermal-output" data-material-state="${diffusion?'modified-grain-boundaries':'dense-magnet'}">${block(342,402,73,32)}</g>`;
    const thermalStatus=`<g data-motion-part="furnace-status"><rect class="motion-panel" x="334" y="92" width="153" height="104" rx="6"/>${caption('Load green bodies',410,119,'motion-note')}</g><g data-motion-part="furnace-hot-zone"><circle cx="359" cy="178" r="6" fill="#df9053"/></g>`;
    return{html:tray+door+seal+thermalStatus+panelBase+inset+inOut(diffusion?'Magnet + Dy/Tb source':'Pressed green body',diffusion?'Modified grain boundaries':'Dense magnet material'),frame(t){
      const load=loading(t),open=1-smooth(range(t,.21,.30)),out=unloading(t),heat=range(t,.34,.63);
      const closure=clamp(1-open-out*(1-open));
      set('furnace-tray',{opacity:1-smooth(range(closure,.35,.78)),transform:`translate(${-37+load*28-out*28} ${27-load*4+out*4})`});
      set('furnace-door',{opacity:1,transform:`translate(${lerp(42,193,closure)} ${lerp(262,284,closure)}) scale(${lerp(1,1.70,closure)} 1) translate(-79 -235)`});set('furnace-seal',{opacity:0});set('furnace-hot-zone',{opacity:(diffusion?windowOn(t,.33,.76):windowOn(t,.33,.57)||windowOn(t,.64,.76))?1:0});
      const status=t<.22?'Load into chamber':t<.33?'Close; vacuum / gas':t<.57?(diffusion?'Diffuse along boundaries':'Sinter: porosity shrinks'):t<.64?(diffusion?'Heat treatment continues':'Cool / transfer'):t<.76?(diffusion?'Heat treatment continues':'Post-sinter aging'):t<.85?'Cool before opening':'Open; unload material';
      const statusNode=el('furnace-status');if(statusNode.dataset.status!==status){statusNode.innerHTML=`<rect class="motion-panel" x="334" y="92" width="153" height="104" rx="6"/>${caption(status,410,119,'motion-note')}`;statusNode.dataset.status=status;}
      if(diffusion){for(let i=0;i<3;i++)set(`diffusion-boundary-${i}`,{'stroke-dashoffset':(1-range(t,.32+i*.04,.73))*70});set('thermal-body',{'data-material-state':t>.68?'modified-boundary-cutaway':'surface-diffusion-source'});}
      else{const shrink=range(t,.32,.59);transform('thermal-body',`translate(179 416) scale(${1-shrink*.1}) translate(-179 -416)`);for(let i=0;i<14;i++)set(`pore-${i}`,{r:(i%3+3)*(1-shrink*.86),opacity:1-shrink*.72});}
      set('thermal-output',{opacity:range(t,.85,.95),transform:`translate(${out*25} 0)`});
    }};
  }
  function loadPlate(a){
    if(a.index>=13)return;
    const plate=a.sheet==='upstream'?'assets/machines-upstream-motion-base-v2.png':'assets/machines-factory-motion-base.png';
    const apply=ok=>{if(active!==a)return;const img=a.svg.querySelector('[data-machine-base]');if(img&&ok){img.setAttribute('href',plate);if(a.cleanMask)img.setAttribute('mask','url(#motion-clean-plate-mask)');else img.removeAttribute('mask');a.svg.dataset.baseLayer='edited-clean-plate';}};
    if(plateCache.has(plate)){const entry=plateCache.get(plate);if(typeof entry==='boolean')apply(entry);else entry.then(apply);return;}
    const promise=new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src=plate;});plateCache.set(plate,promise);promise.then(ok=>{plateCache.set(plate,ok);apply(ok);});
  }
  function mount(container,index){
    index=Math.max(0,Math.min(14,Number(index)||0));
    const sheet=index<6?'upstream':'factory',cell=stageCells[index];
    active={container,index,sheet,cell,original:`assets/machines-${sheet}.png`,clips:'',svg:null,frame:null,elapsed:0,duration:12000};
    if(index===14){active.original='assets/machines-upstream.png';active.sheet='upstream';active.cell=4;}
    const result=builders[index]();active.frame=result.frame;
    // With no generated clean plate, runtime masking avoids a second stationary copy of the moving part.
    const masks=active.clips.replace(/<clipPath[^>]*>/g,'<g fill="black">').replace(/<\/clipPath>/g,'</g>');
    // These components remain in the generated clean plate. Mask only their original positions at runtime.
    const retainedParts={4:['casting-crucible'],9:['workpiece-table']}[index]||[];
    const retainedShapes=retainedParts.map(name=>active.clips.match(new RegExp(`<clipPath id="pm-${name}">([\\s\\S]*?)<\\/clipPath>`))?.[1]||'').join('');active.cleanMask=Boolean(retainedShapes);
    const defs=`<defs><linearGradient id="motion-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b9c4bd"/><stop offset=".5" stop-color="#697c70"/><stop offset="1" stop-color="#d4ddd8"/></linearGradient><linearGradient id="motion-melt"><stop stop-color="#fff0ab"/><stop offset="1" stop-color="#d07143"/></linearGradient><linearGradient id="motion-ribbon"><stop stop-color="#dc9f62"/><stop offset=".45" stop-color="#b5bbaf"/><stop offset="1" stop-color="#69776d"/></linearGradient><marker id="motion-arrowhead" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path fill="#d8b573" d="M0 0L5 2.5L0 5Z"/></marker>${active.clips}${active.extraDefs||''}<mask id="motion-base-mask"><rect width="512" height="512" fill="white"/>${masks}</mask><mask id="motion-clean-plate-mask"><rect width="512" height="512" fill="white"/><g fill="black">${retainedShapes}</g></mask></defs>`;
    const base=index<13?sprite(active.original,'data-machine-base="true" mask="url(#motion-base-mask)"'):'';
    container.innerHTML=`<svg class="process-motion" xmlns="${NS}" xmlns:xlink="${XLINK}" viewBox="0 0 512 512" role="img" aria-label="${escape(titles[index])}; explanatory machinery and material transformation" data-motion-stage="${index}" data-base-layer="runtime-masked-original"><title>${escape(titles[index])}</title><desc>Source-guided educational animation. Timing is illustrative. Open chambers show loading or a cutaway; operation is sealed. Moving raster parts retain the original machinery illustration.</desc>${defs}${base}${result.html}<text class="motion-caption" data-motion-caption="true" text-anchor="middle" x="256" y="499"></text></svg>`;
    active.svg=container.querySelector('svg');container.style.backgroundImage='none';loadPlate(active);update(0,12000);return active.svg;
  }
  function update(elapsedMs,durationMs=12000){
    if(!active)return;
    const elapsed=Number(elapsedMs)||0,duration=Math.max(1,Number(durationMs)||12000),t=clamp(elapsed/duration);
    active.elapsed=elapsed;active.duration=duration;
    active.svg.dataset.progress=t.toFixed(5);active.svg.dataset.elapsedMs=String(Math.round(elapsed));
    const phase=t<.24?'input':t<.79?'processing':'output';active.svg.dataset.phase=phase;
    active.svg.dataset.materialState=phase==='input'?'received-feedstock':phase==='processing'?'undergoing-transformation':'usable-output';
    active.svg.setAttribute('aria-label',`${titles[active.index]}; ${phase}; explanatory process animation`);
    queryAttr('[data-token="input"]',{opacity:t<.79?1:.40});queryAttr('[data-token="output"]',{opacity:t>.79?1:.30});
    const text=active.svg.querySelector('[data-motion-caption]');text.textContent=phase==='input'?'01 · Receive / load':phase==='processing'?'02 · Machine action / material change':'03 · Usable output / next operation';
    active.frame(t);
    active.svg.querySelectorAll('[data-motion-part]').forEach(node=>node.setAttribute('data-progress',t.toFixed(5)));
    return {caption:phase==='input'?'Receive the input and load the machine':phase==='processing'?titles[active.index]:'Usable output proceeds to the next operation',phase,progress:t};
  }
  function reset(){if(active)update(0,active.duration);}
  function finish(){if(active)update(active.duration,active.duration);}
  function getState(){return active?{index:active.index,elapsedMs:active.elapsed,durationMs:active.duration,phase:active.svg.dataset.phase,progress:Number(active.svg.dataset.progress),baseLayer:active.svg.dataset.baseLayer}:null;}
  window.ProcessMotion={mount,update,reset,finish,getState};
})();
