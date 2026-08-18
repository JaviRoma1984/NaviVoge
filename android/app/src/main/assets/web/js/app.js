(() => {
  const $ = id => document.getElementById(id);
  const KEY = "navivoge.vehicles.v1";
  let vehicles = [];
  let scanned = null;

  const parseQr = raw => {
    const result = { raw, fields: {} };
    raw.split(/[;&\n,]+/).forEach(part => {
      const i = part.indexOf("=");
      if (i > 0) {
        const k = part.slice(0, i).trim();
        const v = part.slice(i + 1).trim();
        if (k) result.fields[k] = v;
      }
    });
    return result;
  };

  const load = () => {
    try { vehicles = JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch { vehicles = []; }
    renderSelect();
  };

  const persist = () => localStorage.setItem(KEY, JSON.stringify(vehicles));

  const renderSelect = () => {
    const select = $("vehicleSelect");
    const old = select.value;
    select.innerHTML = "";
    if (!vehicles.length) {
      select.innerHTML = '<option value="">No hay vehículos guardados</option>';
      $("connectBtn").disabled = true;
      return;
    }
    vehicles.forEach((v, i) => {
      const option = document.createElement("option");
      option.value = String(i);
      option.textContent = v.name;
      select.appendChild(option);
    });
    if (vehicles[Number(old)]) select.value = old;
    $("connectBtn").disabled = false;
  };

  const openQr = () => {
    $("home").classList.add("hidden");
    $("qrSection").classList.remove("hidden");
    scanned = null;
    $("qrData").classList.add("hidden");
    $("saveBtn").disabled = true;
    $("vehicleName").value = "";
    $("qrStatus").textContent = "Esperando escaneo…";
    $("qrStatus").className = "status status-disconnected";
  };

  const scan = () => {
    $("qrStatus").textContent = "Abriendo cámara…";
    if (window.NaviVogeAndroid?.startQrScanner) {
      window.NaviVogeAndroid.startQrScanner();
    } else {
      $("qrStatus").textContent = "El lector real funciona dentro de la APK Android.";
    }
  };

  window.NaviVogeQrResult = raw => {
    scanned = parseQr(raw);
    $("qrStatus").textContent = "QR leído correctamente";
    $("qrStatus").className = "status status-connected";
    $("qrData").textContent =
      JSON.stringify(scanned.fields, null, 2) + "\n\nTexto original:\n" + raw;
    $("qrData").classList.remove("hidden");
    $("saveBtn").disabled = false;

    const f = scanned.fields;
    if (f.name) $("vehicleName").value = f.name;
    else if ((f.modelid || "").includes("37501")) $("vehicleName").value = "Voge DS900X";
  };

  window.NaviVogeQrError = msg => {
    $("qrStatus").textContent = "Error: " + msg;
    $("qrStatus").className = "status status-disconnected";
  };

  window.NaviVogeQrCancelled = () => {
    $("qrStatus").textContent = "Escaneo cancelado.";
  };

  $("addQrBtn").onclick = openQr;
  $("scanBtn").onclick = scan;
  $("qrBox").onclick = scan;

  // Temporary emulator test button.
  const testBtn = document.createElement("button");
  testBtn.id = "testQrBtn";
  testBtn.className = "secondary-button";
  testBtn.textContent = "Probar con QR de ejemplo";
  $("scanBtn").insertAdjacentElement("afterend", testBtn);
  testBtn.onclick = () => {
    window.NaviVogeQrResult(
      "modelid=37501;ssid=VOGE-TEST;pwd=88888888;auth=WPA2;mac=E0:EE:00:00:00:01"
    );
  };

  $("cancelBtn").onclick = () => {
    $("qrSection").classList.add("hidden");
    $("home").classList.remove("hidden");
  };

  $("saveBtn").onclick = () => {
    const name = $("vehicleName").value.trim();
    if (!name || !scanned) return;
    vehicles.push({
      name,
      qr: scanned.raw,
      fields: scanned.fields,
      createdAt: new Date().toISOString()
    });
    persist();
    renderSelect();
    $("vehicleSelect").value = String(vehicles.length - 1);
    $("qrSection").classList.add("hidden");
    $("home").classList.remove("hidden");
    $("homeStatus").textContent = "Vehículo guardado: " + name;
    $("homeStatus").className = "status status-connected";
  };

  $("connectBtn").onclick = () => {
    const v = vehicles[Number($("vehicleSelect").value)];
    if (!v) return;
    $("homeStatus").textContent = "Conectando con " + v.name + "…";
    $("homeStatus").className = "status status-connecting";
    window.NaviVogeAndroid?.connectVehicle(JSON.stringify(v));
  };

  load();
})();