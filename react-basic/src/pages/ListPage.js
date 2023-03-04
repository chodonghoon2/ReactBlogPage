import axios from "axios";
import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Card from "../component/Card";
import LoadingSpinner from "../component/LoadingSpinner";

const ListPage = () => {
    const history = useHistory();
    const [posts , setPosts] = useState([]);
    const [Loading , setLoading] = useState(true);

    const getPosts = () => {
        axios.get('http://localhost:3002/posts').then((res) => {
            setPosts(res.data);
            setLoading(false);
        })
    }

    const deleteBlog = (e , id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3002/posts/${id}`).then((res) => {
            setPosts(prevPosts => {
                return prevPosts.filter(post => {
                    return post.id !== id;
                })
            });
        });
    };

    // useEffect에 안 넣어두면 계속 랜더링이 일어난다 따라서 useEffect안에 넣어서 한번만 랜더링 되게 해야한다
    useEffect(() => {
        getPosts();
    }, []);

    const renderBlogList = () => {
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
            posts.map(post => {
                return (
                    <Card key={post.id} title={post.title} onClick={ () => history.push("/blogs/edit")} >
                        <div>
                            <button 
                                className="btn btn-danger btn-sm"
                                // 이벤트 버블링 현상을 방지하기 위한 함수 stopPrpagation
                                onClick={(e) => deleteBlog(e, post.id)}
                            >Delete</button>
                        </div>
                    </Card>
                )
            })
        )
    }

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h1>Blogs</h1>
                <div>
                    <Link to="/blogs/create" className="btn btn-success">
                        Create New
                    </Link>
                </div>
            </div>
            {renderBlogList()}
        </div>
    );
};

export default ListPage;