import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import ProfileBtn from "../Components/ProfileBtn";
import Search from "../Components/Search";
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateItem from '../Components/CreateItem';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Collection() {
    const [error, setError] = useState(null);
    const [collectionData, setCollectionData] = useState({});
    const [topicData, setTopicData] = useState({});
    const [collectionItems, setCollectionItems] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const collectionId = localStorage.getItem('selectedCollectionId');
    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    const getCollectionData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/collectionbyid/${collectionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCollectionData(response.data);
            getCollectionTopic(response.data.topicId);
            getCollectionItems();
        } catch (error) {
            handleError(error);
        }
    };

    const getCollectionTopic = async (topicId) => {
        console.log(collectionData);
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/topoicbyid/${topicId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setTopicData(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    const getCollectionItems = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Item/collectionitems/${collectionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCollectionItems(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        if (!token || !currentUserId) {
            window.location.href = "/";
        } else {
            getCollectionData();
        }
    }, [token, currentUserId]);

    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        } else if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError("An error occurred.");
        }
    };

    const handleItemCreate = async (newItemData) => {
        try {
            newItemData.collectionId = collectionId;
            setError("");
            const response = await axios.post(`${baseUrl}/api/Item/create`, newItemData);
            setShowCreateModal(false);
            toast.success('Collection created.', {
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("Failed to create the collection. An error occurred.");
            }
        }
    };

    const handleEditItem = () => {
        // Handle edit logic
    }

    const handleDeleteItem = () => {
        // Handle delete logic
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
            />
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} sm={12}>
                        <Search />
                    </Col>
                    <Col md={2} sm={12}>
                        <ProfileBtn />
                    </Col>
                </Row>
                {error && <div className="alert alert-danger mt-4">{error}</div>}
                <Row>
                    <Col className="mt-4">
                        <h3>Collection Details</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b>Name:</b> {collectionData.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b>Description:</b></p>
                        <div dangerouslySetInnerHTML={{ __html: collectionData.description }} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Topic: {topicData.name}</p>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col md={6}>
                        <div className="mt-2">
                            <h3>Items</h3>
                        </div>
                    </Col>
                    <Col md={6} className="text-right">
                        <Button variant="success" className="mt-2" onClick={() => setShowCreateModal(true)}>
                            Create
                        </Button>
                    </Col>
                </Row>
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Create Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateItem createItem={handleItemCreate} />
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
}

export default Collection;