import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Table, Form, Modal } from "react-bootstrap";
import ProfileBtn from "../Components/ProfileBtn";
import Search from "../Components/Search";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from 'react-intl';
import ChooseTheme from "../Components/ChooseTheme";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Admin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [checkboxState, setCheckboxState] = useState({});
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [error, setError] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [userRole, setUserRole] = useState();

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    const handleShowConfirmationModal = (action) => {
        setActionToConfirm(action);
        setShowConfirmationModal(true);
    };

    const handleCloseConfirmationModal = () => {
        setActionToConfirm(null);
        setShowConfirmationModal(false);
    };

    const handleConfirmationAction = (action) => {
        switch (action) {
            case "Block":
                handleBlockSelectedUsers();
                break;
            case "Unblock":
                handleUnblockSelectedUsers();
                break;
            case "Delete":
                handleDeleteSelectedUsers();
                break;
            case "Change Role":
                handleChangeRole();
            default:
                break;
        }
    };

    const handleSelectAll = () => {
        setIsAllSelected(!isAllSelected);
        if (isAllSelected) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(users.map((user) => user.id));
        }
    };

    const handleCheckboxChange = (userId) => {
        const updatedCheckboxState = { ...checkboxState };

        if (updatedCheckboxState[userId]) {
            delete updatedCheckboxState[userId];
        } else {
            updatedCheckboxState[userId] = true;
        }

        setCheckboxState(updatedCheckboxState);

        const updatedUserIds = Object.keys(updatedCheckboxState);
        setSelectedUserIds(updatedUserIds);
    };

    const handleBlockSelectedUsers = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        for (const userId of selectedUserIds) {
            try {
                await axios.put(`${baseUrl}/api/Admin/block/${userId}`);
            } catch (error) {
                handleError(error);
            }

            if (currentUserId === userId) {
                sessionStorage.clear();
                navigate("/");
                return;
            }
        }
        setCheckboxState({});
        toast.success("User(s) Blocked");
        handleCloseConfirmationModal();
        setSelectedUserIds([]);
        updateUsersList();
    };


    const handleUnblockSelectedUsers = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        for (const userId of selectedUserIds) {
            try {
                await axios.put(`${baseUrl}/api/Admin/unblock/${userId}`);
            } catch (error) {
                handleError(error);
            }
        }
        setCheckboxState({});
        toast.success("User(s) Unblocked");
        handleCloseConfirmationModal();
        setSelectedUserIds([]);
        updateUsersList();
    };

    const handleDeleteSelectedUsers = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        for (const userId of selectedUserIds) {
            try {
                await axios.delete(`${baseUrl}/api/Admin/delete/${userId}`);
            } catch (error) {
                handleError(error);
            }

            if (currentUserId == userId) {
                sessionStorage.clear();
                navigate("/");
                return;
            }
        }
        setCheckboxState({});
        toast.success("User(s) Deleted");
        handleCloseConfirmationModal();
        setSelectedUserIds([]);
        updateUsersList();
    };

    const updateUsersList = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
            const response = await axios.get(`${baseUrl}/api/Admin/allusers`);
            setUsers(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchAllUsers = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
            const response = await axios.get(`${baseUrl}/api/Admin/allusers`);
            setUsers(response.data);

            await Promise.all(response.data.map(user => getUserRoles(user.id)));

        } catch (error) {
            handleError(error);
        }
    };

    const getUserRoles = (userId) => {
        return axios.get(`${baseUrl}/api/Admin/getrole/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                setUserRoles((prevRoles) => ({ ...prevRoles, [userId]: response.data }));
            })
            .catch(error => {
                handleError(error);
            });
    };


    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        } else if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError("An error occurred.");
        }
    };

    const handleChangeRole = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
        for (const userId of selectedUserIds) {
            try {
                await getUserRoles(userId);
    
                const currentRole = userRoles[userId];
    
                setUserRoles((prevRoles) => ({ ...prevRoles, [userId]: toggleRole(currentRole) }));
    
                await updateRoleOnServer(userId, toggleRole(currentRole));
            } catch (error) {
                handleError(error);
            }
        }
    
        setCheckboxState({});
        updateUsersList();
        handleCloseConfirmationModal();
        setSelectedUserIds([]);
    };
    
    const toggleRole = (currentRole) => {
        return currentRole === "Admin" ? "User" : "Admin";
    };
    
    const updateRoleOnServer = async (userId, newRole) => {
        try {
            if (newRole === "Admin") {
                await axios.put(`${baseUrl}/api/Admin/roleadmin/${userId}`);
            } else if (newRole === "User") {
                await axios.put(`${baseUrl}/api/Admin/roleuser/${userId}`);
            }
        } catch (error) {
            handleError(error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            const role = await localStorage.getItem("role");
            setUserRole(role);
    
            if (!token || !currentUserId || role !== "Admin") {
                navigate("/");
                return;
            } else {
                fetchAllUsers();
            }
        };
    
        fetchData();
    
    }, [token, currentUserId]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1000}
            />
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} sm={12}>
                        <Search />
                    </Col>
                    <Col md={1} sm={12}>
                        <ProfileBtn />
                    </Col>
                    <Col md={1} sm={12} className="btn-block">
                        <ChooseTheme />
                    </Col>
                </Row>
                {error && <div className="alert alert-danger mt-4">{error}</div>}
                <Row className="mt-4">
                    <Col>
                        <div className="toolbar">
                            <Button onClick={() => handleShowConfirmationModal("Block")} className="mx-2">
                                <FormattedMessage id="admin.blockButton" />
                            </Button>
                            <Button variant="success" onClick={() => handleShowConfirmationModal("Unblock")} className="mx-2">
                                <FormattedMessage id="admin.unblockButton" />
                            </Button>
                            <Button variant="danger" onClick={() => handleShowConfirmationModal("Delete")} className="mx-2">
                                <FormattedMessage id="admin.deleteButton" />
                            </Button>
                            <Button variant="danger" onClick={() => handleShowConfirmationModal("Change Role")} className="mx-2">
                                <FormattedMessage id="admin.changeRoleButton" />
                            </Button>
                        </div>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Table responsive className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <Form.Check
                                            checked={isAllSelected}
                                            type="checkbox"
                                            label={<FormattedMessage id="admin.table.header.selectAll" />}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th><FormattedMessage id="admin.table.header.name" /></th>
                                    <th><FormattedMessage id="admin.table.header.email" /></th>
                                    <th><FormattedMessage id="admin.table.header.status" /></th>
                                    <th><FormattedMessage id="admin.table.header.role" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <Form.Check
                                                checked={isAllSelected || !!checkboxState[user.id]}
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(user.id)}
                                            />
                                        </td>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                                        <td>{userRoles[user.id]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="admin.confirmActionModalTitle" /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormattedMessage id="admin.confirmActionModalBody1" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmationModal}>
                        <FormattedMessage id="admin.confirmActionModalCancel" />
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmationAction(actionToConfirm)}>
                        <FormattedMessage id="admin.confirmActionModalConfirm" />
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Admin;