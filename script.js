// API URL'si
const API_URL = 'https://ecommerce-mehmets-projects-12b07a45.vercel.app';

// Mevcut ürün verileri ve diğer fonksiyonlar aynı kalacak
const products = [
    // ... ürün verileri ...
];

// Kullanıcı durumu
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Modal elementleri
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// Form elementleri
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

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

// Tüm close butonlarını ayarla
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

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'success') {
    // Mevcut bildirimi kaldır
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Yeni bildirimi oluştur
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Bildirimi sayfaya ekle
    document.body.appendChild(notification);

    // 3 saniye sonra bildirimi kaldır
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auth butonlarına tıklama olayları ekle
if (loginBtn) {
    loginBtn.onclick = () => openModal(loginModal);
}
if (registerBtn) {
    registerBtn.onclick = () => openModal(registerModal);
}

// Kayıt formu işleme
if (registerForm) {
    registerForm.onsubmit = async function(e) {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            passwordConfirm: document.getElementById('registerPasswordConfirm').value,
            firstName: document.getElementById('registerName').value.split(' ')[0],
            lastName: document.getElementById('registerName').value.split(' ')[1] || ''
        };

        if (formData.password !== formData.passwordConfirm) {
            showNotification('Şifreler eşleşmiyor!', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Kayıt başarılı! Giriş yapabilirsiniz.');
                closeModal(registerModal);
                openModal(loginModal);
            } else {
                showNotification(data.error || 'Kayıt işlemi başarısız!', 'error');
            }
        } catch (err) {
            console.error('Kayıt hatası:', err);
            showNotification('Bir hata oluştu!', 'error');
        }
    };
}

// Giriş formu işleme
if (loginForm) {
    loginForm.onsubmit = async function(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                currentUser = data.user;
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                
                showNotification('Giriş başarılı!');
                closeModal(loginModal);
                updateAuthButtons();
            } else {
                showNotification(data.error || 'Giriş başarısız!', 'error');
            }
        } catch (err) {
            console.error('Giriş hatası:', err);
            showNotification('Bir hata oluştu!', 'error');
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
    authToken = null;
    localStorage.removeItem('authToken');
    updateAuthButtons();
    showNotification('Çıkış yapıldı!');
}

// Sayfa yüklendiğinde token kontrolü
document.addEventListener('DOMContentLoaded', async () => {
    if (authToken) {
        try {
            // Token doğrulama ve kullanıcı bilgilerini alma işlemi
            const response = await fetch(`${API_URL}/api/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
            } else {
                // Token geçersizse çıkış yap
                logout();
            }
        } catch (err) {
            console.error('Token doğrulama hatası:', err);
            logout();
        }
        updateAuthButtons();
    }
});

// CSS ekle
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 4px;
    color: white;
    z-index: 1000;
    animation: slideIn 0.5s ease-out;
}

.notification.success {
    background-color: #4CAF50;
}

.notification.error {
    background-color: #f44336;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
