import React, { useState, useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

function Categories() {
    const notify = () => {
        toast.warning('Size too large!', { position: toast.POSITION.TOP_RIGHT })
    }
    const [isLoading, setIsLoading] = useState(false);

    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [category, setCategory] = useState('')
    const [token] = state.token
    const [callback, setCallback] = state.categoriesAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [id, setID] = useState('')

    const createCategory = async e => {
        e.preventDefault()
        setIsLoading(true);
        try {
            if (onEdit) {
                const res = await axios.put(`/api/category/${id}`, { name: category }, {
                    headers: { Authorization: token }
                })
                
                toast.success(res.data.msg, { position: toast.POSITION.TOP_RIGHT })
            } else {
                const res = await axios.post('/api/category', { name: category }, {
                    headers: { Authorization: token }
                })
                
                toast.success(res.data.msg, { position: toast.POSITION.TOP_RIGHT })
            }
            setIsLoading(false);
            setOnEdit(false)
            setCategory('')
            setCallback(!callback)
            
        } catch (err) {
            setIsLoading(false);
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
        }
    }

    const editCategory = async (id, name) => {
        setID(id)
        setCategory(name)
        setOnEdit(true)
    }

    const deleteCategory = async id => {
        setIsLoading(true);
        try {
            const res = await axios.delete(`/api/category/${id}`, {
                headers: { Authorization: token }
            })
            setIsLoading(false);
            toast.success(res.data.msg, { position: toast.POSITION.TOP_RIGHT })
            setCallback(!callback)
        } catch (err) {
            setIsLoading(false);
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
        }
    }

    return (
        <div className="categories">
            <form onSubmit={createCategory}>
                <label htmlFor="category">Catégorie</label>
                <input type="text" name="category" value={category} required
                    onChange={e => setCategory(e.target.value)} />

                {
                    isLoading ? <CircularProgress></CircularProgress> : 
                    <button type="submit">{onEdit ? "Modifier" : "Créer"}</button>
                }
            </form>

            <div className="col">
                {
                    categories.map(category => (
                        <div className="row" key={category._id}>
                            <p>{category.name}</p>
                            <div>
                                <button onClick={() => editCategory(category._id, category.name)}>Modifier</button>
                                <button onClick={() => deleteCategory(category._id)}>Supprimer</button>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Categories
