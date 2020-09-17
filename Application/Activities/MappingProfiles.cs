using AutoMapper;
using Domain;
using System.Linq;

namespace Application.Activities
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AtendeeDto>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.Following, o => o.MapFrom<FollowingResolver>());
        }
    }
}