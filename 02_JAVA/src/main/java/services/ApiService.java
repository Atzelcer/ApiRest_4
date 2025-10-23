package services;

import models.Persona;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class ApiService {
    private static final String BASE_URL = "http://localhost:8000/api";

    public static List<Persona> obtenerPersonas() throws Exception {
        URL url = new URL(BASE_URL + "/personas");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + AuthService.getToken());

        int responseCode = conn.getResponseCode();

        if (responseCode == 200) {
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONArray jsonArray = new JSONArray(response.toString());
            List<Persona> personas = new ArrayList<>();

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                Persona persona = new Persona();
                persona.setId(obj.getInt("id"));
                persona.setNombres(obj.getString("nombres"));
                persona.setApellidos(obj.getString("apellidos"));
                persona.setCi(obj.getString("ci"));
                persona.setDireccion(obj.getString("direccion"));
                persona.setTelefono(obj.getString("telefono"));
                persona.setEmail(obj.getString("email"));
                personas.add(persona);
            }

            return personas;
        } else {
            throw new Exception("Error al obtener personas");
        }
    }

    public static Persona crearPersona(Persona persona) throws Exception {
        URL url = new URL(BASE_URL + "/personas");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + AuthService.getToken());
        conn.setDoOutput(true);

        JSONObject jsonInput = new JSONObject();
        jsonInput.put("nombres", persona.getNombres());
        jsonInput.put("apellidos", persona.getApellidos());
        jsonInput.put("ci", persona.getCi());
        jsonInput.put("direccion", persona.getDireccion());
        jsonInput.put("telefono", persona.getTelefono());
        jsonInput.put("email", persona.getEmail());

        OutputStream os = conn.getOutputStream();
        os.write(jsonInput.toString().getBytes());
        os.flush();
        os.close();

        int responseCode = conn.getResponseCode();

        if (responseCode == 201) {
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONObject jsonResponse = new JSONObject(response.toString());
            persona.setId(jsonResponse.getInt("id"));
            return persona;
        } else {
            throw new Exception("Error al crear persona");
        }
    }

    public static void actualizarPersona(Persona persona) throws Exception {
        URL url = new URL(BASE_URL + "/personas/" + persona.getId());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("PUT");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + AuthService.getToken());
        conn.setDoOutput(true);

        JSONObject jsonInput = new JSONObject();
        jsonInput.put("nombres", persona.getNombres());
        jsonInput.put("apellidos", persona.getApellidos());
        jsonInput.put("ci", persona.getCi());
        jsonInput.put("direccion", persona.getDireccion());
        jsonInput.put("telefono", persona.getTelefono());
        jsonInput.put("email", persona.getEmail());

        OutputStream os = conn.getOutputStream();
        os.write(jsonInput.toString().getBytes());
        os.flush();
        os.close();

        int responseCode = conn.getResponseCode();

        if (responseCode != 200) {
            throw new Exception("Error al actualizar persona");
        }
    }

    public static void eliminarPersona(int id) throws Exception {
        URL url = new URL(BASE_URL + "/personas/" + id);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("DELETE");
        conn.setRequestProperty("Authorization", "Bearer " + AuthService.getToken());

        int responseCode = conn.getResponseCode();

        if (responseCode != 204 && responseCode != 200) {
            throw new Exception("Error al eliminar persona");
        }
    }
}