CREATE DATABASE warehouse;
USE warehouse;

-- Dimension Tables
CREATE TABLE dim_time (
    TimeID NVARCHAR(10) PRIMARY KEY,

    Day INT,
    Month INT,
    Quarter INT,
    Year INT
);

CREATE TABLE dim_city (
    CityID NVARCHAR(10) PRIMARY KEY,

    CityName VARCHAR(255),
    Address VARCHAR(255),
    State VARCHAR(100)
);

CREATE TABLE dim_store (
    StoreID NVARCHAR(10) PRIMARY KEY,

    Phone VARCHAR(50),

    CityID NVARCHAR(10),
    FOREIGN KEY (CityID) REFERENCES dim_city(CityID)
);

CREATE TABLE dim_item (
    ItemID NVARCHAR(10) PRIMARY KEY,

    Description VARCHAR(255),
    Size VARCHAR(50),
    Weight FLOAT,
    Price FLOAT
);

CREATE TABLE dim_customer (
    CustomerID NVARCHAR(10) PRIMARY KEY,

    CustomerName VARCHAR(255),
    IsTourist BIT,
    IsMailCustomer BIT,
    TourGuide VARCHAR(255),
    PostOfficeAddress VARCHAR(255),
    FirstOrderDate DATE,

    CityID NVARCHAR(10),
    FOREIGN KEY (CityID) REFERENCES dim_city(CityID)
);

-- Fact Tables
CREATE TABLE fact_order (
    OrderID NVARCHAR(10) PRIMARY KEY,

    TotalAmount DECIMAL(18, 2),

    CustomerID NVARCHAR(10),
    TimeID NVARCHAR(10),
	StoreID NVARCHAR(10),
    FOREIGN KEY (CustomerID) REFERENCES dim_customer(CustomerID),
	FOREIGN KEY (StoreID) REFERENCES dim_store(StoreID),
    FOREIGN KEY (TimeID) REFERENCES dim_time(TimeID),
);

CREATE TABLE fact_order_detail (
    Quantity INT,
    UnitPrice DECIMAL(18, 2),
    LineTotal DECIMAL(18, 2),

    OrderID NVARCHAR(10),
    ItemID NVARCHAR(10),

    PRIMARY KEY (OrderID, ItemID),
    FOREIGN KEY (OrderID) REFERENCES fact_order(OrderID),
    FOREIGN KEY (ItemID) REFERENCES dim_item(ItemID),
);

CREATE TABLE fact_inventory (
    QuantityInStock INT,

    StoreID NVARCHAR(10),
    ItemID NVARCHAR(10),
    TimeID NVARCHAR(10),

    PRIMARY KEY (StoreID, ItemID, TimeID),
    FOREIGN KEY (StoreID) REFERENCES dim_store(StoreID),
    FOREIGN KEY (ItemID) REFERENCES dim_item(ItemID),
    FOREIGN KEY (TimeID) REFERENCES dim_time(TimeID)
);
