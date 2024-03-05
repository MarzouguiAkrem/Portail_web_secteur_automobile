import React from 'react';
import './Footer.css'
import { Link } from 'react-router-dom';
import img from '../images/autoRoom.png'

function Footer() {
  return (
    <div className='footer-container'>
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>a propos de nous</h2>
            <hr className="solid" />
            <p>AutoRoom est une nouvelle plateforme 100% tunisienne créée en 2021 spécilisée dans le secteur automobile . AutoRoom est une nouvelle plateforme 100% tunisienne créée en 2021 spécilisée dans le secteur automobile.AutoRoom est une nouvelle plateforme 100% tunisienne créée en 2021 spécilisée dans le secteur automobile.AutoRoom est une nouvelle plateforme 100% tunisienne créée en 2021 spécilisée dans le secteur automobile</p>
          </div>
          <div className='footer-link-items'>
            <h2>information</h2>
            <hr className="solid" />
            <Link to=''><span><i className="fas fa-chevron-right"></i>&nbsp;&nbsp;Contact</span></Link>
            <Link to=''><span><i className="fas fa-chevron-right"></i>&nbsp;&nbsp;Demande membre professionel</span></Link>
            <Link to=''><span><i className="fas fa-chevron-right"></i>&nbsp;&nbsp;Carrières</span></Link>
            <Link to=''><span><i className="fas fa-chevron-right"></i>&nbsp;&nbsp;A propos de AutoRoom</span></Link>
          </div>
          <div className='footer-link-items'>
            <h2>contact info</h2>
            <hr className="solid" />
            <div className="material-icons">
              <i className="fas fa-map-marker-alt"></i>
              <span> 20 Rue de la Liberté</span>
            </div>
            <div className="material-icons">
              <i className="fas fa-phone-alt"></i>
              <span> Service Client</span>
              <br />
              <p><a href="tel:+21655742938">(+216) 55742938</a> | <a href="tel:+21626699906">(+216) 26699906</a></p>
            </div>
            <div className="material-icons">
              <i className="fas fa-phone-alt"></i>
              <span> Service Commercial</span>
              <br />
              <p><a href="tel:+21655742938">(+216) 55742938</a> | <a href="tel:+21626699906">(+216) 26699906</a></p>
            </div>
            <div className="material-icons">
              <i className="fas fa-envelope"></i>
              <a > AutoRoom@gmail.com</a>
            </div>
            <div className="material-icons">
              <i className="far fa-clock"></i>
              <span> Lun- Sam: 9:00 - 18:00</span>
            </div>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              <img src={img} alt='Autologo' /> 
            </Link>
          </div>
      
          <div className='social-icons'>
            <a
              className='social-icon-link facebook'
              href='https://www.facebook.com/Colis-19-102479658740692'
              target='_blank'
              aria-label='Facebook'
              rel="noreferrer"
            >
              <i className='fab fa-facebook-f' />
            </a>
            <a
              className='social-icon-link instagram'
              href='https://www.facebook.com/Colis-19-102479658740692'
              target='_blank'
              aria-label='Instagram'
              rel="noreferrer"
            >
              <i className='fab fa-instagram' />
            </a>
            <a
              className='social-icon-link twitter'
              href='https://www.facebook.com/Colis-19-102479658740692'
              target='_blank'
              aria-label='LinkedIn'
              rel="noreferrer"
            >
              <i className='fab fa-linkedin' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;