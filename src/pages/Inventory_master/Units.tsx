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




interface StockUnit {
  _id: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function StockUnitPage() {

const companyid = useSelector((state) => state?.Store.companyid)



  const [units, setUnits] = useState<StockUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    symbol: "",
    decimalPlaces: 0,
    isActive: true,
  });

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}stockunit_list`,{
        method:"GET",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to fetch units");

      setUnits(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to load units",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [companyid]);

  const resetForm = () => {
    setFormData({
      symbol: "",
      decimalPlaces: 0,
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (unit: StockUnit) => {
    setFormData({
      symbol: unit.symbol,
      decimalPlaces: unit.decimalPlaces,
      isActive: unit.isActive,
    });
    setIsEditing(true);
    setCurrentId(unit._id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol) {
      setError("Symbol is required");
      toast({
        title: "Validation Error",
        description: "Symbol is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const url =
        isEditing && currentId
          ? `${BASE_URL}stockunit_update/${currentId}`
          : `${BASE_URL}stockunit_create`;

      const payload = {
        symbol: formData.symbol,
        decimalPlaces: formData.decimalPlaces,
        isActive: formData.isActive,
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
          ? "Unit updated successfully"
          : "Unit created successfully",
      });

      await fetchUnits();
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      const response = await fetch(`${BASE_URL}stockunit_delete/${id}`, {
        method: "DELETE",
           credentials: "include",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast({ title: "Success", description: "Unit deleted successfully" });
      await fetchUnits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Delete failed",
        variant: "destructive",
      });
    }
  };

  const filteredUnits = units.filter((unit) =>
    unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Unit Management</h1>
        {!showForm && (
          <Button onClick={startAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Unit
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isEditing ? "Edit Unit" : "Add New Unit"}
              <Button variant="ghost" onClick={cancelForm}>
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="Master_Id">Master Id:</Label>
                  <Input
                    id="Master_Id"
                    name="Master_Id"
                    placeholder="Master Id"
                  />
                </div>
                <div>
                  <Label htmlFor="Alter_Id">Alter Id:</Label>
                  <Input id="Alter_Id" name="Alter_Id" placeholder="Alter Id" />
                </div>
                <div>
                  <Label htmlFor="symbol">Symbol*</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData({ ...formData, symbol: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="decimalPlaces">Decimal Places</Label>
                  <Input
                    id="decimalPlaces"
                    type="number"
                    min="0"
                    max="6"
                    value={formData.decimalPlaces}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        decimalPlaces: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
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

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
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
              <CardTitle>Stock Units</CardTitle>
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Search units..."
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
            ) : filteredUnits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No matching units found" : "No units found"}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Decimals</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map((unit) => (
                      <TableRow key={unit._id}>
                        <TableCell>{unit.symbol}</TableCell>
                        <TableCell>{unit.decimalPlaces}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              unit.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {unit.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(unit.createdAt)}</TableCell>
                        <TableCell>{formatDate(unit.updatedAt)}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(unit)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(unit._id)}
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
