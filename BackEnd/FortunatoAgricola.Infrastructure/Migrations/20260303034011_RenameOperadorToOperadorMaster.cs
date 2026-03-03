using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FortunatoAgricola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameOperadorToOperadorMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Usuarios SET Perfil = 'Operador Master' WHERE Perfil = 'Operador';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Usuarios SET Perfil = 'Operador' WHERE Perfil = 'Operador Master';");
        }
    }
}
