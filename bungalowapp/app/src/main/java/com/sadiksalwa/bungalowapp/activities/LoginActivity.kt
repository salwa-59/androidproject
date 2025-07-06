package com.sadiksalwa.bungalowapp.activities

import android.content.Intent
import android.content.Context
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.sadiksalwa.bungalowapp.R
import com.sadiksalwa.bungalowapp.data.api.RetrofitClient
import com.sadiksalwa.bungalowapp.model.LoginRequest
import com.sadiksalwa.bungalowapp.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {
    private lateinit var etUsername: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var tvRegister: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        etUsername = findViewById(R.id.etUsername)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        tvRegister = findViewById(R.id.tvRegister)

        btnLogin.setOnClickListener {
            login()
        }

        tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun login() {
        val username = etUsername.text.toString().trim()
        val password = etPassword.text.toString().trim()

        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }

        val loginRequest = LoginRequest(username, password)

        RetrofitClient.instance.login(loginRequest)
            .enqueue(object : Callback<User> {
                override fun onResponse(call: Call<User>, response: Response<User>) {
                    if (response.isSuccessful && response.body() != null) {
                        val user = response.body()!!

                        saveUserToPrefs(user)

                        val intent = if (user.role == "ADMIN") {
                            Intent(this@LoginActivity, AdminDashboardActivity::class.java)
                        } else {
                            val userIntent = Intent(this@LoginActivity, UserDashboardActivity::class.java)
                            userIntent.putExtra("userId",user.userId)
                            Intent(this@LoginActivity, UserDashboardActivity::class.java)
                        }

                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)

                    } else {
                        Toast.makeText(this@LoginActivity, "Invalid credentials", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<User>, t: Throwable) {
                    Toast.makeText(this@LoginActivity, "Error: ${t.localizedMessage}", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun saveUserToPrefs(user: User) {
        val sharedPref = getSharedPreferences("user_prefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putLong("userId", user.userId ?: -1)
            putString("username", user.username)
            putString("email", user.email)
            putString("role", user.role)
            apply()
        }
    }
}