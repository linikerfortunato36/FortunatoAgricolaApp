using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FortunatoAgricola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AuditTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Usuarios",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Usuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Usuarios",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Usuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Transportadoras",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Transportadoras",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Transportadoras",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Transportadoras",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Produtores",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Produtores",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Produtores",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Produtores",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Movimentacoes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Movimentacoes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Movimentacoes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Movimentacoes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "LogAcoesUsuarios",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "LogAcoesUsuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "LogAcoesUsuarios",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "LogAcoesUsuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Contratos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Contratos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Contratos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Contratos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Configuracoes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Configuracoes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Configuracoes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Configuracoes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Clientes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "Clientes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Clientes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "Clientes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Transportadoras");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Transportadoras");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Transportadoras");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Transportadoras");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Produtores");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Produtores");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Produtores");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Produtores");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Movimentacoes");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Movimentacoes");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Movimentacoes");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Movimentacoes");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "LogAcoesUsuarios");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "LogAcoesUsuarios");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "LogAcoesUsuarios");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "LogAcoesUsuarios");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Contratos");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Contratos");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Contratos");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Contratos");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Configuracoes");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Configuracoes");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Configuracoes");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Configuracoes");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "Clientes");
        }
    }
}
