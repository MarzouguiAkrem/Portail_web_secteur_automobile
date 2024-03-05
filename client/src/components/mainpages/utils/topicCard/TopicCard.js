import React from 'react'
import {Link} from 'react-router-dom'
import './TopicCard.css'
import BtnRendertopic from './BtnRendertopic'

function TopicCard({topic, isAdmin, deleteTopic, handleCheck}) {
    return (
        <div className="product_card">
             {
                isAdmin && <input type="checkbox" checked={topic.checked}
                onChange={() => handleCheck(topic._id)} />
            }
            <img src={topic.images.url} alt=""/>
            <div className="product_box">
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            </div>
            <BtnRendertopic topic={topic} deleteTopic={deleteTopic} />
        </div>
    )
}

export default TopicCard