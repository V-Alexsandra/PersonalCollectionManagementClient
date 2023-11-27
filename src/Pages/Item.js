import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormattedMessage } from 'react-intl';
import { TagCloud } from 'react-tagcloud';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useNavigate } from 'react-router-dom';
import ProfileBtn from '../Components/ProfileBtn';
import Search from '../Components/Search';
import MainBtn from '../Components/MainBtn';
import ChooseTheme from '../Components/ChooseTheme';
import baseUrl from '../Config';

function Item() {
    const [error, setError] = useState(null);
    const [itemData, setItemData] = useState({});
    const [collectionFields, setCollectionFields] = useState([]);
    const [tags, setTags] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [likes, setLikes] = useState();
    const [userData, setUserData] = useState({});

    const collectionId = localStorage.getItem('selectedCollectionId');
    const itemId = localStorage.getItem('selectedItemId');
    const token = sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("id");
    const isUserAuthenticated = !!token;

    const getItemData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Item/itembyid/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setItemData(response.data);
            await getCollectionFields();
            await getItemTags();
            await getComments();
            await getLikes();
        } catch (error) {
            handleError(error);
        }
    }

    const getItemTags = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Item/itemtags/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setTags(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const getCollectionFields = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/collectionfields/${collectionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setCollectionFields(response.data);

            await Promise.all(response.data.map(field => getFieldsValues(field.id)));
        } catch (error) {
            handleError(error);
        }
    }

    const getFieldsValues = async (fieldId) => {
        try {
            const response = await axios.get(`${baseUrl}/api/Collection/itemfieldvalues/${fieldId}/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCollectionFields(prevFields => prevFields.map(field => {
                if (field.id === fieldId) {
                    return { ...field, values: response.data };
                }
                return field;
            }));
        } catch (error) {
            handleError(error);
        }
    }

    const getUserData = async (id) => {
        try {
            const response = await axios.get(`${baseUrl}/api/User/profile/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const userData = response.data;

            setUserData((prevUserData) => ({
                ...prevUserData,
                [userData.userId]: userData,
            }));

            return userData;
        } catch (error) {
            return null;
        }
    };

    const getComments = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Comment/getcomments/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const commentsData = response.data;

            const userDataPromises = commentsData.map(async (comment) => {
                const userData = await getUserData(comment.userId);
                return userData || {};
            });

            const userDataArray = await Promise.all(userDataPromises);

            const userDataDictionary = commentsData.reduce((acc, comment, index) => {
                acc[comment.userId] = userDataArray[index];
                return acc;
            }, {});

            setComments(commentsData);
            setUserData(userDataDictionary);
        } catch (error) {
            handleError(error);
        }
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const submitComment = async () => {
        if (isUserAuthenticated) {
            try {
                const commentData = {
                    text: newComment,
                    itemId: itemId,
                    userId: currentUserId
                };

                await axios.post(
                    `${baseUrl}/api/Comment/create`,
                    commentData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                setNewComment("");
                getComments();
            } catch (error) {
                handleError(error);
            }
        } else {
            toast.error(<FormattedMessage id="item.logincomment" />);
        }
    };

    const getLikes = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Like/count/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setLikes(response.data);
        } catch (error) {
            handleError(error);
        }
    }

    const handleLike = async () => {
        if (isUserAuthenticated) {
            try {
                const data = {
                    itemId: itemId,
                    userId: currentUserId
                };

                await axios.post(`${baseUrl}/api/Like/Like`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                getLikes();
            } catch (error) {
                handleError(error);
            }
        } else {
            toast.error(<FormattedMessage id="item.loginlike" />);
        }
    }

    const connectToCommentHub = async () => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/commentHub`)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveComments", (itemId) => {
            getComments();
        });

        try {
            await connection.start();
        } catch (error) {
            handleError(error);
        }
    };

    const connectToLikeHub = async () => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/likeHub`)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveLikeCount", (itemId, likeCount) => {
            getLikes();
        });

        try {
            await connection.start();
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getItemData();
                await connectToCommentHub();
                await connectToLikeHub();
            } catch (error) {
                handleError(error);
            }
        };

        fetchData();
    }, []);

    const handleError = (error) => {
        if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError(<FormattedMessage id="item.anErrorOccurred" />);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    
    const navigate = useNavigate();
    
    const handleTagClick = (tag) => {
        console.log(tag);
        localStorage.setItem('tag', tag);
        navigate('/tagitems');
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
            />
            <Container>
                <Row className="justify-content-center">
                    <Col md={1} sm={12}>
                        <MainBtn />
                    </Col>
                    <Col md={9} sm={12}>
                        <Search />
                    </Col>
                    <Col md={1} sm={12}>
                        <ProfileBtn />
                    </Col>
                    <Col md={1} sm={12} className="btn-block">
                        <ChooseTheme />
                    </Col>
                </Row>
                {error && <div className="alert alert-danger mt-4">{error}</div>}
            </Container>
            <Container>
                <Row>
                    <Col className="mt-4">
                        <h3> <FormattedMessage id="item.details" /></h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b><FormattedMessage id="item.name" />: </b> {itemData.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p><b><FormattedMessage id="item.creationDate" />: </b>{formatDate(itemData.creationDate)}</p>
                    </Col>
                </Row>
                {collectionFields.map((field, index) => (
                    <Row key={index}>
                        <Col>
                            <p><b>{field.name}:</b> {field.values && field.values.length > 0 ? field.values[0].value : 'No values'}</p>
                        </Col>
                    </Row>
                ))}
                <hr></hr>
                <Row>
                    <Col>
                        <h6><FormattedMessage id="item.tags" /></h6>
                        <TagCloud
                            tags={tags.map(tag => ({ value: tag.tag, count: 1 }))}
                            minSize={12}
                            maxSize={24}
                            onClick={(tag) => handleTagClick(tag.value)}
                        />
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col>
                        <p className="mt-2">
                            <b><FormattedMessage id="item.likes" />:</b> {likes}
                        </p>
                    </Col>
                    <Col>
                        <Button className="mt-1" onClick={handleLike}>
                            <FormattedMessage id="item.like" />
                        </Button>

                    </Col>
                </Row>
                <div className="border p-4 border-2 mt-4">
                    <Row>
                        <Col>
                            <Form.Group as={Row} className="mt-2">
                                <Form.Label column sm="2"><FormattedMessage id="item.addComment" />: </Form.Label>
                                <Form.Control
                                    type="text"
                                    step="0.01"
                                    value={newComment}
                                    onChange={handleCommentChange}
                                />
                            </Form.Group>
                            <Button className="mt-2" onClick={submitComment}><FormattedMessage id="item.submitComment" /></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 className="mt-4"><FormattedMessage id="item.comments" /></h5>
                            {comments.map(comment => (
                                <div key={comment.id} className="mt-2">
                                    <p><b>User:</b> {userData[comment.userId] ? userData[comment.userId].userName : 'Unknown User'}</p>
                                    <p>{comment.text}</p>
                                    <p>{formatDate(comment.date)}</p>
                                    <hr></hr>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
}

export default Item;