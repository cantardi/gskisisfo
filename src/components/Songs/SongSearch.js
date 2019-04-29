import React from 'react';
import { Container, Row, Form, Col, Button } from "react-bootstrap";

const SongSearch = () => {
    return (
        <Container className="ma2">
            <Form>
                <Form.Group as={Row} controlId="formSongName">
                    <Form.Label column md={3}>Song Name</Form.Label>
                    <Col md={6}>
                        <Form.Control id="formSongName" placeholder="Song Name" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formSongType">
                    <Form.Label column md={3}>Song Type</Form.Label>
                    <Col md={6}>
                    <Form.Control as="select">
                        <option>Choose...</option>
                        <option>Worship</option>
                        <option>Praise</option>
                        <option>Hymn</option>
                        <option>Sermon Intro</option>
                    </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formSongComposer">
                    <Form.Label column md={3}>
                    Song Composer
                    </Form.Label>
                    <Col md={6}>
                    <Form.Control placeholder="Song Composer" />
                    </Col>
                </Form.Group>

                <Button className="ma1" type="submit">Search</Button>
                <Button className="ma1" type="submit">Clear</Button>

            </Form>
        </Container>
                
    );
}

export default SongSearch;