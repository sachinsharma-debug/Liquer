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

// interface BranchandDivision {
//   _id: string;
//   Name: string;
//   Parent: string;
//   Master_Id?: string;
//   Alter_Id?: string;
//   MAilingName?: string;
//   address?: string;
//   StateName?: string;
//   CountryName?: string;
//   PinCode?: string;
//   mobile?: string;
//   telephone?: string;
//   isActive?: boolean;
// }

// export default function BranchandDivision() {
//   const { toast } = useToast();
//   const [branchesAndDivisions, setBranchesAndDivisions] = useState<
//     BranchandDivision[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   // Current branch and division states
//   const [branchDivisionToDelete, setBranchDivisionToDelete] = useState<
//     string | null
//   >(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentBranchDivisionId, setCurrentBranchDivisionId] = useState<
//     string | null
//   >(null);

//   // Form states
//   const [formData, setFormData] = useState<Omit<BranchandDivision, "_id">>({
//     Name: "",
//     Parent: "Primary",
//     Master_Id: "",
//     Alter_Id: "",
//     MAilingName: "",
//     address: "",
//     StateName: "",
//     CountryName: "",
//     PinCode: "",
//     mobile: "",
//     telephone: "",
//     isActive: true,
//   });

//   // Available parent groups
//   const parentGroups = [
//     "Primary",
//     "Regional Branch",
//     "Local Branch",
//     "Head Office",
//     "Division Office",
//     "Sales Division",
//     "Operations Division",
//     "Finance Division",
//     "Marketing Division",
//   ];

//   // Fetch all branches and divisions
//   useEffect(() => {
//     const fetchBranchesAndDivisions = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`${BASE_URL}ledger_list`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch branches and divisions");
//         }
//         const data = await response.json();
//         setBranchesAndDivisions(data.data || []);
//       } catch (error: any) {
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

//     fetchBranchesAndDivisions();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (
//     field: keyof typeof formData,
//     value: string | boolean
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]:
//         field === "isActive" ? value === "true" || value === true : value,
//     }));
//   };

//   // Open modal for creating new branch and division
//   const handleCreateBranchDivision = () => {
//     setCurrentBranchDivisionId(null);
//     setIsEditMode(false);
//     setFormData({
//       Name: "",
//       Parent: "Primary",
//       Master_Id: "",
//       Alter_Id: "",
//       MAilingName: "",
//       address: "",
//       StateName: "",
//       CountryName: "",
//       PinCode: "",
//       mobile: "",
//       telephone: "",
//       isActive: true,
//     });
//     setIsModalOpen(true);
//   };

//   // Open modal for editing existing branch and division
//   const handleEditBranchDivision = (branchDivision: BranchandDivision) => {
//     setCurrentBranchDivisionId(branchDivision._id);
//     setIsEditMode(true);
//     setFormData({
//       Name: branchDivision.Name,
//       Parent: branchDivision.Parent,
//       Master_Id: branchDivision.Master_Id || "",
//       Alter_Id: branchDivision.Alter_Id || "",
//       MAilingName: branchDivision.MAilingName || "",
//       address: branchDivision.address || "",
//       StateName: branchDivision.StateName || "",
//       CountryName: branchDivision.CountryName || "",
//       PinCode: branchDivision.PinCode || "",
//       mobile: branchDivision.mobile || "",
//       telephone: branchDivision.telephone || "",
//       isActive: branchDivision.isActive ?? true,
//     });
//     setIsModalOpen(true);
//   };

//   // Open confirmation modal for deleting branch and division
//   const handleDeleteBranchDivision = (id: string) => {
//     setBranchDivisionToDelete(id);
//     setIsDeleteModalOpen(true);
//   };

