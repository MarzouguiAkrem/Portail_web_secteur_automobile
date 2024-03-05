import React from 'react';
import emailjs from 'emailjs-com';


function Contact() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs.sendForm('gmail', 'template_wyk24ls', e.target, 'user_mppcxuYpqQEQ3FFERMoNs')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
      e.target.reset()
  }
  return (
    <form className="contact-form" onSubmit={sendEmail}>
      <div class = "container" >
      <input type="hidden" name="contact_number" />
      <h1>Demande membre professionnel</h1>
      <br/>
      <label>Name</label>
      <input type="text" name="name" /><br/>
      <label>Email personnel</label>
      <input type="email" name="email_personnel" /><br/>
      <label>Email professionnel</label>
      <input type="email" name="email_professionnel" />
      <label>Numero fiscal</label>
      <input type="number" name="numero_fiscal" />
      <label>Activité</label>
      <input type="text" name="professionnal_activity" />
      <label>Web page</label>
      <input type="url" name="page_web" />
      <label>Facebook page</label>
      <input type="url" name="page_facebook_personnel" />
      <input type="submit" class="registerbtn" value="Send" />
      </div>
    </form>
  );
}
export default Contact 