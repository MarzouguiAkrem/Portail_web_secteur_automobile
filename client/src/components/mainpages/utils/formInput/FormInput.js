import React, {useRef, useEffect, useState} from 'react'
import './FormInput.css'
import {patchData} from '../../utils/FetchData'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

function FormInput({id, socket, rating, setReply, send, name}) {
    const [isLoading, setIsLoading] = useState(false);
    
    const [username, setUsername] = useState('')
    const user = JSON.parse(localStorage.getItem('firstLogin'))

    const nameRef = useRef()
    const contentRef = useRef()


    useEffect(() => {
        if(name){
            contentRef.current.innerHTML = `
                <a href="#!"
                    style="color: crimson;
                    font-weight: 600;
                    text-transform: capitalize;"
                > ${name} : </a>
            `
        }
    },[name])

    const commentSubmit = () => {
        const username = nameRef.current.value
        const content = contentRef.current.innerHTML

        if(!username.trim()) return toast.warning('name must be not empty!',{position : toast.POSITION.TOP_RIGHT})
        if(!content.trim()) return toast.warning('comment must be not empty!',{position : toast.POSITION.TOP_RIGHT})
        
        const createdAt = new Date().toISOString()
        setIsLoading(true);
        socket.emit('createComment', {
            username, content, topic_id: id, createdAt, rating, send
        })
        
        if(rating && rating !== 0){
            patchData(`/api/topics/${id}`, {rating})
        }
        
        contentRef.current.innerHTML = ''
        
        if(setReply) setReply(false)
        setIsLoading(false);
        return toast.success('Commentaire posté',{position : toast.POSITION.TOP_RIGHT})
    }

    return (
        <div className="form_input">
            <p>Nom </p>
            <input type="text" ref={nameRef} defaultValue={user.user.username} disabled/>

            <p>Commentaire</p>
            <div ref={contentRef} 
                contentEditable="true"
                style={{
                    height: '100px',
                    border: '1px solid #ccc',
                    padding: '5px 10px',
                    outline: 'none',
                    
                }}
            />


            {
                isLoading ? <CircularProgress></CircularProgress> :
                <button onClick={commentSubmit}>Publier</button>
                }
        </div>
    )
}

export default FormInput