using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace ClientePersonas
{
    public class ApiClient
    {
        private readonly HttpClient client;
        private const string API_URL = "http://127.0.0.1:8000/api";
        private string token = null;

        public ApiClient()
        {
            client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        private void SetAuthToken()
        {
            if (!string.IsNullOrEmpty(token))
            {
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }
        }

        public async Task<JObject> Login(string email, string password)
        {
            try
            {
                var loginData = new { email, password };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(loginData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{API_URL}/login", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return JObject.Parse("{\"status\":\"error\",\"message\":\"Error de conexión con el servidor\"}");
                }

                var jsonResponse = JObject.Parse(responseString);

                if (jsonResponse["token"] != null)
                {
                    token = jsonResponse["token"].ToString();
                    SetAuthToken();
                    return JObject.Parse("{\"status\":\"success\",\"message\":\"Login exitoso\"}");
                }

                return JObject.Parse("{\"status\":\"error\",\"message\":\"Credenciales incorrectas\"}");
            }
            catch (HttpRequestException)
            {
                return JObject.Parse("{\"status\":\"error\",\"message\":\"No se puede conectar con el servidor. Asegúrate que Laravel esté corriendo en http://127.0.0.1:8000\"}");
            }
            catch (Exception ex)
            {
                return JObject.Parse($"{{\"status\":\"error\",\"message\":\"{ex.Message}\"}}");
            }
        }

        public async Task<JArray> ObtenerPersonas()
        {
            try
            {
                SetAuthToken();
                var response = await client.GetAsync($"{API_URL}/personas");
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Error HTTP {response.StatusCode}: {responseString}");
                }

                var jsonResponse = JObject.Parse(responseString);

                if (jsonResponse["data"] != null)
                {
                    var data = jsonResponse["data"];

                    if (data["data"] != null && data["data"] is JArray)
                    {
                        return (JArray)data["data"];
                    }

                    if (data is JArray)
                    {
                        return (JArray)data;
                    }
                }

                return new JArray();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener personas: {ex.Message}");
            }
        }

        public async Task<JObject> CrearPersona(string nombres, string apellidos, string ci, string direccion, string telefono, string email)
        {
            try
            {
                SetAuthToken();
                var personaData = new { nombres, apellidos, ci, direccion, telefono, email };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(personaData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{API_URL}/personas", content);
                var responseString = await response.Content.ReadAsStringAsync();
                return JObject.Parse(responseString);
            }
            catch (Exception ex)
            {
                return JObject.Parse($"{{\"success\":false,\"message\":\"{ex.Message}\"}}");
            }
        }

        public async Task<JObject> ActualizarPersona(int id, string nombres, string apellidos, string ci, string direccion, string telefono, string email)
        {
            try
            {
                SetAuthToken();
                var personaData = new { nombres, apellidos, ci, direccion, telefono, email };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(personaData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PutAsync($"{API_URL}/personas/{id}", content);
                var responseString = await response.Content.ReadAsStringAsync();
                return JObject.Parse(responseString);
            }
            catch (Exception ex)
            {
                return JObject.Parse($"{{\"success\":false,\"message\":\"{ex.Message}\"}}");
            }
        }

        public async Task<JObject> EliminarPersona(int id)
        {
            try
            {
                SetAuthToken();
                var response = await client.DeleteAsync($"{API_URL}/personas/{id}");
                var responseString = await response.Content.ReadAsStringAsync();
                return JObject.Parse(responseString);
            }
            catch (Exception ex)
            {
                return JObject.Parse($"{{\"success\":false,\"message\":\"{ex.Message}\"}}");
            }
        }
    }
}