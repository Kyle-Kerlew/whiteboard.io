import '../../styles/bubble.css';

function Bubble({text, color}) {
    return (
        <div style={{backgroundColor: color}} className='bubble'>
            <div className='text'>{text}</div>
        </div>
    )
}

export default Bubble;