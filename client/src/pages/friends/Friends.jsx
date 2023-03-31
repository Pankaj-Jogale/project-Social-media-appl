import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./friends.scss";

const Friends = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(-1);
  const navigate = useNavigate();

  function handleRowMouseOver(key) {
    setHighlightedRowIndex(key);
  }

  function handleRowMouseOut() {
    setHighlightedRowIndex(-1);
  }
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Code to be executed when the component mounts
    getfrds();
  }, []);
  const getfrds = async (e) => {
    let search = currentUser.id;
    console.log("userid" + search);
    let url = `http://localhost:8800/frds?id=${search}`;
    let response = await axios.get(url);
    let data = response.data;
    console.log(data);
    setFriends(data);
  };

  function handleButtonClick(id) {
    console.log(`Clicked on friend with id ${id}`);
    navigate(`/profile/${id}`);
  }
  return (
    <div style={{ zIndex: 9999 }} className="frds">
      <table style={{ border: "none" }}>
        <thead
          style={{
            position: "sticky",
            top: "0px",
            height: "50px",
          }}
        >
          <tr>
            <th>
              <h3>UserName</h3>
            </th>
            <th>
              <h3>Name</h3>
            </th>
            <th>
              <h3>visit</h3>
            </th>
          </tr>
        </thead>
        <tbody style={{ paddingTop: "100px", zIndex: 1 }}>
          {friends.map((val, key) => {
            return (
              <tr
                key={key}
                style={{
                  backgroundColor: key === highlightedRowIndex ? "#90EE90" : "",
                  paddingTop: "100px",
                }}
                onMouseOver={() => handleRowMouseOver(key)}
                onMouseOut={handleRowMouseOut}
              >
                <td>{val.username}</td>
                <td>{val.name}</td>
                <td>
                  <button
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "5px",
                      width: "120px",
                      height: "40px",
                      padding: "10px 20px",
                      border: "2px solid black",
                      cursor: "pointer",
                    }}
                    onClick={() => handleButtonClick(val.id)}
                  >
                    View profile
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Friends;
