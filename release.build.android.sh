#!/bin/bash
cd /Users/jishnuj/Desktop/work/CustomerAppLatest/platforms/android/app/build/outputs/apk/release/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Users/jishnuj/Desktop/work/CustomerAppLatest/foodexp.pkcs12 app-release-unsigned.apk foodexp.ie
/Users/jishnuj/Library/Android/sdk/build-tools/28.0.3/zipalign -v 4 app-release-unsigned.apk foodexp-release.apk