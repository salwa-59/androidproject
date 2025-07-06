package com.sadiksalwa.bungalowapp.model

data class User(
    val userId: Long?,
    val username: String? = null,
    val password: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val role: String? = null
)
