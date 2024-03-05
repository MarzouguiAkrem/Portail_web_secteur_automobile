import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import Footer from './components/mainpages/utils/Footer/Footer.js'
import Loader from './components/mainpages/utils/Loader/Loader';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  }, [])
  return (
    <DataProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          {
            isLoading ?
              <Loader></Loader>
              :
              <div className="App">

                <Header />

                <MainPages />
                <Footer />
              </div>
          }
        </Router>
      </LocalizationProvider>
    </DataProvider>
  );
}

export default App;
