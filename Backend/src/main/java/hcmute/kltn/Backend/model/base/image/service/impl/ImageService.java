package hcmute.kltn.Backend.model.base.image.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.dto.entity.Account;
import hcmute.kltn.Backend.model.base.image.dto.Image;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;

@Service
public class ImageService implements IImageService{
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
    private MongoTemplate mongoTemplate;
	
	@Value("${file.image.upload-dir}")
    private String uploadDir;

    public String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Account.class);
        return collectionName;
    }

	@Override
	public Image create(MultipartFile file) {
		Image image = new Image();
		// Kiểm tra xem hình ảnh có hợp lệ hay không
        if (file.isEmpty()) {
            throw new CustomException("File is empty");
        }

        // Lưu hình ảnh vào thư mục lưu trữ
        try {
        	String fileName = file.getOriginalFilename();
            File fileSave = new File(System.getProperty("user.dir") + "/" + uploadDir +"/" + fileName);
            file.transferTo(fileSave);
        } catch(IOException e) {
        	throw new CustomException("Upload failed: " + e.getMessage());
        }

        
        image.setUrl(file.getName());
        // Trả về thông báo thành công
        return image;
	}

	@Override
	public Image update(Image image) {
//		Image image = new Image();
		return image;
	}

	@Override
	public Image getDetail(String imageId) {
		Image image = new Image();
		
		return image;
	}

	@Override
	public List<Image> getAll() {
		List<Image> list = new ArrayList();
		
		return list;
	}

	@Override
	public boolean delete(String imageId) {
		
		return true;
	}
	
	@Override
	public Image createImage(String tableName, MultipartFile file) {
		Image image = new Image();
		
		return image;
	}

	@Override
	public Image updateImage(Image image, MultipartFile file) {
//		Image image = new Image();
		
		return image;
	}

	@Override
	public boolean deleteImage(String publicId) {
		
		return true;
	}
}