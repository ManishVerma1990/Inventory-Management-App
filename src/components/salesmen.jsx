import { Link } from "react-router-dom";

function Salesmen() {
  return (
    <>
      <Link to="/salesmen/new" type="button" className="shadow btn btn-lg btn-primary m-3">
        New Salesmen
      </Link>
    </>
  );
}

export default Salesmen;
