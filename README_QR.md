# NaviVoge 0.2.0 — lector QR

Esta versión sustituye el cuadrado QR de prueba por el lector QR real de Android.

Al pulsar **Agregar escaneando QR**:
1. Android solicita permiso de cámara si es necesario.
2. Se abre el escáner de Google ML Kit.
3. Solo se busca un código QR.
4. El texto leído vuelve a la interfaz web mediante el puente `NaviVogeAndroid`.
5. La interfaz intenta interpretar los campos típicos del QR Carbit/Voge:
   `modelid`, `ssid`, `pwd`, `auth`, `mac`, `action`, `name`, etc.

Después de leerlo, el formulario muestra los datos detectados y permite asignar el nombre del vehículo y guardarlo.

La conexión Wi-Fi y el protocolo Carbit todavía no se ejecutan; este paso es exclusivamente para validar la lectura y el almacenamiento del QR real.
