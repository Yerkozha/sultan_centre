import { AuthController } from '@/api'
import { AuthResponse, UserCredentials } from '@/api/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'

interface UserInitialState {
  access: Nullable<string>
  refresh: Nullable<string>
  authenticatedUser: {
    email: string
    role: string | number,
    id: number
  }
  password: Nullable<string>
  language: string
  error: Nullable<Array<unknown>>
  
}

const initialState: UserInitialState = {
  access: null,
  refresh: null,
  authenticatedUser: null,
  language: 'en',
  error: [],
  password: null
}

export const auth = createAsyncThunk('user/auth', async (auth: UserCredentials & {type: string}, {rejectWithValue, getState}) => {

    /**
     * throw err and show ui (can not render error object)
     * 
     * get from state access and refresh
     * try to diminish AsyncStorage ( single source of truth )
     * 401 for all protected routes retry refresh method ?
     * logo
     * 415, 400 RE CHECK
     *  
     * other kind of ERRORS which can not communicate server redirect login
     * 
     * feat home (tape) & appointemnt & logo => release 1.0.0 
     */
    
    const { email, password } = auth;
    let data;
    try {
      if( auth.type === 'registration' ) {

        data = await AuthController.registration<AuthResponse>( {email, password} )
        

      } else if(auth.type === 'login') {

        data = await AuthController.login<AuthResponse>( {email, password} )

      } else if(auth.type === 'logout') {
        /**
         * instance with token login
         * UPDATE TOKEN REFRESH
         * RETRY WITH NEW TOKEN AUTH
         */

        const {user} = getState() as RootState
        
        data = await AuthController.logout( {access: user.access, refresh: user.refresh } )
        
      }

      console.log('FINAL DATA RESPONSE$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', data )

      if( data?.success === true ) {

        data.password = password
        
        if( auth.type === 'logout' ) {
          return initialState
        }
        return data
      }
      console.log('REJECTED', data)
      throw rejectWithValue(data)

    } catch(error) {

      console.log('THROWN ERROR ', error)

      if( error instanceof TypeError ) {
        console.log('NETWORK MESSAGE ', error.message)
        console.log('NETWORK NAME ', error.name)
        /**
         * perform try again UI
         */
      }

      throw rejectWithValue(error)

    }
    
})




export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userResetStore: (state) => initialState,
    resetError: (state) => { state.error = [] }
  },

  extraReducers: (builder) => {

    builder.addCase(auth.fulfilled, (state, { payload }) => {

      console.log( 'UPDATE STATE with FOLLOWING PAYLOAD', payload )

      return {
        ...payload,
        language: 'en',
        error: []
      }

    })

    builder.addCase(auth.rejected, (state, data: any) => {

      state.error = [data.payload] 

    })

  } 
})

// Action creators are generated for each case reducer function
export const { resetError, userResetStore } = userSlice.actions


