
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

        // Enable WebView debugging in debug mode
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Register plugins
        try {
            // Register FileSaver plugin
            this.registerPlugin(FileSaverPlugin.class);
            Log.d(TAG, "FileSaver plugin registered successfully");
            
            // Register FileReader plugin
            this.registerPlugin(FileReaderPlugin.class);
            Log.d(TAG, "FileReader plugin registered successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error registering plugins", e);
        }
    }
}
