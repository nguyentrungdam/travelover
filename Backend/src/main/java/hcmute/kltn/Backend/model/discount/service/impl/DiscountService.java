package hcmute.kltn.Backend.model.discount.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.discount.dto.DiscountCreate;
import hcmute.kltn.Backend.model.discount.dto.DiscountDTO;
import hcmute.kltn.Backend.model.discount.dto.DiscountUpdate;
import hcmute.kltn.Backend.model.discount.dto.entity.Discount;
import hcmute.kltn.Backend.model.discount.repository.DiscountRepository;
import hcmute.kltn.Backend.model.discount.service.IDiscountService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.util.LocalDateUtil;
import hcmute.kltn.Backend.util.StringUtil;

@Service
public class DiscountService implements IDiscountService{
	@Autowired
	private DiscountRepository discountRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private IAccountDetailService iAccountDetailService;
	@Autowired
    private MongoTemplate mongoTemplate;
	@Autowired
	private IImageService iImageService;
	
	private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Discount.class);
        return collectionName;
    }
	
	private void checkFieldCondition(Discount discount) {
		LocalDate currentDate = LocalDateUtil.getDateNow();
		
		// check null
		if(discount.getDiscountTitle() == null || discount.getDiscountTitle().equals("")) {
			throw new CustomException("Title is not null");
		}
		if(discount.getDiscountCode() == null || discount.getDiscountCode().equals("")) {
			throw new CustomException("Discount Code is not null");
		}
		if(discount.getDiscountValue() <= 0) {
			throw new CustomException("Discount Value must be greater than 0");
		}
		if(discount.getStartDate() == null || discount.getStartDate().isBefore(currentDate)) {
			throw new CustomException("Start Date must be greater or equal than current date");
		}
		if(discount.getEndDate() == null || discount.getEndDate().isBefore(discount.getStartDate())) {
			throw new CustomException("End Date must be greater or equal than start date");
		}
		if(discount.getMinOrder() < 0) {
			throw new CustomException("Minium order must be greater or equal than 0");
		}
		if(discount.getMaxDiscount() <= 0) {
			throw new CustomException("Maxium order must be greater than 0");
		}
		if(discount.getIsQuantityLimit() == true) {
			if(discount.getNumberOfCode() <= 0) {
				
				throw new CustomException("Number Of Code must be greater than 0");
			}
		}
		
		// check unique
		if(discount.getDiscountId() == null || discount.getDiscountId().equals("")) {
			if(discountRepository.existsByDiscountCode(discount.getDiscountCode().trim())) {
				throw new CustomException("Discount code is already");
			}
		} else {
			Discount discountFind = discountRepository.findById(discount.getDiscountId()).get();
			List<Discount> discountCodeList = discountRepository.findAllByDiscountCode(discount.getDiscountId());
			for(Discount itemDiscount : discountCodeList) {
				if (itemDiscount.getDiscountCode() == discountFind.getDiscountCode() 
						&& itemDiscount.getDiscountId() != discountFind.getDiscountId()) {
					throw new CustomException("Discount code is already");
				}
			}
		}
	}
	
	private Discount create(Discount discount) {
		// check field condition
		checkFieldCondition(discount);
    	
		// Set default value
		String discountId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate currentDate = LocalDateUtil.getDateNow();
		
		discount.setDiscountId(discountId);
		discount.setStatus(true);
		discount.setCreatedBy(accountId);
		discount.setCreatedAt(currentDate);
		discount.setLastModifiedBy(accountId);
		discount.setLastModifiedAt(currentDate);
		
		// create discount
		Discount discountNew = new Discount();
		discountNew = discountRepository.save(discount);
		
		return discountNew;
	}
	
	private Discount update(Discount discount) {
    	// Check exists
		if (!discountRepository.existsById(discount.getDiscountId())) {
			throw new CustomException("Cannot find discount");
		}
		
		// check field condition
		checkFieldCondition(discount);
    	
    	// Set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate currentDate = LocalDateUtil.getDateNow();
		discount.setLastModifiedBy(accountId);
		discount.setLastModifiedAt(currentDate);
		
		// update discount
		Discount discountNew = new Discount();
		discountNew = discountRepository.save(discount);
		
		return discountNew;
    }
	
	private Discount getDetail(String discountId) {
		// Check exists
		if (!discountRepository.existsById(discountId)) {
			throw new CustomException("Cannot find discount");
		}
		
		// Find discount
		Discount discount = discountRepository.findById(discountId).get();
		
		return discount;
	}
	
	private List<Discount> getAll() {
		// Find discount
		List<Discount> list = discountRepository.findAll();
		
		return list;
	}
	
	private void delete(String discountId) {
		// Check exists
		if (discountRepository.existsById(discountId)) {
			discountRepository.deleteById(discountId);
		}
	}
	
	private String genDiscountCode() {
		List<Discount> discountList = new ArrayList<>(getAll());
		
		String discountCode = new String();
		boolean checkExists = true;
		while (checkExists == true) {
			checkExists = false;
			discountCode = StringUtil.genRandom(10);
			for (Discount itemDiscount : discountList) {
				if (itemDiscount.getDiscountCode().equals(discountCode)) {
					checkExists = true;
				}
			}
		}
		
		return discountCode;
	}
	
	private List<Discount> search(String keyword) {
		// init discount List
		List<Discount> discountList = new ArrayList<>();
		
		if(keyword == null || keyword.trim().isEmpty()) {
			discountList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : Discount.class.getDeclaredFields()) {
				 if (itemField.getType() == String.class) {
					 criteriaList.add(Criteria.where(itemField.getName()).regex(keyword, "i"));
				 } 
	    	}
			criteriaList.add(Criteria.where("_id").is(keyword));

			// create criteria
			Criteria criteria = new Criteria();
	        criteria.orOperator(criteriaList.toArray(new Criteria[0]));
	        
	        // create query
	        Query query = new Query();
	        query.addCriteria(criteria);
			
			// search
	        discountList = mongoTemplate.find(query, Discount.class);
		}
		
		return discountList;
	}
	
	private DiscountDTO getDiscountDTO(Discount discount) {
		// mapping discountDTO
		DiscountDTO discountDTONew = new DiscountDTO();
		modelMapper.map(discount, discountDTONew);
		
		return discountDTONew;
	}
	
	private List<DiscountDTO> getDiscountDTOList(List<Discount> discountList) {
		List<DiscountDTO> discountDTOList = new ArrayList<>();
		for (Discount itemDiscount : discountList) {
			discountDTOList.add(getDiscountDTO(itemDiscount));
		}
		return discountDTOList;
	}

	@Override
	public DiscountDTO createDiscount(DiscountCreate discountCreate) {
		// mapping discount
		Discount discount = new Discount();
		modelMapper.map(discountCreate, discount);
		
		// gen discountCode
		String discountCode = genDiscountCode();
		discount.setDiscountCode(discountCode);
		
		// check field condition
		checkFieldCondition(discount);

		// create discount
		Discount discountNew = new Discount();
		discountNew = create(discount);
		
		return getDiscountDTO(discountNew);
	}

	@Override
	public DiscountDTO updateDiscount(DiscountUpdate discountUpdate) {
		// get discount from database
		Discount discount = getDetail(discountUpdate.getDiscountId());
		
		// check image and delete
		if ((discount.getImageUrl() != null 
				&& !discount.getImageUrl().equals(""))
				&& !discount.getImageUrl().equals(discountUpdate.getImageUrl())) {
			boolean checkDelete = iImageService.deleteImageByUrl(discount.getImageUrl());
			if (checkDelete == false) {
				throw new CustomException("An error occurred during the processing of the old image");
			}
		}
		
		// mapping discount
		modelMapper.map(discountUpdate, discount);
		
		// update discount
		Discount discountNew = new Discount();
		discountNew = update(discount);
		
		return getDiscountDTO(discountNew);
	}

	@Override
	public DiscountDTO getDetailDiscount(String discountId) {
		Discount discount = getDetail(discountId);

		return getDiscountDTO(discount);
	}

	@Override
	public List<DiscountDTO> getAllDiscount() {
		List<Discount> discountList = new ArrayList<>(getAll());

		return getDiscountDTOList(discountList);
	}

	@Override
	public List<DiscountDTO> searchDiscount(String keyword) {
		// search account with keyword
		List<Discount> discountList = search(keyword);

		return getDiscountDTOList(discountList);
	}

	@Override
	public DiscountDTO getDiscountByCode(String discountCode) {
		// Check exists
		if (!discountRepository.existsByDiscountCode(discountCode)) {
			throw new CustomException("Cannot find discount");
		}
		
		// Find discount
		Discount discount = discountRepository.findByDiscountCode(discountCode).get();
		
		return getDiscountDTO(discount);
	}

}
