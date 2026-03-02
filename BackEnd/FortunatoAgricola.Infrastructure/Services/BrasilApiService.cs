using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;
using Newtonsoft.Json;
using System.Net.Http.Json;

namespace FortunatoAgricola.Infrastructure.Services
{
    public class BrasilApiService : IBrasilApiService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        private readonly JsonSerializerSettings settings = new() { Error = (se, ev) => { ev.ErrorContext.Handled = true; } };

        public string url = "https://brasilapi.com.br/api/";
        public BrasilApiService(IHttpClientFactory httpClientFactory) => _httpClientFactory = httpClientFactory;

        public async Task<HttpClient> getHTTP(string rota)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(url + rota);
            client.DefaultRequestHeaders.Accept.Clear();
            return client;
        }

        public async Task<HttpResponseMessage> executa(string rota, string metodo, object conteudo)
        {
            var client = await getHTTP(rota);
            var response = new HttpResponseMessage();
            try
            {
                if (metodo == "GET")
                    response = client.GetAsync(url + rota).Result;
                else if (metodo == "POST")
                    response = client.PostAsJsonAsync(url + rota, conteudo).Result;
                else if (metodo == "PUT")
                    response = client.PutAsJsonAsync(url + rota, conteudo).Result;
                else if (metodo == "DELETE")
                    response = client.DeleteAsync(url + rota).Result;
            }
            catch
            {
            }

            return response;
        }

        public async Task<List<BankDto>> GetBancos()
        {
            try
            {
                var ret = new List<BankDto>();
                var response = await executa("banks/v1", "GET", null);
                if (response.IsSuccessStatusCode)
                    ret = JsonConvert.DeserializeObject<List<BankDto>>(await response.Content.ReadAsStringAsync(), settings);
                return ret;
            }
            catch
            {
                return null;
            }
        }
        public async Task<CNPJDto> GetCNPJ(string cnpj)
        {
            try
            {
                cnpj = cnpj.Replace(".", "").Replace("/", "").Replace("-", "");
                var ret = new CNPJDto();
                var response = await executa($"cnpj/v1/{cnpj}", "GET", null);
                if (response.IsSuccessStatusCode)
                    ret = JsonConvert.DeserializeObject<CNPJDto>(await response.Content.ReadAsStringAsync(), settings);
                return ret;
            }
            catch
            {
                return null;
            }
        }
    }
}
