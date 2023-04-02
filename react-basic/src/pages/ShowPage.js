import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../component/LoadingSpinner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ShowPage = () => {
    const {id} = useParams(); 
    const [post , setPost] = useState(null);
    const [Loading , setLoading] = useState(true);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const getPost = (id) => {
        axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
            setPost(res.data);
            setLoading(false);
        })
    };

    useEffect(() => {
        getPost(id);
    },[id]);

    const printDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if(Loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h1>{post.title}</h1>
                {isLoggedIn ? <div>
                    <Link 
                        className="btn btn-primary"
                        to={`/blogs/${id}/edit`}
                    >
                        Edit
                    </Link>
                </div> : null}
            </div>
            <small className="text-muted">
                Created At {printDate(post.createdAt)}
            </small>
            <hr />
            <p>{post.body}</p>
        </div>
    );
};

export default ShowPage;