package com.sadiksalwa.bungalowapp.adapter

import com.sadiksalwa.bungalowapp.model.Booking

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.sadiksalwa.bungalowapp.R


class BookingAdapter(
    context: Context,
    bookings: List<Booking>
) : ArrayAdapter<Booking>(context, 0, bookings) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context)
            .inflate(R.layout.activity_item_booking, parent, false)

        val booking = getItem(position)

        val tvBookingId = view.findViewById<TextView>(R.id.tvBookingId)
        val tvBookingDates = view.findViewById<TextView>(R.id.tvBookingDates)
        val tvBookingAddress = view.findViewById<TextView>(R.id.tvBookingAddress)
        val tvBookingPhone = view.findViewById<TextView>(R.id.tvBookingPhone)
        val tvBookingUserId = view.findViewById<TextView>(R.id.tvBookingUserId)

        tvBookingId.text = "Booking ID: ${booking?.bookId ?: "N/A"}"
        tvBookingDates.text = "From: ${booking?.startingDate} To: ${booking?.endingDate}"
        tvBookingAddress.text = "Address: ${booking?.address}"
        tvBookingPhone.text = "Phone: ${booking?.phone}"
        tvBookingUserId.text = "User ID: ${booking?.userId}"

        return view
    }
}
