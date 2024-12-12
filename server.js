require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors({
    origin: 'https://ecommerce-mehmets-projects-12b07a45.vercel.app',
    credentials: true
}));

// Veritabanı yapılandırması - Local SQL Server
const dbConfig = {
    user: 'sa', // SQL Server authentication kullanıcı adı
    password: '123456', // SQL Server authentication şifresi
    server: 'localhost',
    database: 'EcommerceDB',
    options: {
        encrypt: false, // local bağlantı için false
        trustServerCertificate: true
    }
};

// Veritabanı bağlantı havuzu
const pool = new sql.ConnectionPool(dbConfig);

// Veritabanı bağlantısını test et
pool.connect().then(() => {
    console.log('Veritabanına başarıyla bağlandı');
}).catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Kayıt ol API'si
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // E-posta kontrolü
        const emailCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email');

        if (emailCheck.recordset.length > 0) {
            return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda!' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcıyı veritabanına ekle
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .query(`
                INSERT INTO Users (Username, Email, Password, FirstName, LastName)
                VALUES (@username, @email, @password, @firstName, @lastName);
                SELECT SCOPE_IDENTITY() AS userId;
            `);

        console.log('Kullanıcı kaydedildi:', result.recordset[0]);
        res.json({ message: 'Kayıt başarılı', userId: result.recordset[0].userId });
    } catch (err) {
        console.error('Kayıt hatası:', err);
        res.status(500).json({ error: 'Kayıt işlemi başarısız' });
    }
});

// Giriş yap API'si
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Giriş denemesi:', email);

        // Kullanıcıyı e-posta ile bul
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email');

        const user = result.recordset[0];

        if (!user) {
            console.log('Kullanıcı bulunamadı:', email);
            return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
        }

        // Şifre kontrolü
        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            console.log('Geçersiz şifre:', email);
            return res.status(401).json({ error: 'Geçersiz şifre' });
        }

        // Son giriş zamanını güncelle
        await pool.request()
            .input('userId', sql.Int, user.UserID)
            .query('UPDATE Users SET LastLogin = GETDATE() WHERE UserID = @userId');

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user.UserID, email: user.Email },
            process.env.JWT_SECRET || 'gizli_anahtar_123',
            { expiresIn: '24h' }
        );

        console.log('Giriş başarılı:', email);
        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.UserID,
                username: user.Username,
                email: user.Email,
                firstName: user.FirstName,
                lastName: user.LastName
            }
        });
    } catch (err) {
        console.error('Giriş hatası:', err);
        res.status(500).json({ error: 'Giriş işlemi başarısız' });
    }
});

// Diğer sayfalar
app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
    console.log('Veritabanı bağlantı bilgileri:', {
        server: dbConfig.server,
        database: dbConfig.database,
        user: dbConfig.user
    });
});
