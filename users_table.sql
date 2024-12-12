USE EcommerceDB;
GO

-- Users tablosunu oluştur
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),
    LastLogin DATETIME
);
GO

-- Örnek kullanıcı verisi
INSERT INTO Users (Username, Email, Password, FirstName, LastName)
VALUES ('test_user', 'test@email.com', 'hashedpassword123', 'Test', 'User');
GO
