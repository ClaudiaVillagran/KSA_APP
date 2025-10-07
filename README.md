# README KSAPP — React Native + TypeScript + Firebase

Proyecto base en React Native + TypeScript con integración de Firebase usando un archivo de constantes centralizado.

## Requisitos

Node.js 18+ y npm
Expo CLI: npm i -g expo
(Opcional para nativo) Java 17, Android Studio / SDK, Xcode (macOS)
Dispositivo físico o emulador/simulador para pruebas

## Crea el archivo de constantes:

```bash
src/constants/FirebaseConstants.ts
```

## Contenido

```bash
export const FirebaseConstants = {
  API_KEY : "",
  AUTH_DOMAIN: "",
  PROJECT_ID: "",
  STORAGE_BUCKET: "",
  MESSAGING_SENDER_ID: "",
  APP_ID: ""
};
```

## Instala dependencias:

```bash
npm install
```

## Inicia el proyecto:

```bash
npm start

##Con Expo: elige “w” (Web), “a” (Android) o “i” (iOS).
```

## Configuración de Firebase

Ve a Firebase Console → crea un Proyecto.

Agrega una App Web para obtener las credenciales.

Pega valores en FirebaseConstants.ts:

API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID