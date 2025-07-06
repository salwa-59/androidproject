package com.sadiksalwa.bungalowapp.data.api

import com.sadiksalwa.bungalowapp.model.Booking
import com.sadiksalwa.bungalowapp.model.LoginRequest
import com.sadiksalwa.bungalowapp.model.User
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @Headers("Content-Type: application/json")
    @POST("api/auth/login")
    fun login(@Body loginRequest: LoginRequest): Call<User>

    @GET("users")
    fun getAllUsers(): Call<List<User>>

    @GET("api/bookings")
    fun getAllBookings(): Call<List<Booking>>

    @POST("api/bookings")
    fun createBooking(@Body booking: Booking): Call<Booking>

    @GET("api/bookings/{userId}")
    fun getUserBookings(@Path("userId") userId: Long): Call<List<Booking>>

    @POST("api/auth/signup")
    fun registerUser(@Body user: User): Call<User>


}
