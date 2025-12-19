import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Table } from "react-bootstrap";
import moment from "moment";
import "./calendar.css";


const REACT_APP_API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://agentpipelinecrmbackend-production.up.railway.app/api"
        : "http://localhost:5000/api";



export default function CalendarScheduler() {
    const [showModal, setShowModal] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);

    const handleEventClick = (info) => {
        setEventDetails(info.event);
        setShowModal(true);
    };

    const getEventColor = (event) => {
        const type = event.title?.split(" - ")[0]?.toLowerCase();
        if (type === "email") return "#4caf50";
        if (type === "phone_call") return "#2196f3";
        if (type === "meeting") return "#9c27b0";
        if (type === "text") return "#ff7043";
        return "#607d8b";
    };

    return (
        <div className="container-fluid">


            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}

                events={`${REACT_APP_API_BASE_URL}/calendar`}
                height={600}
                eventClick={handleEventClick}
                eventDidMount={(info) => {
                    info.el.style.backgroundColor = getEventColor(info.event);
                    info.el.style.border = "none";
                    info.el.style.color = "white";
                    info.el.style.borderRadius = "6px";
                }}
            />

            {/* 🔽 Modal mirrors your existing one */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
            >
                <Modal.Header closeButton style={{ background: "#ff7043", color: "#fff" }}>
                    <Modal.Title>
                        {eventDetails?.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {eventDetails && (
                        <>
                            <p>
                                <strong>Scheduled Time:</strong>{" "}
                                {moment(eventDetails.start).format("MMMM Do YYYY, h:mm A")}
                            </p>

                            {eventDetails.extendedProps?.description && (
                                <p>
                                    <strong>Notes:</strong>{" "}
                                    {eventDetails.extendedProps.description}
                                </p>
                            )}

                            {/* Example queued emails table */}
                            <h5 className="mt-4">Queued Emails</h5>
                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>Send Time</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>—</td>
                                    <td>—</td>
                                </tr>
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
