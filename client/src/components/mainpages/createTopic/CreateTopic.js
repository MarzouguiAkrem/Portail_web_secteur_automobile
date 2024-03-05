import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

const initialState = {
    topic_id: '',
    title: '',
    description: '',
    price: '',
    _id: ''
}

function CreateTopic() {
    const notify = () => {
        toast.warning('Size too large!', { position: toast.POSITION.TOP_RIGHT })
    }
    const [isLoading, setIsLoading] = useState(false);

    const state = useContext(GlobalState)
    const [topic, setTopic] = useState(initialState)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)


    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const history = useHistory()
    const param = useParams()

    const [topics] = state.topicsAPI.topics
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.topicsAPI.callback

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            topics.forEach(topic => {
                if (topic._id === param.id) {
                    setTopic(topic)
                    setImages(topic.images)
                }
            })
        } else {
            setOnEdit(false)
            setTopic(initialState)
            setImages(false)
        }
    }, [param.id, topics])

    const handleUpload = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!isAdmin) {
                setIsLoading(false);
                return alert("You're not an admin");
            }
            const file = e.target.files[0]

            if (!file) {
                setIsLoading(false);
                return toast.error('file not exist!', { position: toast.POSITION.TOP_RIGHT })
            }

            if (file.size > 1024 * 1024) // 1mb
                toast.warning('Size too large!', { position: toast.POSITION.TOP_RIGHT })


            if (file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
            {
                setIsLoading(false);
                return toast.error('file format in incorrect!', { position: toast.POSITION.TOP_RIGHT })
            }

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setImages(res.data)
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
        }
    }

    const handleDestroy = async () => {
        try {
            if (!isAdmin) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id }, {
                headers: { Authorization: token }
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
        }
    }

    const handleChangeInput = e => {
        const { name, value } = e.target
        setTopic({ ...topic, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true);
        try {
            if (!isAdmin) {
                setIsLoading(false);
                return alert("You're not an admin");
            }
            if (!images) {
                setIsLoading(false);
                return toast.error('No image uploded', { position: toast.POSITION.TOP_RIGHT })
            }

            if (onEdit) {
                await axios.put(`/api/topics/${topic._id}`, { ...topic, images }, {
                    headers: { Authorization: token }
                })
            } else {
                await axios.post('/api/topics', { ...topic, images }, {
                    headers: { Authorization: token }
                })
            }
            setIsLoading(false);
            setCallback(!callback)
            history.push("/forum")
        } catch (err) {
            setIsLoading(false);
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload} />
                {
                    loading ? <div id="file_img"><Loading /></div>

                        : <div id="file_img" style={styleUpload}>
                            <img src={images ? images.url : ''} alt="" />
                            <span onClick={handleDestroy}>X</span>
                        </div>
                }

            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="title">Titre</label>
                    <input type="text" name="title" id="title" required
                        value={topic.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                        value={topic.description} rows="5" onChange={handleChangeInput} />
                </div>
                {
                    isLoading ? <CircularProgress></CircularProgress> :
                        <button type="submit">{onEdit ? "Modifier" : "Créer"}</button>
                }
            </form>
        </div>
    )
}

export default CreateTopic
