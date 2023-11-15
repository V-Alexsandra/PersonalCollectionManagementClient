import React from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProfileBtn() {

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="mt-3">
                        <Link to="/profile">
                            <Button variant="primary" className="btn-block">
                                Profile
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProfileBtn;
