using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class Cliente : BaseEntity
    {
        public string Nome { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
