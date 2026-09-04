import '../../styles/button.css';

function Button({onClick, variant = "primary", children, grow, className}) {

    function getClasses() {
        return grow ? "button " + variant + ' ' + 'grow' : "button " + variant + ' ' + className;
    }

    return (
        <button onClick={onClick} className={getClasses()}>
            {children}
        </button>
    );
}

export default Button;