package com.ojas_backend.service;

import com.ojas_backend.entity.AuctionItem;
import com.ojas_backend.entity.User;

import java.util.List;

public interface AuctionItemService {
    List<AuctionItem> getAllItems();
    AuctionItem addItem(AuctionItem item, User user);
    AuctionItem getItemById(Long id);
}


