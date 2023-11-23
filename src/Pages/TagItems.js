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
import MainBtn from "../Components/MainBtn";

const baseUrl = 'https://alexav-001-site1.anytempurl.com';

function TagItems() {
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState();
    const [items, setItems] = useState([]);
    const [tag, setTag] = useState();

    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");

    const getTagItems = async () => {
        const tag = localStorage.getItem("tag");
        setTag(tag);
        const sanitizedTag = tag ? tag.replace(/#/g, '%23') : '';
        try {
            const response = await axios.get(`${baseUrl}/api/Item/getitemsbytag?tag=${sanitizedTag}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setItems(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const handleError = (error) => {
        if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError(<FormattedMessage id="item.anErrorOccurred" />);
        }
    };

    const getData = () => {
        getTagItems();
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

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md={1} sm={12}>
                        <MainBtn />
                    </Col>
                    <Col md={7} sm={12}>
                        <Search />
                    </Col>
                    <Col md={1} sm={12}>
                        <ProfileBtn />
                    </Col>
                    <Col md={1} sm={12} className="btn-block">
                        <ChooseTheme />
                    </Col>
                    <Col md={2} sm={12} className="btn-block">
                        <ChooseLanguage />
                    </Col>
                </Row>
                {error && <div className="alert alert-danger mt-4">{error.toString()}</div>}
                <Row>
                    <Col className="mt-4">
                        <h4>{tag}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-4">
                        <h5><FormattedMessage id="tagitems.tagitems" /></h5>
                        <ul>
                            {items && items.map(item => (
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
                                    <hr></hr>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default TagItems;