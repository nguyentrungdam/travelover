package hcmute.kltn.Backend.service.intf;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.dto.ImageDTO;
import hcmute.kltn.Backend.model.entity.Image;

public interface IImageService {
	public Image create(ImageDTO imageDTO);
	public Image update(ImageDTO imageDTO);
	public Image getDetail(String imageId);
	public List<Image> getAll();
	public boolean delete(String imageId);
	
	public Image createImage(String tableName, MultipartFile file);
	public Image updateImage(ImageDTO imageDTO, MultipartFile file);
	public boolean deleteImage(String public_id);
}
