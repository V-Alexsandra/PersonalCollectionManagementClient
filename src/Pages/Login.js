import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            const response = await axios.post(`${baseUrl}/api/User/login`, formData);
            const { id, token } = response.data;

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("id", id);

            navigate("/");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("Login failed. An error occurred.");
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 className="text-center mt-4">Log In</h3>
                    <Form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger mt-4">{error}</div>}
                        <Form.Group>
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
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Row>
                            <Form.Group className="d-flex justify-content-between">
                                <Button type="submit" variant="primary" className="btn-block">
                                    LogIn
                                </Button>
                                <Link to="/registration">
                                    <Button variant="secondary" className="btn-block">Registration</Button>
                                </Link>
                            </Form.Group>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;