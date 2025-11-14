import React, { useState } from "react";
import Container from "../components/container/Container";
import { useForm } from "react-hook-form";
import Input from "../components/Input.jsx";
import { useDispatch } from "react-redux";
import { useLogin } from "../auth/auth.js";
import { useNavigate , Link } from "react-router-dom";

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
        navigate("/home");
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
     <div className="justify-center align-center">
       <form   onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full mt-20 mx-auto p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg space-y-6">

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
         <p className="text-center text-sm text-white">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-[#ff9b22] hover:underline">
            Sign Up!
          </Link>
        </p>
      </form>
      </div>
    </Container>

  );
}

export default Login;
