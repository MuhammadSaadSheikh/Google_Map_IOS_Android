import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, View, Text, Alert, Platform, Linking, Animated, ActivityIndicator, Modal } from 'react-native'
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'
import MapViewDirections from 'react-native-maps-directions';

//utils
import { checkMultiplePermissions } from '../../utils/Permission'
import { KEY } from '../../utils/Constant'

//Styling
import styles from "./style";

const Home = () => {

    const [position, setPosition] = useState({
        latitude: 0,
        longitude: 0,
    })
    const [distanceTravel, setDistanceTravel] = useState()
    const [travelMint, setTravelMint] = useState(0)

    useEffect(() => {
        checkForPErmission()
    }, [])

    const mapRef = useRef(null)
    const checkForPErmission = async () => {
        const permissions =
            Platform.OS === 'ios'
                ? [PERMISSIONS.IOS.LOCATION_ALWAYS]
                : [
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                    // PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
                ];
        let checkPermission = await checkMultiplePermissions(permissions)
        checkPermission.map(async val => {
            if (Platform.OS === 'ios') {
                let checkPer = await Geolocation.requestAuthorization('always')
                if (checkPer !== 'granted') {
                    Alert.alert(
                        "Location Permission",
                        "",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => Linking.openSettings('') }
                        ]
                    );
                } else if (checkPer === 'granted') {
                    getCords()
                }
            }
            else if (Platform.OS === 'android') {
                if (!val.isPermissionGranted) {
                    Alert.alert(
                        "Location Permission",
                        "",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => Linking.openSettings('') }
                        ]
                    );
                } else if (!!val.isPermissionGranted) {
                    getCords()
                }
            }
        })
    }

    const getCords = () => {
        // try {
        Geolocation.watchPosition((position, errorCallBack) => {
            const { coords } = position
            setPosition({
                latitude: coords?.latitude,
                longitude: coords?.longitude
            })
        })
    }

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         getCords()
    //     }, 4500)
    //     return () => clearInterval(interval)
    // })

    const getDirection = (e) => {
        console.log('eeeeee>', e)
        setDistanceTravel(e?.distance)
        setTravelMint(e?.duration.toFixed(3))
    }

    const renderMap = () => {
        const destination = { latitude: 24.8934, longitude: 67.0819 };
        return (
            <>
                {position?.latitude !== 0 && position?.longitude !== 0 ? <MapView.Animated
                    ref={mapRef}
                    style={styles.mapContainer}
                    followsUserLocation={true}
                    showsUserLocation={true}
                    provider={MapView.PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: position?.latitude,
                        longitude: position?.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <MapViewDirections
                        origin={position}
                        destination={destination}
                        apikey={KEY}
                        mode='DRIVING'
                        waypoints={[position, destination]}
                        optimizeWaypoints={true}
                        splitWaypoints={true}
                        strokeWidth={3}
                        timePrecision='now'
                        // precision='high'
                        // resetOnChange={false}
                        onReady={e => getDirection(e)}
                    />
                    <Marker.Animated pinColor='red'
                        coordinate={{
                            latitude: position?.latitude,
                            longitude: position?.longitude,
                        }}
                        isPreselected={true}
                    />
                    <Marker.Animated pinColor='red'
                        coordinate={destination}
                        isPreselected={true}
                    />
                </MapView.Animated>
                    :
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'blac'
                    }}>
                        <ActivityIndicator size='large' color='red' />
                    </View>
                }
                <View style={styles.bottomTab}>
                    <View style={styles.timeContainer}>
                        <Text>
                            Duration Time: <Text> {travelMint} mints </Text>
                        </Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <View style={styles.timeContainer}>
                            <Text>
                                Distance: <Text> {distanceTravel} km </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {renderMap()}
        </SafeAreaView>
    )
}

export default Home