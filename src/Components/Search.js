import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FormattedMessage } from 'react-intl';

function Search() {
    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="justify-content-center mt-3">
                        <InputGroup className="search">
                            <Form.Control
                                type="text"
                                name="searchdata"
                                required
                            />
                            <Button variant="primary" className="btn-block">
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