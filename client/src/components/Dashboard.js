import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
import VideoList from "./VideoList.js";
import youtube from "../api/Youtube";
import { createClient } from "@supabase/supabase-js";

export default function Dashboard() {
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState("");
    const [jobId, setJobId] = useState("");
    const [comment, setComment] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [videos, setVideos] = useState([]);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const supabaseUrl = "https://ucketzzcxwsytdeaslgn.supabase.co";
    const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const handleSubmit = async () => {
        const payload = {
            language,
            code,
        };

        try {
            setJobId("");
            setStatus("");
            setOutput("");

            const { data } = await axios.post(
                "http://localhost:5000/run",
                payload
            );
            setJobId(data.jobId);

            let intervalId;

            intervalId = setInterval(async () => {
                const { data: dataResult } = await axios.get(
                    "http://localhost:5000/status",
                    {
                        params: {
                            id: data.jobId,
                        },
                    }
                );

                const { success, job, error } = dataResult;

                if (success) {
                    const { status: jobStatus, output: jobOutput } = job;
                    setStatus(jobStatus);

                    if (jobStatus === "pending") return;
                    if (jobStatus === "success" || jobStatus === "error") {
                        const { error } = await supabase
                            .from("language")
                            .insert({
                                email: currentUser.email.toString(),
                                language: language,
                            });

                        if (error) console.log(error.message);
                    }

                    try {
                        if (JSON.parse(jobOutput).stderr)
                            setOutput(
                                JSON.stringify(JSON.parse(jobOutput).stderr)
                            );
                        else {
                            setOutput(jobOutput);
                        }
                    } catch (err) {
                        setOutput(jobOutput);
                    }

                    clearInterval(intervalId);
                } else {
                    setStatus("error");
                    setOutput(error);
                    clearInterval(intervalId);
                }
            }, 1000);
        } catch ({ response }) {
            if (response) {
                setOutput(response.data.err.stderr);
            } else {
                setOutput("Error connecting to server!");
            }
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        let postData = { data: comment };
        axios
            .post("http://localhost:5000/openai", postData)
            .then((response) => {
                setCode(JSON.stringify(response.data.text));
            })
            .catch((err) => {
                console.log(err);
            });

        youtube
            .get("search", {
                params: {
                    part: "snippet",
                    maxResults: 4,
                    key: "AIzaSyATmysvvtJYrj_nNdxVhh_pn8rxfTyJZ3Q",
                    q: comment,
                },
            })
            .then((result) => {
                setVideos(result.data.items);
            });

        const { error } = await supabase
            .from("comment")
            .insert({ email: currentUser.email.toString(), comment: comment });

        if (error) console.log(error.message);
    };

    async function handleLogout() {
        setError("");

        try {
            navigate("/login");
            await logout();
        } catch {
            setError("Failed to Log Out");
        }
    }

    return (
        <div>
            {error && <div>{error}</div>}
            <div className="flex justify-between py-4 px-6">
                <div className="font-bold signUp-font">
                    <span>C O D E M A N I A</span>
                </div>
                <div className="poppins flex">
                    <div className="mr-4 hide">{currentUser.email}</div>
                    <button
                        variant="link"
                        onClick={handleLogout}
                        className="hover:text-red-500 text-sm border-b hover:border-red-500 border-black"
                    >
                        Sign Off
                    </button>
                </div>
            </div>
            <div className="flex justify-between p-4 signUp-font">
                <div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="border border-black"
                    >
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="py">Python</option>
                    </select>
                </div>
                <div>
                    <div className="flex">
                        <form
                            onSubmit={handleSubmitComment}
                            className="flex justify-center"
                        >
                            <input
                                style={{ maxWidth: "550px" }}
                                className="border appearance-none border border-black w-full text-grey-darker leading-tight focus:outline-none focus:shadow-outline signUp-font pl-2"
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Comment"
                            />

                            <button
                                className="bg-blue-500 border-l-0 hover:bg-white hover:text-black border-black border text-white text-sm p-1 focus:outline-none focus:shadow-outline poppins"
                                type="submit"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 p-4 pb-0 gap-4"
                    style={{ minHeight: "550px" }}
                >
                    <CodeEditor
                        // eslint-disable-next-line no-eval
                        value={eval("`" + code + "`")}
                        language={language}
                        placeholder={`${
                            language === "py"
                                ? "# Python"
                                : language === "cpp"
                                ? "// C++"
                                : "// C"
                        } Code`}
                        onChange={(evn) => setCode(evn.target.value)}
                        padding={15}
                        style={{
                            fontSize: 15,
                            fontFamily: "Carme, sans-serif",
                        }}
                    />
                    <div style={{ backgroundColor: "#10131B" }}>
                        <div
                            className={`flex text-white signUp-font justify-center ${
                                status === "success"
                                    ? "bg-green-600"
                                    : status === "error"
                                    ? "bg-red-500"
                                    : status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                            }`}
                        >
                            <div>
                                {status === ""
                                    ? "Status"
                                    : status === "success"
                                    ? "Success"
                                    : status === "pending"
                                    ? "Pending"
                                    : "Error"}
                            </div>
                        </div>
                        <div className="text-white text-md px-4 py-2 poppins">
                            <div>{output === "" ? "Output" : output}</div>
                        </div>
                        <br />
                    </div>
                </div>
                <div className="flex poppins text-md mx-4 justify-between">
                    <button
                        onClick={handleSubmit}
                        className="hover:bg-green-600 text-white bg-blue-500 py-1 px-4"
                    >
                        Evaluate
                    </button>
                    <div
                        className={`text-white text-sm py-1 px-4 ${
                            jobId === "" ? "" : "editor"
                        }`}
                    >
                        {`Job #${jobId.slice(0, 7)}`}
                    </div>
                </div>
            </div>
            <div>
                {videos.length !== 0 ? (
                    <div className="pb-4">
                        <div className="flex justify-start poppins text-xl mt-8 pb-4 font-bold mx-4">
                            Suggested Videos
                        </div>
                        <div className="mx-6 flex justify-center">
                            <VideoList videos={videos} />
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center my-4 text-gray-600 pt-4 signUp-font text-sm">
                        Search videos will appear here.
                    </div>
                )}
            </div>
            <div className="flex justify-between p-4">
                <span className=" font-bold signUp-font">
                    <Link to="/analytics">Show Analytics</Link>
                </span>
                <span>
                    Copyright @
                    <a
                        href="https://github.com/kartikmehta8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-t-0 border-l-0 border-r-0 hover:text-blue-500 hover:border-blue-500 border-black"
                    >
                        kartikmehta8
                    </a>
                </span>
            </div>
        </div>
    );
}
