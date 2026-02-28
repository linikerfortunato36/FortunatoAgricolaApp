using System;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IUserAccessor
    {
        Guid? GetUserId();
        string? GetUserName();
    }
}
