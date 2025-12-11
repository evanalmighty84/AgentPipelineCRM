import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import {
    HashRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import "./index.css";

import LoginPage from "./CRMcomponents/AgentSignIn";
import SignUp from "./CRMcomponents/AgentSignUp";
import NonUserDashboard from "./CRMcomponents/NonUserDashboard";
import RelationshipsPage from "./CRMPages/RelationshipsPage";
import ThemeSettings from "./CRMcomponents/AgentSettings";

function App() {

    // -----------------------------
    // DEV FALLBACK USER + THEME
    // -----------------------------
    useEffect(() => {
        const existingUser = JSON.parse(localStorage.getItem("user"));
        if (!existingUser) {
            localStorage.setItem("user", JSON.stringify({ id: 1, name: "Test User" }));
        }

        const existingTheme = JSON.parse(localStorage.getItem("theme"));
        if (!existingTheme) {
            localStorage.setItem(
                "theme",
                JSON.stringify({
                    theme: "light",
                    customColor: null,
                })
            );
        }
    }, []);

    // -----------------------------
    // PROTECTED ROUTE (HOOK VERSION)
    // -----------------------------
    const ProtectedRoute = ({ children }) => {
        const user = localStorage.getItem("user");
        if (!user) return <Navigate to="/signin" replace />;
        return children;
    };

    return (
        <HashRouter>
            <Routes>
                {/* ⚪ PUBLIC ROUTES */}
                <Route path="/" element={<NonUserDashboard />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<LoginPage />} />

                {/* 🎨 THEME SETTINGS */}
                <Route path="/settings" element={<ThemeSettings />} />

                {/* 🟢 RELATIONSHIPS (TEMP PUBLIC) */}
                <Route path="/relationships" element={<RelationshipsPage />} />

                {/* 🔒 PROTECTED EXAMPLE */}
                {/*
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                */}

                {/* ❌ 404 FALLBACK */}
                <Route
                    path="*"
                    element={
                        <div style={{ padding: "2rem", color: "red" }}>
                            ❌ 404 - Page Not Found
                        </div>
                    }
                />
            </Routes>

            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />
        </HashRouter>
    );
}

// ----------------------
// React 18 Render Engine
// ----------------------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
