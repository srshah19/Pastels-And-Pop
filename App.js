/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Text, TouchableOpacity, View,
  WebView, StyleSheet, NetInfo
} from 'react-native';

import OneSignal from 'react-native-onesignal';

const WEBVIEW_REF = "webview";

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      url: "https://pastelsandpop.com",
      canGoBack: false
    }
  }
  
  componentDidMount() {
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
  }
  
  _handleConnectionChange = (isConnected) => {
    console.log(isConnected);
  };
  
  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
  }
  
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }
  
  onReceived(notification) {
    console.log("Notification received: ", notification);
  }
  
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }
  
  onRegistered(notifData) {
    console.log("Device had been registered for push notifications!", notifData);
  }
  
  onIds(device) {
    console.log('Device info: ', device);
  }
  
  _onNavigationStateChange(webViewState) {
    console.log(webViewState.url);
    if (webViewState.url.indexOf('facebook') > -1) {
      console.log('messenger');
    }
    this.setState({
      canGoBack: webViewState.canGoBack
    });
  }
  
  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            disabled={!this.state.canGoBack}
            onPress={this.onBack.bind(this)}
          >
            <Text style={this.state.canGoBack ? styles.topBarText : styles.topBarTextDisabled}>Back</Text>
          </TouchableOpacity>
          <Text>Pastels and Pop</Text>
        </View>
        <WebView
          ref="webview"
          source={{uri: this.state.url}}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          style={{marginTop: 15}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15, /* Padding to push below the navigation bar */
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    height: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  topBarTextDisabled: {
    color: 'gray',
    padding: 10,
    fontWeight: "bold"
  },
  topBarText: {
    color: 'black',
    padding: 10,
    fontWeight: "bold"
  }
});

