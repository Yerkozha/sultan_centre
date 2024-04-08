import 'react-native-gesture-handler';
import React, { useEffect } from "react";

import AppNavigators from '@/navigators/Application.tsx';
import { FirebaseMessageHandlers } from "./src/services/PushNotificationController.ts";
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import ErrorBoundary from '@/services/ErrorBoundary.tsx';

import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import BootSplash from "react-native-bootsplash";

import '@/i18n'
import { ErrorFeedback } from '@/services/Toasts.tsx';

import { Base } from '@/api';
import { RequestEngine, ResponseEngine } from '@/api/interceptors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'royalblue',
    
    background: 'white',
  },
};
/**
 * NOTIFICATION SYSTEM
 * HOME PAGE PHOTO
 * LOGO
 * UX/UI LOGIN && PROFILE
 * RELEASE
 * 
 * different db, changing url of db!!!
 */

/**
 * 
 * TASKS SMS login, email
 * fix calendar crud, use materials design theme and other components, 
 * react native firebase token model save
 * chat 
 * photo
 * PRACTICE HARD
 */

/**
 * MUST REVIEW ERRORS
 * 
 * try again in error page <> articles fetching loop
 * 
 * fastImage
 * camera
 * map
 * 
 */


function App(): React.JSX.Element {
  
  
  useEffect(() => {
    Base.getInstance().attachInterceptorEngine(new RequestEngine()).attachInterceptorEngine(new ResponseEngine())

    FirebaseMessageHandlers.requestUserPermission();
    const unsubscribers = FirebaseMessageHandlers.initializeRemoteMessageHandlers();

    const init = async () => {

    }
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });

    return () => {
      if(unsubscribers.length) {
        unsubscribers.forEach((unsubscriber) => unsubscriber())
      }
    }
  }, []);

  return (
      <>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <PaperProvider theme={theme}>
              <ErrorBoundary>
                <AppNavigators />
                <Toast 
                  visibilityTime={4000}
                  topOffset={50}
                  config={{
                    customToast: (props) => <ErrorFeedback {...props} />
                  }}
                />
              </ErrorBoundary>
            </PaperProvider>
          </PersistGate>
        </Provider>
      </>
  )
}

export default App;


/**
 * Backend practice async, eventEmitter
 * 
 * fetch parseError, icon push notification, foreground notification, login error
 * 
 * Video, Image work => stream optimize
 * 
 * AbortControler to abort request actions when fast jumping pages !!!
 */

/**
 * DJANGO LOGS
 * NGINX serve api route
 * 
 * check device request LOAD NGINX try to min request 
 * CHECK ARTICLES ADD ONE
 * 
 *  docker exec -i 4248f909a7ea psql -U postgres -d financial < financial.sql
 * 
 *  back feedback flow
 *  LOGIN/REGISTER
 *  settings page
 *  
 *  bug/fix ( recursive request, login refresh issue +force update,   )
 *  green button
 * 
 *  LOGO / SPLASH SCREEN
 *  rate / feedback feat
 *    
 */

/**
 * @SECURITY @SERVER
 * 
 * @STEPS ( Lock Down Port Level Access to PostgreSQL )
 * On Debian/ Ubuntu systems running UFW firewall, allow inbound traffic on ports 5432 and 22 as shown:
 * sudo ufw allow 5432/tcp 
 * sudo ufw allow 22/tcp
 * sudo ufw reload
 * 
 * 
 * @STEPS ( Disable Remote Access to PostgreSQL )
 * sudo vim /etc/postgresql/14/main/postgresql.conf  // Be sure to replace 14 with the version number of the PostgreSQL database server installed.
 * listen_addresses = 'localhost'
 * sudo systemctl restart postgresql
 * 
 * @STEPS ( Configure Allowed Hosts )
 * Alternatively, you can allow specific hosts to connect to the database server instead of entirely disabling remote connections. This ensures that only authorized users can make a connection to the database server.
 * To achieve this, access the pg_hba.conf file.
 * sudo vim /etc/postgresql/14/main/pg_hba.conf
 * host  sample_db  cherry  client_ip_address/24   md5
 * Let’s have a look at the values in detail. The host attribute indicates that a TCP/IP connection will be used to connect to the database. The sample_db entry specifies the database that the user will connect to. Multiple databases can be specified by separating the database names using a comma. The cherry entry indicates the user that is allowed to make a connection. And just like the database name, multiple users can be specified by separating their names using commas. The client_ip_address entry is the public IP address of the client machine that is connecting to the server. Once you’re done, save and exit the file. Next, edit the postgresql.conf file.
 * 
 * sudo vim /etc/postgresql/14/main/postgresql.conf
 * listen_addresses = 'localhost, server-ip'
 * sudo systemctl restart postgresql
 * 
 * # Set up SSL with PostgreSQL https://www.cherryservers.com/blog/how-to-configure-ssl-on-postgresql
 * 
 * 
 * @LOGS
 * POSTGRES +
 * NGINX +
 * DJANGO 
 * REDIS
 * RABBITMQ
 * CELERY
 */

/*


upstream sync_server {
  keepalive 500;
  # server unix:/app/src/gunicorn.sock fail_timeout=0;
  server 127.0.0.1:8080 fail_timeout=0;
}

location / {
    client_max_body_size 500m;
    # Access control for CORS
    # add_header X-Frame-Options * always;
    # add_header Access-Control-Allow-Origin * always;
    # add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
    # add_header Access-Control-Allow-Headers "Authorization, cache-control, content-range, accept, origin, session-id, content-disposition, x-requested-with, content-type, content-description, referer, user-agent, auth-token, additional, blockid, priority" always;
    # add_header Access-Control-Allow-Credentials "true" always;

    # 10 minute pre-flight approval
    # add_header Access-Control-Max-Age 600 always;
    ##
    # Gzip Settings
    ##

    gzip on;
    gzip_disable "msie6";

    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    proxy_pass http://sync_server;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_redirect     off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # proxy_set_header X-Forwarded-Host $server_name;

    fastcgi_read_timeout        120;
    proxy_connect_timeout       120;
    proxy_send_timeout          120;
    proxy_read_timeout          120;
    send_timeout                120;
  }

*/