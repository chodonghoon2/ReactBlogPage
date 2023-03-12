import axios from "axios";
import { useState , useEffect , useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Card from "../component/Card";
import LoadingSpinner from "../component/LoadingSpinner";
import Pagination from "./Pagination";
import porpTypes from 'prop-types';

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

    // 게시물에 개수에 따라 페이지수를 표시해주는 로직을 작성시 오류 발생
    // 배열의 길이가 넘어갔다고 뜸... 2일째 해결 불가... 일단 넘어가자
    // 아무것도 안했는데 갑자기 오류 해결... 뭘까...


    useEffect(() => {
        setnumberOfPages(Math.ceil(numberOfPosts/limit));
    },[numberOfPosts])

    //뒤로가기 시 전에 페이지로 넘어가기 ex 2에서 1로
    const onClickPageButton = (page) => {
        //${location.pathname}를 통해 해당 url에 대한 페이지로 넘어가게 만듬 ex admin에서 넘길 때와 Blogs에서 넘길 때 각각 넘어가게 함
        history.push(`${location.pathname}?page=${page}`)
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
    // 1번 방법 
    //     const getPosts = (page = 1) => {
    //     let params = {
    //         _page: page,
    //         _limit: limit,
    //         _sort: 'id',
    //         _order: 'desc'
    //     }

    //     if(!isAdmin) {
    //         params = {...params, publish: true};
    //     }

    //     axios.get(`http://localhost:3001/posts` , {
    //         params
    //     }).then((res) => {
    //         setNumberOfPosts(res.headers['x-total-count']);
    //         setPosts(res.data);
    //         setLoading(false);
    //     })
    // }
        setCurrentPage(parseInt(pageParam) || 1);
        // parseInt int로 변경해주는 함수 현재 pageParam는 str으로 넘어오기 때문에 오류가 발생한다.
        getPosts(parseInt(pageParam) || 1);
    },[pageParam , getPosts ]);
    // getPosts dependency에 대해 getPosts를 넣어주면 위에 getPosts에 대한 워닝이 뜸 그 이유는 뭘까?
    // 함수는 랜더링 할 때 마다 새로운 함수를 생성한다 따라서 같은 함수이여도 처음과 두번째 .. 생선된 함수는 다른 함수이다.
    // 따라서 그냥 getPosts를 넣으면 계속 새로운 함수가 생성됬다고 인식되어 무한 루프에 빠진다
    // 해결 방법 1. getPosts를 해당 useEffect안에 넣는다 2.useCallback 함수를 사용한다

    const deleteBlog = (e , id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then((res) => {
            setPosts(prevPosts => {
                return prevPosts.filter(post => {
                    return post.id !== id;
                })
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

    const onSearch = () => {
        getPosts(1);
    };

    if (Loading) {
            return (
                <LoadingSpinner />
            );
        }
        
        return (
            <div>
                <input 
                    type="text"
                    placeholder="Search.."
                    className="form-control"
                    value={searchText}
                    onChange= {(e) => { setSearchText(e.target.value)
                    onkeyup={onSearch}
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