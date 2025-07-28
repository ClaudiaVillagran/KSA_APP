import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import LogoKsa from '../assets/svg/LogoKsa'

const IntroScreen = () => {
  return (
    <View style={styles.containerIntro}>
         <LogoKsa/>
         <Text style={{fontSize: 15, fontWeight: 600, color: '#333'}}>La mejor aplicación de servicios que necesitas</Text>
    </View>
  )
}

export default IntroScreen

const styles = StyleSheet.create({
    containerIntro:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})