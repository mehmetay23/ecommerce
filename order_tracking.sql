USE EcommerceDB;
GO

-- OrderTracking tablosu
CREATE TABLE OrderTracking (
    TrackingID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    Status NVARCHAR(50) NOT NULL,
    Location NVARCHAR(200),
    UpdateDate DATETIME DEFAULT GETDATE(),
    EstimatedDeliveryDate DATETIME,
    CarrierName NVARCHAR(100),
    TrackingNumber NVARCHAR(50),
    Notes NVARCHAR(500)
);

-- Örnek sipariş verileri
INSERT INTO Users (Username, Email, Password, FirstName, LastName, Address, Phone)
VALUES ('mehmet123', 'mehmet@email.com', 'hashedpassword123', 'Mehmet', 'Yılmaz', 'İstanbul, Türkiye', '5551234567');

-- Örnek sipariş oluştur
INSERT INTO Orders (UserID, TotalAmount, ShippingAddress, OrderStatus, PaymentStatus)
VALUES (1, 13199.98, 'İstanbul, Türkiye', 'İşleme Alındı', 'Ödendi');

-- Sipariş detaylarını ekle
INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, Subtotal)
VALUES 
(1, 1, 2, 5999.99, 11999.98), -- 2 adet telefon
(1, 3, 6, 199.99, 1200.00);   -- 6 adet t-shirt

-- Sipariş takip bilgilerini ekle
INSERT INTO OrderTracking (OrderID, Status, Location, EstimatedDeliveryDate, CarrierName, TrackingNumber, Notes)
VALUES 
(1, 'Sipariş Alındı', 'İstanbul Depo', DATEADD(day, 3, GETDATE()), 'Hızlı Kargo', 'TR123456789', 'Sipariş hazırlanıyor');

-- Sipariş durumunu görüntülemek için view oluştur
CREATE VIEW OrderTrackingView AS
SELECT 
    o.OrderID,
    u.FirstName + ' ' + u.LastName AS CustomerName,
    o.OrderDate,
    o.TotalAmount,
    ot.Status AS TrackingStatus,
    ot.Location,
    ot.EstimatedDeliveryDate,
    ot.CarrierName,
    ot.TrackingNumber,
    ot.Notes
FROM Orders o
JOIN Users u ON o.UserID = u.UserID
JOIN OrderTracking ot ON o.OrderID = ot.OrderID;

-- Sipariş takibini görüntülemek için sorgu
SELECT * FROM OrderTrackingView;
