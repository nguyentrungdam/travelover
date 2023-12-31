package hcmute.kltn.Backend.model.z_enterprise.eVehicle.service;

import java.util.List;

import hcmute.kltn.Backend.model.z_enterprise.eVehicle.dto.EVehicleDTO;

public interface IEVehicleService {
	public EVehicleDTO createEVehicle(EVehicleDTO eVehicleDTO);
	public EVehicleDTO updateEVehicle(EVehicleDTO eVehicleDTO);
	public EVehicleDTO getDetailEVehicle(String eVehicleId);
	
	public List<EVehicleDTO> getAllEVehicle();
	public List<EVehicleDTO> searchEVehicle(String keyword);
}
