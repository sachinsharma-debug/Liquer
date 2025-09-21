// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Loader2, Plus, Trash2, Edit } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { BASE_URL } from "@/api/BaseUrl";

// interface Depot {
//   _id: string;
//   Name: string;
//   Parent: string;
//   Allow_Storage: "Yes" | "No";
//   Our_Stock_With_Third_Party: "Yes" | "No";
//   Third_Party_Stock_With_Us: "Yes" | "No";
// }

// export default function DepotManagement() {
//   const { toast } = useToast();
//   const [depots, setDepots] = useState<Depot[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [allowAdvancedFeatures, setAllowAdvancedFeatures] = useState(false);

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   // Current depot states
//   const [depotToDelete, setDepotToDelete] = useState<string | null>(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentDepotId, setCurrentDepotId] = useState<string | null>(null);

//   // Form states
//   const [formData, setFormData] = useState<Omit<Depot, "_id">>({
//     Name: "",
//     Parent: "Primary",
//     Allow_Storage: "Yes",
//     Our_Stock_With_Third_Party: "No",
//     Third_Party_Stock_With_Us: "No",
//   });

//   // Fetch all depots
//   useEffect(() => {
//     const fetchDepots = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`${BASE_URL}/get_depot`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch depots");
//         }
//         const data = await response.json();
//         setDepots(data.data || []);
//       } catch (error) {
//         setError(error.message);
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: error.message,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDepots();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (
//     field: keyof Omit<Depot, "_id">,
//     value: string
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Open modal for creating new depot
//   const handleCreateDepot = () => {
//     setCurrentDepotId(null);
//     setIsEditMode(false);
//     setAllowAdvancedFeatures(false);
//     setFormData({
//       Name: "",
//       Parent: "Primary",
//       Allow_Storage: "Yes",
//       Our_Stock_With_Third_Party: "No",
//       Third_Party_Stock_With_Us: "No",
//     });
//     setIsModalOpen(true);
//   };

//   // Open modal for editing existing depot
//   const handleEditDepot = (depot: Depot) => {
//     setCurrentDepotId(depot._id);
//     setIsEditMode(true);
//     setAllowAdvancedFeatures(true); // Enable advanced features when editing
//     setFormData({
//       Name: depot.Name,
//       Parent: depot.Parent,
//       Allow_Storage: depot.Allow_Storage,
//       Our_Stock_With_Third_Party: depot.Our_Stock_With_Third_Party,
//       Third_Party_Stock_With_Us: depot.Third_Party_Stock_With_Us,
//     });
//     setIsModalOpen(true);
//   };

//   // Open confirmation modal for deleting depot
//   const handleDeleteDepot = (id: string) => {
//     setDepotToDelete(id);
//     setIsDeleteModalOpen(true);
//   };

//   // Submit form (create or update)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);
//       const method = isEditMode ? "PUT" : "POST";
//       const url = isEditMode
//         ? `${BASE_URL}/update_depot/${currentDepotId}`
//         : `${BASE_URL}/create_depot`;

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(
//           isEditMode ? "Failed to update depot" : "Failed to create depot"
//         );
//       }

//       const result = await response.json();

//       // Refresh the depot list after successful operation
//       const refreshResponse = await fetch(`${BASE_URL}/get_depot`);
//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setDepots(refreshData.data || []);
//       }

//       toast({
//         title: "Success",
//         description: isEditMode
//           ? "Depot updated successfully"
//           : "Depot created successfully",
//       });

//       setIsModalOpen(false);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Confirm and execute depot deletion
//   const confirmDelete = async () => {
//     if (!depotToDelete) return;

//     try {
//       setIsLoading(true);
//       const response = await fetch(
//         `${BASE_URL}/delete_depot/${depotToDelete}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete depot");
//       }

//       // Refresh the depot list after successful deletion
//       const refreshResponse = await fetch(`${BASE_URL}/get_depot`);
//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setDepots(refreshData.data || []);
//       }

//       toast({
//         title: "Success",
//         description: "Depot deleted successfully",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     } finally {
//       setIsLoading(false);
//       setIsDeleteModalOpen(false);
//       setDepotToDelete(null);
//     }
//   };

//   // Get parent options for select dropdown
//   const getParentOptions = () => {
//     const primaryDepots = depots.filter((depot) => depot.Parent === "Primary");
//     return ["Primary", ...primaryDepots.map((depot) => depot.Name)];
//   };

//   if (isLoading && depots.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading depots...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">Depot Management</h1>
//         <Button onClick={handleCreateDepot}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Depot
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Depot List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {depots.length === 0 ? (
//             <div className="text-center py-8">
//               <p>No depots found</p>
//               <Button
//                 variant="link"
//                 className="mt-2"
//                 onClick={handleCreateDepot}
//               >
//                 Create your first depot
//               </Button>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Parent</TableHead>
//                   <TableHead>Allow Storage</TableHead>
//                   <TableHead>Our Stock With Third Party</TableHead>
//                   <TableHead>Third Party Stock With Us</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {depots.map((depot) => (
//                   <TableRow key={depot._id}>
//                     <TableCell className="font-medium">{depot.Name}</TableCell>
//                     <TableCell>{depot.Parent}</TableCell>
//                     <TableCell>{depot.Allow_Storage}</TableCell>
//                     <TableCell>{depot.Our_Stock_With_Third_Party}</TableCell>
//                     <TableCell>{depot.Third_Party_Stock_With_Us}</TableCell>
//                     <TableCell className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEditDepot(depot)}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleDeleteDepot(depot._id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* Create/Edit Depot Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-3xl max-h-[100vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditMode ? "Edit Depot" : "Create New Depot"}
//             </DialogTitle>
//             <DialogDescription>
//               {isEditMode
//                 ? "Update the depot details below"
//                 : "Fill in the details to create a new depot"}
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-1">
//             <div className="flex items-center gap-2">
//               <Label htmlFor="masterId" className="text-xs w-20 text-right">
//                 Master Id:
//               </Label>
//               <Input
//                 id="masterId"
//                 name="masterId"
//                 placeholder="Master Id"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="alternateId" className="text-xs w-20 text-right">
//                 Alter Id:
//               </Label>
//               <Input
//                 id="alternateId"
//                 name="alternateId"
//                 placeholder="Alter Id"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="name" className="text-xs w-20 text-right">
//                 Name:
//               </Label>
//               <Input
//                 id="name"
//                 value={formData.Name}
//                 onChange={(e) => handleInputChange("Name", e.target.value)}
//                 placeholder="Enter depot name"
//                 className="h-6 text-xs flex-1"
//                 required
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Label htmlFor="parent" className="text-xs w-20 text-right">
//                 Parent:
//               </Label>
//               <Select
//                 value={formData.Parent}
//                 onValueChange={(value) => handleInputChange("Parent", value)}
//               >
//                 <SelectTrigger className="h-6 text-xs flex-1">
//                   <SelectValue placeholder="Select parent depot" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {getParentOptions().map((parent) => (
//                     <SelectItem key={parent} value={parent}>
//                       {parent}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="address" className="text-xs w-20 text-right">
//                 Address:
//               </Label>
//               <Textarea
//                 id="address"
//                 name="address"
//                 placeholder="Company Address"
//                 className="h-6 text-xs resize-none flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="state" className="text-xs w-20 text-right">
//                 State:
//               </Label>
//               <Input
//                 id="state"
//                 name="state"
//                 placeholder="Company State"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="country" className="text-xs w-20 text-right">
//                 Country:
//               </Label>
//               <Input
//                 id="country"
//                 name="country"
//                 placeholder="Country"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="pinCode" className="text-xs w-20 text-right">
//                 PinCode:
//               </Label>
//               <Input
//                 id="pinCode"
//                 name="pinCode"
//                 placeholder="Pincode"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="mobile" className="text-xs w-20 text-right">
//                 Mobile:
//               </Label>
//               <Input
//                 id="mobile"
//                 name="mobile"
//                 placeholder="+91 9876543210"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="telephone" className="text-xs w-20 text-right">
//                 TelePhone:
//               </Label>
//               <Input
//                 id="telephone"
//                 name="telephone"
//                 placeholder="1234567890"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Label
//                 htmlFor="advancedFeatures"
//                 className="text-xs w-32 text-right"
//               >
//                 Allow Advanced Features:
//               </Label>
//               <Switch
//                 id="advancedFeatures"
//                 checked={allowAdvancedFeatures}
//                 onCheckedChange={setAllowAdvancedFeatures}
//               />
//             </div>

//             {allowAdvancedFeatures && (
//               <>
//                 <div className="flex items-center gap-2">
//                   <Label
//                     htmlFor="allowStorage"
//                     className="text-xs w-32 text-right"
//                   >
//                     Allow Storage:
//                   </Label>
//                   <Select
//                     value={formData.Allow_Storage}
//                     onValueChange={(value) =>
//                       handleInputChange("Allow_Storage", value as "Yes" | "No")
//                     }
//                   >
//                     <SelectTrigger className="h-6 text-xs flex-1">
//                       <SelectValue placeholder="Select storage option" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Yes">Yes</SelectItem>
//                       <SelectItem value="No">No</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Label
//                     htmlFor="ourStockThirdParty"
//                     className="text-xs w-32 text-right"
//                   >
//                     Our Stock With Third Party:
//                   </Label>
//                   <Select
//                     value={formData.Our_Stock_With_Third_Party}
//                     onValueChange={(value) =>
//                       handleInputChange(
//                         "Our_Stock_With_Third_Party",
//                         value as "Yes" | "No"
//                       )
//                     }
//                   >
//                     <SelectTrigger className="h-6 text-xs flex-1">
//                       <SelectValue placeholder="Select option" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Yes">Yes</SelectItem>
//                       <SelectItem value="No">No</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Label
//                     htmlFor="thirdPartyStockUs"
//                     className="text-xs w-32 text-right"
//                   >
//                     Third Party Stock With Us:
//                   </Label>
//                   <Select
//                     value={formData.Third_Party_Stock_With_Us}
//                     onValueChange={(value) =>
//                       handleInputChange(
//                         "Third_Party_Stock_With_Us",
//                         value as "Yes" | "No"
//                       )
//                     }
//                   >
//                     <SelectTrigger className="h-6 text-xs flex-1">
//                       <SelectValue placeholder="Select option" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Yes">Yes</SelectItem>
//                       <SelectItem value="No">No</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </>
//             )}

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {isEditMode ? "Update" : "Create"} Depot
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Modal */}
//       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you sure?</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the
//               depot.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsDeleteModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={confirmDelete}
//               disabled={isLoading}
//             >
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/api/BaseUrl";

interface Depot {
  _id: string;
  Name: string;
  Parent: string;
  Allow_Storage: "Yes" | "No";
  Our_Stock_With_Third_Party: "Yes" | "No";
  Third_Party_Stock_With_Us: "Yes" | "No";
  masterId?: string;
  alternateId?: string;
  Address?: string;
  State?: string;
  Country?: string;
  PinCode?: string;
  Email?: string;
  Mobile?: string;
  clientName: string;
  clientAddress?: string;
  clientState?: string;
  clientCountry?: string;
  clientPinCode?: string;
  clientEmail?: string;
  clientMobile?: string;
  tallyEdition?: string;
  tallySerialno?: string;
  validTill?: string;
  registrationDate?: string;
  partnerCode?: string;
  partnerName?: string;
  Telephone?: string;
}

interface DepotFormData {
  Name: string;
  Parent: string;
  Allow_Storage: "Yes" | "No";
  Our_Stock_With_Third_Party: "Yes" | "No";
  Third_Party_Stock_With_Us: "Yes" | "No";
  masterId?: string;
  alternateId?: string;
  Address?: string;
  State?: string;
  Country?: string;
  PinCode?: string;
  Email?: string;
  Mobile?: string;
  clientName: string;
  clientAddress?: string;
  clientState?: string;
  clientCountry?: string;
  clientPinCode?: string;
  clientEmail?: string;
  clientMobile?: string;
  tallyEdition?: string;
  tallySerialno?: string;
  validTill?: string;
  registrationDate?: string;
  partnerCode?: string;
  partnerName?: string;
  Telephone?: string;
}

export default function Integration() {
  console.log(State,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  const { toast } = useToast();
  const [depots, setDepots] = useState<Depot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowAdvancedFeatures, setAllowAdvancedFeatures] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Current depot states
  const [depotToDelete, setDepotToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDepotId, setCurrentDepotId] = useState<string | null>(null);

  // Country-State-City data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [modalOpen, setModalopen] = useState(false);
  const [clientStates, setClientStates] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState<DepotFormData>({
    Name: "",
    Parent: "Primary",
    Allow_Storage: "Yes",
    Our_Stock_With_Third_Party: "No",
    Third_Party_Stock_With_Us: "No",
    masterId: "",
    alternateId: "",
    Address: "",
    State: "",
    Country: "",
    PinCode: "",
    Email: "",
    Mobile: "",

    clientName: "",
    clientAddress: "",
    clientState: "",
    clientCountry: "",
    clientPinCode: "",
    clientEmail: "",
    clientMobile: "",

    tallyEdition: "",
    tallySerialno: "",
    validTill: "",
    registrationDate: "",
    partnerCode: "",
    partnerName: "",

    Telephone: ""
  });

  // Load countries on component mount
  useEffect(() => {
    const countryData = Country.getAllCountries().map(country => ({
      name: country.name,
      isoCode: country.isoCode
    }));
    setCountries(countryData);
  }, []);

  // Fetch all depots
  useEffect(() => {
    fetchDepots();
  }, []);

  // Update states when country changes
  useEffect(() => {
    
    if (formData.Country) {
      const countryCode = countries.find(c => c.name === formData.Country)?.isoCode;
      if (countryCode) {
        const stateData = State.getStatesOfCountry(countryCode).map(state => ({
          name: state.name,
          isoCode: state.isoCode
        }));
        console.log(stateData,"lasdsadasdlllll")
        setStates(stateData);
          if (isModalOpen == true) {
        setTimeout(() => {
          $(".statete").chosen();
           $(".statete").on("change",function(e){
            // console.log(e.target.value,"lllll")
            //          handleCountryChange(e.target.value)
                     
      })
        }, 500)
      }
      }
    } else {
      setStates([]);
    }
  }, [formData.Country, countries]);


  useEffect(() => {
      // initialize select2 on the <select>
      // initialize select2

      
      
      if (isModalOpen == true) {
        setTimeout(() => {
          $(".sachin").chosen();
           $(".sachin").on("change",function(e){
            console.log(e.target.value,"lllll")
                     handleCountryChange(e.target.value)
                      $(".statete").chosen("destroy");
                     
      })
        }, 500)
      }
     
  
  }, [isModalOpen]);

  // Update client states when client country changes
  useEffect(() => {
    if (formData.clientCountry) {
      const countryCode = countries.find(c => c.name === formData.clientCountry)?.isoCode;
      if (countryCode) {
        const stateData = State.getStatesOfCountry(countryCode).map(state => ({
          name: state.name,
          isoCode: state.isoCode
        }));
        setClientStates(stateData);
      }
    } else {
      setClientStates([]);
    }
  }, [formData.clientCountry, countries]);

  const fetchDepots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}get_master/integration`,{
        method:"GET",
           credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch depots");
      }
      const data = await response.json();
      console.log(data, "test")

      setDepots(data.data || []);
    } catch (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof DepotFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle country change for company
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.isoCode === countryCode);
    if (country) {
      setFormData(prev => ({
        ...prev,
        Country: country.name
      }));
    }
  };

  // Handle state change for company
  const handleStateChange = (stateCode: string) => {
    const state = states.find(s => s.isoCode === stateCode);
    if (state) {
      setFormData(prev => ({
        ...prev,
        State: state.name
      }));
    }
  };

  // Handle country change for client
  const handleClientCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.isoCode === countryCode);
    if (country) {
      setFormData(prev => ({
        ...prev,
        clientCountry: country.name
      }));
    }
  };

  // Handle state change for client
  const handleClientStateChange = (stateCode: string) => {
    const state = clientStates.find(s => s.isoCode === stateCode);
    if (state) {
      setFormData(prev => ({
        ...prev,
        clientState: state.name
      }));
    }
  };

  // Open modal for creating new depot
  const handleCreateDepot = () => {
    setCurrentDepotId(null);
    setIsEditMode(false);
    setAllowAdvancedFeatures(false);
    setFormData({
      Name: "",
      Parent: "Primary",
      Allow_Storage: "Yes",
      Our_Stock_With_Third_Party: "No",
      Third_Party_Stock_With_Us: "No",
      masterId: "",
      alternateId: "",
      Address: "",
      State: "",
      Country: "",
      PinCode: "",
      Mobile: "",
      clientName: "",
      clientAddress: "",
      clientState: "",
      clientCountry: "",
      clientPinCode: "",
      clientMobile: "",
      Email: "",
      clientEmail: "",

      tallyEdition: "",
      tallySerialno: "",
      validTill: "",
      registrationDate: "",
      partnerCode: "",
      partnerName: "",

      Telephone: ""
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing depot
  const handleEditDepot = (depot: Depot) => {
    setCurrentDepotId(depot._id);
    setIsEditMode(true);
    setAllowAdvancedFeatures(true);
    setFormData({
      Name: depot.Name,
      Parent: depot.Parent,
      Allow_Storage: depot.Allow_Storage,
      Our_Stock_With_Third_Party: depot.Our_Stock_With_Third_Party,
      Third_Party_Stock_With_Us: depot.Third_Party_Stock_With_Us,
      masterId: depot.masterId || "",
      alternateId: depot.alternateId || "",
      Address: depot.Address || "",
      State: depot.State || "",
      Country: depot.Country || "",
      PinCode: depot.PinCode || "",
      Mobile: depot.Mobile || "",
      Email: depot.Email || "",
      clientEmail: depot.clientEmail || "",

      clientName: depot.clientName,
      clientAddress: depot.clientAddress,
      clientState: depot.clientState,
      clientCountry: depot.clientCountry,
      clientPinCode: depot.clientPinCode,
      clientMobile: depot.clientMobile,

      tallyEdition: depot.tallyEdition,
      tallySerialno: depot.tallySerialno,
      validTill: depot.validTill,
      registrationDate: depot.registrationDate,
      partnerCode: depot.partnerCode,
      partnerName: depot.partnerName,
      Telephone: depot.Telephone || ""
    });
    setIsModalOpen(true);
  };

  // Open confirmation modal for deleting depot
  const handleDeleteDepot = (id: string) => {
    setDepotToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${BASE_URL}update_master/${currentDepotId}`
        : `${BASE_URL}create_master`;
      let payload = {
        tablename: "integration",
        data: formData
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
           credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Operation failed");
      }

      await fetchDepots();

      toast({
        title: "Success",
        description: isEditMode
          ? "Integration updated successfully"
          : "Integration created successfully",
      });

      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm and execute depot deletion
  const confirmDelete = async () => {
    if (!depotToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${BASE_URL}delete_master/${depotToDelete}/integration`,
        {
          method: "DELETE",
             credentials: "include",
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete integration");
      }
      await fetchDepots();
      toast({
        title: "Success",
        description: "Integration deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setDepotToDelete(null);
    }
  };

  // Get parent options for select dropdown
  const getParentOptions = () => {
    const primaryDepots = depots.filter((depot) => depot.Parent === "Primary");
    return ["Primary", ...primaryDepots.map((depot) => depot.Name)];
  };

  if (isLoading && depots.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Integration...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Integration Management</h1>
        <Button onClick={handleCreateDepot}>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration List</CardTitle>
        </CardHeader>
        <CardContent>
          {depots.length === 0 ? (
            <div className="text-center py-8">
              <p>No depots found</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={handleCreateDepot}
              >
                Create your first depot
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Allow Storage</TableHead>
                  <TableHead>Our Stock With Third Party</TableHead>
                  <TableHead>Third Party Stock With Us</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depots.map((depot) => (
                  <TableRow key={depot._id}>
                    <TableCell className="font-medium">{depot.Name}</TableCell>
                    <TableCell>{depot.Parent}</TableCell>
                    <TableCell>{depot.Allow_Storage}</TableCell>
                    <TableCell>{depot.Our_Stock_With_Third_Party}</TableCell>
                    <TableCell>{depot.Third_Party_Stock_With_Us}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDepot(depot)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDepot(depot._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Depot Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Depot" : "Create New Integration"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the depot details below"
                : "Fill in the details to create a new depot"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="masterId">Master Id:</Label>
                <Input
                  id="masterId"
                  value={formData.masterId}
                  onChange={(e) => handleInputChange("masterId", e.target.value)}
                  placeholder="Master Id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternateId">Alter Id:</Label>
                <Input
                  id="alternateId"
                  value={formData.alternateId}
                  onChange={(e) => handleInputChange("alternateId", e.target.value)}
                  placeholder="Alter Id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.Name}
                  onChange={(e) => handleInputChange("Name", e.target.value)}
                  placeholder="Enter depot name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile:</Label>
                <Input
                  id="mobile"
                  value={formData.Mobile}
                  onChange={(e) => handleInputChange("Mobile", e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Email">Email:</Label>
                <Input
                  id="Email"
                  value={formData.Email}
                  onChange={(e) => handleInputChange("Email", e.target.value)}
                  placeholder="Email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country:</Label>
                {/* <Select
                  value={countries.find(c => c.name === formData.Country)?.isoCode || ""}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <div>
                <select className="sachin h-6 text-xs flex-1 "
                   
                     value={countries.find(c => c.name === formData.clientCountry)?.isoCode || ""}
                >
                  {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}


                </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State:</Label>
                <div>
                <select className=" statete h-6 text-xs flex-1 "
                  onChange={(e) => {
                      handleStateChange(e.target.value)
                    }}value={states.find(s => s.name === formData.State)?.isoCode || ""}
                    // disabled={!formData.clientCountry}
                >
                  {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                </select>
                </div>
                {/* <Select
                
                  
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PinCode:</Label>
                <Input
                  id="pinCode"
                  value={formData.PinCode}
                  onChange={(e) => handleInputChange("PinCode", e.target.value)}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address:</Label>
              <Textarea
                id="address"
                value={formData.Address}
                onChange={(e) => handleInputChange("Address", e.target.value)}
                placeholder="Company Address"
              />
            </div>

            <hr />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientMobile">Mobile:</Label>
                <Input
                  id="clientMobile"
                  value={formData.clientMobile}
                  onChange={(e) => handleInputChange("clientMobile", e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email:</Label>
                <Input
                  id="clientEmail"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                  placeholder="Email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientCountry">Country:</Label>
                <div>
                <select className="sachin h-6 text-xs flex-1 "
                   
                     value={countries.find(c => c.name === formData.clientCountry)?.isoCode || ""}
                >
                  {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}


                </select>
                </div>
                {/* <Select
                  value={countries.find(c => c.(name === formData.clientCountry)?.isoCode || ""}
                  onValueChange={handleClientCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientState">State:</Label>
                <select className=" statete h-6 text-xs flex-1 "
                  onChange={(e) => {
                      handleClientStateChange(e.target.value)
                    }}value={states.find(s => s.name === formData.State)?.isoCode || ""}
                    // disabled={!formData.clientCountry}
                >
                  {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                </select>
                {/* <Select
                  value={clientStates.find(s => s.name === formData.clientState)?.isoCode || ""}
                  onValueChange={handleClientStateChange}
                  // disabled={!formData.clientCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {clientStates.map((state) => (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPinCode">PinCode:</Label>
                <Input
                  id="clientPinCode"
                  value={formData.clientPinCode}
                  onChange={(e) => handleInputChange("clientPinCode", e.target.value)}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address:</Label>
              <Textarea
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                placeholder="Client Address"
              />
            </div>

            <hr />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Partner Name:</Label>
                <Input
                  id="partnerName"
                  type="text"
                  value={formData.partnerName}
                  onChange={(e) => handleInputChange("partnerName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerCode">Partner Code:</Label>
                <Input
                  id="partnerCode"
                  type="text"
                  value={formData.partnerCode}
                  onChange={(e) => handleInputChange("partnerCode", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationDate">Registration Date:</Label>
                <Input
                  id="registrationDate"
                  type="text"
                  value={formData.registrationDate}
                  onChange={(e) => handleInputChange("registrationDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validTill">Valid Till:</Label>
                <Input
                  id="validTill"
                  type="text"
                  value={formData.validTill}
                  onChange={(e) => handleInputChange("validTill", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tallySerialno">Tally Serial No:</Label>
                <Input
                  id="tallySerialno"
                  type="text"
                  value={formData.tallySerialno}
                  onChange={(e) => handleInputChange("tallySerialno", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tallyEdition">Tally Edition:</Label>
                <Input
                  id="tallyEdition"
                  type="text"
                  value={formData.tallyEdition}
                  onChange={(e) => handleInputChange("tallyEdition", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update" : "Create"} Integration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              depot.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}