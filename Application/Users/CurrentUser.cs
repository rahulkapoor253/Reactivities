using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class CurrentUser
    {
        public class Query : IRequest<User> { }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccess _userAccess;
            private readonly IJWTGenerator _generator;
            public Handler(UserManager<AppUser> userManager, IUserAccess userAccess, IJWTGenerator generator)
            {
                _userManager = userManager;
                _userAccess = userAccess;
                _generator = generator;
            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                //handler logic
                //we get user object from usermanager-> httpcontext -> username
                var user = await _userManager.FindByNameAsync(_userAccess.GetCurrentUsername());
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                return new User
                {
                    Token = _generator.CreateToken(user),
                    DisplayName = user.DisplayName,
                    Image = null,
                    Username = user.UserName
                };
            }
        }

    }
}