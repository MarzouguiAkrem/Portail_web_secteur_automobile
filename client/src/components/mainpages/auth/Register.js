import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [user, setUser] = useState({
        name: '', email: '', password: '', username: ''
    })
    const history = useHistory();

    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const registerSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('/user/register', { ...user }).then((res) => {
                //localStorage.setItem('firstLogin', JSON.stringify(res.data))
                console.log(res)

            })


            history.push("/email")
            // window.location.href = "/";
        } catch (err) {
            toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_CENTER })

        }
    }

    return (
        <div class="card">
            <div class="card-image">
                <h2 class="card-heading">
                    S'inscrire
                    <small> maintenant !</small>
                </h2>
            </div>
            <form onSubmit={registerSubmit}>

                <input type="text" name="name" class="input-field1" required
                    placeholder="Nom et Prénom" value={user.name} onChange={onChangeInput} />

                <input type="text" name="username" class="input-field1" required
                    placeholder="Nom Utilisateur" value={user.username} onChange={onChangeInput} />


                <input type="email" name="email" class="input-field1" required
                    placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" class="input-field1" name="password" required autoComplete="on"
                    placeholder="Mot de passe" value={user.password} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit" class="button">S'inscrire</button>
                    <Link to="/login" >Se Connecter !</Link>
                </div>
                <p className="bbb">
                        En vous inscrivant, vous acceptez nos<a href="#">Terms and Conditions</a></p>
            </form>
        </div>
          
    )
}

export default Register