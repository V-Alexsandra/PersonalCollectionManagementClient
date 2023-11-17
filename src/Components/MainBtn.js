import React from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from 'react-intl';

function MainBtn() {
    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="text-right mt-3">
                        <Link to="/">
                            <Button variant="primary" className="btn-block">
                                <FormattedMessage id="mainBtn.main" />
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MainBtn;