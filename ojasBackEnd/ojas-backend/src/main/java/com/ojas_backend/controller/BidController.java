package com.ojas_backend.controller;

import com.ojas_backend.entity.Bid;
import com.ojas_backend.entity.User;
import com.ojas_backend.service.BidService;
import com.ojas_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BidController {
	@Autowired
    private  BidService bidService;
	@Autowired
    private  UserService userService;

    public BidController(BidService bidService, UserService userService) {
        this.bidService = bidService;
        this.userService = userService;
    }

    @PostMapping("/item/{id}/bid")
    public ResponseEntity<Bid> bid(@PathVariable("id") Long itemId,
                                   @RequestParam String username,
                                   @RequestParam Double amount) {
        User bidder = userService.findByUsername(username);
        if (bidder == null) return ResponseEntity.status(401).build();
        Bid placed = bidService.placeBid(itemId, amount, bidder);
        if (placed == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(placed);
    }
}


