import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import "./ChatPage.scss";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { display } from "@mui/system";
import moment from "moment";

function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState("");
  const [selectedImg, setSelectedImg] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [conversationId2, setConversationId2] = useState("");

  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState([]);

  const [friends, setFriends] = useState([]);
  console.log(message);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Code to be executed when the component mounts
    getfrds();
  }, []);

  const getfrds = async (e) => {
    let search = currentUser.id;
    let url = `http://localhost:8800/frds?id=${search}`;
    let response = await axios.get(url);
    let data = response.data;
    setFriends(data);
  };
  console.log(selectedFriend);

  const getmsg = async (conversationId, conversationId2) => {
    let url = `http://localhost:8800/msg?conversationId=${conversationId}&conversationId2=${conversationId2}`;
    let response = await axios.get(url);
    let data = response.data;
    setMsg(data);
  };
  console.log(msg);
  const handleMessageSend = async (e) => {
    e.preventDefault();
    let url = `http://localhost:8800/getmsg`;
    let data = {
      senderId: currentUser.id,
      recipientId: selectedId,
      conversationId: conversationId,
      message: message,
    };
    let response = await axios.post(url, data);
    setMessage("");
    getmsg(`${conversationId}`, `${conversationId2}`);
  };
  function handleButtonClick(friend) {
    setSelectedId(friend.id);
    const num1 = currentUser.id;
    console.log(num1);
    const num2 = friend.id;
    setConversationId(`${num1}${num2}`);
    setConversationId2(`${num2}${num1}`);
    setSelectedImg(friend.profilePic);

    setSelectedFriend(friend.name);

    getmsg(`${num1}${num2}`, `${num2}${num1}`);
  }
  let checkenter = (e) => {
    console.log("enter press");
    if (e.keyCode === 13) {
      handleMessageSend(e);
    }
  };
  return (
    <div className="containers">
      <div className="left-card">
        <Link className="link" to={"/"}>
          <span>
            <HomeOutlinedIcon />
          </span>
        </Link>
        <h2>Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              onClick={() => handleButtonClick(friend)}
              className={selectedFriend === friend.name ? "selected" : ""}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-card">
        <div className="header">
          {selectedImg ? (
            <img src={selectedImg} alt="Select from list" />
          ) : (
            <span>Select Friend to start</span>
          )}
          <h2>{selectedFriend}</h2>
        </div>
        <div className="body">
          {msg.map((message, index) => (
            <div
              key={index}
              className={
                message.senderId === currentUser.id
                  ? "message sent"
                  : "message "
              }
            >
              {message.message}
              <span style={{ fontSize: "10px", marginLeft: "20px" }}>
                {moment(message.createdAt).fromNow()}
              </span>
            </div>
          ))}
        </div>
        <div className="footer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={checkenter}
            placeholder={`Send a message to ${selectedFriend}`}
          />
          <button onClick={handleMessageSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
