import React, {useState} from 'react'
import { View, StatusBar } from 'react-native'
import { Header } from 'react-native-elements'

export function PageHeader(props) {
    const [centerFontStyle, setCenterFontStyle] = useState({'fontSize':24, 'fontWeight':"bold"});
    const [pageName, setPageName] = useState(props.pageName);

    return (
        <View>
            <StatusBar barStyle='default' />
            <Header centerComponent={{text: pageName, style: centerFontStyle }}/>
        </View>
    );
}