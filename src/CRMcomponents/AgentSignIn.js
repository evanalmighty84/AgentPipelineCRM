import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LOGO_URL =
    "https://res.cloudinary.com/duz4vhtcn/image/upload/v1765406076/Screenshot_2025-12-10_at_4.34.32_PM_mdroeh.png";

// ✅ API BASE URL (local vs prod)
const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://agentpipelinecrmbackend-production.up.railway.app"
        : "http://localhost:5000";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // ✅ Save auth data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // ✅ Redirect
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top, #102A38 0%, #081A23 55%, #040B10 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: 440,
                    padding: "42px 38px",
                    borderRadius: 16,
                    background: "linear-gradient(145deg, #0c0c0c, #131313)",
                    boxShadow:
                        "0 30px 70px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.06)",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <img
                    src={LOGO_URL}
                    alt="Agent Pipeline CRM"
                    style={{ width: 170, marginBottom: 22 }}
                />

                <h4 style={{ marginBottom: 6, fontWeight: 600 }}>
                    Agent Pipeline CRM
                </h4>

                <div
                    style={{
                        width: 70,
                        height: 4,
                        background:
                            "linear-gradient(90deg, #FF8A50, #FF5A1F)",
                        margin: "12px auto 30px",
                        borderRadius: 3,
                    }}
                />

                {error && (
                    <Alert variant="danger" style={{ fontSize: 14 }}>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                background: "#0f0f0f",
                                border: "1px solid #2f2f2f",
                                color: "white",
                                padding: "10px 12px",
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                background: "#0f0f0f",
                                border: "1px solid #2f2f2f",
                                color: "white",
                                padding: "10px 12px",
                            }}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-100"
                        style={{
                            background:
                                "linear-gradient(135deg, #FF7A3C, #E65100)",
                            border: "none",
                            fontWeight: 600,
                            padding: "11px 0",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Sign In
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
