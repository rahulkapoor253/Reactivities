using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

            public Query(int? limit, int? offset)
            {
                Limit = limit;
                Offset = offset;
            }

        }

        public class Handler : IRequestHandler<Query, ActivityEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _autoMapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _autoMapper = mapper;
            }
            public async Task<ActivityEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                //paging logic
                var querable = _context.Activities.AsQueryable();
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