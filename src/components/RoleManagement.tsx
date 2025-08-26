
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { User, Edit, Trash2, Plus } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// interface UserRole {
//   id: string;
//   username: string;
//   email: string;
//   role: 'Admin' | 'Manager' | 'Operator' | 'Viewer';
//   department: 'Sales' | 'Purchase' | 'Inventory' | 'Finance';
//   status: 'Active' | 'Inactive';
//   lastLogin: string;
// }



// export function RoleManagement() {
//   const { toast } = useToast();
//   const [users, setUsers] = useState<UserRole[]>([
//     {
//       id: '1',
//       username: 'admin',
//       email: 'admin@wineshipping.com',
//       role: 'Admin',
//       department: 'Sales',
//       status: 'Active',
//       lastLogin: '2024-01-16 09:30'
//     },
//     {
//       id: '2',
//       username: 'manager',
//       email: 'manager@wineshipping.com',
//       role: 'Manager',
//       department: 'Purchase',
//       status: 'Active',
//       lastLogin: '2024-01-15 14:20'
//     },
//     {
//       id: '3',
//       username: 'operator1',
//       email: 'operator@wineshipping.com',
//       role: 'Operator',
//       department: 'Inventory',
//       status: 'Inactive',
//       lastLogin: '2024-01-10 11:15'
//     }
//   ]);

//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<UserRole | null>(null);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     role: 'Viewer' as const,
//     department: 'Sales' as const
//   });

//   const handleCreateUser = () => {
//     const newUser: UserRole = {
//       id: String(users.length + 1),
//       username: formData.username,
//       email: formData.email,
//       role: formData.role,
//       department: formData.department,
//       status: 'Active',
//       lastLogin: 'Never'
//     };
    
//     setUsers([...users, newUser]);
//     toast({
//       title: "User Created",
//       description: `User ${formData.username} has been created successfully.`,
//     });
//     setFormData({ username: '', email: '', role: 'Viewer', department: 'Sales' });
//     setIsCreateModalOpen(false);
//   };

//   const handleEditUser = (user: UserRole) => {
//     setEditingUser(user);
//     setFormData({
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       department: user.department
//     });
//     setIsCreateModalOpen(true);
//   };

//   const handleUpdateUser = () => {
//     if (!editingUser) return;
    
//     setUsers(users.map(user => 
//       user.id === editingUser.id 
//         ? { ...user, ...formData }
//         : user
//     ));
    
//     toast({
//       title: "User Updated",
//       description: `User ${formData.username} has been updated successfully.`,
//     });
//     setEditingUser(null);
//     setFormData({ username: '', email: '', role: 'Viewer', department: 'Sales' });
//     setIsCreateModalOpen(false);
//   };

//   const handleDeleteUser = (userId: string) => {
//     setUsers(users.filter(user => user.id !== userId));
//     toast({
//       title: "User Deleted",
//       description: "User has been deleted successfully.",
//     });
//   };

