package hcmute.kltn.Backend.model.base.image.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.base.image.dto.Image;
import hcmute.kltn.Backend.model.base.image.dto.ImageCreate;

public interface IImageService {
	public Image createImage(MultipartFile file);
	public Image getImageDetail(String imageId);
	public boolean deleteImage(String imageId);
	public boolean deleteImageByUrl(String imageUrl);
}