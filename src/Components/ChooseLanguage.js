import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import GlobalContext from '../contexts/globalContext';
import { Container, Row, Col } from "react-bootstrap";

const ChooseLanguage = () => {
  const handleLanguageChange = (selectedLanguage) => {
    setLocale(selectedLanguage);
    localStorage.setItem("locale", selectedLanguage);
  };

  const { locale, setLocale } = useContext(GlobalContext);

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} className="mt-3">
            <Dropdown>
              <Dropdown.Toggle variant="info" id="dropdown-basic">
                <FormattedMessage id="chooseLanguage.selectLanguage" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLanguageChange("EN")}>
                  English
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("RU")}>
                  Русский
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChooseLanguage;
