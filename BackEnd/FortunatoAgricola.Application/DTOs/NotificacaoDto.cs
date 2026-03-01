namespace FortunatoAgricola.Application.DTOs
{
    public class NotificacaoDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Titulo { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
        public string Tipo { get; set; } = "info"; // "warning", "info", "success", "danger"
        public string Icone { get; set; } = "bi-bell";
        public DateTime Data { get; set; }
        public bool Lida { get; set; } = false;
    }
}
