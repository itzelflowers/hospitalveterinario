using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;
using MySqlConnector;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace PawHospital.Auth
{
    // --- Modelos para recibir los datos del request ---

    public class UserRegistrationModel
    {
        [Required]
        [StringLength(120)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(120)]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }

    public class UserLoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    // --- Clase principal de las funciones de autenticación ---

    public class AuthFunctions
    {
        private readonly ILogger<AuthFunctions> _logger;

        public AuthFunctions(ILogger<AuthFunctions> logger)
        {
            _logger = logger;
        }


        [Function("RegisterUser")]
        public async Task<IActionResult> RegisterUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "users/register")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function 'RegisterUser' processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserRegistrationModel>(requestBody);

            // Validación simple
            if (data == null || string.IsNullOrWhiteSpace(data.Email) || string.IsNullOrWhiteSpace(data.Password) || string.IsNullOrWhiteSpace(data.FullName))
            {
                return new BadRequestObjectResult("Por favor, proporcione nombre, email y contraseña.");
            }

            var connectionString = Environment.GetEnvironmentVariable("MySqlConnectionString");
            await using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            try
            {
                // 1. Verificar si el email ya existe
                var checkCmd = new MySqlCommand("SELECT COUNT(1) FROM users WHERE email = @email", connection);
                checkCmd.Parameters.AddWithValue("@email", data.Email);
                var userExists = (long)await checkCmd.ExecuteScalarAsync() > 0;

                if (userExists)
                {
                    _logger.LogWarning($"Intento de registro con email ya existente: {data.Email}");
                    return new ConflictObjectResult($"El email '{data.Email}' ya está registrado.");
                }

                // 2. Hashear la contraseña usando BCrypt
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(data.Password);

                // 3. Insertar el nuevo usuario. Asumimos que el rol 'cliente' tiene role_id = 5
                // Esto es una suposición basada en el orden del schema. ¡Verifícalo en tu BDD!
                var insertCmd = new MySqlCommand(
                    "INSERT INTO users (full_name, email, password_hash, role_id) VALUES (@fullName, @email, @passwordHash, @roleId)",
                    connection);
                
                insertCmd.Parameters.AddWithValue("@fullName", data.FullName);
                insertCmd.Parameters.AddWithValue("@email", data.Email);
                insertCmd.Parameters.AddWithValue("@passwordHash", passwordHash);
                insertCmd.Parameters.AddWithValue("@roleId", 5); // ID para el rol 'cliente'

                await insertCmd.ExecuteNonQueryAsync();

                _logger.LogInformation($"Usuario '{data.Email}' registrado exitosamente.");
                return new OkObjectResult(new { message = "Usuario registrado exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar el usuario.");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [Function("LoginUser")]
        public async Task<IActionResult> LoginUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "users/login")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function 'LoginUser' processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserLoginModel>(requestBody);

            if (data == null || string.IsNullOrWhiteSpace(data.Email) || string.IsNullOrWhiteSpace(data.Password))
            {
                return new BadRequestObjectResult("Por favor, proporcione email y contraseña.");
            }

            var connectionString = Environment.GetEnvironmentVariable("MySqlConnectionString");
            await using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            try
            {
                // 1. Buscar al usuario por email
                var command = new MySqlCommand(
                    "SELECT user_id, full_name, password_hash, role_id, is_active FROM users WHERE email = @email",
                    connection);
                command.Parameters.AddWithValue("@email", data.Email);

                await using var reader = await command.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    // Email no encontrado
                    _logger.LogWarning($"Intento de login fallido para el usuario (no existe): {data.Email}");
                    return new UnauthorizedObjectResult("Credenciales inválidas.");
                }

                // 2. Extraer datos del usuario y verificar la contraseña
                var storedHash = reader.GetString("password_hash");
                var isActive = reader.GetBoolean("is_active");
                
                if (!isActive)
                {
                     _logger.LogWarning($"Intento de login para usuario inactivo: {data.Email}");
                    return new UnauthorizedObjectResult("La cuenta de usuario está desactivada.");
                }

                if (!BCrypt.Net.BCrypt.Verify(data.Password, storedHash))
                {
                    // Contraseña incorrecta
                    _logger.LogWarning($"Intento de login fallido para el usuario (contraseña incorrecta): {data.Email}");
                    return new UnauthorizedObjectResult("Credenciales inválidas.");
                }

                // 3. Login exitoso
                var response = new
                {
                    userId = reader.GetInt32("user_id"),
                    fullName = reader.GetString("full_name"),
                    email = data.Email,
                    roleId = reader.GetInt32("role_id")
                    // En una aplicación real, aquí se generaría y devolvería un token JWT
                };

                _logger.LogInformation($"Login exitoso para el usuario: {data.Email}");
                return new OkObjectResult(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error durante el proceso de login.");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}