package hcmute.kltn.Backend.model.base.image.service;

import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.base.image.dto.Image;

public interface IImageService {
	public Image createImage(MultipartFile file);
	public Image getImageDetail(String imageId);
	public boolean deleteImage(String imageId);
	public boolean deleteImageByUrl(String imageUrl);
}