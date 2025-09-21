// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Trash2, Edit, Save, Plus, Loader2 } from 'lucide-react';
// import { BASE_URL } from '@/api/BaseUrl';
// import { useToast } from '@/components/ui/use-toast';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// interface StockGroup {
//   _id: string;
//   name: string;
//   parentId?: string;
//   parentName?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export function StockGroupPage() {
//   const [groups, setGroups] = useState<StockGroup[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentId, setCurrentId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     name: '',
//     parentId: 'primary', // default to "Primary"
//     isActive: true,
//   });

//   const fetchGroups = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}stockgroup_list`);
//       const result = await response.json();

//       if (!response.ok) throw new Error(result.message || 'Failed to fetch groups');

//       setGroups(result.data || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       toast({
//         title: 'Error',
//         description: err instanceof Error ? err.message : 'Failed to load groups',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       parentId: 'primary',
//       isActive: true,
//     });
//     setIsEditing(false);
//     setCurrentId(null);
//   };

//   const startAdd = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const startEdit = (group: StockGroup) => {
//     setFormData({
//       name: group.name,
//       parentId: group.parentId || 'primary',
//       isActive: group.isActive,
//     });
//     setIsEditing(true);
//     setCurrentId(group._id);
//     setShowForm(true);
//   };

//   const cancelForm = () => {
//     setShowForm(false);
//     resetForm();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name) {
//       setError('Group name is required');
//       toast({
//         title: 'Validation Error',
//         description: 'Group name is required',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       const url =
//         isEditing && currentId
//           ? `${BASE_URL}stockgroup_update/${currentId}`
//           : `${BASE_URL}stockgroup_create`;

//       // convert "primary" back to empty string/null for API
//       const payload = {
//         ...formData,
//         parentId: formData.parentId === 'primary' ? '' : formData.parentId,
//       };

//       const response = await fetch(url, {
//         method: isEditing ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Operation failed');

//       toast({
//         title: 'Success',
//         description: isEditing
//           ? 'Group updated successfully'
//           : 'Group created successfully',
//       });

//       await fetchGroups();
//       cancelForm();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       toast({
//         title: 'Error',
//         description: err instanceof Error ? err.message : 'Operation failed',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this group?')) return;

//     try {
//       const response = await fetch(`${BASE_URL}stockgroup_delete/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Delete failed');

//       toast({
//         title: 'Success',
//         description: 'Group deleted successfully',
//       });

//       await fetchGroups();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Delete failed');
//       toast({
//         title: 'Error',
//         description: err instanceof Error ? err.message : 'Delete failed',
//         variant: 'destructive',
//       });
//     }
//   };

//   const filteredGroups = groups.filter((group) =>
//     group.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Stock Group Management</h1>
//         {!showForm && (
//           <Button onClick={startAdd}>
//             <Plus className="h-4 w-4 mr-2" /> Add Group
//           </Button>
//         )}
//       </div>

//       {showForm ? (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               {isEditing ? 'Edit Group' : 'Add New Group'}
//               <Button variant="ghost" onClick={cancelForm}>
//                 Cancel
//               </Button>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 gap-4">
//                 <div>
//                   <Label htmlFor="name">Name*</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     required
//                   />
//                 </div>

