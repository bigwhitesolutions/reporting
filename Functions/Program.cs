using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(s =>
    {
        s.AddTransient<IDbConnection>(db => new SqlConnection("Server=localhost\\SQLEXPRESS;TrustServerCertificate=True;Database=AdventureWorks2019;Trusted_Connection=Yes"));
    })
    .Build();



host.Run();