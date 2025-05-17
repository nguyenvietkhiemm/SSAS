// src/App.tsx
// "use client"

// import { useState } from "react"
// import { Card } from "./components/ui/card"
// import { Button } from "./components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
// import { Label } from "./components/ui/label"
// import { ChevronDown, ChevronUp, RotateCw, Scissors } from 'lucide-react'

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

"use client"

import { useEffect, useState } from "react"
import { Card } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Label } from "./components/ui/label"
import { ChevronDown, ChevronUp, RotateCw, Scissors, Loader2 } from 'lucide-react'

// Define the type for a single record from the API
type OrderRecord = {
  "City Name": string;
  "Customer ID": string;
  "Customer Name": string;
  Day: string;
  Month: string;
  "Order ID": string;
  Quarter: string;
  State: string;
  "Total Amount": number;
  Year: string;
  // Add other potential keys from the API response if needed
  [key: string]: any; // Allow for other keys
};

// Define the available dimensions based on the API keys
const availableDimensions = [
  "Order ID",
  "Customer ID",
  "Customer Name",
  "Day",
  "Month",
  "Quarter",
  "Year",
  "City Name",
  "State",
];

// Define the available measures (based on numeric keys)
const availableMeasures = [
    "Total Amount",
    // Add other numeric keys if available from the API
];

// Define the structure for the current view state
type CurrentView = {
  measure: string;
  dimensions: {
    selectedColumns: string[]; // Which keys from the API to show as columns
    filters: Record<string, string>; // Generic filters { key: value }
  };
};

// ViewData structure to feed the table component
type ViewData = {
  headers: string[];
  rows: OrderRecord[]; // Rows are just the filtered API records
};


