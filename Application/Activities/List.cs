using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        //for paging
        public class ActivityEnvelope
        {
            public int ActivityCount { get; set; }
            public List<ActivityDto> Activities { get; set; }
        }
        public class Query : IRequest<ActivityEnvelope>
        {

            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }

            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }

        }

        public class Handler : IRequestHandler<Query, ActivityEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _autoMapper;
            private readonly IUserAccess _userAccess;
            public Handler(DataContext context, IMapper mapper, IUserAccess userAccess)
            {
                _context = context;
                _autoMapper = mapper;
                _userAccess = userAccess;
            }
            public async Task<ActivityEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                //paging logic
                var querable = _context.Activities.Where(x => x.Date >= request.StartDate).OrderBy(x => x.Date).AsQueryable();
                //check for isgoing where host will always go to the event
                if (request.IsGoing && !request.IsHost)
                {
                    querable = querable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccess.GetCurrentUsername()));
                }

                //only get the hosted events
                if (request.IsHost && !request.IsGoing)
                {
                    querable = querable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccess.GetCurrentUsername() && a.IsHost));
                }

                var activities = await querable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();
                return new ActivityEnvelope
                {
                    Activities = _autoMapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = querable.Count()
                };
            }
        }

    }
}