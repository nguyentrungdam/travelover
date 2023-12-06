package hcmute.kltn.Backend.model.discount.service;

import java.util.List;

import hcmute.kltn.Backend.model.discount.dto.DiscountCreate;
import hcmute.kltn.Backend.model.discount.dto.DiscountDTO;
import hcmute.kltn.Backend.model.discount.dto.DiscountUpdate;

public interface IDiscountService {
	public DiscountDTO createDiscount(DiscountCreate discountCreate);
	public DiscountDTO updateDiscount(DiscountUpdate discountUpdate);
	public DiscountDTO getDetailDiscount(String discountId);
	public DiscountDTO getDiscountByCode(String discountCode);
	public List<DiscountDTO> getAllDiscount();
	public List<DiscountDTO> searchDiscount(String keyword);
}
