package com.csit284.natorprefinalnajud

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import com.csit284.natorprefinalnajud.databinding.ActivityJobProviderBinding
import java.io.File

class JobProviderHome : AppCompatActivity() {

    private lateinit var binding: ActivityJobProviderBinding
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var dbHelper: DatabaseHelper
    private var username: String? = null
    private var userId: Int = -1
    private var userServices: List<DatabaseHelper.Service> = emptyList()

    companion object {
        private const val ADD_SERVICE_REQUEST_CODE = 100
        private const val TAG = "JobProviderHome"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityJobProviderBinding.inflate(layoutInflater)
        setContentView(binding.root)

        dbHelper = DatabaseHelper(this)
        sharedPreferences = getSharedPreferences("UserSession", Context.MODE_PRIVATE)
        username = sharedPreferences.getString("USERNAME", null)
        userId = sharedPreferences.getInt("USER_ID", -1)

        Log.d(TAG, "Stored username: $username, userId: $userId")

        if (!username.isNullOrEmpty()) {
            binding.txtWelcome.text = "Welcome, $username!"
            Toast.makeText(this, "Welcome, $username!", Toast.LENGTH_SHORT).show()
        } else {
            // Redirect to login if session not found
            redirectToLogin()
        }

        // Setup Add Service button
        binding.btnAddService.setOnClickListener {
            if (userId == -1) {
                Log.e(TAG, "Invalid userId when adding service: $userId")
                Toast.makeText(this, "Session error. Please login again", Toast.LENGTH_SHORT).show()
                redirectToLogin()
                return@setOnClickListener
            }

            // Navigate to add service page with userId
            val intent = Intent(this, AddService::class.java)
            intent.putExtra("USER_ID", userId)  // Pass the userId to AddService
            Log.d(TAG, "Starting AddService with userId: $userId")
            startActivityForResult(intent, ADD_SERVICE_REQUEST_CODE)
        }

        // Setup navigation buttons
        setupNavigationButtons()

        // Load services
        loadUserServices()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == ADD_SERVICE_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            // Service was added, reload the services
            loadUserServices()
        }
    }

    private fun loadUserServices() {
        if (userId != -1) {
            userServices = dbHelper.getUserServices(userId)
            Log.d(TAG, "Loaded ${userServices.size} services for user $userId")
            displayServices()
        }
    }

    private fun displayServices() {
        // Get the services container
        val servicesContainer = binding.servicesContainer

        // Clear all existing service cards
        servicesContainer.removeAllViews()

        if (userServices.isNotEmpty()) {
            // Create and add a card for each service
            for (service in userServices) {
                Log.d(TAG, "Creating card for service ID: ${service.id}, Image path: ${service.imagePath}")
                val cardView = createServiceCardView(service)
                servicesContainer.addView(cardView)
            }
        } else {
            // No services found - display a message
            val noServicesTextView = TextView(this).apply {
                text = "You haven't added any services yet. Click 'Add a Service' to get started."
                textSize = 16f
                setPadding(32, 32, 32, 32)
            }
            servicesContainer.addView(noServicesTextView)
        }
    }

    private fun createServiceCardView(service: DatabaseHelper.Service): View {
        // Inflate the service card layout
        val inflater = LayoutInflater.from(this)
        val cardView = inflater.inflate(R.layout.service_card_item, null)

        // Get references to views in the card
        val imageButton = cardView.findViewById<ImageButton>(R.id.btnServiceImage)
        val providerTextView = cardView.findViewById<TextView>(R.id.tvServiceProvider)
        val descriptionTextView = cardView.findViewById<TextView>(R.id.tvServiceDescription)
        val priceTextView = cardView.findViewById<TextView>(R.id.tvServicePrice)
        val ratingTextView = cardView.findViewById<TextView>(R.id.tvRating)
        val editButton = cardView.findViewById<Button>(R.id.btnEditService)

        // Set service provider name
        providerTextView.text = username ?: "Service Provider"

        // Set service image with improved error handling and logging
        try {
            val imagePath = service.imagePath
            Log.d(TAG, "Loading image from path: $imagePath")

            // Check if path is direct file path or URI
            if (imagePath.startsWith("file:")) {
                val uri = Uri.parse(imagePath)
                Log.d(TAG, "Loading image from URI: $uri")
                imageButton.setImageURI(uri)
            } else if (imagePath.contains("/")) {
                // Might be a direct file path
                val file = File(imagePath)
                if (file.exists()) {
                    Log.d(TAG, "Loading image from File: ${file.absolutePath}")
                    imageButton.setImageURI(Uri.fromFile(file))
                } else {
                    Log.e(TAG, "File does not exist: ${file.absolutePath}")
                    imageButton.setImageResource(R.drawable.profile)
                }
            } else {
                // Try as generic URI
                val uri = Uri.parse(imagePath)
                Log.d(TAG, "Attempting to load as generic URI: $uri")
                imageButton.setImageURI(uri)
            }

            // Add a check to verify if the image was actually set
            imageButton.post {
                if (imageButton.drawable == null) {
                    Log.e(TAG, "Failed to load image, setting default")
                    imageButton.setImageResource(R.drawable.profile)
                } else {
                    Log.d(TAG, "Image successfully loaded")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error loading image: ${e.message}", e)
            imageButton.setImageResource(R.drawable.profile)
        }

        // Extract price from description if available
        val description = service.description
        val pricePattern = "Price: PHP (\\d+(\\.\\d+)?)".toRegex()
        val matchResult = pricePattern.find(description)

        val priceText = if (matchResult != null) {
            "PHP ${matchResult.groupValues[1]}"
        } else {
            "Price not specified"
        }

        // Set description - remove price information to avoid duplication
        val cleanDescription = description.replace(pricePattern, "").trim()
        descriptionTextView.text = cleanDescription

        // Set price text
        priceTextView.text = priceText

        // Set up edit button functionality
        editButton.setOnClickListener {
            // Navigate to edit service activity
            val intent = Intent(this, EditService::class.java).apply {
                putExtra("SERVICE_ID", service.id)
                putExtra("USER_ID", userId)
            }
            startActivityForResult(intent, ADD_SERVICE_REQUEST_CODE)
        }

        return cardView
    }

    private fun setupNavigationButtons() {
        // Home button
        binding.imgBtnHome.setOnClickListener {
            // Already on home page, possibly refresh
            loadUserServices()
            Toast.makeText(this, "Refreshing services", Toast.LENGTH_SHORT).show()
        }


        val imgBtnFavorite: ImageButton = findViewById(R.id.imgBtnFavorite)
        imgBtnFavorite.setOnClickListener {
            Toast.makeText(this, "Favorites feature coming soon", Toast.LENGTH_SHORT).show()
        }

//        // Favorite button
//        binding.imgBtnFavorite.setOnClickListener {
//            val intent = Intent(this, Favorites::class.java)
//            startActivity(intent)
//        }



//
//        // Notification button
        binding.imgBtnCart.setOnClickListener {
            val intent = Intent(this, ProviderCart::class.java)
            startActivity(intent)
        }

        // Profile button
        binding.imgBtnProfile.setOnClickListener {
            if (username.isNullOrEmpty() || userId == -1) {
                Log.e(TAG, "Missing user info for Profile - username: $username, userId: $userId")
                redirectToLogin()
                return@setOnClickListener
            }

            val intent = Intent(this, Profile::class.java).apply {
                putExtra("USERNAME", username)
                putExtra("USER_ID", userId)
            }
            startActivity(intent)
        }

        // Logout button
        binding.imgBtnLogOut.setOnClickListener {
            logoutUser()
        }
    }

    private fun redirectToLogin() {
        Toast.makeText(this, "Please log in again", Toast.LENGTH_SHORT).show()
        val loginIntent = Intent(this, Login::class.java)
        startActivity(loginIntent)
        finish()
    }

    private fun logoutUser() {
        // Clear the shared preferences session
        sharedPreferences.edit().clear().apply()
        Log.d(TAG, "User logged out, session cleared")

        // Navigate to Login Activity
        val intent = Intent(this, Login::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
        finish()
    }
}