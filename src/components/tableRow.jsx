function TableRow(props) {
  console.log(props.product);
  return (
    <>
      <tr
        className="accordion-header"
        id={`heading${props.id}`}
        data-bs-toggle="collapse"
        data-bs-target={`#collapse${props.id}`}
        aria-expanded="false"
        aria-controls={`collapse${props.id}`}
        style={{ cursor: "pointer" }}
      >
        <th scope="row">{props.serialNumber}</th>
        <td>{props.product.name}</td>
        <td>
          {props.product.product_quantity} {props.product.measuring_unit}{" "}
        </td>
        <td>{props.product.selling_price}</td>
        <td>{props.product.stock_quantity}</td>
        <td>{props.product.tax}</td>
      </tr>

      <tr>
        <td colspan="6" className="p-0">
          <div
            id={`collapse${props.id}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${props.id}`}
            data-bs-parent="#accordionTable"
          >
            <div className="accordion-body">
              <strong>Description:</strong> {props.product.description}
              <br />
              <strong>Category:</strong> {props.product.description}
              <br />
              <strong>Stock:</strong> 24 items
              <br />
              <br />
              <div className="row justify-content-md-center">
                <div className="col col-3">
                  <button style={{ width: "100%" }} className="btn btn-success col  col-3 ">
                    sell
                  </button>
                </div>
                <div className="col col-3">
                  <button style={{ width: "100%" }} className="btn btn-outline-success col  col-3 ">
                    restock
                  </button>
                </div>
                <div className="col col-3">
                  <button style={{ width: "100%" }} className="btn btn-warning col col-3 ">
                    update
                  </button>
                </div>
                <div className="col col-3">
                  <button style={{ width: "100%" }} className="btn btn-danger col  col-3 ">
                    delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
export default TableRow;
