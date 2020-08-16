using System.Threading.Tasks;
using Application.Users;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        // POST api/user
        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }
    }
}