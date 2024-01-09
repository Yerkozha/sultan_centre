import { AppointmentViewModel } from "@/presentation/view-model/appointment/AppointmentViewModel";


export interface AppointmentProps  {
    vm: AppointmentViewModel
}

export interface EventTimeObject {
    hour: number;
    minutes: number;
    date?: string;
}