import { Route, Routes } from "react-router-dom";
import Home from "../tabs/home";
import Inventory from "../tabs/inventory";
import Sales from "../tabs/sales";
import Reports from "../tabs/reports";
import NewProductForm from "../components/newProductForm";
import SellProductForm from "../components/sellProductForm";
import ReStockForm from "../components/reStockForm";
import Salesmen from "../components/salesmen";

function Body() {
  return (
    <main>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/newProduct" element={<NewProductForm />} />
        <Route path="/sellProduct" element={<SellProductForm />} />
        <Route path="/reStock" element={<ReStockForm />} />
        <Route path="/stocks" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/salesmen" element={<Salesmen />} />
      </Routes>
    </main>
  );
}

export default Body;
