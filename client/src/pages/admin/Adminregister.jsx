import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Adminregister = () => {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const [err, setErr] = useState(null);

  const createnewusr = async (e) => {
    e.preventDefault();

    let data = {
      adminname: name,
      password: pass,
    };
    try {
      await axios.post("http://localhost:8800/api/admin/register", data);
    } catch (err) {
      setErr(err.response.data);
    }
  };
  console.log(err);
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Hello Admin.</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
            inventore illum sint eius, tenetur voluptatem quibusdam. Sit dicta
            aliquid vitae laboriosam, aperiam quod iusto recusandae, debitis
            tempore repellendus fugiat! Molestias!
          </p>
          <span>Already have an Admin Account?</span>
          <Link to="/admin">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Admin Register</h1>
          <form>
            <input
              type="text"
              placeholder="Admin Name"
              name="username"
              onChange={(e) => setName(e.target.value)}
            />
            {/* <input
              type="password"
              placeholder="Admin Key"
              name="name"
              onChange={handleChange}
            /> */}
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPass(e.target.value)}
            />
            {err && err}
            <button onClick={createnewusr}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Adminregister;
