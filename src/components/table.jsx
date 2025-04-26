import TableRow from "./tableRow";

function Table({ data }) {
  return (
    <>
      <div className="accordion" id="accordionTable">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">S. No.</th>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">InStock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <TableRow key={index} id={index} product={product} serialNumber={index + 1} />
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="accordion" id="accordionTable">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              className="accordion-header"
              id="headingOne"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
              style={{ cursor: "pointer" }}
            >
              <td>1</td>
              <td>Product A</td>
              <td>₹100</td>
              <td>Click to Expand</td>
            </tr>
            <tr>
              <td colspan="4" className="p-0">
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionTable"
                >
                  <div className="accordion-body">
                    <strong>Description:</strong> This is a great product.
                    <br />
                    <strong>Category:</strong> Electronics
                    <br />
                    <strong>Stock:</strong> 24 items
                  </div>
                </div>
              </td>
            </tr>

            <tr
              className="accordion-header"
              id="headingTwo"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
              style={{ cursor: "pointer" }}
            >
              <td>2</td>
              <td>Product B</td>
              <td>₹200</td>
              <td>Click to Expand</td>
            </tr>
            <tr>
              <td colspan="4" className="p-0">
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionTable"
                >
                  <div className="accordion-body">
                    <strong>Description:</strong> Another fantastic item.
                    <br />
                    <strong>Category:</strong> Clothing
                    <br />
                    <strong>Stock:</strong> 10 items
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </>
  );
}

export default Table;
