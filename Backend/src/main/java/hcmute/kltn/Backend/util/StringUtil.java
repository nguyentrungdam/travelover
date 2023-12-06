package hcmute.kltn.Backend.util;

import java.util.Random;

public class StringUtil {
	public static String genRandom(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            sb.append(characters.charAt(rnd.nextInt(characters.length())));
        }

        return sb.toString();
	}
}