//   const toggleUserStatus = (userId: string) => {
//     setUsers(users.map(user => 
//       user.id === userId 
//         ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
//         : user
//     ));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Role Management</h2>
//         <Button onClick={() => setIsCreateModalOpen(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add User
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <User className="h-5 w-5 mr-2" />
//             User Management
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left p-3">Username</th>
//                   <th className="text-left p-3">Email</th>
//                   <th className="text-left p-3">Role</th>
//                   <th className="text-left p-3">Department</th>
//                   <th className="text-left p-3">Status</th>
//                   <th className="text-left p-3">Last Login</th>
//                   <th className="text-left p-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3 font-medium">{user.username}</td>
//                     <td className="p-3">{user.email}</td>
//                     <td className="p-3">
//                       <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
//                         {user.role}
//                       </Badge>
//                     </td>
//                     <td className="p-3">{user.department}</td>
//                     <td className="p-3">
//                       <Badge 
//                         variant={user.status === 'Active' ? 'default' : 'secondary'}
//                         className={user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}
//                       >
//                         {user.status}
//                       </Badge>
//                     </td>
//                     <td className="p-3 text-gray-600">{user.lastLogin}</td>
//                     <td className="p-3">
//                       <div className="flex space-x-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEditUser(user)}
//                         >
//                           <Edit className="h-3 w-3" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => toggleUserStatus(user.id)}
//                         >
//                           {user.status === 'Active' ? 'Deactivate' : 'Activate'}
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDeleteUser(user.id)}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 value={formData.username}
//                 onChange={(e) => setFormData({...formData, username: e.target.value})}
//                 placeholder="Enter username"
//               />
//             </div>
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 placeholder="Enter email"
//               />
//             </div>
//             <div>
//               <Label htmlFor="role">Role</Label>
//               <select 
//                 id="role"
//                 className="w-full rounded-md border border-input bg-background px-3 py-2"
//                 value={formData.role}
//                 onChange={(e) => setFormData({...formData, role: e.target.value as any})}
//               >
//                 <option value="Admin">Admin</option>
//                 <option value="Manager">Manager</option>
//                 <option value="Operator">Operator</option>
//                 <option value="Viewer">Viewer</option>
//               </select>
//             </div>
//             <div>
//               <Label htmlFor="department">Department</Label>
//               <select 
//                 id="department"
//                 className="w-full rounded-md border border-input bg-background px-3 py-2"
//                 value={formData.department}
//                 onChange={(e) => setFormData({...formData, department: e.target.value as any})}
//               >
//                 <option value="Sales">Sales</option>
//                 <option value="Purchase">Purchase</option>
//                 <option value="Inventory">Inventory</option>
//                 <option value="Finance">Finance</option>
//               </select>
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
//                 {editingUser ? 'Update User' : 'Create User'}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { BASE_URL } from '@/api/BaseUrl';

interface UserRole {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Operator' | 'Viewer';
  department: 'Sales' | 'Purchase' | 'Inventory' | 'Finance';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

interface ApiResponse {
  success: boolean;
  data?: UserRole | UserRole[];
  message?: string;
  error?: string;
}

export function RoleManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Viewer' as const,
    department: 'Sales' as const,
    password: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(`${BASE_URL}/orginization_user`);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        toast({
          title: "Success",
          description: "Users loaded successfully",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         "Failed to fetch users";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

 const handleCreateUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/orginization_user`, {
      username: formData.username,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      password: formData.password,
      status: 'Active'
    });

    if (response.status === 200 && response.data.user) {
      const newUser = response.data.user as UserRole;

      setUsers([...users, newUser]);

      toast({
        title: "Success",
        description: response.data.message || "User created successfully",
      });

      resetForm();
      setIsCreateModalOpen(false);
    } else {
      throw new Error(response.data.message || "Failed to create user");
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to create user";

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
};


  const handleEditUser = (user: UserRole) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      password: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const response = await axios.put<ApiResponse>(`${BASE_URL}/orginization_user/${editingUser.id}`, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        ...(formData.password && { password: formData.password })
      });

      if (response.data.success && response.data.data) {
        const updatedUser = response.data.data as UserRole;
        setUsers(users.map(user => 
          user.id === editingUser.id ? updatedUser : user
        ));
        toast({
          title: "Success",
          description: response.data.message || "User updated successfully",
        });
        resetForm();
        setIsCreateModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         "Failed to update user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`${BASE_URL}/orginization_user/${userId}`);
      
      if (response.data.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Success",
          description: response.data.message || "User deleted successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         "Failed to delete user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      const response = await axios.patch<ApiResponse>(
        `${BASE_URL}/orginization_user/${userId}/status`, 
        { status: newStatus }
      );

      if (response.data.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        ));
        toast({
          title: "Success",
          description: response.data.message || "Status updated successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         "Failed to update status";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: 'Viewer',
      department: 'Sales',
      password: ''
    });
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
              <Button 
                variant="ghost" 
                className="mt-4"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first user
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Username</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Department</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Last Login</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-3">{user.department}</td>
                      <td className="p-3">
                        <Badge 
                          variant={user.status === 'Active' ? 'default' : 'secondary'}
                          className={user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">{user.lastLogin}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">
                {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
                required={!editingUser}
              />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <select 
                id="role"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
              <select 
                id="department"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value as any})}
                required
              >
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
                <option value="Inventory">Inventory</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                disabled={!formData.username || !formData.email || (!editingUser && !formData.password)}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}