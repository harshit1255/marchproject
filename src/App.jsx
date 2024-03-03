import { useState } from "react";
import "./App.css";

let global = [];
function App() {
  let [pin, setPin] = useState("");
  let [result, setResult] = useState(false);
  let [loading, setLoading] = useState(true);
  let [search, setSearch] = useState("");
  let [office, setOffice] = useState([]);
  async function pincodeFetch(pin) {
    let res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    let data = await res.json();
    if (!data[0]?.PostOffice) {
      alert("no records found");
    } else {
      setResult(true);
      setLoading(false);
      setOffice(data[0].PostOffice);
      global = data[0].PostOffice;
    }
  }
  function onsearch(e) {
    setSearch(e.target.value);
    let newArray = global.filter((item) => {
      let { Name, BranchType, DeliveryStatus, District, State } = item;
      if (Name.toLowerCase().includes(e.target.value.toLowerCase())) // searching for matching name
        return true;
      else return false;
    });
    setOffice(newArray);
  }

  function sumbitFuntion(e) {
    e.preventDefault();
    if (e.target.pincode.value.length !== 6)
      alert("Pincode must be of length 6");
    else {
      pincodeFetch(e.target.pincode.value);
    }
  }
  if (!result)
    return (
      <>
        <h1>Enter Pincode</h1>
        <form onSubmit={(e) => sumbitFuntion(e)}>
          <input
            type="number"
            placeholder="pincode"
            name="pincode"
            onChange={(e) => setPin(e.target.value)}
          ></input>
          <button>Submit</button>
        </form>
      </>
    );
  else {
    if (loading) return <h1>....loading</h1>;
    else
      return (
        <>
          <h1>pincode {pin}</h1>
          <h3>Number Of Pincodes: {global.length}</h3>
          <input
            type="text"
            name="search"
            value={search}
            onChange={onsearch}
          ></input>
          <div id="cards">
            {office.map((value, index) => {
              let { Name, BranchType, DeliveryStatus, District, State } = value;
              return (
                <div className="card" key={index}>
                  <h4>Name :{Name}</h4>
                  <h4>branch type :{BranchType}</h4>
                  <h4>Delivery Status :{DeliveryStatus}</h4>
                  <h4>District: {District}</h4>
                  <h4>state :{State}</h4>
                </div>
              );
            })}
          </div>
        </>
      );
  }
}

export default App;
