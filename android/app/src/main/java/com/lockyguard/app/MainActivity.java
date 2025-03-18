package com.lockyguard.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import java.util.ArrayList;
import com.getcapacitor.Plugin;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "LockyGuardActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Activer les logs pour le WebView si en mode debug
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Enregistrement du plugin
        try {
            // Enregistrement du plugin FileSaver
            this.registerPlugin(FileSaverPlugin.class);
            Log.d(TAG, "Plugin FileSaver enregistré avec succès");
        } catch (Exception e) {
            Log.e(TAG, "Erreur lors de l'enregistrement du plugin FileSaver", e);
        }
    }
}
