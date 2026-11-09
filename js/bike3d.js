/**
 * Custom low-poly, procedural MOTORCYCLE CONCEPT MODEL (not a commercial GLB).
 * Requires Three.js r128. The page has a still-image fallback if WebGL fails.
 * Drag to orbit / wheel to zoom. All three model presets share this original
 * concept base with different body treatments, clearly labeled as fiction.
 */
window.createBikeViewer = function createBikeViewer(canvas, initialPaint) {
  if (!window.THREE) throw new Error('Three.js CDN unavailable');
  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.setClearColor(0x000000,0);
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.42;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(37,1,.1,100);
  camera.position.set(6.9,3.45,8.8);camera.lookAt(0,1.35,0);
  scene.add(new THREE.HemisphereLight(0xdafaff,0x152631,2.1));
  const key=new THREE.DirectionalLight(0xb7f5f5,4.1);key.position.set(-2,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;scene.add(key);
  const rim=new THREE.DirectionalLight(0xf26c91,3.5);rim.position.set(4,4,-5);scene.add(rim);
  const fill=new THREE.DirectionalLight(0x5dcfff,2);fill.position.set(5,3,7);scene.add(fill);
  const groundMat=new THREE.MeshStandardMaterial({color:0x101e25,roughness:.8,metalness:.1,transparent:true,opacity:.9});
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(60,60),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.06;ground.receiveShadow=true;scene.add(ground);
  const ringMat=new THREE.MeshBasicMaterial({color:0x4b9ea2,transparent:true,opacity:.25});
  function groundRing(radius){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.013,8,160),ringMat);ring.rotation.x=Math.PI/2;ring.position.y=-.025;scene.add(ring);}groundRing(3.1);groundRing(3.45);
  const bike=new THREE.Group();bike.position.set(0,.05,0);scene.add(bike);
  const paint=new THREE.MeshStandardMaterial({color:initialPaint||'#36e0db',roughness:.25,metalness:.55,side:THREE.DoubleSide});
  const trim=new THREE.MeshStandardMaterial({color:0x101a22,roughness:.34,metalness:.45});
  const dark=new THREE.MeshStandardMaterial({color:0x090d11,roughness:.86,metalness:.08});
  const rubber=new THREE.MeshStandardMaterial({color:0x080c10,roughness:.96,metalness:0});
  const metal=new THREE.MeshStandardMaterial({color:0x9bafba,roughness:.25,metalness:.96});
  const spokeMat=new THREE.MeshStandardMaterial({color:0x445965,roughness:.22,metalness:.95});
  const glowMat=new THREE.MeshStandardMaterial({color:0x75fffa,emissive:0x31b8d0,emissiveIntensity:1.7,roughness:.2});
  const glass=new THREE.MeshPhysicalMaterial({color:0x608698,transparent:true,opacity:.59,roughness:.07,metalness:.12,side:THREE.DoubleSide,depthWrite:false});
  const hot=new THREE.MeshStandardMaterial({color:0xe16672,emissive:0x91212f,emissiveIntensity:1.2});
  const engineMat=new THREE.MeshStandardMaterial({color:0x26313a,roughness:.37,metalness:.75});
  const allWheels=[];const fairings=[];
  const mesh=(geometry,material,position=[0,0,0],scale)=>{const m=new THREE.Mesh(geometry,material);m.position.set(...position);if(scale)m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;bike.add(m);return m;};
  function rod(a,b,r,material,radial=12){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b);const vec=new THREE.Vector3().subVectors(q,p);const cylinder=mesh(new THREE.CylinderGeometry(r,r,vec.length(),radial),material);cylinder.position.copy(p).add(q).multiplyScalar(.5);cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vec.normalize());return cylinder;}
  function oval(x,y,z,sx,sy,sz,material){return mesh(new THREE.SphereGeometry(1,28,18),material,[x,y,z],[sx,sy,sz]);}
  function sheet(points,z,thickness,material){const shape=new THREE.Shape();points.forEach((pt,i)=>i===0?shape.moveTo(pt[0],pt[1]):shape.lineTo(pt[0],pt[1]));shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelThickness:.065,bevelSize:.04,bevelSegments:2,steps:1});g.computeVertexNormals();const m=mesh(g,material,[0,0,z-thickness/2]);return m;}
  function wheel(x){
    const group=new THREE.Group();group.position.set(x,.78,0);bike.add(group);allWheels.push(group);
    function add(geo,mat,pos){const obj=new THREE.Mesh(geo,mat);obj.position.set(...pos);obj.castShadow=true;obj.receiveShadow=true;group.add(obj);return obj;}
    add(new THREE.TorusGeometry(.66,.16,16,52),rubber,[0,0,0]);
    add(new THREE.TorusGeometry(.49,.045,12,50),metal,[0,0,.10]);
    add(new THREE.TorusGeometry(.43,.027,8,48),spokeMat,[0,0,-.12]);
    add(new THREE.TorusGeometry(.34,.032,8,48),metal,[0,0,.15]);
    for(let i=0;i<7;i++){
      const a=i*Math.PI*2/7,bar=new THREE.Mesh(new THREE.BoxGeometry(.55,.078,.105),spokeMat);
      bar.position.set(Math.cos(a)*.255,Math.sin(a)*.255,.10);bar.rotation.z=a;bar.castShadow=true;group.add(bar);
    }
    add(new THREE.CylinderGeometry(.16,.16,.38,20),metal,[0,0,.0]).rotation.x=Math.PI/2;
    add(new THREE.TorusGeometry(.60,.014,6,45),new THREE.MeshBasicMaterial({color:initialPaint||'#36e0db'}),[0,0,.14]);
    add(new THREE.TorusGeometry(.60,.014,6,45),new THREE.MeshBasicMaterial({color:0xe96174}),[0,0,-.14]);
  }
  wheel(-1.63);wheel(1.63);
  // Frame, steering and exposed drivetrain.
  rod([-1.48,.89,0],[-.22,1.58,0],.12,metal);
  rod([-.22,1.58,0],[1.15,1.59,0],.11,metal);
  rod([-.22,1.58,0],[-.72,.95,0],.1,metal);
  rod([-.72,.95,0],[1.12,1.48,0],.075,metal);
  rod([-1.38,.93,.25],[.1,1.39,.25],.08,trim);
  rod([-1.38,.93,-.25],[.1,1.39,-.25],.08,trim);
  oval(-.15,1.18,0,.64,.47,.42,engineMat);
  oval(-.05,1.20,.45,.36,.35,.13,spokeMat);
  oval(-.05,1.20,-.45,.34,.36,.12,spokeMat);
  for(let i=0;i<5;i++){rod([-.43,1.03+i*.09,.51],[.19,1.03+i*.09,.51],.013,metal);}
  rod([1.12,2.26,.35],[1.63,.78,.35],.09,metal);
  rod([1.12,2.26,-.35],[1.63,.78,-.35],.09,metal);
  rod([1.10,2.28,-.43],[1.10,2.28,.43],.085,spokeMat);
  rod([1.09,2.28,-.55],[.85,2.40,-.67],.038,metal);
  rod([1.09,2.28,.55],[.85,2.40,.67],.038,metal);
  rod([-1.48,.93,0],[-.7,1.23,0],.085,spokeMat);
  const fairing1=sheet([[.0,1.1],[1.42,1.45],[1.46,2.05],[.79,2.26],[.25,2.07],[-.38,1.73]],-.37,.71,paint);fairings.push(fairing1);
  const fairing2=sheet([[.36,1.17],[1.34,1.45],[1.18,1.67],[.73,1.59],[.23,1.39]],.41,.06,trim);
  fairing2.visible=true;
  const fin=sheet([[-.48,1.51],[.2,1.59],[.10,1.37],[-.75,1.23]],.51,.05,paint);fairings.push(fin);
  // Upper tank, fairing canopy, seat and tail silhouette.
  const tank=oval(-.43,1.99,0,.69,.32,.52,paint);fairings.push(tank);
  oval(-.41,2.2,0,.38,.04,.24,trim);
  sheet([[-2.12,2.25],[-1.43,2.27],[-.96,2.14],[-1.27,2.0],[-2.03,2.03]],-.32,.64,paint);
  oval(-1.27,2.14,0,.53,.12,.46,dark);
  const wind=sheet([[.76,2.22],[1.10,2.83],[1.48,2.56],[1.49,2.18]],-.23,.45,glass);
  wind.castShadow=false;
  sheet([[1.07,2.11],[1.55,2.03],[1.61,1.84],[1.24,1.87]],.40,.08,trim);
  const headlamp=oval(1.53,1.97,.43,.15,.055,.035,glowMat);headlamp.rotation.z=-.2;
  oval(1.53,1.97,-.43,.15,.055,.035,glowMat).rotation.z=-.2;
  oval(-2.05,2.19,0,.09,.06,.28,hot);
  // Brake and exhaust detail.
  rod([-.5,1.02,-.52],[-1.1,.71,-.56],.085,metal);
  rod([-1.1,.71,-.56],[-1.91,.86,-.62],.105,metal);
  oval(-1.92,.87,-.63,.3,.115,.10,trim);
  rod([-.72,1.02,.53],[-1.15,.86,.58],.052,metal);
  const pedal=rod([-.5,.93,.50],[-.25,.78,.62],.06,metal);
  for(let x=-1.30;x<=1.22;x+=.3){const tread=mesh(new THREE.BoxGeometry(.06,.018,.28),trim,[x,.34,0]);tread.visible=false;}
  let modelIdx=0,wheelIdx=0,paintHex=initialPaint||'#36e0db';
  const zoom={value:11.3};let yaw=-.28,pitch=.24;let dragging=false,lastX=0,lastY=0,interaction=false;
  function setPaint(hex){paintHex=hex;paint.color.set(hex);allWheels.forEach(group=>{group.children.forEach(obj=>{if(obj.material?.type==='MeshBasicMaterial'&&obj.material.color?.getHexString()!== 'e96174'){obj.material.color.set(hex);}});});}
  function setModel(index){
    modelIdx=index;
    if(modelIdx===1){fairing1.scale.y=.76;fairing1.position.y=.37;wind.visible=false;tank.scale.y=.80;engineMat.color.set(0x34414a);}
    else if(modelIdx===2){fairing1.scale.y=.93;fairing1.position.y=.11;wind.visible=true;tank.scale.y=.78;engineMat.color.set(0x2b5557);}
    else{fairing1.scale.y=1;fairing1.position.y=0;wind.visible=true;tank.scale.y=1;engineMat.color.set(0x26313a);}
  }
  function setWheels(index){wheelIdx=index;allWheels.forEach(group=>{group.children.forEach(obj=>{if(obj.material===spokeMat)obj.material.color.set(index===0?0x3a4e59:0xb2a291);});});}
  function resize(){
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;
    camera.fov=rect.width<550?51:37;camera.updateProjectionMatrix();render();
  }
  function updateCamera(){camera.position.set(Math.sin(yaw)*zoom.value,Math.max(1.8,1.9+pitch*zoom.value*.52),Math.cos(yaw)*zoom.value);camera.lookAt(0,1.30,0);}
  function render(){updateCamera();renderer.render(scene,camera);}
  function down(e){if(e.button!==0&&e.pointerType==='mouse')return;dragging=true;interaction=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);}
  function move(e){if(!dragging)return;yaw-=(e.clientX-lastX)*.009;pitch=Math.max(-.5,Math.min(.75,pitch-(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY;render();}
  function up(){dragging=false;}
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();interaction=true;zoom.value=Math.max(6.8,Math.min(16,zoom.value+e.deltaY*.012));render();},{passive:false});
  const observer='ResizeObserver' in window?new ResizeObserver(resize):null;observer?.observe(canvas.parentElement);
  let active=true;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf=0,tick=0;
  function animate(){if(!active)return;raf=requestAnimationFrame(animate);if(reduced&&!interaction)return;tick++;
    if(!interaction&&!reduced)yaw-=.0015;
    render();
  }
  resize();animate();
  return {setPaint,setModel,setWheels,resize,rotate(delta){yaw+=delta;interaction=true;render();},reset(){yaw=-.28;pitch=.24;zoom.value=11.3;interaction=false;render();},setActive(value){active=value;if(active){resize();cancelAnimationFrame(raf);animate();}else cancelAnimationFrame(raf);},destroy(){active=false;cancelAnimationFrame(raf);observer?.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);renderer.dispose();}};
};
