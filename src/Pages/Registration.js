import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Registration() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const response = await axios.post(
                `${baseUrl}/api/User/register`,
                formData
            );
            
            toast.success('Collection created.', {
                onClose: () => {
                    navigate("/login");
                }
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("Registration failed. An error occurred.");
            }
        }
    };

    return (
        <Container>
            <ToastContainer
                position="top-center"
                autoClose={2000}
            />
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 className="text-center mt-4">Registration</h3>
                    <Form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger mt-4">{error}</div>}
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                pattern="^\S+@\S+\.\S+$"
                                title="Please enter a valid email address."
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                title="The entered password must have minimum 8 characters, at least 1 alphabet, 1 number, and 1 special character."
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Row>
                            <Form.Group className="d-flex justify-content-between">
                                <Button type="submit" variant="primary" className="btn-block">
                                    Register
                                </Button>
                                <Link to="/login">
                                    <Button variant="secondary" className="btn-block">LogIn</Button>
                                </Link>
                            </Form.Group>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Registration;