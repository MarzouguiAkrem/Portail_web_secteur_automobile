import React, {useContext,useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import TopicCard from '../../mainpages/utils/topicCard/TopicCard'
import Loading from '../utils/loading/Loading'
import LoadMoreTopic from './LoadMoreTopic'
import axios from 'axios'
import MessengerCustomerChat from 'react-messenger-customer-chat';

function Topics() {
    const state = useContext(GlobalState)
    const [topics, setTopics] = state.topicsAPI.topics
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback
    
    const handleCheck = (id) =>{
        topics.forEach(topic => {
            if(topic._id === id) topic.checked = !topic.checked
        })
        setTopics([...topics])
    }

    const deleteTopic = async(id, public_id) => {
        try {
            
            const destroyImg = axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })
            const deleteTopic = axios.delete(`/api/topics/${id}`, {
                headers: {Authorization: token}
            })

            await destroyImg
            await deleteTopic
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const checkAll = () =>{
        topics.forEach(topic => {
            topic.checked = !isCheck
        })
        setTopics([...topics])
        setIsCheck(!isCheck)
    }

    const deleteAll = () =>{
        topics.forEach(topic => {
            if(topic.checked) deleteTopic(topic._id, topic.images.public_id)
        })
    }

   
    if(loading) return <div><Loading /></div>
    
    return (
        <>
           <MessengerCustomerChat
            pageId="102079495425088"
            appId="562039618105302"
             />
        {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete ALL</button>
            </div>
        }
            
            <div className="products_page">
                
                {
                    topics.map(topic =>{ 
                       return <TopicCard key={topic._id} topic={topic} 
                       isAdmin={isAdmin} deleteTopic={deleteTopic} handleCheck={handleCheck}/>
                    })
                }
            </div>
            <LoadMoreTopic />
        {topics.length === 0 && <Loading />}
    
            
        </>
        
    )
}

export default Topics