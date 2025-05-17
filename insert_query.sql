-- dim_time
use warehouse;

DECLARE @Date DATE = '2023-01-01';
DECLARE @EndDate DATE = '2025-12-31';

WHILE @Date <= @EndDate
BEGIN
    INSERT INTO dim_time (TimeID, Day, Month, Quarter, Year)
    VALUES (
        FORMAT(@Date, 'yyyyMMdd'),  -- TimeID dạng chuỗi, ví dụ: '20240101'
        DAY(@Date),
        MONTH(@Date),
        DATEPART(QUARTER, @Date),
        YEAR(@Date)
    );

    SET @Date = DATEADD(DAY, 1, @Date);
END;


-- dim_city
INSERT INTO dim_city (CityID, CityName, Address, State)
VALUES 
('ci0001', 'New York', '123 Manhattan Ave', 'NY'),
('ci0002', 'Los Angeles', '456 Sunset Blvd', 'CA'),
('ci0003', 'Chicago', '789 Lakeshore Dr', 'IL'),
('ci0004', 'Houston', '321 Bay Area Blvd', 'TX'),
('ci0005', 'Phoenix', '654 Desert Rd', 'AZ'),
('ci0006', 'Philadelphia', '111 Liberty St', 'PA'),
('ci0007', 'San Antonio', '222 River Walk', 'TX'),
('ci0008', 'San Diego', '333 Ocean View', 'CA'),
('ci0009', 'Dallas', '444 Elm St', 'TX'),
('ci0010', 'San Jose', '555 Silicon Valley Blvd', 'CA'),
('ci0011', 'Austin', '777 Tech Lane', 'TX'),
('ci0012', 'Jacksonville', '888 River St', 'FL'),
('ci0013', 'Fort Worth', '999 Stockyard Rd', 'TX'),
('ci0014', 'Columbus', '101 High St', 'OH'),
('ci0015', 'Charlotte', '202 Queen City Blvd', 'NC'),
('ci0016', 'San Francisco', '303 Golden Gate Ave', 'CA'),
('ci0017', 'Indianapolis', '404 Monument Cir', 'IN'),
('ci0018', 'Seattle', '505 Rainy St', 'WA'),
('ci0019', 'Denver', '606 Mile High Rd', 'CO'),
('ci0020', 'Washington', '707 Capitol Hill', 'DC'),
('ci0021', 'Boston', '808 Freedom Trail', 'MA'),
('ci0022', 'El Paso', '909 Borderline Ave', 'TX'),
('ci0023', 'Detroit', '1010 Motor City Blvd', 'MI'),
('ci0024', 'Nashville', '1111 Music Row', 'TN'),
('ci0025', 'Portland', '1212 Rose City Rd', 'OR'),
('ci0026', 'Memphis', '1313 Beale St', 'TN'),
('ci0027', 'Oklahoma City', '1414 Thunder Ln', 'OK'),
('ci0028', 'Las Vegas', '1515 Strip Blvd', 'NV'),
('ci0029', 'Louisville', '1616 Bourbon Rd', 'KY'),
('ci0030', 'Baltimore', '1717 Inner Harbor', 'MD'),
('ci0031', 'Milwaukee', '1818 Beer St', 'WI'),
('ci0032', 'Albuquerque', '1919 Route 66', 'NM'),
('ci0033', 'Tucson', '2020 Cactus Ave', 'AZ'),
('ci0034', 'Fresno', '2121 Valley Farm', 'CA'),
('ci0035', 'Sacramento', '2222 Capitol Mall', 'CA'),
('ci0036', 'Kansas City', '2323 BBQ Blvd', 'MO'),
('ci0037', 'Mesa', '2424 Sun Devil Pkwy', 'AZ'),
('ci0038', 'Atlanta', '2525 Peachtree St', 'GA'),
('ci0039', 'Colorado Springs', '2626 Pikes Peak Ave', 'CO'),
('ci0040', 'Omaha', '2727 Heartland Dr', 'NE'),
('ci0041', 'Raleigh', '2828 Research Triangle Parkway', 'NC'),
('ci0042', 'Miami', '2929 Ocean Dr', 'FL'),
('ci0043', 'Oakland', '3030 Jack London Square', 'CA'),
('ci0044', 'Minneapolis', '3131 Lake St', 'MN'),
('ci0045', 'Tulsa', '3232 Oil Capital Blvd', 'OK'),
('ci0046', 'Cleveland', '3333 Rock and Roll Blvd', 'OH'),
('ci0047', 'Arlington', '3434 Ballpark Way', 'TX'),
('ci0048', 'New Orleans', '3535 Bourbon St', 'LA'),
('ci0049', 'Wichita', '3636 Air Capital Dr', 'KS'),
('ci0050', 'Tampa', '3737 Bay Shore Blvd', 'FL'),
('ci0051', 'Honolulu', '3838 Aloha Ave', 'HI'),
('ci0052', 'Anaheim', '3939 Disneyland Dr', 'CA'),
('ci0053', 'Santa Ana', '4040 Civic Center Dr', 'CA'),
('ci0054', 'St. Louis', '4141 Gateway Arch Plaza', 'MO'),
('ci0055', 'Pittsburgh', '4242 Steel City Way', 'PA'),
('ci0056', 'Corpus Christi', '4343 Gulf Coast Hwy', 'TX'),
('ci0057', 'Cincinnati', '4444 Queen City Sq', 'OH'),
('ci0058', 'Aurora', '4545 Smoky Hill Rd', 'CO'),
('ci0059', 'Toledo', '4646 Glass City Blvd', 'OH'),
('ci0060', 'Riverside', '4747 Citrus Ave', 'CA'),
('ci0061', 'Bakersfield', '4848 Oil Dale Ave', 'CA'),
('ci0062', 'Stockton', '4949 Port City Way', 'CA'),
('ci0063', 'Birmingham', '5050 Civil Rights Dr', 'AL'),
('ci0064', 'Jersey City', '5151 Liberty State Park', 'NJ'),
('ci0065', 'Fort Wayne', '5252 Motor City Pkwy', 'IN'),
('ci0066', 'Syracuse', '5353 Salt City Way', 'NY'),
('ci0067', 'Rochester', '5454 Flower City Blvd', 'NY'),
('ci0068', 'Boise', '5555 Capitol Blvd', 'ID'),
('ci0069', 'Salt Lake City', '5656 Temple Square', 'UT'),
('ci0070', 'Richmond', '5757 Monument Ave', 'VA'),
('ci0071', 'Yonkers', '5858 Riverdale Ave', 'NY'),
('ci0072', 'Des Moines', '5959 State Capitol Dr', 'IA'),
('ci0073', 'Tacoma', '6060 Commencement Way', 'WA'),
('ci0074', 'Spokane', '6161 Lilac City Ln', 'WA'),
('ci0075', 'Glendale', '6262 Arrowhead Dr', 'AZ'),
('ci0076', 'Chandler', '6363 Innovation Way', 'AZ'),
('ci0077', 'Scottsdale', '6464 Fashion Square Dr', 'AZ'),
('ci0078', 'North Las Vegas', '6565 Aliante Pkwy', 'NV'),
('ci0079', 'Gilbert', '6666 Heritage District', 'AZ'),
('ci0080', 'Madison', '6767 State St', 'WI'),
('ci0081', 'Lubbock', '6868 Buddy Holly Ave', 'TX'),
('ci0082', 'Irving', '6969 Cowboys Pkwy', 'TX'),
('ci0083', 'Fremont', '7070 Silicon Valley Rd', 'CA'),
('ci0084', 'San Bernardino', '7171 Arrowhead Ave', 'CA'),
('ci0085', 'Modesto', '7272 Central Valley Plaza', 'CA'),
('ci0086', 'Fontana', '7373 Sierra Ave', 'CA'),
('ci0087', 'Oxnard', '7474 Channel Islands Blvd', 'CA'),
('ci0088', 'Amarillo', '7575 Route 66', 'TX'),
('ci0089', 'Glendale', '7676 Brand Blvd', 'CA'),
('ci0090', 'Santa Clarita', '7777 Magic Mountain Pkwy', 'CA'),
('ci0091', 'McKinney', '7878 TPC Dr', 'TX'),
('ci0092', 'Frisco', '7979 Dallas North Tollway', 'TX'),
('ci0093', 'Pasadena', '8080 Rose Bowl Dr', 'CA'),
('ci0094', 'Salinas', '8181 Steinbeck Hwy', 'CA'),
('ci0095', 'Hayward', '8282 Mission Blvd', 'CA'),
('ci0096', 'Pomona', '8383 Fairplex Dr', 'CA'),
('ci0097', 'Sunnyvale', '8484 Innovation Way', 'CA'),
('ci0098', 'Torrance', '8585 Sepulveda Blvd', 'CA'),
('ci0099', 'Visalia', '8686 Akers Rd', 'CA'),
('ci0100', 'Concord', '8787 Willow Pass Rd', 'CA');






