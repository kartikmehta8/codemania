import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox for further instructions");
        } catch {
            setError("Failed to reset password");
        }
        setLoading(false);
    }

    return (
        <div className="centered">
            <div className="shadow-xl p-8" style={{ width: "300px" }}>
                {message && (
                    <div
                        className="bg-green-500 signUp-font text-white p-2 text-sm flex justify-center mb-4 rounded-sm"
                        style={{ textAlign: "center" }}
                    >
                        {message}
                    </div>
                )}
                {error && (
                    <div
                        className="bg-red-500 signUp-font text-white p-2 text-sm flex justify-center mb-4 rounded-sm"
                        style={{ textAlign: "center" }}
                    >
                        {error}
                    </div>
                )}
                <div className="flex justify-center text-2xl my-8 mb-0 signUp-font">
                    <span>C O D E M A N I A</span>
                </div>
                <div className="flex justify-center mb-4  signUp-font">
                    <span style={{ fontSize: "12px" }}>Online Compiler</span>
                </div>
                <form className="max-w-sm" onSubmit={handleSubmit}>
                    <div className="mb-4" id="email">
                        <label
                            className="block text-gray-600 text-sm font-bold mb-2 signUp-font"
                            htmlFor="password"
                        >
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border border-rounded h-12 w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline signUp-font"
                            type="email"
                            required
                            ref={emailRef}
                            placeholder="email"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full h-12 py-2 px-4  rounded focus:outline-none focus:shadow-outline signUp-font"
                            type="submit"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
                <div
                    className="flex justify-center mt-4 text-gray-800 signUp-font"
                    style={{ fontSize: "13px" }}
                >
                    <Link
                        className="font-bold text-blue-600 hover:text-blue-800"
                        to="/login"
                    >
                        Log In
                    </Link>
                </div>
                <div
                    className="flex justify-center mt-2 text-gray-800 signUp-font"
                    style={{ fontSize: "13px" }}
                >
                    Need an account?{" "}
                    <Link
                        className="font-bold text-blue-500 hover:text-blue-800"
                        to="/signup"
                    >
                        &nbsp;Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
