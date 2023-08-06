package hcmute.kltn.Backend.exception;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import hcmute.kltn.Backend.model.ResponseObject;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;

@ControllerAdvice
public class ExceptionHandlerController {
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	@ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseObject> handleCustomException(CustomException ex) {
		System.out.println(ex.getMessage());
    	return iResponseObjectService.failed(new ResponseObject() {
			{
				setMessage(ex.getMessage());
				setCountData(0);
			}
		});
    }
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseObject> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<String> errorMessages = bindingResult.getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        String error = errorMessages.toString();
        if (error.startsWith("[") && error.endsWith("]")) {
        	error = error.substring(1, error.length() - 1);
        }
        char firstChar = Character.toUpperCase(error.charAt(0));
        error = firstChar + error.substring(1);

        final String message = error;
        
        System.out.println(error);
        return iResponseObjectService.failed(new ResponseObject() {
			{
				setMessage(message);
				setCountData(0);
			}
		});
    }
	
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject> handleOtherException(Exception ex) {
    	ex.printStackTrace();

    	return iResponseObjectService.failed(new ResponseObject() {
			{
				setMessage(ex.getMessage());
				setCountData(0);
			}
		});
    }
}
