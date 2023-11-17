import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

function LogOutBtn() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseModal();
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col className="text-right mt-3">
            <Button variant="danger" onClick={handleShowModal} className="btn-block">
              <FormattedMessage id="logout.logout" />
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="logout.confirmTitle" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><FormattedMessage id="logout.confirmMessage" /></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            <FormattedMessage id="logout.cancel" />
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            <FormattedMessage id="logout.logout" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LogOutBtn;