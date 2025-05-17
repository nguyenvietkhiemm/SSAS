// src/App.tsx
// "use client"

// // import { useState } from "react"
// // import { Card } from "./components/ui/card"
// // import { Button } from "./components/ui/button"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
// // import { Label } from "./components/ui/label"
// // import { ChevronDown, ChevronUp, RotateCw, Scissors } from 'lucide-react'

// type DrillLevel = {
//   product: number;
//   location: number;
//   customer: number;
//   time: number;
// };

// type Filters = {
//   time: string;
//   productLevel: string;
//   locationLevel: string;
//   customerLevel: string;
//   productCategory?: string;
//   state?: string;
//   customerType?: string;
// };

// type Dimensions = {
//   rows: string;
//   columns: string;
//   filters: Filters;
// };

// type CurrentView = {
//   measure: string;
//   dimensions: Dimensions;
//   drillLevel: DrillLevel;
// };

// type ViewData = {
//   headers: string[];
//   rows: {
//     dimension: string;
//     values: number[];
//   }[];
// };


// export default function OLAPOperations() {
//   // Mô phỏng dữ liệu kho dữ liệu
//   const initialData = {
//     dimensions: {
//       time: ["Q1-2023", "Q2-2023", "Q3-2023", "Q4-2023"],
//       location: {
//         states: ["California", "New York", "Texas", "Florida"],
//         cities: {
//           California: ["Los Angeles", "San Francisco", "San Diego"],
//           "New York": ["New York City", "Buffalo", "Albany"],
//           Texas: ["Houston", "Dallas", "Austin"],
//           Florida: ["Miami", "Orlando", "Tampa"],
//         },
//       },
//       product: {
//         categories: ["Electronics", "Clothing", "Home Goods", "Books"],
//         items: {
//           Electronics: ["Laptop", "Smartphone", "Tablet", "Headphones"],
//           Clothing: ["Shirts", "Pants", "Jackets", "Shoes"],
//           "Home Goods": ["Furniture", "Kitchenware", "Bedding", "Decor"],
//           Books: ["Fiction", "Non-fiction", "Educational", "Children's"],
//         },
//       },
//       customer: {
//         types: ["Tourist", "Mail Order", "Both"],
//         segments: {
//           Tourist: ["Group Tour", "Individual", "Business"],
//           "Mail Order": ["Regular", "Premium", "New"],
//           Both: ["VIP", "Standard"],
//         },
//       },
//     },
//     facts: {
//       // Mô phỏng dữ liệu bán hàng
//       sales: [
//         // Cấu trúc: [Thời gian][Bang][Thành phố][Loại sản phẩm][Sản phẩm][Loại khách hàng]
//         // Q1-2023
//         [
//           // California
//           [
//             // Los Angeles
//             [
//               // Electronics
//               [
//                 // Laptop, Smartphone, Tablet, Headphones
//                 [
//                   // Tourist, Mail Order, Both
//                   [120000, 85000, 45000],
//                   [95000, 110000, 30000],
//                   [75000, 65000, 25000],
//                   [45000, 35000, 15000],
//                 ],
//                 // Clothing
//                 [
//                   [65000, 45000, 25000],
//                   [55000, 65000, 20000],
//                   [40000, 35000, 15000],
//                   [25000, 20000, 10000],
//                 ],
//                 // Và các loại sản phẩm khác...
//               ],
//             ],
//             // Và các thành phố khác...
//           ],
//           // Và các bang khác...
//         ],
//         // Và các quý khác...
//       ],
//       inventory: [
//         // Cấu trúc tương tự như sales
//       ],
//       orders: [
//         // Cấu trúc tương tự như sales
//       ],
//     },
//   }

//   // State cho view hiện tại
//   const [currentView, setCurrentView] = useState<CurrentView>({
//     measure: "sales", // sales, inventory, orders
//     dimensions: {
//       rows: "product", // product, location, customer, time
//       columns: "location", // product, location, customer, time
//       filters: {
//         time: "Q1-2023",
//         productLevel: "categories", // categories, items
//         locationLevel: "states", // states, cities
//         customerLevel: "types", // types, segments
//       },
//     },
//     drillLevel: {
//       product: 0, // 0: categories, 1: items
//       location: 0, // 0: states, 1: cities
//       customer: 0, // 0: types, 1: segments
//       time: 0, // 0: quarters, 1: months
//     },
//   })

//   // Mô phỏng dữ liệu hiển thị
//   const getViewData = (): ViewData => {
//     const { rows, columns, filters } = currentView.dimensions;
    
