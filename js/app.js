const STORAGE_KEY = "navivoge_vehicles";

document.addEventListener("DOMContentLoaded", () => {
    const vehicleSelect = document.getElementById("vehicleSelect");
    const connectBtn = document.getElementById("connectBtn");
    const addQrBtn = document.getElementById("addQrBtn");
    const deleteVehicleBtn = document.getElementById("deleteVehicleBtn");

    const status = document.getElementById("status");
    const vehicleDetails = document.getElementById("vehicleDetails");
    const detailName = document.getElementById("detailName");
    const detailModel = document.getElementById("detailModel");
    const detailWifi = document.getElementById("detailWifi");
    const mirrorSection = document.getElementById("mirrorSection");

    const qrModal = document.getElementById("qrModal");
    const closeQrBtn = document.getElementById("closeQrBtn");
    const saveVehicleBtn = document.getElementById("saveVehicleBtn");
    const vehicleNameInput = document.getElementById("vehicleName");

    loadVehicles();

    vehicleSelect.addEventListener("change", updateSelectedVehicle);

    addQrBtn.addEventListener("click", () => {
        vehicleNameInput.value = "";
        qrModal.classList.remove("hidden");
        vehicleNameInput.focus();
    });

    closeQrBtn.addEventListener("click", closeModal);

    qrModal.addEventListener("click", (event) => {
        if (event.target === qrModal) {
            closeModal();
        }
    });

    saveVehicleBtn.addEventListener("click", saveVehicle);

    vehicleNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveVehicle();
        }
    });

    connectBtn.addEventListener("click", connectSelectedVehicle);

    deleteVehicleBtn.addEventListener("click", deleteSelectedVehicle);

    document.querySelectorAll("[data-mode]").forEach((button) => {
        button.addEventListener("click", () => {
            const mode = button.dataset.mode;

            if (mode === "screen") {
                alert("Mirroring de pantalla completa: pendiente de implementar en Android.");
            } else {
                alert("Selección de aplicación: pendiente de implementar en Android.");
            }
        });
    });

    function loadVehicles() {
        const vehicles = getVehicles();

        vehicleSelect.innerHTML =
            '<option value="">Selecciona un vehículo</option>';

        vehicles.forEach((vehicle) => {
            const option = document.createElement("option");
            option.value = vehicle.id;
            option.textContent = vehicle.name;
            vehicleSelect.appendChild(option);
        });

        if (vehicles.length === 0) {
            updateSelectedVehicle();
        }
    }

    function updateSelectedVehicle() {
        const vehicle = getSelectedVehicle();

        if (!vehicle) {
            vehicleDetails.classList.add("hidden");
            mirrorSection.classList.add("hidden");
            connectBtn.disabled = true;
            setStatus("● Sin vehículo seleccionado", "disconnected");
            return;
        }

        vehicleDetails.classList.remove("hidden");
        detailName.textContent = vehicle.name;
        detailModel.textContent = `Modelo: ${vehicle.model}`;
        detailWifi.textContent = `Wi-Fi: ${vehicle.ssid}`;

        connectBtn.disabled = false;
        setStatus("● Listo para conectar", "disconnected");
    }

    function saveVehicle() {
        const name = vehicleNameInput.value.trim();

        if (!name) {
            alert("Escribe un nombre para el vehículo.");
            vehicleNameInput.focus();
            return;
        }

        const vehicles = getVehicles();

        const vehicle = {
            id: crypto.randomUUID
                ? crypto.randomUUID()
                : String(Date.now()),
            name,
            model: "Voge DS900X",
            ssid: "VOGE-DS900X-DEMO",
            password: "DEMO_PASSWORD",
            auth: "WPA2",
            mac: "00:00:00:00:00:00",
            modelId: "DEMO",
            createdAt: new Date().toISOString()
        };

        vehicles.push(vehicle);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));

        closeModal();
        loadVehicles();

        vehicleSelect.value = vehicle.id;
        updateSelectedVehicle();

        setStatus("● Vehículo guardado", "connected");
    }

    function connectSelectedVehicle() {
        const vehicle = getSelectedVehicle();

        if (!vehicle) {
            return;
        }

        setStatus(`● Conectando con ${vehicle.name}...`, "connecting");
        connectBtn.disabled = true;

        /*
         * FUTURO ANDROID:
         * 1. Leer los datos reales guardados del QR.
         * 2. Solicitar/conectar a la Wi-Fi de la moto.
         * 3. Descubrir Carbit/PXC.
         * 4. Realizar handshake.
         * 5. Preparar MediaProjection.
         */

        setTimeout(() => {
            setStatus(`● ${vehicle.name} conectada`, "connected");
            mirrorSection.classList.remove("hidden");
            connectBtn.disabled = false;
        }, 1200);
    }

    function deleteSelectedVehicle() {
        const vehicle = getSelectedVehicle();

        if (!vehicle) {
            return;
        }

        const confirmed = confirm(
            `¿Quieres eliminar el vehículo "${vehicle.name}"?`
        );

        if (!confirmed) {
            return;
        }

        const vehicles = getVehicles().filter(
            (item) => item.id !== vehicle.id
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));

        vehicleSelect.value = "";
        loadVehicles();
        updateSelectedVehicle();
    }

    function getSelectedVehicle() {
        const id = vehicleSelect.value;

        if (!id) {
            return null;
        }

        return getVehicles().find((vehicle) => vehicle.id === id) || null;
    }

    function getVehicles() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("No se pudieron leer los vehículos:", error);
            return [];
        }
    }

    function closeModal() {
        qrModal.classList.add("hidden");
    }

    function setStatus(text, type) {
        status.textContent = text;
        status.className = "status";

        if (type === "connecting") {
            status.classList.add("status-connecting");
        } else if (type === "connected") {
            status.classList.add("status-connected");
        } else {
            status.classList.add("status-disconnected");
        }
    }
});
