package com.csit284.natorprefinalnajud

import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.support.v7.app.AlertDialog
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast


class ProviderCart : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var dbHelper: DatabaseHelper
    private var userId: Int = -1
    private var selectedCartItemId: Int = -1
    private val cartItems = mutableListOf<CartItemWithCustomer>()

    companion object {
        private const val TAG = "ProviderCart"
    }

    // Data class to hold cart item with customer information
    data class CartItemWithCustomer(
        val cartId: Int,
        val serviceId: Int,
        val serviceName: String,
        val customerId: Int,
        val customerName: String,
        val status: String,
        val date: String
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_provider_cart)

        // Initialize database helper and shared preferences
        dbHelper = DatabaseHelper(this)
        sharedPreferences = getSharedPreferences("UserSession", Context.MODE_PRIVATE)
        userId = sharedPreferences.getInt("USER_ID", -1)

        if (userId == -1) {
            Toast.makeText(this, "Session error. Please login again", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Setup back button
        findViewById<View>(R.id.btnBack).setOnClickListener {
            finish()
        }

        // Setup refresh button
        findViewById<Button>(R.id.btnRefresh).setOnClickListener {
            loadAvailedServices()
        }

//        // Setup update status button
//        findViewById<Button>(R.id.btnUpdateStatus).setOnClickListener {
//            if (selectedCartItemId != -1) {
//                showStatusUpdateDialog(selectedCartItemId)
//            } else {
//                Toast.makeText(this, "Please select a service first", Toast.LENGTH_SHORT).show()
//            }
//        }

        // Load availed services
        loadAvailedServices()
    }

    private fun loadAvailedServices() {
        cartItems.clear()
        selectedCartItemId = -1

        // Get the provider's services
        val providerServices = dbHelper.getUserServices(userId)
        val serviceIds = providerServices.map { it.id }

        if (serviceIds.isEmpty()) {
            showEmptyView("You haven't added any services yet")
            return
        }

        // Query database for all cart items that contain the provider's services
        val allCartItems = getAllCartItemsForProvider(serviceIds)

        if (allCartItems.isEmpty()) {
            showEmptyView("No one has availed your services yet")
            return
        }

        cartItems.addAll(allCartItems)
        displayCartItems()
    }

    private fun getAllCartItemsForProvider(serviceIds: List<Int>): List<CartItemWithCustomer> {
        val result = mutableListOf<CartItemWithCustomer>()
        val db = dbHelper.readableDatabase

        // For each service offered by this provider
        for (serviceId in serviceIds) {
            // Get the service details
            val service = dbHelper.getServiceById(serviceId) ?: continue

            // SQL query using string literals instead of private constants
            val query = """
            SELECT c.*, u.username as customer_name
            FROM user_cart c
            JOIN data u ON c.user_id = u.id
            WHERE c.service_id = ?
        """.trimIndent()

            db.rawQuery(query, arrayOf(serviceId.toString())).use { cursor ->
                if (cursor.moveToFirst()) {
                    do {
                        // Use column indices directly or column names as strings
                        val cartId = cursor.getInt(cursor.getColumnIndex("id"))
                        val customerId = cursor.getInt(cursor.getColumnIndex("user_id"))
                        val status = cursor.getString(cursor.getColumnIndex("status"))
                        val date = cursor.getString(cursor.getColumnIndex("date_added"))
                        val customerName = cursor.getString(cursor.getColumnIndex("customer_name"))

                        result.add(
                            CartItemWithCustomer(
                                cartId = cartId,
                                serviceId = serviceId,
                                serviceName = service.name,
                                customerId = customerId,
                                customerName = customerName,
                                status = status,
                                date = date
                            )
                        )
                    } while (cursor.moveToNext())
                }
            }
        }

        return result
    }

    private fun displayCartItems() {
        val tableContent = findViewById<LinearLayout>(R.id.tableContent)
        tableContent.removeAllViews()

        // Hide empty view if we have items
        findViewById<View>(R.id.emptyView).visibility = View.GONE

        // Add each cart item to the table
        for (item in cartItems) {
            val rowView = createCartItemRow(item)
            tableContent.addView(rowView)
        }
    }
    private fun createCartItemRow(item: CartItemWithCustomer): View {
        val inflater = LayoutInflater.from(this)
        val rowView = inflater.inflate(R.layout.provider_cart_item_row, null)

        // Set cart item data
        rowView.findViewById<TextView>(R.id.tvServiceName).text = item.serviceName
        rowView.findViewById<TextView>(R.id.tvProviderName).text = item.customerName // This is actually the customer name
        rowView.findViewById<TextView>(R.id.tvStatus).text = item.status
        rowView.findViewById<TextView>(R.id.tvDate).text = item.date

        // Hide service ID (used for reference)
        rowView.findViewById<TextView>(R.id.tvServiceId).apply {
            text = item.cartId.toString()
            visibility = View.GONE
        }

        // Set background color based on status
        when (item.status.lowercase()) {
            "pending" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#FFA500"))
            "accepted" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#4CAF50"))
            "rejected" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#F44336"))
            "completed" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#2196F3"))
        }

        // Find the buttons layout and buttons (assuming they exist in the layout)
        val buttonsLayout = rowView.findViewById<LinearLayout>(R.id.buttonsLayout)
        val btnAccept = rowView.findViewById<Button>(R.id.btnAccept)
        val btnRefuse = rowView.findViewById<Button>(R.id.btnRefuse)

        // Show/hide buttons based on status
        if (item.status.lowercase() == "pending") {
            buttonsLayout.visibility = View.VISIBLE

            // Set up accept button
            btnAccept.setOnClickListener {
                updateCartItemStatus(item.cartId, "Accepted")
            }

            // Set up refuse button
            btnRefuse.setOnClickListener {
                updateCartItemStatus(item.cartId, "Rejected")
            }
        } else {
            buttonsLayout.visibility = View.GONE
        }

        // Set click listener for row selection
        rowView.setOnClickListener {
            // Deselect all rows first
            for (i in 0 until findViewById<LinearLayout>(R.id.tableContent).childCount) {
                findViewById<LinearLayout>(R.id.tableContent).getChildAt(i).setBackgroundColor(Color.TRANSPARENT)
            }

            // Select this row
            rowView.setBackgroundColor(Color.parseColor("#E0E0E0"))
            selectedCartItemId = item.cartId
        }

        return rowView
    }

//    private fun createCartItemRow(item: CartItemWithCustomer): View {
//        val inflater = LayoutInflater.from(this)
//        val rowView = inflater.inflate(R.layout.provider_cart_item_row, null)
//
//        // Set cart item data
//        rowView.findViewById<TextView>(R.id.tvServiceName).text = item.serviceName
//        rowView.findViewById<TextView>(R.id.tvProviderName).text = item.customerName // This is actually the customer name
//        rowView.findViewById<TextView>(R.id.tvStatus).text = item.status
//        rowView.findViewById<TextView>(R.id.tvDate).text = item.date
//
//        // Hide service ID (used for reference)
//        rowView.findViewById<TextView>(R.id.tvServiceId).apply {
//            text = item.cartId.toString()
//            visibility = View.GONE
//        }
//
//        // Set background color based on status
//        when (item.status.lowercase()) {
//            "pending" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#FFA500"))
//            "accepted" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#4CAF50"))
//            "rejected" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#F44336"))
//            "completed" -> rowView.findViewById<TextView>(R.id.tvStatus).setTextColor(Color.parseColor("#2196F3"))
//        }
//
//        // Set click listener for row selection
//        rowView.setOnClickListener {
//            // Deselect all rows first
//            for (i in 0 until findViewById<LinearLayout>(R.id.tableContent).childCount) {
//                findViewById<LinearLayout>(R.id.tableContent).getChildAt(i).setBackgroundColor(Color.TRANSPARENT)
//            }
//
//            // Select this row
//            rowView.setBackgroundColor(Color.parseColor("#E0E0E0"))
//            selectedCartItemId = item.cartId
//        }
//
//        return rowView
//    }

    private fun showEmptyView(message: String) {
        findViewById<LinearLayout>(R.id.tableContent).visibility = View.GONE
        findViewById<View>(R.id.emptyView).visibility = View.VISIBLE
        findViewById<TextView>(R.id.tvEmptyMessage).text = message
    }

    private fun showStatusUpdateDialog(cartItemId: Int) {
        val statusOptions = arrayOf("Pending", "Accepted", "Rejected", "Completed")

        AlertDialog.Builder(this)
            .setTitle("Update Status")
            .setItems(statusOptions) { dialog, which ->
                val newStatus = statusOptions[which]
                updateCartItemStatus(cartItemId, newStatus)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun updateCartItemStatus(cartItemId: Int, newStatus: String): Boolean {
        val result = dbHelper.updateCartItemStatus(cartItemId, newStatus)

        if (result > 0) {
            Toast.makeText(this, "Status updated to $newStatus", Toast.LENGTH_SHORT).show()
            loadAvailedServices() // Refresh the list
            return true
        } else {
            Toast.makeText(this, "Failed to update status", Toast.LENGTH_SHORT).show()
            return false
        }
    }
}