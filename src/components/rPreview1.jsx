function RPreview1({ data = [], from, to }) {
  console.log(data);
  if (data.length < 1) return <></>;
  let columns = [];
  const arrange1 = (arr) => {
    return [arr[2], arr[0], arr[3], arr[1]];
  };
  const arrange2 = (arr) => {
    return [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]];
  };
  const arrange3 = (arr) => {
    return [arr[0], arr[1], arr[2]];
  };
  const arrange4 = (arr) => {
    return [arr[1], arr[2], arr[3], `\u20B9${arr[4]}`];
  };

  let arrange = arrange1;
  if (Object.keys(data[0]).length === 6) arrange = arrange2;
  if (Object.keys(data[0]).length === 3) arrange = arrange3;
  if (Object.keys(data[0]).length === 5) arrange = arrange4;

  columns = arrange(Object.keys(data[0]));
  return (
    <>
      <div className="mb-3 ">
        Date: {from} to {to}{" "}
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>S. No.</th>
            {columns.map((value, index) => (
              <th key={index}>{value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            row = arrange(Object.values(row));
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                {row.map((value, index2) => (
                  <td key={index2}>{value}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default RPreview1;
