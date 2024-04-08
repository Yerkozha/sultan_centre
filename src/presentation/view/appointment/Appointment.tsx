
import { ScreenProps } from '@/navigators/types';
import { AppointmentContainerAllProps } from '@/presentation/container/AppointmentContainer';
import { groupBy, timeDateToDate } from '@/utils';
import React, {memo, useEffect, useState} from 'react';
import {Alert, Modal, PermissionsAndroid, Pressable, StyleSheet, Text,  TouchableOpacity, View} from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppointmentProps, EventTimeObject} from './types'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Event } from 'react-native-calendars/src/timeline/EventBlock';

import Toast from 'react-native-toast-message';

import { TextInput } from 'react-native-paper';
import {
  CopilotProvider,
  CopilotStep,
  useCopilot,
  walkthroughable,
} from "react-native-copilot";
import { useTranslation } from 'react-i18next';

/**
 * TITLE, DETAILS => Django Model
 * Android Calendar form
 * 
 * END FEEDBACK utka telegram
 * 
 */
import {LocaleConfig} from 'react-native-calendars';
import i18nLN from '@/i18n/i18n';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/hooks/useStore';

LocaleConfig.locales['kz'] = {
  monthNames: [
    'Қаңтар',
    'Ақпан',
    'Наурыз',
    'Сәуір',
    'Мамыр',
    'Маусым',
    'Шілде',
    'Тамыз',
    'Қыркүйек',
    'Қазан',
    'Қараша',
    'Желтоқсан'
  ],
  monthNamesShort: ['Қаңт.', 'Ақп.', 'Наур.', 'Сәу.', 'Ма.', 'Мау.', 'Шіл.', 'Там.', 'Қыр.', 'Қаз.', 'Қар.', 'Жел.'],
  dayNames: ['Дүйсенбі', 'Сейсенбі', 'Сәрсенбі', 'Бейсенбі', 'Жұма', 'Сенбі', 'Жексенбі'],
  dayNamesShort: ['Дүй.', 'Сей.', 'Сәр.', 'Бей.', 'Жұм.', 'Сен.', 'Жек.'],
  today: "Бүгін"
};
LocaleConfig.locales['en'] = LocaleConfig.locales['']

LocaleConfig.locales['ru'] = {
  monthNames: [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ],
  monthNamesShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Ма.', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Понидельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  dayNamesShort: ['Пон.', 'Втр.', 'Срд.', 'Чет.', 'Пят.', 'Суб.', 'Воск.'],
  today: "Сегодня"
};


LocaleConfig.defaultLocale = i18nLN.language;






const INITIAL_TIME = {hour: 9, minutes: 0};

const EVENT_COLOR = '#e6add8';
const today = new Date();
export const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

