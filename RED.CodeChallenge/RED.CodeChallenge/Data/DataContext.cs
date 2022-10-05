using Microsoft.EntityFrameworkCore;
using RED.CodeChallenge.Models;

namespace RED.CodeChallenge.Data
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server with connection string from app settings
            options.UseSqlServer(Configuration.GetConnectionString("DbContext"));
        }

        public DbSet<Order> Orders { get; set; }
    }
}
