// // // Account=====================================
// // import React, { useState, useEffect } from 'react';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// // import { Trash2, Edit, Save, X, Plus } from 'lucide-react';
// // import { BASE_URL } from '@/api/BaseUrl';

// // // ✅ Updated: Account uses _id instead of id
// // interface Account {
// //   _id: string;
// //   name: string;
// //   code: string;
// //   type: string;
// //   description: string;
// //   isActive: boolean;
// // }

// // interface ApiResponse {
// //   status: number;
// //   message: string;
// //   data: Account[];
// // }

// // const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

// // export default function AccountsPage() {
// //   const [accounts, setAccounts] = useState<Account[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const [formData, setFormData] = useState<Omit<Account, '_id'>>({
// //     name: '',
// //     code: '',
// //     type: 'Asset',
// //     description: '',
// //     isActive: true
// //   });

// //   const [isEditing, setIsEditing] = useState(false);
// //   const [currentId, setCurrentId] = useState<string | null>(null);

// //   const fetchAccounts = async () => {
// //     setIsLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`${BASE_URL}account`);
// //       const result: ApiResponse = await response.json();
// //       if (!response.ok || result.status !== 200) {
// //         throw new Error(result.message || 'Failed to fetch accounts');
// //       }
// //       setAccounts(result.data || []);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'An unknown error occurred');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAccounts();
// //   }, []);

