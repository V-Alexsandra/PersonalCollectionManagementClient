import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Search from "../Components/Search";
import LogOutBtn from "../Components/LogOutBtn";
import MainBtn from "../Components/MainBtn";
import axios from 'axios';
import CreateCollection from "../Components/CreateCollection";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Profile() {
    const [userData, setUserData] = useState({});
    const [collections, setCollections] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    const getUserData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/User/profile/${currentUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setUserData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.location.href = "/";
            } else if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("An error occurred.");
            }
        }
        getCollections();
    };

    const getCollections = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/userscollections/${currentUserId}`);

            setCollections(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("An error occurred.");
            }
        }
    };

    useEffect(() => {
        if (!token || !currentUserId) {
            window.location.href = "/";
            return;
        }
        else {
            getUserData();
        }
    }, [token, currentUserId]);

    const handleDelete = async (collectionId) => {
        if (window.confirm("Are you sure you want to delete this collection?")) {
            try {
                setError("");
                await axios.delete(`${baseUrl}/api/Collection/Delete/${collectionId}/?userId=${currentUserId}`);
                setCollections(collections.filter(collection => collection.id !== collectionId));
            } catch (error) {
                if (error.response && error.response.data) {
                    setError(error.response.data);
                } else {
                    setError("Failed to delete the collection. An error occurred.");
                }
            }
        }
    };

    const handleCreateCollection = async (newCollectionData) => {
        try {
            setError("");
            const response = await axios.post(`${baseUrl}/api/Collection/create`, newCollectionData);
            setShowCreateModal(false);
            window.location.href = "/profile";
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("Failed to create the collection. An error occurred.");
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col md={2} sm={12}>
                    <MainBtn />
                </Col>
                <Col md={8} sm={12}>
                    <Search />
                </Col>
                <Col md={2} sm={12}>
                    <LogOutBtn />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {error && <div className="alert alert-danger mt-4">{error}</div>}
                    <div className="mt-4">
                        <h3>User Information</h3>
                        <p>Name: {userData.userName}</p>
                        <p>Email: {userData.userEmail}</p>
                    </div>
                </Col>
            </Row>
            <hr></hr>
            <Row>
                <Col md={6}>
                    <div className="mt-2">
                        <h3>Collections</h3>
                    </div>
                </Col>
                <Col md={6} className="text-right">
                    <Button variant="success" className="mt-2" onClick={() => setShowCreateModal(true)}>
                        Create
                    </Button>
                </Col>
            </Row>
            <Row>
                {collections.map((collection, index) => (
                    <Col key={index} md={12}>
                        <Row className="mt-2">
                            <Col md={6}>
                                <Link to={`/collection`}>
                                    <p>{collection.name}</p>
                                </Link>
                            </Col>
                            <Col md={6} className="text-right">
                                <Button variant="primary" className="btn-block" style={{ marginRight: '10px' }}>
                                    Edit
                                </Button>
                                <Button variant="danger" className="btn-block" onClick={() => handleDelete(collection.id)}>
                                    Delete
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                ))}
            </Row>
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Collection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateCollection createCollection={handleCreateCollection} />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Profile;