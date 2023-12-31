package hcmute.kltn.Backend.model.z_enterprise.eVehicle.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.exception.TryCatchException;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.z_enterprise.eVehicle.dto.EVehicleDTO;
import hcmute.kltn.Backend.model.z_enterprise.eVehicle.dto.entity.EVehicle;
import hcmute.kltn.Backend.model.z_enterprise.eVehicle.repository.EVehicleRepository;
import hcmute.kltn.Backend.model.z_enterprise.eVehicle.service.IEVehicleService;
import hcmute.kltn.Backend.util.EntityUtil;
import hcmute.kltn.Backend.util.LocalDateTimeUtil;
import hcmute.kltn.Backend.util.StringUtil;

@Service
public class EVehicleService implements IEVehicleService{
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private IAccountDetailService iAccountDetailService;
	@Autowired
	private EVehicleRepository eVehicleRepository;
	
	private void checkFieldCondition(EVehicle eVehicle) {
		// check null
		if(eVehicle.getEVehicleName() == null || eVehicle.getEVehicleName().equals("")) {
			throw new CustomException("Enterprise Vehicle Name is not null");
		}
		if(eVehicle.getAddress() == null) {
			throw new CustomException("Address is not null");
		}
		if(eVehicle.getPhoneNumber() == null || eVehicle.getPhoneNumber().equals("")) {
			throw new CustomException("Phone number is not null");
		}
		if(eVehicle.getNumberOfStarRating() < 1 || eVehicle.getNumberOfStarRating() > 5) {
			throw new CustomException("Number Of Star Rating must be between 1 and 5");
		}
		
		// check unique
	}
	
	private EVehicle create(EVehicle eVehicle) {
		// check field condition
		checkFieldCondition(eVehicle);
    	
		// Set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();

		eVehicle.setStatus(true);
		eVehicle.setCreatedBy(accountId);
		eVehicle.setCreatedAt2(currentDate);
		eVehicle.setLastModifiedBy(accountId);
		eVehicle.setLastModifiedAt2(currentDate);
		
		// create discount
		EVehicle eVehicleNew = new EVehicle();
		eVehicleNew = eVehicleRepository.save(eVehicle);
		
		return eVehicleNew;
	}

	private EVehicle update(EVehicle eVehicle) {
    	// Check exists
		if (!eVehicleRepository.existsById(eVehicle.getEVehicleId())) {
			throw new CustomException("Cannot find Enterprise Vehicle");
		}
		
		// check field condition
		checkFieldCondition(eVehicle);
    	
    	// Set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		eVehicle.setLastModifiedBy(accountId);
		eVehicle.setLastModifiedAt2(currentDate);
		
		// update discount
		EVehicle eVehicleNew = new EVehicle();
		eVehicleNew = eVehicleRepository.save(eVehicle);
		
		return eVehicleNew;
    }
	
	private EVehicle getDetail(String eVehicleId) {
		// Check exists
		if (!eVehicleRepository.existsById(eVehicleId)) {
			throw new CustomException("Cannot find Enterprise Vehicle");
		}
		
		// Find discount
		EVehicle eVehicle = eVehicleRepository.findById(eVehicleId).get();
		
		return eVehicle;
	}
	
	private List<EVehicle> getAll() {
		// Find discount
		List<EVehicle> list = eVehicleRepository.findAll();
		
		return list;
	}
	
	private void delete(String eVehicleId) {
		// Check exists
		if (eVehicleRepository.existsById(eVehicleId)) {
			eVehicleRepository.deleteById(eVehicleId);
		}
	}
	
	private List<EVehicle> search(String keyword) {
		// init tour List
		List<EVehicle> eVehicleList = new ArrayList<>();
		eVehicleList = eVehicleRepository.findAll();
		if (keyword != null) {
			keyword = keyword.trim();
		}

		if (keyword != null && !keyword.isEmpty()) {
			if (eVehicleList != null) {
				List<EVehicle> eVehicleListClone = new ArrayList<>();
				eVehicleListClone.addAll(eVehicleList);
				for (EVehicle itemEVehicle : eVehicleListClone) {
					String keywordNew = StringUtil.getNormalAlphabet(keyword);
					String allValue = "";
					try {
						allValue = EntityUtil.getAllValue(itemEVehicle);
					} catch (Exception e) {
						throw new TryCatchException(e);
					}
					String fieldNew = StringUtil.getNormalAlphabet(allValue);
					
					System.out.println("\nfieldNew = " + fieldNew + " ");
					
					if (!fieldNew.contains(keywordNew)) {
						eVehicleList.remove(itemEVehicle);
						if (eVehicleList.size() <= 0) {
							break;
						}
					}
				}
			}
		}

		return eVehicleList;
	}
	
	private EVehicleDTO getEVehicleDTO(EVehicle eVehicle) {
		// mapping discountDTO
		EVehicleDTO eVehicleDTONew = new EVehicleDTO();
		modelMapper.map(eVehicle, eVehicleDTONew);
		
		return eVehicleDTONew;
	}
	
	private List<EVehicleDTO> getEVehicleDTOList(List<EVehicle> eVehicleList) {
		List<EVehicleDTO> eVehicleDTOList = new ArrayList<>();
		for (EVehicle itemEVehicle : eVehicleList) {
			eVehicleDTOList.add(getEVehicleDTO(itemEVehicle));
		}
		return eVehicleDTOList;
	}

	
	@Override
	public EVehicleDTO createEVehicle(EVehicleDTO eVehicleDTO) {
		// mapping discount
		EVehicle eVehicle = new EVehicle();
		modelMapper.map(eVehicleDTO, eVehicle);
		
		// check field condition
		checkFieldCondition(eVehicle);

		// create discount
		EVehicle eVehicleNew = new EVehicle();
		eVehicleNew = create(eVehicle);
		
		return getEVehicleDTO(eVehicleNew);
	}
	

	@Override
	public EVehicleDTO updateEVehicle(EVehicleDTO eVehicleDTO) {
		// get discount from database
		EVehicle eVehicle = getDetail(eVehicleDTO.getEVehicleId());
		
		// mapping discount
		int numberOfStarRating = eVehicle.getNumberOfStarRating();
		modelMapper.map(eVehicleDTO, eVehicle);
		eVehicle.setNumberOfStarRating(numberOfStarRating);
		
		// update discount
		EVehicle eVehicleNew = new EVehicle();
		eVehicleNew = update(eVehicle);
		
		return getEVehicleDTO(eVehicleNew);
	}
	

	@Override
	public EVehicleDTO getDetailEVehicle(String eVehicleId) {
		EVehicle eVehicle = getDetail(eVehicleId);

		return getEVehicleDTO(eVehicle);
	}
	

	@Override
	public List<EVehicleDTO> getAllEVehicle() {
		List<EVehicle> eVehicleList = new ArrayList<>(getAll());

		return getEVehicleDTOList(eVehicleList);
	}
	

	@Override
	public List<EVehicleDTO> searchEVehicle(String keyword) {
		List<EVehicle> eVehicleList = search(keyword);

		return getEVehicleDTOList(eVehicleList);
	}

}
