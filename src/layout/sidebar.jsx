import { NavLink, useLocation } from "react-router-dom";
import { FaShoppingCart, FaSync, FaPlus, FaHome, FaWarehouse, FaChartLine, FaFileAlt, FaTractor, FaUser } from "react-icons/fa";
import { useEffect } from "react";

function Sidebar() {
  const location = useLocation(); // Get the current URL path

  return (
    <div className="sidebar " style={{ marginTop: "0" }}>
      <div className="logo">
        <FaTractor />
      </div>
      <div className="brandname">
        <h4>Kheti Kisani</h4>
      </div>
      <ul className="nav">
        {[
          { name: "Home", icon: <FaHome />, path: "/" },
          { name: "Stocks", icon: <FaWarehouse />, path: "/stocks" },
          { name: "Sales", icon: <FaChartLine />, path: "/sales" },
          { name: "Reports", icon: <FaFileAlt />, path: "/reports" },
          { name: "Sell Item", icon: <FaShoppingCart />, path: "/sellProduct" },
          { name: "New Item", icon: <FaPlus />, path: "/newProduct" },
          { name: "Restock", icon: <FaSync />, path: "/reStock" },
          { name: "Salesmen", icon: <FaUser />, path: "/salesmen" },
        ].map((item) => (
          <NavLink
            key={item.name}
            className={({ isActive }) => `nav-item ${isActive || (item.path === "/" && location.pathname === "/") ? "active" : ""}`}
            to={item.path}
          >
            <li>
              {item.icon}
              <span>{item.name}</span>
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
