package com.csit284.natorprefinalnajud

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import com.csit284.natorprefinalnajud.api.ApiResponse
import com.csit284.natorprefinalnajud.api.RetrofitClient
import com.csit284.natorprefinalnajud.databinding.ActivityLoginBinding
import com.csit284.natorprefinalnajud.models.LoginRequest
import com.csit284.natorprefinalnajud.models.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class Login : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var databaseHelper: DatabaseHelper  // Keep for fallback if needed
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize SharedPreferences
        sharedPreferences = getSharedPreferences("UserSession", MODE_PRIVATE)

        // Initialize DatabaseHelper (keep as fallback)
        databaseHelper = DatabaseHelper(this)

        // Check if user is already logged in
        checkUserSession()

        // Login button click listener
        binding.btnLogin.setOnClickListener {
            val loginUsername = binding.loginUsername.text.toString().trim()
            val loginPassword = binding.loginPassword.text.toString().trim()

            when {
                loginUsername.isEmpty() -> {
                    binding.loginUsername.error = "Username cannot be empty"
                }
                loginPassword.isEmpty() -> {
                    binding.loginPassword.error = "Password cannot be empty"
                }
                else -> loginWithServer(loginUsername, loginPassword)
            }
        }

        // Signup redirect click listener
        binding.signupRedirect.setOnClickListener {
            startActivity(Intent(this, Register::class.java))
            finish()
        }
    }

    private fun loginWithServer(username: String, password: String) {
        try {
            Log.d("LoginActivity", "Attempting login for username: $username")

            // Create login request
            val loginRequest = LoginRequest(username, password)

            // Make API call
            val apiService = RetrofitClient.getApiService()
            val call = apiService.login(loginRequest)

            call.enqueue(object : Callback<ApiResponse<User>> {
                override fun onResponse(call: Call<ApiResponse<User>>, response: Response<ApiResponse<User>>) {
                    if (response.isSuccessful) {
                        val apiResponse = response.body()

                        // Use Java-style method calls for Java class
                        if (apiResponse != null && apiResponse.isSuccess()) {
                            val user = apiResponse.getData()

                            if (user != null) {
                                Log.d("LoginActivity", "User logged in: ID=${user.getId()}, Username=${user.getUsername()}")

                                // Save user session
                                saveUserSession(user.getId().toInt(), user.getUsername(), user.getEmail())

                                Toast.makeText(this@Login, "Login Successful!", Toast.LENGTH_SHORT).show()

                                // Navigate based on email domain
                                navigateBasedOnEmailDomain(user.getEmail())
                            } else {
                                Log.e("LoginActivity", "User found but data is null")
                                Toast.makeText(this@Login, "Login successful, but user data retrieval failed", Toast.LENGTH_SHORT).show()
                            }
                        } else {
                            Log.d("LoginActivity", "Login failed: ${apiResponse?.getMessage() ?: "Unknown error"}")
                            Toast.makeText(this@Login, apiResponse?.getMessage() ?: "Invalid Username or Password", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        // Handle error response
                        Log.e("LoginActivity", "Server error: ${response.code()}")
                        Toast.makeText(this@Login, "Server error: ${response.code()}", Toast.LENGTH_SHORT).show()

                        // Fallback to local login if server is unreachable
                        loginFallbackToDatabase(username, password)
                    }
                }

                override fun onFailure(call: Call<ApiResponse<User>>, t: Throwable) {
                    Log.e("LoginActivity", "Network error: ${t.message}", t)
                    Toast.makeText(this@Login, "Network error. Check your connection.", Toast.LENGTH_SHORT).show()

                    // Fallback to local login if network is unavailable
                    loginFallbackToDatabase(username, password)
                }
            })
        } catch (e: Exception) {
            Log.e("LoginActivity", "Login error: ${e.message}", e)
            Toast.makeText(this, "An error occurred during login", Toast.LENGTH_SHORT).show()

            // Fallback to local login if there's any exception
            loginFallbackToDatabase(username, password)
        }
    }

    // Rest of your code remains the same...
    // Fallback to local database login if server is unreachable
    private fun loginFallbackToDatabase(username: String, password: String) {
        Log.d("LoginActivity", "Falling back to local database login")
        try {
            val userExists = databaseHelper.readUser(username, password)

            if (userExists) {
                val user = databaseHelper.getUser(username)

                if (user != null) {
                    saveUserSession(user.id, user.username, user.email)
                    Toast.makeText(this, "Offline login successful", Toast.LENGTH_SHORT).show()
                    navigateBasedOnEmailDomain(user.email)
                }
            } else {
                Toast.makeText(this, "Invalid Username or Password", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Log.e("LoginActivity", "Fallback login error: ${e.message}", e)
        }
    }

    private fun navigateBasedOnEmailDomain(email: String) {
        val intent = when {
            email.endsWith("@user.com") -> {
                Log.d("LoginActivity", "Regular user detected, navigating to Home")
                Intent(this, Home::class.java)
            }
            email.endsWith("@provider.com") -> {
                Log.d("LoginActivity", "Job provider detected, navigating to JobProvider")
                Intent(this, JobProviderHome::class.java)
            }
            else -> {
                Log.d("LoginActivity", "Unknown email domain, defaulting to Home")
                Intent(this, Home::class.java)
            }
        }
        startActivity(intent)
        finish()
    }

    private fun saveUserSession(userId: Int, username: String, email: String) {
        sharedPreferences.edit().apply {
            putInt("USER_ID", userId)
            putString("USERNAME", username)
            putString("EMAIL", email)
            apply()
        }
    }

    private fun checkUserSession() {
        val storedUserId = sharedPreferences.getInt("USER_ID", -1)
        val storedUsername = sharedPreferences.getString("USERNAME", null)
        val storedEmail = sharedPreferences.getString("EMAIL", null)

        if (storedUserId != -1 && !storedUsername.isNullOrEmpty()) {
            Log.d("LoginActivity", "User already logged in: $storedUsername")

            // If already logged in, also route based on email domain
            if (!storedEmail.isNullOrEmpty()) {
                navigateBasedOnEmailDomain(storedEmail)
            } else {
                // Fallback if email is not available
                startActivity(Intent(this, Home::class.java))
                finish()
            }
        }
    }
}