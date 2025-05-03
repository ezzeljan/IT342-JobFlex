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
import com.csit284.natorprefinalnajud.databinding.ActivityEditServiceBinding
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class EditService : AppCompatActivity() {

    private lateinit var binding: ActivityEditServiceBinding
    private lateinit var dbHelper: DatabaseHelper
    private var selectedImageUri: Uri? = null
    private var currentUserId: Int = -1
    private var serviceId: Int = -1
    private var currentService: DatabaseHelper.Service? = null
    private val TAG = "EditService"

    private val PERMISSIONS_REQUIRED = arrayOf(
        android.Manifest.permission.READ_EXTERNAL_STORAGE
    )
    private val PERMISSION_REQUEST_CODE = 1001

    companion object {
        private const val REQUEST_IMAGE_CAPTURE = 1
        private const val REQUEST_GALLERY_IMAGE = 2
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditServiceBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Request permissions early
        checkAndRequestPermissions()

        try {
            dbHelper = DatabaseHelper(this)

            // Get the current user's ID and service ID from intent
            currentUserId = intent.getIntExtra("USER_ID", -1)
            serviceId = intent.getIntExtra("SERVICE_ID", -1)

            Log.d(TAG, "Received userId: $currentUserId, serviceId: $serviceId")

            if (currentUserId == -1 || serviceId == -1) {
                Log.e(TAG, "Invalid parameters: userId=$currentUserId, serviceId=$serviceId")
                Toast.makeText(this, "Invalid parameters", Toast.LENGTH_SHORT).show()
                finish()
                return
            }

            // Load existing service data
            loadServiceData()

            // Setup listeners
            setupListeners()
        } catch (e: Exception) {
            Log.e(TAG, "Fatal error in onCreate", e)
            Toast.makeText(this, "Application error: ${e.message}", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun checkAndRequestPermissions() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            val permissionsToRequest = mutableListOf<String>()

            for (permission in PERMISSIONS_REQUIRED) {
                if (checkSelfPermission(permission) !=
                    android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    permissionsToRequest.add(permission)
                }
            }

            if (permissionsToRequest.isNotEmpty()) {
                requestPermissions(permissionsToRequest.toTypedArray(), PERMISSION_REQUEST_CODE)
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == PERMISSION_REQUEST_CODE) {
            var allGranted = true
            for (result in grantResults) {
                if (result != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    allGranted = false
                    break
                }
            }

            if (!allGranted) {
                Toast.makeText(
                    this,
                    "Storage permissions are needed to access images",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun loadServiceData() {
        try {
            currentService = dbHelper.getServiceById(serviceId)
            Log.d(TAG, "Service loaded: $currentService")

            if (currentService == null) {
                Toast.makeText(this, "Service not found", Toast.LENGTH_SHORT).show()
                finish()
                return
            }

            // Populate fields with existing data
            binding.etServiceTitle.setText(currentService!!.name)

            // Extract price from description if available
            val description = currentService!!.description
            val pricePattern = "Price: PHP (\\d+(\\.\\d+)?)".toRegex()
            val matchResult = pricePattern.find(description)

            if (matchResult != null) {
                binding.etServicePrice.setText(matchResult.groupValues[1])
            }

            // Set description - remove price information
            val cleanDescription = description.replace(pricePattern, "").trim()
            binding.etServiceDescription.setText(cleanDescription)

            // Set image with proper error handling
            try {
                val imagePath = currentService!!.imagePath
                Log.d(TAG, "Image path from DB: $imagePath")

                if (imagePath.isNotEmpty()) {
                    // Don't try to set image right away - make the URI visible but don't load it
                    selectedImageUri = Uri.parse(imagePath)

                    // This approach prevents immediate loading of the image, which causes the crash
                    // Instead, just make the preview visible with a placeholder
                    binding.imgBtnAdd.visibility = View.GONE
                    binding.tvDescription.visibility = View.GONE
                    binding.imgPreview.visibility = View.VISIBLE

                    // Use a placeholder instead of trying to load the actual image
                    binding.imgPreview.setImageResource(android.R.drawable.ic_menu_gallery)

                    // Add a message to indicate the image will be replaced
                    Toast.makeText(this, "Image preview shows placeholder only. Select a new image.",
                        Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error handling image path", e)
                // If error, keep the default "add image" UI
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error loading service data", e)
            Toast.makeText(this, "Failed to load service: ${e.message}", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun setupListeners() {
        // Back button
        binding.btnBack.setOnClickListener {
            finish()
        }

        // Change image button
        binding.imgBtnAdd.setOnClickListener {
            showImageSelectionDialog()
        }
        binding.imgPreview.setOnClickListener {
            showImageSelectionDialog()
        }

        // Update service button
        binding.btnSaveService.setOnClickListener {
            updateService()
        }

        // Delete service button
        binding.btnDeleteService.setOnClickListener {
            showDeleteConfirmationDialog()
        }
    }

    private fun showDeleteConfirmationDialog() {
        AlertDialog.Builder(this)
            .setTitle("Delete Service")
            .setMessage("Are you sure you want to delete this service? This action cannot be undone.")
            .setPositiveButton("Delete") { _, _ ->
                deleteService()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun deleteService() {
        try {
            val result = dbHelper.deleteService(serviceId)
            if (result > 0) {
                Log.d(TAG, "Service deleted successfully")
                Toast.makeText(this, "Service deleted successfully", Toast.LENGTH_SHORT).show()

                // Set result to trigger refresh in the calling activity
                val intent = Intent()
                intent.putExtra("SERVICE_DELETED", true)
                setResult(Activity.RESULT_OK, intent)

                finish()
            } else {
                Log.e(TAG, "Failed to delete service")
                Toast.makeText(this, "Failed to delete service", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error deleting service", e)
            Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showImageSelectionDialog() {
        val options = arrayOf("Take Photo", "Choose from Gallery", "Cancel")

        AlertDialog.Builder(this)
            .setTitle("Update Service Image")
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
        try {
            Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { intent ->
                intent.resolveActivity(packageManager)?.also {
                    startActivityForResult(intent, REQUEST_IMAGE_CAPTURE)
                } ?: run {
                    Toast.makeText(this, "No camera app found", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error launching camera", e)
            Toast.makeText(this, "Error launching camera", Toast.LENGTH_SHORT).show()
        }
    }

    private fun chooseFromGallery() {
        try {
            Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI).also { intent ->
                intent.type = "image/*"
                startActivityForResult(intent, REQUEST_GALLERY_IMAGE)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error launching gallery", e)
            Toast.makeText(this, "Error launching gallery", Toast.LENGTH_SHORT).show()
        }
    }

    @Suppress("DEPRECATION")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (resultCode == Activity.RESULT_OK) {
            try {
                when (requestCode) {
                    REQUEST_IMAGE_CAPTURE -> {
                        val imageBitmap = data?.extras?.get("data") as? Bitmap
                        if (imageBitmap != null) {
                            // Save bitmap to file and get Uri
                            selectedImageUri = saveBitmapToFile(imageBitmap)
                            Log.d(TAG, "Camera image saved to URI: $selectedImageUri")
                            displaySelectedImage()
                        } else {
                            Log.e(TAG, "Received null bitmap from camera")
                            Toast.makeText(this, "Failed to capture image", Toast.LENGTH_SHORT).show()
                        }
                    }
                    REQUEST_GALLERY_IMAGE -> {
                        data?.data?.let { uri ->
                            Log.d(TAG, "Gallery image selected: $uri")
                            try {
                                // Create a permanent copy of the gallery image
                                val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, uri)
                                selectedImageUri = saveBitmapToFile(bitmap)
                                Log.d(TAG, "Gallery image saved to permanent URI: $selectedImageUri")
                                displaySelectedImage()
                            } catch (e: Exception) {
                                Log.e(TAG, "Error processing gallery image", e)
                                Toast.makeText(this, "Error processing image", Toast.LENGTH_SHORT).show()
                            }
                        } ?: run {
                            Log.e(TAG, "No data received from gallery")
                            Toast.makeText(this, "No image selected", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error in onActivityResult", e)
                Toast.makeText(this, "Error processing image: ${e.message}", Toast.LENGTH_SHORT).show()
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
            Toast.makeText(this, "Failed to save image", Toast.LENGTH_SHORT).show()
            null
        }
    }

    private fun displaySelectedImage() {
        try {
            // Hide the add image button and description
            binding.imgBtnAdd.visibility = View.GONE
            binding.tvDescription.visibility = View.GONE

            // Show the preview
            binding.imgPreview.visibility = View.VISIBLE

            // Only try to set the image if we have a valid URI
            selectedImageUri?.let { uri ->
                binding.imgPreview.setImageURI(uri)

                // Verify the image was set correctly
                binding.imgPreview.post {
                    if (binding.imgPreview.drawable == null) {
                        Log.e(TAG, "Failed to display image from URI: $uri")
                        binding.imgPreview.setImageResource(android.R.drawable.ic_menu_report_image)
                        Toast.makeText(this, "Failed to load image - using placeholder", Toast.LENGTH_SHORT).show()
                    } else {
                        Log.d(TAG, "Successfully displayed image from URI: $uri")
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error displaying selected image", e)
            // Set a fallback image
            binding.imgPreview.setImageResource(android.R.drawable.ic_menu_report_image)
        }
    }

    private fun updateService() {
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

        try {
            // Update the service in database
            val imagePath = selectedImageUri.toString()
            Log.d(TAG, "Updating service with image path: $imagePath")

            val result = dbHelper.updateService(
                serviceId = serviceId,
                name = serviceName,
                description = "$serviceDescription\nPrice: PHP $servicePrice",
                imagePath = imagePath
            )

            if (result > 0) {
                Log.d(TAG, "Service updated successfully")
                Toast.makeText(this, "Service updated successfully", Toast.LENGTH_SHORT).show()
                setResult(Activity.RESULT_OK)
                finish()
            } else {
                Log.e(TAG, "Failed to update service in database")
                Toast.makeText(this, "Failed to update service", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating service", e)
            Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
}