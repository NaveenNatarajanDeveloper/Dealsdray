import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });

  const { username, password } = loginData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = "";
    if (name === "username" && !value.trim()) {
      errorMessage = "Username is required";
    } else if (name === "password" && value.length < 6) {
      errorMessage = "Password should have 6 characters or more";
    }

    setErrors({
      ...errors,
      [name]: errorMessage
    });

    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let formValid = true;
    let newErrors = { ...errors };

    Object.entries(loginData).forEach(([fieldName, value]) => {
      if (!value.trim()) {
        newErrors[fieldName] = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
        formValid = false;
      }
    });

    setErrors(newErrors);

    if (formValid) {
      try {
        const response = await axios.post('http://localhost:9121/login', loginData);
        if (response.data.success) {
          
          localStorage.setItem('username', loginData.username);
          toast.success("Login successful!");
          navigate('/Dashboard');
        } else {
          toast.error("Invalid credentials");
        }
      } catch (error) {
        console.error('Error logging in:', error);
        toast.error("Error logging in");
      }
    } else {
      console.log("Form is not valid");
      toast.error("Form is not valid");
    }
  };

  return (
    <div className="container mt-5 login-container">
      <div className="image-container">
        <img src="https://i.ibb.co/Wt76X0h/1612001679145.jpg" alt="Login Image" />
      </div>
      <h1 className="text-center mb-4">Login</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            className={`form-control ${errors.username && "is-invalid"}`}
          />
          {errors.username && (
            <div className="invalid-feedback error-message">{errors.username}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className={`form-control ${errors.password && "is-invalid"}`}
          />
          {errors.password && (
            <div className="invalid-feedback error-message">{errors.password}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
