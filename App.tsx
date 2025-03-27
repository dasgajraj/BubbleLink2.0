import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Login from "./ui/Login";
import LoadingScreen from "./ui/LoadingScreen";
import Home from "./ui/Home";
import { auth } from './config/firebaseConfig'; 

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {user ? <Home user={user} /> : <Login />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;