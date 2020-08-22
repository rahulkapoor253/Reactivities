using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private DataContext _context;
            private IUserAccess _userAccess;
            public Handler(DataContext context, IUserAccess userAccess)
            {
                _context = context;
                _userAccess = userAccess;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //handler logic
                var activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });
                }

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());
                //check for attendance of the currentuser and activity applied.
                var attendance = await _context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.AppUserId == user.Id);
                if (attendance == null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { activity = "Not found" });
                }

                //host cannot remove itself from the event
                if (attendance.IsHost)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "host cannot remove itself from this event" });
                }
                //if event is there and user is not a host then simply remove 
                _context.UserActivities.Remove(attendance);

                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem in saving activity to database");
            }
        }
    }
}