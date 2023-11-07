import React from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LogOutBtn() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="text-right mt-3">
                        <Button variant="danger" onClick={handleLogout} className="btn-block">
                            Log Out
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default LogOutBtn;