export const timelineEvents: TimelineEventProps[] = [
  {
    start: `${getDate(-1)} 09:20:00`,
    end: `${getDate(-1)} 12:00:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  },
  {
    start: `${getDate()} 01:15:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting A',
    summary: 'Summary for meeting A',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:30:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting B',
    summary: 'Summary for meeting B',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:45:00`,
    end: `${getDate()} 02:45:00`,
    title: 'Meeting C',
    summary: 'Summary for meeting C',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:40:00`,
    end: `${getDate()} 03:10:00`,
    title: 'Meeting D',
    summary: 'Summary for meeting D',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:50:00`,
    end: `${getDate()} 03:20:00`,
    title: 'Meeting E',
    summary: 'Summary for meeting E',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 04:30:00`,
    end: `${getDate()} 05:30:00`,
    title: 'Meeting F',
    summary: 'Summary for meeting F',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 00:30:00`,
    end: `${getDate(1)} 01:30:00`,
    title: 'Visit Grand Mother',
    summary: 'Visit Grand Mother and bring some fruits.',
    color: 'lightblue'
  },
  {
    start: `${getDate(1)} 02:30:00`,
    end: `${getDate(1)} 03:20:00`,
    title: 'Meeting with Prof. Behjet Zuhaira',
    summary: 'Meeting with Prof. Behjet at 130 in her office.',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 04:10:00`,
    end: `${getDate(1)} 04:40:00`,
    title: 'Tea Time with Dr. Hasan',
    summary: 'Tea Time with Dr. Hasan, Talk about Project'
  },
  {
    start: `${getDate(1)} 01:05:00`,
    end: `${getDate(1)} 01:35:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(1)} 14:30:00`,
    end: `${getDate(1)} 16:30:00`,
    title: 'Meeting Some Friends in ARMED',
    summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
    color: 'pink'
  },
  {
    start: `${getDate(2)} 01:40:00`,
    end: `${getDate(2)} 02:25:00`,
    title: 'Meet Sir Khurram Iqbal',
    summary: 'Computer Science Dept. Comsats Islamabad',
    color: 'orange'
  },
  {
    start: `${getDate(2)} 04:10:00`,
    end: `${getDate(2)} 04:40:00`,
    title: 'Tea Time with Colleagues',
    summary: 'WeRplay'
  },
  {
    start: `${getDate(2)} 00:45:00`,
    end: `${getDate(2)} 01:45:00`,
    title: 'Lets Play Apex Legends',
    summary: 'with Boys at Work'
  },
  {
    start: `${getDate(2)} 11:30:00`,
    end: `${getDate(2)} 12:30:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(4)} 12:10:00`,
    end: `${getDate(4)} 13:45:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  },
  {
    start: `${getDate(5)} 12:10:00`,
    end: `${getDate(5)} 13:45:00`,
    title: '!!!!Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  }
];
interface BaseAppointmentState {
  currentDate: string 
  events: typeof timelineEvents
  eventsByDate: {
    [key: string]: TimelineEventProps[];
  }
}

const typedMemo: <T>(c: T) => T = React.memo

const MemoWrappedTips = typedMemo(function MemoWrappedTips({setIsAreaActive}) {
  const {start, copilotEvents } = useCopilot()
  const CopilotView = walkthroughable(View);
  const isAreaActive = useAppSelector((state) => state.appointment.isAreaActive)
  const { t, i18n } = useTranslation();

  const [copilotArea, setCopilotArea] = useState(false)
  
  const navigation = useNavigation()
  
  useEffect(() => {
    // function onFocusScreenHandler() {
    //   start()
    // }
    // navigation.addListener('focus', onFocusScreenHandler)

    function copilotHandler() {
      setIsAreaActive(true);
      setCopilotArea(true);
      console.log('STOP FIRED')
    } 
    copilotEvents.on('stop', copilotHandler)
    return () => {
      copilotEvents.off('stop', copilotHandler)
      // navigation.removeListener('focus', onFocusScreenHandler)
    }
  }, [])

  const TipArea = ({copilot }: any) => {

    return (<View {...copilot } style={{
      position: "absolute",
      bottom: 0,
      right: 0,
      height: "50%",
      width: "100%",
    }}>

    </View>)
  }

  return ((!copilotArea && !isAreaActive) ? <View style={{position: "absolute" ,width: "100%", height: "100%"}} onLayout={() => start()}>
      <CopilotStep text={t("screens.appointment.tipFinishContent")} order={1} name="appointmentStart">
        <TipArea />
      </CopilotStep>
    </View> : null)
})

export default function Appointment( {vm, navigation, appointment, setIsAreaActive}: AppointmentContainerAllProps & AppointmentProps & ScreenProps ) {

  const { t, i18n } = useTranslation();

  const [state, setState] = useState<BaseAppointmentState>({
    currentDate: getDate(),
    events: timelineEvents,
    eventsByDate: groupBy(timelineEvents, e => CalendarUtils.getCalendarDateString(e.start))
  });
  const [editMode, setEditMode] = useState(false)
  const [marked, setMarkedDate] = useState({})

  const [modalVisible, setModalVisible] = useState(false)
  
  const [timeObject, setTimeObject] = useState<EventTimeObject>();
  const [title, setTitle] = useState<Nullable<string>>()
  const [summary, setSummary] = useState<Nullable<string>>()
  const [selectedColor, setSelectedColor] = useState('antiquewhite'); 
  const [currentEvent, setCurrentEvent] = useState<Event>()

  const [sendRequestTemp,setSendRequestTemp] = useState(true)
  
  useEffect(() => {
    console.log('LANG CHHHH')
  }, [i18n])
  useEffect(() => {
    const languageChangeHandler = () => {
      LocaleConfig.defaultLocale = i18n.language;
      console.log('L CHANGED!!')
      console.log("LocaleConfig.locales['']",LocaleConfig.locales[''])
    }

    i18n.on("languageChanged", languageChangeHandler)
    
    console.log('DATE',state.eventsByDate)
    console.log('APPOINTMENT MOUNTED!');
    appointment({type: 'getList'}).unwrap()
      .then(({response, type}) => {
        
        setMarkedDate(response.reduce((acc, meeting) => {
          return Object.assign( {
            [timeDateToDate(meeting.start)]: {
              marked: true
            }
          } , acc)
        },{}))  

        setState((s) => ({
          ...s,
          eventsByDate: groupBy(response, e => {
           
            return timeDateToDate(e.start)
          })
        }))
        console.log("i18n.language", i18n.language)
      }).catch((err) => {
        console.log('UI ERR',err)
      })

    return () => {
      setIsAreaActive(false)
      i18n.off("languageChanged", languageChangeHandler)
      console.log('APPOINTMENT UNMOUNTED!')
    }
  }, [])


  

  const createNewEvent: TimelineProps['onBackgroundLongPress'] = (timeString, timeObject) => {
    console.log('timeString', timeString)
    console.log('timeObject', timeObject) // timeObject {"date": "2024-01-08", "hour": 9, "minutes": 30}
    console.log('CALENDAR UTILS ', CalendarUtils.getCalendarDateString(1704386879792));

    setModalVisible(true);
    setTimeObject(timeObject);

    const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
    const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

    console.log('CALENDAR TIME', timeString)

    const newEvent = {
      id: 'draft',
      start: `${timeString}`, // 2024-01-08 09:30:00
      end: `${timeObject.date} ${hourString}:${minutesString}:00`,
      title: 'New Event',
      color: 'white'
    };

    if (timeObject.date) {
      if (state.eventsByDate[timeObject.date]) {

        state.eventsByDate[timeObject.date] = [...state.eventsByDate[timeObject.date], newEvent];
        setState((s) => ({...s,
          eventsByDate: state.eventsByDate
        }));

      } else {
        state.eventsByDate[timeObject.date] = [newEvent];
        setState((s) => ({...s,eventsByDate: {...state.eventsByDate}}));
      }
    }
  };

  function onPressCancel() {
    
    canceledNewEvent(true)
  }

  function onPressApprove() {
      console.log('timeObject?.date',timeObject?.date)
      if(sendRequestTemp) {
        setSendRequestTemp(false)
      
        const draftEvent = {
          ...state.eventsByDate[ currentEvent? timeDateToDate(currentEvent.start): timeObject?.date].find((ev) => ev.id === (currentEvent?.id ?? 'draft'))
        }
        console.log('update DRFAT', draftEvent)
        draftEvent.title = title;
        draftEvent.summary = summary;
        draftEvent.color = selectedColor;
        console.log('after update DRFAT', draftEvent)

        if (draftEvent && !currentEvent) {

          draftEvent.id = null;

          appointment({ 
            data: draftEvent,
            type: 'confirmed'
          }).
            unwrap().
            then(({response, type}) => {
              console.log('timeObject', timeObject)
              setState((s) => ({...s, eventsByDate: { 
                  ...s.eventsByDate,
                  [timeObject?.date]: [...s.eventsByDate[timeObject?.date] , {...response}]
                }
              }));
              Toast.show({type: 'success', text1: t('screens.appointment.success'), visibilityTime: 6000})
              console.log("UI RES",response)
            }).catch((err) => {

              Toast.show({type: 'error', text1: "Try again later"})
              console.log('UI APPOINTMENT ERROR', err)
              
            }).finally(() => {
              canceledNewEvent( true )
            })
        } else {
          // UPDATE
          appointment({ 
            data: draftEvent,
            type: 'canceled'
          }).unwrap()
            .then(({response}) => {
              const updateDate = timeDateToDate(currentEvent.start)
            console.log('updatedEvent', response)
            setState((s) => ({...s, eventsByDate: { ...s.eventsByDate,[updateDate]: s.eventsByDate[updateDate].map((existingEvent) => {
              if( existingEvent.id === response.id ) {
                return response
              }
              return existingEvent
            }) }}));
          }).catch((err) => {

            Toast.show({type: 'error', text1: "Try again later"})
            console.log('UI APPOINTMENT ERROR', err)

          }).finally(() => {
            canceledNewEvent()
          })

        }
      }
  }
  function onEventPress(event: Event & {status: string}) {
    console.log('EE',event)
    console.log('currentEvent',timeDateToDate(event.start))
    event.status = 'canceled';
      setTitle(event.title);
      setSummary(event?.summary);
      setSelectedColor(event.color ?? '#e6add8')
     setCurrentEvent(event)
     
     setModalVisible(true);

     setTimeout(() => {
      setEditMode(true)
     })

  }

  function onPressDelete() {
    const dateToChange = timeDateToDate(currentEvent.start)

    appointment({ 
      data: currentEvent,
      type: 'canceled'
    }).unwrap()
      .then((res) => {
        setState((s) => {
          return {
            ...s,
            eventsByDate: {
              ...s.eventsByDate,
              [dateToChange]: s.eventsByDate[dateToChange].filter((existingEvent) => existingEvent.id !== currentEvent.id)
            }
          }
        })
    }).catch((err) => {
      Toast.show({type: 'error', text1: "Try again later"})
    }).finally(() => {
      canceledNewEvent();
      
    })
  }

  function canceledNewEvent(rollBack?) {
    setSendRequestTemp(true)

    setCurrentEvent(null)

    setTitle(null);
    setSummary(null);
    setModalVisible(!modalVisible);
    if (timeObject?.date && rollBack) {
      setState((s) => ({...s, eventsByDate: {...s.eventsByDate, [timeObject.date]: s.eventsByDate[timeObject.date].filter(e => e.id !== 'draft') }}));
    }

  }

  function onModalCloseHandler() {

    canceledNewEvent( true )
  }

  // const approveNewEvent: TimelineProps['onBackgroundLongPressOut'] = (_timeString, timeObject) => {
  //   console.log('approveNewEvent _timeString',_timeString)
  //   console.log('approveNewEvent timeObject',timeObject)
  //   setTimeObject(timeObject)
  //   setModalVisible(true);

  // };

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    onBackgroundLongPress: createNewEvent,
    onEventPress,
    //onBackgroundLongPressOut: approveNewEvent,
    // scrollToFirst: true,
    // start: 0,
    // end: 24,
    unavailableHours: [{start: 0, end: 6}, {start: 22, end: 24}],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };

  const onDateChanged = (date: string, source: string) => {
    console.log('TimelineCalendarScreen onDateChanged: ', date, source);
    
   
    setState((s) => ({...s,currentDate: date}));
  };

  const onMonthChange = (month: any, updateSource: any) => {
    console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
  };

  function onTitleChange (text) {
    setTitle(text)
  }

  function onSummaryChange(text) {
    setSummary(text)
  }

  

  useEffect(() => {

    setEditMode(false)

  }, [title,summary,selectedColor])

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onModalCloseHandler}>
        <View style={styles.centeredView}>
          {editMode ? (
            <View style={styles.top}>
              <TouchableOpacity style={styles.button} onPress={onPressDelete}>
                <Text style={styles.textStyle}>{t('screens.appointment.delete')}</Text>
              </TouchableOpacity>
            </View>) : (
            <View style={styles.top}>
              <TouchableOpacity style={styles.button} onPress={onPressCancel}>
                <Text style={styles.textStyle}>{t('screens.appointment.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {opacity: !(!!title) ? 0.5 : 1}]} onPress={onPressApprove} disabled={!(!!title)}>
                <Text style={styles.textStyle}>{t('screens.appointment.save')}</Text>
              </TouchableOpacity>
            </View>)
          }

          <View style={styles.modalView}>
            <View style={styles.rowContainer}>
              <Ionicons name="code" size={20} />
              <TextInput 
                  style={styles.input}
                  label={t('screens.appointment.title')}
                  onChangeText={onTitleChange}
                  value={title}
              />
              
            </View>
            <View style={styles.rowContainer}>
              <Ionicons name="code" size={20}/>
              <TextInput 
                  style={styles.input}
                  label={t('screens.appointment.summary')}
                  onChangeText={onSummaryChange}
                  value={summary}
              />
            </View>
            <View style={styles.radioGroup}>
              <CustomRadioButton 
                  color={'antiquewhite'}
                  selected={selectedColor === 'antiquewhite'} 
                  onSelect={() => setSelectedColor('antiquewhite')} 
              /> 
              <CustomRadioButton 
                  color={'pink'}
                  selected={selectedColor === 'pink'} 
                  onSelect={() => setSelectedColor('pink')} 
              /> 
              <CustomRadioButton 
                  color={'salmon'}
                  selected={selectedColor === 'salmon'} 
                  onSelect={() => setSelectedColor('salmon')} 
              /> 
            </View>
           
          </View>
        </View>
      </Modal>
      <CalendarProvider
        date={state.currentDate}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton
        disabledOpacity={0.6}
        style={{zIndex: 22}}
        key={i18n.language}
        // numberOfDays={3}
      >
        <ExpandableCalendar
          firstDay={7}
          markedDates={marked}
        />
         
        <TimelineList
          events={state.eventsByDate}
          timelineProps={timelineProps}
          showNowIndicator={true}
          scrollToNow={true}
      
          initialTime={INITIAL_TIME}
        />
          
      </CalendarProvider>
      <MemoWrappedTips setIsAreaActive={setIsAreaActive} />
    </>
  );
}

function CustomRadioButton ({  selected, onSelect, color }) {
  return ( 
    <TouchableOpacity 
        style={[styles.radioButton, 
        { 
          backgroundColor: color,
          opacity: selected ? 1 : 0.3
        }]} 
        onPress={onSelect} 
    > 
    </TouchableOpacity> 
)}


const styles = StyleSheet.create({
  
  top: {
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBlockColor: 'transparent'
  },
  button: {
    justifyContent: 'center',
    elevation: 2,
    flexGrow: 1,
    height: '100%',
  },
  textStyle: {
    color: '#11a484',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  input: { 
    
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 0,
    borderBottomWidth: 1,

    paddingHorizontal: 10, 
    fontSize: 16, 
    flexGrow: 1,
  }, 
  rowContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    gap: 10
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  modalView: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 15,
    gap: 10,
   
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  

  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  radioGroup:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10
  },
  radioButton: { 
    paddingVertical: 12, 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    marginVertical: 8, 
    
    flexDirection: 'row', 
    alignItems: 'center', 
    
    
    justifyContent: 'space-between', 
  }, 
  

});
