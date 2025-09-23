package com.ojas_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                     // column: id (PK)

    private Double amount;               // column: amount

    @ManyToOne
    private User bidder;                 // column: bidder_id (FK to users.id)

    @ManyToOne
    private AuctionItem item;            // column: item_id (FK to auction_items.id)

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public void setBidder(User user) {
		// TODO Auto-generated method stub
		
	}

	public void setItem(AuctionItem item2) {
		// TODO Auto-generated method stub
		
	}
}
