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
    const [collectionFields, setCollectionFields] = useState([]);
    const [fieldValue, setFieldValue] = useState("");
    const [autocompleteOptions, setAutocompleteOptions] = useState([]);
    const [fieldValues, setFieldValues] = useState({});

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");
    const collectionId = localStorage.getItem('selectedCollectionId');

    useEffect(() => {
        fetchTagsAutocomplete();
        getCollectionFields();
    }, []);

    const fetchTagsAutocomplete = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Item/alltags`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            const options = response.data.map(tagObject => ({
                label: tagObject.tag,
                value: tagObject.tag,
            }));
            setAutocompleteOptions(options);
    
            console.log("Autocomplete Options:", options);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const itemFieldValues = Object.entries(fieldValues).map(([fieldId, value]) => ({
            collectionFieldId: fieldId,
            value,
        }));
    
        const formattedTags = tags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
    
        const newItem = {
            name,
            tags: formattedTags.map((tag) => ({ tag })),
            imageLink: "null",
            collectionId,
            itemFieldValues,
        };
    
        try {
            createItem(newItem);
            setName("");
            setTags([]);
            setImageLink("");
            setFieldValue("");
            setFieldValues({});
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

    const handleFieldValueChange = (fieldId, value) => {
        setFieldValues(prevFieldValues => ({
            ...prevFieldValues,
            [fieldId]: value
        }));
    };    

    const renderCollectionFields = () => {
        return collectionFields.map((field) => (
            <Form.Group key={field.id} as={Row} className="mt-2">
                <Form.Label column sm="2">{field.name}</Form.Label>
                <Col sm="10" className="mt-2">
                    {field.type === "string" && (
                        <Form.Control
                            type="text"
                            value={fieldValues[field.id] || ""}
                            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                            placeholder={`Enter ${field.name}`}
                        />
                    )}
                    {field.type === "int" && (
                        <Form.Control
                            type="number"
                            value={fieldValues[field.id] || ""}
                            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                            placeholder={`Enter ${field.name}`}
                        />
                    )}
                    {field.type === "bool" && (
                        <Form.Check
                            type="checkbox"
                            label={field.name}
                            checked={fieldValues[field.id] || false}
                            onChange={(e) => handleFieldValueChange(field.id, e.target.checked)}
                        />
                    )}
                    {field.type === "double" && (
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={fieldValues[field.id] || ""}
                            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                            placeholder={`Enter ${field.name}`}
                        />
                    )}
                    {field.type === "date" && (
                        <Form.Control
                            type="date"
                            value={fieldValues[field.id] || ""}
                            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                        />
                    )}
                </Col>
            </Form.Group>
        ));
    };

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          color: 'black',
        }),
        option: (provided, state) => ({
          ...provided,
          color: 'black',
        }),
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
                    <Col sm="10" className="mt-2">
                        <Select
                            isMulti
                            options={autocompleteOptions}
                            value={tags.map(tag => ({ value: tag, label: tag }))}
                            onChange={(selectedOption) => setTags(selectedOption ? selectedOption.map(option => option.value) : [])}
                            onInputChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Input tags..."
                            styles={customStyles}
                        />
                    </Col>
                </Form.Group>
                {renderCollectionFields()}
                <Row className="mt-2">
                    <Col>
                        <Button type="submit" variant="success">Create</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default CreateItem;