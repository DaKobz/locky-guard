package com.lockyguard.app;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import android.Manifest;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(
    name = "FileSaver"
)
public class FileSaverPlugin extends Plugin {
    private static final String TAG = "FileSaverPlugin";
    private static final int CREATE_FILE_REQUEST_CODE = 1;
    private static final int PERMISSION_REQUEST_CODE = 101;
    private PluginCall savedCall;

    @PluginMethod()
    public void saveFile(PluginCall call) {
        Log.d(TAG, "saveFile method called");
        
        // Vérifier les permissions avant de continuer
        if (!checkPermissions()) {
            call.reject("Storage permissions are required");
            requestPermissions(call);
            return;
        }
        
        this.savedCall = call;

        try {
            String fileName = call.getString("fileName", "backup.json");
            String mimeType = call.getString("mimeType", "application/json");

            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType(mimeType);
            intent.putExtra(Intent.EXTRA_TITLE, fileName);

            Log.d(TAG, "Starting document picker activity with fileName: " + fileName);
            startActivityForResult(call, intent, CREATE_FILE_REQUEST_CODE);
        } catch (Exception e) {
            Log.e(TAG, "Error starting document picker: " + e.getMessage());
            call.reject("Error starting document picker: " + e.getMessage());
        }
    }
    
    /**
     * Vérifie si les permissions nécessaires sont accordées
     */
    private boolean checkPermissions() {
        Activity activity = getActivity();
        if (activity == null) return false;
        
        // Sur Android 10+ nous n'avons pas besoin de permissions spécifiques pour utiliser
        // le sélecteur de fichier système (Storage Access Framework)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            return true;
        }
        
        // Pour les anciennes versions, vérifier WRITE_EXTERNAL_STORAGE
        return ContextCompat.checkSelfPermission(activity, 
               Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }
    
    /**
     * Demande les permissions nécessaires
     */
    public void requestPermissions(PluginCall call) {
        // Sauvegarder l'appel pour pouvoir le reprendre après la demande de permission
        saveCall(call);
        
        // Demander uniquement les permissions pour les anciennes versions d'Android
        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.Q) {
            pluginRequestPermissions(
                new String[] { Manifest.permission.WRITE_EXTERNAL_STORAGE },
                PERMISSION_REQUEST_CODE
            );
        }
    }
    
    /**
     * Appelé quand l'utilisateur répond à la demande de permission
     */
    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);
        
        PluginCall savedCall = getSavedCall();
        if (savedCall == null) return;
        
        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean permissionGranted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            
            if (permissionGranted) {
                // Permission accordée, réessayer l'opération
                saveFile(savedCall);
            } else {
                // Permission refusée
                savedCall.reject("Storage permission denied");
            }
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);

        Log.d(TAG, "handleOnActivityResult: requestCode=" + requestCode + ", resultCode=" + resultCode);

        if (requestCode == CREATE_FILE_REQUEST_CODE) {
            if (savedCall == null) {
                Log.e(TAG, "No saved call for activity result");
                return;
            }

            if (resultCode == Activity.RESULT_OK) {
                if (data != null && data.getData() != null) {
                    Uri uri = data.getData();
                    Log.d(TAG, "File URI selected: " + uri.toString());
                    
                    try {
                        String fileContent = savedCall.getString("fileContent", "");
                        String encoding = savedCall.getString("encoding", "base64");

                        OutputStream outputStream = getContext().getContentResolver().openOutputStream(uri);
                        if (outputStream != null) {
                            if ("base64".equals(encoding)) {
                                byte[] decodedBytes = Base64.decode(fileContent, Base64.DEFAULT);
                                outputStream.write(decodedBytes);
                            } else {
                                outputStream.write(fileContent.getBytes());
                            }
                            outputStream.close();

                            JSObject ret = new JSObject();
                            ret.put("uri", uri.toString());
                            ret.put("success", true);
                            savedCall.resolve(ret);
                            Log.d(TAG, "File successfully saved");
                        } else {
                            Log.e(TAG, "Failed to open output stream");
                            savedCall.reject("Failed to open output stream");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error writing to file: " + e.getMessage());
                        savedCall.reject("Error writing to file: " + e.getMessage());
                    }
                } else {
                    Log.e(TAG, "No data returned from file picker");
                    savedCall.reject("No data returned from file picker");
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                Log.d(TAG, "File saving cancelled by user");
                savedCall.reject("File saving cancelled by user");
            } else {
                Log.e(TAG, "Unknown error when saving file");
                savedCall.reject("Unknown error when saving file");
            }
            savedCall = null;
        }
    }
} 