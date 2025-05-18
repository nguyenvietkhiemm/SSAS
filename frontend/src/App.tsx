// "use client"

// import { useEffect, useState, useCallback, useMemo } from "react"
// import { Card } from "./components/ui/card"
// import { Button } from "./components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
// import { Label } from "./components/ui/label"
// import { ChevronDown, ChevronUp, RotateCw, Scissors, Loader2, XCircle } from 'lucide-react' // Added XCircle for filter removal

// // Define the type for a single record from the API
// type OrderRecord = {
//   [key: string]: any; // Keys will be dynamic
// };

// // Define the structure for the current view state
// type CurrentView = {
//   measure: string; // The primary measure selected by user for context (sent as part of 'measure' array in API)
//   dimensions: {
//     selectedColumns: string[]; // Columns requested by the user (dimensions + measure)
//     filters: Record<string, string>; // Filters applied to dimensions
//   };
// };

// const API_DOMAIN = "http://localhost:5000";
// const DATA_API_URL = `${API_DOMAIN}/api`;
// const SCHEMA_API_URL = `${API_DOMAIN}/api/get_all`;
// const UNIQUE_VALUES_API_URL = `${API_DOMAIN}/api/get_unique_values`; // New endpoint for unique values
// const API_LIMIT = 100; // Example limit
// const API_OFFSET = 0; // Example offset

// // Helper function for Vietnamese display titles
// const getDisplayTitle = (key: string): string => {
//   return key;
// };


// export default function OLAPOperations() {
//   const [apiData, setApiData] = useState<OrderRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Schema-related states (from /api/get_all)
//   const [identifiedDimensions, setIdentifiedDimensions] = useState<string[]>([]);
//   const [identifiedMeasures, setIdentifiedMeasures] = useState<string[]>([]);
//   const [isSchemaLoaded, setIsSchemaLoaded] = useState(false);

//   // State for actual headers from the last valid data response
//   const [actualResponseHeaders, setActualResponseHeaders] = useState<string[]>([]);

//   const [currentView, setCurrentView] = useState<CurrentView>({
//     measure: "", // Will be set after schema load
//     dimensions: {
//       selectedColumns: [], // Will be initialized after schema load
//       filters: {}, // Will be initialized after schema load
//     },
//   });

//   // State for the Slice operation UI
//   const [selectedDimensionForFilter, setSelectedDimensionForFilter] = useState<string>("");
//   const [dimensionFilterValues, setDimensionFilterValues] = useState<Record<string, string[]>>({}); // Cache fetched values
//   const [isFetchingFilterValues, setIsFetchingFilterValues] = useState(false);
//   const [filterValueInput, setFilterValueInput] = useState<string>("all"); // Input value for the filter select

//   // Effect to fetch schema (all available dimensions and measures)
//   useEffect(() => {
//     const fetchSchema = async () => {
//       setIsLoading(true); // Start loading for schema
//       setError(null);
//       console.log("Fetching schema from:", SCHEMA_API_URL);

