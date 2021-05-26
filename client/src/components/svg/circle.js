const Circle = ({size, onClick, color}) => {
    return (
        <div>
            <svg onClick={onClick} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
                <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} stroke="none"/>
            </svg>
        </div>
    )
}

export default Circle;