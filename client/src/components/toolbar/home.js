import React from 'react';
import '../../styles/popover.css';
import {v4 as uuidv4} from 'uuid';
import {useHistory} from "react-router-dom";
import {Socket} from '../socket/socket';
import Jumbotron from 'react-bootstrap/Jumbotron';
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
        <Jumbotron fluid>
            <Container fluid>
                <div className={'grid-container'}>
                    <div className={'grid-item'}>
                        <h1 style={{fontSize: '60px', textAlign: 'left'}}>Whiteboard IO</h1>
                        <div>

                            <p style={{fontSize: '18px', textAlign: 'left', maxWidth: '490px'}}>
                                Storybook is an open source tool for developing UI components and pages in isolation. It
                                simplifies building, documenting, and testing UIs.
                            </p>
                        </div>
                        <Button variant="primary" size="lg">Let's Start</Button>
                    </div>
                    <div className={'grid-item'}>
                        1,000,502 whiteboards have been created already!
                    </div>
                </div>
            </Container>


        </Jumbotron>
    )
}

export default Home;