export default function OLAPOperations() {
  // State for fetched API data
  const [apiData, setApiData] = useState<OrderRecord[]>([]);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  // State for errors
  const [error, setError] = useState<string | null>(null);

  // State for the current view/query configuration
  const [currentView, setCurrentView] = useState<CurrentView>({
    measure: "Total Amount", // Default measure
    dimensions: {
      selectedColumns: ["Order ID", "Customer Name", "Total Amount"], // Default columns to show
      filters: {
        // Default filter (e.g., initial time filter)
        "Quarter": "2", // Example: Start with Q2 data based on the API example
        "Year": "2025", // Example: Start with 2025 data based on the API example
      },
    },
  });

  // Base URL for the mock API
  const API_BASE_URL = "http://localhost:5000/api";
  const API_LIMIT = 100; // Example limit
  const API_OFFSET = 0;

  const buildApiUrl = (view: CurrentView): string => {
    const baseUrl = API_BASE_URL;
    const params: string[] = [];
  
    // Add limit & offset first
    params.push(`limit=${API_LIMIT}`);
    params.push(`offset=${API_OFFSET}`);
  
    // Add dimensions
    view.dimensions.selectedColumns.forEach(dim => {
      if (availableDimensions.includes(dim) || availableMeasures.includes(dim)) {
        params.push(`dimensions=${encodeURIComponent(dim)}`);
      }
    });
  
    // Add filters
    Object.entries(view.dimensions.filters).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== "all" &&
        (availableDimensions.includes(key) || availableMeasures.includes(key))
      ) {
        params.push(`filter=${encodeURIComponent(`${key}:${value}`)}`);
      }
    });
  
    // Join and return full URL
    // return `${baseUrl}?${params.join("&")}`;
    return "http://localhost:5000/api?dimensions=Customer%20ID&dimensions=Order%20ID&limit=100&offset=0%20&measure_filters={%22Total%20Amount%22:%20%22%3C%204000%22}%20&dimension_filters={%22Customer%20ID%22:%20%22cu0001%22}"
  };

  // Effect to fetch data whenever the view configuration changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const url = buildApiUrl(currentView);
      console.log("Fetching data from:", url); // Log the URL for debugging

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();

        // Assuming the API returns an array of records directly
        if (Array.isArray(data)) {
             setApiData(data);
        } else {
             // Handle cases where the API might return data in a different structure
             console.error("API returned data in unexpected format:", data);
             setError("Failed to fetch data: Unexpected format");
             setApiData([]); // Clear data on format error
        }

      } catch (e: any) {
        console.error("Fetch error:", e);
        setError(`Failed to fetch data: ${e.message}`);
        setApiData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentView]); // Depend on currentView to refetch when it changes

  // Prepare data for the table based on fetched API data and selected columns
  const getViewData = (): ViewData => {
    // Headers are the keys currently selected as columns
    const headers = currentView.dimensions.selectedColumns;

    // Rows are the fetched API data records
    const rows = apiData;

    return { headers, rows };
  };

  // OLAP operations based on manipulating selected columns and filters

  // "Drill Down" means adding a dimension to the selected columns
  const drillDown = (dimension: string) => {
    // Add the dimension if it's not already selected and is available
    if (!currentView.dimensions.selectedColumns.includes(dimension) && (availableDimensions.includes(dimension) || availableMeasures.includes(dimension))) {
      setCurrentView(prevView => ({
        ...prevView,
        dimensions: {
          ...prevView.dimensions,
          selectedColumns: [...prevView.dimensions.selectedColumns, dimension],
        },
      }));
    }
  };

  // "Roll Up" means removing a dimension from the selected columns
  const rollUp = (dimension: string) => {
    // Remove the dimension if it is currently selected
    if (currentView.dimensions.selectedColumns.includes(dimension)) {
      setCurrentView(prevView => ({
        ...prevView,
        dimensions: {
          ...prevView.dimensions,
          selectedColumns: prevView.dimensions.selectedColumns.filter(col => col !== dimension),
        },
      }));
    }
  };

  // "Slice" means adding/changing a filter
  const slice = (dimension: string, value: string) => {
     // Only allow slicing on available dimensions
    if (availableDimensions.includes(dimension) || availableMeasures.includes(dimension)) {
        setCurrentView(prevView => ({
            ...prevView,
            dimensions: {
                ...prevView.dimensions,
                filters: {
                    ...prevView.dimensions.filters,
                    [dimension]: value,
                },
            },
        }));
    }
  };

    // Remove a specific filter
    const removeFilter = (dimension: string) => {
        setCurrentView(prevView => {
            const newFilters = { ...prevView.dimensions.filters };
            delete newFilters[dimension];
            return {
                ...prevView,
                dimensions: {
                    ...prevView.dimensions,
                    filters: newFilters,
                },
            };
        });
    };


  // "Pivot" - In the context of a flat API, traditional pivot (swapping row/column headers in an aggregate table) isn't directly applicable.
  // We will disable this button as it doesn't fit the new data model and API interaction.
  const pivot = () => {
    console.warn("Pivot operation is not directly supported with a flat API response structure.");
    // If a new interpretation of pivot is needed (e.g., selecting a 'row' dimension),
    // this function would need to be re-implemented accordingly, likely requiring
    // client-side aggregation or a different API endpoint.
  };

  // Change Measure - The API structure currently only shows "Total Amount" as a measure.
  // This function is kept but the UI only offers the available measures.
  const changeMeasure = (measure: string) => {
    if (availableMeasures.includes(measure)) {
        setCurrentView(prevView => ({
            ...prevView,
            measure,
        }));
    }
  };

   // Determine dimensions not currently selected as columns
   const dimensionsNotSelected = availableDimensions.filter(dim => !currentView.dimensions.selectedColumns.includes(dim));
   const measuresNotSelected = availableMeasures.filter(measure => !currentView.dimensions.selectedColumns.includes(measure));
   const allNotSelected = [...dimensionsNotSelected, ...measuresNotSelected];


   // Determine dimensions currently selected as columns (can be rolled up)
   const dimensionsSelected = availableDimensions.filter(dim => currentView.dimensions.selectedColumns.includes(dim));
   const measuresSelected = availableMeasures.filter(measure => currentView.dimensions.selectedColumns.includes(measure));
    const allSelected = [...dimensionsSelected, ...measuresSelected];


  // Prepare data for the table
  const viewData = getViewData();

  // Xác định tiêu đề cho các chiều/phép đo (could be simplified to just return the key name if they are descriptive)
  const getDisplayTitle = (key: string): string => {
    switch (key) {
        case "Order ID": return "Mã Đơn hàng";
        case "Customer ID": return "Mã Khách hàng";
        case "Customer Name": return "Tên Khách hàng";
        case "Day": return "Ngày";
        case "Month": return "Tháng";
        case "Quarter": return "Quý";
        case "Year": return "Năm";
        case "City Name": return "Thành phố";
        case "State": return "Bang";
        case "Total Amount": return "Tổng tiền";
      default:
        return key; // Fallback to the key itself
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Phân tích Dữ liệu từ API</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Drill Down (Add Column) */}
        <Card className="p-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium flex items-center">
              <ChevronDown className="mr-2 h-4 w-4" />
              Khoan xuống (Thêm cột)
            </h3>
            <p className="text-sm text-gray-500">Thêm cột/chiều vào bảng</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {allNotSelected.length > 0 ? (
                  allNotSelected.map(dim => (
                    <Button
                        key={dim}
                        onClick={() => drillDown(dim)}
                        variant="outline"
                        size="sm"
                    >
                       {getDisplayTitle(dim)}
                    </Button>
                  ))
              ) : (
                  <p className="text-sm text-gray-500 col-span-2">Không có chiều nào khả dụng để thêm.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Roll Up (Remove Column) */}
        <Card className="p-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium flex items-center">
              <ChevronUp className="mr-2 h-4 w-4" />
              Cuộn lên (Bỏ cột)
            </h3>
            <p className="text-sm text-gray-500">Loại bỏ cột/chiều khỏi bảng</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
             {allSelected.length > 0 ? (
                 allSelected.map(dim => (
                    <Button
                         key={dim}
                         onClick={() => rollUp(dim)}
                         variant="outline"
                         size="sm"
                         disabled={currentView.dimensions.selectedColumns.length <= 1} // Don't remove the last column
                     >
                        {getDisplayTitle(dim)}
                     </Button>
                 ))
             ) : (
                 <p className="text-sm text-gray-500 col-span-2">Không có cột nào để loại bỏ.</p>
             )}
            </div>
          </div>
        </Card>

        {/* Slice (Filtering) */}
        <Card className="p-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium flex items-center">
              <Scissors className="mr-2 h-4 w-4" />
              Chiếu chọn (Lọc)
            </h3>
            <p className="text-sm text-gray-500">Lọc dữ liệu theo chiều</p>
            <div className="flex flex-col space-y-2 mt-2">
               {/* Example: Filter by Quarter */}
              <Label htmlFor="filter-quarter">Quý:</Label>
               <Select
                   value={currentView.dimensions.filters["Quarter"] || ""}
                   onValueChange={(value) => slice("Quarter", value)}
                   name="filter-quarter"
               >
                 <SelectTrigger className="h-8">
                   <SelectValue placeholder="Chọn quý" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">Tất cả Quý</SelectItem> {/* Option to remove filter */}
                   {/* Assuming quarters Q1-Q4 */}
                   {["1", "2", "3", "4"].map(q => (
                       <SelectItem key={`Q${q}`} value={q}>
                           {`Quý ${q}`}
                       </SelectItem>
                   ))}
                 </SelectContent>
               </Select>

                {/* Example: Filter by Year */}
                <Label htmlFor="filter-year">Năm:</Label>
                <Select
                    value={currentView.dimensions.filters["Year"] || ""}
                    onValueChange={(value) => slice("Year", value)}
                    name="filter-year"
                >
                    <SelectTrigger className="h-8">
                        <SelectValue placeholder="Chọn năm" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả Năm</SelectItem> {/* Option to remove filter */}
                         {/* Assuming years 2023-2025 */}
                        {["2023", "2024", "2025"].map(year => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


              {/* Measure Selection (Slice on Measure is less common, but changing measure is like slicing the cube) */}
              <Label htmlFor="select-measure">Phép đo:</Label>
              <Select value={currentView.measure} onValueChange={changeMeasure} name="select-measure">
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Chọn phép đo" />
                </SelectTrigger>
                <SelectContent>
                  {availableMeasures.map(measure => (
                      <SelectItem key={measure} value={measure}>{getDisplayTitle(measure)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Pivot - Disabled/Removed as it doesn't apply to flat data display */}
        <Card className="p-4 opacity-50 cursor-not-allowed">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium flex items-center">
              <RotateCw className="mr-2 h-4 w-4" />
              Xoay (Pivot)
            </h3>
            <p className="text-sm text-gray-500">Không khả dụng với dữ liệu phẳng từ API</p>
             {/* Display current "Row" (implicit) and "Columns" */}
             <div className="flex flex-col space-y-2 mt-2">
               <div className="flex items-center justify-between">
                 <Label>Cột hiển thị:</Label>
               </div>
               <ul className="text-sm text-gray-700 list-disc list-inside">
                   {currentView.dimensions.selectedColumns.map(col => (
                       <li key={col}>{getDisplayTitle(col)}</li>
                   ))}
               </ul>
             </div>
             <Button onClick={pivot} variant="outline" className="mt-2" disabled>
                Xoay bảng
             </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
         <h2 className="text-xl font-semibold mb-4">
           Dữ liệu: {getDisplayTitle(currentView.measure)}
            {Object.entries(currentView.dimensions.filters).map(([key, value]) =>
                <span key={key} className="ml-4 text-base font-normal text-gray-600">
                    {getDisplayTitle(key)}: {value}
                    {/* Optional: Add a way to remove filters */}
                    {/* <button onClick={() => removeFilter(key)} className="ml-1 text-red-500">&times;</button> */}
                </span>
            )}
         </h2>

        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải dữ liệu...
            </div>
        )}

        {error && (
            <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded">
                Lỗi: {error}
            </div>
        )}

        {!isLoading && !error && viewData.rows.length === 0 && (
             <div className="p-4 text-gray-700 bg-gray-100 border border-gray-200 rounded">
                Không tìm thấy dữ liệu nào khớp với bộ lọc hiện tại.
             </div>
        )}

        {!isLoading && !error && viewData.rows.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                   {/* Render headers based on selectedColumns */}
                  {viewData.headers.map((headerKey) => (
                    <TableHead key={headerKey} className="text-center min-w-[120px]">
                      {getDisplayTitle(headerKey)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                 {/* Render rows based on apiData */}
                {viewData.rows.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}> {/* Use row index or unique ID from data if available */}
                    {viewData.headers.map((headerKey, colIndex) => (
                       <TableCell key={`${rowIndex}-${headerKey}`} className={`text-${typeof row[headerKey] === 'number' ? 'center' : 'left'}`}>
                          {/* Format number values */}
                         {typeof row[headerKey] === 'number'
                            ? row[headerKey].toLocaleString()
                            : row[headerKey]?.toString() // Handle null/undefined
                          }
                       </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Removed aggregate total row/column as it doesn't apply to flat data display */}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}