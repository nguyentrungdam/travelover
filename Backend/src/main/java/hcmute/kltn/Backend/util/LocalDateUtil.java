package hcmute.kltn.Backend.util;

import java.time.LocalDate;
import java.time.ZoneId;

public class LocalDateUtil {
	public static LocalDate getDateNow() {
		ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
		LocalDate dateNow = LocalDate.now(vietnamZone);
		
		return dateNow;
	}
}
