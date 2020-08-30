using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                //handler logic
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                return new Profile
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Bio = user.Bio,
                    Photos = user.Photos,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
                };
            }

        }

    }
}