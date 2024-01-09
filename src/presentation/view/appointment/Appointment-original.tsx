import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { AppointmentProps } from "./types";
import {Calendar, LocaleConfig, Agenda, DateData, AgendaEntry} from 'react-native-calendars';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';
import { AppointmentContainerAllProps } from "@/presentation/container/AppointmentContainer";


/**
 * 
 * Sign & unsign appointment
 */
function Appointment({ vm }: AppointmentProps & AppointmentContainerAllProps ) {

  const [state, setState] = useState({items: {}})
  
    function loadItems(day: DateData) {
      console.log('DAY',day)
    }

    function renderDay (day) {
      if (day) {
        return <Text style={styles.customDay}>{day.getDay()}</Text>;
      }
      return <View style={styles.dayItem}/>;
    };

    function renderItem (reservation: AgendaEntry, isFirst: boolean) {
      const fontSize = isFirst ? 16 : 14;
      const color = isFirst ? 'black' : '#43515c';
  
      return (
        <TouchableOpacity
          style={[styles.item, {height: reservation.height}]}
          onPress={() => Alert.alert(reservation.name)}
        >
          <Text style={{fontSize, color}}>{reservation.name}</Text>
        </TouchableOpacity>
      );
    };

    function renderEmptyDate () {
      return (
        <View style={styles.emptyDate}>
          <Text>This is empty date!</Text>
        </View>
      );
    };

    function rowHasChanged (r1: AgendaEntry, r2: AgendaEntry) {
      return r1.name !== r2.name;
    };


    return (
        <View>
            <Agenda
                items={state.items} //
                loadItemsForMonth={loadItems}
                selected={'2017-05-16'} //
                renderItem={renderItem} //
                renderEmptyDate={renderEmptyDate}
                rowHasChanged={rowHasChanged}
                showClosingKnob={true}
            />
        </View>
    )
}

export default Appointment



const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  }
});