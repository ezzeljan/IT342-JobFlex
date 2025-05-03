package com.csit284.natorprefinalnajud

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import java.io.File

class Home : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var dbHelper: DatabaseHelper
    private lateinit var servicesContainer: LinearLayout
    private lateinit var searchEditText: EditText
    private var username: String? = null
    private var userId: Int = -1
    private val TAG = "HomeActivity"

    // Filter state
    private var currentFilter: String = "all" // Possible values: all, recommended, price, deals, nearest

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        // Initialize database helper
        dbHelper = DatabaseHelper(this)

        // Initialize UI elements
        servicesContainer = findViewById(R.id.servicesContainer)
        searchEditText = findViewById(R.id.editText_search)

        // Get user information from shared preferences
        sharedPreferences = getSharedPreferences("UserSession", Context.MODE_PRIVATE)
        username = sharedPreferences.getString("USERNAME", null)
        userId = sharedPreferences.getInt("USER_ID", -1)

        Log.d(TAG, "Stored username: $username, userId: $userId")

        if (!username.isNullOrEmpty()) {
            Toast.makeText(this, "Welcome, $username!", Toast.LENGTH_SHORT).show()
        } else {
            // Redirect to login if session not found
            redirectToLogin()
        }

        // Set up filter buttons
        setupFilterButtons()

        // Set up search functionality
        setupSearchFunctionality()

        // Load services from database and display them
        loadAndDisplayServices()

        // Set up navigation buttons
        setupNavigationButtons()
    }

    private fun setupFilterButtons() {
        val btnRecommended: Button = findViewById(R.id.btnRecommended)
        val btnPrice: Button = findViewById(R.id.btnPrice)
        val btnDeal: Button = findViewById(R.id.btnDeal)
        val btnNearest: Button = findViewById(R.id.btnNearest)

        btnRecommended.setOnClickListener {
            currentFilter = "recommended"
            updateFilterButtonHighlight(btnRecommended)
            loadAndDisplayServices()
        }

        btnPrice.setOnClickListener {
            currentFilter = "price"
            updateFilterButtonHighlight(btnPrice)
            loadAndDisplayServices()
        }

        btnDeal.setOnClickListener {
            currentFilter = "deals"
            updateFilterButtonHighlight(btnDeal)
            loadAndDisplayServices()
        }

        btnNearest.setOnClickListener {
            currentFilter = "nearest"
            updateFilterButtonHighlight(btnNearest)
            loadAndDisplayServices()
        }

        // Set default highlight
        updateFilterButtonHighlight(btnRecommended)
    }

    private fun updateFilterButtonHighlight(selectedButton: Button) {
        // Reset all buttons background
        findViewById<Button>(R.id.btnRecommended).setBackgroundResource(android.R.drawable.btn_default)
        findViewById<Button>(R.id.btnPrice).setBackgroundResource(android.R.drawable.btn_default)
        findViewById<Button>(R.id.btnDeal).setBackgroundResource(android.R.drawable.btn_default)
        findViewById<Button>(R.id.btnNearest).setBackgroundResource(android.R.drawable.btn_default)

        // Highlight selected button
        selectedButton.setBackgroundResource(android.R.drawable.btn_default_small)
    }

    private fun setupSearchFunctionality() {
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

            override fun afterTextChanged(s: Editable?) {
                // Filter services based on search text
                loadAndDisplayServices(s.toString())
            }
        })
    }



    private fun setupNavigationButtons() {
        // Profile button
        val imgBtnProfile: ImageButton = findViewById(R.id.imgBtnProfile)
        imgBtnProfile.setOnClickListener {
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
        val imgBtnLogout: ImageButton = findViewById(R.id.imgBtnLogOut)
        imgBtnLogout.setOnClickListener {
            logoutUser()
        }

        // Home button (current page)
        val imgBtnHome: ImageButton = findViewById(R.id.imgBtnHome)
        imgBtnHome.setOnClickListener {
            // Already on home page, can refresh if needed
            loadAndDisplayServices()
            Toast.makeText(this, "Services refreshed", Toast.LENGTH_SHORT).show()
        }

        // Change from notification to cart button
        val imgBtnCart: ImageButton = findViewById(R.id.imgBtnCart)
        imgBtnCart.setOnClickListener {
            // Navigate to UserCart activity
            val intent = Intent(this, UserCart::class.java).apply {
                putExtra("USERNAME", username)
                putExtra("USER_ID", userId)
            }
            startActivity(intent)
        }

        val imgBtnFavorite: ImageButton = findViewById(R.id.imgBtnFavorite)
        imgBtnFavorite.setOnClickListener {
            Toast.makeText(this, "Favorites feature coming soon", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadAndDisplayServices(searchQuery: String = "") {
        try {
            // Get all services from database
            val allServices = dbHelper.getAllServices()
            Log.d(TAG, "Loaded ${allServices.size} services from database")

            // Clear existing services
            servicesContainer.removeAllViews()

            // Filter services based on search query and current filter
            val filteredServices = applyFilters(allServices, searchQuery)

            if (filteredServices.isEmpty()) {
                // Show no services found message
                val noServicesView = TextView(this).apply {
                    text = "No services found"
                    textSize = 16f
                    setPadding(20, 20, 20, 20)
                    gravity = android.view.Gravity.CENTER
                }
                servicesContainer.addView(noServicesView)
                return
            }

            // Add filtered services to the container
            for (service in filteredServices) {
                addServiceCard(service)
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error loading services", e)
            Toast.makeText(this, "Error loading services", Toast.LENGTH_SHORT).show()
        }
    }

    private fun applyFilters(services: List<DatabaseHelper.Service>, searchQuery: String): List<DatabaseHelper.Service> {
        // First filter by search query
        val searchFiltered = if (searchQuery.isNotEmpty()) {
            services.filter {
                it.name.contains(searchQuery, ignoreCase = true) ||
                        it.description.contains(searchQuery, ignoreCase = true)
            }
        } else {
            services
        }

        // Then apply category filter
        return when (currentFilter) {
            "recommended" -> {
                // This would ideally use recommendation logic
                // For now, just return the first 10 services
                searchFiltered.take(10)
            }
            "price" -> {
                // In a real app, you would sort by price
                // For demo purposes, just return the original list
                searchFiltered
            }
            "deals" -> {
                // In a real app, filter to show only services with deals
                // For demo purposes, just return the original list
                searchFiltered
            }
            "nearest" -> {
                // In a real app, sort by distance
                // For demo purposes, just return the original list
                searchFiltered
            }
            else -> searchFiltered
        }
    }

    private fun addServiceCard(service: DatabaseHelper.Service) {
        // Inflate the service card layout
        val inflater = LayoutInflater.from(this)
        val serviceCardView = inflater.inflate(R.layout.service_card, null)

        // Get provider information if available
        val provider = try {
            // First get the username from the database using the userId
            val username = dbHelper.getUsernameById(service.userId)
            // Then get the full user object using the username
            if (username != null) dbHelper.getUser(username) else null
        } catch (e: Exception) {
            Log.e(TAG, "Error getting provider for service ${service.id}", e)
            null
        }

        // Set up the service card UI
        val serviceImage: ImageView = serviceCardView.findViewById(R.id.serviceImage)
        val serviceName: TextView = serviceCardView.findViewById(R.id.serviceName)
        val serviceDescription: TextView = serviceCardView.findViewById(R.id.serviceDescription)
        val serviceProviderText: TextView = serviceCardView.findViewById(R.id.serviceProvider)

        // Populate the UI
        serviceName.text = service.name
        serviceDescription.text = service.description
        serviceProviderText.text = "By: ${provider?.username ?: "Unknown Provider"}"

        // Load service image
        try {
            val imageUri = Uri.parse(service.imagePath)

            // Check if it's a file URI
            if (imageUri.scheme == "file") {
                val imagePath = imageUri.path
                if (imagePath != null) {
                    val imageFile = File(imagePath)
                    if (imageFile.exists()) {
                        val bitmap = BitmapFactory.decodeFile(imagePath)
                        serviceImage.setImageBitmap(bitmap)
                    } else {
                        serviceImage.setImageResource(android.R.drawable.ic_menu_report_image)
                    }
                }
            } else {
                // Try to load from URI directly
                serviceImage.setImageURI(imageUri)

                // Check if image was set successfully
                serviceImage.post {
                    if (serviceImage.drawable == null) {
                        serviceImage.setImageResource(android.R.drawable.ic_menu_report_image)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error loading image for service ${service.id}", e)
            serviceImage.setImageResource(android.R.drawable.ic_menu_report_image)
        }

        // Set click listener to view service details
        serviceCardView.setOnClickListener {
            viewServiceDetails(service)
        }

        // Add the service card to the container
        servicesContainer.addView(serviceCardView)
    }

    private fun viewServiceDetails(service: DatabaseHelper.Service) {
        // Create an intent to display service details
        val intent = Intent(this, ServiceDetails::class.java).apply {
            putExtra("SERVICE_ID", service.id)
            putExtra("USER_ID", userId)
        }
        startActivity(intent)
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

    override fun onResume() {
        super.onResume()
        // Refresh services when returning to the activity
        loadAndDisplayServices()
    }
}