import React, { useCallback, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Image, Platform, Button } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const googleAPI='AIzaSyB_pQCNi4-xUShFFxbe2ctA0DG4aFLNja0';

/**
 *
 * Shows a map. origin is the current user's location, destination is the target user's location.
 * If both origin and destination are not null, the map will draw the route between the origin and destination.
 *
 * @export
 * @param {{origin: {coords: {latitude: number, longitude:number}}, destination: {coords: {latitude: number, longitude:number}}}} props <br>
 * 1. props.origin is a location object with values of latitude and longitude
 * 2. props.destination is a location object with values of latitude and longitude
 * @return {Component} => Render a MapObject Component
 */
export function MapObject( props ) {
    const { width, height } = Dimensions.get('window');
    const [region, setRegion] = useState({latitude: 34.067057, longitude: -118.441606, latitudeDelta: 1, longitudeDelta: 1})
    const origin = props.origin;
    const destination = props.destination;
    let latitudeDis = null;
    useEffect(() => {
      console.log(origin)
      console.log(destination)
      if(origin != null && destination == null) {
          setRegion({latitude: origin['latitude'], 
                            longitude: origin['longitude'],
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01})
      }
      else if(origin != null && destination != null) {
          latitudeDis = Math.abs(destination['latitude'] - origin['latitude']) + Math.abs(props.destination['longitude'] - props.origin['longitude']);
          setRegion({latitude: origin['latitude'], 
                            longitude: origin['longitude'],
                            latitudeDelta: latitudeDis,
                            longitudeDelta: latitudeDis * width / height})
      }
    }, [origin, destination]);
    

    return (
        <MapView
            style={{...StyleSheet.absoluteFillObject}}
            region={region}
            >
            {origin != null && <MapView.Marker coordinate={{latitude:origin['latitude'], longitude: origin['longitude']}}>
                <Image style={{width: 25, height:25, borderRadius:10}}
                    source={{uri: props.originAvatar}}/>
            </MapView.Marker>}
            {destination != null && <MapView.Marker coordinate={{latitude:destination['latitude'], longitude: destination['longitude']}}>
                <Image style={{width: 25, height:25, borderRadius:10}}
                    source={{uri: props.destinationAvatar}}/>
            </MapView.Marker>}
            {origin != null && destination != null &&
              <MapViewDirections 
                  origin={{latitude:origin['latitude'], longitude: origin['longitude']}}
                  destination={{latitude:destination['latitude'], longitude: destination['longitude']}}
                  apikey={googleAPI}
                  strokeWidth={2}
                  strokeColor='blue'
                  precision='high'
              >
              </MapViewDirections>}
        </MapView>
    )
}
