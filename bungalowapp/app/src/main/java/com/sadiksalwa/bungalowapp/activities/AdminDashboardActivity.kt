package com.sadiksalwa.bungalowapp.activities

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.sadiksalwa.bungalowapp.R
import com.sadiksalwa.bungalowapp.data.api.RetrofitClient
import com.sadiksalwa.bungalowapp.model.Booking
import com.sadiksalwa.bungalowapp.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AdminDashboardActivity : AppCompatActivity() {

    private lateinit var tvUserCount: TextView
    private lateinit var tvBookingCount: TextView
    private lateinit var lvUsers: ListView
    private lateinit var lvBookings: ListView
    private lateinit var btnLogout: Button

    private lateinit var usersAdapter: ArrayAdapter<String>
    private lateinit var bookingsAdapter: ArrayAdapter<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_dashboard)

        tvUserCount = findViewById(R.id.tvUserCount)
        tvBookingCount = findViewById(R.id.tvBookingCount)
        lvUsers = findViewById(R.id.lvUsers)
        lvBookings = findViewById(R.id.lvBookings)
        btnLogout = findViewById(R.id.btnLogout)

        btnLogout.setOnClickListener {
            logout()
        }

        fetchUsers()
        fetchBookings()
    }

    private fun fetchUsers() {
        RetrofitClient.instance.getAllUsers()
            .enqueue(object : Callback<List<User>> {
                override fun onResponse(call: Call<List<User>>, response: Response<List<User>>) {
                    if (response.isSuccessful) {
                        val users = response.body() ?: emptyList()
                        tvUserCount.text = users.size.toString()

                        val userNames = users.map { "${it.username} (${it.role})" }
                        usersAdapter = ArrayAdapter(
                            this@AdminDashboardActivity,
                            android.R.layout.simple_list_item_1,
                            userNames
                        )
                        lvUsers.adapter = usersAdapter
                    } else {
                        Toast.makeText(this@AdminDashboardActivity, "Failed to fetch users", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<List<User>>, t: Throwable) {
                    Toast.makeText(this@AdminDashboardActivity, "Error: ${t.localizedMessage}", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun fetchBookings() {
        RetrofitClient.instance.getAllBookings()
            .enqueue(object : Callback<List<Booking>> {
                override fun onResponse(call: Call<List<Booking>>, response: Response<List<Booking>>) {
                    if (response.isSuccessful) {
                        val bookings = response.body() ?: emptyList()
                        tvBookingCount.text = bookings.size.toString()

                        val bookingInfo = bookings.map {
                            "ID: ${it.bookId} | ${it.startingDate} → ${it.endingDate} (User ID: ${it.userId})"
                        }

                        bookingsAdapter = ArrayAdapter(
                            this@AdminDashboardActivity,
                            android.R.layout.simple_list_item_1,
                            bookingInfo
                        )
                        lvBookings.adapter = bookingsAdapter
                    } else {
                        Toast.makeText(this@AdminDashboardActivity, "Failed to fetch bookings", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<List<Booking>>, t: Throwable) {
                    Toast.makeText(this@AdminDashboardActivity, "Error: ${t.localizedMessage}", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun logout() {
        val sharedPref = getSharedPreferences("user_session", MODE_PRIVATE)
        sharedPref.edit().clear().apply()
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }
}
