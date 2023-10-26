package hcmute.kltn.Backend.model.base.image.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.base.image.dto.Image;

public interface IImageService {
	public Image create(MultipartFile file);
	public Image update(Image image);
	public Image getDetail(String imageId);
	public List<Image> getAll();
	public boolean delete(String imageId);
	
	public Image createImage(String tableName, MultipartFile file);
	public Image updateImage(Image image, MultipartFile file);
	public boolean deleteImage(String public_id);
}