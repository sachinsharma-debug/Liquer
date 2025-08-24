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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit, Save, Plus, Loader2 } from "lucide-react";
import { BASE_URL } from "@/api/BaseUrl";

interface Customer {
  _id: string;
  name: string;
  group: { _id: string; name: string } | null;
  mailingName: string;
  country: string;
  state: string;
  address: string;
  pincode: string;
  mobile: string;
  email: string;
  isActive: boolean;
  masterId: string;
  alternateId: string;
}

interface Group {
  _id: string;
  name: string;
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    masterId: "",
    alternateId: "",
    name: "",
    group: "no-group",
    mailingName: "",
    country: "",
    state: "",
    address: "",
    pincode: "",
    mobile: "",
    email: "",
    isActive: true,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [customersRes, groupsRes] = await Promise.all([
        fetch(`${BASE_URL}customer_list`),
        fetch(`${BASE_URL}accountig_group_list_data`),
      ]);

      const [customersData, groupsData] = await Promise.all([
        customersRes.json(),
        groupsRes.json(),
      ]);

      if (!customersRes.ok)
        throw new Error(customersData.message || "Failed to fetch customers");
      if (!groupsRes.ok)
        throw new Error(groupsData.message || "Failed to fetch groups");

      setCustomers(customersData.data || []);
      setGroups(groupsData.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      masterId: "",
      alternateId: "",
      name: "",
      group: "no-group",
      mailingName: "",
      country: "",
      state: "",
      address: "",
      pincode: "",
      mobile: "",
      email: "",
      isActive: true,
    });
    setIsEditing(false);
    setCurrentId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      masterId: customer.masterId || "",
      alternateId: customer.alternateId || "",
      name: customer.name,
      group: customer.group?._id || "no-group",
      mailingName: customer.mailingName,
      country: customer.country,
      state: customer.state,
      address: customer.address,
      pincode: customer.pincode,
      mobile: customer.mobile,
      email: customer.email,
      isActive: customer.isActive,
    });
    setIsEditing(true);
    setCurrentId(customer._id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return setError("Customer Name is required");

    try {
      const url =
        isEditing && currentId
          ? `${BASE_URL}customer_update/${currentId}`
          : `${BASE_URL}create_customer`;

      const payload = {
        ...formData,
        group: formData.group === "no-group" ? undefined : formData.group,
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operation failed");

      await fetchData();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      const response = await fetch(`${BASE_URL}customer_delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const getGroupName = (groupId: string | null) => {
    if (!groupId || groupId === "no-group") return "-";
    const group = groups.find((g) => g._id === groupId);
    return group?.name || "-";
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Customers Management
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Customer" : "Create New Customer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="masterId" className="text-xs w-32 text-right">
                    Master Id:
                  </Label>
                  <Input
                    id="masterId"
                    name="masterId"
                    placeholder="Master Id"
                    className="h-6 text-xs flex-1"
                    value={formData.masterId}
                    onChange={(e) =>
                      setFormData({ ...formData, masterId: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="alternateId" className="text-xs w-32 text-right">
                    Alternate Id:
                  </Label>
                  <Input
                    id="alternateId"
                    name="alternateId"
                    placeholder="Alternate Id"
                    className="h-6 text-xs flex-1"
                    value={formData.alternateId}
                    onChange={(e) =>
                      setFormData({ ...formData, alternateId: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="name" className="text-xs w-32 text-right">
                    Customer Name *:
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. John Doe"
                    className="h-6 text-xs flex-1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="group" className="text-xs w-32 text-right">
                    Group:
                  </Label>
                  <Select
                    value={formData.group}
                    onValueChange={(value) =>
                      setFormData({ ...formData, group: value })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs flex-1">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="no-group">None</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="mailingName"
                    className="text-xs w-32 text-right"
                  >
                    Mailing Name:
                  </Label>
                  <Input
                    id="mailingName"
                    value={formData.mailingName}
                    onChange={(e) =>
                      setFormData({ ...formData, mailingName: e.target.value })
                    }
                    placeholder="Mailing Name"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="country" className="text-xs w-32 text-right">
                    Country:
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="Country"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="state" className="text-xs w-32 text-right">
                    State:
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="State"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="address" className="text-xs w-32 text-right">
                    Address:
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Address"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pincode" className="text-xs w-32 text-right">
                    Pincode:
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="Pincode"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mobile" className="text-xs w-32 text-right">
                    Mobile:
                  </Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    placeholder="Mobile"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="text-xs w-32 text-right">
                    Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email"
                    className="h-6 text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isActive" className="text-xs w-32 text-right">
                    Active:
                  </Label>
                  <div className="flex-1">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Update
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Create
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Customers List</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No customers found. Create your first customer above.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden flex-1">
              <div className="h-[380px] overflow-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-50 sticky top-0">
                    <TableRow>
                      <TableHead>Master ID</TableHead>
                      <TableHead>Alternate ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer._id}>
                        <TableCell>{customer.masterId || "-"}</TableCell>
                        <TableCell>{customer.alternateId || "-"}</TableCell>
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>{customer.group?.name || "-"}</TableCell>
                        <TableCell>{customer.email || "-"}</TableCell>
                        <TableCell>{customer.mobile || "-"}</TableCell>
                        <TableCell>{customer.address || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {customer.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(customer._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}