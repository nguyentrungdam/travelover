package hcmute.kltn.Backend.model.z_enterprise.hotel.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.entity.Hotel;

public interface HotelRepository extends MongoRepository<Hotel, String>{

}
