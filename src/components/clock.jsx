function Clock() {
  const setDoubleDigits = (digit) => {
    return digit >= 10 && digit <= 99 ? digit : `0${digit}`;
  };

  // dynamically change the time, setTimeout, because element needs to be rendered first
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  setTimeout(() => {
    setInterval(() => {
      let currTime = new Date();
      document.getElementById("hours").innerHTML = setDoubleDigits(currTime.getHours());
      document.getElementById("minutes").innerHTML = setDoubleDigits(currTime.getMinutes());
      document.getElementById("date").innerHTML = currTime.getDate();
      document.getElementById("month").innerHTML = monthNames[currTime.getMonth()];
      document.getElementById("year").innerHTML = currTime.getFullYear();
    }, 1000);
  }, 1);
  return (
    <div className="clock" style={{ marginRight: "9rem" }}>
      <span className="fullDate">
        <span id="date"></span>-<span id="month"></span>-<span id="year"></span>{" "}
      </span>
      <span className="time">
        {" "}
        <span id="hours"></span> : <span id="minutes"></span>
      </span>
    </div>
  );
}
export default Clock;
