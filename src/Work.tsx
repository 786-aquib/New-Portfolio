import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, ArrowRight, Check, Code2, Database, FileText, GitBranch, Globe, Layers, LockKeyhole, Search, Sparkles, X } from 'lucide-react';
import { categories, work } from './content';
import type { Category, WorkId, WorkItem } from './content';
import { Modal, Reveal, Section } from './ui';

export function WorkArt({id,large=false}:{id:WorkId;large?:boolean}){
 return <div className={`work-art art-${id} ${large?'art-large':''}`} role="img" aria-label={id==='payu-codex'?'Illustrated local code retrieval pipeline':id==='payu-products'?'Illustrated merchant checkout configuration':'Illustrated literature review screening workspace'}>
  <span className="art-label">{id==='payu-codex'?'01 / LOCAL INTELLIGENCE':id==='payu-products'?'02 / PRODUCT SYSTEMS':'03 / STRUCTURED EVIDENCE'}</span>
  {id==='payu-codex'?<div className="codex-diagram"><div className="code-window"><div className="window-dots"><i/><i/><i/><span>workspace.py</span></div><code><span className="code-comment"># keep the context. lose the noise.</span><br/><span className="code-purple">from</span> context <span className="code-purple">import</span> meaning<br/><br/><span className="code-blue">search</span>(<span className="code-green">"how does this work?"</span>)<br/><span className="code-comment">↳ 14 repos. one conversation.</span></code></div><div className="pipeline"><div><Code2 size={17}/><span>Code</span></div><span className="pipeline-link"/><div className="pipeline-active"><Sparkles size={18}/><span>Context</span></div><span className="pipeline-link"/><div><GitBranch size={17}/><span>Clarity</span></div></div><span className="local-tag"><LockKeyhole size={10}/> LOCAL BY DESIGN</span></div>:
  id==='payu-products'?<div className="checkout-diagram"><div className="checkout-brand"><span className="brand-symbol">p<span>↗</span></span><span>Made for your brand.</span><i/></div><div className="checkout-input"><span>Brand identity</span><div><i/><i/><i/><span>Extracted with AI <Sparkles size={10}/></span></div></div><div className="checkout-input"><span>Your checkout, configured.</span><div className="mini-lines"><i/><i/></div></div><div className="checkout-button">A better merchant experience <ArrowRight size={12}/></div></div>:
  <div className="research-diagram"><div className="research-top"><span><FileText size={12}/> EasySLR</span><span>SCREENING WORKSPACE</span></div><div className="research-row"><span className="paper-icon"><FileText size={17}/></span><div><b>A clearer path to evidence</b><span>Collect. Review. Decide.</span></div></div><div className="review-states"><span><i/>Pending</span><span><Check size={10}/>Include</span><span><X size={10}/>Exclude</span><span>· Maybe</span></div><div className="research-bottom"><Database size={11}/><span>Organized by project. Grounded in evidence.</span></div></div>}
  <span className="art-registration" aria-hidden="true">+</span>
 </div>;
}
export function WorkCard({item,index}:{item:WorkItem;index:number}){
 const location=useLocation();
 const detailParams=new URLSearchParams(location.pathname==='/work'?location.search:'');
 detailParams.set('project',item.id);
 return <Reveal className={index===0?'work-card-wrap featured-card':'work-card-wrap'}><Link className="work-card" to={`/work?${detailParams}`} aria-label={`Explore ${item.title}`} data-work-id={item.id} data-cursor="explore work">
   <WorkArt id={item.id} large={index===0}/><div className="work-card-body"><div className="card-meta"><span>{item.kind}</span><ArrowUpRight size={15}/></div><h3>{item.title}</h3><p>{item.summary}</p><div className="stack-chips">{item.stack.slice(0,index===0?6:4).map(s=><span key={s}>{s}</span>)}</div><div className="card-result"><strong>{item.metric}</strong><span>{item.metricLabel}</span><ArrowUpRight size={15}/></div></div>
 </Link></Reveal>;
}
export function SelectedWork(){
 return <Section id="work" title="Selected work" aside={<Link className="text-link" to="/work">All work <ArrowUpRight size={12}/></Link>}><div className="section-intro"><p>A few things I’ve helped bring to life.</p><span className="eyebrow">01 — 03</span></div><div className="work-grid">{work.map((item,index)=><WorkCard key={item.id} item={item} index={index}/>)}</div></Section>;
}
export function WorkPage(){
 const [params,setParams]=useSearchParams();const query=params.get('search')||'';
 const rawCategory=params.get('category');const category:Category=categories.find(c=>c===rawCategory)||'All';
 const selectedId=params.get('project');const selected=work.find(w=>w.id===selectedId);
 const filtered=work.filter(w=>(category==='All'||w.category===category)&&[w.title,w.summary,...w.stack].some(s=>s.toLowerCase().includes(query.toLowerCase())));
 function change(key:string,value:string,replace=false){setParams(previous=>{const next=new URLSearchParams(previous);if(value)next.set(key,value);else next.delete(key);return next},{replace})}
 return <><div className="column page-intro"><span className="eyebrow"><Layers size={12}/> SELECTED CASE STUDIES</span><h1>Work, with a little<br/><em>context.</em></h1><p>Local intelligence. Merchant experiences. Research tools.<br className="desktop-only"/> Different problems, the same attention to detail.</p></div>
 <Section title="The collection" aside={<span className="eyebrow">{filtered.length} / {work.length}</span>}><div className="work-filters"><label className="search-box"><Search size={15}/><span className="sr-only">Search work</span><input aria-label="Search work" value={query} onChange={e=>change('search',e.target.value,true)} placeholder="Search work, ideas, technologies…"/>{query&&<button className="icon-button" aria-label="Clear search" onClick={()=>change('search','',true)}><X size={14}/></button>}</label><div className="filter-buttons" aria-label="Work categories">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>change('category',c==='All'?'':c)}>{c}</button>)}</div></div>
 {selectedId&&!selected&&<div className="empty-state" role="status"><p>This case study couldn’t be found.</p><button className="button" onClick={()=>change('project','')}>Back to the collection</button></div>}
 {filtered.length?<div className="work-grid">{filtered.map((item,i)=><WorkCard key={item.id} item={item} index={i}/>)}</div>:<div className="empty-state"><Search size={24}/><h3>No connections yet.</h3><p>No work matches these filters. Try another word or start fresh.</p><button className="button" onClick={()=>setParams(selectedId?{project:selectedId}:{})}>Reset filters <ArrowDown size={14}/></button></div>}
 </Section>{selected&&<WorkDetails item={selected} onClose={()=>change('project','')}/>}</>;
}
function WorkDetails({item,onClose}:{item:WorkItem;onClose:()=>void}){
 return <Modal title={`${item.title} — case study`} onClose={onClose} className="work-dialog" restoreSelector={`[data-work-id="${item.id}"]`}>
  <div className="modal-scroll"><WorkArt id={item.id} large/><div className="case-body"><span className="eyebrow">{item.kind} <span>/</span> {item.year}</span><h2>{item.title}</h2><p className="case-subtitle">{item.subtitle}</p><p className="case-summary">{item.summary}</p>
   {(item.source||item.demo)&&<div className="button-row">{item.demo&&<a className="button primary" href={item.demo} target="_blank" rel="noreferrer">Live project <Globe size={14}/></a>}{item.source&&<a className="button" href={item.source} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={14}/></a>}</div>}
   {item.sections.map(s=><section className="case-section" key={s.title}><h3>{s.title}</h3><p>{s.body}</p></section>)}
   <section className="case-section"><h3>What changed</h3><ul className="outcomes">{item.outcomes.map(o=><li key={o}><Check size={14}/><span>{o}</span></li>)}</ul></section>
   <section className="case-section"><h3>The toolkit</h3><div className="stack-chips">{item.stack.map(s=><span key={s}>{s}</span>)}</div></section>
   <div className="case-foot"><span className="eyebrow">{item.kind.startsWith('Employer')?'EMPLOYER WORK · ORIGINAL ILLUSTRATION':'ARTICLE-REVIEW-WORKSPACE'}</span><button className="button" onClick={onClose}>Back to work <ArrowRight size={14}/></button></div>
  </div></div>
 </Modal>;
}
