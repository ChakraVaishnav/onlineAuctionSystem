package com.ojas_backend.controller;

import com.ojas_backend.entity.AuctionItem;
import com.ojas_backend.entity.User;
import com.ojas_backend.service.AuctionItemService;
import com.ojas_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ItemController {
	@Autowired
    private AuctionItemService auctionItemService;
	@Autowired
    private UserService userService;

    public ItemController(AuctionItemService auctionItemService, UserService userService) {
        this.auctionItemService = auctionItemService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AuctionItem>> getAll() {
        return ResponseEntity.ok(auctionItemService.getAllItems());
    }

    @PostMapping
    public ResponseEntity<AuctionItem> create(@RequestBody AuctionItem item, @RequestParam String username) {
        User creator = userService.findByUsername(username);
        if (creator == null) return ResponseEntity.status(401).build();
        AuctionItem saved = auctionItemService.addItem(item, creator);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionItem> getById(@PathVariable Long id) {
        AuctionItem item = auctionItemService.getItemById(id);
        if (item == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(item);
    }
}


