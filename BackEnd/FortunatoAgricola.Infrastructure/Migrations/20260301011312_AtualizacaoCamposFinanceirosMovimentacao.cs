using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FortunatoAgricola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AtualizacaoCamposFinanceirosMovimentacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PorcentagemImposto",
                table: "Movimentacoes",
                newName: "ValorImpostoPorSaca");

            migrationBuilder.RenameColumn(
                name: "ValorBaseComissaoVendaPorSaca",
                table: "Configuracoes",
                newName: "ValorImpostoPorSaca");

            migrationBuilder.RenameColumn(
                name: "PorcentagemImposto",
                table: "Configuracoes",
                newName: "ValorComissaoPorSaca");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ValorImpostoPorSaca",
                table: "Movimentacoes",
                newName: "PorcentagemImposto");

            migrationBuilder.RenameColumn(
                name: "ValorImpostoPorSaca",
                table: "Configuracoes",
                newName: "ValorBaseComissaoVendaPorSaca");

            migrationBuilder.RenameColumn(
                name: "ValorComissaoPorSaca",
                table: "Configuracoes",
                newName: "PorcentagemImposto");
        }
    }
}
