import React from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function MainBtn() {

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="text-right mt-3">
                        <Link to="/">
                            <Button variant="primary" className="btn-block">
                                Main
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MainBtn;
