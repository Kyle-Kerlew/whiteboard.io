import React from 'react';
import "../../styles/footer.css"

const Footer = () => {


    return (
        <div className={'footer'}>
            <div className={'logo'}>
                Whiteboard IO Logo
                <p>Simplify workflows for remote teams</p>
            </div>
            <div className={'navigation'}>
                <ul>
                    <li>
                        <a href={"/test"}>Github</a>
                    </li>
                    <li>
                        <a href={"/test"}>Privacy Policy</a>
                    </li>
                    <li>
                        <a href={"/test"}>Terms of Service</a>
                    </li>
                    <li>
                        <a href={"/test"}>Report a Bug</a>
                    </li>
                    <li>
                        <a href={"/test"}>FAQ</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default React.memo(Footer);