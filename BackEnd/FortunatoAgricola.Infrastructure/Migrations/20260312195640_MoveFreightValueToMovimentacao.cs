using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FortunatoAgricola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoveFreightValueToMovimentacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValorFreteCotado",
                table: "Contratos");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorFreteCotado",
                table: "Movimentacoes",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValorFreteCotado",
                table: "Movimentacoes");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorFreteCotado",
                table: "Contratos",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
