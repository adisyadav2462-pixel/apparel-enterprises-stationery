
const PRODUCTS = [
 {id:"stationery",name:"Complete Stationery Essentials",price:499,desc:"Real office stationery collection with pens, scissors, files, notebooks, tape and desk accessories.",img:"images/stationery-desk.jpg"},
 {id:"pen",name:"Ball Pen",price:20,desc:"Smooth everyday ball pen for office, school and business use.",img:"images/pen.jpeg"},
 {id:"notebook",name:"Spiral Notebook",price:80,desc:"Quality spiral notebook for office notes, meetings and daily records.",img:"images/spiral-notebook.jpeg"},
 {id:"stapler",name:"Heavy Duty Office Stapler",price:180,desc:"Strong desktop stapler for regular office paperwork and document filing.",img:"images/stapler.jpg"},
 {id:"file",name:"Blue Office File Folder",price:65,desc:"Durable blue index files for organised office records and paperwork.",img:"images/blue-office-files.jpeg"},
 {id:"register",name:"Red Office Register",price:120,desc:"Durable office register for records, accounts and documentation.",img:"images/red-register.jpeg"},
 {id:"marker",name:"Highlighter Set",price:150,desc:"Bright assorted highlighters for office notes, study and presentations.",img:"images/highlighters.jpeg"},
 {id:"calculator",name:"Casio Office Calculator",price:220,desc:"Practical calculator for office, billing and business calculations.",img:"images/calculator.jpeg"},
 {id:"laptop",name:"Business Laptop",price:45000,desc:"Professional laptop for office work, business applications and everyday productivity.",img:"images/laptop.jpg"},
 {id:"monitor",name:"Desktop Monitor",price:8500,desc:"Full-size desktop monitor suitable for office work and computer setups.",img:"images/monitor.jpg"},
 {id:"mouse",name:"Wireless Computer Mouse",price:650,desc:"Comfortable wireless mouse for desktops and laptops.",img:"images/mouse.jpg"},
 {id:"printer",name:"Multifunction Office Printer",price:28000,desc:"Professional multifunction printer for printing, scanning and copying.",img:"images/multifunction-printer.jpg"},
 {id:"jkpaper",name:"JK Easy Copier A4 Paper",price:320,desc:"JK Easy Copier A4 copier paper for everyday office printing and photocopying.",img:"images/jk-easy-copier-paper.jpg"},
 {id:"supplies",name:"Complete Office Supplies",price:799,desc:"Complete real office-supply assortment including clips, scissors, tape, glue, pens, markers and staplers.",img:"images/complete-office-supplies.jpeg"}
];

let cart = JSON.parse(localStorage.getItem("apparelCart") || "[]");

function saveCart(){
 localStorage.setItem("apparelCart",JSON.stringify(cart));
 updateCartBadge();
}

function updateCartBadge(){
 const count=cart.reduce((s,i)=>s+i.qty,0);
 document.querySelectorAll("#cartCount").forEach(el=>el.textContent=count);
}

function addToCart(id){
 const p=PRODUCTS.find(x=>x.id===id);
 if(!p)return;
 const item=cart.find(x=>x.id===id);
 if(item)item.qty++;
 else cart.push({id:p.id,qty:1});
 saveCart();
 showToast(p.name+" added to cart!");
}

function changeQty(id,delta){
 const item=cart.find(x=>x.id===id);
 if(!item)return;
 item.qty+=delta;
 if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
 saveCart();
 renderCart();
}

function removeItem(id){
 cart=cart.filter(x=>x.id!==id);
 saveCart();
 renderCart();
}

function clearCart(){
 if(!cart.length)return;
 if(confirm("Clear all products from your cart?")){
  cart=[];
  saveCart();
  renderCart();
 }
}

function getCartRows(){
 return cart.map(i=>{
  const p=PRODUCTS.find(x=>x.id===i.id);
  return p?{...p,qty:i.qty,total:p.price*i.qty}:null;
 }).filter(Boolean);
}

function renderProducts(){
 const box=document.getElementById("productGrid");
 if(!box)return;
 box.innerHTML=PRODUCTS.map(p=>`
  <article class="product-card">
   <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
   <div class="product-body">
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="price">₹${p.price}</div>
    <button class="add-btn" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>
   </div>
  </article>`).join("");
}

