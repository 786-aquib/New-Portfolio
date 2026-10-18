import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { constellationThemes } from './content';
import { usePreferences, useVisible } from './ui';
const points=[{x:23,y:62},{x:50,y:32},{x:77,y:62}];
export function Constellation(){
 const [themeIndex,setThemeIndex]=useState(0);const [selected,setSelected]=useState<number[]>([]);
 const root=useRef<HTMLDivElement>(null);const visible=useVisible(root);const {reduce,paused,togglePause}=usePreferences();
 const theme=constellationThemes[themeIndex];const complete=selected.length===3;
 const caption=selected.length?theme.captions[selected[selected.length-1]]:'Every good system starts with a connection. Make three.';
 const choose=(index:number)=>setSelected(v=>v.includes(index)?v:[...v,index]);
 return <div ref={root} className={`constellation ${!reduce&&visible?'is-moving':''} ${complete?'is-complete':''}`} aria-label="Context Constellation">
  <div className="scene-top"><span className="eyebrow"><Sparkles size={11}/> A LITTLE OF HOW I THINK</span><div className="scene-tools"><button className="icon-button" aria-label={paused?'Resume animations':'Pause animations'} onClick={togglePause}>{paused?<Play size={13}/>:<Pause size={13}/>}</button><button className="icon-button" aria-label="Replay constellation" onClick={()=>setSelected([])}><RotateCcw size={13}/></button></div></div>
  <div className="scene-tabs" aria-label="Constellation themes">{constellationThemes.map((t,i)=><button key={t.id} aria-pressed={i===themeIndex} onClick={()=>{setThemeIndex(i);setSelected([])}}>{t.name}</button>)}</div>
  <div className="starfield" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{left:`${(i*37+7)%100}%`,top:`${(i*23+11)%100}%`,animationDelay:`-${i*.31}s`}}/>)}</div>
  <div className="node-field">
   <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="orbit" d="M7 72Q50 -15 93 72M7 76Q50 118 93 76"/><path className="ghost-line" d="M23 62 50 32 77 62 23 62"/>{selected.length>1&&selected.slice(1).map((n,i)=><path key={`${theme.id}-${n}`} className="connected-line" d={`M${points[selected[i]].x} ${points[selected[i]].y} L${points[n].x} ${points[n].y}`}/>)}{complete&&<path className="connected-line final-line" d={`M${points[selected[2]].x} ${points[selected[2]].y} L${points[selected[0]].x} ${points[selected[0]].y}`}/>}</svg>
   {points.map((p,i)=><button key={`${theme.id}-${i}`} className={`constellation-node ${selected.includes(i)?'connected':''}`} style={{left:`${p.x}%`,top:`${p.y}%`}} onClick={()=>choose(i)} aria-pressed={selected.includes(i)} aria-label={`Connect ${theme.nodes[i]}`} data-cursor={selected.includes(i)?'connected':'connect'}><span className="node-dot">{selected.includes(i)?<Check size={12}/>:<span/>}</span><span className="node-label">{theme.nodes[i]}</span><code>{theme.code[i]}</code></button>)}
   <span className="scene-coordinates" aria-hidden="true">CONTEXT / 001<br/>FOLLOW THE THREAD</span>
  </div>
  <div className="scene-bottom"><p role="status" className="scene-caption">{complete?<><span className="connected-indicator"/> A few dots. A bigger picture. <Link to={`/work?project=${theme.work}`}>Explore this work <ArrowUpRight size={12}/></Link></>:<><span className="progress-dots" aria-hidden="true">{[0,1,2].map(n=><i key={n} className={n<selected.length?'filled':''}/>)}</span><span><span className="sr-only">{selected.length} of 3 connected. </span>{caption}</span></>}</p><Link className="scene-skip" to="/work">Explore work <ArrowUpRight size={12}/></Link></div>
 </div>;
}
