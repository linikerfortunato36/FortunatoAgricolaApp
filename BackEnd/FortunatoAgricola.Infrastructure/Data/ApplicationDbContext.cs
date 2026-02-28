using FortunatoAgricola.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace FortunatoAgricola.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Produtor> Produtores { get; set; }
        public DbSet<Transportadora> Transportadoras { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Contrato> Contratos { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<Configuracao> Configuracoes { get; set; }
        public DbSet<LogAcaoUsuario> LogAcoesUsuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Global Query Filter for Fake Delete
            modelBuilder.Entity<Cliente>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Produtor>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Transportadora>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Usuario>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Contrato>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Movimentacao>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Configuracao>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<LogAcaoUsuario>().HasQueryFilter(x => !x.IsDeleted);
        }
    }
}
