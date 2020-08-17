using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJWTGenerator _generator;
            public Handler(DataContext context, UserManager<AppUser> userManager, IJWTGenerator generator)
            {
                _context = context;
                _userManager = userManager;
                _generator = generator;
            }
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                //handler logic
                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                {
                    //user already exists, throw exception
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });
                }

                if (await _context.Users.AnyAsync(x => x.UserName == request.Username))
                {
                    //user already exists, throw exception
                    throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists." });
                }

                //its a new user, register it into db
                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Image = null,
                        Username = user.UserName,
                        Token = _generator.CreateToken(user)
                    };
                }

                throw new Exception("Problem registering a user");
            }

        }
    }
}