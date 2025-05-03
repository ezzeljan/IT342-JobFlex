package com.csit284.natorprefinalnajud.models;

public class User {
    private String id;
    private String username;
    private String password;  // Only for registration, not stored locally
    private String email;
    private String phoneNumber;
    private int age;
    private String birthDate;
    private String sex;

    // Empty constructor for Retrofit
    public User() {
        this.id = null;
        this.username = "";
        this.password = "";
        this.email = "";
        this.phoneNumber = "";
        this.age = 0;
        this.birthDate = "";
        this.sex = "";
    }

    // Constructor with essential fields
    public User(String username, String email) {
        this.id = null;
        this.username = username;
        this.password = "";
        this.email = email;
        this.phoneNumber = "";
        this.age = 0;
        this.birthDate = "";
        this.sex = "";
    }

    // Full constructor
    public User(String id, String username, String password, String email,
                String phoneNumber, int age, String birthDate, String sex) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.birthDate = birthDate;
        this.sex = sex;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}