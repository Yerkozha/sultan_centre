import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
 
import { userSlice } from './user/user'
import { appointmentSlice } from './appointment/appointment'
import { articleSlice } from './articles/articles'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['user'],
}

const rootReducer = combineReducers({
  user: userSlice.reducer,
  appointment: appointmentSlice.reducer,
  articles: articleSlice.reducer
});

const appReducer = (state, action) => {

  return rootReducer(state, action)
}



const persistedReducer = persistReducer(persistConfig, appReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store, null, () => {})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch