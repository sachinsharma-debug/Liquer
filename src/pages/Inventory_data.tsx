// import React from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Link } from 'react-router-dom';
// import {ProductPage} from '@/pages/Inventory_master/Products';
// import {StockGroupPage} from '@/pages/Inventory_master/Stock_Groups';
// import {StockCategoryPage} from '@/pages/Inventory_master/Stock_Category';
// import {StockUnitPage} from '@/pages/Inventory_master/Units';

// export default function GeneralSettings() {
//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Inventory Master</h1>
//           <div className="flex space-x-2 text-sm text-gray-500 mt-2">
//             <Link to="/" className="hover:text-gray-700">Home</Link>
//             <span>/</span>
//             <span className="text-gray-700">Inventory Master</span>
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="integration" className="w-full">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="products">Products</TabsTrigger>
//           <TabsTrigger value="stockgroups">Stock Groups</TabsTrigger>
//           <TabsTrigger value="depot">Stock Category</TabsTrigger>
//           <TabsTrigger value="branch">Units</TabsTrigger>
//         </TabsList>
        
//         <div className="mt-6 border rounded-lg p-6">
//           <TabsContent value="integration">
//             <ProductPage />
//           </TabsContent>
//           <TabsContent value="stockgroups">
//             <StockGroupPage />
//           </TabsContent>
//           <TabsContent value="depot">
//             <StockCategoryPage />
//           </TabsContent>
//           <TabsContent value="branch">
//             <StockUnitPage />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ProductPage } from '@/pages/Inventory_master/Products';
import {StockGroupPage} from '@/pages/Inventory_master/Stock_Groups';
import  {StockCategoryPage}  from '@/pages/Inventory_master/Stock_Category';
import { StockUnitPage } from '@/pages/Inventory_master/Units';
import { Brand } from './Inventory_master/Brand';

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState('units');
  const [keyMap, setKeyMap] = useState({
    products: Date.now(),
    stockgroups: Date.now(),
    stockcategory: Date.now(),
    unit: Date.now(),
    brand: Date.now()
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update the key to force remount of the component
    setKeyMap(prev => ({ ...prev, [value]: Date.now() }));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Master</h1>
          <div className="flex space-x-2 text-sm text-gray-500 mt-2">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <span className="text-gray-700">Inventory Master</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="stockgroups">Stock Groups</TabsTrigger>
          <TabsTrigger value="depot">Stock Category</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 border rounded-lg p-6">
          <TabsContent value="units" key={`units-${keyMap.unit}`}>
            <StockUnitPage />
          </TabsContent>
          <TabsContent value="stockgroups" key={`stockgroups-${keyMap.stockgroups}`}>
            <StockGroupPage />
          </TabsContent>
          <TabsContent value="depot" key={`depot-${keyMap.stockcategory}`}>
            <StockCategoryPage />
          </TabsContent>
          <TabsContent value="brand" key={`brand-${keyMap.brand}`}>
            <Brand />
          </TabsContent>
          <TabsContent value="products" key={`products-${keyMap.products}`}>
            <ProductPage />
          </TabsContent>
          
        </div>
      </Tabs>
    </div>
  );
}