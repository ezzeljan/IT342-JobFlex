package com.csit284.natorprefinalnajud

import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Toast
import com.csit284.natorprefinalnajud.api.ApiResponse
import com.csit284.natorprefinalnajud.api.RetrofitClient
import com.csit284.natorprefinalnajud.databinding.ActivityRegisterBinding
import com.csit284.natorprefinalnajud.models.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class Register : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var databaseHelper: DatabaseHelper
    private var selectedSex: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize DatabaseHelper (keep for fallback)
        databaseHelper = DatabaseHelper(this)

        // Setup Sex Spinner
        setupSexSpinner()

        // Show note when username field is clicked
        binding.signupUsername.setOnClickListener {
            binding.usernameNote.visibility = View.VISIBLE
        }

        // Register Button Click Listener
        binding.btnRegister.setOnClickListener {
            // Collect all input values
            val signupUsername = binding.signupUsername.text.toString().trim()
            val signupPassword = binding.signupPassword.text.toString().trim()
            val signupConfirmPassword = binding.signupConfirmPassword.text.toString().trim()
            val signupEmail = binding.signupEmail.text.toString().trim()
            val signupPhoneNumber = binding.signupPhoneNumber.text.toString().trim()
            val signupAge = binding.signupAge.text.toString().trim()
            val signupBirthDate = binding.signupBirthDate.text.toString().trim()

            // Validate inputs
            if (validateInputs(signupUsername, signupPassword, signupConfirmPassword,
                    signupEmail, signupPhoneNumber, signupAge, signupBirthDate)) {
                // Call API registration method
                registerWithServer(
                    signupUsername,
                    signupPassword,
                    signupEmail,
                    signupPhoneNumber,
                    signupAge.toInt(),
                    signupBirthDate,
                    selectedSex
                )
            }
        }

        // Login Redirect Click Listener
        binding.loginRedirect.setOnClickListener {
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun setupSexSpinner() {
        // Create an ArrayAdapter using the string array and a default spinner layout
        ArrayAdapter.createFromResource(
            this,
            R.array.sex_array,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            // Specify the layout to use when the list of choices appears
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            // Apply the adapter to the spinner
            binding.signupSex.adapter = adapter
        }

        // Set up spinner item selection listener
        binding.signupSex.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, pos: Int, id: Long) {
                // Skip the first item (hint/prompt)
                if (pos > 0) {
                    selectedSex = parent.getItemAtPosition(pos).toString()
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                selectedSex = ""
            }
        }
    }

    private fun validateInputs(
        username: String,
        password: String,
        confirmPassword: String,
        email: String,
        phoneNumber: String,
        age: String,
        birthDate: String
    ): Boolean {
        // Comprehensive input validation
        when {
            username.isEmpty() -> {
                Toast.makeText(this, "Username cannot be empty", Toast.LENGTH_SHORT).show()
                return false
            }
            password.length < 6 -> {
                Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                return false
            }
            password != confirmPassword -> {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return false
            }
            email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches() -> {
                Toast.makeText(this, "Invalid email address", Toast.LENGTH_SHORT).show()
                return false
            }
            phoneNumber.isEmpty() || !phoneNumber.matches("^[0-9]{11}$".toRegex()) -> {
                Toast.makeText(this, "Invalid phone number", Toast.LENGTH_SHORT).show()
                return false
            }
            age.isEmpty() || age.toIntOrNull() == null || age.toInt() < 13 -> {
                Toast.makeText(this, "Invalid age", Toast.LENGTH_SHORT).show()
                return false
            }
            birthDate.isEmpty() || !birthDate.matches("^\\d{4}-\\d{2}-\\d{2}$".toRegex()) -> {
                Toast.makeText(this, "Invalid birth date format (YYYY-MM-DD)", Toast.LENGTH_SHORT).show()
                return false
            }
            selectedSex.isEmpty() || selectedSex == "Select Sex" -> {
                Toast.makeText(this, "Please select a sex", Toast.LENGTH_SHORT).show()
                return false
            }
            else -> return true
        }
    }

    private fun registerWithServer(
        username: String,
        password: String,
        email: String,
        phoneNumber: String,
        age: Int,
        birthDate: String,
        sex: String
    ) {
        try {
            Log.d("RegisterActivity", "Attempting to register user: $username")

            // Create user object with all required fields
            // Create user object with all required fields
            val user = User(
                null,  // id is null for new users
                username,
                password,
                email,
                phoneNumber,
                age,
                birthDate,
                sex
            )

            // Get API service and make registration call
            val apiService = RetrofitClient.getApiService()
            val call = apiService.registerUser(user)

            call.enqueue(object : Callback<ApiResponse<User>> {
                override fun onResponse(call: Call<ApiResponse<User>>, response: Response<ApiResponse<User>>) {
                    if (response.isSuccessful) {
                        val apiResponse = response.body()

                        if (apiResponse != null && apiResponse.isSuccess) {
                            Log.d("RegisterActivity", "Registration successful")
                            Toast.makeText(this@Register, "Registration Successful!", Toast.LENGTH_SHORT).show()

                            // Navigate to login screen
                            val intent = Intent(this@Register, Login::class.java)
                            startActivity(intent)
                            finish()
                        } else {
                            Log.e("RegisterActivity", "Registration failed: ${apiResponse?.message ?: "Unknown error"}")
                            Toast.makeText(this@Register, apiResponse?.message ?: "Registration failed", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        // Handle server error
                        Log.e("RegisterActivity", "Server error: ${response.code()}")
                        Toast.makeText(this@Register, "Server error: ${response.code()}", Toast.LENGTH_SHORT).show()

                        // Fallback to local registration
                        registerFallbackToDatabase(username, password, email, phoneNumber, age, birthDate, sex)
                    }
                }

                override fun onFailure(call: Call<ApiResponse<User>>, t: Throwable) {
                    Log.e("RegisterActivity", "Network error: ${t.message}", t)
                    Toast.makeText(this@Register, "Network error. Check your connection.", Toast.LENGTH_SHORT).show()

                    // Fallback to local registration
                    registerFallbackToDatabase(username, password, email, phoneNumber, age, birthDate, sex)
                }
            })
        } catch (e: Exception) {
            Log.e("RegisterActivity", "Registration error: ${e.message}", e)
            Toast.makeText(this, "An error occurred during registration", Toast.LENGTH_SHORT).show()

            // Fallback to local registration
            registerFallbackToDatabase(username, password, email, phoneNumber, age, birthDate, sex)
        }
    }

    // Fallback method to register locally if server is unreachable
    private fun registerFallbackToDatabase(
        username: String,
        password: String,
        email: String,
        phoneNumber: String,
        age: Int,
        birthDate: String,
        sex: String
    ) {
        Log.d("RegisterActivity", "Falling back to local database registration")

        val insertRowId = databaseHelper.insertUser(
            username,
            password,
            email,
            phoneNumber,
            age,
            birthDate,
            sex
        )

        if (insertRowId != -1L) {
            Toast.makeText(this, "Offline Registration Successful", Toast.LENGTH_SHORT).show()
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
            finish()
        } else {
            Toast.makeText(this, "Registration Failed", Toast.LENGTH_SHORT).show()
        }
    }
}