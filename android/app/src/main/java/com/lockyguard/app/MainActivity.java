package com.lockyguard.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.util.Log;
import android.content.res.Configuration;
import android.webkit.WebView;
import java.util.ArrayList;
import com.getcapacitor.Plugin;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "LockyGuardActivity";
    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final boolean PRODUCTION_MODE = true; // Mode production

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Enregistrement des plugins avant l'appel à super.onCreate
        registerPlugins();
        
        super.onCreate(savedInstanceState);

        // Activer les logs pour le WebView seulement en mode développement
        WebView.setWebContentsDebuggingEnabled(!PRODUCTION_MODE);
        
        // Optimisations pour Android
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            // Désactiver les fonctionnalités web inutiles pour réduire la consommation de ressources
            webView.getSettings().setGeolocationEnabled(false);
            webView.getSettings().setAllowFileAccess(false);
            webView.getSettings().setAllowContentAccess(false);
            webView.getSettings().setDatabaseEnabled(false);
            
            // Optimisation de la mémoire
            webView.getSettings().setDomStorageEnabled(true);
            // Note: setAppCacheEnabled est obsolète dans les versions récentes d'Android
        }
        
        // Vérifier et demander les permissions nécessaires
        checkAndRequestPermissions();
        
        // Effacer le statut d'authentification au démarrage de l'application
        clearAuthenticationState();
        
        Log.d(TAG, "MainActivity.onCreate completed");
    }
    
    /**
     * Efface l'état d'authentification stocké dans le localStorage au démarrage de l'application
     */
    private void clearAuthenticationState() {
        // S'assurer que le bridge est initialisé
        if (bridge != null && bridge.getWebView() != null) {
            Log.d(TAG, "Effacement de l'état d'authentification au démarrage");
            
            // Exécuter un script JavaScript pour supprimer l'état d'authentification du localStorage
            final String clearAuthScript = 
                "if (localStorage) {" +
                "   localStorage.setItem('isAuthenticated', 'false');" +
                "   localStorage.setItem('forceLogout', 'true');" +
                "   console.log('État d\\'authentification réinitialisé au démarrage de l\\'application');" +
                "}";
            
            // Lancer le script quand le webview est prêt
            bridge.getWebView().post(() -> {
                bridge.getWebView().evaluateJavascript(clearAuthScript, null);
            });
        } else {
            Log.e(TAG, "Bridge ou WebView non initialisé, impossible d'effacer l'état d'authentification");
        }
    }
    
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        
        // Ajuster l'interface en fonction de la configuration (mode jour/nuit)
        int currentNightMode = newConfig.uiMode & Configuration.UI_MODE_NIGHT_MASK;
        if (currentNightMode == Configuration.UI_MODE_NIGHT_YES) {
            // Mode nuit activé
            Log.d(TAG, "Mode nuit activé");
        } else {
            // Mode jour activé
            Log.d(TAG, "Mode jour activé");
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Ré-exécuter la réinitialisation de l'état d'authentification lors de la reprise de l'activité
        clearAuthenticationState();
        Log.d(TAG, "onResume: État d'authentification réinitialisé");
    }
    
    /**
     * Vérifie et demande les permissions nécessaires selon la version d'Android
     */
    private void checkAndRequestPermissions() {
        // Pour Android 13+ (API 33+)
        if (Build.VERSION.SDK_INT >= 33) { // Build.VERSION_CODES.TIRAMISU
            ArrayList<String> permissionsToRequest = new ArrayList<>();
            
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
            
            if (!permissionsToRequest.isEmpty()) {
                ActivityCompat.requestPermissions(this, permissionsToRequest.toArray(new String[0]), PERMISSION_REQUEST_CODE);
            }
        } 
        // Pour Android 10 et inférieur (API 29 et inférieur)
        else if (Build.VERSION.SDK_INT <= 29) { // Build.VERSION_CODES.Q
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE},
                    PERMISSION_REQUEST_CODE
                );
            }
        }
    }
    
    /**
     * Méthode pour enregistrer les plugins Capacitor
     */
    private void registerPlugins() {
        try {
            // Utilisation de registerPlugin (méthode recommandée)
            this.registerPlugin(FileSaverPlugin.class);
            
            Log.d(TAG, "Plugin FileSaver enregistré avec succès");
        } catch (Exception e) {
            Log.e(TAG, "Erreur lors de l'enregistrement du plugin FileSaver", e);
        }
    }
}
