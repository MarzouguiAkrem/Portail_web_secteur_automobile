import React from 'react';
import { Formik, Form } from 'formik';
import TextField  from './TextField';
import * as Yup from 'yup';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';

function ContactUs () {
  const user = JSON.parse(localStorage.getItem('firstLogin'))
    function sendEmail(e) {
        e.preventDefault();
    
        emailjs.sendForm('gmail', 'template_wyk24ls', e.target, 'user_mppcxuYpqQEQ3FFERMoNs')
          .then((result) => {
            toast.success('Demande Envoyé', { position: toast.POSITION.BOTTOM_CENTER })
          }, (error) => {
              
              toast.error('error.text', { position: toast.POSITION.BOTTOM_CENTER })
          });
          e.target.reset()
      }
    
  const validate = Yup.object({
    Name: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
   
    email_personnel: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),

      email_professionnel: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),

      page_web: Yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter correct url!'
        )
        .required('Please enter website'),
        page_facebook_personnel: Yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter correct url!'
        )
        .required('Please enter website'),

        numero_fiscal: Yup.string().min(13,"13 numbers").required('num fiscal is required').max(13,'num fiscal 13 numbers only '),

  
  })
  return (
    <Formik
      initialValues={{
        Name: user.user.username,
        email_personnel: user.user.email,
        email_professionnel: '',
        numero_fiscal:'',
        page_web:'',
        page_facebook_personnel:'',
      }}
      validationSchema={validate}
      onSubmit={values => {
        console.log(values)
      }}
    >
      {formik => (
        <div>
          <h1 className="my-4 font-weight-bold .display-4" class='hh'>Demande membre professionnel</h1><br/>
          <Form onSubmit={sendEmail}>
        <div class="container">
            <TextField label="Name" name="name"  defaultValue={user.user.username} type="text" disabled />
            <TextField label="Email personnel" name="email_personnel" type="email" disabled />
            <TextField label="Email professionnel" name="email_professionnel" type="email" />
            <TextField label="Numero fiscal" name="numero_fiscal" type="number" />
            <TextField label="Page web" name="page_web" type="url" />
            <TextField label="Page facebook" name="page_facebook_personnel" type="url" />
            <button class="registerbtn1" type="submit">Envoyer</button>
            <button class="registerbtn2"type="reset">Annuler</button>
        </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}
export default ContactUs