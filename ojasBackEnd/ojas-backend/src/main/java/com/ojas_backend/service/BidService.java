package com.ojas_backend.service;

import com.ojas_backend.entity.Bid;
import com.ojas_backend.entity.User;

public interface BidService {
    Bid placeBid(Long itemId, Double amount, User user);
}


