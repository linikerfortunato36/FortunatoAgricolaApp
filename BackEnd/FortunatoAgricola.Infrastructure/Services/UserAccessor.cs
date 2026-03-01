using System;
using System.Security.Claims;
using FortunatoAgricola.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace FortunatoAgricola.Infrastructure.Services
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? GetUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                        ?? user?.FindFirst("sub")?.Value 
                        ?? user?.FindFirst("id")?.Value;
            return Guid.TryParse(userId, out var guid) ? guid : null;
        }

        public string? GetUserName()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.FindFirst(ClaimTypes.Name)?.Value 
                   ?? user?.FindFirst("name")?.Value 
                   ?? user?.Identity?.Name;
        }
    }
}
