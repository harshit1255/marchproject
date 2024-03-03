import { useState } from "react";
import "./App.css";

let global = [];
function App() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [office, setOffice] = useState([]);
  const [error, setError] = useState(null); // New state for handling errors

  async function pincodeFetch(pin) {
    try {
      setLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      if (!data[0]?.PostOffice) {
        alert("no records found");
      } else {
        setResult(true);
        setOffice(data[0].PostOffice);
        global = data[0].PostOffice;
      }
    } catch (error) {
      setError(error.message); // Update error state if an error occurs
    } finally {
      setLoading(false);
    }
  }

  function onSearch(e) {
    setSearch(e.target.value);
    const newArray = global.filter((item) => {
      const { Name } = item;
      return Name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setOffice(newArray);
  }

  function submitFunction(e) {
    e.preventDefault();
    if (e.target.pincode.value.length !== 6) {
      alert("Pincode must be of length 6");
    } else {
      pincodeFetch(e.target.pincode.value);
    }
  }

  if (!result) {
    return (
      <>
        <h1>Enter Pincode</h1>
        <form onSubmit={(e) => submitFunction(e)}>
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
  } else {
    if (loading) {
      return <h1>Loading...</h1>;
    } else if (error) {
      return <div>Error: {error}</div>; // Display error message if there's an error
    } else {
      return (
        <>
          <h1>Pincode {pin}</h1>
          <h3>Number Of Pincodes: {office.length}</h3>
          <input
            type="text"
            name="search"
            value={search}
            onChange={onSearch}
          ></input>
          <div id="cards">
            {office.map((value, index) => {
              const { Name, BranchType, DeliveryStatus, District, State } = value;
              return (
                <div className="card" key={index}>
                  <h4>Name: {Name}</h4>
                  <h4>Branch type: {BranchType}</h4>
                  <h4>Delivery Status: {DeliveryStatus}</h4>
                  <h4>District: {District}</h4>
                  <h4>State: {State}</h4>
                </div>
              );
            })}
          </div>
        </>
      );
    }
  }
}

export default App;

