import React from 'react';
import '../../styles/home.css';
import {
    useHistory,
} from 'react-router-dom';
import {
    WhiteboardController,
} from '../../handlers/rest/whiteboardController';
import EasyToUseIcon from '../../resources/svg/easy-to-use-icon.svg';
import CollaborationFriendlyIcon from '../../resources/svg/collaboration-friendly.svg';
import OrganizedIcon from '../../resources/svg/organized.svg';
import Button from '../shared/button';
import Footer from '../shared/footer';
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
        <div className='home-container'>
            {/* Navigation Bar */}
            <nav className='navbar-home'>
                <div className='navbar-content'>
                    <div className='navbar-logo'>
                        <span className='logo-icon'>🎨</span>
                        <span className='logo-text'>Whiteboard IO</span>
                    </div>
                    <div className='navbar-links'>
                        <a href='#features'>Features</a>
                        <a href='#how-it-works'>How It Works</a>
                        <a href='https://github.com/Kyle-Kerlew/whiteboard.io' target='_blank' rel='noopener noreferrer'>GitHub</a>
                    </div>
                    <div className='navbar-actions'>
                        <button className='login-btn'>Log In</button>
                        <Button onClick={createNewWhiteboard} className='get-started-nav'>Get Started</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className='hero-section'>
                <div className='hero-content'>
                    <div className='hero-text'>
                        <span className='hero-label'>REAL-TIME COLLABORATIVE WHITEBOARD</span>
                        <h1>
                            Think together.<br/>
                            <span className='text-highlight'>Draw it out.</span>
                        </h1>
                        <p>A simple, open source whiteboard for brainstorming, planning, and turning ideas into something everyone can see.</p>
                        <div className='hero-buttons'>
                            <Button grow onClick={createNewWhiteboard} className='hero-btn-primary'>Get Started for Free</Button>
                            <Button 
                                grow 
                                variant='secondary'
                                onClick={() => window.open('https://github.com/Kyle-Kerlew/whiteboard.io')}
                                className='hero-btn-secondary'
                            >
                                View on GitHub
                            </Button>
                        </div>
                        <div className='hero-social'>
                            <div className='avatars'>
                                <span className='avatar'>👤</span>
                                <span className='avatar'>👤</span>
                                <span className='avatar'>👤</span>
                            </div>
                            <div className='rating'>
                                <span>★★★★★</span>
                                <span className='rating-text'>Open source and community-driven</span>
                            </div>
                        </div>
                    </div>
                    <div className='hero-demo'>
                        <img 
                            src='https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop' 
                            alt='Whiteboard Demo'
                            className='demo-image'
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id='features' className='features-section'>
                <div className='features-header'>
                    <span className='section-label'>A SIMPLE CANVAS</span>
                    <h2>For big ideas.</h2>
                    <p>Let Whiteboard help you visualize and collaborate in your next meeting, brainstorm session, or class!</p>
                </div>
                <div className='features-grid'>
                    <div className='feature-card'>
                        <img src={EasyToUseIcon} alt='Draw freely'/>
                        <h4>Draw freely</h4>
                        <p>Sketch diagrams, workflows, notes, and ideas without getting in the way.</p>
                    </div>
                    <div className='feature-card'>
                        <img src={CollaborationFriendlyIcon} alt='Work together'/>
                        <h4>Work together</h4>
                        <p>See who's online and collaborate from anywhere.</p>
                    </div>
                    <div className='feature-card'>
                        <img src={OrganizedIcon} alt='Stay organized'/>
                        <h4>Stay organized</h4>
                        <p>Create boards for your projects and come back to them whenever you need.</p>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section className='tools-section'>
                <div className='tools-content'>
                    <div className='tools-text'>
                        <span className='section-label'>YOUR IDEAS, ON ONE CANVAS</span>
                        <h2>Simple tools.<br/>Clear thinking.</h2>
                        <p>Whiteboard IO gives you just the right tools to get ideas down fast and keep things moving.</p>
                        <ul className='tools-list'>
                            <li>Choose your color</li>
                            <li>Draw shapes and lines</li>
                            <li>Undo, redo, zoom, and more</li>
                            <li>Rename your board anytime</li>
                        </ul>
                    </div>
                    <div className='tools-image'>
                        <img 
                            src='https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop' 
                            alt='Tools Demo'
                            className='tools-demo'
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id='how-it-works' className='how-it-works-section'>
                <div className='how-header'>
                    <span className='section-label'>HOW IT WORKS</span>
                    <h2>Get up and running in minutes</h2>
                </div>
                <div className='steps-grid'>
                    <div className='step-card'>
                        <div className='step-number'>1</div>
                        <h4>Create a board</h4>
                        <p>Start a new whiteboard in seconds.</p>
                    </div>
                    <div className='step-card'>
                        <div className='step-number'>2</div>
                        <h4>Name and share</h4>
                        <p>Rename your board and share the link with anyone.</p>
                    </div>
                    <div className='step-card'>
                        <div className='step-number'>3</div>
                        <h4>Draw and collaborate</h4>
                        <p>Open the link to draw together in real time.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='cta-section'>
                <div className='cta-content'>
                    <h2>Ready to put your ideas on the board?</h2>
                    <p>Free to use. Open source. Start creating.</p>
                    <Button onClick={createNewWhiteboard} className='cta-button'>Get Started for Free</Button>
                </div>
            </section>

            <Footer/>
        </div>
    );
};

export default Home;