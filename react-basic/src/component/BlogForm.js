import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import porpTypes from 'prop-types';

const BlogForm = ({editing}) => {
    const [title , setTitle] = useState('');
    const [originaltitle , setOrignalTitle] = useState('');
    const [body , setBody] = useState('');
    const [originalbody , setOrignalBody] = useState('');
    const [publish , setPublish] = useState(false);
    const [originalpublish , setOriginalPublish] = useState(false);


    const history = useHistory();
    const  {id} = useParams();

    useEffect(() => {
      if (editing) {
        axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setOrignalTitle(res.data.title);
        setBody(res.data.body);
        setOrignalBody(res.data.body);
        setPublish(res.data.publish);
        setOriginalPublish(res.data.publish);
        })
      }
    },[id , editing]);

    const isEdited = () => {
      return title !== originaltitle || body !== originalbody || publish !== originalpublish;
    };

    const goBack = () => {
      if (editing) {
        return history.push(`/blogs/${id}`);
      } else {
        return history.push('/admin');
      }
    };


    const onSubmit = () => {
      if(editing) {
        axios.patch(`http://localhost:3001/posts/${id}`, {
          title,
          body,
          publish
        }).then(res => {
          history.push(`/blogs/${id}`);
        })
      } else {
          axios.post('http://localhost:3001/posts', {
            title,
            body,
            publish,
            createdAt: Date.now()
          }).then(() => {
          history.push('/admin')
          })
      }
    };

    const onChangePublish = (e) => {
      setPublish(e.target.checked);
    };

    return (
        <div>
            <h1>{editing ? 'Edit' : 'Create'} a Blog Post</h1>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" value={title} onChange={(e) => {
                setTitle(e.target.value);
              }}/>
            </div>
            <div className="mb-3">
              <label className="form-label">Body</label>
              <textarea className="form-control" value={body} onChange={(e) => {
                setBody(e.target.value);
              }} 
              rows = "10"/>
            </div>
            <div className="form-ckeck mb-3">
              <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={publish}
                        onChange={onChangePublish}
                    />
              <label className="form-ckeck-label">
                Publish
              </label>
            </div>
            <button className="btn btn-primary" onClick={onSubmit} disabled={editing && !isEdited()}>
              {editing ? 'Edit' : 'Post'}
            </button>
            <button className="btn btn-danger ms-2" onClick={goBack}>
              Cancel
            </button>
          </div>
    )
};

BlogForm.propsTypes = {
  editing: porpTypes.bool
};

BlogForm.defaultProps = {
  editing: false
};

export default BlogForm;