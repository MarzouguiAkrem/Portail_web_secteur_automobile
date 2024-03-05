import React, {createContext, useState, useEffect} from 'react'
import ProductsAPI from './api/ProductsAPI'
import TopicsAPI from './api/TopicsAPI'
import UserAPI from './api/UserAPI'
import CategoriesAPI from './api/CategoriesAPI'
import {getData} from  '../src/components/mainpages/utils/FetchData'
import io from 'socket.io-client'
import axios from 'axios'

export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
    const [topics, setTopics] = useState([])
    const [token, setToken] = useState(false)
    const [socket, setSocket] = useState(null)
    


    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const refreshToken = async () =>{
                const res = await axios.get('/user/refresh_token')
        
                setToken(res.data.accesstoken)
    
                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
           
            refreshToken()
           
        }
    },[])
    
    useEffect(() => {
        getData('/api/topics')
        .then(res => setTopics(res.data.topics))
        .catch(err => console.log(err.response.data.msg))
        const socket = io('http://localhost:3001')
        setSocket(socket)
        return () =>  socket.close()
        
    },[])
       
    const state = {
        token: [token, setToken],
        productsAPI: ProductsAPI(),
        topicsAPI: TopicsAPI(),
        userAPI: UserAPI(token),
        categoriesAPI: CategoriesAPI(),
        topics: [topics, setTopics],
        socket
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}