import React from "react";
import { Text, View } from "react-native";
import { HomeProps } from "./types";
import { RootStackParamList } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RouteParams = NativeStackScreenProps<RootStackParamList, 'Home'>;
/**
 * 
 * Tape, virtualization, article&research
 */

function Home({vm}: HomeProps) {
    
    return <View>
        <Text>Home</Text> 
    </View>
}


export default Home