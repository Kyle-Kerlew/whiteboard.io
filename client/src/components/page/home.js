import React, {useEffect, useState} from 'react';
import '../../styles/popover.css';
import {useHistory} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {Container} from "react-bootstrap";
import {WhiteboardController} from '../../handlers/rest/whiteboardController';

function Home() {
    const history = useHistory();
    const [whiteboardCounter, setWhiteboardCounter] = useState();

    async function createNewWhiteboard() {
        try {
            const response = await WhiteboardController.createWhiteboard();
            history.push(`/${response.data._id}`);
        } catch (e) {
            //todo: toast
        }
    }

    useEffect(async () => {
        const result = await WhiteboardController.countWhiteboards();
        setWhiteboardCounter(result.data.count);
    }, []);

    return (
        <Container className={'flex-container'} fluid>
            <h1 style={{fontSize: '60px', textAlign: 'center', verticalAlign: 'top'}}>Whiteboard IO</h1>
            <p style={{fontSize: '18px', textAlign: 'center', maxWidth: '490px'}}>
                Whiteboard IO is an open source tool for collaborative drawing in real time. It
                simplifies planning, instructing, and documenting.
            </p>
            <Button onClick={createNewWhiteboard} style={{alignSelf: 'center'}} variant="primary" size="lg">Let's
                Start</Button>

            <div style={{fontSize: '60px', paddingTop: '50px', textAlign: 'center', maxWidth: '490px'}}>
                {whiteboardCounter}
                <p style={{fontSize: '18px', textAlign: 'center', maxWidth: '490px'}}>Whiteboards have been created.</p>
            </div>
        </Container>

    )
}

export default Home;