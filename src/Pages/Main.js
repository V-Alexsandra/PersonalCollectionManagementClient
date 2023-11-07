import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Search from "../Components/Search";
import ProfileBtn from "../Components/ProfileBtn";
import { Link, useNavigate } from "react-router-dom";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Main() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    useEffect(() => {
        if (!token || !currentUserId) {
            setIsLoggedIn(false);
        }
        else {
            setIsLoggedIn(true);
            setShowAlert(true);
        }
    }, [token, currentUserId]);

    const handleAlert = () => {
        alert("Please log in to view your profile")
    };

    return (
        <>
            <Container>
                <Row>
                    <Col md={8} sm={12}>
                        <Search />
                    </Col>
                    <Col md={2} sm={12}>
                        {!isLoggedIn ? (
                            <Button onClick={handleAlert} variant="primary" className="btn-block mt-3">
                                Profile
                            </Button>
                        ) : (
                            <ProfileBtn />
                        )}
                    </Col>
                    {!isLoggedIn ? (
                        <Col md={2} sm={12}>
                            <Link to="/login">
                                <Button type="submit" variant="success" className="btn-block  mt-3">
                                    LogIn
                                </Button>
                            </Link>
                        </Col>) : null}
                </Row>
            </Container >
        </>
    );
}

export default Main;
