using System.Data;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Core.Serialization;
using Database;
using FlowerBI;
using FlowerBI.Engine.JsonModels;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Functions;

public class QueryDatabase
{
    private readonly IDbConnection _dbConnection;

    public QueryDatabase(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }
    
    [Function("QueryDatabase")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req,
        FunctionContext executionContext)
    {

        //var a = await req.ReadAsStringAsync();
        req.Body.Position = 0;
        var json = await req.ReadFromJsonAsync<QueryJson>(serializer);
        if (json != null)
        {
            var data = Query(json);

            var response = req.CreateResponse();
            await response.WriteAsJsonAsync(data, serializer);
            return response;
        }
        var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
        await errorResponse.WriteStringAsync($"Unable to parse to request to {nameof(QueryJson)}");
        return errorResponse;
    }

    private static JsonObjectSerializer serializer = new JsonObjectSerializer(new JsonSerializerOptions(JsonSerializerDefaults.Web)
    {
        Converters = {new JsonStringEnumConverter()}
    });
    private static readonly Schema AdventureWorks2019Schema = new(typeof(AdventureWorks2019Schema));
    private static readonly ISqlFormatter Formatter = new SqlServerFormatter();
    
    private QueryResultJson Query(QueryJson queryJson)
    {
       
        var query = new Query(queryJson, AdventureWorks2019Schema);

        var filterParams = new EmbeddedFilterParameters();
        query.ToSql(Formatter, filterParams, Array.Empty<Filter>());

        var result = query.Run(Formatter, _dbConnection, Console.WriteLine, Array.Empty<Filter>());
        return result;
    }
}