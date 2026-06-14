import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { serverUrl } from '../main'
import { toast } from 'react-toastify'

const LoginPage = () => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/login`, { email, password })
            localStorage.setItem("email", email)
            toast.success(data.message)
        } catch (error) {
            console.log(error.response?.data);
  console.log(error.response?.status);
            const errors = error.response?.data?.errors;

            if (errors && errors.length > 0) {
                toast.error(errors[0].message);
            } else {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

                {/* Left Side */}
                <div className="hidden md:flex bg-indigo-600 text-white p-10 flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Login
                    </h1>
                    <p className="text-indigo-100">
                        get start by login your id
                    </p>
                </div>

                {/* Right Side */}
                <div className="p-6 sm:p-8 md:p-10">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Fill in your details to get started.
                        </p>

                        <form onSubmit={handleLogin} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
                            >
login to                            </button>
                        </form>

                        <p className="text-center text-gray-500 mt-6">
                            Don't have an account?{" "}
                            <Link
                                to="/registration"
                                className="text-indigo-600 font-medium hover:underline"
                            >
                                Create now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage