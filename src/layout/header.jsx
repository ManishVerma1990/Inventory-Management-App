import { useLocation } from "react-router-dom";
import Clock from "../components/clock";

function Header() {
  let location = useLocation();
  const tabName = (location) => {
    let name;
    switch (location) {
      case "/":
        name = "Home";
        break;
      case "/stocks":
        name = "Stocks";
        break;
      case "/sales":
        name = "Sales";
        break;
      case "/reports":
        name = "Reports";
        break;
      case "/newProduct":
        name = "New Product";
        break;
      case "/sellProduct":
        name = "Sell Product";
        break;
      case "/salesmen":
        name = "Salesmen";
      case "/reStock":
        name = "Restock";
      case "/salesmen/new":
        name = "New Salesmen";
    }
    return name;
  };

  return (
    <div className="header ">
      <span className="tabname">
        {"> "}
        {tabName(location.pathname)}
      </span>
      <Clock />
    </div>
  );
}

export default Header;
