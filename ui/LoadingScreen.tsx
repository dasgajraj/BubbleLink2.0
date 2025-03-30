import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ActivityIndicator
  } from "react-native";
  import React from "react";
  
  const LoadingScreen = () => {
    return (
      <View style={styles.view}>
        <StatusBar hidden />
  
        <Text style={styles.MainText}>Bubble Link</Text>
        <ActivityIndicator
          animating={true}
          color="#4A90E7"
          size="small"
          style={styles.Loader}
        />
  
        <View style={styles.footerView}>
          <Text style={styles.footerText}>V ~ 2.0.0</Text>
        </View>
      </View>
    );
  };
  
  export default LoadingScreen;
  
  const styles = StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F8FAFC",
      
    },
    logo: {
      width: 150,
      height: 150,
      resizeMode: "contain",
      marginBottom: 20,
      elevation: 10,
      
    },
    MainText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#4A90E2",
      marginBottom: 10,
    },
    MainSubText: {
      fontSize: 14,
      color: "#7f8c8d",
      marginBottom: 30,
    },
    Loader: {
      marginTop: 20,
    },
    footerView: {
      position: "absolute",
      bottom: 20,
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      color: "#95a5a6",
    },
  });
  