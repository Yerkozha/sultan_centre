import {StyleSheet } from 'react-native'
export const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: '#fff',
    }, 

    innerWrapper: {
        flex: 1,
        justifyContent: 'center',
        padding: 16, 
        gap: 10
    },
    wrapper: {
        flex: 1, 
        justifyContent: 'space-between', 
        padding: 16, 
        gap: 30
    },
    welcomeHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    languageSwitcher: {
        
    },
    languageText: {
        fontFamily: 'Roboto-Reguar',
        lineHeight: 24,
        fontSize: 18,
        textAlign: 'center',
        verticalAlign: 'middle',
        
    },
    introTitle: {
        fontFamily: 'GolosText-Regular',
        fontSize: 18,
        position: 'relative',
        bottom: 22,
        zIndex: 11
    },
    introBtnTitle: {
        fontSize: 16, // Equivalent to text-base in Tailwind CSS
        fontWeight: 'bold', // Equivalent to font-bold,
        fontFamily: 'Roboto-Regular',
        color: '#FFFFFF', // Equivalent to text-white
      },
    introBtn: {
        backgroundColor: '#48BB78', // A generic green color, adjust as needed for bg-green-500
        paddingHorizontal: 40, // Equivalent to px-10
        paddingVertical: 12, // Equivalent to py-2
        alignItems: 'center', // Equivalent to items-center
        borderRadius: 16, // Equivalent to rounded-full
    },
    extraBottomText: {
        color: '#d3d3d3',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        textAlign: 'center'
    },

    mainImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    input: { 
        height: 60,
        marginBottom: 12, 
        paddingHorizontal: 10, 
        fontSize: 16, 
        backgroundColor: 'white',
    }, 
    
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16, 
    }, 
    error: { 
        color: 'red', 
        fontSize: 20, 
        marginBottom: 12, 
    }, 
    inputWrapper: {
        
    },
    errorText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: 'red', 
        position: 'relative',
        bottom: 10
    },
    link: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,

    },
    linkWrapper: {
        position: 'relative',
        bottom: 5
    }
});