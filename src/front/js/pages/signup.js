import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Title } from "../component/title";
import { ConfirmationButton } from "../component/confirmationButton";
import logo from "../../img/logo.jpg";

export const Signup = () => {
  const { actions } = useContext(Context);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { success} = await actions.login(userName, password);

    if (success) {
      setMessage("");
      setMessageType("success"); 
      setTimeout(() => {
        if (role === "ADMIN") {
          window.location.href = `${process.env.BACKEND_URL}/admin/`;
        } else {
          navigate("/");
        }
      }, 50);
    } else {
      setMessage("Incorrect username or password");
      setMessageType("error"); 
    }
  };

  return (
    <div className="form-signin w-100 m-auto mt-5 pt-5">
      <form>
         <Title title="Please sign up" />
        
        {message && (
          <p
            style={{
              color: messageType === "success" ? "green" : "red", 
            }}
          >
            {message}
          </p>
        )}

        <div className="form-floating mt-5">
          <input
            type="text"
            className="form-control"
            id="floatingInput1"
            placeholder="name@example.com"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <ConfirmationButton
          text="Sign in" 
          buttonClass="btn w-100 py-2 text-white"
          onClick={handleLogin} 
        />
        <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
      </form>
    </div>
  );
};
