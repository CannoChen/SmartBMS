import {FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { AwesomeButton } from "./AwesomeButton.tsx";
import { Card, Icon } from "@rneui/themed";
import * as React from "react";
import { Avatar } from "@rneui/base";


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
    <TouchableOpacity style={styles.item}>
        <Card>
            <View style={styles.cell_info}>
                <Avatar
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

const ListsHeaderComponent = () => {
    return (
        <>
            <View
                style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        flexShrink: 1,
                        fontSize: 22,
                        fontWeight: "900",
                    }}
                >
                    Cells Healthy System
                </Text>
                <Text>⭐️⭐️⭐️⭐️⭐️</Text>
            </View>
            <Text
                style={{
                    color: "#666",
                }}
            >
                Battery Troubleshooting and Load Balancing
            </Text>
            <View
                style={{
                    height: 1,
                    backgroundColor: "#ececec",
                    marginVertical: 20,
                }}
            />
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "900",
                    textAlign: "center",
                }}
            >
                Health Condition (🔋🔋🔋🔋)
            </Text>
        </>
    );
}

export const CellsInfoComponent = () => {

    return (
        <SafeAreaView edges={["bottom"]}>
            <View
                style={{
                    padding: 20,
                }}
            >

                        <FlatList
                            data={mockData}
                            renderItem={({item}) => <Item item={item} />}
                            style={{marginBottom: 16}}
                            ListHeaderComponent={ListsHeaderComponent}
                            ListFooterComponent={
                                <AwesomeButton
                                    title={"Active battery cell balancing"}
                                    color="#fff"
                                    backgroundColor="#7C4DFF"
                                    bold
                                    onPress={() => console.log("active balancing")}
                                />
                            }
                            ListFooterComponentStyle={{
                                marginTop: 20,
                            }}
                            // keyExtractor={item => item.id}
                        />
            </View>
        </SafeAreaView>
    );
};

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
