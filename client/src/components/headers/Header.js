import React, {useContext, useState} from 'react'
import {GlobalState} from '../../GlobalState'
import Menu from './icon/menu.svg'
import Close from './icon/close.svg'
import Cart from './icon/cart.svg'
import {Link} from 'react-router-dom'
import axios from 'axios'
import img from '../mainpages/utils/images/autoRoom.png'
import img1 from '../mainpages/utils/images/autoAdmin.png'
import img2 from '../mainpages/utils/images/autoPro.png'

function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [isProf] = state.userAPI.isProf
    const [isUser] = state.userAPI.isUser
    const [cart] = state.userAPI.cart
    const [menu, setMenu] = useState(false)

    const logoutUser = async () =>{
        await axios.get('/user/logout')
        
        localStorage.removeItem('firstLogin')
        
        window.location.href = "/login";
    }

    const adminRouter = () =>{
        return(
            <>
                 <li><Link to="/stats">Statistiques</Link></li>
                 <li><Link to="/users">Utilisateurs</Link></li>
                <li><Link to="/create_topic">créer Topic</Link></li>
                <li><Link to="/create_product">créer article  </Link></li>
                <li><Link to="/category">Categories</Link></li>
                <li><Link to="/annuaire">Annuaire</Link></li> 
                 <li><Link to="/forum">Forum</Link></li> 
                 <li><Link to="/chat">Chat</Link></li>
                 <li><Link to="/profile">Profil</Link></li>
                <li><Link to="/" onClick={logoutUser}>déconnexion</Link></li>
            </>
        )
    }
    const ProfRouter = () =>{
        return(
            <>
                <li><Link to="/create_productProf">créer article </Link></li>
                <li><Link to="/annuaire">Annuaire</Link></li> 
                 <li><Link to="/forum">Forum</Link></li> 
                 <li><Link to="/chat">Chat</Link></li>
                 <li><Link to="/profile">Profil</Link></li> 
                <li><Link to="/" onClick={logoutUser}>déconnexion</Link></li>
            </>
        )
    }
    const UserRouter = () =>{
        return(
            <>
                <li><Link to="/annuaireUser">Annuaire</Link></li> 
                 <li><Link to="/forumUser">Forum</Link></li> 
                 <li><Link to="/contact">Espace professionnel</Link></li> 
                 <li><Link to="/chat">Chat</Link></li>
                 <li><Link to="/profile">Profil</Link></li>
                <li><Link to="/" onClick={logoutUser}>déconnexion</Link></li>
            </>
        )
    }

    const loggedRouter = () =>{
        return(
            <>
             
            </>
        )
    }


    const styleMenu = {
        left: menu ? 0 : "-100%"
    }

    return (
        <header>
            <div className="menu" onClick={() => setMenu(!menu)}>
                <img src={Menu} alt="" width="30" />
            </div>
        

            <div className="logo">
                <h1>
                <Link to="/">{isAdmin? <img className="imglogo1" src={img1} /> : '' }</Link>
                <Link to="/">{isProf? <img className="imglogo2" src={img2} /> : ''}</Link>
                <Link to="/">{isUser? <img className="imglogo" src={img} /> : ''}</Link>
                </h1>
            </div>

            <ul style={styleMenu}>
                

                {isAdmin && adminRouter()}

                {
                    isLogged ? loggedRouter() : <li><Link to="/login">Se connecter ✥ s'inscrire</Link></li>
                }
                
                { isProf && ProfRouter()}

               {
                   isLogged ? loggedRouter() :''
               }
               { isUser && UserRouter()}

{
    isLogged ? loggedRouter() : ''
}
                <li onClick={() => setMenu(!menu)}>
                    <img src={Close} alt="" width="30" className="menu" />
                </li>

            </ul>

           
            
        </header>
    )
}

export default Header