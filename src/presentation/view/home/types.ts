import { RootStackParamList } from "@/navigators/types";
import { HomeViewModel } from "@/presentation/view-model/home/HomeViewModel"
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Tape = () => void



export interface HomeProps   {
    vm: HomeViewModel,
}

// function bar () {
//     return 1
// }
// const baz: ReturnType<typeof bar> = 1