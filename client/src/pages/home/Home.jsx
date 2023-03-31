import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";

import "./home.scss";
import Share from "../../components/share/Share";
import { AuthContext } from "../../context/authContext";
import Cookies from "js-cookie";
import { useContext } from "react";
import axios from "axios";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  // const accessToken = Cookies.get("accessToken");
  let accessToken = true;
  if (accessToken) {
    axios
      .get(
        "http://localhost:8800/api/auth/check-auth",
        { withCredentials: true },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log("User is logged in");
      })
      .catch((error) => {
        console.log("User is not logged in");
      });
  } else {
    console.log("User is not logged in");
  }

  const userInfo = localStorage.getItem("user");
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
