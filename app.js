(() => {
"use strict";
const KEY="bitschips.devices.v1", $=s=>document.querySelector(s), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fields=["name","category","model","shop","purchaseDate","price","dimensions","weight","chemistry","batteryCount","batteryFormat","capacity","voltage","power","panel","description"];
let items=[], pendingPhotos=[], viewerPhotos=[], viewerIndex=0;
const photosOf=x=>Array.isArray(x.photos)?x.photos.filter(p=>typeof p==="string"&&p.startsWith("data:image/")).slice(0,3):(x.photo?[x.photo]:[]);
try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");if(Array.isArray(x))items=x;}catch{alert("No se han podido leer los datos locales. Importa tu copia XML si la tienes.");}
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now()+"-"+Math.random().toString(36).slice(2);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items));return true}catch{alert("Almacenamiento lleno. Exporta el XML y reduce fotografías.");return false}};
const toast=m=>{const e=$("#toast");e.textContent=m;e.style.display="block";setTimeout(()=>e.style.display="none",2600)};
const money=v=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(Number(v)||0);
const fmt=d=>{if(!d)return "—";const t=new Date(d);return Number.isNaN(+t)?d:t.toLocaleString("es-ES")};
function render(){const q=$("#search").value.trim().toLocaleLowerCase();$("#cards").replaceChildren();$("#count").textContent=items.length;$("#total").textContent=money(items.reduce((s,x)=>s+(Number(x.price)||0),0));$("#tests").textContent=items.reduce((s,x)=>s+(x.logs||[]).length,0);const found=items.filter(x=>[x.name,x.model,x.shop,x.category,x.description,...(x.logs||[]).map(l=>l.text)].join(" ").toLocaleLowerCase().includes(q)).sort((a,b)=>String(b.created||"").localeCompare(String(a.created||"")));$("#empty").hidden=found.length>0;if(!found.length)$("#empty").textContent=q?"No hay resultados para esta búsqueda.":"Todavía no hay dispositivos. Pulsa «Nuevo dispositivo» para comenzar.";
for(const x of found){const card=document.createElement("article");card.className="card";const pictures=photosOf(x),img=pictures.length?pictures.map((p,i)=>'<button type="button" class="photo-tile" data-action="view-photo" data-id="'+esc(x.id)+'" data-index="'+i+'" aria-label="Ampliar foto '+(i+1)+' de '+pictures.length+'"><img class="photo" alt="Foto '+(i+1)+' del dispositivo" src="'+esc(p)+'"></button>').join(""):'<div class="photo-tile"><div class="placeholder" aria-hidden="true">📷</div></div>';const b=x.batteryCount?x.batteryCount+" × ":"";const battery=x.chemistry&&x.chemistry!=="Sin batería"?b+x.chemistry+(x.batteryFormat?" · "+x.batteryFormat:""):(x.chemistry||"Batería sin especificar");const logs=(x.logs||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(l=>'<tr><td>'+esc(fmt(l.date))+'</td><td>'+esc(l.kind)+'</td><td>'+esc(l.value??"")+(l.value!==undefined&&l.value!==""&&l.unit?" "+esc(l.unit):"")+'</td><td>'+esc(l.text)+'</td><td><button class="secondary" data-action="edit-log" data-id="'+esc(x.id)+'" data-log="'+esc(l.id)+'">Editar</button> <button class="danger" data-action="delete-log" data-id="'+esc(x.id)+'" data-log="'+esc(l.id)+'">Borrar</button></td></tr>').join("");card.innerHTML='<div class="card-body"><h2>'+esc(x.name)+'</h2><span class="category-tag">'+esc(x.category||"Dispositivo")+'</span>'+(x.model?'<span class="meta card-model">'+esc(x.model)+'</span>':'')+'<p class="card-price"><strong>'+esc(money(x.price))+'</strong></p>'+(x.shop?'<p class="meta card-shop">'+esc(x.shop)+'</p>':'')+'<p class="meta">'+esc(battery)+'</p><details><summary>Ficha completa y observaciones ('+(x.logs||[]).length+')</summary><p>'+fields.filter(k=>!["name","category","model","shop","price","chemistry","batteryCount","batteryFormat","description"].includes(k)).map(k=>x[k]?'<strong>'+esc(({purchaseDate:"Compra",dimensions:"Medidas",weight:"Peso (g)",capacity:"Capacidad (mAh)",voltage:"Voltaje (V)",power:"Potencia (W)",panel:"Panel solar"})[k])+':</strong> '+esc(x[k])+'<br>':'').join("")+'</p><p style="white-space:pre-wrap">'+esc(x.description)+'</p><h3>Tabla de pruebas y observaciones</h3>'+(logs?'<div class="table-scroll"><table class="tests-table"><thead><tr><th>Fecha</th><th>Tipo</th><th>Medida</th><th>Observación</th><th>Acciones</th></tr></thead><tbody>'+logs+'</tbody></table></div>':'<p class="hint">Sin pruebas todavía.</p>')+'</details></div><div class="card-photo">'+img+'</div><div class="card-actions"><button data-action="log" data-id="'+esc(x.id)+'">+ Nota</button><button class="secondary" data-action="edit" data-id="'+esc(x.id)+'">Editar</button><button class="danger" data-action="delete" data-id="'+esc(x.id)+'">Eliminar</button></div>';$("#cards").append(card)}}
function openDevice(id){const x=items.find(v=>v.id===id);$("#device-form").reset();$("#editing").value=id||"";$("#dialog-title").textContent=x?"Editar dispositivo":"Nuevo dispositivo";for(const k of fields)$("#device-form").elements.namedItem(k).value=x?.[k]??"";pendingPhotos=x?photosOf(x).slice():[];$("#photo-input").value="";$("#photo-camera").value="";renderEditorPhotos();$("#editor").showModal()}
$("#add").onclick=()=>openDevice("");$("#search").oninput=render;
$("#cards").onclick=e=>{const b=e.target.closest("button[data-action]");if(!b)return;const id=b.dataset.id,action=b.dataset.action,x=items.find(v=>v.id===id);if(!x)return;if(action==="view-photo"){showViewer(photosOf(x),Number(b.dataset.index)||0);return}if(action==="edit")openDevice(id);if(action==="log"||action==="edit-log"){ $("#log-form").reset();$("#log-device").value=id;const old=action==="edit-log"?(x.logs||[]).find(l=>l.id===b.dataset.log):null;$("#log-edit-id").value=old?.id||"";$("#log-title").textContent=old?"Editar prueba":"Nueva prueba";const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());$("#log-date").value=old?.date||d.toISOString().slice(0,16);$("#log-kind").value=old?.kind||"Autonomía";$("#log-value").value=old?.value??"";$("#log-unit").value=old?.unit||"";$("#log-text").value=old?.text||"";$("#log-dialog").showModal()}if(action==="delete"&&confirm("¿Eliminar esta ficha y todas sus observaciones?")){items=items.filter(v=>v.id!==id);if(save())render()}if(action==="delete-log"&&confirm("¿Eliminar esta observación?")){x.logs=(x.logs||[]).filter(v=>v.id!==b.dataset.log);if(save())render()}};
document.querySelectorAll(".close").forEach(b=>b.onclick=()=>b.closest("dialog").close());

