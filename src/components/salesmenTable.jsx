import { useEffect, useState } from "react";

function SalesmenTable() {
  const [salesmen, setSalesmen] = useState([]);
  useEffect(() => {
    async function run() {
      const result = await window.api.logs("getAllSalesmen", 100000);
      setSalesmen(result);
    }
    run();
  }, []);

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">S. No.</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
          </tr>
        </thead>
        <tbody>
          {salesmen.map((men, index) => (
            <tr key={index}>
              <td scope="col">{index + 1}</td>
              <td scope="col">{men.name}</td>
              <td scope="col">{men.phn_no}</td>
              <td scope="col">{men.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default SalesmenTable;
