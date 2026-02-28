namespace FortunatoAgricola.Application.DTOs
{
    public class CreateUsuarioDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Perfil { get; set; } = "Operador";
    }
}
