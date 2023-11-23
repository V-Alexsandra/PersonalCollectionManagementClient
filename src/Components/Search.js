import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Search() {

    const handleSearch = () => {
        toast.info('Will be implemented later...');
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
            />
            <Container>
                <Row className="justify-content-center">
                    <Col className="justify-content-center mt-3">
                        <InputGroup className="search">
                            <Form.Control
                                type="text"
                                name="searchdata"
                                required
                            />
                            <Button variant="primary" className="btn-block" onClick={() => handleSearch()}>
                                <FormattedMessage id="search.searchButton" />
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Search;