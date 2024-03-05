import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './login.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
import MessengerCustomerChat from 'react-messenger-customer-chat';

toast.configure();
function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const notify = () => {
        toast.error('err.response.data.msg', { position: toast.POSITION.BOTTOM_CENTER })
    }


    const [user, setUser] = useState({
        email: '', password: ''
    })

    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const loginSubmit = async e => {
        e.preventDefault()
        setIsLoading(true);
        try {
            await axios.post('/user/login', { ...user }).then(res => {
                localStorage.setItem('firstLogin', JSON.stringify(res.data))
            })
            setIsLoading(false);


            window.location.href = "/annuaire";

        } catch (err) {
            toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_CENTER })
            setIsLoading(false);
        }
    }


    return (
  

        <div class="card">
                  <MessengerCustomerChat
        pageId="102079495425088"
        appId="562039618105302"
/>

            <div class="card-image">
                <h1 class="card-heading">
                    Connecter

                </h1>
            </div>
            <form class="card-form" onSubmit={loginSubmit}>

                <input type="email" name="email" class="input-field1" required
                    placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" name="password" class="input-field1" required autoComplete="on"
                    placeholder="Mot de passe" value={user.password} onChange={onChangeInput} />

                <div className="row">
                    {
                        isLoading ? <CircularProgress></CircularProgress> :
                            <button type="submit" class="button">Connecter</button>
                    }

                </div>
                <div className="reg">
                    <Link classname="mt-3" to="/register"><button className="bt1">Créer un compte</button></Link>

                </div>

                <div class="card-info">
                </div>
                <p className="ccc">
                        En vous inscrivant, vous acceptez nos<a href="#">Terms and Conditions</a></p>
            </form>
        </div>

    )
}

export default Login