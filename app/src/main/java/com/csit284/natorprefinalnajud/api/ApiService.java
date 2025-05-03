package com.csit284.natorprefinalnajud.api;

import org.jetbrains.annotations.NotNull;

import com.csit284.natorprefinalnajud.models.LoginRequest;
import com.csit284.natorprefinalnajud.models.User;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import java.util.List;

public interface ApiService {
    @GET("users")
    Call<List<User>> getUsers();

    @GET("users/{id}")
    Call<User> getUserById(@Path("id") String id);

    @POST("users")
    Call<User> createUser(@Body User user);

    @POST("register") // Add appropriate endpoint
    Call<ApiResponse<User>> registerUser(@Body User user);

    @POST("login") // Add appropriate endpoint
    Call<ApiResponse<User>> login(@Body LoginRequest loginRequest);
}