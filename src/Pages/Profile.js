import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Search from "../Components/Search";
import LogOutBtn from "../Components/LogOutBtn";
import MainBtn from "../Components/MainBtn";
import axios from 'axios';
import CreateCollection from "../Components/CreateCollection";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormattedMessage, useIntl } from 'react-intl';
import ChooseTheme from "../Components/ChooseTheme";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Profile() {
    const [userData, setUserData] = useState({});
    const [collections, setCollections] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [userRole, setUserRole] = useState();

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
                setError();
            }
        }
        getCollections();
    };

    const getCollections = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/userscollections/${currentUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCollections(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError(<FormattedMessage id="profile.anErrorOccurred" />);
            }
        }
    };

    useEffect(() => {
        setUserRole(sessionStorage.getItem("role"));
        if (!token || !currentUserId) {
            window.location.href = "/";
            return;
        }
        else {
            getUserData();
        }
    }, [token, currentUserId]);

    const handleDelete = (collectionId) => {
        setCollectionToDelete(collectionId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setError("");
            await axios.delete(`${baseUrl}/api/Collection/Delete/${collectionToDelete}/?userId=${currentUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCollections(collections.filter(collection => collection.id !== collectionToDelete));
            setShowDeleteModal(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError(<FormattedMessage id="profile.deleteErrorOccurred" />);
            }
        }
    };

    const handleCreateCollection = async (newCollectionData) => {
        try {
            setError("");
            const response = await axios.post(`${baseUrl}/api/Collection/create`, newCollectionData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setShowCreateModal(false);
            toast.success(<FormattedMessage id="profile.collectionCreated" />, {
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError(<FormattedMessage id="profile.createErrorOccurred" />);
            }
        }
    };

    const handleCollectionClick = (collectionId) => {
        localStorage.setItem('selectedCollectionId', collectionId);
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
            />
            <Container>
                <Row>
                    <Col md={2} sm={12}>
                        <MainBtn />
                    </Col>
                    <Col md={7} sm={12}>
                        <Search />
                    </Col>
                    <Col md={2} sm={12}>
                        <LogOutBtn />
                    </Col>
                    <Col md={1} sm={12} className="btn-block">
                        <ChooseTheme />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {error && <div className="alert alert-danger mt-4">{error}</div>}
                        <div className="mt-4">
                            <h3><FormattedMessage id="profile.userInformation" /></h3>
                            <p><b><FormattedMessage id="profile.name" />:</b> {userData.userName}</p>
                            <p><b><FormattedMessage id="profile.email" />:</b> {userData.userEmail}</p>
                        </div>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col md={6}>
                        <div className="mt-2">
                            <h3><FormattedMessage id="profile.collections" /></h3>
                        </div>
                    </Col>
                    <Col md={6} className="text-right">
                        <Button variant="success" className="mt-2" onClick={() => setShowCreateModal(true)}>
                            <FormattedMessage id="profile.create" />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {collections.map((collection, index) => (
                        <Col key={index} md={12}>
                            <Row className="mt-2">
                                <Col md={6}>
                                    <Link to={`/collection/${collection.name}`} onClick={() => handleCollectionClick(collection.id)}>
                                        <p>{collection.name}</p>
                                    </Link>
                                </Col>
                                <Col md={6} className="text-right">
                                    <Button variant="primary" className="btn-block" style={{ marginRight: '10px' }}>
                                        <FormattedMessage id="profile.edit" />
                                    </Button>
                                    <Button variant="danger" className="btn-block" onClick={() => handleDelete(collection.id)}>
                                        <FormattedMessage id="profile.delete" />
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    ))}
                </Row>
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="profile.createCollection" /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateCollection createCollection={handleCreateCollection} />
                    </Modal.Body>
                </Modal>
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="profile.confirmDeletion" /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><FormattedMessage id="profile.confirmDeleteMessage" /></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            <FormattedMessage id="profile.cancel" />
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            <FormattedMessage id="profile.delete" />
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

export default Profile;