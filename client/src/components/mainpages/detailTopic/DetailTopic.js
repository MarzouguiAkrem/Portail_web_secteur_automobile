import React, {useContext, useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import {getData} from '../../mainpages/utils/FetchData'
import TopicCard from '../../mainpages/utils/topicCard/TopicCard'
import DetailTopicCard from '../../mainpages/utils/detailTopicCard/DetailTopicCard'
import FormInput from '../../mainpages/utils/formInput/FormInput'
import CommentItem from '../../mainpages/utils/commentItem/CommentItem'
import Loading from '../../mainpages/utils/images/loading.gif'

function DetailTopic() {
    const {id} = useParams()

    const state = useContext(GlobalState)
    const [topics] = state.topicsAPI.topics
    const socket = state.socket

    const [detailTopic, setDetailTopic] = useState([])

    const [rating, setRating] = useState(0)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)
    const pageEnd = useRef()

    useEffect(() => {
        setDetailTopic(topics.filter(topic => topic._id === id))
    },[id, topics])

    useEffect(() => {
        setLoading(true)
        getData(`/api/comments/${id}?limit=${page * 5}`)
            .then(res => {
                setComments(r => r = res.data.comments)
                setLoading(false)
            })
            .catch(err => console.log(err.response.data.msg))
    },[id, page])

    // Realtime 
    // Join room
    useEffect(() => {
        if(socket){
            socket.emit('joinRoom', id)
        }
    },[socket, id])

    useEffect(() => {
        if(socket){
            socket.on('sendCommentToClient', msg => {
                setComments([msg, ...comments])
            })

            return () => socket.off('sendCommentToClient')
        } 
    },[socket, comments])

    // infiniti scroll
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting){
                setPage(prev => prev + 1)
            }
        },{
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    },[])


    // Reply Comments
    useEffect(() => {
        if(socket){
            socket.on('sendReplyCommentToClient', msg => {
                const newArr = [...comments]
                
                newArr.forEach(cm => {
                    if(cm._id === msg._id){
                        cm.reply = msg.reply
                    }
                })

                setComments(newArr)
            })

            return () => socket.off('sendReplyCommentToClient')
        } 
    },[socket, comments])

    return (
        <div className="detail_product_page">
            {
                detailTopic.map(topic => (
                    <DetailTopicCard key={topic._id} topic={topic} />
                ))
            }

            <div className="comments">
                <h2 className="app_title">
                Discussions : 
                </h2>

                <div className="reviews">
                    <input type="radio" name="rate" id="rd-5" onChange={() => setRating(5)} />
                    <label htmlFor="rd-5" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-4" onChange={() => setRating(4)} />
                    <label htmlFor="rd-4" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-3" onChange={() => setRating(3)} />
                    <label htmlFor="rd-3" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-2" onChange={() => setRating(2)} />
                    <label htmlFor="rd-2" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-1" onChange={() => setRating(1)} />
                    <label htmlFor="rd-1" className="fas fa-star"></label>
                </div>

                <FormInput id={id} socket={socket} rating={rating} />

                <div className="comments_list">
                    {
                        comments.map(comment => (
                            <CommentItem key={comment._id} comment={comment} socket={socket} />
                        ))
                    }
                </div>

            </div>

            {
                loading && <div className="loading"><img src={Loading} alt=""/></div>
            }  
            <button ref={pageEnd} style={{opacity: 0}}>Plus</button>  
            <h2>Discussions les plus actives</h2>
        <div className="products_page">
                
                {
                    topics.map(topic =>{ 
                       return <TopicCard key={topic._id} topic={topic} 
                      />
                    })
                }
            </div>  
        </div>


         
    )
}

export default DetailTopic