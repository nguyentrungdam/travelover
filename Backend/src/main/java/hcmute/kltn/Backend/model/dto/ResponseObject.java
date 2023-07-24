package hcmute.kltn.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseObject {
	private String status;
    private String message;
    private int totalPages;
    private int currentpage;
    private int countData;
    private Object data;
}
