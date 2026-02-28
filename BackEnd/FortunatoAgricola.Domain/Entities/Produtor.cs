using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Produtor : BaseEntity
    {
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public string? InscricaoEstadual { get; set; }
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
