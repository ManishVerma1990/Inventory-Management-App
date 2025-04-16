import { Link } from "react-router-dom";
import SearchBox from "../components/searchBox";
import { FaShoppingCart, FaPlus, FaSync } from "react-icons/fa";
import Stats from "../components/stats";

function Home() {
  // Send IPC request to main process

  return (
    <div className="container text-center">
      <SearchBox />

      <div className="row justify-content-center">
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
      </div>
      {/* <div className="row">
        <Stats title={"Title"} req={"getProductsCount"}  />
      </div> */}
    </div>
  );
}

export default Home;
