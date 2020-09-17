using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AtendeeDto, bool>
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccess _userAccess;

        public FollowingResolver(DataContext dataContext, IUserAccess userAccess)
        {
            _dataContext = dataContext;
            _userAccess = userAccess;
        }

        public bool Resolve(UserActivity source, AtendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _dataContext.Users.SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername()).Result;
            if (currentUser.Followings.Any(x => x.TargetId == source.AppUserId))
            {
                return true;
            }

            return false;
        }
    }
}