import React, { useEffect } from 'react'
import axios from "axios"

import emailC from '../images/confirmed.png';
import './emailconfirmed.css'

function Emailconfirmed(props) {
  const email = props.match.params.email;

  useEffect(() => {
    axios.post(`/user/confirmEmail/${email}`)
  }, [])
  return (
    <>

      <img src={emailC} className="valid_e" />
    </>
  );
}
export default Emailconfirmed;