import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaWarehouse, FaChartLine, FaFileAlt } from "react-icons/fa";
import { useEffect } from "react";

function Sidebar() {
  const location = useLocation(); // Get the current URL path

  return (
    <div className="sidebar shadow">
      <div className="brandname">
        <h4>Some company name</h4>
      </div>
      <ul className="nav">
        {[
          { name: "Home", icon: <FaHome />, path: "/" },
          { name: "Inventory", icon: <FaWarehouse />, path: "/inventory" },
          { name: "Sales", icon: <FaChartLine />, path: "/sales" },
          { name: "Reports", icon: <FaFileAlt />, path: "/reports" },
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