-- dim_store
INSERT INTO dim_store (StoreID, Phone, CityID)
VALUES 
('st0001', '123-456-7890', 'ci0001'),
('st0002', '234-567-8901', 'ci0001'),  
('st0003', '345-678-9012', 'ci0002'),
('st0004', '456-789-0123', 'ci0002'),  
('st0005', '567-890-1234', 'ci0003'),
('st0006', '678-901-2345', 'ci0003'),  
('st0007', '789-012-3456', 'ci0004'),
('st0008', '890-123-4567', 'ci0004'),  
('st0009', '901-234-5678', 'ci0005'),
('st0010', '012-345-6789', 'ci0005'),  
('st0011', '123-456-7891', 'ci0006'),
('st0012', '234-567-8902', 'ci0006'),  
('st0013', '345-678-9013', 'ci0007'),
('st0014', '456-789-0124', 'ci0007'),  
('st0015', '567-890-1235', 'ci0008'),
('st0016', '678-901-2346', 'ci0008'),  
('st0017', '789-012-3457', 'ci0009'),
('st0018', '890-123-4568', 'ci0009'),  
('st0019', '901-234-5679', 'ci0010'),
('st0020', '012-345-6790', 'ci0010'),  
('st0021', '123-456-7892', 'ci0011'),
('st0022', '234-567-8903', 'ci0011'),  
('st0023', '345-678-9014', 'ci0012'),
('st0024', '456-789-0125', 'ci0012'),  
('st0025', '567-890-1236', 'ci0013'),
('st0026', '678-901-2347', 'ci0013'),  
('st0027', '789-012-3458', 'ci0014'),
('st0028', '890-123-4569', 'ci0014'),  
('st0029', '901-234-5680', 'ci0015'),
('st0030', '012-345-6791', 'ci0015'),  
('st0031', '223-556-8900', 'ci0031'),
('st0032', '334-667-9001', 'ci0031'),
('st0033', '445-778-9002', 'ci0032'),
('st0034', '556-889-0003', 'ci0032'),
('st0035', '667-990-0004', 'ci0033'),
('st0036', '778-001-1115', 'ci0033'),
('st0037', '889-112-2226', 'ci0034'),
('st0038', '990-223-3337', 'ci0034'),
('st0039', '001-334-4448', 'ci0035'),
('st0040', '112-445-5559', 'ci0035'),
('st0041', '223-556-8900', 'ci0036'),
('st0042', '334-667-9001', 'ci0036'),
('st0043', '445-778-9002', 'ci0037'),
('st0044', '556-889-0003', 'ci0037'),
('st0045', '667-990-0004', 'ci0038'),
('st0046', '778-001-1115', 'ci0038'),
('st0047', '889-112-2226', 'ci0039'),
('st0048', '990-223-3337', 'ci0039'),
('st0049', '001-334-4448', 'ci0040'),
('st0050', '112-445-5559', 'ci0040'),
('st0051', '123-567-9012', 'ci0051'),
('st0052', '234-678-0123', 'ci0051'),
('st0053', '345-789-1234', 'ci0052'),
('st0054', '456-890-2345', 'ci0052'),
('st0055', '567-901-3456', 'ci0053'),
('st0056', '678-012-4567', 'ci0053'),
('st0057', '789-123-5678', 'ci0054'),
('st0058', '890-234-6789', 'ci0054'),
('st0059', '901-345-7890', 'ci0055'),
('st0060', '012-456-8901', 'ci0055'),
('st0061', '123-567-9013', 'ci0061'),
('st0062', '234-678-0124', 'ci0061'),
('st0063', '345-789-1235', 'ci0062'),
('st0064', '456-890-2346', 'ci0062'),
('st0065', '567-901-3457', 'ci0063'),
('st0066', '678-012-4568', 'ci0063'),
('st0067', '789-123-5679', 'ci0064'),
('st0068', '890-234-6790', 'ci0064'),
('st0069', '901-345-7891', 'ci0065'),
('st0070', '012-456-8902', 'ci0065'),
('st0071', '123-567-9014', 'ci0071'),
('st0072', '234-678-0125', 'ci0071'),
('st0073', '345-789-1236', 'ci0072'),
('st0074', '456-890-2347', 'ci0072'),
('st0075', '567-901-3458', 'ci0073'),
('st0076', '678-012-4569', 'ci0073'),
('st0077', '789-123-5680', 'ci0074'),
('st0078', '890-234-6791', 'ci0074'),
('st0079', '901-345-7892', 'ci0075'),
('st0080', '012-456-8903', 'ci0075'),
('st0081', '223-556-8904', 'ci0076'), 
('st0082', '334-667-9005', 'ci0076'),  
('st0083', '445-778-9006', 'ci0077'),
('st0084', '556-889-0007', 'ci0077'),  
('st0085', '667-990-0008', 'ci0078'),
('st0086', '778-001-1119', 'ci0078'),  
('st0087', '889-112-2230', 'ci0079'),
('st0088', '990-223-3341', 'ci0079'),  
('st0089', '001-334-4452', 'ci0080'),
('st0090', '112-445-5563', 'ci0080'),  
('st0091', '223-556-8905', 'ci0001'), 
('st0092', '334-667-9006', 'ci0002'),  
('st0093', '445-778-9007', 'ci0003'),
('st0094', '556-889-0008', 'ci0004'),  
('st0095', '667-990-0009', 'ci0005'),
('st0096', '778-001-1120', 'ci0006'),  
('st0097', '889-112-2231', 'ci0007'),
('st0098', '990-223-3342', 'ci0008'),  
('st0099', '001-334-4453', 'ci0009'),
('st0100', '112-445-5564', 'ci0010');




