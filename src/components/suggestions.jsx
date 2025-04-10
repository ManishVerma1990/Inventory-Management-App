import { useState } from "react";

function Suggestions({ values, callback }) {
  return (
    <>
      <ul className="suggestions-list">
        {values.map((value, index) => (
          <li key={index} onClick={() => callback(value)}>
            {value.name} {"("}
            {value.product_quantity}
            {value.measuring_unit}
            {")"}
          </li>
        ))}
      </ul>
    </>
  );
}
export default Suggestions;
