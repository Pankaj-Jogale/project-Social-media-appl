import axios from "axios";
import { useState } from "react";
import "./Adminhome.css";

const Adminhome = () => {
  let [frdsList, setfrdsList] = useState([]);
  window.onload = function (e) {
    getallfrds();
  };
  let getallfrds = async () => {
    let url = `http://localhost:8800/userslist`;
    let response = await axios.get(url);

    frdsList = [...response.data];
    console.log(frdsList);
    //re-render
    setfrdsList(frdsList);
  };
  console.log(frdsList);
  const getId = async (obj) => {
    console.log(obj);

    let data = {
      username: obj.username,
      email: obj.email,
      password: obj.password,
      name: obj.name,
      coverPic: obj.coverPic,
      profilePic: obj.profilePic,
      city: obj.city,
      website: obj.website,
    };
    let url = `http://localhost:8800/user`;
    let response = await axios.post(url, data);
    console.log(obj.id);
  };

  return (
    <div>
      <button onClick={getallfrds} className="btn">
        Get all users +
      </button>
      <table>
        <tr>
          <th>UserName</th>
          <th>Name</th>
          <th>Email</th>
          <th>City</th>
          <th>Action</th>
        </tr>
        {frdsList.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.username}</td>
              <td>{val.name}</td>
              <td>{val.email}</td>
              <td>{val.city}</td>
              <td>
                <button className="click" onClick={() => getId(val)}>
                  Block
                </button>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Adminhome;
