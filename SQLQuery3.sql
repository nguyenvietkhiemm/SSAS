SELECT TOP (1000) [CityID]
      ,[CityName]
      ,[Address]
      ,[State]
  FROM [warehouse].[dbo].[dim_city]

drop database warehouse;

create database warehouse;

-- Buộc tất cả các kết nối ngắt ra khỏi DB
ALTER DATABASE warehouse
SET SINGLE_USER WITH ROLLBACK IMMEDIATE
DROP DATABASE warehouse;

-- Xóa database
DROP DATABASE warehouse;
create database tmp
use tmp;

use warehouse;
select * from dim_city;