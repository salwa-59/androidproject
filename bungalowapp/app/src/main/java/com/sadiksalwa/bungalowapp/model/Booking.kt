package com.sadiksalwa.bungalowapp.model

data class Booking(
    val bookId: Long? = null,
    val startingDate: String,
    val endingDate: String,
    val address: String,
    val phone: String,
    val userId: Long
)