// //   const resetForm = () => {
// //     setFormData({
// //       name: '',
// //       code: '',
// //       type: 'Asset',
// //       description: '',
// //       isActive: true
// //     });
// //     setIsEditing(false);
// //     setCurrentId(null);
// //   };

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleStatusToggle = () => {
// //     setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
// //   };

// //  const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   if (!formData.name || !formData.code) {
// //     setError('Name and Code are required');
// //     return;
// //   }

// //   try {
// //     const payload = {
// //       name: formData.name,
// //       code: formData.code,
// //       type: formData.type,
// //       description: formData.description,
// //       isActive: formData.isActive
// //     };

// //     let url = `${BASE_URL}/account`; // ✅ Ensure BASE_URL and correct path
// //     let method: 'POST' | 'PUT' = 'POST';

// //     if (isEditing && currentId) {
// //       url = `${BASE_URL}/account/${currentId}`; // ✅ Correct update URL
// //       method = 'PUT';
// //     }

// //     const response = await fetch(url, {
// //       method,
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(payload),
// //     });

// //     const result = await response.json();

// //     if (!response.ok || result.status !== 200) {
// //       throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} account`);
// //     }

// //     await fetchAccounts();
// //     resetForm();
// //     setError(null);
// //   } catch (err) {
// //     setError(err instanceof Error ? err.message : 'An unknown error occurred');
// //   }
// // };


// //   const handleEdit = (account: Account) => {
// //     setFormData({
// //       name: account.name,
// //       code: account.code,
// //       type: account.type,
// //       description: account.description,
// //       isActive: account.isActive
// //     });
// //     setIsEditing(true);
// //     setCurrentId(account._id); // ✅ Use _id here
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (window.confirm('Are you sure you want to delete this account?')) {
// //       try {
// //         const response = await fetch(`${BASE_URL}account/${id}`, {
// //           method: 'DELETE',
// //         });

// //         const result = await response.json();

// //         if (!response.ok || result.status !== 200) {
// //           throw new Error(result.message || 'Failed to delete account');
// //         }

// //         console.log(result.message);
// //         await fetchAccounts();
// //       } catch (err) {
// //         setError(err instanceof Error ? err.message : 'An unknown error occurred');
// //       }
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-3xl font-bold text-gray-900">Charts of Accounts</h1>

// //       {error && (
// //         <div className="p-4 bg-red-100 text-red-700 rounded-md">
// //           Error: {error}
// //         </div>
// //       )}

// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center justify-between">
// //             {isEditing ? 'Edit Account' : 'Add New Account'}
// //             {isEditing && (
// //               <Button variant="ghost" onClick={resetForm}>
// //                 <Plus className="h-4 w-4 mr-2" /> Add New
// //               </Button>
// //             )}
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <Label htmlFor="name">Account Name*</Label>
// //                 <Input
// //                   id="name"
// //                   name="name"
// //                   value={formData.name}
// //                   onChange={handleInputChange}
// //                   placeholder="e.g. Cash Account"
// //                   required
// //                 />
// //               </div>
// //               <div>
// //                 <Label htmlFor="code">Account Code*</Label>
// //                 <Input
// //                   id="code"
// //                   name="code"
// //                   value={formData.code}
// //                   onChange={handleInputChange}
// //                   placeholder="e.g. 1001"
// //                   required
// //                 />
// //               </div>
// //               <div>
// //                 <Label htmlFor="type">Account Type</Label>
// //                 <select
// //                   id="type"
// //                   name="type"
// //                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
// //                   value={formData.type}
// //                   onChange={handleInputChange}
// //                 >
// //                   {accountTypes.map(type => (
// //                     <option key={type} value={type}>{type}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div>
// //                 <Label htmlFor="description">Description</Label>
// //                 <Input
// //                   id="description"
// //                   name="description"
// //                   value={formData.description}
// //                   onChange={handleInputChange}
// //                   placeholder="Account description"
// //                 />
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-4">
// //               <Button
// //                 type="button"
// //                 variant={formData.isActive ? 'default' : 'outline'}
// //                 onClick={handleStatusToggle}
// //               >
// //                 {formData.isActive ? 'Active' : 'Inactive'}
// //               </Button>

// //               <div className="flex-1" />

// //               {isEditing && (
// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   onClick={resetForm}
// //                 >
// //                   Cancel
// //                 </Button>
// //               )}

// //               <Button type="submit" disabled={isLoading}>
// //                 {isLoading ? (
// //                   'Processing...'
// //                 ) : isEditing ? (
// //                   <>
// //                     <Save className="h-4 w-4 mr-2" /> Update Account
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Plus className="h-4 w-4 mr-2" /> Add Account
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </form>
// //         </CardContent>
// //       </Card>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Accounts List</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {isLoading ? (
// //             <div className="text-center py-8">Loading accounts...</div>
// //           ) : accounts.length === 0 ? (
// //             <div className="text-center py-8 text-gray-500">
// //               No accounts found. Add your first account above.
// //             </div>
// //           ) : (
// //             <Table>
// //               <TableHeader>
// //                 <TableRow>
// //                   <TableHead>Code</TableHead>
// //                   <TableHead>Name</TableHead>
// //                   <TableHead>Type</TableHead>
// //                   <TableHead>Description</TableHead>
// //                   <TableHead>Status</TableHead>
// //                   <TableHead className="text-right">Actions</TableHead>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {accounts.map((account) => (
// //                   <TableRow key={account._id}>
// //                     <TableCell className="font-medium">{account.code}</TableCell>
// //                     <TableCell>{account.name}</TableCell>
// //                     <TableCell>{account.type}</TableCell>
// //                     <TableCell className="text-gray-600">
// //                       {account.description || '-'}
// //                     </TableCell>
// //                     <TableCell>
// //                       <span className={`px-2 py-1 rounded text-xs ${
// //                         account.isActive 
// //                           ? 'bg-green-100 text-green-800' 
// //                           : 'bg-gray-100 text-gray-800'
// //                       }`}>
// //                         {account.isActive ? 'Active' : 'Inactive'}
// //                       </span>
// //                     </TableCell>
// //                     <TableCell className="text-right">
// //                       <div className="flex justify-end space-x-2">
// //                         <Button
// //                           variant="outline"
// //                           size="sm"
// //                           onClick={() => handleEdit(account)}
// //                           disabled={isLoading}
// //                         >
// //                           <Edit className="h-4 w-4" />
// //                         </Button>
// //                         <Button
// //                           variant="outline"
// //                           size="sm"
// //                           onClick={() => handleDelete(account._id)}
// //                           disabled={isLoading}
// //                         >
// //                           <Trash2 className="h-4 w-4" />
// //                         </Button>
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Trash2, Edit, Save, X, Plus } from 'lucide-react';
// import { BASE_URL } from '@/api/BaseUrl';

// // Account Interface
// interface Account {
//   _id: string;
//   name: string;
//   code: string;
//   type: string;
//   description: string;
//   isActive: boolean;
// }

// interface ApiResponse {
//   status: number;
//   message: string;
//   data: Account[];
// }

// const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

// export default function AccountsPage() {
//   const [activeTab, setActiveTab] = useState('accounts');
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState<Omit<Account, '_id'>>({
//     name: '',
//     code: '',
//     type: 'Asset',
//     description: '',
//     isActive: true
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [currentId, setCurrentId] = useState<string | null>(null);

//   const fetchAccounts = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${BASE_URL}account`);
//       const result: ApiResponse = await response.json();
//       if (!response.ok || result.status !== 200) {
//         throw new Error(result.message || 'Failed to fetch accounts');
//       }
//       setAccounts(result.data || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'accounts') {
//       fetchAccounts();
//     }
//   }, [activeTab]);

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       code: '',
//       type: 'Asset',
//       description: '',
//       isActive: true
//     });
//     setIsEditing(false);
//     setCurrentId(null);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleStatusToggle = () => {
//     setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name || !formData.code) {
//       setError('Name and Code are required');
//       return;
//     }

//     try {
//       const payload = {
//         name: formData.name,
//         code: formData.code,
//         type: formData.type,
//         description: formData.description,
//         isActive: formData.isActive
//       };

//       let url = `${BASE_URL}/account`;
//       let method: 'POST' | 'PUT' = 'POST';

//       if (isEditing && currentId) {
//         url = `${BASE_URL}/account/${currentId}`;
//         method = 'PUT';
//       }

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok || result.status !== 200) {
//         throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} account`);
//       }

//       await fetchAccounts();
//       resetForm();
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//     }
//   };

//   const handleEdit = (account: Account) => {
//     setFormData({
//       name: account.name,
//       code: account.code,
//       type: account.type,
//       description: account.description,
//       isActive: account.isActive
//     });
//     setIsEditing(true);
//     setCurrentId(account._id);
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this account?')) {
//       try {
//         const response = await fetch(`${BASE_URL}account/${id}`, {
//           method: 'DELETE',
//         });

//         const result = await response.json();

//         if (!response.ok || result.status !== 200) {
//           throw new Error(result.message || 'Failed to delete account');
//         }

//         console.log(result.message);
//         await fetchAccounts();
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       }
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-gray-900">Accounting Management</h1>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="accounts">Accounts</TabsTrigger>
//           <TabsTrigger value="groups">Accounting Groups</TabsTrigger>
//           <TabsTrigger value="customers">Customers</TabsTrigger>
//           <TabsTrigger value="vendors">Vendors</TabsTrigger>
//           <TabsTrigger value="ledgers">Accounting Ledgers</TabsTrigger>
//         </TabsList>

//         <div className="mt-6">
//           {/* Accounts Tab */}
//           <TabsContent value="accounts">
//             {error && (
//               <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
//                 Error: {error}
//               </div>
//             )}

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   {isEditing ? 'Edit Account' : 'Add New Account'}
//                   {isEditing && (
//                     <Button variant="ghost" onClick={resetForm}>
//                       <Plus className="h-4 w-4 mr-2" /> Add New
//                     </Button>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="name">Account Name*</Label>
//                       <Input
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="e.g. Cash Account"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="code">Account Code*</Label>
//                       <Input
//                         id="code"
//                         name="code"
//                         value={formData.code}
//                         onChange={handleInputChange}
//                         placeholder="e.g. 1001"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="type">Account Type</Label>
//                       <select
//                         id="type"
//                         name="type"
//                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                         value={formData.type}
//                         onChange={handleInputChange}
//                       >
//                         {accountTypes.map(type => (
//                           <option key={type} value={type}>{type}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <Label htmlFor="description">Description</Label>
//                       <Input
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         placeholder="Account description"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     <Button
//                       type="button"
//                       variant={formData.isActive ? 'default' : 'outline'}
//                       onClick={handleStatusToggle}
//                     >
//                       {formData.isActive ? 'Active' : 'Inactive'}
//                     </Button>

//                     <div className="flex-1" />

//                     {isEditing && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={resetForm}
//                       >
//                         Cancel
//                       </Button>
//                     )}

//                     <Button type="submit" disabled={isLoading}>
//                       {isLoading ? (
//                         'Processing...'
//                       ) : isEditing ? (
//                         <>
//                           <Save className="h-4 w-4 mr-2" /> Update Account
//                         </>
//                       ) : (
//                         <>
//                           <Plus className="h-4 w-4 mr-2" /> Add Account
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>

//             <Card className="mt-6">
//               <CardHeader>
//                 <CardTitle>Accounts List</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {isLoading ? (
//                   <div className="text-center py-8">Loading accounts...</div>
//                 ) : accounts.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     No accounts found. Add your first account above.
//                   </div>
//                 ) : (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Code</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Type</TableHead>
//                         <TableHead>Description</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {accounts.map((account) => (
//                         <TableRow key={account._id}>
//                           <TableCell className="font-medium">{account.code}</TableCell>
//                           <TableCell>{account.name}</TableCell>
//                           <TableCell>{account.type}</TableCell>
//                           <TableCell className="text-gray-600">
//                             {account.description || '-'}
//                           </TableCell>
//                           <TableCell>
//                             <span className={`px-2 py-1 rounded text-xs ${
//                               account.isActive 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {account.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end space-x-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleEdit(account)}
//                                 disabled={isLoading}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleDelete(account._id)}
//                                 disabled={isLoading}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Accounting Groups Tab */}
//           <TabsContent value="groups">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Accounting Groups</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">Accounting Groups management will be implemented here</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Customers Tab */}
//           <TabsContent value="customers">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Customers</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">Customer management will be implemented here</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Vendors Tab */}
//           <TabsContent value="vendors">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Vendors</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">Vendor management will be implemented here</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Accounting Ledgers Tab */}
//           <TabsContent value="ledgers">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Accounting Ledgers</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">Accounting Ledgers management will be implemented here</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, Save, Plus } from 'lucide-react';
import { BASE_URL } from '@/api/BaseUrl';

// Interfaces for all entities
interface Account {
  _id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  isActive: boolean;
}

interface AccountingGroup {
  _id: string;
  name: string;
  code: string;
  parentGroup?: string;
  isActive: boolean;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface AccountingLedger {
  _id: string;
  name: string;
  code: string;
  accountId: string;
  groupId: string;
  openingBalance: number;
  isActive: boolean;
}

interface ApiResponse {
  status: number;
  message: string;
  data: any[];
}

const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

export default function AccountingManagement() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for all entities
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [groups, setGroups] = useState<AccountingGroup[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [ledgers, setLedgers] = useState<AccountingLedger[]>([]);

  // Form states for all entities
  const [accountForm, setAccountForm] = useState<Omit<Account, '_id'>>({
    name: '',
    code: '',
    type: 'Asset',
    description: '',
    isActive: true
  });

  const [groupForm, setGroupForm] = useState<Omit<AccountingGroup, '_id'>>({
    name: '',
    code: '',
    isActive: true
  });

  const [customerForm, setCustomerForm] = useState<Omit<Customer, '_id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  });

  const [vendorForm, setVendorForm] = useState<Omit<Vendor, '_id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  });

  const [ledgerForm, setLedgerForm] = useState<Omit<AccountingLedger, '_id'>>({
    name: '',
    code: '',
    accountId: '',
    groupId: '',
    openingBalance: 0,
    isActive: true
  });

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let endpoint = '';
        switch (activeTab) {
          case 'accounts':
            endpoint = 'account';
            break;
          case 'groups':
            endpoint = 'account-group';
            break;
          case 'customers':
            endpoint = 'customer';
            break;
          case 'vendors':
            endpoint = 'vendor';
            break;
          case 'ledgers':
            endpoint = 'account-ledger';
            break;
          default:
            return;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`);
        const result: ApiResponse = await response.json();
        
        if (!response.ok || result.status !== 200) {
          throw new Error(result.message || `Failed to fetch ${activeTab}`);
        }

        switch (activeTab) {
          case 'accounts':
            setAccounts(result.data || []);
            break;
          case 'groups':
            setGroups(result.data || []);
            break;
          case 'customers':
            setCustomers(result.data || []);
            break;
          case 'vendors':
            setVendors(result.data || []);
            break;
          case 'ledgers':
            setLedgers(result.data || []);
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Reset forms
  const resetForms = () => {
    setAccountForm({
      name: '',
      code: '',
      type: 'Asset',
      description: '',
      isActive: true
    });
    setGroupForm({
      name: '',
      code: '',
      isActive: true
    });
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    });
    setVendorForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    });
    setLedgerForm({
      name: '',
      code: '',
      accountId: '',
      groupId: '',
      openingBalance: 0,
      isActive: true
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  // Generic CRUD operations
  const handleSubmit = async (e: React.FormEvent, entityType: string, formData: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let endpoint = '';
      let method = 'POST';
      let url = '';

      switch (entityType) {
        case 'account':
          endpoint = 'account';
          if (!formData.name || !formData.code) {
            throw new Error('Name and Code are required');
          }
          break;
        case 'group':
          endpoint = 'account-group';
          if (!formData.name || !formData.code) {
            throw new Error('Name and Code are required');
          }
          break;
        case 'customer':
          endpoint = 'customer';
          if (!formData.name) {
            throw new Error('Name is required');
          }
          break;
        case 'vendor':
          endpoint = 'vendor';
          if (!formData.name) {
            throw new Error('Name is required');
          }
          break;
        case 'ledger':
          endpoint = 'account-ledger';
          if (!formData.name || !formData.code || !formData.accountId || !formData.groupId) {
            throw new Error('All fields are required');
          }
          break;
      }

      if (isEditing && currentId) {
        url = `${BASE_URL}${endpoint}/${currentId}`;
        method = 'PUT';
      } else {
        url = `${BASE_URL}${endpoint}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || result.status !== 200) {
        throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} ${entityType}`);
      }

      // Refresh the current tab data
      setActiveTab(prev => prev); // This will trigger the useEffect
      resetForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, entityType: string) => {
    if (window.confirm(`Are you sure you want to delete this ${entityType}?`)) {
      setIsLoading(true);
      try {
        let endpoint = '';
        switch (entityType) {
          case 'account':
            endpoint = 'account';
            break;
          case 'group':
            endpoint = 'account-group';
            break;
          case 'customer':
            endpoint = 'customer';
            break;
          case 'vendor':
            endpoint = 'vendor';
            break;
          case 'ledger':
            endpoint = 'account-ledger';
            break;
        }

        const response = await fetch(`${BASE_URL}${endpoint}/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok || result.status !== 200) {
          throw new Error(result.message || `Failed to delete ${entityType}`);
        }

        // Refresh the current tab data
        setActiveTab(prev => prev); // This will trigger the useEffect
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Edit handlers for each entity
  const handleEdit = (entity: any, entityType: string) => {
    setIsEditing(true);
    setCurrentId(entity._id);
    switch (entityType) {
      case 'account':
        setAccountForm({
          name: entity.name,
          code: entity.code,
          type: entity.type,
          description: entity.description,
          isActive: entity.isActive
        });
        break;
      case 'group':
        setGroupForm({
          name: entity.name,
          code: entity.code,
          parentGroup: entity.parentGroup,
          isActive: entity.isActive
        });
        break;
      case 'customer':
        setCustomerForm({
          name: entity.name,
          email: entity.email,
          phone: entity.phone,
          address: entity.address,
          isActive: entity.isActive
        });
        break;
      case 'vendor':
        setVendorForm({
          name: entity.name,
          email: entity.email,
          phone: entity.phone,
          address: entity.address,
          isActive: entity.isActive
        });
        break;
      case 'ledger':
        setLedgerForm({
          name: entity.name,
          code: entity.code,
          accountId: entity.accountId,
          groupId: entity.groupId,
          openingBalance: entity.openingBalance,
          isActive: entity.isActive
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Accounting Management</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {/* <TabsTrigger value="accounts">Accounts</TabsTrigger> */}
          <TabsTrigger value="groups">Accounting Groups</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="ledgers">Accounting Ledgers</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Accounts Tab */}
          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isEditing ? 'Edit Account' : 'Add New Account'}
                  {isEditing && (
                    <Button variant="ghost" onClick={resetForms}>
                      <Plus className="h-4 w-4 mr-2" /> Add New
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'account', accountForm)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="account-name">Account Name*</Label>
                      <Input
                        id="account-name"
                        name="name"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                        placeholder="e.g. Cash Account"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="account-code">Account Code*</Label>
                      <Input
                        id="account-code"
                        name="code"
                        value={accountForm.code}
                        onChange={(e) => setAccountForm({...accountForm, code: e.target.value})}
                        placeholder="e.g. 1001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="account-type">Account Type</Label>
                      <select
                        id="account-type"
                        name="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={accountForm.type}
                        onChange={(e) => setAccountForm({...accountForm, type: e.target.value})}
                      >
                        {accountTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="account-description">Description</Label>
                      <Input
                        id="account-description"
                        name="description"
                        value={accountForm.description}
                        onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                        placeholder="Account description"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={accountForm.isActive ? 'default' : 'outline'}
                      onClick={() => setAccountForm({...accountForm, isActive: !accountForm.isActive})}
                    >
                      {accountForm.isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <div className="flex-1" />

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForms}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        'Processing...'
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Account
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Accounts List</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No accounts found. Add your first account above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account._id}>
                          <TableCell className="font-medium">{account.code}</TableCell>
                          <TableCell>{account.name}</TableCell>
                          <TableCell>{account.type}</TableCell>
                          <TableCell className="text-gray-600">
                            {account.description || '-'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              account.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {account.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(account, 'account')}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(account._id, 'account')}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounting Groups Tab */}
          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isEditing ? 'Edit Accounting Group' : 'Add New Accounting Group'}
                  {isEditing && (
                    <Button variant="ghost" onClick={resetForms}>
                      <Plus className="h-4 w-4 mr-2" /> Add New
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'group', groupForm)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="group-name">Group Name*</Label>
                      <Input
                        id="group-name"
                        name="name"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                        placeholder="e.g. Current Assets"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="group-parent">Parent Group (Optional)</Label>
                      <Input
                        id="group-parent"
                        name="parentGroup"
                        value={groupForm.parentGroup || ''}
                        onChange={(e) => setGroupForm({...groupForm, parentGroup: e.target.value})}
                        placeholder="Parent group code"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={groupForm.isActive ? 'default' : 'outline'}
                      onClick={() => setGroupForm({...groupForm, isActive: !groupForm.isActive})}
                    >
                      {groupForm.isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <div className="flex-1" />

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForms}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        'Processing...'
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Group
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Group
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Accounting Groups</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading groups...</div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No groups found. Add your first group above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Parent Group</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group) => (
                        <TableRow key={group._id}>
                          <TableCell className="font-medium">{group.code}</TableCell>
                          <TableCell>{group.name}</TableCell>
                          <TableCell>{group.parentGroup || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              group.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {group.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(group, 'group')}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(group._id, 'group')}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isEditing ? 'Edit Customer' : 'Add New Customer'}
                  {isEditing && (
                    <Button variant="ghost" onClick={resetForms}>
                      <Plus className="h-4 w-4 mr-2" /> Add New
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'customer', customerForm)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer-name">Customer Name*</Label>
                      <Input
                        id="customer-name"
                        name="name"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-email">Email</Label>
                      <Input
                        id="customer-email"
                        name="email"
                        type="email"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                        placeholder="customer@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-phone">Phone</Label>
                      <Input
                        id="customer-phone"
                        name="phone"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-address">Address</Label>
                      <Input
                        id="customer-address"
                        name="address"
                        value={customerForm.address}
                        onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={customerForm.isActive ? 'default' : 'outline'}
                      onClick={() => setCustomerForm({...customerForm, isActive: !customerForm.isActive})}
                    >
                      {customerForm.isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <div className="flex-1" />

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForms}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        'Processing...'
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Customer
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Customer
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customers</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading customers...</div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No customers found. Add your first customer above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.email || '-'}</TableCell>
                          <TableCell>{customer.phone || '-'}</TableCell>
                          <TableCell className="text-gray-600">
                            {customer.address || '-'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              customer.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(customer, 'customer')}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(customer._id, 'customer')}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
                  {isEditing && (
                    <Button variant="ghost" onClick={resetForms}>
                      <Plus className="h-4 w-4 mr-2" /> Add New
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'vendor', vendorForm)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vendor-name">Vendor Name*</Label>
                      <Input
                        id="vendor-name"
                        name="name"
                        value={vendorForm.name}
                        onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                        placeholder="e.g. ABC Suppliers"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-email">Email</Label>
                      <Input
                        id="vendor-email"
                        name="email"
                        type="email"
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                        placeholder="vendor@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-phone">Phone</Label>
                      <Input
                        id="vendor-phone"
                        name="phone"
                        value={vendorForm.phone}
                        onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-address">Address</Label>
                      <Input
                        id="vendor-address"
                        name="address"
                        value={vendorForm.address}
                        onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
                        placeholder="123 Business Ave"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={vendorForm.isActive ? 'default' : 'outline'}
                      onClick={() => setVendorForm({...vendorForm, isActive: !vendorForm.isActive})}
                    >
                      {vendorForm.isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <div className="flex-1" />

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForms}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        'Processing...'
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Vendor
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Vendor
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading vendors...</div>
                ) : vendors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No vendors found. Add your first vendor above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor._id}>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>{vendor.email || '-'}</TableCell>
                          <TableCell>{vendor.phone || '-'}</TableCell>
                          <TableCell className="text-gray-600">
                            {vendor.address || '-'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              vendor.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {vendor.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(vendor, 'vendor')}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(vendor._id, 'vendor')}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounting Ledgers Tab */}
          <TabsContent value="ledgers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isEditing ? 'Edit Accounting Ledger' : 'Add New Accounting Ledger'}
                  {isEditing && (
                    <Button variant="ghost" onClick={resetForms}>
                      <Plus className="h-4 w-4 mr-2" /> Add New
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'ledger', ledgerForm)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ledger-name">Ledger Name*</Label>
                      <Input
                        id="ledger-name"
                        name="name"
                        value={ledgerForm.name}
                        onChange={(e) => setLedgerForm({...ledgerForm, name: e.target.value})}
                        placeholder="e.g. Cash in Bank"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ledger-code">Ledger Code*</Label>
                      <Input
                        id="ledger-code"
                        name="code"
                        value={ledgerForm.code}
                        onChange={(e) => setLedgerForm({...ledgerForm, code: e.target.value})}
                        placeholder="e.g. CB-001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ledger-account">Account*</Label>
                      <select
                        id="ledger-account"
                        name="accountId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={ledgerForm.accountId}
                        onChange={(e) => setLedgerForm({...ledgerForm, accountId: e.target.value})}
                        required
                      >
                        <option value="">Select Account</option>
                        {accounts.map(account => (
                          <option key={account._id} value={account._id}>
                            {account.name} ({account.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="ledger-group">Group*</Label>
                      <select
                        id="ledger-group"
                        name="groupId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={ledgerForm.groupId}
                        onChange={(e) => setLedgerForm({...ledgerForm, groupId: e.target.value})}
                        required
                      >
                        <option value="">Select Group</option>
                        {groups.map(group => (
                          <option key={group._id} value={group._id}>
                            {group.name} ({group.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="ledger-opening">Opening Balance</Label>
                      <Input
                        id="ledger-opening"
                        name="openingBalance"
                        type="number"
                        value={ledgerForm.openingBalance}
                        onChange={(e) => setLedgerForm({...ledgerForm, openingBalance: Number(e.target.value)})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={ledgerForm.isActive ? 'default' : 'outline'}
                      onClick={() => setLedgerForm({...ledgerForm, isActive: !ledgerForm.isActive})}
                    >
                      {ledgerForm.isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <div className="flex-1" />

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForms}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        'Processing...'
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Ledger
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Ledger
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Accounting Ledgers</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading ledgers...</div>
                ) : ledgers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No ledgers found. Add your first ledger above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Opening Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgers.map((ledger) => {
                        const account = accounts.find(a => a._id === ledger.accountId);
                        const group = groups.find(g => g._id === ledger.groupId);
                        
                        return (
                          <TableRow key={ledger._id}>
                            <TableCell className="font-medium">{ledger.code}</TableCell>
                            <TableCell>{ledger.name}</TableCell>
                            <TableCell>
                              {account ? `${account.name} (${account.code})` : '-'}
                            </TableCell>
                            <TableCell>
                              {group ? `${group.name} (${group.code})` : '-'}
                            </TableCell>
                            <TableCell>
                              {ledger.openingBalance.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                ledger.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ledger.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(ledger, 'ledger')}
                                  disabled={isLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(ledger._id, 'ledger')}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}