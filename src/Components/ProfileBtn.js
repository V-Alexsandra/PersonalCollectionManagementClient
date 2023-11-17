import React from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from 'react-intl';

function ProfileBtn() {
    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="mt-3">
                        <Link to="/profile">
                            <Button variant="primary" className="btn-block">
                                <FormattedMessage id="profileBtn.profile" />
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProfileBtn;