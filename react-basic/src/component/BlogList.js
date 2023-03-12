import axios from "axios";
import { bool } from "prop-types";
import { useState , useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Card from "../component/Card";
import LoadingSpinner from "../component/LoadingSpinner";
import Pagination from "./Pagination";

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
    const limit = 1;

    // 게시물에 개수에 따라 페이지수를 표시해주는 로직을 작성시 오류 발생
    // 배열의 길이가 넘어갔다고 뜸... 2일째 해결 불가... 일단 넘어가자
    // 아무것도 안했는데 갑자기 오류 해결... 뭘까...


    useEffect(() => {
        setnumberOfPages(Math.ceil(numberOfPosts/limit));
    },[numberOfPosts])

    //뒤로가기 시 전에 페이지로 넘어가기 ex 2에서 1로
    const onClickPageButton = (page) => {
        history.push(`/admin?page=${page}`)
        getPosts(page);
    };

    const getPosts = (page = 1) => {
        let params = {
            _page: page,
            _limit: limit,
            _sort: 'id',
            _order: 'desc'
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
    }

    useEffect(() => {
        // parseInt int로 변경해주는 함수 현재 pageParam는 str으로 넘어오기 때문에 오류가 발생한다.
        getPosts(parseInt(pageParam));
        setCurrentPage(parseInt(pageParam) || 1);
    },[pageParam]);

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
    
    if (Loading) {
            return (
                <LoadingSpinner />
            );
        }

        if(posts.length === 0 ) {
            return (
                <div>'No Blog Posts Found'</div>
            )
        }
        
        return (
            <div>
                {renderBlogList()}
                {numberOfPages > 1 &&  <Pagination
                    currentPage={currentPage} 
                    numberOfPages={numberOfPages} 
                    onClick={onClickPageButton} 
                />}
            </div>
        )
};

BlogList.propTypes = {
    isAdmin: bool
};

BlogList.defaultProps = {
    isAdmin: false
};

export default BlogList;