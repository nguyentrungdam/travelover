package hcmute.kltn.Backend.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("generator_sequence")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeneratorSequence {
	@Id
	private String id;
	private String collectionName; // not null, unique
	private String prefix; // not null, unique
	private long number; // not null
	private String description;
}
