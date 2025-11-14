import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signUp , useLogin } from "../auth/auth"; // using your existing signUp function
import Container from "../components/container/Container.jsx"; // assuming you have this
import Input from "../components/Input"; 

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loginUser= useLogin()

 
  const onSubmit= async(data)=>{
    try {
      setLoading(true)
      setError("")
      const registerResponse= await signUp(data)
      console.log("registerResponse" , registerResponse)
      if(registerResponse.success){
       const loginResponse = await loginUser({
        username: registerResponse.data.username,
        password: data.password,
      });

      if(loginResponse.success){
        navigate("/home")
      }
      else{
        setError("There was an error logging into your new account")
      }
      }
      else{
        setError(registerResponse.message)
      }
      
    } catch (error) {
      setError(error.message || "something went wrong creating your account")
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <Container>
      <div className="items-center mt-5 mb-5">
        <h2 className=" text-center font-bold text-2xl text-white font-Onest">
          Join the community!
        </h2>
      </div>

      <form   onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full  mx-auto p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg space-y-6">

        <h2 className="text-2xl font-Onest text-white font-bold text-center">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="Enter username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className="text-red-500 text-xs">Username is required</p>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">Email is required</p>
        )}

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">
            Password is required 
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#b9ff66] text-white py-2 px-4 rounded hover:bg-[#ff9b22] transition duration-200 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-[#b9ff66] hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </Container>
  );
};

export default SignUp;
