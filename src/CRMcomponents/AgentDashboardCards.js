import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import {
    FaUserFriends,
    FaTasks,
    FaMoneyBillWave,
    FaGift,
} from "react-icons/fa";

const AgentDashboardCards = () => {
    /* -----------------------------
       🧪 STUB DATA
    ----------------------------- */
    const relationships = [
        { name: "Sarah Johnson", time: "Added Dec 18, 9:33 PM" },
        { name: "John Smith", time: "Added Dec 17, 4:10 PM" },
        { name: "Mike Davis", time: "Added Dec 16, 1:42 PM" },
    ];

    const tasks = [
        { title: "Send intro email", due: "Today" },
        { title: "Follow up call", due: "Tomorrow" },
        { title: "Schedule meeting", due: "Next Week" },
    ];

    const transactions = [
        { label: "Subscription", amount: "$49.00" },
        { label: "Gift Purchase", amount: "$25.00" },
        { label: "Upgrade Fee", amount: "$99.00" },
    ];

    const gifts = [
        { name: "Anniversary – Bob", date: "Jan 3" },
        { name: "Birthday – Jane", date: "Dec 24" },
        { name: "Client Gift", date: "Jan 15" },
    ];

    /* -----------------------------
       🔁 ROTATION (7s)
    ----------------------------- */
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % 3);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    /* -----------------------------
       🎨 STYLES (SIGNUP THEME)
    ----------------------------- */
    const cardStyle = {
        background: "linear-gradient(145deg, #0c0c0c, #131313)",
        color: "white",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
            "0 20px 50px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.04)",
        padding: "26px",
        textAlign: "center",
        height: "100%",
    };

    const accent = {
        width: 60,
        height: 4,
        background: "linear-gradient(90deg, #FF8A50, #FF5A1F)",
        margin: "14px auto",
        borderRadius: 3,
    };

    const iconStyle = { fontSize: 42, marginBottom: 12 };

    /* -----------------------------
       🧱 GRID LAYOUT (THE FIX)
    ----------------------------- */
    return (
        <>
            {/* 🔑 INLINE GRID BREAKPOINTS */}
            <style>
                {`
                .dashboard-grid {
                    display: grid;
                    gap: 24px;
                    width: 100%;
                    margin-top: 110px; /* clears topbar */
                }

                /* Desktop: 4 across */
                @media (min-width: 1200px) {
                    .dashboard-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                /* Tablet: 2x2 */
                @media (min-width: 768px) and (max-width: 1199px) {
                    .dashboard-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                /* Mobile: stacked */
                @media (max-width: 767px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}
            </style>

            <div className="dashboard-grid">
                {/* 🧑‍🤝‍🧑 */}
                <Card style={cardStyle}>
                    <FaUserFriends style={iconStyle} />
                    <div style={accent} />
                    <h6>New Relationships</h6>
                    <h5>{relationships[index].name}</h5>
                    <small style={{ opacity: 0.7 }}>
                        {relationships[index].time}
                    </small>
                </Card>

                {/* ✅ */}
                <Card style={cardStyle}>
                    <FaTasks style={iconStyle} />
                    <div style={accent} />
                    <h6>New Tasks</h6>
                    <h5>{tasks[index].title}</h5>
                    <small style={{ opacity: 0.7 }}>
                        Due: {tasks[index].due}
                    </small>
                </Card>

                {/* 💳 */}
                <Card style={cardStyle}>
                    <FaMoneyBillWave style={iconStyle} />
                    <div style={accent} />
                    <h6>Past Transactions</h6>
                    <h5>{transactions[index].label}</h5>
                    <strong>{transactions[index].amount}</strong>
                </Card>

                {/* 🎁 */}
                <Card style={cardStyle}>
                    <FaGift style={iconStyle} />
                    <div style={accent} />
                    <h6>Upcoming Gift Days</h6>
                    <h5>{gifts[index].name}</h5>
                    <small style={{ opacity: 0.7 }}>
                        {gifts[index].date}
                    </small>
                </Card>
            </div>
        </>
    );
};

export default AgentDashboardCards;
