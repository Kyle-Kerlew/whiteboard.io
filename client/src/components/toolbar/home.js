import React from 'react';
import '../../styles/popover.css';
import {v4 as uuidv4} from 'uuid';
import {useHistory} from "react-router-dom";
import {Socket} from '../socket/socket';
import Button from 'react-bootstrap/Button';
import {Container} from "react-bootstrap";

function Home() {
    const history = useHistory();

    function createNewWhiteboard() {
        const whiteboardUuid = btoa(uuidv4());
        history.push(`/${whiteboardUuid}`);
        Socket.emit('create-whiteboard', {
            whiteboardId: whiteboardUuid,
            data: []
        })
    }

    return (
        <Container className={'flex-container'} fluid>
            <h1 style={{fontSize: '60px', textAlign: 'center', verticalAlign: 'top'}}>Whiteboard IO</h1>
            <p style={{fontSize: '18px', textAlign: 'center', maxWidth: '490px'}}>
                Whiteboard IO is an open source tool for collaborative drawing in real time. It
                simplifies planning, instructing, and documenting.
            </p>
            <Button onClick={createNewWhiteboard} style={{alignSelf: 'center'}} variant="primary" size="lg">Let's Start</Button>

            <p style={{fontSize: '60px', paddingTop: '50px', textAlign: 'center', maxWidth: '490px'}}>
                1,000,502
                <p style={{fontSize: '18px', textAlign: 'center', maxWidth: '490px'}}>Whiteboards have been created.</p>
            </p>
        </Container>

    )
}

export default Home;