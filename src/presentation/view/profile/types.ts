import { ProfileViewModel } from "@/presentation/view-model/profile/ProfileViewModel"

type Tape = () => void



export interface ProfileProps   {
    vm: ProfileViewModel,
}

// function bar () {
//     return 1
// }
// const baz: ReturnType<typeof bar> = 1