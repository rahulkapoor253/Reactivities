using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>().HasData(
                new Value { ID = 1, Name = "Value1" },
                new Value { ID = 2, Name = "Value2" },
                new Value { ID = 3, Name = "Value3" }
                );

            //define many-to-many relationship between user and activity
            builder.Entity<UserActivity>(x => x.HasKey(y => new { y.AppUserId, y.ActivityId }));
            builder.Entity<UserActivity>().HasOne(x => x.AppUser).WithMany(y => y.UserActivities).HasForeignKey(z => z.AppUserId);
            builder.Entity<UserActivity>().HasOne(x => x.Activity).WithMany(y => y.UserActivities).HasForeignKey(z => z.ActivityId);
            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });
                b.HasOne(o => o.Observer).WithMany(x => x.Followings).HasForeignKey(y => y.ObserverId).OnDelete(DeleteBehavior.Restrict);
                b.HasOne(o => o.Target).WithMany(x => x.Followers).HasForeignKey(y => y.TargetId).OnDelete(DeleteBehavior.Restrict);
            });
        }

    }
}
