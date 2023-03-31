import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import porpTypes from 'prop-types';

const BlogForm = ({editing , addToast}) => {
  const history = useHistory();
  const  {id} = useParams();

  const [title , setTitle] = useState('');
  const [originaltitle , setOrignalTitle] = useState('');
  const [body , setBody] = useState('');
  const [originalbody , setOrignalBody] = useState('');
  const [publish , setPublish] = useState(false);
  const [originalpublish , setOriginalPublish] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);




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

  const validateForm = () => {
    let validated = true;
    
    if (title === '') {
      setTitleError(true);
      validated = false;
    }

    if (body === '') {
      setBodyError(true);
      validated =false;
    }
    
    return validated;
  };

  const onSubmit = () => {
    //다시 값을 입력후 초기화 시켜준 후 비어 있는지 다시 확인하기 위함
    setTitleError(false);
    setBodyError(false);
    if(validateForm()) {
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
          addToast({
            type: 'success',
            text: 'Successfully created!'
          });
          history.push('/admin');
        })
      }
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
            <input className={`form-control ${titleError ? 'border-danger' : ''}`} value={title} onChange={(e) => {
              setTitle(e.target.value);
            }}/>
            {titleError && <div className="text-danger">
              Title is required.
            </div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Body</label>
            <textarea className={`form-control ${bodyError ? 'border-danger' : ''}`} value={body} onChange={(e) => {
              setBody(e.target.value);
            }} 
            rows = "10"/>
            {bodyError && <div className="text-danger">
              Body is required.
            </div>}
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
          <button 
            className="btn btn-primary" 
            onClick={onSubmit} 
            disabled={editing && !isEdited()}
          >
            {editing ? 'Edit' : 'Post'}
          </button>
          <button 
            className="btn btn-danger ms-2" 
            onClick={goBack}
          >
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