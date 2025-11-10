import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ label, value, onChange, placeholder, type = 'text', error }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
  return (
    <div>
        <label htmlFor="text-[13pa] text-slate-800">{label}</label>

        <div className='input-box'>
            <input type={type == 'password' ? (showPassword ? 'text' : 'password') : type} 
            value={value}
            className='w-full bg-transparent outline-none'
            onChange={(e) => onChange(e)} 
            placeholder={placeholder} />

            {type == 'password' && (
                <>
                {showPassword ? (<FaRegEye
                size={22}
                className='text-primary cursor-pointer' 
                onClick={toggleShowPassword} />) : 
                (<FaRegEyeSlash
                size={22}
                className='text-primary cursor-pointer' 
                onClick={toggleShowPassword} />)}
                </>
            )}
        </div>
    </div>
  );
};

export default Input;