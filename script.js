// Örnek ürün verileri
const products = [
    {
        id: 1,
        name: "Akıllı Telefon",
        price: 8999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format",
        description: "Son model akıllı telefon",
        category: "elektronik"
    },
    {
        id: 2,
        name: "Laptop",
        price: 15999,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format",
        description: "Yüksek performanslı dizüstü bilgisayar",
        category: "elektronik"
    },
    {
        id: 3,
        name: "Tablet",
        price: 4999,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format",
        description: "Hafif ve taşınabilir tablet",
        category: "elektronik"
    },
    {
        id: 4,
        name: "Akıllı Saat",
        price: 2999,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format",
        description: "Spor ve günlük kullanım için akıllı saat",
        category: "aksesuar"
    },
    {
        id: 5,
        name: "Spor Ayakkabı",
        price: 1299,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format",
        description: "Rahat ve şık spor ayakkabı",
        category: "giyim"
    },
    {
        id: 6,
        name: "Kot Pantolon",
        price: 599,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format",
        description: "Modern kesim kot pantolon",
        category: "giyim"
    },
    {
        id: 7,
        name: "Güneş Gözlüğü",
        price: 449,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format",
        description: "UV korumalı şık güneş gözlüğü",
        category: "aksesuar"
    },
    {
        id: 8,
        name: "Kablosuz Kulaklık",
        price: 1999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format",
        description: "Aktif gürültü önleyici kablosuz kulaklık",
        category: "elektronik"
    }
];

// Kullanıcı verileri
let users = [];
let currentUser = null;

// Sepet verileri
let cart = [];
let filteredProducts = [...products];

// DOM elementleri
const productList = document.getElementById('productList');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartIcon = document.querySelector('.cart');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceSort = document.getElementById('priceSort');

// Modal elementleri
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const paymentModal = document.getElementById('paymentModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Sipariş takip elementleri
const orderTrackingBtn = document.getElementById('orderTrackingBtn');
const orderTrackingModal = document.getElementById('orderTrackingModal');
const orderTrackingForm = document.getElementById('orderTrackingForm');
const trackingResult = document.getElementById('trackingResult');

// Örnek sipariş verileri
const orderData = {
    'TR123456789': {
        orderStatus: 'Kargoya Verildi',
        carrierName: 'Hızlı Kargo',
        location: 'İstanbul Dağıtım Merkezi',
        estimatedDelivery: '27.03.2024',
        lastUpdate: '25.03.2024 14:30',
        notes: 'Sipariş yola çıktı'
    }
};

// Form elementleri
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const paymentForm = document.getElementById('paymentForm');

// Modal işlemleri
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

// Tüm close butonlarına event listener ekle
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = function() {
        closeModal(this.closest('.modal'));
    }
});

// Modal dışına tıklandığında kapat
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target);
    }
}

// Kullanıcı işlemleri
if (loginBtn) {
    loginBtn.onclick = () => openModal(loginModal);
}
if (registerBtn) {
    registerBtn.onclick = () => openModal(registerModal);
}

// Sipariş takip modalını aç
if (orderTrackingBtn) {
    orderTrackingBtn.onclick = () => openModal(orderTrackingModal);
}

// Sipariş sorgulama
if (orderTrackingForm) {
    orderTrackingForm.onsubmit = function(e) {
        e.preventDefault();
        
        const trackingNumber = document.getElementById('trackingNumber').value;
        const order = orderData[trackingNumber];
        
        if (order) {
            document.getElementById('orderStatus').textContent = order.orderStatus;
            document.getElementById('carrierName').textContent = order.carrierName;
            document.getElementById('location').textContent = order.location;
            document.getElementById('estimatedDelivery').textContent = order.estimatedDelivery;
            document.getElementById('lastUpdate').textContent = order.lastUpdate;
            document.getElementById('trackingNotes').textContent = order.notes;
            
            trackingResult.style.display = 'block';
            showNotification('Sipariş bulundu!');
        } else {
            trackingResult.style.display = 'none';
            showNotification('Sipariş bulunamadı!', 'error');
        }
    };
}

