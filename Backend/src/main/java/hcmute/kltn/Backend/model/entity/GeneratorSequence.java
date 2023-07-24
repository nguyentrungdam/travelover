package hcmute.kltn.Backend.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Generator_Sequence")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeneratorSequence {
	@Id
	@SequenceGenerator(name = "Generator_Id_Sequence", sequenceName = "Generator_Id_Sequence", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Generator_Id_Sequence")
	@JsonProperty(access = Access.READ_ONLY)
	private long id;
	@Column(nullable = false, unique = true)
	private String tableName;
	@Column(nullable = false, unique = true)
	private String prefix;
	@Column(nullable = false)
	private int number; // Nhớ chỉnh thành kiểu long
	private String description;
}
