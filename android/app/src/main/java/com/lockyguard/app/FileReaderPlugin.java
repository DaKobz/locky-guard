
package com.lockyguard.app;

import android.util.Log;
import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(
    name = "FileReader"
)
public class FileReaderPlugin extends Plugin {
    private static final String TAG = "FileReaderPlugin";

    @PluginMethod()
    public void readFile(PluginCall call) {
        String path = call.getString("path");
        
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        try {
            File file = new File(path);
            int size = (int) file.length();
            byte[] bytes = new byte[size];
            
            FileInputStream in = new FileInputStream(file);
            in.read(bytes);
            in.close();
            
            String content = new String(bytes, StandardCharsets.UTF_8);
            
            JSObject ret = new JSObject();
            ret.put("data", content);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error reading file: " + e.getMessage());
            call.reject("Error reading file: " + e.getMessage());
        }
    }
}
