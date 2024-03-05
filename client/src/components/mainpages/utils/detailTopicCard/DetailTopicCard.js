import React from 'react'
import './DetailTopicCard.css'
import Rating from '../rating/Rating'

function DetailTopicCard({topic}) {
    return (
        <div className="detail_product_card">
            <img src={topic.images.url} alt=""/>

            <div className="detail_product_card_content">
                <h2>{topic.title}</h2>
                
                <p>{topic.description}</p>
               

                <div className="rating">
                    <h3 className="rating" style={{margin: '10px 0'}}>Rating: {topic.numReviews} reviews</h3>
                    <Rating props={topic} />
                </div>
            </div>
        </div>
    )
}

export default DetailTopicCard