//       try {
//         const response = await fetch(SCHEMA_API_URL);
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Schema fetch HTTP error! status: ${response.status} - ${errorText}`);
//         }
//         const schemaData = await response.json();

//         if (schemaData && Array.isArray(schemaData.dimensions) && Array.isArray(schemaData.measures)) {
//           const dimensions = schemaData.dimensions as string[];
//           const measures = schemaData.measures as string[];

//           setIdentifiedDimensions(dimensions);
//           setIdentifiedMeasures(measures);

//           // Set initial view: first few dimensions + first measure
//           const initialSelectedColumns = [
//             ...(dimensions.slice(0, 2)), // First 2 dimensions
//             ...(measures.length > 0 ? [measures[0]] : []) // First measure
//           ].filter(Boolean);

//           const initialMeasure = measures.length > 0 ? measures[0] : "";

//           const initialFilters: Record<string, string> = {};
//           // Set initial filters only if the dimensions exist in the schema
//           if (dimensions.includes("Quarter")) initialFilters["Quarter"] = "2";
//           if (dimensions.includes("Year")) initialFilters["Year"] = "2025";

//           setCurrentView({
//             measure: initialMeasure,
//             dimensions: {
//               selectedColumns: initialSelectedColumns.length > 0 ? initialSelectedColumns : (dimensions.length > 0 ? [dimensions[0]] : measures.length > 0 ? [measures[0]] : []), // Ensure at least one column if possible
//               filters: initialFilters,
//             },
//           });

//           // Set initial actualResponseHeaders based on initial selected columns - will be overwritten by first data fetch
//           setActualResponseHeaders(initialSelectedColumns.length > 0 ? initialSelectedColumns : (dimensions.length > 0 ? [dimensions[0]] : measures.length > 0 ? [measures[0]] : []));

//           setIsSchemaLoaded(true);
//         } else {
//           throw new Error("Schema data is not in the expected format (missing 'dimensions' or 'measures' arrays).");
//         }
//       } catch (e: any) {
//         console.error("Schema fetch error:", e);
//         setError(`Failed to fetch schema: ${e.message}`);
//         // Keep loading state true if schema failed, indicates critical issue
//       } finally {
//         // If schema loaded successfully, data fetch effect will manage loading
//         if (!isSchemaLoaded) setIsLoading(false); // Stop loading ONLY if schema failed
//       }
//     };
//     fetchSchema();
//   }, []); // Empty dependency array means this runs only once on mount

//   // Function to send data request to the backend
//   const sendApiRequest = async (view: CurrentView) => {
//     // Separate requested columns into dimensions and measures based on schema
//     const selectedDimensionsApi = view.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
//     const selectedMeasuresApi = view.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));

//     // Ensure the selected measure (for context/title) is also included in the measures list if not already
//     if (view.measure && identifiedMeasures.includes(view.measure) && !selectedMeasuresApi.includes(view.measure)) {
//       selectedMeasuresApi.push(view.measure);
//     }


//     // Separate filters into dimension and measure filters based on schema
//     const dimensionFiltersApi: Record<string, string> = {};
//     const measureFiltersApi: Record<string, string> = {};

//     Object.entries(view.dimensions.filters).forEach(([key, value]) => {
//       if (value !== "" && value !== "all" && value !== undefined) {
//         if (identifiedDimensions.includes(key)) {
//           dimensionFiltersApi[key] = value;
//         }
//         // Although schema suggests measures aren't filtered this way,
//         // keep the measure filter logic if the backend supports it, but focus on dimensions per requirements.
//         else if (identifiedMeasures.includes(key)) {
//           measureFiltersApi[key] = value;
//         }
//       }
//     });

//     // The backend expects 'measure' as a list, so put the selected measure (if any) here
//     // along with any other measures requested as columns.
//     // Let's stick to the original request body structure which seems to aggregate measures.
//     const measuresInRequestBody = view.measure ? [view.measure] : []; // Send the selected measure for aggregation context
//     // Add any measures that were *explicitly* requested as columns to the measures list if not already there


//     // view.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col)).forEach(m => {
//     //   if (!measuresInRequestBody.includes(m)) {
//     //     measuresInRequestBody.push(m);
//     //   }
//     // });


//     const requestBody = {
//       dimensions: selectedDimensionsApi, // ONLY dimensions requested as columns
//       measure: measuresInRequestBody, // Selected measure + any measures requested as columns
//       limit: API_LIMIT,
//       offset: API_OFFSET,
//       measure_filters: measureFiltersApi, // Filters ONLY on measures
//       dimension_filters: dimensionFiltersApi // Filters ONLY on dimensions
//     };
//     console.log("API Data Request Body:", JSON.stringify(requestBody, null, 2));

//     const response = await fetch(DATA_API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody)
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
//     }
//     return response.json();
//   };

//   // Effect to fetch data when view changes or after schema is loaded
//   useEffect(() => {
//     if (!isSchemaLoaded) {
//       return; // Wait for schema
//     }

//     const fetchData = async () => {
//       // Don't set loading true if it's already true from schema fetch initially
//       if (!isLoading) setIsLoading(true);
//       setError(null);
//       console.log("Requesting data with currentView:", currentView);

//       // Determine which columns are expected in the response based on the request
//       // This helps set actualResponseHeaders even if data is empty
//       const requestedDimensions = currentView.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
//       const requestedMeasures = currentView.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));
//       const expectedResponseHeaders = [...requestedDimensions, ...requestedMeasures];
//       // Ensure the selected measure is also in the expected headers if not already requested as a column
//       if (currentView.measure && identifiedMeasures.includes(currentView.measure) && !expectedResponseHeaders.includes(currentView.measure)) {
//         // Add selected measure to expected headers, often measures come *after* dimensions
//         expectedResponseHeaders.push(currentView.measure);
//       }


//       try {
//         const data = await sendApiRequest(currentView);
//         console.log("Data received from API:", data);

//         if (Array.isArray(data)) {
//           setApiData(data);
//           if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
//             const responseKeys = Object.keys(data[0]);
//             console.log("Actual keys from response:", responseKeys);
//             setActualResponseHeaders(responseKeys); // Use keys from actual data
//           } else { // No data rows returned or data is empty array
//             console.log("No data rows in response, using expected headers.");
//             setActualResponseHeaders(expectedResponseHeaders); // Use expected headers if no data
//           }
//         } else {
//           console.error("API returned data in unexpected format:", data);
//           setError("Failed to fetch data: Unexpected format from API.");
//           setApiData([]);
//           setActualResponseHeaders(expectedResponseHeaders); // Use expected headers even on error
//         }
//       } catch (e: any) {
//         console.error("Fetch data error:", e);
//         setError(`Failed to fetch data: ${e.message}`);
//         setApiData([]);
//         setActualResponseHeaders(expectedResponseHeaders); // Use expected headers on fetch error
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//     // Re-run when currentView changes OR when schema finishes loading (initial data fetch)
//   }, [currentView, isSchemaLoaded, identifiedDimensions, identifiedMeasures]); // Added schema dependencies to ensure sendApiRequest uses correct lists

//   // Fetch unique values for a dimension when selected for filtering
//   const fetchUniqueValues = useCallback(async (dimensionKey: string) => {
//     if (dimensionFilterValues[dimensionKey]) {
//       return; // Already cached
//     }
//     setIsFetchingFilterValues(true);
//     setError(null); // Clear previous data errors when fetching filter values
//     try {
//       const response = await fetch(`${UNIQUE_VALUES_API_URL}?dimension=${encodeURIComponent(dimensionKey)}`);
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Unique values fetch HTTP error! status: ${response.status} - ${errorText}`);
//       }
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setDimensionFilterValues(prev => ({ ...prev, [dimensionKey]: data.map(String) })); // Ensure values are strings
//       } else {
//         throw new Error("Unique values API returned data in unexpected format.");
//       }
//     } catch (e: any) {
//       console.error(`Workspace unique values error for ${dimensionKey}:`, e);
//       // Decide if filter fetch error should block main view or just show message for filter
//       // setError(`Failed to fetch unique values for ${getDisplayTitle(dimensionKey)}: ${e.message}`); // Potentially disruptive
//       setDimensionFilterValues(prev => ({ ...prev, [dimensionKey]: [] })); // Store empty array to indicate attempt failed
//     } finally {
//       setIsFetchingFilterValues(false);
//     }
//   }, [dimensionFilterValues]); // Only re-create if dimensionFilterValues changes unexpectedly

//   // --- OLAP Operations ---

//   // Drill Down: Add a dimension to selected columns
//   const drillDown = (dimensionKey: string) => {
//     // Only allow drilling down on identified dimensions that are not already selected
//     if (identifiedDimensions.includes(dimensionKey) && !currentView.dimensions.selectedColumns.includes(dimensionKey)) {
//       setCurrentView(prev => ({
//         ...prev,
//         dimensions: {
//           ...prev.dimensions,
//           selectedColumns: [...prev.dimensions.selectedColumns, dimensionKey]
//         },
//       }));
//     }
//   };

//   // Roll Up: Remove a dimension from selected columns
//   const rollUp = (dimensionKey: string) => {
//     // Only allow rolling up identified dimensions that are currently selected
//     // Prevent removing if it's the last selected column
//     const currentlySelectedDimensions = currentView.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
//     const currentlySelectedMeasures = currentView.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));

//     if (identifiedDimensions.includes(dimensionKey) && currentView.dimensions.selectedColumns.includes(dimensionKey)) {
//       // Prevent removing the last dimension if there are no measures selected as columns
//       if (currentlySelectedDimensions.length <= 1 && currentlySelectedMeasures.length === 0) {
//         console.warn("Cannot roll up: Must keep at least one dimension or a measure selected.");
//         return; // Don't update state
//       }
//       // Also prevent removing the last selected column overall
//       if (currentView.dimensions.selectedColumns.length <= 1) {
//         console.warn("Cannot roll up: Must keep at least one column selected overall.");
//         return; // Don't update state
//       }


