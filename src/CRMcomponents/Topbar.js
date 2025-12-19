import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./topbar.css";

const LOGO_URL =
    "https://res.cloudinary.com/duz4vhtcn/image/upload/v1765406076/Screenshot_2025-12-10_at_4.34.32_PM_mdroeh.png";

const Topbar = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

    const go = (path) => {
        navigate(path);
        setExpanded(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setExpanded(false);
        navigate("/signin");
    };

    return (
        <Navbar expand="lg" expanded={expanded} className="topbar">
            <Container fluid className="topbar-inner">
                {/* 🔒 LOGO — FULLY QUARANTINED */}
                <div className="topbar-logo-zone" onClick={() => go("/dashboard")}>
                    <img src={LOGO_URL} alt="Dashboard" />
                </div>

                {/* 🍔 MOBILE TOGGLE ONLY */}
                <Navbar.Toggle
                    aria-controls="topbar-nav"
                    onClick={() => setExpanded(!expanded)}
                />

                <Navbar.Collapse id="topbar-nav">
                    {/* 🌐 CENTERED NAV (VIEWPORT BASED) */}
                    <Nav className="topbar-nav-centered">
                        <Nav.Link
                            active={location.pathname === "/dashboard"}
                            onClick={() => go("/dashboard")}
                        >
                            Dashboard
                        </Nav.Link>

                        <Nav.Link
                            active={location.pathname === "/relationships"}
                            onClick={() => go("/relationships")}
                        >
                            Relationships
                        </Nav.Link>

                        <Nav.Link
                            active={location.pathname === "/calendar"}
                            onClick={() => go("/calendar")}
                        >
                            Calendar
                        </Nav.Link>

                        <Nav.Link
                            active={location.pathname === "/settings"}
                            onClick={() => go("/settings")}
                        >
                            Account Settings
                        </Nav.Link>

                        <Nav.Link className="logout" onClick={logout}>
                            Log Out
                        </Nav.Link>
                    </Nav>

                    {/* 👤 USER (MOBILE ONLY) */}
                    <div className="topbar-user d-lg-none">
                        {user ? user.name : "Guest"}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Topbar;
