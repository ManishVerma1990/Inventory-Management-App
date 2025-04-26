import { Link } from "react-router-dom";
import SalesmenTable from "./salesmenTable";

function Salesmen() {
  return (
    <>
      <Link to="/salesmen/new" type="button" className="shadow btn btn-lg btn-primary m-3">
        New Salesmen
      </Link>
      <SalesmenTable />
    </>
  );
}

export default Salesmen;
