using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile file { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
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
            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                //handler logic
                var photoUploadResult = _photoAccessor.AddPhoto(request.file);
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                //set this photo as main photo if not done yet
                if (!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }

                //add to photos
                user.Photos.Add(photo);

                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return photo;
                }

                throw new Exception("Problem in saving photo to database");
            }

        }
    }
}