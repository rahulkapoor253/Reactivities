using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _autoMapper;
            public Handler(DataContext context, IMapper autoMapper)
            {
                _context = context;
                _autoMapper = autoMapper;
            }
            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                //handler logic
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { activity = "Not found" });
                }

                //we dont depend on UserAccess as it uses HttpContext but we will be using WebSockets here for SignalR
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                //create comment object
                var comment = new Comment
                {
                    Author = user,
                    Body = request.Body,
                    CreatedAt = DateTime.Now,
                    Activity = activity
                };
                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return _autoMapper.Map<CommentDto>(comment);
                }

                throw new Exception("Problem in saving comment to database");
            }
        }
    }
}