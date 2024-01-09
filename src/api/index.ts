import { store } from "@/store";
import { UserCredentials } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userResetStore } from "@/store/user/user";
import { appointmentResetStore } from "@/store/appointment/appointment";


interface FetchOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    mode?: 'no-cors' | 'cors' | 'same-origin';
    cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
    credentials?: 'include' | 'same-origin' | 'omit';
    headers?:  Record<string, string>;
    redirect?: 'manual' | 'follow' | 'error';
    referrerPolicy?: | 'no-referrer'
                | 'no-referrer-when-downgrade'
                | 'origin'
                | 'origin-when-cross-origin'
                | 'same-origin'
                | 'strict-origin'
                | 'strict-origin-when-cross-origin'
                | 'unsafe-url'; // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body?: unknown;                // body data type must match "Content-Type" header
}

abstract class FetchBase {

    protected static originURL: Nullable<string> = 'http://127.0.0.1:8000/';

    protected static fetchOptions: RequestInit = {
        method: "POST", 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: undefined as BodyInit_ | undefined
    }

    // protected static status: Nullable<"success" | "error"> = null;

    
}

export class Base extends FetchBase {
    private _requestInterceptors = new Set()
    private _responseInterceptors = new Set()
    
    private static _instance = null
    requestEngine = null
    responseEngine = null

    addRequestInterceptors( requestInterceptorHandler ) {
        this._requestInterceptors.add(requestInterceptorHandler)
    }

    addResponseInterceptors( responseInterceptorHandler ){
        this._responseInterceptors.add(responseInterceptorHandler)
    }

    attachInterceptorEngine(engine){
        
        for ( const interceptor of engine ) {
            
            if( engine.type === 'request' && interceptor ) {
                this.requestEngine = engine
                this.addRequestInterceptors(interceptor)

            } else if( engine.type === 'response'  && interceptor ) {
                this.responseEngine = engine
                this.addResponseInterceptors(interceptor)
                
            }
            
        }
        return this
    }

    get requestInterceptors() {
        return this._requestInterceptors
    }
    get responseInterceptors() {
        
        return this._responseInterceptors
    }

    static getInstance() {
        if(!this._instance){
            this._instance = new Base()
        }
        return this._instance
    }

    static makeRequestBasedOnOptions( url, baseOptions, customOptions ) {

        /**
         * new Header()
         */
        const headers = new Headers({
            ...baseOptions['headers'],
            ...customOptions['headers']
        })

        const request = new Request(url, {
            ...baseOptions,
            ...customOptions,
            headers
        });

        console.log('MAKEQUEST', request)
        return request
    }
    

    static async fetch<T>( restEndpoint, fetchOptions?: RequestInit ): Promise<T> {
        /**
         * if sign headers before it throw 415 because there is no Content-Type
         * 
         * image, audio, video, txt files handle stream
         */
        const access = await AsyncStorage.getItem('access')

        const request = this.makeRequestBasedOnOptions( this.originURL + restEndpoint, super.fetchOptions, fetchOptions )
        
        console.log("MERGED REQUEST OPTIONS", request)

        const httpBase = this.getInstance()

        for(const interceptor of httpBase.requestInterceptors){

            interceptor.call(httpBase.requestEngine, request, access)

        }

        console.log('FINAL MAKE REQUEST ', request )

        let response: any = await this.makeRequest(request)

        console.log( 'RESPONSE =>', response)

        for(const interceptor of httpBase.responseInterceptors){
            response = await interceptor.call(httpBase.responseEngine, response, request)
            
        }
        
        console.log(response, 'response')
        return response
    }
    

    static async makeRequest( request, retryOption = {
        count: 2,
        delay: (time) => time * 1000,
        delayCount: 0
    } ) {
        /**
         * Server, network, limit request
         * recursive request 401,
         * 
         * one point truth, one way flow
         */
        console.log('retryOption', retryOption)
        console.log('makeRequest REQUEST', request)

        
        let response: Awaited<ReturnType<typeof fetch>> = await new Promise((resolve, reject) => {
            setTimeout( () => {

                resolve(fetch( request.clone()))

            }, retryOption.delay(retryOption.delayCount++) ) ;
        }) 
        
        console.log('makeRequest RESPONSE', response)

        if( response.ok ) {

            return response

        } else if( response.status === 401 && --retryOption.count > 0 ) {
            /**
             * 2 times only, not recursive
             */
            const response = await this.retryRequest(request, retryOption)
            return response

        } else if ( /refresh/.test(response.url) ) {

            this.clearStorage();

        }

        
        throw await this.serializerResponse(response)
    }

