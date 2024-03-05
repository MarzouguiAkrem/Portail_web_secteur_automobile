import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'
import './filters.css'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search


    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter_menu">
            <div className="row">
                
                <select name="category"  value={category} onChange={handleCategory} >
                    <option value=''> Tous les articles </option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" class='input1' value={search} placeholder="Entrez votre recherche !"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                
                <select value={sort} class="select1" onChange={e => setSort(e.target.value)} >
                    <option value=''>plus récent</option>
                    <option value='sort=oldest'>moins récent</option>
                                  
                </select>
            </div>
        </div>
    )
}

export default Filters