//       setCurrentView(prev => ({
//         ...prev,
//         dimensions: {
//           ...prev.dimensions,
//           selectedColumns: prev.dimensions.selectedColumns.filter(col => col !== dimensionKey)
//         },
//       }));
//     }
//   };

//   // Slice: Add or change a filter for a dimension
//   const slice = (dimensionKey: string, value: string) => {
//     // Only allow slicing on identified dimensions
//     if (identifiedDimensions.includes(dimensionKey)) {
//       setCurrentView(prev => {
//         const newFilters = { ...prev.dimensions.filters };
//         if (value === "all" || value === "" || value === undefined) {
//           delete newFilters[dimensionKey]; // Remove filter
//         } else {
//           newFilters[dimensionKey] = value; // Set or update filter
//         }
//         return { ...prev, dimensions: { ...prev.dimensions, filters: newFilters } };
//       });
//     }
//   };

//   // Remove an active filter
//   const removeFilter = (dimension: string) => {
//     // Call slice with "all" value to remove the filter
//     slice(dimension, "all");
//     // Reset filter value input state if the removed filter was the one currently selected in the UI
//     if (selectedDimensionForFilter === dimension) {
//       setFilterValueInput("all");
//       setSelectedDimensionForFilter(""); // Reset the selected dimension for filter UI
//     }
//   };

//   // Change the primary measure (for context/title and implicitly included in measure list for backend)
//   const changeMeasure = (measureKey: string) => {
//     // Only allow changing to identified measures
//     if (identifiedMeasures.includes(measureKey)) {
//       setCurrentView(prev => {
//         const newState = { ...prev, measure: measureKey };
//         // Optional: Automatically add the new measure to selectedColumns if it's not there?
//         // Requirement 1 says drill/roll only on dimensions. Let's keep measures separate in selectedColumns.
//         // The sendApiRequest logic already ensures the 'measure' key is sent correctly.
//         // If the measure *is* in selectedColumns, the table will show it.
//         // If the measure is *not* in selectedColumns, but IS the primary measure, the table will *not* show it
//         // unless `actualResponseHeaders` includes it.
//         // Let's modify `sendApiRequest` to *always* include the `currentView.measure` in the list of measures sent.
//         return newState;
//       });
//     }
//   };

//   // Pivot operation is not supported
//   const pivot = () => console.warn("Pivot not supported.");

//   // Determine headers for table rendering
//   const getEffectiveTableHeaders = (): string[] => {
//     // Use actualResponseHeaders if available and not empty
//     if (actualResponseHeaders.length > 0) {
//       return actualResponseHeaders;
//     }
//     // Fallback to the columns requested IF schema is loaded and there was no data/error
//     // This ensures headers appear even if the API returns [] or an error
//     if (isSchemaLoaded && !isLoading && !error) {
//       // Determine which columns were requested and are dimensions/measures
//       const requestedDimensions = currentView.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
//       const requestedMeasures = currentView.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));
//       const expectedHeaders = [...requestedDimensions, ...requestedMeasures];
//       // Add the primary measure if not already requested as a column
//       if (currentView.measure && identifiedMeasures.includes(currentView.measure) && !expectedHeaders.includes(currentView.measure)) {
//         expectedHeaders.push(currentView.measure);
//       }
//       return expectedHeaders;
//     }
//     // Fallback for initial loading state or schema error before any data is fetched
//     return [];
//   };

//   const effectiveTableHeaders = getEffectiveTableHeaders();

//   // Memoized lists for UI efficiency and correctness
//   const availableDimensionsToDrillDown = useMemo(() => {
//     return identifiedDimensions.filter(dim => !currentView.dimensions.selectedColumns.includes(dim));
//   }, [identifiedDimensions, currentView.dimensions.selectedColumns]);

//   const selectedDimensionsToRollUp = useMemo(() => {
//     return identifiedDimensions.filter(dim => currentView.dimensions.selectedColumns.includes(dim));
//   }, [identifiedDimensions, currentView.dimensions.selectedColumns]);

//   const availableDimensionsForFilter = useMemo(() => {
//     // Offer all identified dimensions for filtering
//     return identifiedDimensions;
//   }, [identifiedDimensions]);

//   const availableMeasures = useMemo(() => {
//     return identifiedMeasures;
//   }, [identifiedMeasures]);


//   // Handle change in the dimension selection for filtering
//   const handleDimensionSelectForFilter = (dimensionKey: string) => {
//     setSelectedDimensionForFilter(dimensionKey);
//     setFilterValueInput("all"); // Reset value selection
//     if (dimensionKey && identifiedDimensions.includes(dimensionKey)) {
//       fetchUniqueValues(dimensionKey);
//     } else {
//       // Clear values if no dimension is selected or an invalid one
//       setDimensionFilterValues(prev => {
//         const newState = { ...prev };
//         delete newState[dimensionKey]; // Remove if it somehow got there
//         return newState;
//       });
//     }
//   };

//   // Handle change in the filter value selection
//   const handleFilterValueChange = (value: string) => {
//     setFilterValueInput(value);
//     // Apply the filter immediately when a value is selected
//     if (selectedDimensionForFilter) {
//       slice(selectedDimensionForFilter, value);
//     }
//   };


//   // --- UI Rendering Logic ---

//   // Initial loading state (waiting for schema)
//   if (isLoading && !isSchemaLoaded && !error) {
//     return (
//       <div className="container mx-auto py-8 text-center">
//         <Loader2 className="mr-2 h-8 w-8 animate-spin inline-block" /> Đang tải cấu trúc dữ liệu...
//       </div>
//     );
//   }

//   // Schema load error state
//   if (error && !isSchemaLoaded) {
//     return (
//       <div className="container mx-auto py-8 text-center">
//         <p className="text-red-600">Lỗi tải cấu trúc dữ liệu: {error}</p>
//         <p className="text-gray-500">Vui lòng kiểm tra API backend ({SCHEMA_API_URL}, {UNIQUE_VALUES_API_URL}, {DATA_API_URL}) và thử lại.</p>
//       </div>
//     );
//   }

//   // Should not happen if schema load finishes without error, but good as a fallback
//   if (!isSchemaLoaded && !error && !isLoading) {
//     return (
//       <div className="container mx-auto py-8 text-center">
//         <p className="text-orange-600">Không thể tải cấu trúc dữ liệu từ API.</p>
//       </div>
//     );
//   }

