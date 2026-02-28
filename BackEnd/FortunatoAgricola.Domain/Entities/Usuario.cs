using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Usuario : BaseEntity
    {
        public string Nome { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public string Perfil { get; set; } = "Leitura";
        public bool IsActive { get; set; } = true;
    }
}
