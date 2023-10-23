//package hcmute.kltn.Backend.repository;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import hcmute.kltn.Backend.model.entity.Image;
//
//public interface ImageRepository extends JpaRepository<Image, String>{
//	boolean existsByPublicId(String publicId);
//	boolean existsByUrl(String url);
//	List<Image> findAllByPublicId(String publicId);
//	List<Image> findAllByUrl(String url);
//}
