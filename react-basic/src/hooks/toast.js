import { useState , useRef } from "react";
import {v4 as uuidv4} from 'uuid';

const useToast = () => {
    const [, setToastRerender] = useState(false);
    // const [toasts , setToasts] = useState([]);
    const toasts = useRef([]);

    const deleteToast = (id) => {
        const filteredToasts = toasts.current.filter(toast => {
            return toast.id !== id;
        });
        toasts.current = filteredToasts;
        setToastRerender(prev => !prev);
    };

    const addToast = (toast) => {
        const id = uuidv4();
        const toastWithId = {
            ...toast,
            id: id
            }
        toasts.current = [
            ...toasts.current,
            toastWithId
        ]
        setToastRerender(prev => !prev);
        // 5초후 toast 메세지가 사라지게 만드는 로직
        setTimeout(() => {
            deleteToast(id);
        }, 5000);
    };

    return [
        toasts.current,
        addToast,
        deleteToast
    ];
};

export default useToast;