//   // Main UI after schema is loaded
//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Phân tích Dữ liệu</h1> {/* Removed suffix as title is dynamic */}

//       {/* OLAP Controls Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {/* Drill Down */}
//         <Card className="p-4 flex flex-col">
//           <div className="flex items-center mb-2">
//             <ChevronDown className="mr-2 h-4 w-4" />
//             <h3 className="font-medium">Khoan xuống (Thêm Dimension)</h3>
//           </div>
//           <p className="text-sm text-gray-500 mb-3">Thêm Dimension vào bảng</p>
//           <div className="grid grid-cols-2 gap-2 flex-grow max-h-48 overflow-y-auto pr-2">
//             {availableDimensionsToDrillDown.length > 0 ? availableDimensionsToDrillDown.map(key => (
//               <Button key={key} onClick={() => drillDown(key)} variant="outline" size="sm" className="truncate" title={getDisplayTitle(key)}>
//                 {getDisplayTitle(key)}
//               </Button>
//             )) : <p className="text-sm text-gray-500 col-span-2">Tất cả Dimensions đã được chọn.</p>}
//           </div>
//         </Card>

//         {/* Roll Up */}
//         <Card className="p-4 flex flex-col">
//           <div className="flex items-center mb-2">
//             <ChevronUp className="mr-2 h-4 w-4" />
//             <h3 className="font-medium">Cuộn lên (Loại bỏ Dimension)</h3>
//           </div>
//           <p className="text-sm text-gray-500 mb-3">Loại bỏ Dimension khỏi bảng</p>
//           <div className="grid grid-cols-2 gap-2 flex-grow max-h-48 overflow-y-auto pr-2">
//             {selectedDimensionsToRollUp.length > 0 ? selectedDimensionsToRollUp.map(key => (
//               <Button
//                 key={key}
//                 onClick={() => rollUp(key)}
//                 variant="outline"
//                 size="sm"
//                 className="truncate"
//                 title={getDisplayTitle(key)}
//                 disabled={currentView.dimensions.selectedColumns.length <= 1} // Disable if it's the only column left
//               >
//                 {getDisplayTitle(key)}
//               </Button>
//             )) : <p className="text-sm text-gray-500 col-span-2">Chưa có Dimensions nào được chọn.</p>}
//           </div>
//         </Card>

//         {/* Slice (Filtering) */}
//         <Card className="p-4 flex flex-col">
//           <div className="flex items-center mb-2">
//             <Scissors className="mr-2 h-4 w-4" />
//             <h3 className="font-medium">Chiếu chọn (Lọc)</h3>
//           </div>
//           <p className="text-sm text-gray-500 mb-3">Lọc dữ liệu theo Dimension</p>
//           <div className="flex flex-col space-y-2 flex-grow max-h-48 overflow-y-auto pr-2">
//             {/* Dimension Selection for Filtering */}
//             <Label htmlFor="filter-dimension-select">Chọn Dimension để lọc:</Label>
//             <Select value={selectedDimensionForFilter} onValueChange={handleDimensionSelectForFilter} name="filter-dimension-select">
//               <SelectTrigger className="h-8"><SelectValue placeholder="Chọn Dimension" /></SelectTrigger>
//               <SelectContent>
//                 {/* Only list dimensions that are NOT already filtered? Or all? Let's list all */}
//                 {availableDimensionsForFilter.length > 0 ? availableDimensionsForFilter.map(dim => (
//                   <SelectItem key={`filter-dim-${dim}`} value={dim} className="truncate" title={getDisplayTitle(dim)}>
//                     {getDisplayTitle(dim)} {currentView.dimensions.filters[dim] ? `(Đã lọc: ${currentView.dimensions.filters[dim]})` : ''}
//                   </SelectItem>
//                 )) : <SelectItem value="" disabled>Không có Dimension nào</SelectItem>}
//               </SelectContent>
//             </Select>

//             {/* Value Selection for Filtering */}
//             {selectedDimensionForFilter && (
//               <>
//                 <Label htmlFor="filter-value-select">Chọn giá trị:</Label>
//                 <Select value={filterValueInput} onValueChange={handleFilterValueChange} name="filter-value-select" disabled={isFetchingFilterValues}>
//                   <SelectTrigger className="h-8">
//                     {isFetchingFilterValues ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                     <SelectValue placeholder="Chọn giá trị" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Tất cả ({getDisplayTitle(selectedDimensionForFilter)})</SelectItem>
//                     {/* Render fetched unique values */}
//                     {dimensionFilterValues[selectedDimensionForFilter]?.length > 0 ? (
//                       dimensionFilterValues[selectedDimensionForFilter].map(value => (
//                         <SelectItem key={`filter-value-${value}`} value={value.toString()}>{value}</SelectItem>
//                       ))
//                     ) : isFetchingFilterValues ? null : (
//                       <SelectItem value="no-values" disabled>Không tìm thấy giá trị</SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//               </>
//             )}
//           </div>
//           {/* Display active filters */}
//           <div className="mt-4">
//             <h4 className="text-sm font-medium mb-2">Bộ lọc đang áp dụng:</h4>
//             {Object.entries(currentView.dimensions.filters).length > 0 ? (
//               <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2">
//                 {Object.entries(currentView.dimensions.filters).map(([key, value]) => (
//                   <span key={key} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
//                     {getDisplayTitle(key)}: {value}
//                     <button onClick={() => removeFilter(key)} className="ml-1 text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-400 focus:outline-none">
//                       <XCircle className="h-3 w-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">Không có bộ lọc nào.</p>
//             )}
//           </div>
//         </Card>


//         {/* Measure Selection */}
//         <Card className="p-4 flex flex-col">
//           <div className="flex items-center mb-2">
//             <RotateCw className="mr-2 h-4 w-4" /> {/* Changed icon, maybe not the best */}
//             <h3 className="font-medium">Chọn Phép đo chính</h3>
//           </div>
//           <p className="text-sm text-gray-500 mb-3">Chọn phép đo để hiển thị</p>
//           <div className="flex flex-col space-y-2 flex-grow max-h-48 overflow-y-auto pr-2">
//             {availableMeasures.length > 0 ? (
//               <>
//                 <Label htmlFor="select-measure">Phép đo:</Label>
//                 <Select value={currentView.measure} onValueChange={changeMeasure} name="select-measure">
//                   <SelectTrigger className="h-8"><SelectValue placeholder="Chọn phép đo" /></SelectTrigger>
//                   <SelectContent>
//                     {availableMeasures.map(m => <SelectItem key={m} value={m} className="truncate" title={getDisplayTitle(m)}>{getDisplayTitle(m)}</SelectItem>)}
//                   </SelectContent>
//                 </Select>
//               </>
//             ) : (
//               <p className="text-sm text-gray-500">Không có phép đo nào.</p>
//             )}

