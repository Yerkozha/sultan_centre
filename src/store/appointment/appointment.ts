
import { AppointmentController, AuthController } from '@/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { AppointmentCredentials } from '@/api/types';
import { Appointment } from '@/api/types';
import { isObject } from '@/utils';


interface AppointmentState {
    appointments: Nullable<Array<Appointment>>,
    error: Array<unknown>
}

interface IncomeAppointmentType {
    data?: Omit<AppointmentCredentials,'user_id'>
    type: string
}

export const appointment = createAsyncThunk( 'appointment/process' , async ( appointmentDetails: IncomeAppointmentType, thunkAPI ) => {
    let 
        response;
    const 
        state = thunkAPI.getState() as RootState;
    try{

        if(appointmentDetails.type === 'confirmed') {
        
            response = await AppointmentController.createAppointment({ user_id: state.user.authenticatedUser.id, ...appointmentDetails.data });

        } else if( appointmentDetails.type === 'canceled' ) {
            
            response = await AppointmentController.updateAppointment( appointmentDetails.data );


        } else if( appointmentDetails.type === 'getList' ) {

            response = await AppointmentController.getListAppointments(state.user.authenticatedUser.id);

        }
        

        console.log('APPOINTMENT RESPONSE', response)
        return {
            type: appointmentDetails.type,
            response
        }
        
    }catch( error ) {
        console.log('APPOINTMENT ERROR', error)
        throw thunkAPI.rejectWithValue(error)
    }
    
})

const initialState: AppointmentState = {
    appointments: null,
    error: []
} 

export const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        appointmentResetStore: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(appointment.fulfilled, (state, { payload }) => {
            
            /**
             * UPDATE, CREATE
             */
            if( payload.type === 'confirmed' ) {
                
                state.appointments.push(payload.response)

            } else if( payload.type === 'canceled' ) {
                
                const foundId = state.appointments.findIndex(( appointmentRecord ) => appointmentRecord.id == payload.response.id)
                state.appointments[foundId] = payload.response
                console.log('CANCELED', state.appointments[foundId] )
            } else {

                return {
                    appointments: payload.response,
                    error: []
                }            
            }
            
            
        })
        builder.addCase(appointment.rejected, (state, { payload }) => {

            state.error = [payload]

        })
    }
})

export const { appointmentResetStore } =  appointmentSlice.actions


