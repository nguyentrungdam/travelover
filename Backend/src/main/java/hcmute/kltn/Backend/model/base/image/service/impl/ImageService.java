package hcmute.kltn.Backend.model.base.image.service.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.io.InputStream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.base.image.dto.Image;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;

@Service
public class ImageService implements IImageService{
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
    private MongoTemplate mongoTemplate;
	@Autowired
    private IAccountService iAccountService;
	
	@Value("${file.image.upload-dir}")
    private String uploadDir;
	@Value("${server.port}")
    private String portServer;

    private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Image.class);
        return collectionName;
    }
    
    private void checkFieldCondition(MultipartFile file) {
    	// check null file
        if (file.isEmpty()) {
            throw new CustomException("File is empty");
        }
        
        // check file type
        String contentType = file.getContentType();
        if (!contentType.startsWith("image/")) {
            throw new CustomException("File is not an image type");
        }
        
        // check file size
        long sizeByte = file.getSize();
        float sizeKB = sizeByte / 1024;
        float sizeMB = sizeKB / 1024;
		if (sizeMB > 2.1f) {
			throw new CustomException("File size cannot be larger than 2MB");
		}
    }
    
    private byte[] compressImage(MultipartFile image, float quality) {
    	try {
    		InputStream inputStream = image.getInputStream();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            // Create the buffered image
            BufferedImage bufferedImage = ImageIO.read(inputStream);

            // Get image writers
            Iterator<ImageWriter> imageWriters = ImageIO.getImageWritersByFormatName("jpg"); // Input your Format Name here

            if (!imageWriters.hasNext())
                throw new IllegalStateException("Writers Not Found!!");

            ImageWriter imageWriter = imageWriters.next();
            ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(outputStream);
            imageWriter.setOutput(imageOutputStream);

            ImageWriteParam imageWriteParam = imageWriter.getDefaultWriteParam();

            // Set the compress quality metrics
            imageWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            imageWriteParam.setCompressionQuality(quality);

            // Compress and insert the image into the byte array.
            imageWriter.write(null, new IIOImage(bufferedImage, null, null), imageWriteParam);

            byte[] imageBytes = outputStream.toByteArray();

            // close all streams
            inputStream.close();
            outputStream.close();
            imageOutputStream.close();
            imageWriter.dispose();
            
            return imageBytes;
    	} catch (Exception e) {
			throw new CustomException("There was an error during file compression: " + e.getMessage());
		}
    }
    
    private void saveImage(MultipartFile image, String path) {
    	long sizeByte = image.getSize();
    	float sizeKB = sizeByte / 1024;
    	
    	float quality = 1;
    	if (sizeKB > 512) {
    		quality = 512 / sizeKB;
    	}
    	
    	byte[] imageBytes = compressImage(image, quality);
        
        Path pathNew = Paths.get(path);
        try {
        	Files.write(pathNew, imageBytes);
        } catch (Exception e) {
        	throw new CustomException("There was an error during file compression: " + e.getMessage());
		}
        
    }
    
    private File getImageFile(String fileName) {
    	File dir = new File(uploadDir);
		File[] fileList = dir.listFiles();
		String fileFullName = new String();

        for (File itemFile : fileList) {
        	if (itemFile.getName().startsWith(fileName)) {
        		return itemFile;
        	}
        }
        
        throw new CustomException("Cannot find image file");
    }

	private Image create(MultipartFile file) {
		Image image = new Image();
		
		// check field condition
		checkFieldCondition(file);

		String fileName = file.getOriginalFilename();
    	String[] fileNameSplit = fileName.split("\\.");
    	String fileNameExtension = fileNameSplit[fileNameSplit.length - 1];
    	String imageId = UUID.randomUUID().toString();
    	String fileNameNew = imageId + "." + fileNameExtension;

        String path = System.getProperty("user.dir") + "/" + uploadDir +"/" + fileNameNew;
        saveImage(file, path);
        
        image.setImageId(imageId);
        String url = "localhost:" + portServer + "/images/" +fileNameNew;
        image.setUrl(url);

        return image;
	}

	private Image update(Image image) {
//		Image image = new Image();
		return image;
	}

	private Image getDetail(String imageId) {
		File imageFile = getImageFile(imageId);
		
		Image image = new Image();
		String url = "localhost:" + portServer + "/images/" + imageFile.getName();
		image.setImageId(imageId);
		image.setUrl(url);
		
		return image;
	}

	private List<Image> getAll() {
		List<Image> list = new ArrayList();
		
		return list;
	}

	private boolean delete(String imageId) {
		// get image file
		File imageFile = getImageFile(imageId);

		// delete image file
		boolean checkDelete = false;
		checkDelete = imageFile.delete();
        if (checkDelete == false) {
        	throw new CustomException("An error occurred during image deletion");
        }
        
		return checkDelete;
	}
	
	@Override
	public Image createImage(MultipartFile file) {
		Image image = new Image();
		image = create(file);

		return image;
	}

	@Override
	public Image getImageDetail(String imageId) {
		Image image = new Image();
		image = getDetail(imageId);
		
		return image;
	}

	@Override
	public boolean deleteImage(String imageId) {
		boolean checkDelete = delete(imageId);
		
		return checkDelete;
	}
}