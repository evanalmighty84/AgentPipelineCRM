import React, { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const ThemeSettings = ({ onThemeUpdated }) => {
    const [theme, setTheme] = useState("light");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.id) return;
        loadTheme();
    }, []);

    /* ----------------------------------
       GET CURRENT THEME FROM BACKEND
    ---------------------------------- */
    async function loadTheme() {
        try {
            const res = await fetch(
                `http://localhost:5000/api/preferences/colorscheme/${user.id}`
            );

            const data = await res.json();

            if (data?.theme) {
                setTheme(data.theme);
            }
        } catch (e) {
            console.error("Theme load error:", e);
        } finally {
            setLoading(false);
        }
    }

    /* ----------------------------------
       SAVE THEME (POST) — matches backend
    ---------------------------------- */
    async function saveTheme() {
        try {
            const body = {
                userId: user.id,
                theme
            };

            const res = await fetch(
                `http://localhost:5000/api/preferences/colorscheme`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );

            if (!res.ok) throw new Error("Failed to save theme");

            toast.success("Theme updated!");

            if (onThemeUpdated) onThemeUpdated(theme);

        } catch (err) {
            console.error(err);
            toast.error("Error saving theme.");
        }
    }

    if (loading) return <p>Loading theme...</p>;

    return (
        <Card className="p-4" style={{ maxWidth: 600, margin: "0 auto" }}>
            <h3 className="text-center mb-3">Theme Settings</h3>

            <Form>

                {/* ------------------------------
                    THEME DROPDOWN — matches backend
                ------------------------------ */}
                <Form.Group className="mb-3">
                    <Form.Label>Select Theme</Form.Label>
                    <Form.Select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="gradient">Gradient</option>
                        <option value="sunset">Sunset</option>
                        <option value="ocean">Ocean</option>
                        <option value="forest">Forest</option>
                        <option value="rose">Rose</option>
                    </Form.Select>
                </Form.Group>

                {/* ------------------------------
                    SAVE BUTTON
                ------------------------------ */}
                <Row className="mt-4">
                    <Col className="text-center">
                        <Button variant="primary" onClick={saveTheme}>
                            Save Theme
                        </Button>
                    </Col>
                </Row>

            </Form>
        </Card>
    );
};

export default ThemeSettings;
