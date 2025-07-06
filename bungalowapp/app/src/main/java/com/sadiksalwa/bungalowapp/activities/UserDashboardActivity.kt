package com.sadiksalwa.bungalowapp.activities

import com.sadiksalwa.bungalowapp.R
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.sadiksalwa.bungalowapp.data.api.RetrofitClient
import com.sadiksalwa.bungalowapp.model.Booking
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UserDashboardActivity : AppCompatActivity() {

    private lateinit var etUserId: EditText
    private lateinit var etStartDate: EditText
    private lateinit var etEndDate: EditText
    private lateinit var etAddress: EditText
    private lateinit var etPhone: EditText
    private lateinit var btnBook: Button
    private lateinit var btnLogout: Button
    private lateinit var lvBookings: ListView

    private lateinit var bookingsAdapter: ArrayAdapter<String>
    private val bookingsList = mutableListOf<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_dashboard)

        etUserId = findViewById(R.id.etUserId)
        etStartDate = findViewById(R.id.etStartDate)
        etEndDate = findViewById(R.id.etEndDate)
        etAddress = findViewById(R.id.etAddress)
        etPhone = findViewById(R.id.etPhone)
        btnBook = findViewById(R.id.btnBook)
        btnLogout = findViewById(R.id.btnLogout)
        lvBookings = findViewById(R.id.lvUserBookings)

        bookingsAdapter = ArrayAdapter(this, R.layout.simple_list_item_1, bookingsList)

        lvBookings.adapter = bookingsAdapter

        btnBook.setOnClickListener {
            makeBooking()
        }

        btnLogout.setOnClickListener {
            val prefs = getSharedPreferences("USER_SESSION", MODE_PRIVATE)
            prefs.edit().clear().apply()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        loadBookings()
    }

    private fun loadBookings() {
        bookingsList.clear()
        bookingsAdapter.notifyDataSetChanged()

        RetrofitClient.instance.getAllBookings().enqueue(object : Callback<List<Booking>> {
            override fun onResponse(call: Call<List<Booking>>, response: Response<List<Booking>>) {
                if (response.isSuccessful && response.body() != null) {
                    response.body()!!.forEach { booking ->
                        bookingsList.add(
                            """
                            Booking #${booking.bookId}
                            User: ${booking.userId}
                            From: ${booking.startingDate} To: ${booking.endingDate}
                            Address: ${booking.address}
                            Phone: ${booking.phone}
                            """.trimIndent()
                        )
                    }
                    bookingsAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(this@UserDashboardActivity, "Failed to load bookings", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Booking>>, t: Throwable) {
                Toast.makeText(this@UserDashboardActivity, "Error: ${t.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun makeBooking() {
        val userIdStr = etUserId.text.toString().trim()
        val startDate = etStartDate.text.toString().trim()
        val endDate = etEndDate.text.toString().trim()
        val address = etAddress.text.toString().trim()
        val phone = etPhone.text.toString().trim()

        if (userIdStr.isEmpty() || startDate.isEmpty() || endDate.isEmpty() || address.isEmpty() || phone.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }

        val userId = userIdStr.toLongOrNull()
        if (userId == null) {
            Toast.makeText(this, "Invalid User ID", Toast.LENGTH_SHORT).show()
            return
        }

        val booking = Booking(
            startingDate = startDate,
            endingDate = endDate,
            address = address,
            phone = phone,
            userId = userId
        )

        RetrofitClient.instance.createBooking(booking).enqueue(object : Callback<Booking> {
            override fun onResponse(call: Call<Booking>, response: Response<Booking>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@UserDashboardActivity, "Booking successful!", Toast.LENGTH_SHORT).show()
                    etUserId.text.clear()
                    etStartDate.text.clear()
                    etEndDate.text.clear()
                    etAddress.text.clear()
                    etPhone.text.clear()
                    loadBookings()
                } else {
                    Toast.makeText(this@UserDashboardActivity, "Failed to book", Toast.LENGTH_SHORT).show()
                }
            }


            override fun onFailure(call: Call<Booking>, t: Throwable) {
                Toast.makeText(this@UserDashboardActivity, "Error: ${t.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