// Kayıt formu işleme
if (registerForm) {
    registerForm.onsubmit = function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (password !== passwordConfirm) {
            showNotification('Şifreler eşleşmiyor!', 'error');
            return;
        }

        if (users.some(user => user.email === email)) {
            showNotification('Bu e-posta adresi zaten kayıtlı!', 'error');
            return;
        }

        users.push({ name, email, password });
        showNotification('Kayıt başarılı! Giriş yapabilirsiniz.');
        closeModal(registerModal);
        openModal(loginModal);
    };
}

// Giriş formu işleme
if (loginForm) {
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            showNotification('Giriş başarılı!');
            closeModal(loginModal);
            updateAuthButtons();
        } else {
            showNotification('E-posta veya şifre hatalı!', 'error');
        }
    };
}

// Auth butonlarını güncelle
function updateAuthButtons() {
    if (loginBtn && registerBtn) {
        if (currentUser) {
            loginBtn.style.display = 'none';
            registerBtn.textContent = 'Çıkış Yap';
            registerBtn.onclick = logout;
        } else {
            loginBtn.style.display = 'block';
            registerBtn.textContent = 'Kayıt Ol';
            registerBtn.onclick = () => openModal(registerModal);
        }
    }
}

// Çıkış işlemi
function logout() {
    currentUser = null;
    updateAuthButtons();
    showNotification('Çıkış yapıldı!');
}

// Ödeme işlemleri
if (checkoutBtn) {
    checkoutBtn.onclick = function() {
        if (!currentUser) {
            showNotification('Lütfen önce giriş yapın!', 'error');
            openModal(loginModal);
            return;
        }
        openModal(paymentModal);
    };
}

// Kredi kartı numarası formatla
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.oninput = function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        this.value = value;
    };
}

// Son kullanma tarihi formatla
const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
    cardExpiryInput.oninput = function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2,4);
        }
        this.value = value;
    };
}

// Ödeme formu işleme
if (paymentForm) {
    paymentForm.onsubmit = function(e) {
        e.preventDefault();
        
        showNotification('Ödeme işlemi başarılı!');
        closeModal(paymentModal);
        cart = [];
        updateCart();
    };
}

// Ürünleri filtrele ve listele
function filterAndDisplayProducts() {
    if (!searchInput || !categoryFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortOrder = priceSort.value;
    if (sortOrder === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts();
}

// Ürünleri listele
function displayProducts() {
    if (!productList) return;
    
    productList.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price.toLocaleString('tr-TR')} TL</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Sepete Ekle</button>
            </div>
        </div>
    `).join('');
}

// Sepete ürün ekle
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} sepete eklendi`);
}

// Sepeti güncelle
function updateCart() {
    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString('tr-TR')} TL x ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})">Kaldır</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total.toLocaleString('tr-TR')} TL`;

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
}

// Sepetten ürün kaldır
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

// Bildirim göster
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Event Listeners
if (searchInput) {
    searchInput.addEventListener('input', filterAndDisplayProducts);
}
if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAndDisplayProducts);
}
if (priceSort) {
    priceSort.addEventListener('change', filterAndDisplayProducts);
}

// Sepet modalını aç/kapat
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        if (cartModal) {
            cartModal.classList.toggle('active');
        }
    });
}

// Sayfa yüklendiğinde ürünleri listele
document.addEventListener('DOMContentLoaded', () => {
    filterAndDisplayProducts();
});

// Sepet dışına tıklandığında modalı kapat
document.addEventListener('click', (e) => {
    if (cartModal && !cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
        cartModal.classList.remove('active');
    }
});

// İletişim formu işleme
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        console.log('Form verileri:', formData);
        showNotification('Mesajınız başarıyla gönderildi!');
        this.reset();
    });
}
