import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function ChooseTheme() {
    const [currentTheme, setCurrentTheme] = useState('light');
    const [error, setError] = useState(null);

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const response = await axios.get(
                        `${baseUrl}/api/User/gettheme`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            params: { id: currentUserId },
                        }
                    );
    
                    setCurrentTheme(response.data);
                    updateThemeInIndexHtml(response.data);
                } catch (error) {
                    handleError(error);
                }
            }
        };
    
        fetchData();
    }, [token, currentUserId]);    

    const changeTheme = async () => {
        if (!token) {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setCurrentTheme(newTheme);
            updateThemeInIndexHtml(newTheme);
            return;
        }

        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        try {
            const response = await axios.put(
                `${baseUrl}/api/User/theme`,
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: { theme: newTheme, id: currentUserId },
                }
            );

            setCurrentTheme(newTheme);
            updateThemeInIndexHtml(newTheme);
        } catch (error) {
            handleError(error);
        }
    };

    const updateThemeInIndexHtml = (newTheme) => {
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('data-bs-theme', newTheme);
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        } else if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError("chooseTheme.anErrorOccurred");
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col className="text-right mt-3">
                    <Button variant="light" onClick={changeTheme}>
                        {currentTheme === 'light' ? (
                            <FormattedMessage id="chooseTheme.dark" />
                        ) : (
                            <FormattedMessage id="chooseTheme.light" />
                        )}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ChooseTheme;