-- dim_item
INSERT INTO dim_item (ItemID, Description, Size, Weight, Price)
VALUES
('it0001', 'T-shirt cotton basic', 'M', 0.2, 15.99),
('it0002', 'Jeans slim fit', '32', 0.5, 49.99),
('it0003', 'Running shoes', '42', 1.0, 79.99),
('it0004', 'Leather wallet', 'One Size', 0.15, 39.99),
('it0005', 'Sports jacket', 'L', 1.2, 89.99),
('it0006', 'Hoodie with logo', 'M', 0.8, 29.99),
('it0007', 'Formal dress', 'S', 0.4, 129.99),
('it0008', 'Winter coat', 'L', 2.5, 149.99),
('it0009', 'Sunglasses', 'One Size', 0.1, 59.99),
('it0010', 'Laptop bag', 'One Size', 1.0, 45.99),
('it0011', 'Casual shirt', 'L', 0.3, 25.99),
('it0012', 'Leather belt', 'One Size', 0.2, 19.99),
('it0013', 'Workout leggings', 'M', 0.3, 39.99),
('it0014', 'Backpack', 'One Size', 1.5, 59.99),
('it0015', 'Formal shoes', '40', 1.2, 89.99),
('it0016', 'Sweater with pattern', 'L', 0.7, 39.99),
('it0017', 'Flannel shirt', 'M', 0.4, 29.99),
('it0018', 'Cargo pants', '34', 0.6, 39.99),
('it0019', 'Running shorts', 'M', 0.2, 19.99),
('it0020', 'Waterproof jacket', 'M', 1.0, 79.99),
('it0021', 'Knit scarf', 'One Size', 0.3, 19.99),
('it0022', 'Fleece jacket', 'L', 1.0, 49.99),
('it0023', 'Dress shoes', '42', 1.5, 69.99),
('it0024', 'Wool hat', 'One Size', 0.2, 15.99),
('it0025', 'Business suit', 'M', 1.3, 199.99),
('it0026', 'Sport shorts', 'L', 0.3, 24.99),
('it0027', 'Down jacket', 'XL', 2.0, 159.99),
('it0028', 'Running cap', 'One Size', 0.1, 14.99),
('it0029', 'Yoga mat', 'One Size', 1.5, 29.99),
('it0030', 'Tennis racket', 'One Size', 0.8, 99.99),
('it0031', 'Bluetooth headphones', 'One Size', 0.3, 89.99),
('it0032', 'Smartwatch', 'One Size', 0.2, 199.99),
('it0033', 'Mobile phone case', 'One Size', 0.1, 19.99),
('it0034', 'Tablet', 'One Size', 0.5, 249.99),
('it0035', 'Portable speaker', 'One Size', 0.8, 69.99),
('it0036', 'Electric razor', 'One Size', 0.2, 49.99),
('it0037', 'Coffee maker', 'One Size', 1.5, 59.99),
('it0038', 'Microwave oven', 'One Size', 12.0, 199.99),
('it0039', 'Blender', 'One Size', 1.0, 49.99),
('it0040', 'Air purifier', 'One Size', 4.0, 129.99),
('it0041', 'Electric kettle', 'One Size', 1.2, 39.99),
('it0042', 'Iron', 'One Size', 1.0, 29.99),
('it0043', 'Hair dryer', 'One Size', 0.5, 39.99),
('it0044', 'Washing machine', 'One Size', 50.0, 399.99),
('it0045', 'Refrigerator', 'One Size', 80.0, 499.99),
('it0046', 'Microwave', 'One Size', 10.0, 119.99),
('it0047', 'Cordless drill', 'One Size', 1.3, 79.99),
('it0048', 'Vacuum cleaner', 'One Size', 3.5, 159.99),
('it0049', 'Lawn mower', 'One Size', 20.0, 229.99),
('it0050', 'Electric screwdriver', 'One Size', 0.8, 29.99),
('it0051', 'Coffee grinder', 'One Size', 0.4, 39.99),
('it0052', 'Handheld vacuum', 'One Size', 0.7, 49.99),
('it0053', 'Camera tripod', 'One Size', 1.0, 59.99),
('it0054', 'Dumbbell set', 'One Size', 10.0, 99.99),
('it0055', 'Yoga ball', 'One Size', 2.0, 24.99),
('it0056', 'Treadmill', 'One Size', 30.0, 499.99),
('it0057', 'Exercise bike', 'One Size', 25.0, 399.99),
('it0058', 'Kettlebell set', 'One Size', 5.0, 79.99),
('it0059', 'Home gym kit', 'One Size', 15.0, 199.99),
('it0060', 'Massage gun', 'One Size', 1.2, 89.99),
('it0061', 'Smartphone charger', 'One Size', 0.1, 19.99),
('it0062', 'Laptop stand', 'One Size', 1.0, 29.99),
('it0063', 'Wireless mouse', 'One Size', 0.2, 14.99),
('it0064', 'Keyboard', 'One Size', 0.8, 39.99),
('it0065', 'Gaming headset', 'One Size', 0.4, 69.99),
('it0066', 'Webcam', 'One Size', 0.3, 49.99),
('it0067', 'Printer', 'One Size', 6.0, 129.99),
('it0068', 'External hard drive', '1TB', 0.5, 59.99),
('it0069', 'Memory card', '64GB', 0.1, 19.99),
('it0070', 'Router', 'One Size', 0.9, 49.99),
('it0071', 'TV remote', 'One Size', 0.1, 14.99),
('it0072', 'Digital camera', 'One Size', 0.7, 199.99),
('it0073', 'Projector', 'One Size', 3.5, 199.99),
('it0074', 'Smart light bulb', 'One Size', 0.1, 15.99),
('it0075', 'Solar charger', 'One Size', 0.4, 39.99),
('it0076', 'Electric fan', 'One Size', 2.0, 49.99),
('it0077', 'Stand mixer', 'One Size', 4.0, 249.99),
('it0078', 'Pressure cooker', 'One Size', 6.0, 79.99),
('it0079', 'Food processor', 'One Size', 3.0, 89.99),
('it0080', 'Rice cooker', 'One Size', 2.5, 59.99),
('it0081', 'Coffeemaker with grinder', 'One Size', 1.5, 79.99),
('it0082', 'Electric skillet', 'One Size', 1.8, 49.99),
('it0083', 'Sandwich maker', 'One Size', 1.2, 29.99),
('it0084', 'Hand blender', 'One Size', 0.6, 39.99),
('it0085', 'Toaster oven', 'One Size', 5.0, 99.99),
('it0086', 'Juicer', 'One Size', 1.0, 49.99),
('it0087', 'Coffee pods', 'One Size', 0.1, 14.99),
('it0088', 'Dishwasher', 'One Size', 50.0, 399.99),
('it0089', 'Freezer', 'One Size', 70.0, 499.99),
('it0090', 'Ice cream maker', 'One Size', 1.5, 59.99),
('it0091', 'Sewing machine', 'One Size', 6.0, 129.99),
('it0092', 'Wall clock', 'One Size', 0.5, 19.99),
('it0093', 'Alarm clock', 'One Size', 0.3, 15.99),
('it0094', 'Wireless charger', 'One Size', 0.2, 29.99),
('it0095', 'Smart thermostat', 'One Size', 0.5, 149.99),
('it0096', 'Digital thermometer', 'One Size', 0.1, 9.99),
('it0097', 'Electric toothbrush', 'One Size', 0.3, 39.99),
('it0098', 'Shower head', 'One Size', 1.0, 49.99),
('it0099', 'Shower curtain', 'One Size', 0.5, 19.99),
('it0100', 'Towel set', 'One Size', 1.2, 29.99),
('it0101', 'Shampoo', '500ml', 0.5, 9.99),
('it0102', 'Conditioner', '500ml', 0.5, 9.99),
('it0103', 'Body lotion', '300ml', 0.3, 12.99),
('it0104', 'Face cream', '100ml', 0.1, 14.99),
('it0105', 'Toothpaste', '100ml', 0.1, 3.99),
('it0106', 'Hand soap', '300ml', 0.3, 4.99),
('it0107', 'Deodorant', '150ml', 0.15, 5.99),
('it0108', 'Shaving cream', '200ml', 0.2, 6.99),
('it0109', 'Hair gel', '200ml', 0.2, 7.99),
('it0110', 'Nail polish', '15ml', 0.02, 4.99),
('it0111', 'Face wash', '150ml', 0.2, 8.99),
('it0112', 'Sunscreen', '200ml', 0.25, 15.99),
('it0113', 'Lip balm', '4g', 0.02, 2.99),
('it0114', 'Hair spray', '250ml', 0.3, 7.99),
('it0115', 'Perfume', '50ml', 0.05, 39.99),
('it0116', 'Toothbrush', 'One Size', 0.1, 2.99),
('it0117', 'Shaving razor', 'One Size', 0.1, 5.99),
('it0118', 'Cotton pads', '100pcs', 0.2, 3.99),
('it0119', 'Cotton swabs', '200pcs', 0.2, 2.99),
('it0120', 'Wet wipes', '80pcs', 0.3, 4.99),
('it0121', 'Bath sponge', 'One Size', 0.1, 2.99),
('it0122', 'Face mask', 'One Size', 0.05, 1.99),
('it0123', 'Hair comb', 'One Size', 0.05, 2.49),
('it0124', 'Toilet paper', '12 rolls', 1.0, 8.99),
('it0125', 'Paper towels', '6 rolls', 1.0, 5.99),
('it0126', 'Trash bags', '50pcs', 0.7, 4.99),
('it0127', 'Cleaning gloves', 'One Size', 0.1, 3.99),
('it0128', 'Dish soap', '500ml', 0.5, 3.99),
('it0129', 'All-purpose cleaner', '500ml', 0.6, 5.99),
('it0130', 'Window cleaner', '500ml', 0.6, 4.99),
('it0131', 'Floor cleaner', '1L', 1.0, 6.99),
('it0132', 'Dishwasher detergent', '1L', 1.1, 7.99),
('it0133', 'Laundry detergent', '1.5L', 1.6, 9.99),
('it0134', 'Fabric softener', '1L', 1.1, 7.99),
('it0135', 'Bleach', '1L', 1.2, 3.99),
('it0136', 'Air freshener', '300ml', 0.3, 4.49),
('it0137', 'Broom', 'One Size', 1.0, 7.99),
('it0138', 'Mop', 'One Size', 1.5, 9.99),
('it0139', 'Dustpan', 'One Size', 0.3, 2.99),
('it0140', 'Squeegee', 'One Size', 0.5, 3.99);

