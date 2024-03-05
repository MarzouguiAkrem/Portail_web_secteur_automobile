import React from 'react';
import Hero from './Hero';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { SliderData } from '../../../data/SliderData';



function Acceuil() {
  return (
    <>
         <MessengerCustomerChat
            pageId="102079495425088"
            appId="562039618105302"
  />
      <Hero slides={SliderData} />

    </>
  );
}

export default Acceuil;