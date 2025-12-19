import React from "react";
import { Container } from "react-bootstrap";

import DashboardCards from "../CRMcomponents/AgentDashboardCards";
import CalendarScheduler from "../CRMcomponents/CalendarScheduler";
import RelationshipsPage from "../CRMPages/RelationshipsPage";

const UserDashboard = () => {
    return (
        <Container fluid style={{ paddingTop: 12 }}>
            {/* 🧱 DASHBOARD CARDS */}
            <DashboardCards />

            {/* 📅 CALENDAR — MORE SEPARATION */}
            <div style={{ marginTop: 80 }}>
                <CalendarScheduler />
            </div>

            {/* 🧑‍🤝‍🧑 RELATIONSHIPS */}
            <div style={{ marginTop: 80 }}>
                <RelationshipsPage />
            </div>
        </Container>
    );
};

export default UserDashboard;
