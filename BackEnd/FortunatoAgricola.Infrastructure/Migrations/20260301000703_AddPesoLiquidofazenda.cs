using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FortunatoAgricola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPesoLiquidofazenda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PesoLiquidofazenda",
                table: "Movimentacoes",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PesoLiquidofazenda",
                table: "Movimentacoes");
        }
    }
}
