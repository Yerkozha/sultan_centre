import { ArticlesController, AuthController } from '@/api'
import { ArticleCredentials, AuthResponse, UserCredentials } from '@/api/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'

export type Article = {
  id: number 
  title: string
  content: string
  source: Nullable<string>
  image: string
}

interface ArticlesInterface {
  articles: Nullable<Article[]>
  error: Nullable<Array<unknown>>
}

interface IncomeArticlesType {
  data?: ArticleCredentials
  type: string
}

const initialState: ArticlesInterface = {
  articles: null,
  error: []
}



export const articles = createAsyncThunk('artices/home', async (article: IncomeArticlesType, {rejectWithValue, getState}) => {

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
    
    let data;
    try {
      if( article.type === 'getList' ) {

        data = await ArticlesController.getListArticles()

        // const {articles} = getState() as RootState
        // console.log('articles', articles )

      } else if( article.type === 'createArticle' ) {

        data = await ArticlesController.createArticle<ArticleCredentials>(article)

      }

      console.log('FINAL DATA RESPONSE$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', data )

      if( data?.success === true ) {
       
        return data
      }
      console.log('REJECTED', data)
      throw rejectWithValue(data)

    } catch(error) {
      console.log('THROWN ERROR ', error)

      

      throw rejectWithValue(error)

    }
    
})


/**
 * AbortControler to abort request actions when fast jumping pages !!!
 */

export const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    resetArticles: (state) => initialState,
    
  },

  extraReducers: (builder) => {

    builder.addCase(articles.fulfilled, (state, { payload }) => {

      console.log( 'UPDATE STATE with FOLLOWING PAYLOAD', payload )
      Object.assign(payload, {
        error: [],
      })
      return {
        ...payload,
      }

    })

    builder.addCase(articles.rejected, (state, data: any) => {

      state.error = [data.payload] 

    })

  } 
})

// Action creators are generated for each case reducer function
export const { resetArticles } = articleSlice.actions


