import React, { useState } from "react";
import Container from "../components/container/Container";
import { useForm } from "react-hook-form";
import Input from "../components/Input.jsx";
import { useDispatch } from "react-redux";
import { useLogin } from "../auth/auth.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = useLogin();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const result = await loginUser({
        username: data.username,
        password: data.password,
      });

      if (result.success) {
        alert("Login successful");
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="items-center mt-5 mb-5">
        <h2 className=" text-center font-bold text-2xl  text-white font-Onest">Welcome back!</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-[#1f1f1f] font-Onest border-white shadow rounded-lg space-y-4">
        <h2 className="text-2xl font-Onest text-white font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="Enter username"
          {...register("username", { required: true })}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          {...register("password", { required: true })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#b9ff66] text-white py-2 px-4 rounded hover:bg-[#ff9b22] transition duration-200 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </Container>
  );
}

export default Login;
