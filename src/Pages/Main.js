import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Search from "../Components/Search";
import ProfileBtn from "../Components/ProfileBtn";
import { Link } from "react-router-dom";
import ChooseTheme from "../Components/ChooseTheme";
import { FormattedMessage } from 'react-intl';
import ChooseLanguage from "../Components/ChooseLanguage";
import { TagCloud } from 'react-tagcloud';
import axios from "axios";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function Main() {
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tags, setTags] = useState([]);
    const [largestCollections, setLargestCollections] = useState([]);
    const [userRole, setUserRole] = useState();
    const [lastAddedItems, setLastAddedItems] = useState([]);

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    const getTags = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Item/uniquetags`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setTags(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        } else if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError(<FormattedMessage id="item.anErrorOccurred" />);
        }
    };

    const getLargestCollections = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/largest`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setLargestCollections(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const getLastAddedItems = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Item/getlastaddeditems`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setLastAddedItems(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const getData = () => {
        getTags();
        getLargestCollections();
        getLastAddedItems();
    }

    useEffect(() => {
        const fetchData = async () => {
            const role = localStorage.getItem("role");
            setUserRole(role);

            if (!token || !currentUserId) {
                setIsLoggedIn(false);
                getData();
            } else {
                setIsLoggedIn(true);
                getData();
            }
        };

        fetchData();
    }, [token, currentUserId]);

    const handleCollectionClick = (collectionId) => {
        localStorage.setItem('selectedCollectionId', collectionId);
    };


    return (
        <>
            <Container>
                <Row>
                    <Col md={7} sm={12}>
                        <Search />
                    </Col>
                    {!isLoggedIn ? (

                        <Col md={2} sm={12}>
                            <Link to="/login">
                                <Container>
                                    <Row className="justify-content-center">
                                        <Col className="mt-3">
                                            <Button type="submit" variant="success" className="btn-block">
                                                <FormattedMessage id="main.logIn" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Link>
                        </Col>

                    ) :
                        <Col md={2} sm={12}>
                            {!isLoggedIn ? (
                                <Link to="/profile">
                                    <Button variant="primary" className="btn-block mt-3">
                                        <FormattedMessage id="main.profile" />
                                    </Button>
                                </Link>
                            ) : (
                                <ProfileBtn />
                            )}
                        </Col>}
                    <Col md={2} sm={12} className="btn-block">
                        <ChooseLanguage />
                    </Col>
                    <Col md={1} sm={12} className="btn-block">
                        <ChooseTheme />
                    </Col>
                </Row>
                {error && <div className="alert alert-danger mt-4">{error}</div>}
                <Row>
                    <Col className="mt-4">
                        <h5><FormattedMessage id="main.top" /></h5>
                        <ul>
                            {largestCollections && largestCollections.map(collection => (
                                <li key={collection.id}>
                                    <Link to={`/collection/${collection.name}`} onClick={() => handleCollectionClick(collection.id)} className="link-style">
                                        <p>{collection.name}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-4">
                        <h5><FormattedMessage id="main.tags" /></h5>
                        <TagCloud
                            tags={tags ? tags.map(tag => ({ value: tag.tag, count: 1 })) : []}
                            minSize={12}
                            maxSize={25}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-4">
                        <h5><FormattedMessage id="main.lastAddedItems" /></h5>
                        <ul>
                            {lastAddedItems && lastAddedItems.map(item => (
                                <li key={item.id}>
                                    <Row>
                                        <Link to={`/item/${item.id}`} className="mr-2 link-style">
                                            <span><FormattedMessage id="main.item" /> {item.name}</span>
                                        </Link>
                                        <Link to={`/collection/${item.collectionId}`} className="mr-2 link-style">
                                            <span><FormattedMessage id="main.collection" /> {item.collectionName}</span>
                                        </Link>
                                        <span><FormattedMessage id="main.author" /> {item.author}</span>
                                    </Row>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Main;