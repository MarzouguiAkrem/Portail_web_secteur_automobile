import {useState, useEffect} from 'react'
import axios from 'axios'


function TopicsAPI() {
    const [topics, setTopics] = useState([])
    const [callback, setCallback] = useState(false)
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    

    useEffect(() =>{
        const getTopics = async () => {
            const res = await axios.get(`/api/topics?limit=${page*9}`)
            setTopics(res.data.topics)
            setResult(res.data.result)
        }
        getTopics()
    },[callback])
    
    return {
        topics: [topics, setTopics],
        callback: [callback, setCallback],
        result: [result, setResult],
        page: [page, setPage]
    }
}

export default TopicsAPI