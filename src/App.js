import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { useState } from 'react';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Profile from './Pages/Profile';
import Main from './Pages/Main';
import Collection from './Pages/Collection';
import Item from './Pages/Item';
import { IntlProvider } from 'react-intl';
import enMessages from '../src/Shared/Localization/En.json'
import ruMessages from '../src/Shared/Localization/Ru.json'
import GlobalContext from './Contexts/GlobalContext';
import TagItems from './Pages/TagItems';

function App() {
  const [locale, setLocale] = useState(localStorage.getItem("locale") || "EN");

  const messages = {
    "EN": enMessages,
    "RU": ruMessages
  };

  return (
    <GlobalContext.Provider 
    value = {{
      locale,
      setLocale
    }}>
      <IntlProvider messages={messages[locale]} locale={locale}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collection/:name" element={<Collection />} />
            <Route path="/item/:name" element={<Item />} />
            <Route path="/" element={<Main />} />
            <Route path='/tagitems' element = {<TagItems />}/>
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </GlobalContext.Provider>
  );
}

export default App;