    // static async COPY(prevRequest: InstanceType<typeof Request>, {retry, delay}) {
    //     let response = null// await this.refreshToken();

    //     prevRequest = this.makeRequestBasedOnOptions(prevRequest.url, super.fetchOptions, { headers: {
    //             Authorization: `Bearer ${response.access}`,
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({refresh: response.refresh}) 
    //     });


    //     return new Promise((resolve, reject) => {
    //         let i = 0;
    //         execute.call(this)

    //         function doRetry(err) {
    //             if( retry-- <= 0 ) {
    //                 reject(err)
    //             }

    //             setTimeout(execute, delay(++i))
    //         }

    //         function execute() {
                
    //             try{

    //                 Promise.resolve(this.makeRequest(prevRequest)).then(resolve).catch(doRetry)

    //             }catch(err) {

    //                 doRetry(err)

    //             }

    //         }



    //     })

    // }

    static async serializerResponse(response) {

        if( response instanceof Response  ) {
            return await response.json()

        }

        return response

    }

    static async retryRequest(prevRequest: InstanceType<typeof Request>, retryOption) {

        let response = await this.refreshToken(retryOption);

        prevRequest = this.makeRequestBasedOnOptions(prevRequest.url, super.fetchOptions, { headers: {
                Authorization: `Bearer ${response.access}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refresh: response.refresh}) 
        });
        console.log('before REFRESH', retryOption)
        return await this.makeRequest(prevRequest, retryOption)

    }

    static async refreshToken(retryOption) {
        /**
         * consider retrieve from state
         */

        const refresh = await AsyncStorage.getItem('refresh')
        const customOptions = {
            headers:{},
            body: JSON.stringify({refresh})
        }

        let response: any = await this.makeRequest(this.makeRequestBasedOnOptions( this.originURL + 'api/token/refresh/', super.fetchOptions, customOptions ), retryOption);

        if(!response.bodyUsed) {
            response = await response.json();
        }
        
        
        if( response?.success ) {
            this.clearStorage();
            await AsyncStorage.setItem('refresh', response.refresh);
            await AsyncStorage.setItem('access', response.access);

            return response 
        }
        console.log('REFRESH TOKEN BLACK LIST')
        throw response
    }

    static async clearStorage() {
        await AsyncStorage.removeItem('refresh');
        await AsyncStorage.removeItem('access');
        await store.dispatch(userResetStore())
        await store.dispatch(appointmentResetStore())
    }

}



export class AuthController extends Base {

    static async login<T>( credentials: UserCredentials ): Promise<T> {
        
        const data = await this.fetch<T>('users/login/', {
            body: JSON.stringify(credentials)
        })

        return data

    }

    
    static async logout( credentials ) {
        
        const data = await this.fetch('users/logout/', {
            headers: {
                Authorization: `Bearer ${credentials.access}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refresh: credentials.refresh})
        })

        return data

    }

    static async registration<T>( credentials: UserCredentials ): Promise<T> {

        const data = await this.fetch<T>( 'users/registration/', {
            body: JSON.stringify(credentials)
        })

        return data
    }

}

export class AppointmentController extends Base {

    static async createAppointment( appointmentDetails ) {

        const data = await this.fetch( 'users/appoinments/confirm_appointment/', {
            body: JSON.stringify(appointmentDetails)
        } )
        
        return data
    }

    static async updateAppointment( appointmentDetails ) {

        const data = await this.fetch( `users/appoinments/${appointmentDetails.id}/cancel_appointment/`, {
            body: JSON.stringify(appointmentDetails),
            method: 'PUT'
        } )
        
        return data
    }

    static async getListAppointments(userId) {

        const data = await this.fetch( `users/appoinments/${userId}/user_appointment`, {
            method: "GET"
        })

        return data
        
    }

}

function attachToken(target:any, ctx) {


    return async function(credentials) {


        return Promise.resolve(1)
    }
}