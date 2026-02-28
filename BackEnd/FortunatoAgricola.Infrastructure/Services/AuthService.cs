using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Infrastructure.Data;

namespace FortunatoAgricola.Infrastructure.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
        {
            // Busca usuário pelo Login (email)
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == dto.Email && u.IsActive && !u.IsDeleted);

            if (usuario == null) return null;

            // Verifica o hash da senha (BCrypt simples)
            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
                return null;

            // Gera o JWT
            var token = GerarToken(usuario.Nome, usuario.Login, usuario.Perfil);
            var expiry = DateTime.UtcNow.AddHours(
                _config.GetValue<int>("JwtSettings:ExpiresInHours", 8));

            return new LoginResponseDto
            {
                Token = token,
                Expiry = expiry,
                Nome = usuario.Nome,
                Email = usuario.Login,
                Perfil = usuario.Perfil
            };
        }

        private string GerarToken(string nome, string email, string perfil)
        {
            var secretKey = _config["JwtSettings:SecretKey"]
                ?? "SuperSecretKeyThatIsAtLeast32BytesLongForHS256";
            var issuer = _config["JwtSettings:Issuer"] ?? "FortunatoAgricola.API";
            var audience = _config["JwtSettings:Audience"] ?? "FortunatoAgricola.App";
            var expiresHours = _config.GetValue<int>("JwtSettings:ExpiresInHours", 8);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, nome),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, perfil),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiresHours),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
