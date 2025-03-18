package com.lockyguard.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;

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
    private PluginCall savedCall;

    @PluginMethod()
    public void saveFile(PluginCall call) {
        Log.d(TAG, "saveFile method called");
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