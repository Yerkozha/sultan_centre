import React from "react";
import { connect, ConnectedProps } from 'react-redux'
import Appointment from "@/presentation/view/appointment/Appointment";
import { AppointmentViewModel } from "@/presentation/view-model/appointment/AppointmentViewModel";
import { appointment } from "@/store/appointment/appointment";

const appointmentViewModel = new AppointmentViewModel()

function AppointmentContainer(props) {


    return <Appointment {...props} vm={appointmentViewModel}></Appointment>
}

const connector = connect(null, {
    appointment
})

export type AppointmentContainerAllProps = ConnectedProps<typeof connector> & {
    
}

export default connector(AppointmentContainer)