// AYI BEAUTY TOUCH - Main JS
const WA_NUMBER = "2349156002887";

document.getElementById('year').innerText = new Date().getFullYear();

// --- 1. MOBILE NAV ---
function toggleMenu(){
  document.getElementById('navLinks').classList.toggle('active');
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
  });
});

// --- 2. CART ---
let cart = JSON.parse(localStorage.getItem('ayiCart') || '[]');
const cartCount = document.getElementById('cartCount');
const cartBox = document.getElementById('cartBox');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const checkoutWA = document.getElementById('checkoutWA');

function updateCartUI(){
  cartCount.innerText = cart.reduce((sum,i)=>sum+i.qty,0);
  if(cart.length === 0){ cartBox.style.display='none'; return; }
  cartBox.style.display='block';
  cartItemsDiv.innerHTML = cart.map(c =>
    `${c.name} x${c.qty} = ₦${(c.price*c.qty).toLocaleString()} <button onclick="removeFromCart(${c.id})" style="margin-left:8px;color:red;border:none;background:none;cursor:pointer">Remove</button>`
  ).join('<br>');

  const total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);
  cartTotalSpan.innerText = total.toLocaleString();
  localStorage.setItem('ayiCart', JSON.stringify(cart));

  const waText = `Hi AYI BEAUTY TOUCH, I want to order:\n${cart.map(c=>`- ${c.name} x${c.qty}`).join('\n')}\nTotal: ₦${total.toLocaleString()}`;
  checkoutWA.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
}

function removeFromCart(id){
  cart = cart.filter(c => c.id != id);
  updateCartUI();
}

document.querySelectorAll('.card').forEach(card=>{
  const btn = card.querySelector('.ATC');
  btn.addEventListener('click', ()=>{
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const found = cart.find(c => c.id == id);
    if(found) found.qty++;
    else cart.push({id, name, price, qty:1});
    btn.innerText = "Added ✓";
    setTimeout(()=> btn.innerText = "Add to Cart", 1000);
    updateCartUI();
  });
});
updateCartUI();

// --- 3. BOOKING FORM (Formspree) ---
const form = document.getElementById('bookingForm');
const status = document.getElementById('formStatus');

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById('bookBtn');
  btn.textContent = "Sending..."; btn.disabled = true;
  status.style.display = "block"; status.textContent = "Sending your booking...";
  try {
    const data = new FormData(form);
    const res = await fetch(form.action, {method:'POST', body:data, headers:{'Accept':'application/json'}});
    if(res.ok){
      status.style.color = "#00ff88";
      status.textContent = "✅ Booking sent! We will contact you shortly.";
      form.reset();
    } else {
      status.style.color = "red";
      status.textContent = "❌ Failed. Try WhatsApp: 09156002887";
    }
  } catch(err) {
    status.style.color = "red";
    status.textContent = "❌ Network error. WhatsApp us: 09156002887";
  }
  btn.textContent = "Book Now"; btn.disabled = false;
});

// --- 4. WHATSAPP DIRECT - Uses only fields that exist ---
document.getElementById('waDirect').addEventListener('click', function(){
  const name = document.getElementById('name').value || "Someone";
  const phone = document.getElementById('phone').value || "";
  const info = document.getElementById('info').value || "I want to book a service";
  const text = `Hi AYI BEAUTY TOUCH! I'm ${name} (${phone}). ${info}`;
  this.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
});