//           </div>
//         </Card>




//         {/* Pivot - Disabled */}
//         {/* This card remains disabled as pivot is not implemented */}
//         {/* <Card className="p-4 opacity-50 cursor-not-allowed flex flex-col"> ... </Card> */}
//       </div>

//       {/* Data Table Display */}
//       <Card className="p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Dữ liệu
//           {currentView.measure ? `: ${getDisplayTitle(currentView.measure)}` : ""}
//           {/* Active filters are now displayed within the Slice card */}
//         </h2>
//         {isLoading && (
//           <div className="flex items-center justify-center p-8"><Loader2 className="mr-2 h-6 w-6 animate-spin" />Đang tải dữ liệu...</div>
//         )}
//         {/* Show data fetch error ONLY if schema was loaded successfully */}
//         {error && !isLoading && isSchemaLoaded && (
//           <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded">Lỗi tải dữ liệu: {error}</div>
//         )}
//         {/* Show "No data" message only if schema is loaded, not currently loading/erroring on data, and apiData is empty */}
//         {!isLoading && !error && apiData.length === 0 && isSchemaLoaded && (
//           <div className="p-4 text-gray-700 bg-gray-100 border border-gray-200 rounded">
//             Không có dữ liệu hiển thị cho yêu cầu hiện tại. (Có thể do bộ lọc hoặc không có dữ liệu từ API).
//             {effectiveTableHeaders.length > 0 && <p className="text-sm mt-1">Đã yêu cầu/nhận được các cột: {effectiveTableHeaders.map(getDisplayTitle).join(', ')}</p>}
//           </div>
//         )}
//         {/* Render table if not loading, no data error, and there are effective headers AND data */}
//         {!isLoading && !error && apiData.length > 0 && effectiveTableHeaders.length > 0 && (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   {/* Use effectiveTableHeaders derived from the actual response or requested headers */}
//                   {effectiveTableHeaders.map(hKey => (
//                     <TableHead key={hKey} className="text-center min-w-[140px] whitespace-nowrap">{getDisplayTitle(hKey)}</TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {apiData.map((row, rIdx) => (
//                   <TableRow key={`row-${rIdx}`}>
//                     {/* Render cells based on effectiveTableHeaders */}
//                     {effectiveTableHeaders.map(hKey => (
//                       <TableCell key={`${rIdx}-${hKey}`} className={`text-${typeof row[hKey] === 'number' ? 'right' : 'left'} whitespace-nowrap px-2 py-1`}>
//                         {row.hasOwnProperty(hKey) && row[hKey] !== null && row[hKey] !== undefined
//                           ? (typeof row[hKey] === 'number' ? row[hKey].toLocaleString() : row[hKey].toString())
//                           : '(Trống)'}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//         {/* Case where we have headers (e.g. requested ones) but API returned empty data array - handled by the "No data" message now */}
//       </Card>
//     </div>
//   );
// }





import { useEffect, useState, useCallback, useMemo } from "react"
import { Card } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Label } from "./components/ui/label"
import { ChevronDown, ChevronUp, RotateCw, Scissors, Loader2, XCircle } from 'lucide-react'

// Define the type for a single record from the API
type OrderRecord = {
  [key: string]: any; // Keys will be dynamic
};

// Define the structure for the current view state
type CurrentView = {
  measure: string;
  dimensions: {
    selectedColumns: string[];
    filters: Record<string, string>;
  };
};

const API_DOMAIN = "http://localhost:5000";
const DATA_API_URL = `${API_DOMAIN}/api`;
const SCHEMA_API_URL = `${API_DOMAIN}/api/get_all`;
const UNIQUE_VALUES_API_URL = `${API_DOMAIN}/api/get_unique_values`;
const API_LIMIT = 10000;
const API_OFFSET = 0;

// Helper function for Vietnamese display titles
const getDisplayTitle = (key: string): string => {
  return key;
};

