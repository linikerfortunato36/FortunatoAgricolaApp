using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Transportadora : BaseEntity
    {
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
