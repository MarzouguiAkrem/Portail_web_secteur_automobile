import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {useHistory, useParams} from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: '',
    content: '',
    category: '',
    _id: ''
}

function CreateProduct2() {
    const notify = () => {
        toast.warning('Size too large!',{position : toast.POSITION.TOP_RIGHT})
    }
    const [isLoading, setIsLoading] = useState(false);

    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)


    const [isProf] = state.userAPI.isProf
    const [token] = state.token

    const history = useHistory()
    const param = useParams()

    const [products] = state.productsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    useEffect(() => {
        if(param.id){
            setOnEdit(true)
            products.forEach(product => {
                if(product._id === param.id) {
                    setProduct(product)
                    setImages(product.images)
                }
            })
        }else{
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [param.id, products])

    const handleUpload = async e =>{
        e.preventDefault()
        try {
            if(!isProf) return alert("You're not an admin")
            const file = e.target.files[0]
            
            if(!file) return toast.error('file not exist!',{position : toast.POSITION.TOP_RIGHT})

            if(file.size > 1024 * 1024) // 1mb
                return toast.warning('Size too large!',{position : toast.POSITION.TOP_RIGHT})

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return toast.error('file format in incorrect!',{position : toast.POSITION.TOP_RIGHT})

            let formData = new FormData()
            formData.append('file', file)

            setIsLoading(true);
            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            setLoading(false)
            setIsLoading(false);
            setImages(res.data);

        } catch (err) {
            setIsLoading(false);
            toast.error(err.response.data.msg,{position : toast.POSITION.TOP_RIGHT})
        }
    }

    const handleDestroy = async () => {
        try {
            if(!isProf) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            toast.error(err.response.data.msg,{position : toast.POSITION.TOP_RIGHT})
        }
    }

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isProf) return alert("You're not an admin")
            if(!images) return alert("No Image Upload")

            setIsLoading(true);
            if(onEdit){
                await axios.put(`/api/products/${product._id}`, {...product, images}, {
                    headers: {Authorization: token}
                })
            }else{
                await axios.post('/api/products', {...product, images}, {
                    headers: {Authorization: token}
                })
            }
            setIsLoading(false);
            setCallback(!callback)
            history.push("/")
        } catch (err) {
            setIsLoading(false);
            toast.error(err.response.data.msg,{position : toast.POSITION.TOP_RIGHT})
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div>

            <form onSubmit={handleSubmit}>
             

                <div className="row">
                    <label htmlFor="title">Titre</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput} />
                </div>

    
                <div className="row">
                    <label htmlFor="price">Site officiel</label>
                    <input type="url" name="price" id="price" required
                    placeholder="https://www.Exemple.com/" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} rows="5" onChange={handleChangeInput} />
                </div>


                <div className="row">
                    <label htmlFor="categories">Categories: </label>
                    <select name="category" value={product.category} onChange={handleChangeInput} >
                        <option value="">Veuillez sélectionner une catégorie</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {
                    isLoading ? <CircularProgress></CircularProgress> :
                        <button type="submit">{onEdit ? "Update" : "Create"}</button>
                }
            </form>
        </div>
    )
}

export default CreateProduct2
