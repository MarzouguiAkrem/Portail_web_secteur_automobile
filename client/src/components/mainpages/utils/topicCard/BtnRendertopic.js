import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {GlobalState} from '../../../../GlobalState'

function BtnRendertopic({topic, deleteTopic}) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const addCart = state.userAPI.addCart

    
    return (
        <div className="row_btn">
            {
                isAdmin ? 
                <>
                    <Link id="btn_buy" to="#!" 
                    onClick={() =>deleteTopic(topic._id, topic.images.public_id)}>
                        Supp
                    </Link>
                    <Link id="btn_view" to={`/edit_topic/${topic._id}`}>
                        Modifier
                    </Link>
                    <Link id="btn_view" to={`/detail_topic/${topic._id}`}>
                    disc
                    </Link>
                </>
                : <>
                    <Link id="btn_view" to={`/detail_topic/${topic._id}`}>
                    discussion
                    </Link>
                    <Link id="btn_view" to={`/regle`}>
                        Régles
                    </Link>
                 </>
            }
                
        </div>
    )
}

export default BtnRendertopic
