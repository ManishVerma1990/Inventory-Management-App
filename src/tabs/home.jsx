import { Link } from "react-router-dom";
import SearchBox from "../components/searchBox";

function Home() {
  // Send IPC request to main process

  return (
    <div className="container text-center">
      <SearchBox />

      <div className="row justify-content-center">
        <div className="col col-lg-3 col-md-4">
          <Link to="/newProduct" type="button" className="shadow btn btn-lg btn-primary m-3">
            New Item
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/sellProduct" type="button" className="shadow btn btn-lg btn-outline-primary m-3">
            Sell Items
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/reStock" type="button" className="shadow btn btn-lg btn-outline-success m-3">
            Re-Stock
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
