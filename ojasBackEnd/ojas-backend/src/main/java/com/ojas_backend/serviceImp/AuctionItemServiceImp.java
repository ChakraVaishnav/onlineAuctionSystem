package com.ojas_backend.serviceImp;

import com.ojas_backend.entity.AuctionItem;
import com.ojas_backend.entity.User;
import com.ojas_backend.repository.AuctionItemRepository;
import com.ojas_backend.service.AuctionItemService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class AuctionItemServiceImp implements AuctionItemService {
    @Autowired
    private final AuctionItemRepository auctionItemRepository;

    public AuctionItemServiceImp(AuctionItemRepository auctionItemRepository) {
        this.auctionItemRepository = auctionItemRepository;
    }

    @Override
    public List<AuctionItem> getAllItems() {
        return auctionItemRepository.findAll();
    }

    @Override
    public AuctionItem addItem(AuctionItem item, User user) {
        item.setCreatedBy(user);
        if (item.getStartingPrice() != null) {
            item.setCurrentHighestBid(item.getStartingPrice());
        }
        if (item.getStatus() == null) {
            item.setStatus("Active");
        }
        return auctionItemRepository.save(item);
    }

    @Override
    public AuctionItem getItemById(Long id) {
        return auctionItemRepository.findById(id).orElse(null);
    }
}


