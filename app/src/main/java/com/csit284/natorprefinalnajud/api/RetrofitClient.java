package com.csit284.natorprefinalnajud.api;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.concurrent.TimeUnit;

public class RetrofitClient {

    // Use a proper HTTP/HTTPS endpoint for your API server
    private static final String BASE_URL = "https://your-api-server.com/api/";
    // Alternatively, if using localhost for testing:
    // private static final String BASE_URL = "http://10.0.2.2:8080/api/";

    private static Retrofit retrofit = null;

    // Private constructor to prevent instantiation
    private RetrofitClient() {
        // Nothing to do here
    }

    // Get the singleton Retrofit instance
    public static Retrofit getClient() {
        if (retrofit == null) {
            // Create a logging interceptor to see API call details in Logcat
            HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
            interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            // Configure the HTTP client with timeouts and the interceptor
            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(interceptor)
                    .connectTimeout(15, TimeUnit.SECONDS)
                    .readTimeout(15, TimeUnit.SECONDS)
                    .writeTimeout(15, TimeUnit.SECONDS)
                    .build();

            // Build the Retrofit instance
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    // Convenience method to get an implementation of the API interface
    public static ApiService getApiService() {
        return getClient().create(ApiService.class);
    }
}