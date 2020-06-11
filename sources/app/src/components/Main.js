import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';
import api from '../services/api';

export default function Main({ navigation }) {
    const userId = navigation.getParam('id');
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { user: userId }
            })

            setUsers(response.data)
        }
        loadUsers()
    }, [userId]);

    useEffect(() => {
        const socket = io('http://192.168.0.6:3333',{
            query: { user: userId }
        });
        socket.on('match', dev => {
            console.log(dev)
            setMatchDev(dev);
        })
    },[userId])

    async function handleLike() {
        const [user, ...rest] = users;
        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: userId }
        })

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;
        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: userId }
        })

        setUsers(rest);
    }

    handleLogout = async () => {
        await AsyncStorage.clear()
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {
                    users.length === 0
                        ?
                        <Text style={styles.empty}>Acabou :(</Text>
                        :
                        users.map((user, index) => (
                            <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text numberOfLines={3} style={styles.bio}>{user.bio}</Text>
                                </View>
                            </View>
                        ))
                }
            </View>
            {
                users.length > 0 ?
                    (
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleDislike}>
                                <Image source={dislike} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleLike}>
                                <Image source={like} />
                            </TouchableOpacity>
                        </View>
                    ) : null
            }
            {
                matchDev ? (
                    <View style={[styles.matchContainer,{zIndex: 99999999}]}>
                         <Image style={styles.matchImage}  source={itsamatch}/>
                         <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}}/>
                         <Text style={styles.matchName}>{matchDev.name}</Text>
                         <Text style={styles.matchBio}>{matchDev.bio}</Text>
                         <TouchableOpacity onPress={() => setMatchDev(null)}>
                            <Text style={styles.closeMatch}>FECHAR</Text>
                         </TouchableOpacity>
                    </View>
                )
                : null
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 30
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    avatar: {
        flex: 1,
        height: 300
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.08)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color:'#fff'
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    },
    matchImage: {
        height: 80,
        resizeMode:'contain'
    }
})