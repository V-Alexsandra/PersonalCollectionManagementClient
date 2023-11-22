import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FormattedMessage } from 'react-intl';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Login() {
    const token = sessionStorage.getItem("token");

    const [userRole, setUserRole] = useState();

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
    
            const userRoleResponse = await getUserRoles(id);
    
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("id", id);
    
            if (userRoleResponse) {
                localStorage.setItem("role", userRoleResponse);
            }
    
            navigate("/");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("Login failed. An error occurred.");
            }
        }
    };
    
    const getUserRoles = async (userId) => {
        try {
            const response = await axios.get(`${baseUrl}/api/Admin/getrole/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            const role = response.data;
    
            return role;
        } catch (error) {
            handleError(error);
            return null;
        }
    };
    
    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        } else if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError(<FormattedMessage id="login.anErrorOccurred" />);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 className="text-center mt-4"><FormattedMessage id="login.login" /></h3>
                    <Form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger mt-4">{error}</div>}
                        <Form.Group>
                            <Form.Label><FormattedMessage id="login.email" /></Form.Label>
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
                            <Form.Label><FormattedMessage id="login.password" /></Form.Label>
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
                                    <FormattedMessage id="login.loginButton" />
                                </Button>
                                <Link to="/registration">
                                    <Button variant="secondary" className="btn-block">
                                    <FormattedMessage id="login.registrationButton" />
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

export default Login;