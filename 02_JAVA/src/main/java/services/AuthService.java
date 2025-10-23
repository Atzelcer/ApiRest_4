package services;

import models.Usuario;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class AuthService {
    private static final String BASE_URL = "http://localhost:8000/api";
    private static String token = null;

    public static String login(Usuario usuario) throws Exception {
        URL url = new URL(BASE_URL + "/login");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        JSONObject jsonInput = new JSONObject();
        jsonInput.put("email", usuario.getEmail());
        jsonInput.put("password", usuario.getPassword());

        OutputStream os = conn.getOutputStream();
        os.write(jsonInput.toString().getBytes());
        os.flush();
        os.close();

        int responseCode = conn.getResponseCode();

        if (responseCode == 200) {
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONObject jsonResponse = new JSONObject(response.toString());
            token = jsonResponse.getString("token");
            return token;
        } else {
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            throw new Exception("Error de autenticación: " + response.toString());
        }
    }

    public static String getToken() {
        return token;
    }

    public static void logout() {
        token = null;
    }

    public static boolean isAuthenticated() {
        return token != null;
    }
}