-- dim_customer
INSERT INTO dim_customer (CustomerID, CustomerName, IsTourist, IsMailCustomer, TourGuide, PostOfficeAddress, FirstOrderDate, CityID)
VALUES
('cu0001', 'John Doe', 0, 1, NULL, '123 Main Street', '2023-05-15', 'ci0001'),
('cu0002', 'Jane Smith', 1, 0, 'John Smith', NULL, '2022-11-10', 'ci0002'),
('cu0003', 'Mike Johnson', 0, 1, NULL, '456 Elm Street', '2024-01-22', 'ci0003'),
('cu0004', 'Emily Davis', 1, 1, NULL, NULL, '2023-06-18', 'ci0004'),
('cu0005', 'Michael Brown', 1, 0, 'Jane Doe', NULL, '2023-07-10', 'ci0005'),
('cu0006', 'Sarah Wilson', 0, 1, NULL, '789 Pine Avenue', '2022-10-08', 'ci0006'),
('cu0007', 'David Lee', 0, 1, NULL, '101 Maple Drive', '2024-02-12', 'ci0007'),
('cu0008', 'Linda Martinez', 1, 1, NULL, NULL, '2023-05-03', 'ci0008'),
('cu0009', 'James Garcia', 1, 0, 'David Johnson', NULL, '2023-01-17', 'ci0009'),
('cu0010', 'Patricia Taylor', 1, 1, NULL, NULL, '2023-04-26', 'ci0010'),
('cu0011', 'Robert Anderson', 1, 1, 'Laura Brown', '202 Oak Road', '2022-12-14', 'ci0011'),
('cu0012', 'Mary Thomas', 0, 1, NULL, '303 Birch Blvd', '2024-03-21', 'ci0012'),
('cu0013', 'Charles Jackson', 1, 1, NULL, NULL, '2022-09-01', 'ci0013'),
('cu0014', 'Jessica White', 1, 0, 'Emily White', NULL, '2023-08-15', 'ci0014'),
('cu0015', 'William Harris', 0, 1, NULL, '404 Cedar St', '2023-11-22', 'ci0015'),
('cu0016', 'Daniel Clark', 1, 1, NULL, NULL, '2023-07-05', 'ci0016'),
('cu0017', 'Nancy Lewis', 1, 0, 'Michael Clark', NULL, '2023-02-25', 'ci0017'),
('cu0018', 'Steven Walker', 1, 1, NULL, NULL, '2023-12-11', 'ci0018'),
('cu0019', 'Laura Young', 1, 0, 'Sarah Harris', NULL, '2024-01-05', 'ci0019'),
('cu0020', 'Kevin King', 1, 1, NULL, NULL, '2023-06-25', 'ci0020'),
('cu0021', 'Brian Scott', 0, 1, NULL, '505 Walnut Ln', '2023-04-12', 'ci0021'),
('cu0022', 'Deborah Adams', 1, 1, 'James Wilson', '606 Ash Way', '2024-03-10', 'ci0022'),
('cu0023', 'Richard Nelson', 1, 1, NULL, NULL, '2023-08-20', 'ci0023'),
('cu0024', 'Joseph Harris', 0, 1, NULL, '707 Spruce Court', '2023-09-16', 'ci0024'),
('cu0025', 'Susan Martinez', 1, 0, 'Patricia Lewis', NULL, '2023-07-30', 'ci0025'),
('cu0026', 'Gary Thompson', 1, 1, NULL, NULL, '2022-11-06', 'ci0026'),
('cu0027', 'Sharon Robinson', 0, 1, NULL, '808 Cherry Path', '2024-02-18', 'ci0027'),
('cu0028', 'Matthew Clark', 1, 0, 'Robert Hall', NULL, '2022-12-29', 'ci0028'),
('cu0029', 'Rebecca Walker', 0, 1, NULL, '909 Redwood Dr', '2024-04-02', 'ci0029'),
('cu0030', 'Edward Hall', 1, 0, 'Jennifer Walker', NULL, '2023-03-22', 'ci0030'),
('cu0031', 'Kimberly Allen', 1, 1, NULL, NULL, '2022-10-27', 'ci0031'),
('cu0032', 'John Lewis', 1, 1, 'Charles Young', '1001 Willow Ave', '2023-09-11', 'ci0032'),
('cu0033', 'Joshua Robinson', 1, 1, NULL, NULL, '2023-05-14', 'ci0033'),
('cu0034', 'Amanda Mitchell', 0, 1, NULL, '1102 Palm Grove', '2022-08-03', 'ci0034'),
('cu0035', 'Thomas Perez', 1, 0, 'Angela Green', NULL, '2023-12-01', 'ci0035'),
('cu0036', 'Sandra Harris', 1, 1, NULL, NULL, '2024-03-17', 'ci0036'),
('cu0037', 'Paul Edwards', 0, 1, NULL, '1203 Pineview', '2023-02-05', 'ci0037'),
('cu0038', 'Betty Collins', 1, 0, 'Matthew Thompson', NULL, '2023-07-18', 'ci0038'),
('cu0039', 'Christine Cooper', 1, 1, NULL, NULL, '2023-09-25', 'ci0039'),
('cu0040', 'George Morris', 1, 0, 'Doris King', NULL, '2022-10-12', 'ci0040'),
('cu0041', 'Angela Gonzalez', 1, 1, NULL, NULL, '2023-04-23', 'ci0041'),
('cu0042', 'Randy Perez', 1, 1, 'Joshua Anderson', '1304 Cedar Loop', '2022-12-06', 'ci0042'),
('cu0043', 'Barbara Green', 1, 1, NULL, NULL, '2023-01-30', 'ci0043'),
('cu0044', 'Henry King', 0, 1, NULL, '1405 Maple Trail', '2023-07-23', 'ci0044'),
('cu0045', 'Doris Carter', 1, 0, 'William Robinson', NULL, '2024-01-13', 'ci0045'),
('cu0046', 'Evelyn Mitchell', 0, 1, NULL, '1506 Oak Ridge', '2023-02-19', 'ci0046'),
('cu0047', 'Steven Carter', 1, 0, 'Kimberly Moore', NULL, '2023-05-08', 'ci0047'),
('cu0048', 'Betty Wilson', 1, 1, NULL, NULL, '2024-02-07', 'ci0048'),
('cu0049', 'Albert Young', 0, 1, NULL, '1607 Elm Square', '2023-11-30', 'ci0049'),
('cu0050', 'Gloria Wright', 1, 0, 'Joseph Scott', NULL, '2022-07-20', 'ci0050'),
('cu0051', 'Juan Hernandez', 1, 1, NULL, NULL, '2023-03-01', 'ci0051'),
('cu0052', 'Alicia Torres', 1, 1, 'Maria Rodriguez', '1708 Pinecrest Dr', '2022-09-28', 'ci0052'),
('cu0053', 'Jesse Sanchez', 0, 1, NULL, '1809 Willow Creek', '2024-04-05', 'ci0053'),
('cu0054', 'Michelle Garcia', 1, 0, 'David Martinez', NULL, '2023-10-19', 'ci0054'),
('cu0055', 'Robert Perez', 1, 1, NULL, NULL, '2023-08-08', 'ci0055'),
('cu0056', 'Stephanie Flores', 1, 0, 'Carlos Ramirez', NULL, '2024-01-28', 'ci0056'),
('cu0057', 'Daniel Kim', 0, 1, NULL, '1910 Oak Tree Ln', '2023-06-03', 'ci0057'),
('cu0058', 'Jessica Nguyen', 1, 0, 'Linda Perez', NULL, '2022-12-22', 'ci0058'),
('cu0059', 'Christopher Lee', 1, 1, NULL, NULL, '2023-11-12', 'ci0059'),
('cu0060', 'Angela Patel', 1, 1, 'Amit Patel', '2011 River Bend', '2023-05-20', 'ci0060'),
('cu0061', 'Brian Davis', 0, 1, NULL, '2112 Hillside Ave', '2022-08-10', 'ci0061'),
('cu0062', 'Laura Rodriguez', 1, 0, 'Juan Hernandez', NULL, '2024-02-10', 'ci0062'),
('cu0063', 'Kevin Wilson', 1, 1, NULL, NULL, '2023-01-02', 'ci0063'),
('cu0064', 'Melissa Anderson', 1, 0, 'Alicia Torres', NULL, '2023-09-07', 'ci0064'),
('cu0065', 'Eric Thomas', 1, 1, NULL, NULL, '2022-11-18', 'ci0065'),
('cu0066', 'Nicole Jackson', 1, 1, 'Jesse Sanchez', '2213 Summit Rd', '2024-03-25', 'ci0066'),
('cu0067', 'Jason White', 0, 1, NULL, '2314 Valley View', '2023-04-18', 'ci0067'),
('cu0068', 'Stephanie Harris', 1, 0, 'Michelle Garcia', NULL, '2022-07-12', 'ci0068'),
('cu0069', 'Timothy Clark', 1, 1, NULL, NULL, '2023-10-01', 'ci0069'),
('cu0070', 'Carolyn Lewis', 1, 0, 'Robert Perez', NULL, '2023-12-28', 'ci0070'),
('cu0071', 'Jeffrey Martinez', 1, 1, NULL, NULL, '2024-04-10', 'ci0071'),
('cu0072', 'Amanda Garcia', 1, 1, 'Daniel Kim', '2415 Canyon Way', '2023-08-12', 'ci0072'),
('cu0073', 'Benjamin Rodriguez', 0, 1, NULL, '2516 Sunset Blvd', '2023-02-22', 'ci0073'),
('cu0074', 'Elizabeth Perez', 1, 0, 'Jessica Nguyen', NULL, '2022-09-19', 'ci0074'),
('cu0075', 'Samuel Wilson', 1, 1, NULL, NULL, '2023-03-08', 'ci0075'),
('cu0076', 'Kimberly Garcia', 1, 0, 'Christopher Lee', NULL, '2024-01-08', 'ci0076'),
('cu0077', 'David Martinez', 0, 1, NULL, '2617 Ocean Ave', '2023-05-01', 'ci0077'),
('cu0078', 'Jennifer Rodriguez', 1, 0, 'Angela Patel', NULL, '2022-12-15', 'ci0078'),
('cu0079', 'Michael Perez', 1, 1, NULL, NULL, '2023-11-05', 'ci0079'),
('cu0080', 'Linda Garcia', 1, 1, 'Brian Davis', '2718 Park Pl', '2023-05-17', 'ci0080'),
('cu0081', 'David Smith', 0, 1, NULL, '2819 River Rd', '2023-01-10', 'ci0081'),
('cu0082', 'Jennifer Brown', 1, 0, 'Sarah Williams', NULL, '2022-10-20', 'ci0082'),
('cu0083', 'Michael Davis', 1, 1, NULL, NULL, '2024-02-01', 'ci0083'),
('cu0084', 'Jessica Garcia', 1, 1, 'Robert Johnson', '2920 Lakeview Dr', '2023-07-15', 'ci0084'),
('cu0085', 'Christopher Rodriguez', 0, 1, NULL, '3021 Hillcrest Ave', '2022-09-05', 'ci0085'),
('cu0086', 'Angela Williams', 1, 0, 'David Martinez', NULL, '2023-03-01', 'ci0086'),
('cu0087', 'Brian Johnson', 1, 1, NULL, NULL, '2024-01-20', 'ci0087'),
('cu0088', 'Laura Martinez', 1, 1, 'Linda Garcia', '3122 Forest Ln', '2023-06-10', 'ci0088'),
('cu0089', 'Kevin Rodriguez', 0, 1, NULL, '3223 Meadow St', '2022-12-01', 'ci0089'),
('cu0090', 'Melissa Williams', 1, 0, 'Michael Brown', NULL, '2023-08-25', 'ci0090'),
('cu0091', 'Eric Garcia', 1, 1, NULL, NULL, '2023-02-15', 'ci0091'),
('cu0092', 'Nicole Martinez', 1, 1, 'Jennifer Brown', '3324 Valley Rd', '2024-03-01', 'ci0092'),
('cu0093', 'Jason Rodriguez', 0, 1, NULL, '3425 Canyon Rd', '2022-11-25', 'ci0093'),
('cu0094', 'Stephanie Williams', 1, 0, 'Christopher Rodriguez', NULL, '2023-09-10', 'ci0094'),
('cu0095', 'Timothy Johnson', 1, 1, NULL, NULL, '2023-04-01', 'ci0095'),
('cu0096', 'Carolyn Martinez', 1, 1, 'Angela Williams', '3526 Summit Ave', '2024-02-05', 'ci0096'),
('cu0097', 'Jeffrey Rodriguez', 0, 1, NULL, '3627 Parkview Dr', '2022-10-05', 'ci0097'),
('cu0098', 'Amanda Williams', 1, 0, 'Brian Johnson', NULL, '2023-07-01', 'ci0098'),
('cu0099', 'Benjamin Garcia', 1, 1, NULL, NULL, '2023-12-05', 'ci0099'),
('cu0100', 'Elizabeth Martinez', 1, 1, 'Laura Martinez', '3728 Creek Rd', '2023-05-22', 'ci0100'),
('cu0101', 'Samuel Smith', 0, 1, NULL, '3829 Ridgeview Rd', '2023-01-18', 'ci0001'),
('cu0102', 'Olivia Johnson', 1, 0, 'David Smith', NULL, '2022-10-28', 'ci0002'),
('cu0103', 'Ethan Williams', 1, 1, NULL, NULL, '2024-02-08', 'ci0003'),
('cu0104', 'Sophia Garcia', 1, 1, 'Jennifer Brown', '3930 Valley View Cir', '2023-07-20', 'ci0004'),
('cu0105', 'Alexander Rodriguez', 0, 1, NULL, '4031 Sunset Ter', '2022-09-10', 'ci0005'),
('cu0106', 'Isabella Martinez', 1, 0, 'Michael Davis', NULL, '2023-03-05', 'ci0006'),
('cu0107', 'William Brown', 1, 1, NULL, NULL, '2024-01-25', 'ci0007'),
('cu0108', 'Mia Davis', 1, 1, 'Jessica Garcia', '4132 Hillside Ln', '2023-06-15', 'ci0008'),
('cu0109', 'James Wilson', 0, 1, NULL, '4233 Meadowbrook Rd', '2022-11-01', 'ci0009'),
('cu0110', 'Ava Garcia', 1, 0, 'Christopher Rodriguez', NULL, '2023-08-30', 'ci0010'),
('cu0111', 'Daniel Rodriguez', 1, 1, NULL, NULL, '2023-02-20', 'ci0011'),
('cu0112', 'Chloe Martinez', 1, 1, 'Angela Williams', '4334 Ridge Rd', '2024-03-05', 'ci0012'),
('cu0113', 'Joseph Brown', 0, 1, NULL, '4435 Creekview Dr', '2022-08-15', 'ci0013'),
('cu0114', 'Abigail Davis', 1, 0, 'Brian Johnson', NULL, '2023-12-05', 'ci0014'),
('cu0115', 'David Garcia', 1, 1, NULL, NULL, '2023-07-01', 'ci0015'),
('cu0116', 'Emily Rodriguez', 1, 0, 'Laura Martinez', NULL, '2024-04-01', 'ci0016'),
('cu0117', 'Ryan Martinez', 0, 1, NULL, '4536 Summit Ave', '2023-09-01', 'ci0017'),
('cu0118', 'Madison Brown', 1, 0, 'Eric Garcia', NULL, '2022-10-01', 'ci0018'),
('cu0119', 'Nathan Davis', 1, 1, NULL, NULL, '2023-01-01', 'ci0019'),
('cu0120', 'Hannah Garcia', 1, 1, 'Nicole Martinez', '4637 Park Pl', '2023-05-25', 'ci0020'),
('cu0121', 'Samuel Smith', 0, 1, NULL, '4738 River Rd', '2023-01-18', 'ci0021'),
('cu0122', 'Olivia Johnson', 1, 0, 'David Smith', NULL, '2022-10-28', 'ci0022'),
('cu0123', 'Ethan Williams', 1, 1, NULL, NULL, '2024-02-08', 'ci0023'),
('cu0124', 'Sophia Garcia', 1, 1, 'Jennifer Brown', '4839 Lakeview Dr', '2023-07-20', 'ci0024'),
('cu0125', 'Alexander Rodriguez', 0, 1, NULL, '4940 Hillcrest Ave', '2022-09-10', 'ci0025'),
('cu0126', 'Isabella Martinez', 1, 0, 'Michael Davis', NULL, '2023-03-05', 'ci0026'),
('cu0127', 'William Brown', 1, 1, NULL, NULL, '2024-01-25', 'ci0027'),
('cu0128', 'Mia Davis', 1, 1, 'Jessica Garcia', '5041 Forest Ln', '2023-06-15', 'ci0028'),
('cu0129', 'James Wilson', 0, 1, NULL, '5142 Meadow St', '2022-11-01', 'ci0029'),
('cu0130', 'Ava Garcia', 1, 0, 'Christopher Rodriguez', NULL, '2023-08-30', 'ci0030'),
('cu0131', 'Daniel Rodriguez', 1, 1, NULL, NULL, '2023-02-20', 'ci0031'),
('cu0132', 'Chloe Martinez', 1, 1, 'Angela Williams', '5243 Valley Rd', '2024-03-05', 'ci0032'),
('cu0133', 'Joseph Brown', 0, 1, NULL, '5344 Canyon Rd', '2022-08-15', 'ci0033'),
('cu0134', 'Abigail Davis', 1, 0, 'Brian Johnson', NULL, '2023-12-05', 'ci0034'),
('cu0135', 'David Garcia', 1, 1, NULL, NULL, '2023-07-01', 'ci0035');




