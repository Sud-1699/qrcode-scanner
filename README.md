# QR Code Scanner

A mobile based QR code scanner for both Android and iOS using ionic along with angular and capacitor. And for QR code scanner it using [Capacitor mlkit barcode scanner plugin](https://capawesome.io/plugins/mlkit/barcode-scanning/).

### Prerequisites
```
Node.JS (v20+)
Angular (v19+)
Ionic (v7+)
```

### Camera Permission setup
#### Android
##### Permissions
This API requires the following permissions be added to your `AndroidManifest.xml` before the `application` tag:
```
<uses-permission android:name="android.permission.CAMERA" />
```
You also need to add the following meta data in the `application` tag in your `AndroidManifest.xml`:
```
<meta-data android:name="com.google.mlkit.vision.DEPENDENCIES" android:value="barcode_ui"/>
<!-- To use multiple models: android:value="face,model2,model3" -->
```
#### iOS
##### Minimum Deployment Target
Make sure to set the deployment target in your `ios/App/Podfile` to at least `15.5`:
```
platform :ios, '15.5'
```
##### Usage Description
Add the NSCameraUsageDescription key to the ios/App/App/Info.plist file, which tells the user why the app needs to use the camera:
```
+ <key>NSCameraUsageDescription</key>
+ <string>The app enables the scanning of various barcodes.</string>
```

### How to run the application ?
```
npm install
npm run android-build
npm run ios-build
```

### Demo
https://github.com/user-attachments/assets/22e077b1-9104-4ab4-a6ad-6d6082454361

