import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Table, Form } from "react-bootstrap";
import ProfileBtn from "../Components/ProfileBtn";
import Search from "../Components/Search";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Admin() {
    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} sm={12}>
                        <Search />
                    </Col>
                    <Col md={2} sm={12}>
                        <ProfileBtn />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Admin;