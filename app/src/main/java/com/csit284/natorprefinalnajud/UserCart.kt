package com.csit284.natorprefinalnajud

import android.app.AlertDialog
import android.content.ContentValues
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast

class UserCart : AppCompatActivity() {

    private lateinit var dbHelper: DatabaseHelper
    private var userId: Int = -1
    private lateinit var tableContent: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_cart)

        dbHelper = DatabaseHelper(this)

        // Get userId from intent
        userId = intent.getIntExtra("USER_ID", -1)

        if (userId == -1) {
            Toast.makeText(this, "Invalid user session", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Initialize views
        tableContent = findViewById(R.id.tableContent)

        // Set up back button
        val btnBack: ImageButton = findViewById(R.id.btnBack)
        btnBack.setOnClickListener {
            finish()
        }

        // Set up refresh button
        val btnRefresh: Button = findViewById(R.id.btnRefresh)
        btnRefresh.setOnClickListener {
            loadCartItems()
            Toast.makeText(this, "Cart refreshed", Toast.LENGTH_SHORT).show()
        }

        // Load cart items
        loadCartItems()
    }

    private fun loadCartItems() {
        try {
            // Clear existing rows
            tableContent.removeAllViews()

            // Get all cart items for the user
            val cartItems = dbHelper.getUserCartItems(userId)

            if (cartItems.isEmpty()) {
                // Display a message when no items are found
                val emptyView = LayoutInflater.from(this).inflate(R.layout.empty_service_row, tableContent, false)
                val tvEmpty = emptyView.findViewById<TextView>(R.id.tvEmptyMessage)
                tvEmpty.text = "Your cart is empty"
                tableContent.addView(emptyView)
                return
            }

            // Add cart items to the table
            cartItems.forEach { item ->
                val row = LayoutInflater.from(this).inflate(R.layout.cart_service_row, tableContent, false)

                // Set data to views
                val tvServiceId = row.findViewById<TextView>(R.id.tvServiceId)
                tvServiceId.text = item.serviceId.toString()
                // Hide the service ID column
                tvServiceId.layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 0f)
                tvServiceId.visibility = View.GONE

                row.findViewById<TextView>(R.id.tvServiceName).text = item.serviceName
                row.findViewById<TextView>(R.id.tvProviderName).text = item.providerName

                val tvStatus = row.findViewById<TextView>(R.id.tvStatus)
                tvStatus.text = item.status

                // Set status color
                when (item.status) {
                    "Pending" -> {
                        tvStatus.setTextColor(resources.getColor(android.R.color.holo_orange_dark))

                        // Show cancel button only for pending services
                        val btnCancel = row.findViewById<Button>(R.id.btnCancel)
                        btnCancel.visibility = View.VISIBLE
                        btnCancel.setOnClickListener {
                            showCancelConfirmDialog(item.serviceId, item.serviceName)
                        }
                    }
                    "In Progress" -> tvStatus.setTextColor(resources.getColor(android.R.color.holo_blue_dark))
                    "Completed" -> tvStatus.setTextColor(resources.getColor(android.R.color.holo_green_dark))
                    "Cancelled" -> tvStatus.setTextColor(resources.getColor(android.R.color.holo_red_dark))
                }

                row.findViewById<TextView>(R.id.tvDate).text = item.date

                // Add row to table
                tableContent.addView(row)

                // Add divider
                val divider = View(this)
                divider.layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    1
                )
                divider.setBackgroundColor(resources.getColor(android.R.color.darker_gray))
                tableContent.addView(divider)
            }

        } catch (e: Exception) {
            Toast.makeText(this, "Error loading cart items: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showCancelConfirmDialog(serviceId: Int, serviceName: String) {
        AlertDialog.Builder(this)
            .setTitle("Cancel Service")
            .setMessage("Are you sure you want to cancel '$serviceName'?")
            .setPositiveButton("Yes") { dialog, _ ->
                cancelService(serviceId)
                dialog.dismiss()
            }
            .setNegativeButton("No") { dialog, _ ->
                dialog.dismiss()
            }
            .create()
            .show()
    }

    private fun cancelService(serviceId: Int) {
        try {
            if (dbHelper.cancelService(serviceId)) {
                Toast.makeText(this, "Service cancelled successfully", Toast.LENGTH_SHORT).show()
                // Reload the cart items to reflect the changes
                loadCartItems()
            } else {
                Toast.makeText(this, "Failed to cancel service", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
}