USE EcommerceDB;
GO

-- Mevcut Users tablosunun yapısını kontrol et
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Users';

-- Örnek kullanıcı ekle (eğer aynı kullanıcı yoksa)
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'test@email.com')
BEGIN
    INSERT INTO Users (Username, Email, Password, FirstName, LastName)
    VALUES ('test_user', 'test@email.com', 'hashedpassword123', 'Test', 'User');
END
GO

-- Mevcut kullanıcıları listele
SELECT UserID, Username, Email, FirstName, LastName, CreatedAt, LastLogin
FROM Users;
