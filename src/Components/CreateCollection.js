import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

const CreateCollection = ({ createCollection }) => {
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [topic, setTopic] = useState('');
    const [fields, setFields] = useState([{ type: '', name: '' }]);
    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    const [topicOptions, setTopicOptions] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');

    useEffect(() => {
        axios.get(`${baseUrl}/api/Collection/alltopics`)
            .then(response => {
                const topics = response.data;
                setTopicOptions(topics);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    window.location.href = "/";
                } else if (error.response && error.response.data) {
                    setError(error.response.data);
                } else {
                    setError("An error occurred.");
                }
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !selectedTopic || fields.some(field => !field.name || !field.type)) {
            setError("Please fill in all required fields");
            return;
        } else {
            setError(null);
        }

        const formattedFields = fields.map(field => ({
            type: field.type,
            name: field.name
        }));

        const newCollection = {
            name,
            description,
            imageLink: "null",
            topic: selectedTopic,
            userId: currentUserId,
            fields: formattedFields,
        };

        try {
            createCollection(newCollection);
            alert("Collection created.");
            setName('');
            setDescription('');
            setImageLink('');
            setTopic('');
            setFields([{ type: '', name: '' }]);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.location.href = "/";
            } else if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("An error occurred.");
            }
        }
    };

    const handleAddField = () => {
        setFields([...fields, { type: '', name: '' }]);
    };

    const handleDeleteField = () => {
        if (fields.length > 1) {
            const updatedFields = [...fields];
            updatedFields.pop();
            setFields(updatedFields);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger mt-4">{error}</div>}
            <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">Name *</Form.Label>
                <Col sm="10">
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">Description</Form.Label>
                <Col sm="10">
                    <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">Topic *</Form.Label>
                <Col sm="10">
                    <Form.Control as="select" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                        <option value="">Select a Topic</option>
                        {topicOptions.map((topic, index) => (
                            <option key={index} value={topic.name}>{topic.name}</option>
                        ))}
                    </Form.Control>
                </Col>
            </Form.Group>
            {fields.map((field, index) => (
                <Form.Group as={Row} key={index} className="mt-2">
                    <Form.Label column sm="2">Field Type *</Form.Label>
                    <Col sm="4">
                        <Form.Control as="select" value={field.type} onChange={(e) => {
                            const newFields = [...fields];
                            newFields[index].type = e.target.value;
                            setFields(newFields);
                        }}>
                            <option value="">Select a Type</option>
                            <option value="int">Integer</option>
                            <option value="string">String</option>
                            <option value="bool">Boolean</option>
                            <option value="double">Double</option>
                            <option value="date">Date</option>
                            <option value="decimal">Decimal</option>
                            <option value="datetime">DateTime</option>
                        </Form.Control>
                    </Col>
                    <Form.Label column sm="2">Field Name *</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text" value={field.name} onChange={(e) => {
                            const newFields = [...fields];
                            newFields[index].name = e.target.value;
                            setFields(newFields);
                        }} placeholder="Field Name" />
                    </Col>
                </Form.Group>
            ))}
            <Row className="mt-2">
                <Col>
                    <Button type="button" onClick={handleAddField}>
                        Add Field
                    </Button>
                    <span style={{ marginLeft: '10px' }}></span>
                    <Button type="button" variant="danger" onClick={handleDeleteField}>
                        Delete Field
                    </Button>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <Button type="submit" variant="success">Create</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default CreateCollection;