-- fact_inventory
DECLARE @TESTCASE_QUANTITY INT = 100 -- lấy khoảng 100 dữ liệu order ngẫu nhiên
DECLARE @i INT = 0
WHILE @i < @TESTCASE_QUANTITY
BEGIN
-- Lấy ngẫu nhiên CustomerID và TimeID
DECLARE @StoreID VARCHAR(10) = (SELECT TOP 1 StoreID FROM dim_store ORDER BY NEWID());
DECLARE @TimeID VARCHAR(10) = (SELECT TOP 1 TimeID FROM dim_time ORDER BY NEWID());
DECLARE @ItemID VARCHAR(10) = (SELECT TOP 1 ItemID FROM dim_item ORDER BY NEWID());
DECLARE @QuantityInStock INT = FLOOR(RAND() * 100) + 1;
-- Cập nhật lại tổng tiền cho đơn hàng
insert into fact_inventory(QuantityInStock, StoreID, ItemID, TimeID)
values (@QuantityInStock, @StoreID, @ItemID, @TimeID);
SET @i = @i + 1;
END;
-- HOẶC Tất cả Store với tất cả item
INSERT INTO fact_inventory (StoreID, ItemID, TimeID, QuantityInStock)
SELECT 
    s.StoreID,
    i.ItemID,
    t.TimeID,
    FLOOR(RAND(CHECKSUM(NEWID())) * 100) + 1 AS QuantityInStock
