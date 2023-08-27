package hcmute.kltn.Backend.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

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
	@Column(name = "Id")
	@SequenceGenerator(name = "Generator_Id_Sequence", sequenceName = "Generator_Id_Sequence", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Generator_Id_Sequence")
	private long id;
	@Column(name = "Table_Name", nullable = false, unique = true)
	private String tableName;
	@Column(name = "Prefix", nullable = false, unique = true)
	private String prefix;
	@Column(name = "Number",nullable = false)
	private long number; 
	@Column(name = "Description", nullable = false)
	private String description;
}
