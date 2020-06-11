import React, { useState, useEffect } from 'react';
import { 
        View, 
        Image, 
        Text,
        TextInput,
        TouchableOpacity,
        StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login({navigation}) {
    const [user, setUser ] = useState('');

    useEffect(() => {
        AsyncStorage
        .getItem('userId')
        .then(user => {
            if(user) {
                navigation.navigate('Main', {id: user})
            }
        })
    }, [])

    handleLogin = async () => {
        const response = await api.post('/devs', {
            username: user
        })
        const { _id } = response.data;
        await AsyncStorage.setItem('userId',_id);
        navigation.navigate('Main', {id: _id})
    }

    return (
        <View style={styles.container}>
            <Image source={logo} /> 
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={user}
                onChangeText={setUser}
                placeholder="Digite seu usuário no GitHub"
                placeholderTextColor="#999"
                style={styles.input}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf:'stretch',
        backgroundColor:'#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor:'#df7423',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})