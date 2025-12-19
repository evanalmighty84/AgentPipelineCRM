// src/CRMPages/RelationshipsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    Button,
    Form,
    Row,
    Col,
    Modal,
    Pagination,
    Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DEFAULT_THEME = {
    background:
        "radial-gradient(circle at top, #102A38 0%, #081A23 55%, #040B10 100%)",
    text: "#ffffff",
    headerColor: "linear-gradient(90deg, #FF8A50, #FF5A1F)",
    headerTextColor: "#000000",
};




const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

const RelationshipsPage = () => {
    // ---------------- STATE ----------------
    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRelationships, setFilteredRelationships] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);

    const [themeStyles, setThemeStyles] = useState(DEFAULT_THEME);

    const [sortConfig, setSortConfig] = useState({
        field: "name",
        direction: "asc",
    });

    const [currentPage, setCurrentPage] = useState(1);

    // mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // for swipeable cards
    const [swipedCardId, setSwipedCardId] = useState(null);
    const [touchStartX, setTouchStartX] = useState(null);

    const navigate = useNavigate();

    // -------------- EFFECT: resize listener for mobile --------------
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // -------------- EFFECT: load theme --------------
    useEffect(() => {
        loadTheme();
    }, []);

    async function loadTheme() {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) {
                setThemeStyles(DEFAULT_THEME);
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/preferences/colorscheme/${user.id}`
            );
            const data = await res.json();

            if (data?.style) {
                setThemeStyles({
                    ...DEFAULT_THEME,
                    ...data.style,
                });
            } else {
                setThemeStyles(DEFAULT_THEME);
            }
        } catch (err) {
            console.error("Theme load error:", err);
            setThemeStyles(DEFAULT_THEME);
        }
    }

    // -------------- EFFECT: fetch relationships --------------
    useEffect(() => {
        fetchRelationships();
    }, []);

    const fetchRelationships = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) return;

            const response = await fetch(
                `http://localhost:5000/api/relationships/user/${user.id}`
            );
            const data = await response.json();

            if (response.ok) {
                let rows = data;

                // fake sample data for UX testing if DB is empty
                if (!rows || rows.length === 0) {
                    rows = [
                        {
                            id: 101,
                            name: "John Doe",
                            email: "john@example.com",
                            phone: "(214) 555-1234",
                            address: "123 Main St, Plano TX",
                            married: true,
                            spouse: "Jane Doe",
                            transaction_status: "active",
                            relationship_type: "Friend",
                            last_contacted: "2025-03-01",
                            follow_up_date: "2025-04-01",
                            qualified: true,
                        },
                        {
                            id: 102,
                            name: "Sarah Thompson",
                            email: "sarah.t@example.com",
                            phone: "(972) 888-4499",
                            address: "450 Oak Ridge Dr, McKinney TX",
                            married: false,
                            spouse: "",
                            transaction_status: "potential",
                            relationship_type: "Lead",
                            last_contacted: "2025-02-15",
                            follow_up_date: "2025-03-10",
                            qualified: false,
                        },
                        {
                            id: 103,
                            name: "Michael Johnson",
                            email: "m.johnson@gmail.com",
                            phone: "(469) 222-7788",
                            address: "88 Lakeview Ln, Frisco TX",
                            married: true,
                            spouse: "Ashley Johnson",
                            transaction_status: "pending",
                            relationship_type: "Referral",
                            last_contacted: "2025-02-28",
                            follow_up_date: "2025-03-05",
                            qualified: false,
                        },
                    ];
                }

                setRelationships(rows);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // -------------- EFFECT: debounced search --------------
    useEffect(() => {
        const handle = setTimeout(() => {
            setSearchQuery(searchInput.toLowerCase());
            setCurrentPage(1); // reset to first page on new search
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(handle);
    }, [searchInput]);

    // -------------- EFFECT: filter on search --------------
    useEffect(() => {
        if (!searchQuery) {
            setFilteredRelationships(relationships);
            return;
        }

        const filtered = relationships.filter((r) => {
            const haystack = [
                r.name,
                r.email,
                r.phone,
                r.address,
                r.relationship_type,
                r.transaction_status,
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(searchQuery);
        });

        setFilteredRelationships(filtered);
    }, [relationships, searchQuery]);

    // -------------- SORTING --------------
    const sortedRelationships = useMemo(() => {
        const arr = [...filteredRelationships];

        if (!sortConfig.field) return arr;

        arr.sort((a, b) => {
            let valA = a[sortConfig.field];
            let valB = b[sortConfig.field];

            // Boolean sorting fix
            if (typeof valA === "boolean" && typeof valB === "boolean") {
                return sortConfig.direction === "asc"
                    ? (valA === valB ? 0 : valA ? 1 : -1)
                    : (valA === valB ? 0 : valA ? -1 : 1);
            }

            valA = valA ?? "";
            valB = valB ?? "";

            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });


        return arr;
    }, [filteredRelationships, sortConfig]);

    const toggleSort = (field) => {
        setSortConfig((prev) => {
            if (prev.field === field) {
                return {
                    field,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { field, direction: "asc" };
        });
    };

    const getSortArrow = (field) => {
        if (sortConfig.field !== field) return "⇅";
        return sortConfig.direction === "asc" ? "▲" : "▼";
    };

    // -------------- PAGINATION --------------
    const totalPages = Math.max(
        1,
        Math.ceil(sortedRelationships.length / PAGE_SIZE)
    );

    const paginatedRelationships = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return sortedRelationships.slice(start, start + PAGE_SIZE);
    }, [sortedRelationships, currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // -------------- DELETE --------------
    const handleDelete = async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await fetch(
                `http://localhost:5000/api/relationships/${id}?userId=${user.id}`,
                { method: "DELETE" }
            );
            fetchRelationships();
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    // -------------- EDIT MODAL --------------
    const handleViewClick = (relationship) => {
        setSelected(relationship);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/relationships/${selected.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selected),
                }
            );

            if (!response.ok) throw new Error("Update failed");

            toast.success("Saved successfully!");
            setShowModal(false);
            fetchRelationships();
        } catch (err) {
            toast.error("Could not save.");
            console.error(err);
        }
    };

    // -------------- SWIPE HANDLERS (mobile cards) --------------
    const onTouchStart = (e, id) => {
        setTouchStartX(e.touches[0].clientX);
        setSwipedCardId(null); // reset until we confirm swipe
    };

    const onTouchEnd = (e, id) => {
        if (touchStartX == null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;

        if (deltaX < -40) {
            // swipe left → reveal actions
            setSwipedCardId(id);
        } else if (deltaX > 40) {
            // swipe right → hide
            setSwipedCardId(null);
        }
        setTouchStartX(null);
    };

    // ============== RENDER HELPERS ==============

    const renderTable = () => (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Table bordered hover responsive>
                        <thead>
                        <tr
                            style={{
                                background: themeStyles.headerColor,
                                color: themeStyles.headerTextColor,
                                position: "sticky",
                                top: 0,
                                zIndex: 2,
                            }}
                        >
                            <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                                Name {getSortArrow("name")}
                            </th>
                            <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>
                                Email {getSortArrow("email")}
                            </th>
                            <th onClick={() => toggleSort("phone")} style={{ cursor: "pointer" }}>
                                Phone {getSortArrow("phone")}
                            </th>
                            <th
                                onClick={() => toggleSort("address")}
                                style={{ cursor: "pointer" }}
                            >
                                Address {getSortArrow("address")}
                            </th>
                            <th>Married</th>
                            <th onClick={() => toggleSort("spouse")} style={{ cursor: "pointer" }}>
                                Spouse {getSortArrow("spouse")}
                            </th>
                            <th
                                onClick={() => toggleSort("transaction_status")}
                                style={{ cursor: "pointer" }}
                            >
                                Status {getSortArrow("transaction_status")}
                            </th>
                            <th
                                onClick={() => toggleSort("relationship_type")}
                                style={{ cursor: "pointer" }}
                            >
                                Relationship Type {getSortArrow("relationship_type")}
                            </th>
                            <th
                                onClick={() => toggleSort("last_contacted")}
                                style={{ cursor: "pointer" }}
                            >
                                Last Contacted {getSortArrow("last_contacted")}
                            </th>
                            <th
                                onClick={() => toggleSort("follow_up_date")}
                                style={{ cursor: "pointer" }}
                            >
                                Follow-Up {getSortArrow("follow_up_date")}
                            </th>
                            <th
                                onClick={() => toggleSort("qualified")}
                                style={{ cursor: "pointer" }}
                            >
                                Qualified {getSortArrow("qualified")}
                            </th>

                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {paginatedRelationships.length ? (
                            paginatedRelationships.map((r, index) => {
                                const isEven = index % 2 === 0;
                                const rowStyle = {
                                    backgroundColor: isEven ? "#ffffff" : "#cce5ff",
                                    color: themeStyles.text,
                                };

                                return (
                                    <tr key={r.id} style={rowStyle}>
                                        <td>{r.name}</td>
                                        <td>{r.email || "—"}</td>
                                        <td>{r.phone || "—"}</td>
                                        <td>{r.address || "—"}</td>
                                        <td>{r.married ? "Yes" : "No"}</td>
                                        <td>{r.spouse || "—"}</td>
                                        <td>{r.transaction_status}</td>
                                        <td>{r.relationship_type || "—"}</td>
                                        <td>{r.last_contacted || "—"}</td>
                                        <td>{r.follow_up_date || "—"}</td>
                                        <td>{r.qualified ? "Yes" : "No"}</td>

                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => {
                                                    setViewData(r);
                                                    setShowViewModal(true);
                                                }}
                                            >
                                                View
                                            </Button>{" "}
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDelete(r.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-3">
                                    No relationships found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                                {[...Array(totalPages)].map((_, idx) => (
                                    <Pagination.Item
                                        key={idx + 1}
                                        active={idx + 1 === currentPage}
                                        onClick={() => handlePageChange(idx + 1)}
                                    >
                                        {idx + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </>
    );

    const renderCards = () => (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : paginatedRelationships.length ? (
                <>
                    {paginatedRelationships.map((r) => (
                        <Card
                            key={r.id}
                            className="mb-3 shadow-sm"
                            style={{
                                borderRadius: 10,
                                overflow: "hidden",
                                backgroundColor: "#f0f6ff",
                            }}
                        >
                            <Card.Body style={{ padding: "1rem" }}>
                                {/* Name (Large) */}
                                <h5 className="mb-3" style={{ fontWeight: "600" }}>
                                    {r.name}
                                </h5>

                                {/* Same stacked style as SubscribersPage */}
                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Email:</strong>
                                    <span>{r.email || "—"}</span>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Phone:</strong>
                                    <span>{r.phone || "—"}</span>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Address:</strong>
                                    <span style={{ textAlign: "right", maxWidth: "55%" }}>
                  {r.address || "—"}
                </span>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Status:</strong>
                                    <span>{r.transaction_status}</span>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Type:</strong>
                                    <span>{r.relationship_type || "—"}</span>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Last Contacted:</strong>
                                    <span>{r.last_contacted || "—"}</span>
                                </div>

                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Follow-Up:</strong>
                                    <span>{r.follow_up_date || "—"}</span>
                                </div>
                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <strong>Qualified:</strong>
                                    <span>{r.qualified ? "Yes" : "No"}</span>

                                </div>

                                {/* Action buttons */}
                                <div className="d-flex justify-content-end mt-3">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                            setViewData(r);
                                            setShowViewModal(true);
                                        }}
                                    >
                                        View
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-2">
                            <Pagination size="sm">
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                                {[...Array(totalPages)].map((_, idx) => (
                                    <Pagination.Item
                                        key={idx + 1}
                                        active={idx + 1 === currentPage}
                                        onClick={() => handlePageChange(idx + 1)}
                                    >
                                        {idx + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                            </Pagination>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center mt-3">No relationships found.</p>
            )}
        </>
    );


    // ============== MAIN RENDER ==============
    return (
        <div
            className="relationships-page p-3 p-md-4"
            style={{
                background: themeStyles.background,
                color: themeStyles.text,
                minHeight: "100vh",
                transition: "all 0.25s ease",
            }}
        >
            {/* Logo + title */}
            <div className="d-flex flex-column align-items-center mb-3">
                <h3 style={{ color: "#ff7043", textAlign: "center" }}>Relationships</h3>
            </div>

            {/* Top row: count + new button */}
            <Row className="mb-3 align-items-center">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                    <h5 className="mb-0">
                        Relationships ({filteredRelationships.length})
                    </h5>
                </Col>

                <Col xs={12} md={6} className="text-md-end">
                    <Button
                        variant="primary"
                        onClick={() => navigate("/relationships/new")}
                        size={isMobile ? "sm" : "md"}
                    >
                        + New
                    </Button>
                </Col>
            </Row>

            {/* search */}
            <Form.Control
                type="text"
                placeholder="Search by name, email, phone, address or type"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="mb-3"
            />

            {/* main content */}
            {isMobile ? renderCards() : renderTable()}

            {/* ------------ EDIT MODAL ------------ */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Relationship</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selected && (
                        <Form>
                            <Form.Group className="mt-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selected.name}
                                    onChange={(e) =>
                                        setSelected({ ...selected, name: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selected.email || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, email: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selected.phone || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, phone: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={selected.address || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, address: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label>Transaction Status</Form.Label>
                                <Form.Select
                                    value={selected.transaction_status}
                                    onChange={(e) =>
                                        setSelected({
                                            ...selected,
                                            transaction_status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="potential">Potential</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="closed">Closed</option>
                                    <option value="not_converted">Not Converted</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Qualified Lead"
                                    checked={selected.qualified || false}
                                    onChange={(e) =>
                                        setSelected({ ...selected, qualified: e.target.checked })
                                    }
                                />
                            </Form.Group>


                            <Form.Group className="mt-3">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selected.notes || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, notes: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ------------ VIEW MODAL ------------ */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Relationship Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {viewData && (
                        <div style={{ lineHeight: "1.8" }}>
                            <p>
                                <strong>Name:</strong> {viewData.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {viewData.email || "—"}
                            </p>
                            <p>
                                <strong>Phone:</strong> {viewData.phone || "—"}
                            </p>
                            <p>
                                <strong>Address:</strong> {viewData.address || "—"}
                            </p>
                            <p>
                                <strong>Married:</strong> {viewData.married ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Spouse:</strong> {viewData.spouse || "—"}
                            </p>
                            <p>
                                <strong>Status:</strong> {viewData.transaction_status}
                            </p>
                            <p>
                                <strong>Relationship Type:</strong>{" "}
                                {viewData.relationship_type || "—"}
                            </p>
                            <p>
                                <strong>Last Contacted:</strong>{" "}
                                {viewData.last_contacted || "—"}
                            </p>
                            <p>
                                <strong>Follow-Up Date:</strong>{" "}
                                {viewData.follow_up_date || "—"}
                            </p>
                            <p>
                                <strong>Qualified:</strong> {viewData.qualified ? "Yes" : "No"}
                            </p>

                            <p>
                                <strong>Notes:</strong> {viewData.notes || "—"}
                            </p>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RelationshipsPage;
