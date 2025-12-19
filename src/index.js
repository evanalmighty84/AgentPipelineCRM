import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import Topbar from "./CRMcomponents/Topbar";
import "./index.css";

import LoginPage from "./CRMcomponents/AgentSignIn";
import AgentSignUp from "./CRMcomponents/AgentSignUp";
import NonUserDashboard from "./CRMcomponents/NonUserDashboard";
import RelationshipsPage from "./CRMPages/RelationshipsPage";
import ThemeSettings from "./CRMcomponents/AgentSettings";
import CalendarScheduler from "./CRMcomponents/CalendarScheduler";
import AgentSignIn from "./CRMcomponents/AgentSignIn";
import UserDashboard from "./CRMcomponents/UserDashboard";

/* ----------------------------------
   🔁 REDIRECT HANDLER (KEY PIECE)
---------------------------------- */
const RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Handle GitHub Pages redirect (?redirect=/signin)
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        if (redirect && location.pathname === "/") {
            navigate(redirect, { replace: true });
            return;
        }

        // Handle legacy hash URLs (just in case)
        if (window.location.hash.startsWith("#/")) {
            const cleanPath = window.location.hash.replace("#", "");
            navigate(cleanPath, { replace: true });
        }
    }, [navigate, location]);

    return null;
};




const AppLayout = ({ children }) => {
    const location = useLocation();

    const user = localStorage.getItem("user");

    const showTopBarRoutes = [
        "/relationships",
        "/calendar",
        "/settings",
        "/dashboard",
    ];

    const hideHeaderRoutes = [
        "/signin",
        "/signup",
    ];

    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    const showTopBar =
        user &&
        showTopBarRoutes.some(route =>
            location.pathname.startsWith(route)
        );

    if (shouldHideHeader) {
        return <>{children}</>;
    }

    return (
        <>
            {showTopBar && <Topbar />}
            <div style={{ marginTop: showTopBar ? "90px" : "0px" }} />
            {children}
        </>
    );
};


function App() {
    // -----------------------------
    // DEV FALLBACK USER + THEME
    // -----------------------------
    useEffect(() => {
        const existingUser = JSON.parse(localStorage.getItem("user"));
        if (!existingUser) {
            localStorage.setItem(
                "user",
                JSON.stringify({ id: 1, name: "Test User" })
            );
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
    // PROTECTED ROUTE
    // -----------------------------
    const ProtectedRoute = ({ children }) => {
        const user = localStorage.getItem("user");
        if (!user) return <Navigate to="/signin" replace />;
        return children;
    };

    return (
        <BrowserRouter basename="/">
            <RedirectHandler />
            <AppLayout>
            <Routes>
                {/* ⚪ PUBLIC ROUTES */}
                <Route path="/" element={<AgentSignIn />} />
                <Route path="/calendar" element={<CalendarScheduler />} />
                <Route path="/signup" element={<AgentSignUp />} />
                <Route path="/signin" element={<LoginPage />} />
                {/* 🟢 DASHBOARD */}
                <Route path="/dashboard" element={<UserDashboard />} />
                {/* 🎨 SETTINGS */}
                <Route path="/settings" element={<ThemeSettings />} />

                {/* 🟢 RELATIONSHIPS */}
                <Route path="/relationships" element={<RelationshipsPage />} />

                {/* ❌ 404 */}
                <Route
                    path="*"
                    element={
                        <div style={{ padding: "2rem", color: "red" }}>
                            ❌ 404 - Page Not Found
                        </div>
                    }
                />
            </Routes>
            </AppLayout>

            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />
        </BrowserRouter>
    );
}

// ----------------------
// React 18 Render Engine
// ----------------------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
