import { useState } from "react";

const Test = () => {

    console.log('render');
    const [number, setNumber] = useState(1);


    // 똑같은 값으로 두번 곱해주고 싶을 때는 prevState를 통해 2번 실행되게 한다
    const double = () => {
        setNumber((prevState) => {
            return prevState * 2;
        })
        setNumber((prevState) => prevState * 2);
    };


    return (
        <div>
            <div>{number}</div>
            <button onClick={double}>Submit</button>
        </div>
    )
}

export default Test;
