import React, {useState} from 'react';
import {Header, Icon} from '@rneui/themed';
import {Pressable, StyleSheet, Text, View} from 'react-native';


const isOverview = (showName) => {
  if(showName === "Overview")
    return (
        <Icon
            name="battery-80"
            type="material-community"
            color="black"
            style={{marginRight: 10}} />
    );
}

function LeftComponent({navigation, showName}) {
  const [isExpand, setIsExpand] = React.useState(false);
  return (
    <View style={styles.header}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        {showName}
      </Text>
    </View>
  );
}

function RightComponent({navigation, showName}) {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <View style={styles.header}>
      {isOverview(showName)}
      {/*<Pressable onPress={() => navigation.navigate('ConfigDevice')}>*/}
      {/*  <Icon name="camera" color="black" />*/}
      {/*</Pressable>*/}
    </View>
  );
}

export default function HeaderComponent({navigation, showName}) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <>
      <Header
        backgroundColor="white"
        // centerComponent={
        //     <Icon
        //         name={isExpand ? "chevron-up" : "chevron-down"}
        //         type='material-community'
        //     />
        // }
        // centerContainerStyle={{}}
        containerStyle={styles.headerContainer}
        leftComponent={<LeftComponent navigation={navigation} showName={showName} />}
        leftContainerStyle={{}}
        linearGradientProps={{}}
        placement="left"
        rightComponent={<RightComponent navigation={navigation} showName={showName} />}
        rightContainerStyle={{}}
        statusBarProps={{}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
