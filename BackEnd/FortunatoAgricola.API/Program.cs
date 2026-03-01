using FortunatoAgricola.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using FortunatoAgricola.Application.Interfaces;
using FortunatoAgricola.Infrastructure.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddScoped<IProdutorService, ProdutorService>();
builder.Services.AddScoped<IContratoService, ContratoService>();
builder.Services.AddScoped<IMovimentacaoService, MovimentacaoService>();
builder.Services.AddScoped<ITransportadoraService, TransportadoraService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IConfiguracaoService, ConfiguracaoService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Banco de Dados: MySQL se disponível, InMemory como fallback
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=localhost;Database=FortunatoAgricolaDb;User=root;Password=root;";

var useMySql = builder.Configuration.GetValue<bool>("UseMySQL", false);

if (useMySql)
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
               .EnableSensitiveDataLogging()
               .EnableDetailedErrors();
    });
    Console.WriteLine("✅ Banco de dados: MySQL (modo produção)");
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseInMemoryDatabase("FortunatoAgricolaDb")
               .EnableSensitiveDataLogging();
    });
    Console.WriteLine("⚠️  Banco de dados: InMemory (modo desenvolvimento) — Set 'UseMySQL: true' para produção");
}

// Autenticação JWT
var key = Encoding.ASCII.GetBytes("SuperSecretKeyThatIsAtLeast32BytesLongForHS256");
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseDeveloperExceptionPage();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    FortunatoAgricola.API.DbInitializer.Initialize(services);
}

app.Run();
