import Signup from "./Signup";
import Login from "./Login";
import Analytics from "./Analytics";
import ForgotPassword from "./ForgotPassword";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route exact path="/" element={<PrivateRoute />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}
