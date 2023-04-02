import {v4 as uuidv4} from 'uuid';
import { addToast as add , removeToast } from "../store/toastSlice";
import { useDispatch } from "react-redux";

const useToast = () => {
    const dispatch = useDispatch();

    const deleteToast = (id) => {
        dispatch(removeToast(id));
    };

    const addToast = (toast) => {
        const id = uuidv4();
        const toastWithId = {
            ...toast,
            id
        }

        dispatch(add(toastWithId));

        // 5초후 toast 메세지가 사라지게 만드는 로직
        setTimeout(() => {
            deleteToast(id);
        }, 5000);
    };

    return [
        addToast,
        deleteToast
    ];
};

export default useToast;