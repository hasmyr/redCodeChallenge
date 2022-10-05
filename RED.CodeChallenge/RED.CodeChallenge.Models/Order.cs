using RED.CodeChallenge.Models.Enumerations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RED.CodeChallenge.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        // for simplicity I make the OrderType an Enum, ideally this would be a seperate table
        public OrderType OrderType { get; set; }
        public string CustomerName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedByUserName { get; set; }

        public Order()
        {
            CustomerName = string.Empty;
            CreatedDate = new DateTime();
            CreatedByUserName = string.Empty;
        }
    }
}