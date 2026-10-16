import{useEffect,useState}from'react'
import axios from'axios'

const API='http://localhost:3001'
const USER_ID='guest'
const REMOVED_IDS=['6','9','12']
const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value)

export default function App(){
const[sculptures,setSculptures]=useState([])
const[cart,setCart]=useState([])
const[wishlist,setWishlist]=useState([])
const[search,setSearch]=useState('')
const[category,setCategory]=useState('All')
const[view,setView]=useState('collection')
const[loading,setLoading]=useState(true)
const[error,setError]=useState('')
const[message,setMessage]=useState('')

useEffect(()=>{
const load=async()=>{
try{
const[products,cartData,wishlistData]=await Promise.all([axios.get(`${API}/sculptures`),axios.get(`${API}/cart`),axios.get(`${API}/wishlist`)])
setSculptures(products.data.filter(item=>!REMOVED_IDS.includes(String(item.id))))
setCart(cartData.data.filter(item=>String(item.userId)===USER_ID&&!REMOVED_IDS.includes(String(item.sculptureId))))
setWishlist(wishlistData.data.filter(item=>String(item.userId)===USER_ID&&!REMOVED_IDS.includes(String(item.sculptureId))))
}catch{
setError('Unable to connect to the database. Make sure JSON Server is running on port 3001.')
}finally{
setLoading(false)
}
}
load()
},[])

const addToCart=async product=>{
try{
const existing=cart.find(item=>String(item.sculptureId)===String(product.id))
if(existing){
const response=await axios.patch(`${API}/cart/${existing.id}`,{quantity:Number(existing.quantity||1)+1})
setCart(previous=>previous.map(item=>item.id===existing.id?response.data:item))
}else{
const response=await axios.post(`${API}/cart`,{userId:USER_ID,sculptureId:String(product.id),quantity:1})
setCart(previous=>[...previous,response.data])
}
setMessage(`${product.name} added to cart`)
}catch{
setMessage('Could not add this sculpture to your cart.')
}
}

const toggleWishlist=async product=>{
try{
const existing=wishlist.find(item=>String(item.sculptureId)===String(product.id))
if(existing){
await axios.delete(`${API}/wishlist/${existing.id}`)
setWishlist(previous=>previous.filter(item=>item.id!==existing.id))
setMessage('Removed from wishlist')
}else{
const response=await axios.post(`${API}/wishlist`,{userId:USER_ID,sculptureId:String(product.id)})
setWishlist(previous=>[...previous,response.data])
setMessage('Added to wishlist')
}
}catch{
setMessage('Could not update your wishlist.')
}
}

const removeFromCart=async item=>{
try{
await axios.delete(`${API}/cart/${item.id}`)
setCart(previous=>previous.filter(product=>product.id!==item.id))
setMessage('Item removed from cart')
}catch{
setMessage('Could not remove this item.')
}
}

const filtered=sculptures.filter(item=>(category==='All'||item.category===category)&&item.name.toLowerCase().includes(search.toLowerCase()))
const cartProducts=cart.map(item=>({...item,product:sculptures.find(product=>String(product.id)===String(item.sculptureId))})).filter(item=>item.product)
const wishlistProducts=wishlist.map(item=>({...item,product:sculptures.find(product=>String(product.id)===String(item.sculptureId))})).filter(item=>item.product)
const total=cartProducts.reduce((sum,item)=>sum+item.product.price*Number(item.quantity||1),0)
const heroSculpture=sculptures.find(item=>item.image)

return(

<div className="min-h-screen bg-[#080808] text-[#ededed]">
<header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur-xl">
<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 md:px-10">
<a href="#" onClick={()=>setView('collection')} className="text-xl tracking-[.28em]">SIVK <span className="text-neutral-500">SCULPT</span></a>
<nav className="hidden items-center gap-8 text-xs uppercase tracking-[.2em] text-neutral-400 md:flex">
<a href="#collection" onClick={()=>setView('collection')} className="transition hover:text-white">Collection</a>
<a href="#about" className="transition hover:text-white">Our Philosophy</a>
</nav>
<div className="flex gap-2 text-xs uppercase tracking-wider sm:gap-4">
<button onClick={()=>setView(view==='wishlist'?'collection':'wishlist')} className="hover:text-neutral-400">Wishlist ({wishlist.length})</button>
<button onClick={()=>setView(view==='cart'?'collection':'cart')} className="hover:text-neutral-400">Cart ({cart.reduce((sum,item)=>sum+Number(item.quantity||1),0)})</button>
</div>
</div>
</header>

<section className="relative isolate flex min-h-[580px] items-center overflow-hidden border-b border-white/10 md:min-h-[690px]">
<div className="absolute inset-0 -z-20 bg-[#101010]"/>
<div className="absolute inset-0 -z-10 bg-cover bg-[center_35%] opacity-45 grayscale" style={{backgroundImage:heroSculpture?.image?`url("${heroSculpture.image}")`:'none'}}/>
<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,.88)_35%,rgba(8,8,8,.35)_100%)]"/>
<div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080808]/80 via-transparent to-[#080808]/20"/>
<div className="mx-auto w-full max-w-7xl px-5 py-24 md:px-10 md:py-32">
<p className="mb-6 text-xs uppercase tracking-[.45em] text-neutral-400">The miniature sculpture collection</p>
<h1 className="font-serif text-[clamp(4.5rem,14vw,12rem)] font-light leading-[.78] tracking-[-.065em] text-white">STATUES</h1>
<div className="mt-10 max-w-lg border-l border-neutral-500 pl-5">
<p className="text-sm leading-7 text-neutral-300 md:text-base">Timeless forms. Sculpted in miniature.</p>
<p className="mt-2 text-sm leading-7 text-neutral-500">Discover silver-gray sculptures inspired by classical art and designed for your space.</p>
</div>
<a href="#collection" onClick={()=>setView('collection')} className="mt-10 inline-flex border border-white/40 px-7 py-4 text-xs uppercase tracking-[.22em] transition hover:bg-white hover:text-black">Explore the collection <span className="ml-8">↗</span></a>
<div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[10px] uppercase tracking-[.2em] text-neutral-500"><span>Silver / Gray</span><span>Miniature Art</span><span>Timeless Forms</span></div>
</div>
<div className="pointer-events-none absolute bottom-8 right-8 hidden text-right text-[10px] uppercase leading-6 tracking-[.2em] text-neutral-500 md:block">SIVK ATELIER<br/>OBJECTS OF ART</div>
</section>

<main id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
<div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
<div>
<p className="mb-4 text-[10px] uppercase tracking-[.35em] text-neutral-500">Curated objects / 001—009</p>
<h2 className="font-serif text-5xl font-light md:text-7xl">{view==='cart'?'Your Cart':view==='wishlist'?'Your Wishlist':'The Collection'}</h2>
<p className="mt-4 max-w-lg text-sm leading-7 text-neutral-500">{view==='cart'?'Your selected miniature sculptures.':view==='wishlist'?'The sculptures you have saved for later.':'Small in scale. Timeless in character.'}</p>
</div>
{view==='collection'&&<div className="flex flex-col gap-3 sm:flex-row">
<input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search sculptures..." className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-600 focus:border-neutral-400 sm:w-56"/>
<select value={category} onChange={event=>setCategory(event.target.value)} className="border border-white/15 bg-[#111] px-4 py-3 text-sm text-neutral-300 outline-none focus:border-neutral-400">
{['All','Busts','Classical','Figurines','Modern'].map(item=><option key={item}>{item}</option>)}
</select>
</div>}
</div>

{message&&<div className="mb-6 flex items-center justify-between border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-neutral-300"><span>{message}</span><button onClick={()=>setMessage('')} aria-label="Dismiss message">×</button></div>}
{error&&<div className="mb-8 border border-red-900/60 bg-red-950/20 p-5 text-sm text-red-300">{error}</div>}
{loading?<p className="py-20 text-center text-sm text-neutral-500">Loading the collection...</p>:view==='cart'?(

<div className="space-y-5">
{cartProducts.length===0?<p className="py-20 text-center text-neutral-500">Your cart is empty.</p>:cartProducts.map(item=><div key={item.id} className="flex flex-col gap-5 border-b border-white/10 py-5 sm:flex-row sm:items-center">
<img src={item.product.image} alt={item.product.name} className="h-32 w-28 bg-[#151515] object-cover grayscale"/>
<div className="flex-1"><h3 className="font-serif text-2xl">{item.product.name}</h3><p className="mt-2 text-xs text-neutral-500">{item.product.material} · Qty {item.quantity||1}</p><p className="mt-3 text-sm">{money(item.product.price*Number(item.quantity||1))}</p></div>
<button onClick={()=>removeFromCart(item)} className="self-start text-xs uppercase tracking-wider text-neutral-500 hover:text-white">Remove</button>
</div>)}
{cartProducts.length>0&&<div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center"><p className="text-xs uppercase tracking-[.2em] text-neutral-500">Subtotal <span className="ml-4 text-lg tracking-normal text-white">{money(total)}</span></p><button onClick={()=>setMessage('Checkout will be connected when the order flow is implemented.')} className="bg-white px-7 py-4 text-xs uppercase tracking-[.2em] text-black transition hover:bg-neutral-300">Continue to checkout ↗</button></div>}
</div>
):(
<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
{(view==='wishlist'?wishlistProducts.map(item=>item.product):filtered).map((product,index)=><article key={product.id} className="group min-w-0">
<div className="relative overflow-hidden bg-[#111]">
<div className="absolute left-4 top-4 z-10 text-[9px] uppercase tracking-[.2em] text-neutral-400">{String(index+1).padStart(2,'0')} / SCULPTURE</div>
<button onClick={()=>toggleWishlist(product)} aria-label="Toggle wishlist" className="absolute right-4 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-lg transition hover:bg-white hover:text-black">{wishlist.some(item=>String(item.sculptureId)===String(product.id))?'♥':'♡'}</button>
<div className="aspect-[4/5] overflow-hidden">
<img src={product.image} alt={product.name} loading="lazy" onError={event=>{event.currentTarget.style.display='none';event.currentTarget.parentElement.classList.add('flex','items-center','justify-center');event.currentTarget.parentElement.innerHTML='<span class="px-6 text-center text-xs uppercase tracking-[.2em] text-neutral-500">Sculpture image unavailable</span>'}} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.04]"/>
</div>
<div className="absolute bottom-4 left-4 border border-white/20 bg-black/60 px-3 py-2 text-[10px] uppercase tracking-[.15em] text-neutral-300">{product.size||'Miniature'}</div>
</div>
<div className="flex items-start justify-between gap-4 pt-5">
<div className="min-w-0"><p className="mb-2 text-[9px] uppercase tracking-[.25em] text-neutral-500">{product.category} · {product.material}</p><h3 className="font-serif text-2xl font-light sm:text-3xl">{product.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-6 text-neutral-500">{product.description}</p></div>
<p className="shrink-0 pt-1 text-sm">{money(product.price)}</p>
</div>
<button onClick={()=>addToCart(product)} className="mt-5 w-full border border-white/20 px-4 py-4 text-[10px] uppercase tracking-[.2em] transition hover:border-white hover:bg-white hover:text-black">Add to cart <span className="ml-3">+</span></button>
</article>)}
{view==='wishlist'&&wishlistProducts.length===0&&<p className="col-span-full py-20 text-center text-neutral-500">Your wishlist is empty.</p>}
{view==='collection'&&filtered.length===0&&<p className="col-span-full py-20 text-center text-neutral-500">No sculptures found.</p>}
</div>
)}
</main>

<section id="about" className="relative overflow-hidden border-y border-white/10 bg-[#0b0b0b]">
<div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/[.025] blur-3xl"/>
<div className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-36">
<div className="mb-16 flex items-center gap-5">
<span className="h-px w-12 bg-neutral-500"/>
<p className="text-[10px] uppercase tracking-[.4em] text-neutral-500">The SIVK philosophy</p>
<span className="text-[10px] tracking-[.25em] text-neutral-700">001 — 026</span>
</div>
<div className="grid gap-16 lg:grid-cols-[1.2fr_.8fr] lg:gap-24">
<div>
<h2 className="font-serif text-5xl font-light leading-[1.12] tracking-[-.035em] text-neutral-100 sm:text-6xl md:text-8xl">Art that<br/>speaks in<br/><span className="italic text-neutral-500">silence.</span></h2>
<div className="mt-10 flex items-center gap-4">
<span className="h-px w-16 bg-neutral-600"/>
<p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">Beyond the ordinary</p>
</div>
</div>
<div className="flex flex-col justify-center">
<p className="text-lg font-light leading-9 text-neutral-300 md:text-xl md:leading-10">Some forms need no words. Some details deserve to be noticed.</p>
<p className="mt-7 text-sm leading-8 text-neutral-500">SIVK SCULPT celebrates the enduring beauty of classical artistry through miniature sculptures. Inspired by timeless forms and the quiet elegance of stone, each piece brings a sense of character, depth, and refinement into your space.</p>
<p className="mt-5 text-sm leading-8 text-neutral-500">Because art is not measured by its size, but by the feeling it leaves behind.</p>
<div className="mt-12 border-t border-white/10 pt-6">
<div className="flex items-center justify-between gap-4">
<span className="text-[9px] uppercase tracking-[.3em] text-neutral-500">SIVK ATELIER</span>
<span className="font-serif text-sm italic text-neutral-400">Objects of art. Timeless by nature.</span>
</div>
</div>
</div>
</div>
</div>
</section>

<footer className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-10 text-[10px] uppercase tracking-[.2em] text-neutral-500 sm:flex-row sm:px-10"><span>SIVK SCULPT © 2026</span><span>Objects of art / Miniature forms</span><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="text-left hover:text-white sm:text-right">Back to top ↑</button></footer>
</div>
)
}
