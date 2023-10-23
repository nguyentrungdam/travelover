//package hcmute.kltn.Backend.service.impl;
//
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
//
//import javax.persistence.Table;
//
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import hcmute.kltn.Backend.component.CloudinaryUtil;
//import hcmute.kltn.Backend.exception.CustomException;
//import hcmute.kltn.Backend.model.dto.ImageDTO;
//import hcmute.kltn.Backend.model.entity.Image;
//import hcmute.kltn.Backend.repository.ImageRepository;
//import hcmute.kltn.Backend.service.AccountDetailsService;
//import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
//import hcmute.kltn.Backend.service.intf.IImageService;
//import hcmute.kltn.Backend.util.DateUtil;
//
//@Service
//public class ImageService implements IImageService{
//	@Autowired
//	private CloudinaryUtil cloudinaryUtil;
//	@Autowired
//	private ImageRepository imageRepository;
//	@Autowired
//	private IGeneratorSequenceService iGeneratorSequenceService;
//	@Autowired
//	private AccountDetailsService accountDetailsService;
//	@Autowired
//	private ModelMapper modelMapper;
//	
//	private String tableName = Image.class.getAnnotation(Table.class).name();
//	
//	@Override
//	public Image createImage(String tableName, MultipartFile file) {
//		String folder = "Travelover/" + tableName;
//		Map<?, ?> result = cloudinaryUtil.create(folder, file);
//		
//		ImageDTO imageDTO = new ImageDTO();
//		imageDTO.setPublicId(result.get("public_id").toString());
//		imageDTO.setUrl(result.get("url").toString());
//		
//		return create(imageDTO);
//	}
//
//	@Override
//	public Image updateImage(ImageDTO imageDTO, MultipartFile file) {
//		Map<?, ?> result = cloudinaryUtil.update(imageDTO.getPublicId(), file);
//		
//		imageDTO.setUrl(result.get("url").toString());
//
//		return update(imageDTO);
//	}
//
//	@Override
//	public boolean deleteImage(String publicId) {
//		boolean delete = cloudinaryUtil.delete(publicId);
//		if (!delete) {
//			throw new CustomException("Failed to delete Image");
//		}
//		
//		return true;
//	}
//
//	@Override
//	public Image create(ImageDTO imageDTO) {
//		// Check exists
//		boolean existsPublicId = imageRepository.existsByPublicId(imageDTO.getPublicId());
//		if (existsPublicId) {
//			throw new CustomException("Public Id is already");
//		}
//		
//		boolean existsUrl = imageRepository.existsByUrl(imageDTO.getUrl());
//		if (existsUrl) {
//			throw new CustomException("Url is already");
//		}
//		
//		// Mapping
//		Image image = new Image();
//		modelMapper.map(imageDTO, image);
//		
//		// Set default value
//		String imageId = iGeneratorSequenceService.genId(tableName);
//		String accountId = accountDetailsService.getCurrentAccount().getAccountId();
//		Date dateNow = DateUtil.getDateNow();
//		image.setImageId(imageId);
//		image.setStatus(true);
//		image.setCreatedBy(accountId);
//		image.setCreatedAt(dateNow);
//		image.setLastModifiedBy(accountId);
//		image.setLastModifiedAt(dateNow);
//
//		image = imageRepository.save(image);
//		
//		return image;
//	}
//
//	@Override
//	public Image update(ImageDTO imageDTO) {
//		// Check exists
//		boolean exists = imageRepository.existsById(imageDTO.getImageId());
//		if (!exists) {
//			throw new CustomException("Cannot find image");
//		}
//		
//		// Mapping
//		Image image = imageRepository.findById(imageDTO.getImageId()).get();
//		modelMapper.map(imageDTO, image);
//		
//		// Check already
//		List<Image> listByPublicId = imageRepository.findAllByPublicId(image.getPublicId());
//		for (Image item : listByPublicId) {
//			if (item.getPublicId() == image.getPublicId() && item.getImageId() != image.getImageId()) {
//				throw new CustomException("Public Id is already");
//			}
//		}
//		
//		List<Image> listByUrl = imageRepository.findAllByUrl(image.getUrl());
//		for (Image item : listByUrl) {
//			if (item.getUrl() == image.getUrl() && item.getImageId() != image.getImageId()) {
//				throw new CustomException("Url is allready");
//			}
//		}
//		
//		// Set default value
//		String accountId = accountDetailsService.getCurrentAccount().getAccountId();
//		image.setLastModifiedBy(accountId);
//		image.setLastModifiedAt(DateUtil.getDateNow());
//
//		image = imageRepository.save(image);
//		
//		return image;
//	}
//
//	@Override
//	public Image getDetail(String imageId) {
//		boolean exists = imageRepository.existsById(imageId);
//		if (!exists) {
//			throw new CustomException("Cannot find image");
//		}
//		
//		Image findImage = imageRepository.findById(imageId).get();
//		
//		return findImage;
//	}
//
//	@Override
//	public List<Image> getAll() {
//		List<Image> list = imageRepository.findAll();
//		
//		return list;
//	}
//
//	@Override
//	public boolean delete(String imageId) {
//		boolean exists = imageRepository.existsById(imageId);
//		if (!exists) {
//			throw new CustomException("Cannot find image");
//		}
//		
//		imageRepository.deleteById(imageId);
//		
//		return true;
//	}
//}
