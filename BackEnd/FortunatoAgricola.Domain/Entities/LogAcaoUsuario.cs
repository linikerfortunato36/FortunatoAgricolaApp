using System;

namespace FortunatoAgricola.Domain.Entities
{
    public class LogAcaoUsuario : BaseEntity
    {
        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public string Acao { get; set; } = string.Empty;
        public string Tabela { get; set; } = string.Empty;
        public string RegistroId { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
    }
}
