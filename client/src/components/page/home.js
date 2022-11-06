import React from 'react';
import '../../styles/home.css';
import {
    useHistory,
} from 'react-router-dom';
import {
    WhiteboardController,
} from '../../handlers/rest/whiteboardController';
import EasyToUseIcon from '../../resources/svg/easy-to-use-icon.svg';
import MarkerIcon from '../../resources/svg/marker-icon.svg';
import Button from '../shared/button';
import Footer from '../shared/footer';
import Line from '../shared/line';
import Writing from '../svg/writing.svg';
import '../../styles/animations.css';

const Home = () => {
    const history = useHistory();

    async function createNewWhiteboard() {
        try {
            const response = await WhiteboardController.createWhiteboard();
            history.push(`/boards/${response._id}`);
        } catch {
            // todo: toast
        }
    }

    return (
        <div className='flex-container container-xl'>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{
                    flex: '1 1 50%',
                    flexDirection: 'column',
                    maxWidth: '500px',
                    gap: '15px'

                }}
                >

                    <h1>Whiteboard IO</h1>
                    <div className='text-button-container'>
                        <p style={{
                            color: '#8A969F',
                            fontSize: '16px',
                            textAlign: 'left',
                        }}
                        >
                            Whiteboard IO is an open source tool for collaborative drawing in real time. It
                            simplifies planning, instructing, and documenting.
                        </p>
                        <div className='button-row'>
                            <Button grow onClick={createNewWhiteboard}>Get
                                Started</Button>
                            <Button
                                grow onClick={() => window.open('https://github.com/Kyle-Kerlew/whiteboard.io')}
                                variant='secondary'
                            >View Github</Button>
                        </div>
                    </div>
                </div>
                <div style={{
                    alignItems: 'center',
                    backgroundColor: 'orange',
                    display: 'flex',
                    height: '500px',
                    width: '500px',
                }}
                >
                    <img
                        className='marker-icon' src={MarkerIcon}
                        style={{
                            height: '100%',
                            left: '165px',
                            position: 'relative',
                            rotate: '',
                            top: '-60px',
                            width: '100px',
                            zIndex: '1',
                        }}
                    />
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        height: '150px',
                        left: '-50px',
                        margin: '0 auto ',
                        padding: '20px',
                        position: 'relative',
                        width: '200px',
                    }}
                    >
                        <div className='line-container'>
                            {Array.from({
                                length: 3,
                            }).map((unused, index) => {
                                return <img
                                    alt='writing-line' className={`line-${index + 1}`}
                                    key={index}
                                    src={Writing}
                                />;
                            })}
                        </div>

                    </div>
                </div>
            </div>
            <Line/>
            <div className='features container-xl'>
                <h1 style={{
                    color: '#151719',
                    fontSize: 56,
                    textAlign: 'center',
                    verticalAlign: 'top',
                }}
                >
                    Build Up the Big Picture
                </h1>
                <div className='text-button-container'>
                    <p style={{
                        color: '#8A969F',
                        fontSize: '18px',
                        textAlign: 'center',
                    }}
                    >
                        Let Whiteboard help you visualize and collaborate in your next meeting, brainstorm session, or
                        class!
                    </p>
                </div>
                <div className={'d-flex'}>
                    <div className='column'>
                        <img alt='Easy to use' height={50} src={EasyToUseIcon} width={50}/>
                        <h4>
                            Easy to Use
                        </h4>
                        <p>Let Whiteboard help you visualize and collaborate in your next meeting, brainstorm session,
                            or
                            class!</p>
                    </div>
                    <div className='column'>
                        <img alt='Easy to use' height={50} src={EasyToUseIcon} width={50}/>
                        <h4>
                            Collaborate
                        </h4>
                        <p style={{
                            alignSelf: 'flex-end',
                            flexGrow: 1,
                        }}
                        >Whiteboard offers real-time updates so you can
                            collaborate quickly and effectively.</p>
                    </div>
                    <div className='column'>
                        <img alt='Easy to use' height={50} src={EasyToUseIcon} width={50}/>
                        <h4>
                            Keep Organized
                        </h4>
                        <p>Whiteboard IO will keep track of all the projects you are a part of so you don’t have to!</p>
                    </div>
                </div>
            </div>
            <Line/>
            <div className='snap'>
                <h1 style={{
                    color: '#151719',
                    fontSize: 56,
                    textAlign: 'center',
                    verticalAlign: 'top',
                }}
                >
                    A New Way of Brainstorming
                </h1>
                <div className='text-button-container'>
                    <p style={{
                        color: '#8A969F',
                        fontSize: '18px',
                        textAlign: 'center',
                    }}
                    >
                        In the age of being remote, Whiteboard can serve as an easy tool to help you be as close as
                        ever!
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '50px 0',
                }}
                >
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{
                            flex: '1 1 50%',
                            flexDirection: 'column',
                            maxWidth: '500px',
                        }}
                        >
                            <h4>Visualize Workflows</h4>
                            <p style={{
                                color: '#8A969F',
                                textAlign: 'left',
                            }}
                            >Let Whiteboard help you
                                visualize and collaborate in your next
                                Let Whiteboard help you visualize and collaborate in your next
                                meeting, brainstorm session, or
                                class!</p>
                        </div>
                        <img
                            alt='Image of app being used'
                            src='../../demo/Rectangle.png'
                            style={{
                                maxWidth: '100%',
                                minHeight: '285px',
                                minWidth: '285px',
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >

                    <img
                        alt='Image of app being used'
                        src='../../demo/Rectangle.png'
                        style={{
                            maxWidth: '100%',
                            minHeight: '285px',
                            minWidth: '285px',
                        }}
                    />
                    <div style={{
                        flex: '1 1 50%',
                        flexDirection: 'column',
                        maxWidth: '500px',
                        textAlign: 'center',
                    }}
                    >
                        <h4>Visualize Workflows</h4>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',

                        }}
                        >
                            <p style={{
                                color: '#8A969F',
                                textAlign: 'center',
                            }}
                            >
                                Let Whiteboard help you visualize and collaborate in your next meeting, brainstorm
                                session, or class!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Line/>
            <Footer/>
        </div>

    );
};

export default Home;
