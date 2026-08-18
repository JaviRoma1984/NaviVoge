# NaviVoge - primera APK

Esta versión añade un proyecto Android mínimo basado en Kotlin + WebView.

## Qué hace ahora

- Ejecuta la interfaz web de NaviVoge dentro de una APK.
- Mantiene `localStorage` para los vehículos.
- Expone un puente JavaScript llamado `NaviVogeAndroid`.
- Deja preparados los puntos de integración para:
  - lector QR real,
  - conexión Wi-Fi de la Voge,
  - protocolo Carbit,
  - MediaProjection/mirroring.

## Abrir el proyecto

En Android Studio:

1. Abre la carpeta:
   `NaviVoge/android`
2. Espera a que Gradle sincronice el proyecto.
3. Conecta un teléfono Android con depuración USB o usa un emulador.
4. Pulsa Run.

No se ha implementado todavía la conexión real a la Voge ni el mirroring. Es intencionado: primero comprobamos que la APK arranca y que la interfaz funciona dentro de Android.

## Próximo paso

Implementar el lector QR Android y convertir el contenido real de tu QR de la DS900X en un objeto de vehículo guardado por NaviVoge.