//     const getDimensionValues = (dimension: keyof DimensionsData, level: number): string[] => {
//       switch (dimension) {
//         case "product":
//           if (level === 0) {
//             return initialData.dimensions.product.categories;
//           } else {
//             const category = filters.productCategory || "Electronics";
//             return initialData.dimensions.product.items[category] || [];
//           }
        
//         case "location":
//           if (level === 0) {
//             return initialData.dimensions.location.states;
//           } else {
//             const state = filters.state || "California";
//             return initialData.dimensions.location.cities[state] || [];
//           }
        
//         case "customer":
//           if (level === 0) {
//             return initialData.dimensions.customer.types;
//           } else {
//             const type = filters.customerType || "Tourist";
//             return initialData.dimensions.customer.segments[type] || [];
//           }
        
//         case "time":
//           return initialData.dimensions.time;
        
//         default:
//           return [];
//       }
//     };

//     const rowDimension = getDimensionValues(rows, currentView.drillLevel[rows]);
//     const columnDimension = getDimensionValues(columns, currentView.drillLevel[columns]);

//     const tableData = rowDimension.map((row) => ({
//       dimension: row,
//       values: columnDimension.map(() => Math.floor(Math.random() * 100000) + 10000),
//     }));

//     return {
//       headers: columnDimension,
//       rows: tableData,
//     };
//   };

//   // Các phép toán OLAP
//   const drillDown = (dimension: keyof DrillLevel) => {
//     if (currentView.drillLevel[dimension] < 1) {
//       const newDrillLevel = { ...currentView.drillLevel }
//       newDrillLevel[dimension] = 1

//       // Cập nhật filter nếu cần
//       const newFilters = { ...currentView.dimensions.filters }
//       if (dimension === "product") {
//         newFilters.productCategory = initialData.dimensions.product.categories[0]
//       } else if (dimension === "location") {
//         newFilters.state = initialData.dimensions.location.states[0]
//       } else if (dimension === "customer") {
//         newFilters.customerType = initialData.dimensions.customer.types[0]
//       }

//       setCurrentView({
//         ...currentView,
//         drillLevel: newDrillLevel,
//         dimensions: {
//           ...currentView.dimensions,
//           filters: newFilters,
//         },
//       })
//     }
//   }

//   const rollUp = (dimension: keyof DrillLevel) => {
//     if (currentView.drillLevel[dimension] > 0) {
//       const newDrillLevel = { ...currentView.drillLevel }
//       newDrillLevel[dimension] = 0

//       setCurrentView({
//         ...currentView,
//         drillLevel: newDrillLevel,
//       })
//     }
//   }

//   const slice = (dimension: keyof Filters, value: string) => {
//     const newFilters = { ...currentView.dimensions.filters }
//     newFilters[dimension] = value

//     setCurrentView({
//       ...currentView,
//       dimensions: {
//         ...currentView.dimensions,
//         filters: newFilters,
//       },
//     })
//   }

//   const pivot = () => {
//     const { rows, columns } = currentView.dimensions

//     setCurrentView({
//       ...currentView,
//       dimensions: {
//         ...currentView.dimensions,
//         rows: columns,
//         columns: rows,
//       },
//     })
//   }

//   const changeMeasure = (measure: string) => {
//     setCurrentView({
//       ...currentView,
//       measure,
//     })
//   }

//   // Lấy dữ liệu hiện tại
//   const viewData = getViewData()

//   // Xác định tiêu đề cho các chiều
//   const getDimensionTitle = (dimension: string): string => {
//     switch (dimension) {
//       case "product":
//         return "Sản phẩm"
//       case "location":
//         return "Địa điểm"
//       case "customer":
//         return "Khách hàng"
//       case "time":
//         return "Thời gian"
//       default:
//         return dimension
//     }
//   }

