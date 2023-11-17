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
import { FormattedMessage } from 'react-intl';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Collection() {
    const [error, setError] = useState(null);
    const [collectionData, setCollectionData] = useState({});
    const [topicData, setTopicData] = useState({});
    const [collectionItems, setCollectionItems] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [collectionFields, setCollectionFields] = useState([]);
    const [collectionFieldValues, setCollectionFieldValues] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState();

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
            getCollectionFields();
        } catch (error) {
            handleError(error);
        }
    };


    const getCollectionFields = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/collectionfields/${collectionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCollectionFields(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    const getCollectionTopic = async (topicId) => {
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
        try {
            if (!token || !currentUserId) {
                window.location.href = "/";
            } else {
                getCollectionData();
            }
        } catch (error) {
            handleError(error);
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
            toast.success('Item created.', {
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (error) {
            handleError(error);
        }
    };

    const handleEditItem = () => {
        // Handle edit logic
    }

    const handleDeleteItem = (itemId) => {
        setItemToDelete(itemId);
        setShowDeleteModal(true);
    };

    //
    const confirmDeleteItem = async () => {
        try {
            setError("");
            await axios.delete(`${baseUrl}/api/Item/Delete/${itemToDelete}`);
            getCollectionItems();
            setShowDeleteModal(false);
            toast.success('Item deleted.', {
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (error) {
            handleError(error);
        }
    };


    const renderCollectionItems = () => {
        const hasStringField = collectionFields.some((field) => field.type === "string");
        const hasDateField = collectionFields.some((field) => field.type === "date");

        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        return collectionItems.map((item) => {
            return (
                <tr key={item.id}>
                    {hasStringField &&
                        collectionFields.map(
                            (field) =>
                                field.type === "string" && (
                                    <td key={field.id}>
                                        {collectionFieldValues.find((value) => value.collectionFieldId === field.id)?.value || ""}
                                    </td>
                                )
                        )}
                    {hasDateField &&
                        collectionFields.map(
                            (field) =>
                                field.type === "date" && (
                                    <td key={field.id}>
                                        {formatDate(collectionFieldValues.find((value) => value.collectionFieldId === field.id)?.value)}
                                    </td>
                                )
                        )}
                    <td>{formatDate(item.creationDate)}</td>
                    <td>
                        <Button variant="primary" size="sm" onClick={() => handleEditItem(item.id)}>
                            <FormattedMessage id="collection.edit" />
                        </Button>
                    </td>
                    <td>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <FormattedMessage id="collection.delete" />
                        </Button>
                    </td>
                </tr>
            );
        });
    };

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
                        <h3> <FormattedMessage id="collection.details" /></h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b><FormattedMessage id="collection.name" />:</b> {collectionData.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b><FormattedMessage id="collection.description" />:</b></p>
                        <div dangerouslySetInnerHTML={{ __html: collectionData.description }} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><FormattedMessage id="collection.topic" />: {topicData.name}</p>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col md={6}>
                        <div className="mt-2">
                            <h3><FormattedMessage id="collection.items" /></h3>
                        </div>
                    </Col>
                    <Col md={6} className="text-right">
                        <Button variant="success" className="mt-2" onClick={() => setShowCreateModal(true)}>
                            <FormattedMessage id="collection.create" />
                        </Button>
                    </Col>
                </Row>
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="collection.createItem" /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateItem createItem={handleItemCreate} />
                    </Modal.Body>
                </Modal>
                <Row>
                    <Col>
                        <div className="mt-4">
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        {collectionFields.map(field => (
                                            (field.type === "string" || field.type === "date") && (
                                                <th key={field.id}>{field.name}</th>
                                            )
                                        ))}
                                        <th><FormattedMessage id="collection.creationDate" /></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderCollectionItems()}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="collection.confirmDeletion" /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><FormattedMessage id="collection.confirmDeleteMessage" /></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            <FormattedMessage id="collection.cancel" />
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteItem}>
                            <FormattedMessage id="collection.delete" />
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

export default Collection;