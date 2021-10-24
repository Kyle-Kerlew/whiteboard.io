import React from 'react';
import '../../styles/home.css';
import {useHistory} from "react-router-dom";
import {WhiteboardController} from '../../handlers/rest/whiteboardController';
import Button from "../shared/button";
import Line from "../shared/line";
import EasyToUseIcon from '../../resources/svg/easy-to-use-icon.svg';

function Home() {
    const history = useHistory();

    async function createNewWhiteboard() {
        try {
            const response = await WhiteboardController.createWhiteboard();
            history.push(`/boards/${response._id}`);
        } catch (e) {
            //todo: toast
        }
    }

    return (
        <div className={'flex-container'}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0 35px'}}>
                <div style={{flexDirection: 'column', flex: '1 1 50%'}}>
                    <h6>Whiteboard IO</h6>
                    <div className={'text-button-container'}>
                        <p style={{fontSize: '16px', textAlign: 'left', color: '#8A969F'}}>
                            Whiteboard IO is an open source tool for collaborative drawing in real time. It
                            simplifies planning, instructing, and documenting.
                        </p>
                        <div className={'button-row'}>
                            <Button grow onClick={createNewWhiteboard}>Get
                                Started</Button>
                            <Button grow onClick={() => window.open("https://github.com/Kyle-Kerlew/whiteboard.io")}
                                    variant="secondary">View Github</Button>
                        </div>
                    </div>
                </div>
                <div style={{flex: '1 1 50%'}}>
                    <img style={{maxWidth: '100%', minWidth: '200px', minHeight: '285px'}}
                         src={'../../demo/Rectangle.png'}
                         alt={"Image of app being used"}/>
                </div>
            </div>
            <Line/>

            <h1 style={{
                fontSize: 56,
                textAlign: 'center',
                verticalAlign: 'top',
                color: '#151719'
            }}>
                Build Up the Big Picture
            </h1>
            <div className={'text-button-container'}>
                <p style={{fontSize: '18px', textAlign: 'center', color: '#8A969F'}}>
                    Let Whiteboard help you visualize and collaborate in your next meeting, brainstorm session, or
                    class!
                </p>
            </div>

            <div className={'features'}>
                <div className={'column'}>
                    <img alt={"Easy to use"} width={50} height={50} src={EasyToUseIcon}/>
                    <h2>
                        Easy to Use
                    </h2>
                    <p>Let Whiteboard help you visualize and collaborate in your next meeting, brainstorm session, or
                        class!</p>
                </div>

                <div className={'column'}>
                    <img alt={"Easy to use"} width={50} height={50} src={EasyToUseIcon}/>
                    <h2>
                        Collaborate
                    </h2>
                    <p style={{flexGrow: 1, alignSelf: 'flex-end'}}>Whiteboard offers real-time updates so you can
                        collaborate quickly and effectively.</p>
                </div>
                <div className={'column'}>
                    <img alt={"Easy to use"} width={50} height={50} src={EasyToUseIcon}/>
                    <h2>
                        Keep Organized
                    </h2>
                    <p>Whiteboard IO will keep track of all the projects you are a part of so you don’t have to!</p>
                </div>
            </div>
            <Line/>

            <h1 style={{
                fontSize: 56,
                textAlign: 'center',
                verticalAlign: 'top',
                color: '#151719'
            }}>
                A New Way of Brainstorming
            </h1>
            <div className={'text-button-container'}>
                <p style={{fontSize: '18px', textAlign: 'center', color: '#8A969F'}}>
                    In the age of being remote, Whiteboard can serve as an easy tool to help you be as close as
                    ever!
                </p>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '50px 0',
            }}>
                <div
                    style={{display: 'flex', alignItems: 'center', gap: '0 35px'}}>
                    <div style={{flexDirection: 'column', flex: '1 1 50%'}}>
                        <h3>Visualize Workflows</h3>
                        <p style={{color: '#8A969F', textAlign: 'left', maxWidth: '350px'}}>Let Whiteboard help you
                            visualize and collaborate in your next
                            Let Whiteboard help you visualize and collaborate in your next
                            meeting, brainstorm session, or
                            class!</p>
                    </div>
                    <div style={{flex: '1 1 50%'}}>
                        <img style={{maxWidth: '100%', minWidth: '285px', minHeight: '285px'}}
                             src={'../../demo/Rectangle.png'}
                             alt={"Image of app being used"}/>
                    </div>
                </div>
                <div
                    style={{display: 'flex', alignItems: 'center', gap: '0 35px'}}>
                    <div style={{flex: '1 1 50%'}}>
                        <img style={{maxWidth: '100%', minWidth: '285px', minHeight: '285px'}}
                             src={'../../demo/Rectangle.png'}
                             alt={"Image of app being used"}/>
                    </div>
                    <div style={{flexDirection: 'column', flex: '1 1 50%', textAlign: 'center'}}>
                        <h3>Visualize Workflows</h3>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <p style={{color: '#8A969F', textAlign: 'center', maxWidth: '350px'}}>Let Whiteboard help
                                you
                                visualize and collaborate in your next
                                Let Whiteboard help you visualize and collaborate in your next
                                meeting, brainstorm session, or
                                class!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home;