const Circle = ({width, height, onClick}) => {
    return (
        <svg onClick={onClick} width={width + 'px'} height={height + 'px'} xmlns="http://www.w3.org/2000/svg">
            <circle cx={`${width / 2}`} cy={`${height / 2}`} r={`${height/2 - 10}`} stroke="black"
                    strokeWidth="3" fill="black"/>
        </svg>

    )
}

export default Circle;