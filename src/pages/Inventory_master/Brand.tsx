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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockCategory {
  _id: string;
  name: string;
  categoryId?: string; // ✅ linked category id
  categoryName?: string; // ✅ linked category name for display
     masterId?:string;
   alternateId?:string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function Brand() {
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
       masterId:"",
       alternateId:"",
       isActive: true,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}get_master/brand`);
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to fetch categories");
        setCategories(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to load  brand",
          variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
         masterId:"",
         alternateId:"",
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (category: StockCategory) => {
    setFormData({
      name: category.name,
      categoryId: category.categoryId || "",
      isActive: category.isActive,
      masterId:category.masterId,
      alternateId:category.alternateId

    });
    setIsEditing(true);
    setCurrentId(category._id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Brand name is required");
      toast({
        title: "Validation Error",
        description: "Brand name is required",
        variant: "destructive",
      });
      return;
    }

    let payload={
          tablename:"brand",
          data:formData,
    }
    try {
      const url =
        isEditing && currentId
          ? `${BASE_URL}update_master/${currentId}`
          : `${BASE_URL}create_master`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      toast({
        title: "Success",
        description: isEditing
          ? "Category updated successfully"
          : "Category created successfully",
      });

      await fetchCategories();
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
    if (!window.confirm("Are you sure you want to delete this brand?"))
      return;

    try {
      const response = await fetch(`${BASE_URL}delete_master/${id}/brand`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });

      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Delete failed",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold">Brand</h1>
        {!showForm && (
          <Button onClick={startAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Brand
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isEditing ? "Edit Brand" : "Add New Brand"}
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
                    
                 
                     value={formData.masterId}
                    onChange={(e) =>
                      setFormData({ ...formData, masterId: e.target.value })
                    }
                  
                  />
                </div>
                <div>
                  <Label htmlFor="alterId">Alter Id:</Label>
                  <Input id="alterId" name="alterId" placeholder="Alter Id"
                  
                  value={formData.alternateId}
                    onChange={(e) =>
                      setFormData({ ...formData, alternateId: e.target.value })
                    }
                  
                  />
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

                {/* ✅ Category Dropdown */}

                <div>
                  <Label htmlFor="category">Parent Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
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
              <CardTitle>Brand</CardTitle>
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Search categories..."
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
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No matching categories found"
                  : "No categories found"}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Parent Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell>{categories?.filter((val)=>val?._id==category?.categoryId)?.[0]?.name}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              category.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                        <TableCell>{formatDate(category.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category._id)}
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
