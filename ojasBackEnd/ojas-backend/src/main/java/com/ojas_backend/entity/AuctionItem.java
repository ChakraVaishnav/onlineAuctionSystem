package com.ojas_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "auction_items")
public class AuctionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                     // column: id (PK)

    private String name;                 // column: name
    private String description;          // column: description
    private Double startingPrice;        // column: starting_price
    private Double currentHighestBid = 0.0; // column: current_highest_bid
    private String status = "Active";    // column: status (Active/Closed)

    @ManyToOne
    private User createdBy;              // column: created_by (FK to users.id)

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<Bid> bids;             // mapped column: not a separate column, bid table references this

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getStartingPrice() {
		return startingPrice;
	}

	public void setStartingPrice(Double startingPrice) {
		this.startingPrice = startingPrice;
	}

	public Double getCurrentHighestBid() {
		return currentHighestBid;
	}

	public void setCurrentHighestBid(Double currentHighestBid) {
		this.currentHighestBid = currentHighestBid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setCreatedBy(User user) {
		// TODO Auto-generated method stub
		
	}
}
