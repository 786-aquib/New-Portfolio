import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MotionConfig, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Command, Compass, Copy, Download, Home as HomeIcon, Layers, Mail, Menu, Moon, Pause, Play, Search, Sun, UserRound } from 'lucide-react';
import { Github } from './icons';
import type { LucideIcon } from 'lucide-react';
import { profile, work } from './content';
import { ContactPage, ExperiencePage, Home, NotFound } from './Pages';
import { WorkPage } from './Work';
import { Modal, Preferences, useCopyEmail, usePreferences } from './ui';

const routes=[{to:'/',label:'Home',icon:HomeIcon},{to:'/work',label:'Work',icon:Layers},{to:'/experience',label:'Experience',icon:BriefcaseBusiness},{to:'/contact',label:'Contact',icon:Mail}];
const sections=[{id:'about',label:'About',icon:UserRound},{id:'work',label:'Selected work',icon:Layers},{id:'experience',label:'Experience',icon:BriefcaseBusiness},{id:'skills',label:'Toolkit',icon:Command},{id:'education',label:'Foundations',icon:Compass},{id:'contact',label:'Contact',icon:Mail}];
export default function App(){return <BrowserRouter><Preferences><Shell/></Preferences></BrowserRouter>}
function Shell(){
 const [palette,setPalette]=useState(false);const location=useLocation();const {reduce}=usePreferences();
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!document.querySelector('dialog[open]')||palette)setPalette(v=>!v)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[palette]);
 useEffect(()=>{document.title=location.pathname==='/'?'Aquib Mahmood — Full Stack Engineer':`${location.pathname==='/work'?'Selected work':location.pathname==='/experience'?'Experience':location.pathname==='/contact'?'Contact':'Lost connection'} — Aquib Mahmood`},[location.pathname]);
 useEffect(()=>{
  const frame=requestAnimationFrame(()=>{if(location.hash){document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:document.documentElement.dataset.motion==='reduced'?'instant':'smooth'})}else window.scrollTo({top:0,behavior:'instant'})});
  return()=>cancelAnimationFrame(frame);
 },[location.pathname,location.hash]);
 return <MotionConfig reducedMotion={reduce?'always':'user'}><a className="skip-link" href="#main">Skip to content</a><Header openPalette={()=>setPalette(true)}/><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home openPalette={()=>setPalette(true)}/>}/><Route path="/work" element={<WorkPage/>}/><Route path="/experience" element={<ExperiencePage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer/><SectionRail/>{location.pathname==='/'&&<MarginNotes/>}<Cursor/>{palette&&<Palette onClose={()=>setPalette(false)}/>}</MotionConfig>;
}
function Header({openPalette}:{openPalette:()=>void}){
 const [scrolled,setScrolled]=useState(window.scrollY>10);const [menu,setMenu]=useState(false);const {theme,toggleTheme,paused,togglePause}=usePreferences();
 useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>10);window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll)},[]);
 useEffect(()=>{const query=matchMedia('(min-width: 640px)');const close=()=>{if(query.matches)setMenu(false)};query.addEventListener('change',close);return()=>query.removeEventListener('change',close)},[]);
 return <><header className={`site-header ${scrolled?'floating':''}`}><div className="header-inner"><Link className="wordmark" to="/" aria-label="Aquib home">Aquib<span>✳</span></Link><nav className="desktop-nav" aria-label="Main navigation">{routes.map(r=><NavLink key={r.to} to={r.to} end={r.to==='/'}>{r.label}</NavLink>)}</nav><div className="header-actions"><button className="icon-button" aria-label="Search command palette" onClick={openPalette}><Search size={16}/></button><button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`}>{theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button><button className="icon-button header-pause" onClick={togglePause} aria-label={paused?'Resume animations':'Pause animations'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button><button className="icon-button mobile-menu-button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={menu} onClick={()=>setMenu(true)}><Menu size={18}/></button></div></div></header>{menu&&<Modal className="mobile-dialog" title="Navigation" onClose={()=>setMenu(false)}><nav aria-label="Mobile navigation">{routes.map(r=><NavLink key={r.to} to={r.to} end={r.to==='/'} onClick={()=>setMenu(false)}><span>{r.label}</span><ArrowUpRight size={18}/></NavLink>)}</nav><div className="mobile-menu-foot"><span className="eyebrow">AQUIB MAHMOOD</span><span>Engineer. Explorer. Dot connector.</span></div></Modal>}</>;
}
interface PaletteEntry {id:string;title:string;subtitle:string;group:string;icon:LucideIcon;path?:string;run?:()=>void;href?:string;download?:boolean}
function Palette({onClose}:{onClose:()=>void}){
 const [query,setQuery]=useState('');const [active,setActive]=useState(0);const navigate=useNavigate();const {toggleTheme,theme,togglePause,paused}=usePreferences();const {copy,message}=useCopyEmail();const options=useRef<(HTMLButtonElement|HTMLAnchorElement|null)[]>([]);
 const entries:PaletteEntry[]=[
  ...routes.map(r=>({id:r.to,title:`Go to ${r.label}`,subtitle:r.to==='/'?'The person behind the code':r.to==='/work'?'Case studies, systems and outcomes':r.to==='/experience'?'The journey so far':'A direct line',group:'Navigation',icon:r.icon,path:r.to})),
  ...work.map(w=>({id:w.id,title:w.title,subtitle:w.category,group:'Work',icon:Layers,path:`/work?project=${w.id}`})),
  {id:'theme',title:`Switch to ${theme==='dark'?'light':'dark'} theme`,subtitle:'A different point of view',group:'Actions',icon:theme==='dark'?Sun:Moon,run:()=>{toggleTheme();onClose()}},
  {id:'copy',title:'Copy email address',subtitle:profile.email,group:'Actions',icon:Copy,run:()=>void copy()},
  {id:'resume',title:'Download résumé',subtitle:'The one-page version',group:'Actions',icon:Download,href:profile.resume,download:true},
  {id:'pause',title:paused?'Resume animations':'Pause animations',subtitle:'Set your own pace',group:'Actions',icon:paused?Play:Pause,run:()=>{togglePause();onClose()}},
 ];
 const filtered=entries.filter(e=>`${e.title} ${e.subtitle}`.toLowerCase().includes(query.toLowerCase()));
 useEffect(()=>{options.current[active]?.scrollIntoView({block:'nearest'})},[active]);
 const select=(entry:PaletteEntry)=>{if(entry.path){onClose();navigate(entry.path)}else entry.run?.()};
 return <Modal title="Command palette" onClose={onClose} className="palette-dialog" initialFocus="input"><div className="palette-search"><Search size={19}/><input aria-label="Search pages, work, or actions" placeholder="Search pages, work, or actions…" value={query} onChange={e=>{setQuery(e.target.value);setActive(0)}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(i=>filtered.length?(i+1)%filtered.length:0)}if(e.key==='ArrowUp'){e.preventDefault();setActive(i=>filtered.length?(i-1+filtered.length)%filtered.length:0)}if(e.key==='Enter'){e.preventDefault();options.current[active]?.click()}}} role="combobox" aria-controls="palette-results" aria-expanded="true" aria-autocomplete="list" aria-activedescendant={filtered[active]?`command-${filtered[active].id}`:undefined}/><kbd>ESC</kbd></div><div className="palette-results" role="listbox" id="palette-results" aria-label="Commands">{filtered.length?filtered.map((entry,index)=>{const Icon=entry.icon;const content=<><span className="palette-icon"><Icon size={17}/></span><span><b>{entry.title}</b><small>{entry.subtitle}</small></span>{active===index&&<ArrowRight className="palette-enter" size={14}/>}</>;return <div key={entry.id}>{(index===0||filtered[index-1].group!==entry.group)&&<div className="palette-group eyebrow">{entry.group}</div>}{entry.href?<a ref={node=>{options.current[index]=node}} id={`command-${entry.id}`} href={entry.href} download={entry.download} role="option" aria-selected={active===index} className="palette-option" onFocus={()=>setActive(index)} onClick={onClose}>{content}</a>:<button ref={node=>{options.current[index]=node}} id={`command-${entry.id}`} role="option" aria-selected={active===index} className="palette-option" onFocus={()=>setActive(index)} onClick={()=>select(entry)}>{content}</button>}</div>}):<div className="empty-state"><Search size={22}/><p>No matching connections. Try another search.</p></div>}</div><div className="palette-footer"><span>↑ ↓ navigate <span>↵ select</span></span><span role="status">{message||'A shortcut to somewhere good.'}</span></div></Modal>;
}
function SectionRail(){
 const {pathname}=useLocation();const [active,setActive]=useState('');
 useEffect(()=>{if(pathname!=='/')return;const update=()=>{let found='';for(const section of sections){const node=document.getElementById(section.id);if(node&&node.getBoundingClientRect().top<220)found=section.id}setActive(found)};update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[pathname]);
 return pathname==='/'?<aside className="section-rail"><span className="rail-title eyebrow">ON THIS PAGE</span><nav aria-label="On this page">{sections.map(({id,label,icon:Icon})=><Link key={id} to={`/#${id}`} aria-label={label} aria-current={active===id?'location':undefined}><Icon size={15}/><span>{label}</span><i/></Link>)}</nav></aside>:null;
}
function MarginNotes(){return <div className="margin-notes" aria-hidden="true"><div className="margin-note note-one"><svg viewBox="0 0 130 130"><ellipse cx="65" cy="65" rx="58" ry="22" transform="rotate(-35 65 65)"/><ellipse cx="65" cy="65" rx="58" ry="22" transform="rotate(35 65 65)"/><circle cx="65" cy="65" r="4"/><circle cx="24" cy="33" r="3"/></svg><span>less noise,<br/><em>more meaning.</em></span><small>FIELD NOTES / 001</small></div><div className="margin-note note-two"><span>stay<br/><em>curious.</em></span><div className="note-cross">✳</div><small>THERE’S ALWAYS ANOTHER DOT.</small></div></div>}
function Cursor(){
 const {reduce}=usePreferences();const [enabled,setEnabled]=useState(false);const [text,setText]=useState('');const x=useMotionValue(0);const y=useMotionValue(0);const sx=useSpring(x,{stiffness:500,damping:40});const sy=useSpring(y,{stiffness:500,damping:40});
 useEffect(()=>{const query=matchMedia('(hover:hover) and (pointer:fine) and (min-width:1100px)');const update=()=>setEnabled(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
 useEffect(()=>{if(!enabled||reduce)return;const move=(e:globalThis.MouseEvent)=>{const target=e.target instanceof Element?e.target.closest('[data-cursor]'):null;setText(target?.getAttribute('data-cursor')||'');x.set(e.clientX+15);y.set(e.clientY+18)};const leave=()=>setText('');window.addEventListener('mousemove',move);document.addEventListener('mouseleave',leave);return()=>{window.removeEventListener('mousemove',move);document.removeEventListener('mouseleave',leave)}},[enabled,reduce,x,y]);
 return enabled&&!reduce?<motion.span className="custom-cursor" aria-hidden="true" style={{x:sx,y:sy,opacity:text?1:0}}>{text}</motion.span>:null;
}
function Footer(){
 const [time,setTime]=useState('');const {paused}=usePreferences();
 useEffect(()=>{const update=()=>{if(!document.hidden)setTime(new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Kolkata',hour12:true}).format(new Date()))};update();if(paused)return;const timer=setInterval(update,60000);return()=>clearInterval(timer)},[paused]);
 return <footer className="site-footer column"><div className="footer-thought"><span>✳</span><p>A little curiosity goes a long way.</p><span className="eyebrow">KEEP CONNECTING THE DOTS.</span></div><div className="footer-bottom"><span>Made with thought, by <Link to="/">Aquib Mahmood</Link></span><span><MapPinIcon/> Gurugram, IN <i/> {time||'IST'}</span></div><div className="footer-links"><span>© {new Date().getFullYear()} Aquib Mahmood</span><a href={profile.github} target="_blank" rel="noreferrer"><Github size={12}/> GitHub <ArrowUpRight size={11}/></a><a href={`mailto:${profile.email}`}>Say hello <ArrowUpRight size={11}/></a></div></footer>;
}
function MapPinIcon(){return <Check size={10}/>}
