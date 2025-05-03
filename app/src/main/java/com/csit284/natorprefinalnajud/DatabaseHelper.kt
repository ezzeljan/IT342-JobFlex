package com.csit284.natorprefinalnajud

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.util.Log

class DatabaseHelper(private val context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "Trabahanap.db"
        private const val DATABASE_VERSION = 4 // Increased version number for cart table

        // Users Table
        private const val TABLE_NAME = "data"
        private const val COLUMN_ID = "id"
        private const val COLUMN_USERNAME = "username"
        private const val COLUMN_PASSWORD = "password"
        private const val COLUMN_EMAIL = "email"
        private const val COLUMN_PHONE = "phone_number"
        private const val COLUMN_AGE = "age"
        private const val COLUMN_BIRTH_DATE = "birth_date"
        private const val COLUMN_SEX = "sex"

        // Services Table
        private const val SERVICE_TABLE = "services"
        private const val SERVICE_ID = "id"
        private const val SERVICE_USER_ID = "user_id"
        private const val SERVICE_NAME = "service_name"
        private const val SERVICE_DESC = "description"
        private const val SERVICE_IMG = "image_path"

        // Cart Table
        private const val CART_TABLE = "user_cart"
        private const val CART_ID = "id"
        private const val CART_USER_ID = "user_id"
        private const val CART_SERVICE_ID = "service_id"
        private const val CART_STATUS = "status"
        private const val CART_DATE = "date_added"
    }

    override fun onCreate(db: SQLiteDatabase?) {
        val createUserTable = """
            CREATE TABLE $TABLE_NAME (
                $COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $COLUMN_USERNAME TEXT UNIQUE,
                $COLUMN_PASSWORD TEXT,
                $COLUMN_EMAIL TEXT,
                $COLUMN_PHONE TEXT,
                $COLUMN_AGE INTEGER,
                $COLUMN_BIRTH_DATE TEXT,
                $COLUMN_SEX TEXT
            )
        """.trimIndent()

        val createServiceTable = """
            CREATE TABLE $SERVICE_TABLE (
                $SERVICE_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $SERVICE_USER_ID INTEGER,
                $SERVICE_NAME TEXT,
                $SERVICE_DESC TEXT,
                $SERVICE_IMG TEXT,
                FOREIGN KEY ($SERVICE_USER_ID) REFERENCES $TABLE_NAME($COLUMN_ID)
            )
        """.trimIndent()

        val createCartTable = """
            CREATE TABLE $CART_TABLE (
                $CART_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $CART_USER_ID INTEGER,
                $CART_SERVICE_ID INTEGER,
                $CART_STATUS TEXT,
                $CART_DATE TEXT,
                FOREIGN KEY ($CART_USER_ID) REFERENCES $TABLE_NAME($COLUMN_ID),
                FOREIGN KEY ($CART_SERVICE_ID) REFERENCES $SERVICE_TABLE($SERVICE_ID)
            )
        """.trimIndent()

        db?.execSQL(createUserTable)
        db?.execSQL(createServiceTable)
        db?.execSQL(createCartTable)
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        if (oldVersion < 2) {
            try {
                db?.execSQL("ALTER TABLE $TABLE_NAME ADD COLUMN $COLUMN_EMAIL TEXT")
                db?.execSQL("ALTER TABLE $TABLE_NAME ADD COLUMN $COLUMN_PHONE TEXT")
                db?.execSQL("ALTER TABLE $TABLE_NAME ADD COLUMN $COLUMN_AGE INTEGER")
                db?.execSQL("ALTER TABLE $TABLE_NAME ADD COLUMN $COLUMN_BIRTH_DATE TEXT")
                db?.execSQL("ALTER TABLE $TABLE_NAME ADD COLUMN $COLUMN_SEX TEXT")
            } catch (e: Exception) {
                Log.e("DatabaseHelper", "Upgrade failed: ${e.message}")
                db?.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
                onCreate(db)
            }
        }

        if (oldVersion < 3) {
            try {
                val createServiceTable = """
                    CREATE TABLE $SERVICE_TABLE (
                        $SERVICE_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                        $SERVICE_USER_ID INTEGER,
                        $SERVICE_NAME TEXT,
                        $SERVICE_DESC TEXT,
                        $SERVICE_IMG TEXT,
                        FOREIGN KEY ($SERVICE_USER_ID) REFERENCES $TABLE_NAME($COLUMN_ID)
                    )
                """.trimIndent()
                db?.execSQL(createServiceTable)
            } catch (e: Exception) {
                Log.e("DatabaseHelper", "Service table creation failed: ${e.message}")
            }
        }

        if (oldVersion < 4) {
            try {
                val createCartTable = """
                    CREATE TABLE $CART_TABLE (
                        $CART_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                        $CART_USER_ID INTEGER,
                        $CART_SERVICE_ID INTEGER,
                        $CART_STATUS TEXT,
                        $CART_DATE TEXT,
                        FOREIGN KEY ($CART_USER_ID) REFERENCES $TABLE_NAME($COLUMN_ID),
                        FOREIGN KEY ($CART_SERVICE_ID) REFERENCES $SERVICE_TABLE($SERVICE_ID)
                    )
                """.trimIndent()
                db?.execSQL(createCartTable)
            } catch (e: Exception) {
                Log.e("DatabaseHelper", "Cart table creation failed: ${e.message}")
            }
        }
    }

    // 1. User-related functions

    fun insertUser(
        username: String,
        password: String,
        email: String = "",
        phoneNumber: String = "",
        age: Int = 0,
        birthDate: String = "",
        sex: String = ""
    ): Long {
        val values = ContentValues().apply {
            put(COLUMN_USERNAME, username)
            put(COLUMN_PASSWORD, password)
            put(COLUMN_EMAIL, email)
            put(COLUMN_PHONE, phoneNumber)
            put(COLUMN_AGE, age)
            put(COLUMN_BIRTH_DATE, birthDate)
            put(COLUMN_SEX, sex)
        }
        return try {
            writableDatabase.insertOrThrow(TABLE_NAME, null, values)
        } catch (e: Exception) {
            Log.e("DatabaseHelper", "Insert user error: ${e.message}")
            -1L
        }
    }

    fun readUser(username: String, password: String): Boolean {
        val db = readableDatabase
        val cursor = db.query(
            TABLE_NAME, arrayOf(COLUMN_PASSWORD),
            "$COLUMN_USERNAME = ?", arrayOf(username),
            null, null, null
        )
        return cursor.use {
            if (it.moveToFirst()) {
                val storedPassword = it.getString(it.getColumnIndex(COLUMN_PASSWORD))
                storedPassword == password
            } else false
        }
    }

    fun getUsernameById(userId: Int): String? {
        val db = readableDatabase
        val cursor = db.query(
            TABLE_NAME,
            arrayOf(COLUMN_USERNAME),
            "$COLUMN_ID = ?",
            arrayOf(userId.toString()),
            null, null, null
        )
        return cursor.use {
            if (it.moveToFirst()) {
                it.getString(it.getColumnIndex(COLUMN_USERNAME))
            } else null
        }
    }

    fun getUser(username: String): User? {
        val db = readableDatabase
        val cursor = db.query(
            TABLE_NAME, null,
            "$COLUMN_USERNAME = ?", arrayOf(username),
            null, null, null
        )
        return cursor.use {
            if (it.moveToFirst()) {
                User(
                    id = it.getInt(it.getColumnIndex(COLUMN_ID)),
                    username = username,
                    password = it.getString(it.getColumnIndex(COLUMN_PASSWORD)) ?: "",
                    email = it.getString(it.getColumnIndex(COLUMN_EMAIL)) ?: "",
                    phoneNumber = it.getString(it.getColumnIndex(COLUMN_PHONE)) ?: "",
                    age = it.getInt(it.getColumnIndex(COLUMN_AGE)),
                    birthDate = it.getString(it.getColumnIndex(COLUMN_BIRTH_DATE)) ?: "",
                    sex = it.getString(it.getColumnIndex(COLUMN_SEX)) ?: ""
                )
            } else null
        }
    }

    // 2. Service-related functions

    fun insertService(userId: Int, name: String, description: String, imagePath: String): Long {
        val values = ContentValues().apply {
            put(SERVICE_USER_ID, userId)
            put(SERVICE_NAME, name)
            put(SERVICE_DESC, description)
            put(SERVICE_IMG, imagePath)
        }
        return try {
            writableDatabase.insert(SERVICE_TABLE, null, values)
        } catch (e: Exception) {
            Log.e("DatabaseHelper", "Insert service error: ${e.message}")
            -1L
        }
    }

    fun getAllServices(): List<Service> {
        val services = mutableListOf<Service>()
        val db = readableDatabase
        val cursor = db.query(SERVICE_TABLE, null, null, null, null, null, null)
        cursor.use {
            if (it.moveToFirst()) {
                do {
                    services.add(
                        Service(
                            id = it.getInt(it.getColumnIndex(SERVICE_ID)),
                            userId = it.getInt(it.getColumnIndex(SERVICE_USER_ID)),
                            name = it.getString(it.getColumnIndex(SERVICE_NAME)) ?: "",
                            description = it.getString(it.getColumnIndex(SERVICE_DESC)) ?: "",
                            imagePath = it.getString(it.getColumnIndex(SERVICE_IMG)) ?: ""
                        )
                    )
                } while (it.moveToNext())
            }
        }
        return services
    }

    fun getUserServices(userId: Int): List<Service> {
        val services = mutableListOf<Service>()
        val db = readableDatabase
        val cursor = db.query(
            SERVICE_TABLE,
            null,
            "$SERVICE_USER_ID = ?",
            arrayOf(userId.toString()),
            null, null, null
        )

        cursor.use {
            if (it.moveToFirst()) {
                do {
                    services.add(
                        Service(
                            id = it.getInt(it.getColumnIndex(SERVICE_ID)),
                            userId = it.getInt(it.getColumnIndex(SERVICE_USER_ID)),
                            name = it.getString(it.getColumnIndex(SERVICE_NAME)) ?: "",
                            description = it.getString(it.getColumnIndex(SERVICE_DESC)) ?: "",
                            imagePath = it.getString(it.getColumnIndex(SERVICE_IMG)) ?: ""
                        )
                    )
                } while (it.moveToNext())
            }
        }
        return services
    }

    fun deleteService(serviceId: Int): Int {
        return writableDatabase.delete(SERVICE_TABLE, "$SERVICE_ID=?", arrayOf(serviceId.toString()))
    }

    fun updateService(serviceId: Int, name: String, description: String, imagePath: String): Int {
        val values = ContentValues().apply {
            put(SERVICE_NAME, name)
            put(SERVICE_DESC, description)
            put(SERVICE_IMG, imagePath)
        }
        return writableDatabase.update(
            SERVICE_TABLE,
            values,
            "$SERVICE_ID=?",
            arrayOf(serviceId.toString())
        )
    }

    fun getServiceById(serviceId: Int): Service? {
        val db = readableDatabase
        val cursor = db.query(
            SERVICE_TABLE,
            null,
            "$SERVICE_ID = ?",
            arrayOf(serviceId.toString()),
            null, null, null
        )

        return cursor.use {
            if (it.moveToFirst()) {
                Service(
                    id = it.getInt(it.getColumnIndex(SERVICE_ID)),
                    userId = it.getInt(it.getColumnIndex(SERVICE_USER_ID)),
                    name = it.getString(it.getColumnIndex(SERVICE_NAME)) ?: "",
                    description = it.getString(it.getColumnIndex(SERVICE_DESC)) ?: "",
                    imagePath = it.getString(it.getColumnIndex(SERVICE_IMG)) ?: ""
                )
            } else null
        }
    }

    // 3. Other user functions (update, delete, etc.)

    fun updateUser(
        id: Int,
        username: String,
        password: String,
        email: String = "",
        phoneNumber: String = "",
        age: Int = 0,
        birthDate: String = "",
        sex: String = ""
    ): Int {
        val values = ContentValues().apply {
            put(COLUMN_USERNAME, username)
            put(COLUMN_PASSWORD, password)
            put(COLUMN_EMAIL, email)
            put(COLUMN_PHONE, phoneNumber)
            put(COLUMN_AGE, age)
            put(COLUMN_BIRTH_DATE, birthDate)
            put(COLUMN_SEX, sex)
        }
        return writableDatabase.update(TABLE_NAME, values, "$COLUMN_ID=?", arrayOf(id.toString()))
    }

    fun deleteUser(id: Int): Int {
        return writableDatabase.delete(TABLE_NAME, "$COLUMN_ID=?", arrayOf(id.toString()))
    }

    fun updateUserPassword(id: Int, newPassword: String): Int {
        val values = ContentValues().apply {
            put(COLUMN_PASSWORD, newPassword)
        }
        return writableDatabase.update(TABLE_NAME, values, "$COLUMN_ID=?", arrayOf(id.toString()))
    }

    // 4. Cart-related functions

    fun addToUserCart(userId: Int, serviceId: Int, status: String, date: String): Boolean {
        val values = ContentValues().apply {
            put(CART_USER_ID, userId)
            put(CART_SERVICE_ID, serviceId)
            put(CART_STATUS, status)
            put(CART_DATE, date)
        }
        return try {
            val id = writableDatabase.insert(CART_TABLE, null, values)
            id != -1L
        } catch (e: Exception) {
            Log.e("DatabaseHelper", "Add to cart error: ${e.message}")
            false
        }
    }

    fun getUserCartItems(userId: Int): List<CartItem> {
        val cartItems = mutableListOf<CartItem>()
        val db = readableDatabase

        val query = """
            SELECT c.*, s.*, u.username as provider_name
            FROM $CART_TABLE c
            JOIN $SERVICE_TABLE s ON c.$CART_SERVICE_ID = s.$SERVICE_ID
            JOIN $TABLE_NAME u ON s.$SERVICE_USER_ID = u.$COLUMN_ID
            WHERE c.$CART_USER_ID = ?
        """.trimIndent()

        val cursor = db.rawQuery(query, arrayOf(userId.toString()))

        cursor.use {
            if (it.moveToFirst()) {
                do {
                    val cartId = it.getInt(it.getColumnIndex(CART_ID))
                    val serviceId = it.getInt(it.getColumnIndex(CART_SERVICE_ID))
                    val status = it.getString(it.getColumnIndex(CART_STATUS))
                    val date = it.getString(it.getColumnIndex(CART_DATE))
                    val serviceName = it.getString(it.getColumnIndex(SERVICE_NAME))
                    val serviceProviderId = it.getInt(it.getColumnIndex(SERVICE_USER_ID))
                    val providerName = it.getString(it.getColumnIndex("provider_name"))

                    cartItems.add(CartItem(
                        id = cartId,
                        userId = userId,
                        serviceId = serviceId,
                        serviceName = serviceName,
                        serviceProviderId = serviceProviderId,
                        providerName = providerName,
                        status = status,
                        date = date
                    ))
                } while (it.moveToNext())
            }
        }

        return cartItems
    }

    fun removeFromCart(cartId: Int): Int {
        return writableDatabase.delete(CART_TABLE, "$CART_ID=?", arrayOf(cartId.toString()))
    }

    fun updateCartItemStatus(cartId: Int, newStatus: String): Int {
        val values = ContentValues().apply {
            put(CART_STATUS, newStatus)
        }
        return writableDatabase.update(
            CART_TABLE,
            values,
            "$CART_ID=?",
            arrayOf(cartId.toString())
        )
    }

    // New method to cancel a service by updating its status to "Cancelled"
    fun cancelService(serviceId: Int): Boolean {
        try {
            // First, find the cart item associated with this service that has "Pending" status
            val db = readableDatabase
            val query = """
                SELECT $CART_ID FROM $CART_TABLE 
                WHERE $CART_SERVICE_ID = ? AND $CART_STATUS = 'Pending'
            """.trimIndent()

            val cursor = db.rawQuery(query, arrayOf(serviceId.toString()))

            return cursor.use {
                if (it.moveToFirst()) {
                    val cartId = it.getInt(it.getColumnIndex(CART_ID))

                    // Update the status to "Cancelled"
                    val values = ContentValues().apply {
                        put(CART_STATUS, "Cancelled")
                    }

                    val result = writableDatabase.update(
                        CART_TABLE,
                        values,
                        "$CART_ID = ?",
                        arrayOf(cartId.toString())
                    )

                    result > 0
                } else {
                    // No matching pending service found
                    Log.e("DatabaseHelper", "No pending service found with ID: $serviceId")
                    false
                }
            }
        } catch (e: Exception) {
            Log.e("DatabaseHelper", "Cancel service error: ${e.message}")
            return false
        }
    }

    // Data classes
    data class User(
        val id: Int,
        val username: String,
        val password: String,
        val email: String = "",
        val phoneNumber: String = "",
        val age: Int = 0,
        val birthDate: String = "",
        val sex: String = ""
    )

    data class Service(
        val id: Int,
        val userId: Int,
        val name: String,
        val description: String,
        val imagePath: String
    )

    data class CartItem(
        val id: Int,
        val userId: Int,
        val serviceId: Int,
        val serviceName: String,
        val serviceProviderId: Int,
        val providerName: String,
        val status: String,
        val date: String
    )
}