//                 {/* ✅ Parent Group Dropdown */}
//                 <div>
//                   <Label htmlFor="parent">Parent Group</Label>
//                   <Select
//                     value={formData.parentId}
//                     onValueChange={(value) =>
//                       setFormData({ ...formData, parentId: value })
//                     }
//                   >
//                     <SelectTrigger id="parent">
//                       <SelectValue placeholder="Select parent group" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="primary">Primary</SelectItem>
//                       {groups.map((grp) => (
//                         <SelectItem key={grp._id} value={grp._id}>
//                           {grp.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="isActive"
//                     checked={formData.isActive}
//                     onChange={(e) =>
//                       setFormData({ ...formData, isActive: e.target.checked })
//                     }
//                     className="h-4 w-4"
//                   />
//                   <Label htmlFor="isActive">Active</Label>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : isEditing ? (
//                     <>
//                       <Save className="h-4 w-4 mr-2" /> Update
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="h-4 w-4 mr-2" /> Add
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardHeader>
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <CardTitle>Stock Groups</CardTitle>
//               <div className="w-full md:w-1/3">
//                 <Input
//                   type="text"
//                   placeholder="Search groups..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="flex justify-center py-8">
//                 <Loader2 className="h-6 w-6 animate-spin" />
//               </div>
//             ) : filteredGroups.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 {searchTerm ? 'No matching groups found' : 'No groups found'}
//               </div>
//             ) : (
//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Parent Group</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Created At</TableHead>
//                       <TableHead>Updated At</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredGroups.map((group) => (
//                       <TableRow key={group._id}>
//                         <TableCell className="font-medium">{group.name}</TableCell>
//                         <TableCell>{group.parentName || 'Primary'}</TableCell>
//                         <TableCell>
//                           <span
//                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                               group.isActive
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}
//                           >
//                             {group.isActive ? 'Active' : 'Inactive'}
//                           </span>
//                         </TableCell>
//                         <TableCell>{formatDate(group.createdAt)}</TableCell>
//                         <TableCell>{formatDate(group.updatedAt)}</TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end space-x-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => startEdit(group)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleDelete(group._id)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, Save, Plus, Loader2 } from "lucide-react";
import { BASE_URL } from "@/api/BaseUrl";
import { useToast } from "@/components/ui/use-toast";
import { useSelector, useDispatch } from 'react-redux'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockGroup {
  _id: string;
  name: string;
  parentId?: string;
  parentGroupName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function StockGroupPage() {
   const companyid = useSelector((state) => state?.Store.companyid)
  const [groups, setGroups] = useState<StockGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    parentId: "primary",
    isActive: true,
  });

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}stockgroup_list`,{
        method:"GET",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to fetch groups");

      setGroups(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to load groups",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [companyid]);

  const resetForm = () => {
    setFormData({
      name: "",
      parentId: "primary",
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (group: StockGroup) => {
    setFormData({
      name: group.name,
      parentId: group.parentId || "primary",
      isActive: group.isActive,
    });
    setIsEditing(true);
    setCurrentId(group._id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Group name is required");
      toast({
        title: "Validation Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const url =
        isEditing && currentId
          ? `${BASE_URL}stockgroup_update/${currentId}`
          : `${BASE_URL}stockgroup_create`;

      const payload = {
        ...formData,
        parentId: formData.parentId === "primary" ? "" : formData.parentId,
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
           credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      toast({
        title: "Success",
        description: isEditing
          ? "Group updated successfully"
          : "Group created successfully",
      });

      await fetchGroups();
      cancelForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Operation failed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      const response = await fetch(`${BASE_URL}stockgroup_delete/${id}`, {
        method: "DELETE",
       credentials: "include",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast({
        title: "Success",
        description: "Group deleted successfully",
      });

      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Delete failed",
        variant: "destructive",
      });
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Group Management</h1>
        {!showForm && (
          <Button onClick={startAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Group
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isEditing ? "Edit Group" : "Add New Group"}
              <Button variant="ghost" onClick={cancelForm}>
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="masterId">Master Id:</Label>
                  <Input
                    id="masterId"
                    name="masterId"
                    placeholder="Master Id"
                  />
                </div>
                <div>
                  <Label htmlFor="alternateId">Alter Id:</Label>
                  <Input id="alternateId" name="alternateId" placeholder="Alter Id" />
                </div>
                <div>
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="parent">Parent Group</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parentId: value })
                    }
                  >
                    <SelectTrigger id="parent">
                      <SelectValue placeholder="Select parent group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      {groups.map((grp) => (
                        <SelectItem key={grp._id} value={grp._id}>
                          {grp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Update
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Stock Groups</CardTitle>
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No matching groups found" : "No groups found"}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Parent Group</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group) => (
                      <TableRow key={group._id}>
                        <TableCell className="font-medium">
                          {group.name}
                        </TableCell>
                        <TableCell>
                          {group.parentGroupName || "Primary"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              group.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {group.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(group.createdAt)}</TableCell>
                        <TableCell>{formatDate(group.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(group)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(group._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
