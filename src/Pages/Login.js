import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

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
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/User/login`, formData);
            const { id, token } = response.data;

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("id", id);

            navigate("/users");
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
            <Row>
                <h1>Log In</h1>
                <Col>
                    <form onSubmit={handleSubmit}>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                                pattern="^\S+@\S+\.\S+$"
                                title="Please enter a valid email address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <br></br>
                        <Row>
                            <Col>
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </Col>
                            <Col>
                                <Link to="/registration">
                                    <button className="btn btn-primary">Registration</button>
                                </Link>
                            </Col>
                        </Row>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;