function renderFeatured(){
 const box=document.getElementById("featuredGrid");
 if(!box)return;
 box.innerHTML=PRODUCTS.slice(0,4).map(p=>`
  <article class="product-card">
   <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
   <div class="product-body">
    <h3>${p.name}</h3><p>${p.desc}</p>
    <div class="price">₹${p.price}</div>
    <button class="add-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
   </div>
  </article>`).join("");
}

function renderCart(){
 const box=document.getElementById("cartItems");
 if(!box)return;
 const rows=getCartRows();
 const totalItems=rows.reduce((s,x)=>s+x.qty,0);
 const total=rows.reduce((s,x)=>s+x.total,0);
 document.getElementById("totalItems").textContent=totalItems;
 document.getElementById("grandTotal").textContent="₹"+total;
 const payBtn=document.getElementById("payNowBtn");
 if(payBtn){payBtn.textContent="💳 Pay Now ₹"+total; payBtn.disabled=!rows.length;}
 if(!rows.length){
  box.innerHTML=`<div class="empty"><div class="big">🛒</div><h3>Your cart is empty</h3><p>Add products from our Products page.</p><a class="btn btn-blue" href="products.html">View Products</a></div>`;
  return;
 }
 box.innerHTML=rows.map(x=>`
  <div class="cart-item">
   <img src="${x.img}" alt="${x.name}">
   <div>
    <h3>${x.name}</h3><small>₹${x.price} per item</small>
    <div class="qty">
     <button onclick="changeQty('${x.id}',-1)">−</button>
     <span>${x.qty}</span>
     <button onclick="changeQty('${x.id}',1)">+</button>
    </div>
    <button class="remove" onclick="removeItem('${x.id}')">Remove</button>
   </div>
   <div class="item-total">₹${x.total}</div>
  </div>`).join("");
}

function payNow(){
 const rows=getCartRows();
 if(!rows.length){alert("Your cart is empty.");return;}
 const name=document.getElementById("customerName")?.value.trim()||"";
 const phone=document.getElementById("customerPhone")?.value.trim()||"";
 const address=document.getElementById("customerAddress")?.value.trim()||"";
 const payment=document.querySelector('input[name="paymentMethod"]:checked')?.value||"UPI";
 if(!name||!phone||!address){alert("Please enter your name, phone number and address before payment.");return;}
 const total=rows.reduce((s,x)=>s+x.total,0);
 if(payment === "Cash on Delivery"){
  alert(`Order confirmed for Cash on Delivery. Amount: ₹${total}`);
  return;
 }
 alert(`Pay Now\n\nAmount: ₹${total}\nPayment Method: ${payment}\n\nThis demo website does not collect card/UPI credentials. Connect a payment gateway such as Razorpay or Stripe for live payments.`);
}

function placeOrder(){
 const rows=getCartRows();
 if(!rows.length){alert("Your cart is empty.");return;}
 const name=document.getElementById("customerName")?.value.trim()||"";
 const phone=document.getElementById("customerPhone")?.value.trim()||"";
 const address=document.getElementById("customerAddress")?.value.trim()||"";
 const payment=document.querySelector('input[name="paymentMethod"]:checked')?.value||"UPI";
 if(!name||!phone||!address){alert("Please enter your name, phone number and address.");return;}
 let total=rows.reduce((s,x)=>s+x.total,0);
 let msg=`Hello Apparel Enterprises,%0A%0AI want to place an order.%0A%0ACustomer: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AAddress: ${encodeURIComponent(address)}%0APayment Method: ${encodeURIComponent(payment)}%0A%0AOrder:%0A`;
 rows.forEach(x=>msg+=`${encodeURIComponent(x.name)} x ${x.qty} = ₹${x.total}%0A`);
 msg+=`%0AGrand Total: ₹${total}%0A%0APlease confirm availability and delivery details.`;
 window.open("https://wa.me/919664830196?text="+msg,"_blank");
}

function showToast(text){
 let t=document.getElementById("toast");
 if(!t){
  t=document.createElement("div");t.id="toast";
  Object.assign(t.style,{position:"fixed",right:"20px",bottom:"20px",background:"#102a43",color:"#fff",padding:"13px 18px",borderRadius:"8px",zIndex:"9999",boxShadow:"0 5px 20px #0003"});
  document.body.appendChild(t);
 }
 t.textContent="✓ "+text;t.style.display="block";
 clearTimeout(window.toastTimer);
 window.toastTimer=setTimeout(()=>t.style.display="none",1800);
}

document.addEventListener("DOMContentLoaded",()=>{
 updateCartBadge();
 renderProducts();
 renderFeatured();
 renderCart();
});
