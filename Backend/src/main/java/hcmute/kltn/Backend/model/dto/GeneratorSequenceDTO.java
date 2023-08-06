package hcmute.kltn.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeneratorSequenceDTO {
	private long id;
	private String tableName;
	private String prefix;
	private long number; 
	private String description;
}
