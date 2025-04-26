import { Link } from "react-router-dom";
import SearchBox from "../components/searchBox";
import { FaShoppingCart, FaPlus, FaSync } from "react-icons/fa";
import Stats from "../components/stats";
import SmInventory from "../components/smInventory";
import SmSales from "../components/smSales";

function Home() {
  // Send IPC request to main process

  return (
    <div className="container text-center">
      <div className="mt-2">
        <SearchBox />
      </div>

      {/* <div className="row justify-content-center">
        <div className="col col-lg-3 col-md-4">
          <Link to="/sellProduct" type="button" className="shadow btn btn-lg btn-outline-primary m-3">
            <span style={{ fontSize: "1.6rem" }}>
              <FaShoppingCart />{" "}
            </span>{" "}
            Sell Items
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/reStock" type="button" className="shadow btn btn-lg btn-outline-success m-3">
            <span style={{ fontSize: "1.4rem" }}>
              <FaSync />{" "}
            </span>{" "}
            Re-Stock
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/newProduct" type="button" className="shadow btn btn-lg btn-primary m-3">
            <span style={{ fontSize: "1.4rem" }}>
              <FaPlus />
            </span>{" "}
            New Item
          </Link>
        </div>
      </div> */}

      <div className="row justify-content-around mt-3">
        <div className="col  d-flex justify-content-center">
          <Stats title={"Total stock"} req={"getStocksCount"} to={"/stocks"} />
        </div>
        <div className="col  d-flex justify-content-center">
          <Stats title={"Sales today"} req={"getTodaySalesCount"} to={"/sales"} />
        </div>
        <div className="col  d-flex justify-content-center">
          <Stats color={"green"} currency={true} title={"Today's revenue"} req={"getTodaysRevenue"} />
        </div>
        <div className="col  d-flex justify-content-center">
          <Stats color={"orange"} title={"Low stock"} req={"getLowStockCount"} to={"/lowStock"} />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <SmInventory />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <SmSales />
        </div>
      </div>
    </div>
  );
}

export default Home;
