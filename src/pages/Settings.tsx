// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Switch } from '@/components/ui/switch';
// import { RoleManagement } from '@/components/RoleManagement';

// export default function Settings() {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
      
//       <Tabs defaultValue="users" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="users">Users & Roles</TabsTrigger>
//           {/* <TabsTrigger value="password">Password Policy</TabsTrigger>
//           <TabsTrigger value="login">Login Policy</TabsTrigger> */}
//         </TabsList>
        
//         <TabsContent value="users" className="space-y-4">
//           <RoleManagement />
//         </TabsContent>
        
//         {/* <TabsContent value="password" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Password Policy</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="min-length">Minimum password length</Label>
//                 <Input id="min-length" type="number" defaultValue="8" className="w-20" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="uppercase">Require uppercase letters</Label>
//                 <Switch id="uppercase" defaultChecked />
//               </div>
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="numbers">Require numbers</Label>
//                 <Switch id="numbers" defaultChecked />
//               </div>
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="special">Require special characters</Label>
//                 <Switch id="special" />
//               </div>
//               <Button>Save Policy</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="login" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Login Policy</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="max-attempts">Maximum login attempts</Label>
//                 <Input id="max-attempts" type="number" defaultValue="3" className="w-20" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="lockout-duration">Lockout duration (minutes)</Label>
//                 <Input id="lockout-duration" type="number" defaultValue="30" className="w-20" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="session-timeout">Session timeout (hours)</Label>
//                 <Input id="session-timeout" type="number" defaultValue="8" className="w-20" />
//               </div>
//               <Button>Save Policy</Button>
//             </CardContent>
//           </Card>
//         </TabsContent> */}
//       </Tabs>
//     </div>
//   );
// }




import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RoleManagement } from '@/components/RoleManagement';
import { UserManagement } from '@/pages/UserManagement';

export default function Settings() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <nav className="flex space-x-2 text-sm text-gray-500 mt-2">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>/</span>
          <span className="text-gray-700">Settings</span>
        </nav>
      </div>

      <Tabs defaultValue="login-security" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="login-security">Login Security</TabsTrigger>
          <TabsTrigger value="password-policy">Password Policy</TabsTrigger>
          
        </TabsList>

        <div className="mt-6">
          <TabsContent value="login-security">
            <Card>
              <CardHeader>
                <CardTitle>Login Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-attempts">Maximum login attempts</Label>
                  <Input id="max-attempts" type="number" defaultValue="3" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lockout-duration">Lockout duration (minutes)</Label>
                  <Input id="lockout-duration" type="number" defaultValue="30" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="session-timeout">Session timeout (hours)</Label>
                  <Input id="session-timeout" type="number" defaultValue="8" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">Require two-factor authentication</Label>
                  <Switch id="two-factor" />
                </div>
                <Button className="mt-4">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password-policy">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="min-length">Minimum password length</Label>
                  <Input id="min-length" type="number" defaultValue="8" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Require uppercase letters</Label>
                  <Switch id="uppercase" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Require numbers</Label>
                  <Switch id="numbers" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="special">Require special characters</Label>
                  <Switch id="special" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="expiry">Password expiry (days)</Label>
                  <Input id="expiry" type="number" defaultValue="90" className="w-20" />
                </div>
                <Button className="mt-4">Save Policy</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <RoleManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}