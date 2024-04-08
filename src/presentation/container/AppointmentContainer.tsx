import React, {useEffect} from "react";
import { connect, ConnectedProps } from 'react-redux'
import Appointment from "@/presentation/view/appointment/Appointment";
import { AppointmentViewModel } from "@/presentation/view-model/appointment/AppointmentViewModel";
import { appointment, setIsAreaActive } from "@/store/appointment/appointment";

import { CopilotProvider } from "react-native-copilot";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store";

const appointmentViewModel = new AppointmentViewModel()

function AppointmentContainer(props) {

    const { t, i18n } = useTranslation();
    useEffect(() => {
        return () => {
            console.log('Appointment unmount container')
            props.setIsAreaActive(false)
        }
    })

    return (
        <CopilotProvider overlay="svg"
        labels={{
            finish: t("screens.appointment.tipFinish")
          }}
        >
            <Appointment {...props} vm={appointmentViewModel}></Appointment>
        </CopilotProvider>
    )
}
const connector = connect((state: RootState) => ({accessToken: state.user.access}), {
    appointment,
    setIsAreaActive
})

export type AppointmentContainerAllProps = ConnectedProps<typeof connector> & {
    
}

export default connector(AppointmentContainer)