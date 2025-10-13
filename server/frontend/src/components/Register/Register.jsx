import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const gohome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();

    const register_url = window.location.origin + "/djangoapp/register";

    try {
      const res = await fetch(register_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
          firstName,
          lastName,
          email,
        }),
      });

      const json = await res.json();

      if (json.status === "Authenticated") {
        sessionStorage.setItem("username", json.userName);
        window.location.href = window.location.origin;
      } else if (json.error === "Already Registered") {
        alert("This username is already registered. Try another one.");
      } else {
        alert("Registration failed, please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className="register_container" style={{ width: "50%" }}>
      <div
        className="header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span className="text">SignUp</span>
        <button
          onClick={gohome}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <img style={{ width: "1cm" }} src={close_icon} alt="Close" />
        </button>
      </div>
      <hr />

      <form onSubmit={register}>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="Username" className="img_icon" />
            <input
              type="text"
              placeholder="Username"
              className="input_field"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img src={user_icon} alt="First Name" className="img_icon" />
            <input
              type="text"
              placeholder="First Name"
              className="input_field"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img src={user_icon} alt="Last Name" className="img_icon" />
            <input
              type="text"
              placeholder="Last Name"
              className="input_field"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img src={email_icon} alt="Email" className="img_icon" />
            <input
              type="email"
              placeholder="Email"
              className="input_field"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img src={password_icon} alt="Password" className="img_icon" />
            <input
              type="password"
              placeholder="Password"
              className="input_field"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="submit_panel">
          <input className="submit" type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;