FROM dim_store s
CROSS JOIN dim_item i
CROSS JOIN (SELECT TOP 1 TimeID FROM dim_time ORDER BY NEWID()) t;



-- fact_order
-- Chèn vào bảng fact_order & fact_order_detail

use warehouse;

DECLARE @TESTCASE_QUANTITY INT = 2000
DECLARE @i INT = 0
WHILE @i < @TESTCASE_QUANTITY
BEGIN

    DECLARE @OrderID VARCHAR(10) = CAST((SELECT ISNULL(MAX(CAST(OrderID AS INT)), 0) + 1 FROM fact_order) AS VARCHAR(10));
    DECLARE @TotalAmount DECIMAL(18, 2) = 0;

    -- Lấy ngẫu nhiên CustomerID và TimeID
    DECLARE @CustomerID VARCHAR(10) = (SELECT TOP 1 CustomerID FROM dim_customer ORDER BY NEWID());
	DECLARE @CityID VARCHAR(10) = (SELECT CityID FROM dim_customer WHERE CustomerID = @CustomerID); -- Lấy CityID từ dim_customer dựa trên CustomerID đã chọn
	DECLARE @StoreID VARCHAR(10) = (SELECT TOP 1 StoreID FROM dim_store WHERE CityID = @CityID ORDER BY NEWID()); -- Lấy StoreID từ dim_store dựa trên CityID
    DECLARE @TimeID VARCHAR(10) = (SELECT TOP 1 TimeID FROM dim_time ORDER BY NEWID());

    -- Trước tiên, tạo đơn hàng với tổng tiền = 0
    INSERT INTO fact_order (OrderID, TotalAmount, CustomerID, TimeID, StoreID)
    VALUES (@OrderID, @TotalAmount, @CustomerID, @TimeID,  @StoreID);

    -- Lặp qua các sản phẩm và thêm chi tiết
    DECLARE @Counter INT = 0;
    DECLARE @LoopCount INT = FLOOR(RAND() * 10) + 1;
    WHILE @Counter < @LoopCount
    BEGIN
        DECLARE @ItemID VARCHAR(10) = (SELECT TOP 1 ItemID FROM fact_inventory ORDER BY NEWID()); -- Lưu ý là phải lấy item từ trong fact_inventory
        DECLARE @UnitPrice DECIMAL(18, 2) = (SELECT Price FROM dim_item WHERE ItemID = @ItemID);
        DECLARE @Quantity INT = ROUND((RAND() * 10) + 1, 2);
        DECLARE @LineTotal DECIMAL(18, 2) = @UnitPrice * @Quantity;

		INSERT INTO fact_order_detail(Quantity, UnitPrice, LineTotal, OrderID, ItemID)
		VALUES (@Quantity, @UnitPrice, @LineTotal, @OrderID, @ItemID);

        SET @TotalAmount = @TotalAmount + @LineTotal;
        SET @Counter = @Counter + 1;
    END;
    -- Cập nhật lại tổng tiền cho đơn hàng
    UPDATE fact_order
    SET TotalAmount = @TotalAmount
    WHERE OrderID = @OrderID;
    SET @i = @i + 1;
END;






-- Xóa dữ liệu bảng chi tiết đơn hàng trước (do có khóa ngoại tới fact_order)
DELETE FROM fact_order_detail;

-- Sau đó xóa bảng đơn hàng
DELETE FROM fact_order;

DELETE FROM fact_inventory;

SELECT * FROM fact_order WHERE OrderID = 1235

SELECT * FROM fact_order_detail WHERE OrderID = 1235
