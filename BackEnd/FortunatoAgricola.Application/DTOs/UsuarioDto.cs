using System;

namespace FortunatoAgricola.Application.DTOs
{
    public class UsuarioDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateUsuarioDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Perfil { get; set; } = "Operador";
    }

    public class UpdateUsuarioDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? NovaSenha { get; set; }
    }
}
