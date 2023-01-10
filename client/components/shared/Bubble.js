import style from './../../styles/Bubble.module.css';

function Bubble({text, color}) {
    return (
        <div key={text} style={{backgroundColor: color}} className={style.bubble}>
            <div className='text'>{text}</div>
        </div>
    )
}

export default Bubble;
