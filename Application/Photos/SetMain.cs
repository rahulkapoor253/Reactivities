using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());
                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not found" });
                }

                if (photo.IsMain)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Photo = "already main photo" });
                }

                //replace the ismain photo 
                var mainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
                mainPhoto.IsMain = false;
                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem in saving changes to database");
            }
        }
    }
}