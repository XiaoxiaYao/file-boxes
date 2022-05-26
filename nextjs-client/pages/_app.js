import { useState, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createEmotionCache from '../utility/createEmotionCache';
import { AuthContext } from '../contexts/authContext';
import lightTheme from '../styles/theme/lightTheme';
import Header from '../components/header/Header';

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [user, setUser] = useState(null);
  const value = {
    user,
    setUser,
  };

  // TODO:
  // useEffect(() => {
  //   // When the app is lauched, let's check the user is signed in or not.
  //   const fetchData = async () => {
  //     try {
  //       const { data } = await currentUser();
  //       setUser(data);
  //     } catch (error) {
  //       setUser(null);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <AuthContext.Provider value={value}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </AuthContext.Provider>
  );
};

export default MyApp;
