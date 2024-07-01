import * as React from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import HeaderComponent from "../component/HeaderComponent";
import {Card, Icon} from "@rneui/themed";
import {Avatar} from "@rneui/base";


// 数据格式之后需要根据单片机传输的格式修改
const mockData = [
    {
        title: "cell 1",
        voltage: 3.25,
        TP: 13.0,
        TB: 12.0,
    },
    {
        title: "cell 2",
        voltage: 3.25,
        TP: 13.0,
        TB: 12.0,
    },
    {
        title: "cell 3",
        voltage: 3.25,
        TP: 13.0,
        TB: 12.0,
    },
]

const is_health = (cell_name) => {
    if(cell_name === "cell 2")
        return (
            <Icon
                name="alert-rhombus-outline"
                type="material-community"
                color="red"
            />
        );
    else
        return (
            <Icon
                name="circle-box-outline"
                type="material-community"
                color="green"
            />
        );
}

const Item = ({item}) => (
    // <View style={styles.item}>
    //     <Text style={styles.title}>{item.title}</Text>
    // </View>
    <TouchableOpacity style={styles.item}>
        <Card>
            <View style={styles.cell_info}>
                <Avatar
                    // size={64}
                    rounded
                    icon={{ name: 'battery', type: 'material-community' }}
                    containerStyle={{ backgroundColor: 'green' }}
                />
                <Text style={{fontWeight: "bold"}}>{item.title}</Text>
                <Text>vol: {item.voltage} V</Text>
                <Text>TP: {item.TP} ℃</Text>
                <Text>TB: {item.TB} ℃</Text>
                {is_health(item.title)}
            </View>
        </Card>
    </TouchableOpacity>
);

const CellsDetailsComponent = ({navigation}) => {
  return (
      <SafeAreaView style={styles.container}>
          <HeaderComponent showName={"Details"}/>
          <FlatList
              data={mockData}
              renderItem={({item}) => <Item item={item} />}
              // keyExtractor={item => item.id}
          />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
    },
    item: {
    },
    cell_info: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default CellsDetailsComponent;
