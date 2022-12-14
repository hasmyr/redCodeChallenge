using Microsoft.AspNetCore.Mvc;
using RED.CodeChallenge.Data;
using RED.CodeChallenge.Models;
using RED.CodeChallenge.Models.Enumerations;

namespace RED.CodeChallenge.Controllers
{
    [ApiController]
    [Route("/api/Orders")]
    public class OrderController : ControllerBase
    {
        private readonly DataContext _dbContext;

        public OrderController(DataContext dbContext)
        {
            _dbContext = dbContext; 
        }

        [HttpGet]
        public List<Order> Get()
        {
            var orders = _dbContext.Orders.ToList();
            return orders;
        }

        [HttpPut]
        public async Task<IActionResult> Put(Order order)
        {
            try
            {
                var existingOrder = _dbContext.Orders.FirstOrDefault(e => e.Id == order.Id);
                if(existingOrder == null)
                {
                    return BadRequest($"Order with ID {order.Id} not found");
                }

                _dbContext.Entry(existingOrder).CurrentValues.SetValues(order);
                var result = await _dbContext.SaveChangesAsync();
                if(result > 0)
                {
                    return Ok(order);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpPost]
        public IActionResult Post(Order order)
        {
            try
            {
                order.CreatedDate = DateTime.Now;
                _dbContext.Orders.Add(order);
                _dbContext.SaveChanges();
                return Ok(order);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("ByType")]
        public IActionResult ByType(int type)
        {
            try
            {
                var orderType = (OrderType)type;
                var orders = _dbContext.Orders.Where(e => e.OrderType == orderType).ToList();
                return Ok(orders);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("Delete")]
        public IActionResult Delete(List<string> ids)
        {
            try
            {
                var idsToDelete = new List<Guid>();
                foreach(var id in ids)
                {
                    idsToDelete.Add(new Guid(id));
                }

                var orders = _dbContext.Orders.Where(e => idsToDelete.Contains(e.Id));
                if(orders != null)
                {
                    foreach(var order in orders)
                    {
                        _dbContext.Orders.Remove(order);
                    }

                    _dbContext.SaveChanges();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
