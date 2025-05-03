package com.csit284.natorprefinalnajud

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import com.csit284.natorprefinalnajud.databinding.ActivityUpdateProfileBinding
class UpdateProfile : AppCompatActivity() {
    private lateinit var binding: ActivityUpdateProfileBinding
    private lateinit var databaseHelper: DatabaseHelper
    private var userId: Int = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUpdateProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        databaseHelper = DatabaseHelper(this)

        // Retrieve passed data from intent
        userId = intent.getIntExtra("USER_ID", -1)
        val username = intent.getStringExtra("USERNAME") ?: ""
        val email = intent.getStringExtra("EMAIL") ?: ""
        val phoneNumber = intent.getStringExtra("PHONE_NUMBER") ?: ""
        val age = intent.getIntExtra("AGE", -1)
        val sex = intent.getStringExtra("SEX") ?: ""
        val birthDate = intent.getStringExtra("BIRTH_DATE") ?: ""

        // Log the received data
        Log.d("UpdateProfile", "User ID: $userId, Username: $username")

        // Populate UI with user data
        if (userId != -1) {
            binding.profileUsername.text = username  // Display username
            binding.editEmail.setText(email)
            binding.editPhoneNumber.setText(phoneNumber)
            binding.editAge.setText(if (age != -1) age.toString() else "")
            binding.textSex.text = sex  // Display sex as unchangeable
            binding.editBirthDate.setText(birthDate)
        } else {
            Toast.makeText(this, "Error loading user data!", Toast.LENGTH_LONG).show()
            finish()
        }

        // Handle update logic
        binding.btnSaveProfile.setOnClickListener {
            saveProfile()
        }

        // Handle cancel button
        binding.btnCancel.setOnClickListener {
            finish()
        }
    }

    private fun saveProfile() {
        if (userId == -1) {
            Toast.makeText(this, "Invalid user ID!", Toast.LENGTH_LONG).show()
            return
        }

        val newEmail = binding.editEmail.text.toString()
        val newPhoneNumber = binding.editPhoneNumber.text.toString()
        val newAge = binding.editAge.text.toString().toIntOrNull() ?: -1
        val newBirthDate = binding.editBirthDate.text.toString()
        val newPassword = binding.editNewPassword.text.toString()
        val confirmPassword = binding.editConfirmPassword.text.toString()

        // Validate passwords if provided
        if (newPassword.isNotEmpty()) {
            // Check password length - must be at least 6 characters
            if (newPassword.length < 6) {
                Toast.makeText(this, "Password must be at least 6 characters long!", Toast.LENGTH_LONG).show()
                return
            }

            // Check if passwords match
            if (newPassword != confirmPassword) {
                Toast.makeText(this, "Passwords do not match!", Toast.LENGTH_LONG).show()
                return
            }
        }

        // Check if email is valid
        if (newEmail.isEmpty()) {
            Toast.makeText(this, "Email cannot be empty!", Toast.LENGTH_LONG).show()
            return
        }

        // First update profile information (without password)
        val values = ContentValues().apply {
            put("email", newEmail)
            put("phone_number", newPhoneNumber)
            put("age", newAge)
            put("birth_date", newBirthDate)
        }

        val db = databaseHelper.writableDatabase
        val updatedRows = db.update("data", values, "id=?", arrayOf(userId.toString()))

        // Then update password separately if provided
        var passwordUpdated = true
        if (newPassword.isNotEmpty()) {
            val passwordValues = ContentValues().apply {
                put("password", newPassword)
            }
            val passwordUpdatedRows = db.update("data", passwordValues, "id=?", arrayOf(userId.toString()))

            // Log the password update for debugging
            Log.d("UpdateProfile", "Password update result: $passwordUpdatedRows rows affected")
            Log.d("UpdateProfile", "New password: $newPassword")

            passwordUpdated = passwordUpdatedRows > 0
        }

        if (updatedRows > 0 && passwordUpdated) {
            Toast.makeText(this, "Profile updated successfully!", Toast.LENGTH_SHORT).show()

            // Clear login session if password was changed
            if (newPassword.isNotEmpty()) {
                val sharedPreferences = getSharedPreferences("UserSession", Context.MODE_PRIVATE)
                sharedPreferences.edit().clear().apply()

                // Return to login screen
                val intent = Intent(this, Login::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
                startActivity(intent)
            } else {
                // Just go to home screen if only profile was updated
                val intent = Intent(this, Home::class.java)
                intent.putExtra("USER_ID", userId)
                startActivity(intent)
            }
            finish()
        } else {
            Toast.makeText(this, "Failed to update profile!", Toast.LENGTH_LONG).show()
        }
    }
}