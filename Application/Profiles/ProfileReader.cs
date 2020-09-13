using System.Linq;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccess _userAccess;
        public ProfileReader(DataContext dataContext, IUserAccess userAccess)
        {
            _dataContext = dataContext;
            _userAccess = userAccess;
        }
        public async Task<Profile> ReadProfile(string username)
        {
            //return profile data with following info
            var user = await _dataContext.Users.SingleOrDefaultAsync(x => x.UserName == username);
            if (user == null)
            {
                throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "user not found" });
            }

            var currentUser = await _dataContext.Users.SingleOrDefaultAsync(x => x.UserName == _userAccess.GetCurrentUsername());
            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Bio = user.Bio,
                Photos = user.Photos,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                FollowersCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count()
            };

            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
            {
                profile.isFollowed = true;
            }

            return profile;
        }
    }
}