

Java.performNow(() => {
    const GetString = Java.use('android.app.SharedPreferencesImpl').getString.overloads[0];
    GetString.implementation = (key, def) => {
        if (key === 'install_referrer') return 'utm_source=facebook_ads&utm_medium=Non-rganic&media_source=true_network&http_referrer=BingSearch'
        return GetString(key, def)
    }
})
