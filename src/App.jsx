import{useState}from"react";
function App(){
const[menu,setMenu]=useState(false);
return <div className="min-h-screen bg-[#11100f] text-[#f4efe6] selection:bg-[#b18a55] selection:text-black">

<header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#11100f]/90 px-6 py-5 backdrop-blur-xl md:px-16">
<a href="#" className="text-xl font-semibold tracking-[0.25em] md:text-2xl">SIVK <span className="font-light text-[#b18a55]">SCULPT</span></a>
<nav className="hidden items-center gap-10 text-xs uppercase tracking-[0.2em] text-white/70 md:flex">
<a href="#home" className="transition hover:text-[#b18a55]">Home</a><a href="#collection" className="transition hover:text-[#b18a55]">Collection</a><a href="#story" className="transition hover:text-[#b18a55]">Our Story</a>
</nav>
<div className="flex items-center gap-5"><button aria-label="Search" className="text-xl hover:text-[#b18a55]">⌕</button><button aria-label="Shopping bag" className="text-xl hover:text-[#b18a55]">♧</button><button onClick={()=>setMenu(!menu)} className="text-2xl md:hidden">☰</button></div>
{menu&&<nav className="absolute left-0 top-full flex w-full flex-col gap-5 border-t border-white/10 bg-[#11100f] p-6 text-sm uppercase tracking-widest md:hidden"><a href="#home" onClick={()=>setMenu(false)}>Home</a><a href="#collection" onClick={()=>setMenu(false)}>Collection</a><a href="#story" onClick={()=>setMenu(false)}>Our Story</a></nav>}
</header>
<main>
<section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-32 md:px-16">
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(177,138,85,0.15),transparent_45%)]"></div>
<div className="relative z-10 max-w-2xl">
<p className="mb-7 text-xs uppercase tracking-[0.4em] text-[#b18a55]">The Art of Timeless Beauty</p>
<h1 className="text-5xl font-light leading-[1.12] tracking-tight sm:text-6xl md:text-8xl">Sculpting<br/> <span className="font-serif italic text-[#b18a55]">Elegance</span><br/>Into Existence.</h1>
<p className="mt-8 max-w-md text-sm leading-7 text-white/55 md:text-base">Discover extraordinary sculptures that transform spaces into timeless expressions of art, emotion and craftsmanship.</p>
<div className="mt-10 flex flex-wrap items-center gap-5"><a href="#collection" className="bg-[#b18a55] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d0ad79]">Explore Collection ↗</a><a href="#story" className="border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:border-[#b18a55]">Our Philosophy</a></div>
<div className="mt-16 flex gap-12 border-t border-white/10 pt-7"><div><p className="text-2xl font-light">01</p><p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">Artistry</p></div><div><p className="text-2xl font-light">∞</p><p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">Expression</p></div><div><p className="text-2xl font-light">100%</p><p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">Passion</p></div></div>
</div>
<div className="pointer-events-none absolute bottom-16 right-10 hidden text-[10px] uppercase tracking-[0.4em] text-white/30 [writing-mode:vertical-rl] lg:block">Art That Speaks Beyond Words</div>
</section>
<section id="collection" className="px-6 py-24 md:px-16 md:py-32">
<div className="mb-12 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#b18a55]">Curated For You</p><h2 className="text-4xl font-light md:text-6xl">The Collection<span className="text-[#b18a55]">.</span></h2></div><p className="max-w-sm text-sm leading-6 text-white/45">Objects of meaning. Forms of beauty. Pieces that make a space unforgettable.</p></div>
<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
{[{name:"The Eternal Form",type:"Abstract Sculpture",image:"photo-1579783902614-a3fb3927b6a5"},{name:"Silent Contemplation",type:"Classical Art",image:"photo-1577083552431-6e5fd01aa342"},{name:"Modern Muse",type:"Contemporary Sculpture",image:"photo-1578301978693-85fa9c0320b9"}].map((item,i)=><article key={item.name} className="group"><div className="relative aspect-[4/5] overflow-hidden bg-[#201e1b]"><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=85`} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute left-4 top-4 bg-black/60 px-3 py-2 text-[9px] uppercase tracking-widest backdrop-blur">{i===0?"Featured":i===1?"Timeless":"Modern"}</span><button aria-label={`View ${item.name}`} className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center bg-[#b18a55] text-xl text-black transition hover:bg-white">↗</button></div><div className="flex items-center justify-between py-5"><div><h3 className="text-lg font-light">{item.name}</h3><p className="mt-1 text-xs text-white/40">{item.type}</p></div><span className="text-xs tracking-widest text-[#b18a55]">0{i+1}</span></div></article>)}
</div>
<div className="mt-12 text-center"><button className="border border-white/20 px-9 py-4 text-xs uppercase tracking-[0.2em] transition hover:border-[#b18a55] hover:text-[#b18a55]">Discover All Pieces ↗</button></div>
</section>
<section id="story" className="border-y border-white/10 bg-[#181614] px-6 py-24 md:px-16 md:py-32"><div className="mx-auto max-w-3xl text-center"><p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#b18a55]">Beyond The Ordinary</p><h2 className="text-4xl font-light leading-tight md:text-6xl">Art is not merely seen.<br/><span className="font-serif italic text-[#b18a55]">It is felt.</span></h2><p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/50 md:text-base">At SIVK SCULPT, we believe every form tells a story. Our collection celebrates the beauty of detail, the power of imagination and the lasting connection between art and the human spirit.</p><a href="#collection" className="mt-9 inline-block border-b border-[#b18a55] pb-2 text-xs uppercase tracking-[0.2em] text-[#b18a55]">Find Your Statement Piece ↗</a></div></section>
<section className="px-6 py-20 text-center md:px-16"><p className="text-xs uppercase tracking-[0.35em] text-[#b18a55]">A World Of Art Awaits</p><h2 className="mx-auto mt-5 max-w-2xl text-3xl font-light leading-tight md:text-5xl">Bring home something that speaks to you.</h2><a href="#collection" className="mt-8 inline-block bg-[#b18a55] px-8 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-[#d0ad79]">Explore the Art</a></section>
</main>
<footer className="border-t border-white/10 px-6 py-8 md:px-16"><div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"><a href="#home" className="text-lg tracking-[0.2em]">SIVK <span className="text-[#b18a55]">SCULPT</span></a><p className="text-xs text-white/35">Art that speaks beyond words. © 2026 SIVK SCULPT.</p><a href="#home" className="text-xs text-white/50 transition hover:text-[#b18a55]">Back to top ↑</a></div></footer>
</div>
}
export default App;
