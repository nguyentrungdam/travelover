package hcmute.kltn.Backend.model.base.video.service.impl;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.exception.TryCatchException;
import hcmute.kltn.Backend.model.base.video.dto.Video;
import hcmute.kltn.Backend.model.base.video.service.IVideoService;

@Service
public class VideoService implements IVideoService{
	@Value("${file.video.upload-dir}")
    private String uploadDir;
	@Value("${backend.dev.domain}")
    private String backendDomain;
	
	private void checkFieldCondition(MultipartFile file) {
    	// check null file
        if (file.isEmpty()) {
            throw new CustomException("File is empty");
        }
        
        // check file type
        String contentType = file.getContentType();
        System.out.println("contentType = " + contentType);
        if (!contentType.startsWith("video/mp4")) {
            throw new CustomException("Video files must have the extension of .mp4");
        }
        
        // check file size
//        long sizeByte = file.getSize();
//        float sizeKB = sizeByte / 1024;
//        float sizeMB = sizeKB / 1024;
//		if (sizeMB > 2.1f) {
//			throw new CustomException("File size cannot be larger than 2MB");
//		}
    }
	
	private void saveVideo(MultipartFile file, String path) {
//    	long sizeByte = image.getSize();
//    	float sizeKB = sizeByte / 1024;
//    	
//    	float quality = 1;
//    	if (sizeKB > 512) {
//    		quality = 512 / sizeKB;
//    	}
    	try {
    		byte[] videoBytes = file.getBytes();
    		Path pathNew = Paths.get(path);
    		if (!Files.exists(pathNew.getParent())) {
                Files.createDirectories(pathNew.getParent());
            }
    		Files.write(pathNew, videoBytes);
    	} catch (Exception e) {
    		throw new TryCatchException(e);
		}
    }

	@Override
	public Video createVideo(MultipartFile file) {
		// check field condition
		checkFieldCondition(file);
				
		System.out.println("file name = " + file.getOriginalFilename());
		String fileName = file.getOriginalFilename();
    	String[] fileNameSplit = fileName.split("\\.");
    	String fileNameExtension = fileNameSplit[fileNameSplit.length - 1];
		String videoId = UUID.randomUUID().toString();
		String fileNameNew = videoId + "." + fileNameExtension;
		
		String path = System.getProperty("user.dir") + "/" + uploadDir +"/" + fileNameNew;
		saveVideo(file, path);
		
		Video video = new Video();
		video.setVideoId(videoId);
		String url = backendDomain + "/videos/play/" + fileNameNew;
		video.setUrl(url);
		
		return video;
	}

	@Override
	public UrlResource getVideo(String videoName) {
		try {
			String path = System.getProperty("user.dir") + "/" + uploadDir +"/" + videoName;
			Path pathNew = Paths.get(path);
			UrlResource video = new UrlResource(pathNew.toUri());
			return video;
		} catch (Exception e) {
			throw new TryCatchException(e);
		}
	}

}
