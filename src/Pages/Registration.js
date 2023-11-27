import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormattedMessage } from 'react-intl';
import baseUrl from '../Config';

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
            
            toast.success(<FormattedMessage id="registration.userregister" />, {
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
                    <h3 className="text-center mt-4"><FormattedMessage id="registration.registration" /></h3>
                    <Form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger mt-4">{error}</div>}
                        <Form.Group>
                            <Form.Label><FormattedMessage id="registration.name" /></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label><FormattedMessage id="registration.email" /></Form.Label>
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
                            <Form.Label><FormattedMessage id="registration.password" /></Form.Label>
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
                            <Form.Label><FormattedMessage id="registration.repeatPassword" /></Form.Label>
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
                                <FormattedMessage id="registration.registerButton" />
                                </Button>
                                <Link to="/login">
                                    <Button variant="secondary" className="btn-block">
                                    <FormattedMessage id="registration.loginButton" />
                                    </Button>
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