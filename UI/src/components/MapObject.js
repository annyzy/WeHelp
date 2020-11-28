import React from 'react';
import { View, Dimensions, StyleSheet, Text, Image } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const googleAPI='AIzaSyB_pQCNi4-xUShFFxbe2ctA0DG4aFLNja0';

export function MapObject( props ) {
    const { width, height } = Dimensions.get('window');
    const latitudeDis = Math.abs(props.destination['latitude'] - props.origin['latitude'])*4;

    return (
    <MapView
        style={{...StyleSheet.absoluteFillObject}}
        initialRegion={{
            ...props.origin,
            latitudeDelta: latitudeDis,
            longitudeDelta: latitudeDis * width / height /10,
        }}
        >
        <MapView.Marker coordinate={props.origin}>
            <Image style={{width: 25, height:25, borderRadius:10}}
                   source={{ uri: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4'}}/>
        </MapView.Marker>
        <MapView.Marker coordinate={props.destination}>
            <Image style={{width: 25, height:25, borderRadius:10}}
                   source={{ uri: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4'}}/>
        </MapView.Marker>
        <MapViewDirections 
            origin={props.origin}
            destination={props.destination}
            apikey={googleAPI}
            strokeWidth={2}
            strokeColor='blue'
            precision='high'
        >

        </MapViewDirections>
    </MapView>
    )
}