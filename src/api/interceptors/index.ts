

export class RequestEngine {

    type = 'request';

    *[Symbol.iterator]() {
        const funcs = Object.getOwnPropertyNames(RequestEngine.prototype)
        for( let i = funcs.length; i > 0; i-- ) {
            yield this[funcs[i]]
        }
        
    }

    attachAccessToken( request, access ) {

        console.log(request.headers.has('Authorization'), 'interceptor TOKEN HAS')

        console.log('INSIDE ATTACH TOKEN INTERCEPTOR' , request )

        if( !/(login|registration|refresh|devices|list_articles)/g.test(request.url) && !request.headers.has('Authorization') ) {
            console.log("REGS")
            request.headers.set('Authorization', `Bearer ${access}`)
        }
       
        return request
    }
    
}

export class ResponseEngine {

    /**
     * Retry logic,
     * LOGGING ERRORS service
     */

    type = 'response';
    
    

    *[Symbol.iterator]() {
        const funcs = Object.getOwnPropertyNames(ResponseEngine.prototype)
        for( let i = funcs.length; i > 0; i-- ) {
            yield this[funcs[i]]
        }
    }

    async responseParse( response, prevRequest ){
        console.log('response.ok', response )
        if( response.ok && !response.bodyUsed) {
            /**
             * ArrayBuffer, blob
             */

            console.log('inside',response)
            const data = await response.json()
            
            /**
             * DELETE DEBUG IN PROD
             */
            // if(Object.hasOwn(data, 'articles')) {
            //     Object.defineProperty(data, 'articles', {
            //         enumerable: false,
            //     })
            // }
            //
            return data

        } else if ( response.status == 401 ) {
            


        }
        
        console.log( 'THROW FETCH ERROR ================>', response)
        throw response
    }

    /**
     * HANDLE PROPERLY ALL TYPE OF ERROR with FEEDBACK UI
     * type of Error range ( network, server,  )  Error instanceof TypeError error.name err.message
     * 
     * 
     * RETRY logic : if access expired 401 try to fetch refresh if refresh 401 in blacklist then redirect to LOGIN 
     */

}