package hcmute.kltn.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmute.kltn.Backend.model.entity.Tour;

public interface TourRepository extends JpaRepository<Tour, String>{
	
}
