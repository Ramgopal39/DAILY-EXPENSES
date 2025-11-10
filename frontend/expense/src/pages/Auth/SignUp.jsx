import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import { API_PATHS } from "../../utils/apiPaths";

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);

    const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = ""; // Initialize with empty string

    if (!fullName) {
        setError("Please enter full name");
        return;
    }
    if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
    }
    if (!password) {
        setError("Please enter a valid password");
        return;
    }
    setError("");

    try {
        // Upload image if present
        if (profilePic) {
            try {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError);
                setError("Failed to upload profile picture. Please try again.");
                return;
            }
        }

        // SignUp API Call
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            fullName,
            email,
            password,
            profileImage: profileImageUrl, // Ensure this matches the backend's expected field name
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            updateUser(response.data.user || response.data);
            navigate("/dashboard");
        }
    } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        
        if (error.response?.data?.message === 'User already exists') {
            setError("An account with this email already exists. Please use a different email or log in instead.");
        } else {
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    }
};

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xs text-slate-700 mt-[5px] mb:6">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your credentials to create an account.</p>
                
                <form onSubmit={handleSignUp}>

                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                        value={fullName}
                        onChange={({target}) => setFullName(target.value)}
                        label="Full Name"
                        placeholder="Enter your full name"
                        type="text"
                        />
                        <Input 
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        />
                        <div className="col-span-2">
                        <Input 
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
                        <button type="submit" className="btn-primary">SIGN UP</button>
                    
                        <p className="text-[13px] text-slate-800 mt-3">
                        Already have an account?{" "}
                        <Link to="/Login" className="text-primary font-mediun underline">Login</Link>
                        </p>  
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp;