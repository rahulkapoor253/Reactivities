using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;
using Application.Errors;
using System.Net;
using System;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccess _userAccess;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccess userAccess)
            {
                _context = context;
                _photoAccessor = photoAccessor;
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
                    throw new RestException(HttpStatusCode.BadRequest, new { Photo = "Cannot delete main profile photo" });
                }

                //if photo is present with user call accessor and delete
                var result = _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                {
                    throw new Exception("Problem in deleting the photo");
                }

                //remove photo from db
                user.Photos.Remove(photo);

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