//   // Submit form (create or update)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);
//       const method = isEditMode ? "PUT" : "POST";
//       const url = isEditMode
//         ? `${BASE_URL}update_ledger/${currentBranchDivisionId}`
//         : `${BASE_URL}create_ledger`;

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(
//           isEditMode
//             ? "Failed to update branch and division"
//             : "Failed to create branch and division"
//         );
//       }

//       // Refresh the branch and division list after successful operation
//       const refreshResponse = await fetch(`${BASE_URL}ledger_list`);
//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setBranchesAndDivisions(refreshData.data || []);
//       }

//       toast({
//         title: "Success",
//         description: isEditMode
//           ? "Branch and division updated successfully"
//           : "Branch and division created successfully",
//       });

//       setIsModalOpen(false);
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Confirm and execute branch and division deletion
//   const confirmDelete = async () => {
//     if (!branchDivisionToDelete) return;

//     try {
//       setIsLoading(true);
//       const response = await fetch(
//         `${BASE_URL}delete_ledger/${branchDivisionToDelete}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete branch and division");
//       }

//       // Refresh the branch and division list after successful deletion
//       const refreshResponse = await fetch(`${BASE_URL}ledger_list`);
//       if (refreshResponse.ok) {
//         const refreshData = await refreshResponse.json();
//         setBranchesAndDivisions(refreshData.data || []);
//       }

//       toast({
//         title: "Success",
//         description: "Branch and division deleted successfully",
//       });
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     } finally {
//       setIsLoading(false);
//       setIsDeleteModalOpen(false);
//       setBranchDivisionToDelete(null);
//     }
//   };

//   if (isLoading && branchesAndDivisions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading branches and divisions...</span>
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
//         <h1 className="text-3xl font-bold text-gray-900">
//           Branch and Division Management
//         </h1>
//         <Button onClick={handleCreateBranchDivision}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Branch & Division
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Branch and Division List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {branchesAndDivisions.length === 0 ? (
//             <div className="text-center py-8">
//               <p>No branches and divisions found</p>
//               <Button
//                 variant="link"
//                 className="mt-2"
//                 onClick={handleCreateBranchDivision}
//               >
//                 Create your first branch and division
//               </Button>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Parent Group</TableHead>
//                   <TableHead>Mailing Name</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {branchesAndDivisions.map((branchDivision) => (
//                   <TableRow key={branchDivision._id}>
//                     <TableCell className="font-medium">
//                       {branchDivision.Name}
//                     </TableCell>
//                     <TableCell>{branchDivision.Parent}</TableCell>
//                     <TableCell>{branchDivision.MAilingName || "-"}</TableCell>
//                     <TableCell>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           branchDivision.isActive !== false
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {branchDivision.isActive !== false
//                           ? "Active"
//                           : "Inactive"}
//                       </span>
//                     </TableCell>
//                     <TableCell className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEditBranchDivision(branchDivision)}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() =>
//                           handleDeleteBranchDivision(branchDivision._id)
//                         }
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

//       {/* Create/Edit Branch and Division Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-3xl max-h-[100vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditMode
//                 ? "Edit Branch & Division"
//                 : "Create New Branch & Division"}
//             </DialogTitle>
//             <DialogDescription>
//               {isEditMode
//                 ? "Update the branch and division details below"
//                 : "Fill in the details to create a new branch and division"}
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Label htmlFor="Master_Id" className="text-xs w-20 text-right">
//                 Master Id:
//               </Label>
//               <Input
//                 id="Master_Id"
//                 name="Master_Id"
//                 value={formData.Master_Id}
//                 onChange={(e) => handleInputChange("Master_Id", e.target.value)}
//                 placeholder="Master Id"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="Alter_Id" className="text-xs w-20 text-right">
//                 Alter Id:
//               </Label>
//               <Input
//                 id="Alter_Id"
//                 name="Alter_Id"
//                 value={formData.Alter_Id}
//                 onChange={(e) => handleInputChange("Alter_Id", e.target.value)}
//                 placeholder="Alter Id"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="name" className="text-xs w-20 text-right">
//                 Name*:
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.Name}
//                 onChange={(e) => handleInputChange("Name", e.target.value)}
//                 placeholder="Enter branch and division name"
//                 className="h-6 text-xs flex-1"
//                 required
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Label htmlFor="parent" className="text-xs w-20 text-right">
//                 Parent Group*:
//               </Label>
//               <Select
//                 value={formData.Parent}
//                 onValueChange={(value) => handleInputChange("Parent", value)}
//               >
//                 <SelectTrigger className="h-6 text-xs flex-1">
//                   <SelectValue placeholder="Select parent group" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {parentGroups.map((group) => (
//                     <SelectItem key={group} value={group}>
//                       {group}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center gap-2">
//               <Label htmlFor="mailingName" className="text-xs w-20 text-right">
//                 Mailing Name:
//               </Label>
//               <Input
//                 id="mailingName"
//                 name="mailingName"
//                 value={formData.MAilingName}
//                 onChange={(e) =>
//                   handleInputChange("MAilingName", e.target.value)
//                 }
//                 placeholder="Enter mailing name"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Label htmlFor="address" className="text-xs w-20 text-right">
//                 Address:
//               </Label>
//               <Input
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={(e) => handleInputChange("address", e.target.value)}
//                 placeholder="Company Address"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="state" className="text-xs w-20 text-right">
//                 State:
//               </Label>
//               <Input
//                 id="state"
//                 name="state"
//                 value={formData.StateName}
//                 onChange={(e) => handleInputChange("StateName", e.target.value)}
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
//                 value={formData.CountryName}
//                 onChange={(e) =>
//                   handleInputChange("CountryName", e.target.value)
//                 }
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
//                 value={formData.PinCode}
//                 onChange={(e) => handleInputChange("PinCode", e.target.value)}
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
//                 value={formData.mobile}
//                 onChange={(e) => handleInputChange("mobile", e.target.value)}
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
//                 value={formData.telephone}
//                 onChange={(e) => handleInputChange("telephone", e.target.value)}
//                 placeholder="1234567890"
//                 className="h-6 text-xs flex-1"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Label htmlFor="isActive" className="text-xs w-20 text-right">
//                 Active:
//               </Label>
//               <Switch
//                 id="isActive"
//                 checked={formData.isActive}
//                 onCheckedChange={(checked) =>
//                   handleInputChange("isActive", checked.toString())
//                 }
//               />
//               <span className="text-xs text-gray-600">
//                 {formData.isActive ? "Active" : "Inactive"}
//               </span>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {isEditMode ? "Update" : "Create"} Branch & Division
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
//               branch and division.
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
  import { useSelector, useDispatch } from 'react-redux'


interface BranchandDivision {
  _id: string;
  depotId: string,
  Name: string;
  Parent: string;
  Master_Id?: string;
  Alter_Id?: string;
  MAilingName?: string;
  address?: string;
  StateName?: string;
  CountryName?: string;
  PinCode?: string;
  mobile?: string;
  telephone?: string;
  isActive?: boolean;
}

export default function BranchandDivision() {
    const companyid = useSelector((state) => state?.Store.companyid)
  const { toast } = useToast();
  const [branchesAndDivisions, setBranchesAndDivisions] = useState<
    BranchandDivision[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [Depots, setDepots] = useState([])

  // Current branch and division states
  const [branchDivisionToDelete, setBranchDivisionToDelete] = useState<
    string | null
  >(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBranchDivisionId, setCurrentBranchDivisionId] = useState<
    string | null
  >(null);

  // Country and State data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState<Omit<BranchandDivision, "_id">>({
    Name: "",
    depotId: "",
    Parent: "Primary",
    Master_Id: "",
    Alter_Id: "",
    MAilingName: "",
    address: "",
    StateName: "",
    CountryName: "",
    PinCode: "",
    mobile: "",
    telephone: "",
    isActive: true,
  });

  // Available parent groups
  const parentGroups = [
    "Primary",
    "Regional Branch",
    "Local Branch",
    "Head Office",
    "Division Office",
    "Sales Division",
    "Operations Division",
    "Finance Division",
    "Marketing Division",
  ];

  // Load countries on component mount
  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountries(countryData);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (formData.CountryName) {
      const countryCode = countries.find(c => c.name === formData.CountryName)?.isoCode;
      if (countryCode) {
        const stateData = State.getStatesOfCountry(countryCode);
        setStates(stateData);
      }
    } else {
      setStates([]);
    }
  }, [formData.CountryName, countries]);

  // Fetch all branches and divisions
  useEffect(() => {
    const fetchBranchesAndDivisions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}ledger_list`,{
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch branches and divisions");
        }
        const data = await response.json();
        setBranchesAndDivisions(data.data || []);
      } catch (error: any) {
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

    fetchBranchesAndDivisions();
    fetchDepots()
  }, [companyid]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "isActive" ? value === "true" || value === true : value,
    }));
  };

  // Handle country change
  const handleCountryChange = (isoCode: string) => {
    const country = countries.find(c => c.isoCode === isoCode);
    if (country) {
      setFormData((prev) => ({
        ...prev,
        CountryName: country.name,
        StateName: "" // Reset state when country changes
      }));
    }
  };

  // Handle state change
  const handleStateChange = (isoCode: string) => {
    const state = states.find(s => s.isoCode === isoCode);
    if (state) {
      setFormData((prev) => ({
        ...prev,
        StateName: state.name
      }));
    }
  };

  // Open modal for creating new branch and division
  const handleCreateBranchDivision = () => {
    setCurrentBranchDivisionId(null);
    setIsEditMode(false);
    setFormData({
      Name: "",
      depotId: "",
      Parent: "Primary",
      Master_Id: "",
      Alter_Id: "",
      MAilingName: "",
      address: "",
      StateName: "",
      CountryName: "",
      PinCode: "",
      mobile: "",
      telephone: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing branch and division
  const handleEditBranchDivision = (branchDivision: BranchandDivision) => {
    setCurrentBranchDivisionId(branchDivision._id);
    setIsEditMode(true);
    setFormData({
      Name: branchDivision.Name,
      depotId: branchDivision.depotId,
      Parent: branchDivision.Parent,
      Master_Id: branchDivision.Master_Id || "",
      Alter_Id: branchDivision.Alter_Id || "",
      MAilingName: branchDivision.MAilingName || "",
      address: branchDivision.address || "",
      StateName: branchDivision.StateName || "",
      CountryName: branchDivision.CountryName || "",
      PinCode: branchDivision.PinCode || "",
      mobile: branchDivision.mobile || "",
      telephone: branchDivision.telephone || "",
      isActive: branchDivision.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  // Open confirmation modal for deleting branch and division
  const handleDeleteBranchDivision = (id: string) => {
    setBranchDivisionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${BASE_URL}update_ledger/${currentBranchDivisionId}`
        : `${BASE_URL}create_ledger`;

      // Prepare payload according to backend expectations
      const payload = {
        Master_Id: formData.Master_Id,
        depotId:formData.depotId,
        Alter_Id: formData.Alter_Id,
        Name: formData.Name,
        Parent: formData.Parent,
        MAilingName: formData.MAilingName,
        address: formData.address,
        StateName: formData.StateName,
        CountryName: formData.CountryName,
        PinCode: formData.PinCode,
        mobile: formData.mobile,
        telephone: formData.telephone,
        isActive: formData.isActive,
        // Add default values for required fields in the backend model
        ALIAS: "0",
        OpeningBalance: "0.00"
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          isEditMode
            ? "Failed to update branch and division"
            : "Failed to create branch and division"
        );
      }

      // Refresh the branch and division list after successful operation
      const refreshResponse = await fetch(`${BASE_URL}ledger_list`,{
          method: "GET",
          credentials: "include",
        });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setBranchesAndDivisions(refreshData.data || []);
      }

      toast({
        title: "Success",
        description: isEditMode
          ? "Branch and division updated successfully"
          : "Branch and division created successfully",
      });

      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm and execute branch and division deletion
  const confirmDelete = async () => {
    if (!branchDivisionToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${BASE_URL}delete_ledger/${branchDivisionToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete branch and division");
      }

      // Refresh the branch and division list after successful deletion
      const refreshResponse = await fetch(`${BASE_URL}ledger_list`,{
          method: "GET",
          credentials: "include",
        });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setBranchesAndDivisions(refreshData.data || []);
      }

      toast({
        title: "Success",
        description: "Branch and division deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setBranchDivisionToDelete(null);
    }
  };

  async function fetchDepots() {
    try {
      const response = await fetch(`${BASE_URL}get_depot`);
      if (!response.ok) {
        throw new Error("Failed to fetch depots");
      }
      const data = await response.json();
      setDepots(data.data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading && branchesAndDivisions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading branches and divisions...</span>
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

   async function fetchDepots(){
      try {
        const response = await fetch(`${BASE_URL}get_depot`,{
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch depots");
        }
        const data = await response.json();
        setDepots(data.data || []);



      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
      }
    };
    

  // useEffect(()=>{
  // },[])


console.log(Depots,"lkkkkkkk");








  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Branch and Division Management
        </h1>
        <Button onClick={handleCreateBranchDivision}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch & Division
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch and Division List</CardTitle>
        </CardHeader>
        <CardContent>
          {branchesAndDivisions.length === 0 ? (
            <div className="text-center py-8">
              <p>No branches and divisions found</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={handleCreateBranchDivision}
              >
                Create your first branch and division
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent Group</TableHead>
                  <TableHead>Mailing Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchesAndDivisions.map((branchDivision) => (
                  <TableRow key={branchDivision._id}>
                    <TableCell className="font-medium">
                      {branchDivision.Name}
                    </TableCell>
                    <TableCell>{branchDivision.Parent}</TableCell>
                    <TableCell>{branchDivision.MAilingName || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${branchDivision.isActive !== false
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {branchDivision.isActive !== false
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBranchDivision(branchDivision)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDeleteBranchDivision(branchDivision._id)
                        }
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

      {/* Create/Edit Branch and Division Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Edit Branch & Division"
                : "Create New Branch & Division"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the branch and division details below"
                : "Fill in the details to create a new branch and division"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="Master_Id" className="text-xs w-20 text-right">
                Master Id:
              </Label>
              <Input
                id="Master_Id"
                name="Master_Id"
                value={formData.Master_Id}
                onChange={(e) => handleInputChange("Master_Id", e.target.value)}
                placeholder="Master Id"
                className="h-6 text-xs flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="Alter_Id" className="text-xs w-20 text-right">
                Alter Id:
              </Label>
              <Input
                id="Alter_Id"
                name="Alter_Id"
                value={formData.Alter_Id}
                onChange={(e) => handleInputChange("Alter_Id", e.target.value)}
                placeholder="Alter Id"
                className="h-6 text-xs flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="name" className="text-xs w-20 text-right">
                Name*:
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                placeholder="Enter branch and division name"
                className="h-6 text-xs flex-1"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="parent" className="text-xs w-20 text-right">
                Parent Group*:
              </Label>
              <Select
                value={formData.Parent}
                onValueChange={(value) => handleInputChange("Parent", value)}
              >
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="Select parent group" />
                </SelectTrigger>
                <SelectContent>
                  {parentGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="mailingName" className="text-xs w-20 text-right">
                Mailing Name:
              </Label>
              <Input
                id="mailingName"
                name="mailingName"
                value={formData.MAilingName}
                onChange={(e) =>
                  handleInputChange("MAilingName", e.target.value)
                }
                placeholder="Enter mailing name"
                className="h-6 text-xs flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="address" className="text-xs w-20 text-right">
                Address:
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Company Address"
                className="h-6 text-xs flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="country" className="text-xs w-20 text-right">
                Country:
              </Label>
              <Select
                value={countries.find(c => c.name === formData.CountryName)?.isoCode || ""}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="state" className="text-xs w-20 text-right">
                State:
              </Label>
              <Select
                value={states.find(s => s.name === formData.StateName)?.isoCode || ""}
                onValueChange={handleStateChange}
                disabled={!formData.CountryName}
              >
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {states.map((state) => (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="pinCode" className="text-xs w-20 text-right">
                PinCode:
              </Label>
              <Input
                id="pinCode"
                name="pinCode"
                value={formData.PinCode}
                onChange={(e) => handleInputChange("PinCode", e.target.value)}
                placeholder="Pincode"
                className="h-6 text-xs flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="mobile" className="text-xs w-20 text-right">
                Mobile:
              </Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="+91 9876543210"
                className="h-6 text-xs flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="telephone" className="text-xs w-20 text-right">
                TelePhone:
              </Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                placeholder="1234567890"
                className="h-6 text-xs flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="depot" className="text-xs w-20 text-right">
                Depot:
              </Label>
              <Select
                value={formData.depotId}
                onValueChange={(value) => handleInputChange("depotId", value)}
              >
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="Select depot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="not-applicable" value="68b16974e6dc1871952e787d">
                    Not Applicable
                  </SelectItem>
                  {Depots.map((depot) => (
                    <SelectItem key={depot._id} value={depot._id}>
                      {depot.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="isActive" className="text-xs w-20 text-right">
                Active:
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <span className="text-xs text-gray-600">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update" : "Create"} Branch & Division
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
              branch and division.
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