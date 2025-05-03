package com.csit284.natorprefinalnajud

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import android.support.v7.app.AppCompatActivity
import com.csit284.natorprefinalnajud.databinding.ActivityProfileBinding

class Profile : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding
    private lateinit var databaseHelper: DatabaseHelper
    private lateinit var sharedPreferences: SharedPreferences
    private var userId: Int = -1
    private var userEmail: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("UserSession", Context.MODE_PRIVATE)
        databaseHelper = DatabaseHelper(this)

        // Get user email from SharedPreferences
        userEmail = sharedPreferences.getString("EMAIL", null)

        // Check user session
        checkUserSession()

        // Navigate back based on user email
        binding.btnBack.setOnClickListener {
            navigateToHome()
            finish()
        }

        // Update profile
        binding.btnUpdate.setOnClickListener {
            if (userId != -1) {
                val intent = Intent(this, UpdateProfile::class.java).apply {
                    putExtra("USER_ID", userId)
                    putExtra("USERNAME", binding.profileUsername.text.toString())
                    putExtra("EMAIL", binding.profileEmail.text.toString())
                    putExtra("PHONE_NUMBER", binding.profilePhoneNumber.text.toString())
                    putExtra("AGE", binding.profileAge.text.toString().toInt())
                    putExtra("SEX", binding.profileSex.text.toString())
                    putExtra("BIRTH_DATE", binding.profileBirthDate.text.toString())
                }
                startActivity(intent)
            } else {
                Toast.makeText(this, "User ID not found!", Toast.LENGTH_SHORT).show()
            }
        }

        // Delete user
        binding.btnDelete.setOnClickListener {
            deleteUser(userId)
        }
    }

    private fun checkUserSession() {
        val storedUserId = sharedPreferences.getInt("USER_ID", -1)
        val storedUsername = sharedPreferences.getString("USERNAME", null)

        if (storedUserId == -1 || storedUsername.isNullOrEmpty()) {
            Log.e("ProfileActivity", "Session expired or user not found")
            Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, Login::class.java))
            finish()
        } else {
            Log.d("ProfileActivity", "User session found: ID=$storedUserId, Username=$storedUsername, Email=$userEmail")
            userId = storedUserId
            loadUserProfile(storedUsername)
        }
    }

    private fun navigateToHome() {
        // Determine which home screen to return to based on email domain
        val intent = if (!userEmail.isNullOrEmpty() && userEmail!!.endsWith("@provider.com")) {
            Log.d("ProfileActivity", "Navigating to JobProviderHome")
            Intent(this, JobProviderHome::class.java)
        } else {
            Log.d("ProfileActivity", "Navigating to regular Home")
            Intent(this, Home::class.java)
        }
        startActivity(intent)
    }

    private fun loadUserProfile(username: String) {
        val user = databaseHelper.getUser(username)
        if (user != null) {
            userId = user.id
            binding.profileUsername.text = user.username
            binding.profileEmail.text = user.email
            binding.profilePhoneNumber.text = user.phoneNumber
            binding.profileAge.text = user.age.toString()
            binding.profileSex.text = user.sex
            binding.profileBirthDate.text = user.birthDate

            // Update email in case it wasn't in SharedPreferences
            if (userEmail.isNullOrEmpty()) {
                userEmail = user.email
                // Save it to SharedPreferences
                sharedPreferences.edit().putString("EMAIL", userEmail).apply()
            }
        } else {
            Log.e("ProfileActivity", "User not found in database")
            Toast.makeText(this, "User not found!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun deleteUser(id: Int) {
        if (id == -1) {
            Toast.makeText(this, "User not found!", Toast.LENGTH_SHORT).show()
            return
        }
        val rowsDeleted = databaseHelper.deleteUser(id)
        if (rowsDeleted > 0) {
            Toast.makeText(this, "User Deleted Successfully", Toast.LENGTH_SHORT).show()
            clearUserSession()
            startActivity(Intent(this, Login::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            })
            finish()
        } else {
            Toast.makeText(this, "Delete Failed", Toast.LENGTH_SHORT).show()
        }
    }

    private fun clearUserSession() {
        sharedPreferences.edit().clear().apply()
    }
}