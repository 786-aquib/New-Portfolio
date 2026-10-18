import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, RefObject, MouseEvent } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Copy, Download, Mail, X } from 'lucide-react';
import { Github, Linkedin } from './icons';
import { profile } from './content';

const PreferenceContext = createContext({theme:'dark',paused:false,reduce:false,toggleTheme:(_event?:MouseEvent<HTMLButtonElement>)=>{},togglePause:()=>{}});
export function Preferences({children}:{children:ReactNode}) {
 const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme==='light'?'light':'dark');
 const [paused,setPaused]=useState(false); const reduced=useReducedMotion(); const reduce=paused||!!reduced;
 useEffect(()=>{document.documentElement.dataset.motion=reduce?'reduced':'full'},[reduce]);
 function toggleTheme(event?:MouseEvent<HTMLButtonElement>) {
  const next=theme==='dark'?'light':'dark';
  const apply=()=>{setTheme(next);document.documentElement.dataset.theme=next;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next==='dark'?'#0a0a0a':'#fcfcfb');try{localStorage.setItem('aquib-theme',next)}catch{/* Storage is optional. */}};
  document.documentElement.style.setProperty('--theme-x',`${event?.clientX||innerWidth/2}px`);
  document.documentElement.style.setProperty('--theme-y',`${event?.clientY||40}px`);
  if(!reduce&&typeof document.startViewTransition==='function'){
   const transition=document.startViewTransition(()=>flushSync(apply));
   void transition.finished.catch(()=>{});
  } else apply();
 }
 return <PreferenceContext.Provider value={{theme,paused,reduce,toggleTheme,togglePause:()=>setPaused(v=>!v)}}>{children}</PreferenceContext.Provider>;
}
export const usePreferences=()=>useContext(PreferenceContext);
export function useVisible<T extends HTMLElement>(ref:RefObject<T|null>) {
 const [visible,setVisible]=useState(false); const [pageVisible,setPageVisible]=useState(!document.hidden);
 useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));observer.observe(node);return()=>observer.disconnect()},[ref]);
 useEffect(()=>{const update=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 return visible&&pageVisible;
}
export function Reveal({children,className=''}:{children:ReactNode;className?:string}) {
 const {reduce}=usePreferences();
 return <motion.div className={className} initial={reduce?false:{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'0px 0px -25px 0px'}} transition={{duration:reduce?0:.55,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
export function Section({id,title,aside,children}:{id?:string;title:string;aside?:ReactNode;children:ReactNode}) {
 return <section id={id} className="section"><div className="section-band"><div className="section-heading column"><h2>{title}</h2>{aside}</div></div><div className="column section-content">{children}</div></section>;
}
export function Modal({title,children,onClose,className='',initialFocus,restoreSelector}:{title:string;children:ReactNode;onClose:()=>void;className?:string;initialFocus?:string;restoreSelector?:string}) {
 const {reduce}=usePreferences();const ref=useRef<HTMLDialogElement>(null);const closeRef=useRef(onClose);closeRef.current=onClose;const id=useId();
 useEffect(()=>{
  const dialog=ref.current;if(!dialog)return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const oldOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';dialog.showModal();
  if(initialFocus)dialog.querySelector<HTMLElement>(initialFocus)?.focus();
  const trap=(event:KeyboardEvent)=>{
   if(event.key!=='Tab')return;
   const focusable=Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
   const first=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  };
  dialog.addEventListener('keydown',trap);
  return()=>{dialog.removeEventListener('keydown',trap);dialog.close();document.documentElement.style.overflow=oldOverflow;
   if(previous?.isConnected)previous.focus({preventScroll:true});
   else if(restoreSelector)document.querySelector<HTMLElement>(restoreSelector)?.focus();
  };
 },[initialFocus,restoreSelector]);
 return createPortal(<dialog ref={ref} className={`dialog ${className}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();closeRef.current()}} onClick={e=>{if(e.target===e.currentTarget)closeRef.current()}}>
   <motion.div className="dialog-panel" initial={reduce?false:{opacity:0,y:25,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={reduce?{duration:0}:{type:"spring",stiffness:300,damping:28}}><header className="dialog-header"><span id={id}>{title}</span><button className="icon-button" aria-label={`Close ${title}`} onClick={onClose}><X size={18}/></button></header>{children}</motion.div>
 </dialog>,document.body);
}
export function useCopyEmail(){
 const [message,setMessage]=useState('');const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const copy=async()=>{clearTimeout(timer.current);try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(profile.email);setMessage('Email copied')}catch{setMessage('Could not copy. Use the email link instead.')}timer.current=setTimeout(()=>setMessage(''),4000)};
 return {copy,message};
}
export function CopyEmail({compact=false}:{compact?:boolean}) {
 const {copy,message}=useCopyEmail();return <span className="copy-wrap"><button className={compact?'icon-button':'button subtle'} onClick={()=>void copy()} aria-label="Copy email address">{message==='Email copied'?<Check size={15}/>:<Copy size={15}/>} {!compact&&(message==='Email copied'?'Copied':'Copy email')}</button><span className="copy-status" role="status">{message}</span></span>;
}
export function SocialLinks({strip=false}:{strip?:boolean}){
 const links=[{label:'GitHub',href:profile.github,icon:Github},{label:'LinkedIn',href:profile.linkedin,icon:Linkedin},{label:'Email',href:`mailto:${profile.email}`,icon:Mail},{label:'Résumé',href:profile.resume,icon:Download}];
 return <div className={strip?'social-strip':'social-links'}>{links.map(({label,href,icon:Icon})=><a key={label} href={href} {...(label==='Résumé'?{download:'Aquib-Mahmood-Resume.pdf'}:label==='Email'?{}:{target:'_blank',rel:'noreferrer'})}><Icon size={16}/><span>{label}</span><ArrowUpRight size={12}/></a>)}</div>;
}
export function Monogram({small=false}:{small?:boolean}){
 return <svg role="img" aria-label="Aquib Mahmood monogram" className={small?'monogram small':'monogram'} viewBox="0 0 80 80"><rect x=".5" y=".5" width="79" height="79" rx="16" fill="var(--chip)" stroke="var(--line)"/><path className="mono-grid" d="M0 20h80M0 40h80M0 60h80M20 0v80M40 0v80M60 0v80"/><path d="M12 55 27 23 42 55M18 43h18M43 55V29l9 14 10-14v26" fill="none" stroke="var(--fg)" strokeWidth="1.6" strokeLinejoin="round"/><path d="m27 23 35 6M27 23l-9 20" fill="none" stroke="var(--accent)" strokeWidth=".7" strokeDasharray="2 3"/><circle cx="27" cy="23" r="3" fill="var(--accent)"/><circle cx="62" cy="29" r="2" fill="var(--accent)"/></svg>;
}
