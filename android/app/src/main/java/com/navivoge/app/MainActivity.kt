package com.navivoge.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

    private val permissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (granted) {
                launchQrScanner()
            } else {
                toast("NaviVoge necesita permiso de cámara para leer el QR.")
                notifyWeb("window.NaviVogeQrError && window.NaviVogeQrError('Permiso de cámara denegado');")
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        webView.addJavascriptInterface(NaviVogeBridge(), "NaviVogeAndroid")
        webView.loadUrl("file:///android_asset/web/index.html")
    }

    private fun notifyWeb(js: String) {
        webView.post { webView.evaluateJavascript(js, null) }
    }

    private fun toast(message: String) {
        runOnUiThread { Toast.makeText(this, message, Toast.LENGTH_LONG).show() }
    }

    fun requestQrScanner() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            == PackageManager.PERMISSION_GRANTED) {
            launchQrScanner()
        } else {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun launchQrScanner() {
        val options = GmsBarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
            .enableAutoZoom()
            .build()

        val scanner = GmsBarcodeScanning.getClient(this, options)
        scanner.startScan()
            .addOnSuccessListener { barcode ->
                val raw = barcode.rawValue.orEmpty()
                if (raw.isBlank()) {
                    notifyWeb("window.NaviVogeQrError && window.NaviVogeQrError('El QR no contiene texto legible');")
                    return@addOnSuccessListener
                }
                notifyWeb("window.NaviVogeQrResult && window.NaviVogeQrResult(${jsQuote(raw)});")
            }
            .addOnCanceledListener {
                notifyWeb("window.NaviVogeQrCancelled && window.NaviVogeQrCancelled();")
            }
            .addOnFailureListener { error ->
                notifyWeb("window.NaviVogeQrError && window.NaviVogeQrError(${jsQuote(error.message ?: "No se pudo leer el QR")});")
            }
    }

    private fun jsQuote(value: String): String =
        org.json.JSONObject.quote(value)

    inner class NaviVogeBridge {
        @JavascriptInterface
        fun getPlatform(): String = "android"

        @JavascriptInterface
        fun getAppVersion(): String = BuildConfig.VERSION_NAME

        @JavascriptInterface
        fun startQrScanner() {
            runOnUiThread { requestQrScanner() }
        }

        @JavascriptInterface
        fun connectVehicle(vehicleJson: String) {
            toast("Conexión Wi-Fi/Carbit: siguiente fase.")
        }

        @JavascriptInterface
        fun startScreenMirroring() {
            toast("Mirroring: siguiente fase.")
        }
    }
}
