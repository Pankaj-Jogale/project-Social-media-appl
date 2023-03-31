import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

//
const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  let [output, setOutput] = useState([]);
  let [info, setInfo] = useState([]);

  let userId = currentUser.id;

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );
  useEffect(() => {}, [data]);
  const [searchOpen, setsearchOpen] = useState(false);

  const navigate = useNavigate();
  const [err, setErr] = useState(null);

  const handleLogout = async (e) => {
    // const res = await axios.post("http://localhost:8800/api/auth/logout");
    // console.log(res.status);
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:8800/api/auth/logout",
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (err) {
      setErr(err.response.data);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
    handleSubmit();
    setsearchOpen(true);
  };
  const handleInputBlur = (e) => {
    const searchResultsContainer = document.querySelector(".list");
    if (searchResultsContainer.contains(e.target)) {
      // Click came from within the search results, don't close the search bar
      return;
    }
    setsearchOpen(false);
    setSearch("");
    setOutput([]);
  };
  function handleResultClick(result) {
    console.log("called");
    console.log(result.id);

    navigate(`/profile/${result.id}`);
    console.log(result.name); // Perform any other actions needed
    // setsearchOpen(false); // Hide search results
    setSearch(""); // Clear search input
    setOutput([]); // Clear search results
  }
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // to prevent default form submission
    }
    if (search.length < 2) {
      return; // Exit the function without making an API call
    }

    let url = `http://localhost:8800/users?name=${search}`;
    let response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      // If we have data, set the output state to the data
      setOutput([...response.data]);
    } else {
      // If we don't have data, set the output state to an empty array
      setOutput([]);
    }
    // output = [...response.data];
    console.log(output);
    // //re-render
    // setOutput(output);
  };
  // console.log(searchOpen);
  // console.log(search);
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Social_Media</span>
        </Link>

        <HomeOutlinedIcon />

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search" onBlur={handleInputBlur}>
          <input
            type="text"
            placeholder="Start Typing to Search a friend"
            onChange={handleChange}
            onClick={() => setsearchOpen(true)}
            value={search}
          />
          <SearchOutlinedIcon
            onClick={handleSubmit}
            style={{ cursor: "pointer" }}
          />
          {searchOpen && (
            <div className="list">
              {/*onChange = { handleChange }*/}
              {output.map((item) => (
                <div key={item.id}>
                  <button onMouseDown={() => handleResultClick(item)}>
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <LogoutOutlinedIcon
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
        <PersonOutlineOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsNoneOutlinedIcon />
        <div className="user">
          <img src={currentUser.profilePic || data.profilePic} alt="" />
          <span>{currentUser.name || data.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
