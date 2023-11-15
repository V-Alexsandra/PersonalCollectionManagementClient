import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Search from "../Components/Search";
import ProfileBtn from "../Components/ProfileBtn";
import { Link } from "react-router-dom";
import ChooseTheme from "../Components/ChooseTheme";

function Main() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    useEffect(() => {
        if (!token || !currentUserId) {
            setIsLoggedIn(false);
        }
        else {
            setIsLoggedIn(true);
        }
    }, [token, currentUserId]);

    return (
        <>
            <Container>
                <Row>
                    <Col md={7} sm={12}>
                        <Search />
                    </Col>
                    {!isLoggedIn ? (
                        <Col md={4} sm={12}>
                            <Link to="/login">
                                <Button type="submit" variant="success" className="btn-block  mt-3">
                                    LogIn
                                </Button>
                            </Link>
                        </Col>) :
                        <Col md={4} sm={12}>
                            {!isLoggedIn ? (
                                <Link to="/profile">
                                    <Button variant="primary" className="btn-block mt-3">
                                        Profile
                                    </Button>
                                </Link>
                            ) : (
                                <ProfileBtn />
                            )}
                        </Col>}
                    <Col md={1} sm={12}>
                        <ChooseTheme />
                    </Col>
                </Row>
            </Container >
        </>
    );
}

export default Main;
