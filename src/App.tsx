import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Organization from "./pages/Organization";
import Accounts from "./pages/Accounts";
import Inventory from "./pages/Inventory";
import Indents from "./pages/inward/Indents";
import PurchaseOrders from "./pages/inward/PurchaseOrders";
import Depot from "./pages/inward/Depot";
import Ledger from "./pages/inward/Ledger";
import GRN from "./pages/inward/GRN";
import Returns from "./pages/inward/Returns";
import MaterialTransfer from "./pages/store/MaterialTransfer";
import Wastage from "./pages/store/Wastage";
import StockAdjustment from "./pages/store/StockAdjustment";
import SalesOrders from "./pages/sales/Orders";
import DeliveryNotes from "./pages/sales/DeliveryNotes";
import Invoices from "./pages/sales/Invoices";
import Receipts from "./pages/sales/Receipts";
import Reports from "./pages/Reports/AnalyticsReports";
import NotFound from "./pages/NotFound";
import IndentReport from "./pages/IndentReports/IndentReport";
import Genral_Setting from "./pages/GenralSetting";
import Master_setting from "./pages/Master_setting";
import Inventory_setting from "./pages/Inventory_data";
import IndentRegister from './pages/IndentReports/IndentRegister';
import Purchase from './pages/inward/Purchase';
import PurchaseAllOrders from './pages/Reports/AllReports';
import PurchaseReports from './pages/Reports/PurchaseReport';
import PurchaseOrderReport from './pages/Reports/PurchaseOrderReport';
import WastageReport from './pages/Reports/WastageReport';
import MaterialReport from './pages/Reports/MaterialReport';
import InvoiceReport from './pages/Reports/InvoiceReport';
import DeliveryReport from './pages/Reports/DeliveryReport';
import StockAdjustmentReport from './pages/Reports/StockAdjustmentReport';
import AnalyticsReports from './pages/Reports/AnalyticsReports';
import { Provider } from 'react-redux'
import { store } from './redux/store'
const queryClient = new QueryClient();

function AppRoutes() {






  const { user, logout } = useAuth();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Login />;
  }
  return (

    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
       <Route path="/genral_setting" element={<Genral_Setting />} />
          <Route path="/master_setting" element={<Master_setting />} />
           <Route path="/inventory_setting" element={<Inventory_setting />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inward/indents" element={<Indents />} />
        <Route path="/inward/purchase-orders" element={<PurchaseOrders />} />
         <Route path="/inward/depot" element={<Depot/>} />
         <Route path="/inward/ledger" element={<Ledger />} />
         <Route path="/indent-report" element={<IndentReport />} />
         <Route path="/indent-purchase-report" element={<PurchaseAllOrders />} />
         <Route path="/indent-purchase-reports" element={<PurchaseReports />} />
         <Route path="/indent-purchase-order" element={<PurchaseOrderReport />} />
         <Route path="/indent-wastage-report" element={<WastageReport />} />
         <Route path="/indent-material-report" element={<MaterialReport />} />
         <Route path="/indent-invoice-report" element={<InvoiceReport />} />
         <Route path="/indent-delivery-report" element={<DeliveryReport />} />
         <Route path="/indent-stock-report" element={<StockAdjustmentReport />} />
        <Route path="/inward/grn" element={<GRN />} />
        <Route path="/inward/Purchase" element={<Purchase />} />
        <Route path="/inward/returns" element={<Returns />} />
        <Route path="/store/transfer" element={<MaterialTransfer />} />
        <Route path="/store/wastage" element={<Wastage />} />
        <Route path="/store/adjustment" element={<StockAdjustment />} />
        <Route path="/sales/orders" element={<SalesOrders />} />
        <Route path="/sales/delivery" element={<DeliveryNotes />} />
        <Route path="/sales/invoices" element={<Invoices />} />
        <Route path="/sales/receipts" element={<Receipts />} />
        <Route path="/reports" element={<AnalyticsReports />} />
        <Route path="/indent-register" element={<IndentRegister />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <h1>
        v2
      </h1>
    </Layout>
  );
}

const App = () => (
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position='top-right' />
      {/* <Sonner /> */}
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </Provider>
);

export default App;
