import axios from "axios";
import { useState , useEffect , useCallback , useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Card from "../component/Card";
import LoadingSpinner from "../component/LoadingSpinner";
import Pagination from "./Pagination";
import porpTypes from 'prop-types';
import Toast from "./Toast";
// 고유 id 만들어줌
import { v4 as uuidv4 } from 'uuid';

const BlogList = ({isAdmin}) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const [posts , setPosts] = useState([]);
    const [Loading , setLoading] = useState(true);
    const [currentPage , setCurrentPage] = useState(1);
    const [numberOfPosts , setNumberOfPosts] = useState(0);
    const [numberOfPages , setnumberOfPages] = useState(0);
    const [searchText , setSearchText] = useState('');
    const limit = 5;
    const [, setToastRerender] = useState(false);
    const toasts = useRef([]);

    useEffect(() => {
        setnumberOfPages(Math.ceil(numberOfPosts/limit));
    },[numberOfPosts])

    //뒤로가기 시 전에 페이지로 넘어가기 ex 2에서 1로
    const onClickPageButton = (page) => {
        //${location.pathname}를 통해 해당 url에 대한 페이지로 넘어가게 만듬 ex admin에서 넘길 때와 Blogs에서 넘길 때 각각 넘어가게 함
        history.push(`${location.pathname}?page=${page}`)
        setCurrentPage(page);
        getPosts(page);
    };

    // 2번 방법
    const getPosts =  useCallback((page = 1) => {
        let params = {
            _page: page,
            _limit: limit,
            _sort: 'id',
            _order: 'desc',
            title_like: searchText
        }

        if(!isAdmin) {
            params = {...params, publish: true};
        }

        axios.get(`http://localhost:3001/posts` , {
            params
        }).then((res) => {
            setNumberOfPosts(res.headers['x-total-count']);
            setPosts(res.data);
            setLoading(false);
        })
    }, [isAdmin ,searchText] )

    useEffect(() => {
        setCurrentPage(parseInt(pageParam) || 1);
        // parseInt int로 변경해주는 함수 현재 pageParam는 str으로 넘어오기 때문에 오류가 발생한다.
        getPosts(parseInt(pageParam) || 1);
    }, []);

    const deletToast = (id) => {
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
            deletToast(id);
        }, 5000);
    };

    const deleteBlog = (e , id) => {
        e.stopPropagation();

        axios.delete(`http://localhost:3001/posts/${id}`).then((res) => {
            setPosts(prevPosts => {
                return prevPosts.filter(post => {
                    return post.id !== id;
                })
            });
            addToast({
                text: 'Succesfully deleted',
                type: 'success'
            });
        });
    };

    // useEffect에 안 넣어두면 계속 랜더링이 일어난다 따라서 useEffect안에 넣어서 한번만 랜더링 되게 해야한다
    // useEffect(() => {
    //     getPosts();
    // }, []);

    const renderBlogList = () => {
        return (
            posts.map(post => {
                return (
                    <Card key={post.id} title={post.title} onClick={ () => history.push(`/blogs/${post.id}`)} >
                        {isAdmin ? (<div>
                            <button 
                                className="btn btn-danger btn-sm"
                                // 이벤트 버블링 현상을 방지하기 위한 함수 stopPrpagation
                                onClick={(e) => deleteBlog(e, post.id)}
                            >Delete</button>
                        </div>) : null}
                    </Card>
                )
            })
        )
    };

    const onSearch = (e) => {
        if (e.key === 'Enter') {
            history.push(`${location.pathname}?page=1`)
            setCurrentPage(1);
            getPosts(1);
        }
    }


    if (Loading) {
            return (
                <LoadingSpinner />
            );
        }
        
        return (
            <div>
                <Toast
                    toasts={toasts.current}
                    deletToast={deletToast}
                />
                <input 
                    type="text"
                    placeholder="Search.."
                    className="form-control"
                    value={searchText}
                    onKeyUp={onSearch}
                    onChange= {(e) => { setSearchText(e.target.value)
                    }}                
                />
                <hr/>
                {posts.length === 0 
                    ? <div>'No Blog Posts Found'</div> 
                    : <>
                    {renderBlogList()}
                    {numberOfPages > 1 &&  <Pagination
                        currentPage={currentPage} 
                        numberOfPages={numberOfPages} 
                        onClick={onClickPageButton} 
                    />}
                </>}
            </div>
        )
};

BlogList.propTypes = {
    isAdmin: porpTypes.bool
};

BlogList.defaultProps = {
    isAdmin: false
};

export default BlogList;