import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from 'react-select';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

const CreateItem = ({ createItem }) => {
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [imageLink, setImageLink] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [fieldValue, setFieldValue] = useState("");
    const [autocompleteOptions, setAutocompleteOptions] = useState([]);

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    useEffect(() => {
        fetchTagsAutocomplete();
    }, []);

    const fetchTagsAutocomplete = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Tag/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const tagNames = response.data.map(tag => tag.Tag);
            setAutocompleteOptions(tagNames.map(tagName => ({ value: tagName, label: tagName })));
        } catch (error) {
            handleError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedTags = tags.map(tag => (tag.startsWith("#") ? tag : `#${tag}`));

        const newItem = {
            name,
            tags: formattedTags.map(tag => ({ tag })),
            imageLink,
            collectionId: 0,
            itemFieldValues: [
                {
                    value: fieldValue,
                    collectionFieldId: 4 //
                }
            ]
        };

        try {
            createItem(newItem);
            setName("");
            setTags([]);
            setImageLink("");
            setFieldValue("");
        } catch (error) {
            handleError(error);
        }
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

    const handleTagInputChange = (inputValue) => {
        setTagInput(inputValue);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (removedTag) => {
        setTags(tags.filter(tag => tag !== removedTag));
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger mt-4">{error}</div>}
                <Form.Group as={Row} className="mt-2">
                    <Form.Label column sm="2">Name *</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-2">
                    <Form.Label column sm="2">Tags</Form.Label>
                    <Col sm="10">
                        <Select
                            isMulti
                            options={autocompleteOptions}
                            value={tags.map(tag => ({ value: tag, label: tag }))}
                            onChange={(selectedOption) => setTags(selectedOption ? selectedOption.map(option => option.value) : [])}
                            onInputChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Imput tags..."
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-2">
                    <Form.Label column sm="2">Image Link</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value={imageLink} onChange={(e) => setImageLink(e.target.value)} placeholder="Image Link" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-2">
                    <Form.Label column sm="2">Field Value</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} placeholder="Field Value" />
                    </Col>
                </Form.Group>
                <Row className="mt-2">
                    <Col>
                        <Button type="submit" variant="success">Create</Button>
                    </Col>
                </Row>
            </Form>
            {tags.length > 0 && (
                <div className="mt-3">
                    <strong>Selected tags:</strong>
                    <ul>
                        {tags.map((tag, index) => (
                            <li key={index}>
                                {tag}
                                <span
                                    style={{ cursor: "pointer", marginLeft: "0.5rem", color: "red" }}
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    &times;
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default CreateItem;