export default function OLAPOperations() {
  const [apiData, setApiData] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Schema-related states (from /api/get_all)
  const [identifiedDimensions, setIdentifiedDimensions] = useState<string[]>([]);
  const [identifiedMeasures, setIdentifiedMeasures] = useState<string[]>([]);
  const [isSchemaLoaded, setIsSchemaLoaded] = useState(false);

  // State for actual headers from the last valid data response
  const [actualResponseHeaders, setActualResponseHeaders] = useState<string[]>([]);

  const [currentView, setCurrentView] = useState<CurrentView>({
    measure: "",
    dimensions: {
      selectedColumns: [],
      filters: {},
    },
  });

  // State for the Slice operation UI
  const [selectedDimensionForFilter, setSelectedDimensionForFilter] = useState<string>("");
  const [dimensionFilterValues, setDimensionFilterValues] = useState<Record<string, string[]>>({});
  const [isFetchingFilterValues, setIsFetchingFilterValues] = useState(false);
  const [filterValueInput, setFilterValueInput] = useState<string>("all");

  // New: measure filter states
  const [measureFilterInput, setMeasureFilterInput] = useState<string>("");
  const [measureFilterError, setMeasureFilterError] = useState<string | null>(null);
  const [measureFilters, setMeasureFilters] = useState<Record<string, string>>({});

  // Effect to fetch schema
  useEffect(() => {
    const fetchSchema = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(SCHEMA_API_URL);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Schema fetch HTTP error! status: ${response.status} - ${errorText}`);
        }
        const schemaData = await response.json();

        if (schemaData && Array.isArray(schemaData.dimensions) && Array.isArray(schemaData.measures)) {
          const dimensions = schemaData.dimensions as string[];
          const measures = schemaData.measures as string[];

          setIdentifiedDimensions(dimensions);
          setIdentifiedMeasures(measures);

          const initialSelectedColumns = [
            ...(dimensions.slice(0, 2)),
            ...(measures.length > 0 ? [measures[0]] : [])
          ].filter(Boolean);

          const initialMeasure = measures.length > 0 ? measures[0] : "";

          const initialFilters: Record<string, string> = {};
          if (dimensions.includes("Quarter")) initialFilters["Quarter"] = "2";
          if (dimensions.includes("Year")) initialFilters["Year"] = "2025";

          setCurrentView({
            measure: initialMeasure,
            dimensions: {
              selectedColumns: initialSelectedColumns.length > 0 ? initialSelectedColumns : (dimensions.length > 0 ? [dimensions[0]] : measures.length > 0 ? [measures[0]] : []),
              filters: initialFilters,
            },
          });

          setActualResponseHeaders(initialSelectedColumns.length > 0 ? initialSelectedColumns : (dimensions.length > 0 ? [dimensions[0]] : measures.length > 0 ? [measures[0]] : []));

          setIsSchemaLoaded(true);
        } else {
          throw new Error("Schema data is not in the expected format (missing 'dimensions' or 'measures' arrays).");
        }
      } catch (e: any) {
        setError(`Failed to fetch schema: ${e.message}`);
      } finally {
        if (!isSchemaLoaded) setIsLoading(false);
      }
    };
    fetchSchema();
  }, []);

  // Function to send data request to the backend
  const sendApiRequest = async (view: CurrentView) => {
    const selectedDimensionsApi = view.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
    const selectedMeasuresApi = view.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));

    if (view.measure && identifiedMeasures.includes(view.measure) && !selectedMeasuresApi.includes(view.measure)) {
      selectedMeasuresApi.push(view.measure);
    }

    // Separate filters into dimension and measure filters based on schema
    const dimensionFiltersApi: Record<string, string> = {};
    // Use measureFilters state for measure filters
    const measureFiltersApi: Record<string, string> = { ...measureFilters };

    Object.entries(view.dimensions.filters).forEach(([key, value]) => {
      if (value !== "" && value !== "all" && value !== undefined) {
        if (identifiedDimensions.includes(key)) {
          dimensionFiltersApi[key] = value;
        }
      }
    });

    const measuresInRequestBody = view.measure ? [view.measure] : [];

    const requestBody = {
      dimensions: selectedDimensionsApi,
      measure: measuresInRequestBody,
      limit: API_LIMIT,
      offset: API_OFFSET,
      measure_filters: measureFiltersApi,
      dimension_filters: dimensionFiltersApi
    };

    const response = await fetch(DATA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    return response.json();
  };

  // Effect to fetch data when view changes or after schema is loaded
  useEffect(() => {
    if (!isSchemaLoaded) {
      return;
    }

    const fetchData = async () => {
      if (!isLoading) setIsLoading(true);
      setError(null);

      const requestedDimensions = currentView.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
      const requestedMeasures = currentView.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));
      const expectedResponseHeaders = [...requestedDimensions, ...requestedMeasures];
      if (currentView.measure && identifiedMeasures.includes(currentView.measure) && !expectedResponseHeaders.includes(currentView.measure)) {
        expectedResponseHeaders.push(currentView.measure);
      }

      try {
        const data = await sendApiRequest(currentView);

        if (Array.isArray(data)) {
          setApiData(data);
          if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const responseKeys = Object.keys(data[0]);
            setActualResponseHeaders(responseKeys);
          } else {
            setActualResponseHeaders(expectedResponseHeaders);
          }
        } else {
          setError("Failed to fetch data: Unexpected format from API.");
          setApiData([]);
          setActualResponseHeaders(expectedResponseHeaders);
        }
      } catch (e: any) {
        setError(`Failed to fetch data: ${e.message}`);
        setApiData([]);
        setActualResponseHeaders(expectedResponseHeaders);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentView, isSchemaLoaded, identifiedDimensions, identifiedMeasures, measureFilters]);

  // Fetch unique values for a dimension when selected for filtering
  const fetchUniqueValues = useCallback(async (dimensionKey: string) => {
    if (dimensionFilterValues[dimensionKey]) {
      return;
    }
    setIsFetchingFilterValues(true);
    setError(null);
    try {
      const response = await fetch(`${UNIQUE_VALUES_API_URL}?dimension=${encodeURIComponent(dimensionKey)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unique values fetch HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setDimensionFilterValues(prev => ({ ...prev, [dimensionKey]: data.map(String) }));
      } else {
        throw new Error("Unique values API returned data in unexpected format.");
      }
    } catch (e: any) {
      setDimensionFilterValues(prev => ({ ...prev, [dimensionKey]: [] }));
    } finally {
      setIsFetchingFilterValues(false);
    }
  }, [dimensionFilterValues]);

  // Drill Down: Add a dimension to selected columns
  const drillDown = (dimensionKey: string) => {
    if (identifiedDimensions.includes(dimensionKey) && !currentView.dimensions.selectedColumns.includes(dimensionKey)) {
      setCurrentView(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          selectedColumns: [...prev.dimensions.selectedColumns, dimensionKey]
        },
      }));
    }
  };

  // Roll Up: Remove a dimension from selected columns
  const rollUp = (dimensionKey: string) => {
    const currentlySelectedDimensions = currentView.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
    const currentlySelectedMeasures = currentView.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));

    if (identifiedDimensions.includes(dimensionKey) && currentView.dimensions.selectedColumns.includes(dimensionKey)) {
      if (currentlySelectedDimensions.length <= 1 && currentlySelectedMeasures.length === 0) {
        return;
      }
      if (currentView.dimensions.selectedColumns.length <= 1) {
        return;
      }
      setCurrentView(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          selectedColumns: prev.dimensions.selectedColumns.filter(col => col !== dimensionKey)
        },
      }));
    }
  };

  // Slice: Add or change a filter for a dimension
  const slice = (dimensionKey: string, value: string) => {
    if (identifiedDimensions.includes(dimensionKey)) {
      setCurrentView(prev => {
        const newFilters = { ...prev.dimensions.filters };
        if (value === "all" || value === "" || value === undefined) {
          delete newFilters[dimensionKey];
        } else {
          newFilters[dimensionKey] = value;
        }
        return { ...prev, dimensions: { ...prev.dimensions, filters: newFilters } };
      });
    }
  };

  // Remove an active filter
  const removeFilter = (dimension: string) => {
    slice(dimension, "all");
    if (selectedDimensionForFilter === dimension) {
      setFilterValueInput("all");
      setSelectedDimensionForFilter("");
    }
  };

  // Change the primary measure (for context/title and implicitly included in measure list for backend)
  const changeMeasure = (measureKey: string) => {
    if (identifiedMeasures.includes(measureKey)) {
      setCurrentView(prev => {
        const newState = { ...prev, measure: measureKey };
        return newState;
      });
    }
  };

  // Pivot operation is not supported
  const pivot = () => console.warn("Pivot not supported.");

  // Determine headers for table rendering
  const getEffectiveTableHeaders = (): string[] => {
    if (actualResponseHeaders.length > 0) {
      return actualResponseHeaders;
    }
    if (isSchemaLoaded && !isLoading && !error) {
      const requestedDimensions = currentView.dimensions.selectedColumns.filter(col => identifiedDimensions.includes(col));
      const requestedMeasures = currentView.dimensions.selectedColumns.filter(col => identifiedMeasures.includes(col));
      const expectedHeaders = [...requestedDimensions, ...requestedMeasures];
      if (currentView.measure && identifiedMeasures.includes(currentView.measure) && !expectedHeaders.includes(currentView.measure)) {
        expectedHeaders.push(currentView.measure);
      }
      return expectedHeaders;
    }
    return [];
  };

  const effectiveTableHeaders = getEffectiveTableHeaders();

  // Memoized lists for UI efficiency and correctness
  const availableDimensionsToDrillDown = useMemo(() => {
    return identifiedDimensions.filter(dim => !currentView.dimensions.selectedColumns.includes(dim));
  }, [identifiedDimensions, currentView.dimensions.selectedColumns]);

  const selectedDimensionsToRollUp = useMemo(() => {
    return identifiedDimensions.filter(dim => currentView.dimensions.selectedColumns.includes(dim));
  }, [identifiedDimensions, currentView.dimensions.selectedColumns]);

  const availableDimensionsForFilter = useMemo(() => {
    return identifiedDimensions;
  }, [identifiedDimensions]);

  const availableMeasures = useMemo(() => {
    return identifiedMeasures;
  }, [identifiedMeasures]);

  // Handle change in the dimension selection for filtering
  const handleDimensionSelectForFilter = (dimensionKey: string) => {
    setSelectedDimensionForFilter(dimensionKey);
    setFilterValueInput("all");
    if (dimensionKey && identifiedDimensions.includes(dimensionKey)) {
      fetchUniqueValues(dimensionKey);
    } else {
      setDimensionFilterValues(prev => {
        const newState = { ...prev };
        delete newState[dimensionKey];
        return newState;
      });
    }
  };

  // Handle change in the filter value selection
  const handleFilterValueChange = (value: string) => {
    setFilterValueInput(value);
    if (selectedDimensionForFilter) {
      slice(selectedDimensionForFilter, value);
    }
  };

  // --- New: Apply measure filter handler ---
  const applyMeasureFilter = () => {
    setMeasureFilterError(null);
    const trimmed = measureFilterInput.trim();
    if (!currentView.measure) {
      setMeasureFilterError("Vui lòng chọn phép đo trước khi lọc.");
      return;
    }
    if (!trimmed) {
      setMeasureFilterError("Điền điều kiện lọc (ví dụ: >100, =200, <300).");
      return;
    }
    // Accept simple operators: =, >, <, >=, <=, !=
    const regex = /^([<>=!]=?|=)\s*([\d.]+)$/;
    const match = trimmed.match(regex);
    if (!match) {
      setMeasureFilterError("Định dạng điều kiện không hợp lệ. Ví dụ hợp lệ: >100, <= 200, =150");
      return;
    }
    setMeasureFilters(prev => ({
      ...prev,
      [currentView.measure]: trimmed,
    }));
  };

  // Remove measure filter utility
  const removeMeasureFilter = (measure: string) => {
    setMeasureFilters(prev => {
      const newState = { ...prev };
      delete newState[measure];
      return newState;
    });
    if (currentView.measure === measure) {
      setMeasureFilterInput("");
      setMeasureFilterError(null);
    }
  };

  // --- UI Rendering Logic ---

  if (isLoading && !isSchemaLoaded && !error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin inline-block" /> Đang tải cấu trúc dữ liệu...
      </div>
    );
  }

  if (error && !isSchemaLoaded) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600">Lỗi tải cấu trúc dữ liệu: {error}</p>
        <p className="text-gray-500">Vui lòng kiểm tra API backend ({SCHEMA_API_URL}, {UNIQUE_VALUES_API_URL}, {DATA_API_URL}) và thử lại.</p>
      </div>
    );
  }

  if (!isSchemaLoaded && !error && !isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-orange-600">Không thể tải cấu trúc dữ liệu từ API.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Phân tích Dữ liệu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Drill Down */}
        <Card className="p-4 flex flex-col">
          <div className="flex items-center mb-2">
            <ChevronDown className="mr-2 h-4 w-4" />
            <h3 className="font-medium">Khoan xuống (Thêm Dimension)</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">Thêm Dimension vào bảng</p>
          <div className="grid grid-cols-2 gap-2 flex-grow max-h-48 overflow-y-auto pr-2">
            {availableDimensionsToDrillDown.length > 0 ? availableDimensionsToDrillDown.map(key => (
              <Button key={key} onClick={() => drillDown(key)} variant="outline" size="sm" className="truncate" title={getDisplayTitle(key)}>
                {getDisplayTitle(key)}
              </Button>
            )) : <p className="text-sm text-gray-500 col-span-2">Tất cả Dimensions đã được chọn.</p>}
          </div>
        </Card>

        {/* Roll Up */}
        <Card className="p-4 flex flex-col">
          <div className="flex items-center mb-2">
            <ChevronUp className="mr-2 h-4 w-4" />
            <h3 className="font-medium">Cuộn lên (Loại bỏ Dimension)</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">Loại bỏ Dimension khỏi bảng</p>
          <div className="grid grid-cols-2 gap-2 flex-grow max-h-48 overflow-y-auto pr-2">
            {selectedDimensionsToRollUp.length > 0 ? selectedDimensionsToRollUp.map(key => (
              <Button
                key={key}
                onClick={() => rollUp(key)}
                variant="outline"
                size="sm"
                className="truncate"
                title={getDisplayTitle(key)}
                disabled={currentView.dimensions.selectedColumns.length <= 1}
              >
                {getDisplayTitle(key)}
              </Button>
            )) : <p className="text-sm text-gray-500 col-span-2">Chưa có Dimensions nào được chọn.</p>}
          </div>
        </Card>

        {/* Slice (Filtering) */}
        <Card className="p-4 flex flex-col">
          <div className="flex items-center mb-2">
            <Scissors className="mr-2 h-4 w-4" />
            <h3 className="font-medium">Chiếu chọn (Lọc)</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">Lọc dữ liệu theo Dimension</p>
          <div className="flex flex-col space-y-2 flex-grow max-h-48 overflow-y-auto pr-2">
            <Label htmlFor="filter-dimension-select">Chọn Dimension để lọc:</Label>
            <Select value={selectedDimensionForFilter} onValueChange={handleDimensionSelectForFilter} name="filter-dimension-select">
              <SelectTrigger className="h-8"><SelectValue placeholder="Chọn Dimension" /></SelectTrigger>
              <SelectContent>
                {availableDimensionsForFilter.length > 0 ? availableDimensionsForFilter.map(dim => (
                  <SelectItem key={`filter-dim-${dim}`} value={dim} className="truncate" title={getDisplayTitle(dim)}>
                    {getDisplayTitle(dim)} {currentView.dimensions.filters[dim] ? `(Đã lọc: ${currentView.dimensions.filters[dim]})` : ''}
                  </SelectItem>
                )) : <SelectItem value="" disabled>Không có Dimension nào</SelectItem>}
              </SelectContent>
            </Select>

            {selectedDimensionForFilter && (
              <>
                <Label htmlFor="filter-value-select">Chọn giá trị:</Label>
                <Select value={filterValueInput} onValueChange={handleFilterValueChange} name="filter-value-select" disabled={isFetchingFilterValues}>
                  <SelectTrigger className="h-8">
                    {isFetchingFilterValues ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    <SelectValue placeholder="Chọn giá trị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả ({getDisplayTitle(selectedDimensionForFilter)})</SelectItem>
                    {dimensionFilterValues[selectedDimensionForFilter]?.length > 0 ? (
                      dimensionFilterValues[selectedDimensionForFilter].map(value => (
                        <SelectItem key={`filter-value-${value}`} value={value.toString()}>{value}</SelectItem>
                      ))
                    ) : isFetchingFilterValues ? null : (
                      <SelectItem value="no-values" disabled>Không tìm thấy giá trị</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Bộ lọc đang áp dụng:</h4>
            {Object.entries(currentView.dimensions.filters).length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2">
                {Object.entries(currentView.dimensions.filters).map(([key, value]) => (
                  <span key={key} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {getDisplayTitle(key)}: {value}
                    <button onClick={() => removeFilter(key)} className="ml-1 text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-400 focus:outline-none">
                      <XCircle className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Không có bộ lọc nào.</p>
            )}
          </div>
        </Card>

        {/* Measure Selection */}
        <Card className="p-4 flex flex-col">
          <div className="flex items-center mb-2">
            <RotateCw className="mr-2 h-4 w-4" />
            <h3 className="font-medium">Chọn Phép đo chính</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">Chọn phép đo để hiển thị</p>
          <div className="flex flex-col space-y-2 flex-grow max-h-48 overflow-y-auto pr-2">
            {availableMeasures.length > 0 ? (
              <>
                <Label htmlFor="select-measure">Phép đo:</Label>
                <Select value={currentView.measure} onValueChange={changeMeasure} name="select-measure">
                  <SelectTrigger className="h-8"><SelectValue placeholder="Chọn phép đo" /></SelectTrigger>
                  <SelectContent>
                    {availableMeasures.map(m => <SelectItem key={m} value={m} className="truncate" title={getDisplayTitle(m)}>{getDisplayTitle(m)}</SelectItem>)}
                  </SelectContent>
                </Select>

                {/* --- New: Measure filter input --- */}
                {currentView.measure && (
                  <div className="flex flex-col gap-1 mt-2">
                    <Label htmlFor="measure-filter-input">Điều kiện cho phép đo ({getDisplayTitle(currentView.measure)}):</Label>
                    <div className="flex flex-row gap-2 items-center">
                      <input
                        id="measure-filter-input"
                        type="text"
                        value={measureFilterInput}
                        onChange={e => setMeasureFilterInput(e.target.value)}
                        placeholder="VD: >100, =200"
                        className="border rounded px-2 py-1 flex-grow"
                        style={{ minWidth: 80 }}
                      />
                      <Button type="button" size="sm" onClick={applyMeasureFilter}>Áp dụng</Button>
                    </div>
                    {measureFilterError && <span className="text-xs text-red-500">{measureFilterError}</span>}
                  </div>
                )}

                {/* --- Display active measure filter --- */}
                {currentView.measure && measureFilters[currentView.measure] && (
                  <div className="flex items-center mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Bộ lọc: {getDisplayTitle(currentView.measure)} {measureFilters[currentView.measure]}
                    <button
                      onClick={() => removeMeasureFilter(currentView.measure)}
                      className="ml-2 text-blue-900 hover:text-red-600 focus:outline-none"
                      title="Xóa điều kiện"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">Không có phép đo nào.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Data Table Display */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Dữ liệu
          {currentView.measure ? `: ${getDisplayTitle(currentView.measure)}` : ""}
        </h2>
        {isLoading && (
          <div className="flex items-center justify-center p-8"><Loader2 className="mr-2 h-6 w-6 animate-spin" />Đang tải dữ liệu...</div>
        )}
        {error && !isLoading && isSchemaLoaded && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded">Lỗi tải dữ liệu: {error}</div>
        )}
        {!isLoading && !error && apiData.length === 0 && isSchemaLoaded && (
          <div className="p-4 text-gray-700 bg-gray-100 border border-gray-200 rounded">
            Không có dữ liệu hiển thị cho yêu cầu hiện tại. (Có thể do bộ lọc hoặc không có dữ liệu từ API).
            {effectiveTableHeaders.length > 0 && <p className="text-sm mt-1">Đã yêu cầu/nhận được các cột: {effectiveTableHeaders.map(getDisplayTitle).join(', ')}</p>}
          </div>
        )}
        {!isLoading && !error && apiData.length > 0 && effectiveTableHeaders.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {effectiveTableHeaders.map(hKey => (
                    <TableHead key={hKey} className="text-center min-w-[140px] whitespace-nowrap">{getDisplayTitle(hKey)}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiData.map((row, rIdx) => (
                  <TableRow key={`row-${rIdx}`}>
                    {effectiveTableHeaders.map(hKey => (
                      <TableCell
                        key={`${rIdx}-${hKey}`}
                        className={`text-center align-middle whitespace-nowrap px-2 py-1`}
                      >
                        {row.hasOwnProperty(hKey) && row[hKey] !== null && row[hKey] !== undefined
                          ? (typeof row[hKey] === 'number' ? row[hKey].toLocaleString() : row[hKey].toString())
                          : '(Trống)'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}