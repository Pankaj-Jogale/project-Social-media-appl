import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import "./stories.scss";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  let [output, setOutput] = useState([]);
  let [info, setInfo] = useState([]);

  useEffect(() => {
    if (storyImage) {
      handleSubmit();
    }
    // Code to be executed when the component mounts
    getfrds();
  }, []);
  const getfrds = async (e) => {
    let search = currentUser.id;
    let url = `http://localhost:8800/stories?id=${search}`;
    let response = await axios.get(url);
    setOutput(response.data);
  };

  const fileInputRef = useRef(null);
  const [storyImage, setStoryImage] = useState(null);
  let userId = currentUser.id;
  // const { isLoading, error, data } = useQuery(["user"], () =>
  //   makeRequest.get("/users/find/" + userId).then((res) => {
  //     setInfo(data);
  //     return res.data;
  //   })
  // );
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("storyImage", storyImage);

    try {
      await axios.post("http://localhost:8800/api/stories", formData);
      console.log("Story uploaded successfully!");
      // reset the form after a successful upload
      setStoryImage(null);
      getfrds();
    } catch (error) {
      console.error(error);
    }
  };
  const handleFileSelect = (e) => {
    setStoryImage(e.target.files[0]);
  };
  //these is ref to next changes

  const [response, setResponse] = useState("");
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="stories">
      <div
        className="story"
        style={{
          position: "sticky",
          left: "0",
          zIndex: 1,
        }}
      >
        <img src={currentUser.profilePic} alt="" className="img1" />
        <span>{currentUser.name}</span>
        {/* <form onSubmit={handleSubmit} className="button1">
          <input type="file" onChange={handleFileSelect} accept="image/*" />

          <button type="submit" disabled={!storyImage}>
            +
          </button>
        </form> */}
      </div>
      {output.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt={`Story by ${story.name}`} />
          <span>{story.name}</span>
        </div>
      ))}

      {/* <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileSelect} accept="image/*" />
        <button type="submit" disabled={!storyImage}>
          Upload Story
        </button>
      </form> */}
    </div>
  );
};

export default Stories;