//   // Xác định tiêu đề cho các phép đo
//   const getMeasureTitle = (measure: string): string => {
//     switch (measure) {
//       case "sales":
//         return "Doanh số"
//       case "inventory":
//         return "Tồn kho"
//       case "orders":
//         return "Đơn hàng"
//       default:
//         return measure
//     }
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Phân tích OLAP cho Hệ thống Đặt hàng</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card className="p-4">
//           <div className="flex flex-col space-y-2">
//             <h3 className="font-medium flex items-center">
//               <ChevronDown className="mr-2 h-4 w-4" />
//               Khoan xuống (Drill Down)
//             </h3>
//             <p className="text-sm text-gray-500">Xem chi tiết hơn theo chiều</p>
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               <Button
//                 onClick={() => drillDown("product")}
//                 disabled={currentView.drillLevel.product > 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Sản phẩm
//               </Button>
//               <Button
//                 onClick={() => drillDown("location")}
//                 disabled={currentView.drillLevel.location > 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Địa điểm
//               </Button>
//               <Button
//                 onClick={() => drillDown("customer")}
//                 disabled={currentView.drillLevel.customer > 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Khách hàng
//               </Button>
//               <Button
//                 onClick={() => drillDown("time")}
//                 disabled={currentView.drillLevel.time > 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Thời gian
//               </Button>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex flex-col space-y-2">
//             <h3 className="font-medium flex items-center">
//               <ChevronUp className="mr-2 h-4 w-4" />
//               Cuộn lên (Roll Up)
//             </h3>
//             <p className="text-sm text-gray-500">Tổng hợp dữ liệu lên mức cao hơn</p>
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               <Button
//                 onClick={() => rollUp("product")}
//                 disabled={currentView.drillLevel.product === 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Sản phẩm
//               </Button>
//               <Button
//                 onClick={() => rollUp("location")}
//                 disabled={currentView.drillLevel.location === 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Địa điểm
//               </Button>
//               <Button
//                 onClick={() => rollUp("customer")}
//                 disabled={currentView.drillLevel.customer === 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Khách hàng
//               </Button>
//               <Button
//                 onClick={() => rollUp("time")}
//                 disabled={currentView.drillLevel.time === 0}
//                 variant="outline"
//                 size="sm"
//               >
//                 Thời gian
//               </Button>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex flex-col space-y-2">
//             <h3 className="font-medium flex items-center">
//               <Scissors className="mr-2 h-4 w-4" />
//               Chiếu chọn (Slice and Dice)
//             </h3>
//             <p className="text-sm text-gray-500">Lọc và chọn dữ liệu</p>
//             <div className="flex flex-col space-y-2 mt-2">
//               <Select value={currentView.dimensions.filters.time} onValueChange={(value) => slice("time", value)}>
//                 <SelectTrigger className="h-8">
//                   <SelectValue placeholder="Chọn thời gian" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {initialData.dimensions.time.map((time) => (
//                     <SelectItem key={time} value={time}>
//                       {time}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={currentView.measure} onValueChange={changeMeasure}>
//                 <SelectTrigger className="h-8">
//                   <SelectValue placeholder="Chọn phép đo" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="sales">Doanh số</SelectItem>
//                   <SelectItem value="inventory">Tồn kho</SelectItem>
//                   <SelectItem value="orders">Đơn hàng</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex flex-col space-y-2">
//             <h3 className="font-medium flex items-center">
//               <RotateCw className="mr-2 h-4 w-4" />
//               Xoay (Pivot)
//             </h3>
//             <p className="text-sm text-gray-500">Xoay bảng (đổi hàng và cột)</p>
//             <div className="flex flex-col space-y-2 mt-2">
//               <div className="flex items-center justify-between">
//                 <Label>Hàng:</Label>
//                 <span className="font-medium">{getDimensionTitle(currentView.dimensions.rows)}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <Label>Cột:</Label>
//                 <span className="font-medium">{getDimensionTitle(currentView.dimensions.columns)}</span>
//               </div>
//               <Button onClick={pivot} variant="outline" className="mt-2">
//                 Xoay bảng
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <Card className="p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           {getMeasureTitle(currentView.measure)} - {currentView.dimensions.filters.time}
//         </h2>

//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[150px]">{getDimensionTitle(currentView.dimensions.rows)}</TableHead>
//                 {viewData.headers.map((header) => (
//                   <TableHead key={header} className="text-center">
//                     {header}
//                   </TableHead>
//                 ))}
//                 <TableHead className="text-center">Tổng</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {viewData.rows.map((row) => (
//                 <TableRow key={row.dimension}>
//                   <TableCell className="font-medium">{row.dimension}</TableCell>
//                   {row.values.map((value, index) => (
//                     <TableCell key={index} className="text-center">
//                       {value.toLocaleString()}
//                     </TableCell>
//                   ))}
//                   <TableCell className="text-center font-medium">
//                     {row.values.reduce((sum, val) => sum + val, 0).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//               <TableRow>
//                 <TableCell className="font-medium">Tổng</TableCell>
//                 {viewData.headers.map((_, colIndex) => (
//                   <TableCell key={colIndex} className="text-center font-medium">
//                     {viewData.rows.reduce((sum, row) => sum + row.values[colIndex], 0).toLocaleString()}
//                   </TableCell>
//                 ))}
//                 <TableCell className="text-center font-bold">
//                   {viewData.rows
//                     .flatMap((row) => row.values)
//                     .reduce((sum, val) => sum + val, 0)
//                     .toLocaleString()}
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </div>
//       </Card>
//     </div>
//   )
// }

