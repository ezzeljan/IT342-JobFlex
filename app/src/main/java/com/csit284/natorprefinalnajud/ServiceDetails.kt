package com.csit284.natorprefinalnajud

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast

class ServiceDetails : AppCompatActivity() {

    private lateinit var dbHelper: DatabaseHelper
    private var serviceId: Int = -1
    private var userId: Int = -1
    private var currentService: DatabaseHelper.Service? = null
    private val TAG = "ServiceDetails"

    // Request code for edit activity
    private val EDIT_SERVICE_REQUEST = 101

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_service_details)

        dbHelper = DatabaseHelper(this)

        // Get serviceId from intent
        serviceId = intent.getIntExtra("SERVICE_ID", -1)
        userId = intent.getIntExtra("USER_ID", -1)

        if (serviceId == -1) {
            Toast.makeText(this, "Invalid service", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Load service details
        loadServiceDetails()

        // Set up back button
        val btnBack: ImageButton = findViewById(R.id.btnBack)
        btnBack.setOnClickListener {
            finish()
        }

        // Set up edit button - only visible if this is the user's own service
        val btnEdit: Button = findViewById(R.id.btnEditService)
        btnEdit.setOnClickListener {
            editService()
        }

        // Set up avail service button
        setupAvailButton()
    }

    private fun loadServiceDetails() {
        try {
            currentService = dbHelper.getServiceById(serviceId)

            if (currentService == null) {
                Toast.makeText(this, "Service not found", Toast.LENGTH_SHORT).show()
                finish()
                return
            }

            // Populate the UI with service details
            val tvServiceName: TextView = findViewById(R.id.tvServiceName)
            val tvServiceDescription: TextView = findViewById(R.id.tvServiceDescription)
            val imgService: ImageView = findViewById(R.id.imgService)
            val btnEdit: Button = findViewById(R.id.btnEditService)
            val btnAvail: Button = findViewById(R.id.btnAvailService)

            tvServiceName.text = currentService!!.name
            tvServiceDescription.text = currentService!!.description

            // Try to load the service image
            try {
                val imageUri = Uri.parse(currentService!!.imagePath)
                imgService.setImageURI(imageUri)

                // Verify image loaded successfully
                imgService.post {
                    if (imgService.drawable == null) {
                        imgService.setImageResource(android.R.drawable.ic_menu_report_image)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error loading service image", e)
                imgService.setImageResource(android.R.drawable.ic_menu_report_image)
            }

            // Only show edit button if this service belongs to the current user
            if (currentService!!.userId == userId) {
                btnEdit.visibility = View.VISIBLE
                // Hide avail button for own services
                btnAvail.visibility = View.GONE
            } else {
                btnEdit.visibility = View.GONE
                // Show avail button for other users' services
                btnAvail.visibility = View.VISIBLE
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error loading service details", e)
            Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    // This function is from the ServiceDetails class to set up the avail button
    private fun setupAvailButton() {
        val btnAvailService: Button = findViewById(R.id.btnAvailService)

        btnAvailService.setOnClickListener {
            if (currentService == null) {
                Toast.makeText(this, "Service information not available", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (userId == -1) {
                Toast.makeText(this, "Please log in to avail services", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            try {
                // Add service to user's cart
                val currentDate = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault()).format(java.util.Date())
                val success = dbHelper.addToUserCart(userId, serviceId, "Pending", currentDate)

                if (success) {
                    Toast.makeText(this, "Service added to your cart!", Toast.LENGTH_SHORT).show()

                    // Navigate to cart
                    val intent = Intent(this, UserCart::class.java).apply {
                        putExtra("USER_ID", userId)
                        putExtra("USERNAME", dbHelper.getUsernameById(userId))
                    }
                    startActivity(intent)
                } else {
                    Toast.makeText(this, "Failed to add service to cart", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error adding service to cart", e)
                Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun editService() {
        if (currentService == null) return

        val intent = Intent(this, EditService::class.java).apply {
            putExtra("SERVICE_ID", serviceId)
            putExtra("USER_ID", userId)
        }
        startActivityForResult(intent, EDIT_SERVICE_REQUEST)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == EDIT_SERVICE_REQUEST && resultCode == Activity.RESULT_OK) {
            // Check if service was deleted
            val serviceDeleted = data?.getBooleanExtra("SERVICE_DELETED", false) ?: false

            if (serviceDeleted) {
                // If service was deleted, close this activity and return to previous screen
                Toast.makeText(this, "Service has been deleted", Toast.LENGTH_SHORT).show()
                finish()
            } else {
                // If service was updated, reload the details
                loadServiceDetails()
                Toast.makeText(this, "Service updated successfully", Toast.LENGTH_SHORT).show()
            }
        }
    }
}