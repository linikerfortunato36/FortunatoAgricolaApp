namespace FortunatoAgricola.Application.DTOs
{
    public class UpdateConfiguracaoDto
    {
        public Guid Id { get; set; }
        public decimal ValorBaseComissaoVendaPorSaca { get; set; }
        public decimal PorcentagemImposto { get; set; }
    }
}
