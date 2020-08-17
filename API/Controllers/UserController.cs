using System.Threading.Tasks;
using Application.Users;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class UserController : BaseController
    {
        // POST api/user
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }
    }
}