import { Link } from "react-router-dom";
import SearchBox from "../components/searchBox";

function Home() {
  // Send IPC request to main process
  const addProduct = async () => {
    await window.api.product("post", {
      name: "product2",
      description: "description",
      category: "cat1",
      product_quantity: "200ml",
      stock_quantity: 5,
      price: 199,
    });
  };

  const updateProduct = async () => {
    await window.api.product("put", { id: 1, quantity: 9 });
  };

  const fetchAllData = async () => {
    let products = await window.api.product("get");
    console.log("Products:", products);
  };

  return (
    <div className="container text-center">
      <SearchBox />

      <div className="row justify-content-center">
        <div className="col col-lg-3 col-md-4">
          <Link to="/addStock" type="button" className="shadow btn btn-lg btn-primary m-3">
            Add Stock
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/sellProduct" type="button" className="shadow btn btn-lg btn-outline-primary m-3">
            Sell Product
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
