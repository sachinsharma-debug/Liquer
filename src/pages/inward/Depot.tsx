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
//         const response = await fetch(`${BASE_URL}get_depot`);
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
//         ? `${BASE_URL}update_depot/${currentDepotId}`
//         : `${BASE_URL}create_depot`;

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
//       const refreshResponse = await fetch(`${BASE_URL}get_depot`);
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
//         `${BASE_URL}delete_depot/${depotToDelete}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete depot");
//       }

//       // Refresh the depot list after successful deletion
//       const refreshResponse = await fetch(`${BASE_URL}get_depot`);
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
//               <Label htmlFor="alterId" className="text-xs w-20 text-right">
//                 Alter Id:
//               </Label>
//               <Input
//                 id="alterId"
//                 name="alterId"
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
  Master_Id?: string;
  Alter_Id?: string;
  Address?: string;
  State?: string;
  Country?: string;
  PinCode?: string;
  Mobile?: string;
  Telephone?: string;
}

interface DepotFormData {
  Name: string;
  Parent: string;
  Allow_Storage: "Yes" | "No";
  Our_Stock_With_Third_Party: "Yes" | "No";
  Third_Party_Stock_With_Us: "Yes" | "No";
  Master_Id?: string;
  Alter_Id?: string;
  Address?: string;
  State?: string;
  Country?: string;
  PinCode?: string;
  Mobile?: string;
  Telephone?: string;
}

export default function DepotManagement() {
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

  // Form states
  const [formData, setFormData] = useState<DepotFormData>({
    Name: "",
    Parent: "Primary",
    Allow_Storage: "Yes",
    Our_Stock_With_Third_Party: "No",
    Third_Party_Stock_With_Us: "No",
    Master_Id: "",
    Alter_Id: "",
    Address: "",
    State: "",
    Country: "",
    PinCode: "",
    Mobile: "",
    Telephone: ""
  });

  // Fetch all depots
  useEffect(() => {
    fetchDepots();
  }, []);

  const fetchDepots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}get_depot`);
      if (!response.ok) {
        throw new Error("Failed to fetch depots");
      }
      const data = await response.json();
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
      Master_Id: "",
      Alter_Id: "",
      Address: "",
      State: "",
      Country: "",
      PinCode: "",
      Mobile: "",
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
      Master_Id: depot.Master_Id || "",
      Alter_Id: depot.Alter_Id || "",
      Address: depot.Address || "",
      State: depot.State || "",
      Country: depot.Country || "",
      PinCode: depot.PinCode || "",
      Mobile: depot.Mobile || "",
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
        ? `${BASE_URL}update_depot/${currentDepotId}`
        : `${BASE_URL}create_depot`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Operation failed");
      }

      await fetchDepots();

      toast({
        title: "Success",
        description: isEditMode
          ? "Depot updated successfully"
          : "Depot created successfully",
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
        `${BASE_URL}delete_depot/${depotToDelete}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete depot");
      }

      await fetchDepots();

      toast({
        title: "Success",
        description: "Depot deleted successfully",
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
        <span className="ml-2">Loading depots...</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Depot Management</h1>
        <Button onClick={handleCreateDepot}>
          <Plus className="mr-2 h-4 w-4" />
          Add Depot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Depot List</CardTitle>
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
              {isEditMode ? "Edit Depot" : "Create New Depot"}
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
                  value={formData.Master_Id}
                  onChange={(e) => handleInputChange("Master_Id", e.target.value)}
                  placeholder="Master Id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alterId">Alter Id:</Label>
                <Input
                  id="alterId"
                  value={formData.Alter_Id}
                  onChange={(e) => handleInputChange("Alter_Id", e.target.value)}
                  placeholder="Alter Id"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                placeholder="Enter depot name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent:</Label>
              <Select
                value={formData.Parent}
                onValueChange={(value) => handleInputChange("Parent", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent depot" />
                </SelectTrigger>
                <SelectContent>
                  {getParentOptions().map((parent) => (
                    <SelectItem key={parent} value={parent}>
                      {parent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State:</Label>
                <Input
                  id="state"
                  value={formData.State}
                  onChange={(e) => handleInputChange("State", e.target.value)}
                  placeholder="Company State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country:</Label>
                <Input
                  id="country"
                  value={formData.Country}
                  onChange={(e) => handleInputChange("Country", e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pinCode">PinCode:</Label>
                <Input
                  id="pinCode"
                  value={formData.PinCode}
                  onChange={(e) => handleInputChange("PinCode", e.target.value)}
                  placeholder="Pincode"
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

            <div className="space-y-2">
              <Label htmlFor="telephone">TelePhone:</Label>
              <Input
                id="telephone"
                value={formData.Telephone}
                onChange={(e) => handleInputChange("Telephone", e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="advancedFeatures"
                checked={allowAdvancedFeatures}
                onCheckedChange={setAllowAdvancedFeatures}
              />
              <Label htmlFor="advancedFeatures">Allow Advanced Features</Label>
            </div>

            {allowAdvancedFeatures && (
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="allowStorage">Allow Storage:</Label>
                  <Select
                    value={formData.Allow_Storage}
                    onValueChange={(value) =>
                      handleInputChange("Allow_Storage", value as "Yes" | "No")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ourStockThirdParty">Our Stock With Third Party:</Label>
                  <Select
                    value={formData.Our_Stock_With_Third_Party}
                    onValueChange={(value) =>
                      handleInputChange(
                        "Our_Stock_With_Third_Party",
                        value as "Yes" | "No"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thirdPartyStockUs">Third Party Stock With Us:</Label>
                  <Select
                    value={formData.Third_Party_Stock_With_Us}
                    onValueChange={(value) =>
                      handleInputChange(
                        "Third_Party_Stock_With_Us",
                        value as "Yes" | "No"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update" : "Create"} Depot
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