import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function LoadMoreTopic() {
    const state = useContext(GlobalState)
    const [page, setPage] = state.topicsAPI.page
    const [result] = state.topicsAPI.result

    return (
        <div className="load_more">
            {
                result < page * 9 ? ""
                : <button onClick={() => setPage(page+1)}>Load more</button>
            }
        </div>
        
    )
}

export default LoadMoreTopic
