import{useEffect,useState}from'react';
import axios from'axios';

const API='http://localhost:3001';
const USER_ID='guest';
const REMOVED_IDS=['6','9','12'];
const HERO_IMAGE='https://images.pexels.com/photos/36149923/pexels-photo-36149923/free-photo-of-ancient-marble-bust-on-black-background.jpeg';
const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);

export default function App(){
const[sculptures,setSculptures]=useState([]);
const[cart,setCart]=useState([]);
const[wishlist,setWishlist]=useState([]);
const[search,setSearch]=useState('');
const[loading,setLoading]=useState(true);
const[message,setMessage]=useState('');

useEffect(()=>{
const loadData=async()=>{
try{
const[sculpturesRes,cartRes,wishlistRes]=await Promise.all([
axios.get(`${API}/sculptures`),
axios.get(`${API}/cart`),
axios.get(`${API}/wishlist`)
]);
setSculptures(sculpturesRes.data.filter(item=>!REMOVED_IDS.includes(String(item.id))));
setCart(cartRes.data);
setWishlist(wishlistRes.data);
}catch(error){
console.error('Unable to load sculpture collection:',error);
setMessage('Unable to connect to the collection server. Please check that JSON Server is running.');
}finally{
setLoading(false);
}
};
loadData();
},[]);

const filteredSculptures=sculptures.filter(item=>`${item.name} ${item.description||''} ${item.category||''}`.toLowerCase().includes(search.toLowerCase()));

const addToCart=async item=>{
try{
const existing=cart.find(entry=>String(entry.productId)===String(item.id)&&entry.userId===USER_ID);
if(existing){
await axios.patch(`${API}/cart/${existing.id}`,{quantity:(existing.quantity||1)+1});
setCart(previous=>previous.map(entry=>entry.id===existing.id?{...entry,quantity:(entry.quantity||1)+1}:entry));
}else{
const response=await axios.post(`${API}/cart`,{userId:USER_ID,productId:item.id,name:item.name,price:item.price,image:item.image,quantity:1});
setCart(previous=>[...previous,response.data]);
}
setMessage(`${item.name} added to your cart.`);
}catch(error){
console.error(error);
setMessage('Could not add this sculpture to your cart.');
}
};

const toggleWishlist=async item=>{
try{
const existing=wishlist.find(entry=>String(entry.productId)===String(item.id)&&entry.userId===USER_ID);
if(existing){
await axios.delete(`${API}/wishlist/${existing.id}`);
setWishlist(previous=>previous.filter(entry=>entry.id!==existing.id));
setMessage('Removed from wishlist.');
}else{
const response=await axios.post(`${API}/wishlist`,{userId:USER_ID,productId:item.id,name:item.name,price:item.price,image:item.image});
setWishlist(previous=>[...previous,response.data]);
setMessage('Added to wishlist.');
}
}catch(error){
console.error(error);
setMessage('Could not update your wishlist.');
}
};

return(
<div className="min-h-screen bg-[#080808] text-white">
<header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur-md">
<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
<a href="#" className="text-xl font-light tracking-[0.35em]">SIVK <span className="text-white/40">SCULPT</span></a>
<nav className="flex items-center gap-5 text-xs uppercase tracking-[0.2em] text-white/65 sm:gap-8">
<a href="#collection" className="transition hover:text-white">Collection</a>
<a href="#story" className="hidden transition hover:text-white sm:block">Our Story</a>
<a href="#collection" className="transition hover:text-white">Cart ({cart.reduce((total,item)=>total+(item.quantity||1),0)})</a>
<a href="#collection" className="transition hover:text-white">Wishlist ({wishlist.length})</a>
</nav>
</div>
</header>

<main>
<section className="relative isolate flex min-h-[580px] items-center overflow-hidden border-b border-white/10 md:min-h-[690px]">
<div className="absolute inset-0 -z-20 bg-[#101010]"/>
<div className="absolute inset-0 -z-10 bg-cover bg-[center_35%] grayscale" style={{backgroundImage:`url("${HERO_IMAGE}")`}}/>
<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,.45)_40%,rgba(8,8,8,.05)_100%)]"/>
<div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080808]/35 via-transparent to-[#080808]/5"/>
<div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
<p className="mb-6 text-xs uppercase tracking-[0.5em] text-white/65">The Art of Stillness</p>
<h1 className="max-w-3xl text-5xl font-extralight uppercase leading-[1.08] tracking-[0.12em] sm:text-7xl lg:text-8xl">Timeless<br/>Sculptures.</h1>
<p className="mt-7 max-w-md text-sm leading-7 text-white/75 sm:text-base">Where stone becomes emotion and silence becomes art. Discover sculptures crafted to exist beyond time.</p>
<a href="#collection" className="mt-10 inline-flex border border-white/50 px-8 py-4 text-xs uppercase tracking-[0.3em] transition hover:bg-white hover:text-black">Explore Collection <span className="ml-5">↗</span></a>
</div>
<div className="absolute bottom-8 right-8 hidden text-right text-[10px] uppercase tracking-[0.3em] text-white/55 md:block">Form / Emotion / Eternity<br/>Sculpture Collection</div>
</section>

<section id="collection" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
<div className="mx-auto mb-12 flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-end">
<div>
<p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/45">Curated Artworks</p>
<h2 className="text-3xl font-light uppercase tracking-[0.2em] sm:text-4xl">The Collection</h2>
<p className="mt-4 text-sm text-white/45">Objects of beauty. Pieces of permanence.</p>
</div>
<div className="w-full md:max-w-xs">
<input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search sculptures..." className="w-full border-b border-white/25 bg-transparent px-1 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/70"/>
</div>
</div>

{message&&<div className="mx-auto mb-8 max-w-6xl border border-white/15 px-5 py-3 text-sm text-white/70">{message}<button onClick={()=>setMessage('')} className="float-right ml-4 text-white">×</button></div>}

{loading?<p className="py-20 text-center text-sm tracking-widest text-white/50">LOADING COLLECTION...</p>:filteredSculptures.length===0?<p className="py-20 text-center text-sm text-white/50">No sculptures found.</p>:<div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
{filteredSculptures.map(item=>{
const isWishlisted=wishlist.some(entry=>String(entry.productId)===String(item.id)&&entry.userId===USER_ID);
return(
<article key={item.id} className="group">
<div className="relative aspect-[4/5] overflow-hidden bg-[#151515]">
{item.image?<img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105"/>:<div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-white/30">Image Unavailable</div>}
<button onClick={()=>toggleWishlist(item)} aria-label="Toggle wishlist" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/25 bg-black/50 text-lg transition hover:bg-white hover:text-black">{isWishlisted?'♥':'♡'}</button>
<div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/85 p-4 transition duration-300 group-hover:translate-y-0">
<button onClick={()=>addToCart(item)} className="w-full border border-white/50 py-3 text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-black">Add to Cart +</button>
</div>
</div>
<div className="flex items-start justify-between gap-4 pt-5">
<div>
<h3 className="text-sm uppercase tracking-[0.15em]">{item.name}</h3>
<p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">{item.description||item.category||'A timeless sculptural artwork.'}</p>
</div>
<p className="shrink-0 text-sm text-white/80">{money(Number(item.price)||0)}</p>
</div>
</article>
);
})}
</div>}
</section>

<section id="story" className="border-y border-white/10 bg-[#101010] px-6 py-20 md:py-28">
<div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-20">
<div>
<p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/45">Beyond the Material</p>
<h2 className="text-3xl font-extralight uppercase leading-tight tracking-[0.16em] sm:text-5xl">The History<br/>of Sculptures</h2>
</div>
<div className="text-sm leading-8 text-white/55">
<p>Sculpture is one of humanity's oldest forms of expression. Across generations, artists have transformed stone, metal and other materials into forms that preserve stories, emotions and ideas.</p>
<p className="mt-5">At SIVK SCULPT, we celebrate the timeless connection between material, imagination and human expression. Every form tells a story. Every detail holds meaning.</p>
</div>
</div>
</section>
</main>

<footer className="px-6 py-8">
<div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-white/35 sm:flex-row">
<p>SIVK SCULPT © 2026</p>
<p>Art Beyond Time · Form Beyond Words</p>
</div>
</footer>
</div>
);
}