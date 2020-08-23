using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContext;
        private readonly DataContext _dataContext;
        public IsHostRequirementHandler(IHttpContextAccessor httpContext, DataContext dataContext)
        {
            _httpContext = httpContext;
            _dataContext = dataContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var username = _httpContext.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var activityId = System.Guid.Parse(_httpContext.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

            //check if the user is same as host of the activity to perform edit/delete operation
            var activity = _dataContext.Activities.FindAsync(activityId).Result;
            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            if (host?.AppUser?.UserName == username)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

}