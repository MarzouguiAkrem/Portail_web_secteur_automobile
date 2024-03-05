import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import Products from './products/Products'
import Users from './users/Users'
import Topics from './topics/Topics'

import DetailProduct from './detailProduct/DetailProduct'
import DetailTopic from './detailTopic/DetailTopic'
import Login from './auth/Login'
import Register from './auth/Register'
//import OrderHistory from './history/OrderHistory'
//import OrderDetails from './history/OrderDetails'
import Cart from './cart/Cart'
import NotFound from './utils/not_found/NotFound'
import Categories from './categories/Categories'
import CreateProduct from './createProduct/CreateProduct'
import CreateTopic from './createTopic/CreateTopic'
import Profile from './profile/Profile'

import Contact from '../mainpages/contact/Contact'

import { GlobalState } from '../../GlobalState'
import Acceuil from './Acceuil/Acceuil'
import CreateProduct2 from './createProduct/CreateProduct2'
import ContactUs from './contactus/ContactUs'
import Loader from './utils/Loader/Loader'
import Regles from './Regles/Regles'
import Stats from './Stats/Stats'
import { DirectChatPage } from "../mainpages/chat/chat.js"
import checkemail from "../mainpages/utils/checkemail/checkemail.js"
import emailconfirmed from './utils/emailConfirmed/emailconfirmed'

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [isProf] = state.userAPI.isProf



    return (
        <Switch>
            <Route path="/emailConfirmed/:email" exact component={emailconfirmed} />
            <Route path="/email" exact component={checkemail} />
            <Route path="/regle" exact component={Regles} />
            <Route path="/loader" exact component={Loader} />
            <Route path="/stats" exact component={Stats} />
            <Route path="/" exact component={Acceuil} />
            <Route path="/annuaire" exact component={Products} />
            <Route path="/annuaireUser" exact component={Products} />
            <Route path="/users" exact component={Users} />
            <Route path="/detail/:id" exact component={DetailProduct} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/chat" exact component={DirectChatPage} />
            <Route path="/forum" exact component={Topics} />
            <Route path="/forumUser" exact component={Topics} />
            <Route path="/contact" exact component={ContactUs} />
            <Route path="/detail_topic/:id" exact component={DetailTopic} />
            <Route path="/edit_topic/:id" exact component={isAdmin ? CreateTopic : NotFound} />

            <Route path="/login" exact component={isLogged ? NotFound : Login} />
            <Route path="/register" exact component={isLogged ? NotFound : Register} />

            <Route path="/create_topic" exact component={isAdmin ? CreateTopic : NotFound} />
            <Route path="/category" exact component={isAdmin ? Categories : NotFound} />
            <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFound} />

            <Route path="/cart" exact component={Cart} />
            <Route path="/create_productProf" exact component={isProf ? CreateProduct2 : NotFound} />
            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}

export default Pages
