import PropTypes from 'prop-types'

const Card = ({title , onClick ,children}) => {
    return (
        <div className="card mb-3 cursor-pointer" onClick={onClick}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div>{title}</div>
                    {children && <div>{children}</div>}
                </div>
            </div>
         </div>
    
    )
};

Card.prototypes = {
    // isRequired 를 사용하면 필수 props로 지정가능하다
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    onClick: PropTypes.func,
};

// 기본값을 정하고 싶을 때
Card.defaultProps = {
    children: null,
    onClick: () => {},
};

export default Card;