using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccess _userAccess;
            public Handler(DataContext context, IUserAccess userAccess)
            {
                _context = context;
                _userAccess = userAccess;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //handler logic
                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());
                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                //observer will follow target user
                if (target == null)
                {
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "Not found" });
                }

                //check if it is already followed
                var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id);
                if (following != null)
                {
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { User = "Already following" });
                }
                else
                {
                    following = new Domain.UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.Followings.Add(following);
                }

                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem in saving data to database");
            }
        }
    }
}