using System;
using System.Linq;
using FortunatoAgricola.Domain.Entities;
using FortunatoAgricola.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;

namespace FortunatoAgricola.API
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            
            context.Database.EnsureCreated();

            if (context.Contratos.Any())
            {
                return;   // DB has been seeded
            }

            var cliente1 = new Cliente { Id = Guid.NewGuid(), Nome = "Cargill Agrícola", Cnpj = "11.222.333/0001-44" };
            var cliente2 = new Cliente { Id = Guid.NewGuid(), Nome = "Bunge Alimentos", Cnpj = "55.666.777/0001-88" };
            
            context.Clientes.AddRange(cliente1, cliente2);
            context.SaveChanges();

            var contrato1 = new Contrato
            {
                Id = Guid.NewGuid(),
                ClienteId = cliente1.Id,
                NumeroContrato = "003/26",
                QuantidadeTotalKg = 20000000, // 20.000 t
                QuantidadeEntregueKg = 0,
                Status = "Aberto"
            };

            var contrato2 = new Contrato
            {
                Id = Guid.NewGuid(),
                ClienteId = cliente1.Id,
                NumeroContrato = "001/26",
                QuantidadeTotalKg = 60000000, // 60.000 t
                QuantidadeEntregueKg = 40000000, // 40.000 t
                Status = "Em Andamento"
            };
            
            var contrato3 = new Contrato
            {
                Id = Guid.NewGuid(),
                ClienteId = cliente2.Id,
                NumeroContrato = "014/25",
                QuantidadeTotalKg = 10000000, 
                QuantidadeEntregueKg = 10000000,
                Status = "Finalizado"
            };

            context.Contratos.AddRange(contrato1, contrato2, contrato3);
            context.SaveChanges();
            
            var produtor = new Produtor { Id = Guid.NewGuid(), Nome = "Fazenda Boa Vista", CpfCnpj = "12.345.678/0001-90" };
            var produtor2 = new Produtor { Id = Guid.NewGuid(), Nome = "Grupo Sperafico", CpfCnpj = "98.765.432/0001-10" };
            context.Produtores.AddRange(produtor, produtor2);
            
            var transportadora = new Transportadora { Id = Guid.NewGuid(), Nome = "Expresso Safra LTDA", CpfCnpj = "98.765.432/0001-01" };
            var transportadora2 = new Transportadora { Id = Guid.NewGuid(), Nome = "Transgrãos Mato Grosso", CpfCnpj = "11.222.333/0001-99" };
            context.Transportadoras.AddRange(transportadora, transportadora2);

            // Usuário Admin com senha: admin@2026
            var adminUser = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = "Administrador Geral",
                Login = "admin@fortunatoagricola.com.br",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin@2026"),
                Perfil = "Administrador",
                IsActive = true
            };
            context.Usuarios.Add(adminUser);

            context.SaveChanges();
        }
    }
}