function renderEditorPhotos(){
 const area=$("#editor-photos");area.replaceChildren();
 pendingPhotos.forEach((photo,i)=>{
  const tile=document.createElement("div");tile.className="editor-photo";
  const img=document.createElement("img");img.src=photo;img.alt="Foto "+(i+1);
  const remove=document.createElement("button");remove.type="button";remove.textContent="✕";remove.setAttribute("aria-label","Quitar foto "+(i+1));
  remove.onclick=()=>{pendingPhotos.splice(i,1);renderEditorPhotos()};
  tile.append(img,remove);area.append(tile);
 });
 $("#photo-status").textContent=pendingPhotos.length+" de 3 fotos";
}
function updateViewer(){
 const img=$("#viewer-image");
 img.src=viewerPhotos[viewerIndex];
 $("#viewer-count").textContent="Foto "+(viewerIndex+1)+" de "+viewerPhotos.length;
 const one=viewerPhotos.length<2;
 $("#viewer-prev").hidden=one;$("#viewer-next").hidden=one;
}
function changeViewer(delta){
 if(viewerPhotos.length<2)return;
 viewerIndex=(viewerIndex+delta+viewerPhotos.length)%viewerPhotos.length;
 updateViewer();
}
function showViewer(pictures,index){
 if(!pictures.length)return;
 viewerPhotos=pictures;viewerIndex=Math.max(0,Math.min(index,pictures.length-1));
 updateViewer();
 if(!$("#photo-viewer").open)$("#photo-viewer").showModal();
}
$("#viewer-close").addEventListener("click",()=>$("#photo-viewer").close());
$("#viewer-prev").addEventListener("click",()=>changeViewer(-1));
$("#viewer-next").addEventListener("click",()=>changeViewer(1));
$("#photo-viewer").addEventListener("click",e=>{
 if(e.target===$("#photo-viewer"))$("#photo-viewer").close();
});
document.addEventListener("keydown",e=>{
 if(!$("#photo-viewer").open)return;
 if(e.key==="ArrowRight"){e.preventDefault();changeViewer(1)}
 else if(e.key==="ArrowLeft"){e.preventDefault();changeViewer(-1)}
});
const viewerStage=$("#viewer-stage");
let dragStart=null;
viewerStage.addEventListener("pointerdown",e=>{
 if(e.target.closest("button")||viewerPhotos.length<2)return;
 dragStart={x:e.clientX,y:e.clientY,id:e.pointerId};
},{passive:true});
viewerStage.addEventListener("pointerup",e=>{
 if(!dragStart||e.pointerId!==dragStart.id)return;
 const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;
 dragStart=null;
 if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)*1.15)changeViewer(dx<0?1:-1);
},{passive:true});
viewerStage.addEventListener("pointercancel",()=>{dragStart=null});
viewerStage.addEventListener("lostpointercapture",()=>{dragStart=null});
async function compressPhoto(f){
 if(!f.type.startsWith("image/"))throw Error("El archivo no es una imagen");
 const im=new Image(),url=URL.createObjectURL(f);
 try{
  await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src=url});
  const scale=Math.min(1,800/Math.max(im.width,im.height));
  const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(im.width*scale));canvas.height=Math.max(1,Math.round(im.height*scale));
  canvas.getContext("2d").drawImage(im,0,0,canvas.width,canvas.height);
  return canvas.toDataURL("image/jpeg",.55);
 }finally{URL.revokeObjectURL(url)}
}
const handlePhoto=async e=>{
 const input=e.target,files=Array.from(input.files||[]);
 if(!files.length)return;
 const remaining=3-pendingPhotos.length;
 if(remaining<=0){alert("Máximo 3 fotos. Elimina una antes de añadir otra.");input.value="";return}
 if(files.length>remaining)alert("Solo se añadirán "+remaining+" foto(s) hasta el máximo de 3.");
 try{
  for(const f of files.slice(0,remaining))pendingPhotos.push(await compressPhoto(f));
  renderEditorPhotos();
 }catch(err){alert("No se ha podido procesar una foto: "+err.message)}
 finally{input.value=""}
};
$("#photo-input").onchange=handlePhoto;
$("#photo-camera").onchange=handlePhoto;
$("#device-form").onsubmit=e=>{e.preventDefault();const form=e.target,id=$("#editing").value,old=items.find(v=>v.id===id),data={id:old?.id||uid(),created:old?.created||new Date().toISOString(),logs:old?.logs||[],photos:pendingPhotos.slice(),photo:""};for(const k of fields)data[k]=form.elements.namedItem(k).value.trim();if(!data.name)return;if(old){const i=items.indexOf(old);items[i]=data}else items.push(data);if(save()){ $("#editor").close();render();toast("Ficha guardada")}};
$("#log-form").onsubmit=e=>{e.preventDefault();const x=items.find(v=>v.id===$("#log-device").value);if(!x)return;x.logs=x.logs||[];const value=$("#log-value").value.trim(),txt=$("#log-text").value.trim();if(!value&&!txt){alert("Introduce una medida o una observación.");return}const id=$("#log-edit-id").value;const data={id:id||uid(),date:$("#log-date").value,kind:$("#log-kind").value,value,unit:$("#log-unit").value,text:txt};const pos=x.logs.findIndex(l=>l.id===id);if(pos>=0)x.logs[pos]=data;else x.logs.push(data);if(save()){$("#log-dialog").close();render();toast("Prueba guardada")}};
function serialize(){const doc=document.implementation.createDocument("","devices",null),root=doc.documentElement;root.setAttribute("version","1");root.setAttribute("exportedAt",new Date().toISOString());for(const x of items){const node=doc.createElement("device");root.append(node);for(const k of ["id","created",...fields,"photo"]){const el=doc.createElement(k);el.textContent=String(x[k]??"");node.append(el)}const photoList=doc.createElement("photos");node.append(photoList);for(const p of photosOf(x)){const el=doc.createElement("image");el.textContent=p;photoList.append(el)}const logs=doc.createElement("logs");node.append(logs);for(const l of x.logs||[]){const el=doc.createElement("log");logs.append(el);for(const k of ["id","date","kind","value","unit","text"]){const f=doc.createElement(k);f.textContent=String(l[k]??"");el.append(f)}}}return new XMLSerializer().serializeToString(doc)}
$("#export").onclick=()=>{const xml='<?xml version="1.0" encoding="UTF-8"?>\n'+serialize(),url=URL.createObjectURL(new Blob([xml],{type:"application/xml;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="devices-backup-"+new Date().toISOString().slice(0,10)+".xml";a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
const child=(n,k)=>Array.from(n.children).find(x=>x.tagName===k)?.textContent||"";
$("#import").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>30*1024*1024)throw Error("Archivo superior a 30 MB");const xml=new DOMParser().parseFromString(await file.text(),"application/xml");if(xml.querySelector("parsererror")||xml.documentElement.tagName!=="devices")throw Error("XML no válido para Devices");const incoming=Array.from(xml.documentElement.children).filter(e=>e.tagName==="device").map(n=>{const x={logs:[],photo:child(n,"photo"),photos:[]};for(const k of ["id","created",...fields])x[k]=child(n,k);if(!x.name)throw Error("Hay una ficha sin nombre");if(!x.id)x.id=uid();if(x.photo&&!/^data:image\/jpeg;base64,/.test(x.photo))x.photo="";const photoNode=Array.from(n.children).find(e=>e.tagName==="photos");x.photos=photoNode?Array.from(photoNode.children).filter(e=>e.tagName==="image").map(e=>e.textContent||"").filter(p=>/^data:image\/jpeg;base64,/.test(p)).slice(0,3):[];if(!x.photos.length&&x.photo)x.photos=[x.photo];x.photo="";const parent=Array.from(n.children).find(e=>e.tagName==="logs");x.logs=parent?Array.from(parent.children).filter(e=>e.tagName==="log").map(l=>({id:child(l,"id")||uid(),date:child(l,"date"),kind:child(l,"kind"),value:child(l,"value"),unit:child(l,"unit"),text:child(l,"text")})):[];return x});if(!confirm("Importar "+incoming.length+" fichas. Aceptar: fusionar sin sobrescribir los IDs existentes. Cancelar: no importar."))return;const ids=new Set(items.map(x=>x.id));let added=0;for(const x of incoming){if(!ids.has(x.id)){items.push(x);ids.add(x.id);added++}}if(save()){render();toast("Importadas "+added+" fichas nuevas")}}catch(err){alert("No se pudo importar: "+err.message)}finally{e.target.value=""}};
render();if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();