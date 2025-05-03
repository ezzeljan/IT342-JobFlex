package com.csit284.natorprefinalnajud

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.Toast
import com.csit284.natorprefinalnajud.databinding.ActivityAddServiceBinding
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AddService : AppCompatActivity() {

    private lateinit var binding: ActivityAddServiceBinding
    private lateinit var dbHelper: DatabaseHelper
    private var selectedImageUri: Uri? = null
    private var currentUserId: Int = -1

    companion object {
        private const val REQUEST_IMAGE_CAPTURE = 1
        private const val REQUEST_GALLERY_IMAGE = 2
        private const val TAG = "AddService"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddServiceBinding.inflate(layoutInflater)
        setContentView(binding.root)

        dbHelper = DatabaseHelper(this)

        // Get the current user's ID from intent
        currentUserId = intent.getIntExtra("USER_ID", -1)

        if (currentUserId == -1) {
            Toast.makeText(this, "User not authenticated", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupListeners()
    }

    private fun setupListeners() {
        // Back button
        binding.btnBack.setOnClickListener {
            finish()
        }

        // Add image button
        binding.imgBtnAdd.setOnClickListener {
            showImageSelectionDialog()
        }

        // Save service button
        binding.btnSaveService.setOnClickListener {
            saveService()
        }
    }

    private fun showImageSelectionDialog() {
        val options = arrayOf("Take Photo", "Choose from Gallery", "Cancel")

        AlertDialog.Builder(this)
            .setTitle("Select Service Image")
            .setItems(options) { dialog, which ->
                when (which) {
                    0 -> takePhoto()
                    1 -> chooseFromGallery()
                    2 -> dialog.dismiss()
                }
            }
            .show()
    }

    private fun takePhoto() {
        Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { intent ->
            intent.resolveActivity(packageManager)?.also {
                startActivityForResult(intent, REQUEST_IMAGE_CAPTURE)
            }
        }
    }

    private fun chooseFromGallery() {
        Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI).also { intent ->
            intent.type = "image/*"
            startActivityForResult(intent, REQUEST_GALLERY_IMAGE)
        }
    }

    @Suppress("DEPRECATION")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (resultCode == Activity.RESULT_OK) {
            when (requestCode) {
                REQUEST_IMAGE_CAPTURE -> {
                    val imageBitmap = data?.extras?.get("data") as? Bitmap
                    if (imageBitmap != null) {
                        // Save bitmap to file and get Uri
                        selectedImageUri = saveBitmapToFile(imageBitmap)
                        Log.d(TAG, "Camera image saved to URI: $selectedImageUri")
                        displaySelectedImage()
                    }
                }
                REQUEST_GALLERY_IMAGE -> {
                    selectedImageUri = data?.data
                    Log.d(TAG, "Gallery image selected: $selectedImageUri")

                    // Create a permanent copy of the gallery image
                    if (selectedImageUri != null) {
                        try {
                            val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, selectedImageUri)
                            selectedImageUri = saveBitmapToFile(bitmap)
                            Log.d(TAG, "Gallery image saved to permanent URI: $selectedImageUri")
                        } catch (e: Exception) {
                            Log.e(TAG, "Error copying gallery image", e)
                        }
                    }

                    displaySelectedImage()
                }
            }
        }
    }

    private fun saveBitmapToFile(bitmap: Bitmap): Uri? {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val imageFileName = "SERVICE_${timeStamp}.jpg"
        val storageDir = getExternalFilesDir(null)

        return try {
            val imageFile = File(storageDir, imageFileName)
            FileOutputStream(imageFile).use { out ->
                bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out)
            }
            Log.d(TAG, "Image saved to file: ${imageFile.absolutePath}")
            Uri.fromFile(imageFile)
        } catch (e: IOException) {
            Log.e(TAG, "Error saving image to file", e)
            null
        }
    }

    private fun displaySelectedImage() {
        // Hide the add image button and description
        binding.imgBtnAdd.visibility = View.GONE
        binding.tvDescription.visibility = View.GONE

        // Show the preview
        binding.imgPreview.visibility = View.VISIBLE
        binding.imgPreview.setImageURI(selectedImageUri)

        // Verify the image was displayed
        binding.imgPreview.post {
            if (binding.imgPreview.drawable == null) {
                Log.e(TAG, "Failed to display image preview")
                Toast.makeText(this, "Failed to load image", Toast.LENGTH_SHORT).show()
            } else {
                Log.d(TAG, "Image preview displayed successfully")
            }
        }
    }

    private fun saveService() {
        val serviceName = binding.etServiceTitle.text.toString().trim()
        val servicePrice = binding.etServicePrice.text.toString().trim()
        val serviceDescription = binding.etServiceDescription.text.toString().trim()

        // Validate inputs
        if (serviceName.isEmpty() || serviceDescription.isEmpty()) {
            Toast.makeText(this, "Please fill in all required fields", Toast.LENGTH_SHORT).show()
            return
        }

        if (selectedImageUri == null) {
            Toast.makeText(this, "Please select an image for your service", Toast.LENGTH_SHORT).show()
            return
        }

        // Save the service to database
        val imagePath = selectedImageUri.toString()
        Log.d(TAG, "Saving service with image path: $imagePath")

        val result = dbHelper.insertService(
            userId = currentUserId,
            name = serviceName,
            description = "$serviceDescription\nPrice: PHP $servicePrice",
            imagePath = imagePath
        )

        if (result != -1L) {
            Log.d(TAG, "Service added successfully with ID: $result")
            Toast.makeText(this, "Service added successfully", Toast.LENGTH_SHORT).show()
            setResult(Activity.RESULT_OK)
            finish()
        } else {
            Log.e(TAG, "Failed to add service to database")
            Toast.makeText(this, "Failed to add service", Toast.LENGTH_SHORT).show()
        }
    }
}