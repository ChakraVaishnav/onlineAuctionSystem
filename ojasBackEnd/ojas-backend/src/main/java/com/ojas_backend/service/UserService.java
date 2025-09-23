package com.ojas_backend.service;

import com.ojas_backend.entity.User;

public interface UserService {
    User register(User user);
    User login(String username, String password);
    User findByUsername(String username);
}


