-- Veritabanını oluştur
CREATE DATABASE EcommerceDB;
GO

USE EcommerceDB;
GO

-- Categories tablosu
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Products tablosu
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(200) NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    Description NVARCHAR(1000),
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL,
    ImageURL NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
);

-- Users tablosu
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Address NVARCHAR(500),
    Phone NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),
    LastLogin DATETIME
);

-- Orders tablosu
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    ShippingAddress NVARCHAR(500),
    OrderStatus NVARCHAR(50) DEFAULT 'Pending',
    PaymentStatus NVARCHAR(50) DEFAULT 'Pending'
);

-- OrderDetails tablosu
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL
);

-- Örnek kategori verileri
INSERT INTO Categories (CategoryName, Description) VALUES
('Elektronik', 'Elektronik ürünler ve aksesuarlar'),
('Giyim', 'Erkek ve kadın giyim ürünleri'),
('Kitaplar', 'Her türlü kitap ve dergi'),
('Ev & Yaşam', 'Ev dekorasyon ve yaşam ürünleri');

-- Örnek ürün verileri
INSERT INTO Products (ProductName, CategoryID, Description, Price, StockQuantity, ImageURL) VALUES
('Akıllı Telefon', 1, 'Son model akıllı telefon', 5999.99, 50, 'phone.jpg'),
('Laptop', 1, 'İş için ideal laptop', 12999.99, 30, 'laptop.jpg'),
('T-Shirt', 2, 'Pamuklu basic t-shirt', 199.99, 100, 'tshirt.jpg'),
('Roman', 3, 'Çok satan roman', 49.99, 200, 'book.jpg'),
('Masa Lambası', 4, 'Modern tasarım masa lambası', 299.99, 45, 'lamp.jpg');
