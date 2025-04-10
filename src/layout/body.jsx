import { Route, Routes } from "react-router-dom";
import Home from "../tabs/home";
import Inventory from "../tabs/inventory";
import Sales from "../tabs/sales";
import Reports from "../tabs/reports";
import AddStockForm from "../components/addStockForm";
import SellProductForm from "../components/sellProductForm";

function Body() {
  return (
    <main>
      
      <Routes>
        <Route index element={<Home />} />
        <Route path="/addStock" element={<AddStockForm />} />
        <Route path="/sellProduct" element={<SellProductForm />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </main>
  );
}

export default Body;
