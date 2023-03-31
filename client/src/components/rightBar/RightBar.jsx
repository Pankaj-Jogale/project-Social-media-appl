import "./rightBar.scss";
import { AuthContext } from "../../context/authContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { display } from "@mui/system";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

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
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/3228732/pexels-photo-3228732.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>User name</span>
            </div>
            <div className="buttons">
              <button>Follow</button>
              <button>Dismiss</button>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/3228732/pexels-photo-3228732.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>User name</span>
            </div>
            <div className="buttons">
              <button>Follow</button>
              <button>Dismiss</button>
            </div>
          </div>
        </div>
        <div className="item">
          <span>Latest Acivity</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/3228732/pexels-photo-3228732.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>User name</span> Changed profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/3228732/pexels-photo-3228732.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>User name</span> Changed profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/3228732/pexels-photo-3228732.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>User name</span> Changed profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="item">
          <span>Friends List</span>
          {/* <button onClick={getfrds}>+</button> */}
          <div className="user1">
            {friends.map((val, key) => (
              <div className="userInfo" key={key}>
                <img src={val.profilePic} alt="" />
                <div className="online" />
                <span>
                  <td>{val.name}</td>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
