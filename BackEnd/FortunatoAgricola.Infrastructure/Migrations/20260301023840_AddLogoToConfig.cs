using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FortunatoAgricola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLogoToConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LogoBase64",
                table: "Configuracoes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogoBase64",
                table: "Configuracoes");
        }
    }
}
