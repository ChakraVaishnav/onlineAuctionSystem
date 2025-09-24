package com.ojas_backend.controller;

import com.ojas_backend.entity.User;
import com.ojas_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://3.g.253.9:5173", allowCredentials = "true")
public class AuthController {
	@Autowired
    private UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User saved = userService.register(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        User user = userService.login(username, password);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@RequestParam String username) {
        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }
}


