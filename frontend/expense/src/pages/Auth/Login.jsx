import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!validateEmail(email)) {
            setError("please enter valid email address");
            return;
        }
        if(!password) {
            setError("please enter valid password");
            return;
        }
        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email: email.trim(), password: password,
            });
            const { token, user} = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updateUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else{
                setError("Something Went Wrong.")
            }
        }
    }
        return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please enter your credentials to access your account.
                </p>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        name="email"
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        label="Email"
                        placeholder="Email@example.com"
                        type="text"
                        
                    />
                    <Input
                        name="password"
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
                    <button type="submit" className="btn-primary">LOGIN</button>
                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't have an account?{" "}
                        <Link to="/SignUp" className="text-primary font-mediun underline">SignUp</Link>
                    </p>   
                </form>
            </div>
        </AuthLayout>
    );
}
 
export default Login;
