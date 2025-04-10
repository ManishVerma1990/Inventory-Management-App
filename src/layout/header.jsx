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
      case "/inventory":
        name = "Inventory";
        break;
      case "/sales":
        name = "Sales";
        break;
      case "/reports":
        name = "Reports";
        break;
      case "/addStock":
        name = "Add Stock";
        break;
      case "/sellProduct":
        name = "Sell Product";
        break;
    }
    return name;
  };

  return (
    <div className="header ">
      <span className="tabname">{tabName(location.pathname)}</span>
      <Clock />
    </div>
  );
}

export default Header;
