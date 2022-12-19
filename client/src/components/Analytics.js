import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Card, BarChart, Subtitle } from "@tremor/react";
import "@tremor/react/dist/esm/tremor.css";

export default function Analytics() {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState("");
    const [comments, setComments] = useState();

    const [countPy, setCountPy] = useState(0);
    const [countC, setCountC] = useState(0);
    const [countCpp, setCountCpp] = useState(0);
    const navigate = useNavigate();

    const chartdata = [
        {
            name: "Language",
            Python: countPy,
            C: countC,
            "C++": countCpp,
        },
    ];

    const dataFormatter = (number) => {
        return " " + Intl.NumberFormat("us").format(number).toString();
    };

    const supabaseUrl = "https://ucketzzcxwsytdeaslgn.supabase.co";
    const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comment")
            .select()
            .eq("email", currentUser.email);
        if (data) setComments(data);
        if (error) {
            console.log(error);
            return;
        }
    };

    const fetchPy = async () => {
        const { data, error } = await supabase
            .from("language")
            .select()
            .eq("email", currentUser.email)
            .eq("language", "py");
        if (data) setCountPy(data.length);
        if (error) {
            console.log(error);
        }
    };

    const fetchC = async () => {
        const { data, error } = await supabase
            .from("language")
            .select()
            .eq("email", currentUser.email)
            .eq("language", "c");
        if (data) setCountC(data.length);
        if (error) {
            console.log(error);
        }
    };

    const fetchCpp = async () => {
        const { data, error } = await supabase
            .from("language")
            .select()
            .eq("email", currentUser.email)
            .eq("language", "cpp");
        if (data) setCountCpp(data.length);
        if (error) {
            console.log(error);
        }
    };

    if (!currentUser) {
        return <Navigate to="/login" />;
    } else {
        fetchComments();
        fetchPy();
        fetchC();
        fetchCpp();
    }

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
            <div className="flex justify-center text-xl signUp-font font-bold">
                Analytics
            </div>
            <div className=" mx-4 flex justify-between text-lg poppins text-red-600">
                <span>Comments History</span>
                <span>Language Statistics</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 poppins mx-6">
                <div className="">
                    {comments ? (
                        <div className="m-4 grid grid-cols-10 font-bold">
                            <div className="col-span-1 p-1 py-0">Id</div>
                            <div className="col-span-5 p-1 py-0">Comment</div>
                            <div className="col-span-2 p-1 py-0">Date</div>
                            <div className="col-span-2 p-1 py-0">Time</div>
                        </div>
                    ) : (
                        <div>{""}</div>
                    )}
                    {comments ? (
                        comments.map((comment, index) => (
                            <div
                                key={comment.id}
                                className="m-4 grid grid-cols-10 border border-gray-300 border-b-0 border-l-0 border-r-0 pt-2"
                            >
                                <div className="col-span-1 p-1 py-0">
                                    {index + 1}
                                </div>
                                <div className="col-span-5 p-1 py-0">
                                    {comment.comment}
                                </div>
                                <div className="col-span-2 p-1 py-0">
                                    {comment.time.toString().split("T")[0]}
                                </div>
                                <div className="col-span-2 p-1 py-0">
                                    {comment.time
                                        .toString()
                                        .split("T")[1]
                                        .slice(0, 8)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No Comments</div>
                    )}
                </div>
                <div className="p-4">
                    <Card>
                        <Subtitle>
                            The amount of time the code was submitted with
                            following languages with account{" "}
                            {`${currentUser.email}`}
                        </Subtitle>
                        <BarChart
                            data={chartdata}
                            dataKey="name"
                            categories={["Python", "C", "C++"]}
                            colors={["blue", "red", "green"]}
                            valueFormatter={dataFormatter}
                            marginTop="mt-6"
                            yAxisWidth="w-12"
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
