<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#171b16">
    <title>NaviVoge</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <main class="app">
        <header class="app-header">
            <div class="logo-mark">NV</div>
            <h1>NaviVoge</h1>
            <p>Conecta tu Voge y proyecta tus aplicaciones.</p>
        </header>

        <section class="main-card">
            <label for="vehicleSelect">Vehículo</label>

            <div class="select-wrapper">
                <select id="vehicleSelect">
                    <option value="">Selecciona un vehículo</option>
                </select>
            </div>

            <button id="connectBtn" class="primary-button" disabled>
                CONECTAR
            </button>

            <button id="addQrBtn" class="secondary-button">
                ＋ AGREGAR ESCANEANDO QR
            </button>

            <div id="status" class="status status-disconnected">
                ● Desconectado
            </div>
        </section>

        <section id="vehicleDetails" class="details-card hidden">
            <div class="details-header">
                <h2 id="detailName">Vehículo</h2>
                <button id="deleteVehicleBtn" class="delete-button" title="Eliminar vehículo">×</button>
            </div>
            <p id="detailModel">Modelo: —</p>
            <p id="detailWifi">Wi-Fi: —</p>
        </section>

        <section id="mirrorSection" class="mirror-card hidden">
            <h2>Mirroring</h2>
            <p>Selecciona cómo quieres utilizar NaviVoge.</p>

            <button class="secondary-button" data-mode="screen">
                📱 PANTALLA COMPLETA
            </button>

            <button class="secondary-button" data-mode="app">
                📲 SELECCIONAR APLICACIÓN
            </button>
        </section>
    </main>

    <!-- Modal para simular el escaneo durante el desarrollo web -->
    <div id="qrModal" class="modal hidden">
        <div class="modal-content">
            <button id="closeQrBtn" class="modal-close">×</button>

            <h2>Agregar vehículo</h2>
            <p class="modal-description">
                En la APK real, aquí se abrirá la cámara para escanear
                el QR mostrado por la Voge.
            </p>

            <div class="qr-placeholder">
                <span>QR</span>
            </div>

            <p class="detected-text">QR detectado</p>

            <label for="vehicleName">Nombre del vehículo</label>
            <input
                id="vehicleName"
                type="text"
                maxlength="40"
                placeholder="Ej.: Mi Voge"
                autocomplete="off"
            >

            <div class="detected-data">
                <strong>Datos detectados</strong>
                <span>Modelo: Voge DS900X</span>
                <span>SSID: VOGE-DS900X-DEMO</span>
            </div>

            <button id="saveVehicleBtn" class="primary-button">
                GUARDAR VEHÍCULO
            </button>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
