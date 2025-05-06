import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Stats({ title, req, color, currency, to }) {
  const [result, setResult] = useState(0);
  useEffect(() => {
    async function run() {
      const data = await window.api.fetch(req);
      if (data != null) setResult(data);
      else setResult(0);
    }
    run();
  }, []);

  return (
    <div className="card shadow mb-3" style={{ width: "100%", minWidth: "150px", cursor: "pointer" }}>
      <NavLink to={to} style={{ all: "unset" }}>
        <div className="card-title" style={{ fontWeight: "350", opacity: "0.8", fontSize: "1.2rem" }}>
          {title}
        </div>
        <h3 className="card-text mb-3" style={{ color: `${color ? color : "black"}` }}>
          {currency ? <>&#x20B9; {result}</> : result}
        </h3>
      </NavLink>
    </div>
  );
}
export default Stats;
