
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Building2,
  Calculator,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  ChevronDown,
  Wine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },

  // {
  //   name: 'General Settings',
  //   icon: TrendingDown,
  //   children: [
  //        { name: 'Integaration', href: '/inward/purchase-orders' },
  //     { name: 'Company', href: '/organization' },
  //      { name: 'Depot', href: '/inward/depot' },
  //      {name:'Branch & Division',href:'/inward/ledger'},
  //   ]
  // },

{
    name: 'General Settings',
    icon: TrendingDown,
    href: '/genral_setting',
    // children: [
    //   { name: 'Integration', href: '/inward/purchase-orders' },
    //   { name: 'Company', href: '/organization' },
    //   { name: 'Depot', href: '/inward/depot' },
    //   { name: 'Branch & Division', href: '/inward/ledger' },
    // ]
  },



  { name: 'User Management', href: '/settings', icon: Settings },
  // { name: 'Organization', href: '/organization', icon: Building2 },
  { name: 'Charts of Accounts', href: '/master_setting', icon: Calculator },
  { name: 'Inventory', href: '/inventory_setting', icon: Package },
  {
    name: 'Inward Process',
    icon: TrendingDown,
    children: [
      { name: 'Indents', href: '/inward/indents' },
      //  { name: 'Depot', href: '/inward/depot' },
      //  {name:'Ledger',href:'/inward/ledger'},
      { name: 'Purchase Orders', href: '/inward/purchase-orders' },
      { name: 'GRN', href: '/inward/grn' },
      { name: 'Purchase', href: '/inward/purchase' },
      { name: 'Purchase Returns', href: '/inward/returns' }
    ]
  },


  {
    name: 'Store Operations',
    icon: Package,
    children: [
      { name: 'Material Transfer', href: '/store/transfer' },
      { name: 'Wastage', href: '/store/wastage' },
      { name: 'Stock Adjustment', href: '/store/adjustment' }
    ]
  },
  {
    name: 'Sales Process',
    icon: TrendingUp,
    children: [
      // { name: 'Sales Orders', href: '/sales/orders' },
      { name: 'Delivery Notes', href: '/sales/delivery' },
      { name: 'Invoices', href: '/sales/invoices' },
      // { name: 'Receipts', href: '/sales/receipts' }
    ]
  },
  

    
{
    name: 'Reports',
    icon: BarChart3,//TrendingDown,
    children: [
      { name: 'Indents', href: '/indent-report' },
      { name: 'Purchase Order Due', href: '/indent-purchase-report' },
      { name: 'Purchase ', href: '/indent-purchase-reports' },
      { name: 'Purchase Order', href: '/indent-purchase-order' },
      { name: 'Wastage Report', href: '/indent-wastage-report' },
      { name: 'Material Report', href: '/indent-material-report' },
      { name: 'Invoice Report', href: '/indent-invoice-report' },
      { name: 'Delivery Report', href: '/indent-delivery-report' },
      { name: 'Stock Report', href: '/indent-stock-report' },
      { name: 'Reports', href: '/reports' }
      // { name: 'Purchase Orders', href: '/inward/purchase-orders' },
      // { name: 'GRN', href: '/inward/grn' },
      // { name: 'Returns', href: '/inward/returns' }
    ]
  }
];

export function Sidebar() {
  const location = useLocation();
  const [openSections, setOpenSections] = React.useState<string[]>(['Inward Process', 'Store Operations', 'Sales Process']);

  const toggleSection = (name: string) => {
    setOpenSections(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="flex w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Wine className="h-8 w-8 text-purple-400" />
          <span className="text-xl font-bold">WineShipping ERP</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 p-4" style={{overflow:'auto'}}>
        {navigation.map((item) => {
          if (item.children) {
            return (
              <Collapsible key={item.name} open={openSections.includes(item.name)} onOpenChange={() => toggleSection(item.name)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.includes(item.name) && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-8">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white",
                        location.pathname === child.href && "bg-gray-800 text-white"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          }
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white",
                location.pathname === item.href && "bg-gray-800 text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>


    </div>
  );
}
