package com.sadiksalwa.bungalowapp

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.sadiksalwa.bungalowapp.activities.LoginActivity

class MainActivity : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<TextView>(R.id.welcome).setOnClickListener{
            startActivity(Intent(this,LoginActivity::class.java))
        }
    }
}