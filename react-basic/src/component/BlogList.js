import axios from "axios";
import { bool } from "prop-types";
import { useState , useEffect } from "react";
import { useHistory } from "react-router-dom";

import Card from "../component/Card";
import LoadingSpinner from "../component/LoadingSpinner";
import Pagination from "./Pagination";

const BlogList = ({isAdmin}) => {
    const history = useHistory();
    const [posts , setPosts] = useState([]);
    const [Loading , setLoading] = useState(true);
    const [currentPage , setCurrentPage] = useState(1);

    const getPosts = (page = 1) => {
        setCurrentPage(page);

        let params = {
            _page: page,
            _limit: 5,
            _sort: 'id',
            _order: 'desc'
        }

        if(!isAdmin) {
            params = {...params, publish: true};
        }

        axios.get(`http://localhost:3001/posts` , {
            params
        }).then((res) => {
            setPosts(res.data);
            setLoading(false);
        })
    }

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

    // useEffect에 안 넣어두면 계속 랜더링이 일어난다 따라서 useEffect안에 넣어서 한번만 랜더링 되게 해야한다
    useEffect(() => {
        getPosts();
    }, []);
    
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
                <Pagination currentPage={currentPage} numberOfPages={3} onClick={getPosts} />
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