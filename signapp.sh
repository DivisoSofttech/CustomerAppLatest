#!/bin/sh

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore graeshoppe.keystore "/home/jishnuj/Desktop/Work/New/CustomerAppLatest/platforms/android/app/build/outputs/apk/release/app-release.apk" alias_name


jarsigner -verify -verbose -certs "/home/jishnuj/Desktop/Work/New/CustomerAppLatest/platforms/android/app/build/outputs/apk/release/app-release.apk"

