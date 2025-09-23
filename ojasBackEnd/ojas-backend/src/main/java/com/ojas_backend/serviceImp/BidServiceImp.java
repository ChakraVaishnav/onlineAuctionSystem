package com.ojas_backend.serviceImp;

import com.ojas_backend.entity.AuctionItem;
import com.ojas_backend.entity.Bid;
import com.ojas_backend.entity.User;
import com.ojas_backend.repository.AuctionItemRepository;
import com.ojas_backend.repository.BidRepository;
import com.ojas_backend.service.BidService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class BidServiceImp implements BidService {

    @Autowired
    private final BidRepository bidRepository;
    @Autowired
    private final AuctionItemRepository auctionItemRepository;

    public BidServiceImp(BidRepository bidRepository, AuctionItemRepository auctionItemRepository) {
        this.bidRepository = bidRepository;
        this.auctionItemRepository = auctionItemRepository;
    }

    @Override
    public Bid placeBid(Long itemId, Double amount, User user) {
        AuctionItem item = auctionItemRepository.findById(itemId).orElse(null);
        if (item == null) return null;
        if (!"Active".equalsIgnoreCase(item.getStatus())) return null;
        if (amount == null) return null;

        Double current = item.getCurrentHighestBid();
        if (current == null) current = item.getStartingPrice();
        if (current == null) current = 0.0;

        if (amount <= current) {
            return null;
        }

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setBidder(user);
        bid.setItem(item);

        item.setCurrentHighestBid(amount);
        auctionItemRepository.save(item);
        return bidRepository.save(bid);
    }
}


