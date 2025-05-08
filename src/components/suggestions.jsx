function Suggestions({ values, callback }) {
  return (
    <>
      <ul className="suggestions-list">
        {values.map((value, index) => (
          <li key={index} onClick={() => callback(value)}>
            {value.name}
            {!value.address && `(${value?.product_quantity} ${value?.measuring_unit})`}
          </li>
        ))}
      </ul>
    </>
  );
}
export default Suggestions;
