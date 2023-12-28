package hcmute.kltn.Backend.util;

import java.lang.reflect.Field;
import java.util.List;

public class EntityUtil {
    public static void readFields(Object obj) throws IllegalAccessException {
        Class<?> objClass = obj.getClass();
        Field[] fields = objClass.getDeclaredFields();
        for (Field itemField : fields) {
        	itemField.setAccessible(true);
        	
            Object value = itemField.get(obj);
            if (value == null || value.toString().isEmpty()) {
            	continue;
            }
            boolean isPrimitive = itemField.getType().isPrimitive();
            boolean isJavaLang = itemField.getType().getName().startsWith("java.lang");
            boolean isList = itemField.getType().isAssignableFrom(List.class);
            System.out.print("CHECK Field name: " + itemField.getName()); 
            System.out.print(", Type name: " + itemField.getType().getName()); 
            System.out.println(", Field value: " + value); 
            if (!isPrimitive && !isJavaLang) {
            	readFields(value);
//            	continue;
            } else {
            	System.out.println("Field name: " + itemField.getName() + ", Field value: " + value); 
            }
        }
    }
}