// src/App.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "./components/ui/card"
// import { Input } from "./components/ui/input" // Giả sử bạn có component Input từ Shadcn UI
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Label } from "./components/ui/label"

// Kiểu dữ liệu động cho item từ API
type ApiDataItem = {
  [key: string]: any; // Cho phép bất kỳ key dạng string với bất kỳ kiểu giá trị nào
};

export default function DynamicApiDataTable() {
  const [rawData, setRawData] = useState<ApiDataItem[]>([]);
  const [columnKeys, setColumnKeys] = useState<string[]>([]); // Để lưu trữ danh sách các tên cột động
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 1. Fetch dữ liệu từ API và xác định các cột
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // THAY THẾ BẰNG URL API THẬT CỦA BẠN
        const response = await fetch('http://localhost:5000/api?dimensions=Customer%20ID&dimensions=Customer%20Name&dimensions=City%20Name&dimensions=Day&dimensions=Order%20ID&dimensions=Phone');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiDataItem[] = await response.json();
        setRawData(data);

        // Xác định các tên cột (keys) một cách động
        if (data.length > 0) {
          // Cách tiếp cận tốt hơn: lấy tất cả các key duy nhất từ tất cả các item
          // để đảm bảo không bỏ sót cột nào nếu các item có cấu trúc hơi khác nhau.
          const allKeys = new Set<string>();
          data.forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
          });
          // Sắp xếp các key để thứ tự cột ổn định
          setColumnKeys(Array.from(allKeys).sort());
        } else {
          setColumnKeys([]);
        }

      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching data:", e);
        setColumnKeys([]); // Đảm bảo columnKeys rỗng khi có lỗi
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  // 2. Lọc dữ liệu để hiển thị dựa trên searchTerm
  const displayedData = useMemo(() => {
    if (!searchTerm.trim()) { // Bỏ qua việc lọc nếu searchTerm rỗng hoặc chỉ có khoảng trắng
      return rawData;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return rawData.filter(item => {
      // Tìm kiếm trong tất cả các giá trị của item (đã được xác định bởi columnKeys)
      return columnKeys.some(key => {
        const value = item[key];
        // Chuyển giá trị sang string để tìm kiếm, xử lý cả null và undefined
        return String(value ?? '').toLowerCase().includes(lowercasedSearchTerm);
      });
    });
  }, [rawData, searchTerm, columnKeys]);


  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-500">Lỗi: {error} <br /> Vui lòng kiểm tra URL API và thử lại.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Bảng Dữ Liệu Động từ API</h1>

      {/* Phần Bộ lọc chung */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* <Input
            type="text"
            placeholder="Tìm kiếm trong bảng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs md:max-w-sm" // Điều chỉnh độ rộng cho các màn hình
          /> */}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {displayedData.length} / {rawData.length} mục
          </span>
        </div>
      </Card>

      {/* Bảng Dữ Liệu */}
      {columnKeys.length > 0 ? (
        <Card className="p-0 md:p-4"> {/* Giảm padding trên mobile để bảng rộng hơn */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnKeys.map(key => (
                    <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedData.length > 0 ? (
                  displayedData.map((item, index) => (
                    // Sử dụng index làm một phần của key nếu không có ID duy nhất từ item
                    <TableRow key={`row-${index}`}>
                      {columnKeys.map(key => (
                        <TableCell key={`${key}-${index}`} className="whitespace-nowrap">
                          {/* Chuyển giá trị sang String để hiển thị, xử lý null/undefined thành chuỗi rỗng */}
                          {item[key] === null || typeof item[key] === 'undefined' ? '' : String(item[key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columnKeys.length} className="text-center h-24">
                      {searchTerm ? "Không tìm thấy kết quả phù hợp." : "Không có dữ liệu."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
         !isLoading && <div className="text-center py-10 text-gray-500">Không có dữ liệu hoặc không thể xác định được các cột từ API.</div>
      )}
    </div>
  );
}