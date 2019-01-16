import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutPage } from '../pages/tools/about/about';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CigarAttribute } from '../pages/cigar-details/attribute/cigar-attribute';
import { CigarLogInfo } from '../pages/cigar-details/cigar-log-info/cigar-log-info';
import { ComingSoon } from '../pages/my-humidors/coming-soon/coming-soon';
import { CommentsResolver } from "../shared/resolvers/comments.resolver";
import { CustomCigarPage } from '../pages/custom-cigar/custom-cigar';
import { GuestGuard } from '../shared/guards/guest.guard';
import { KnowledgePage } from '../pages/tools/knowledge/knowledge';
import { LoginPage } from '../pages/auth/login/login';
import { MyCigarsPage } from '../pages/my-cigars/my-cigars';
import { MyHumidorsPage } from '../pages/my-humidors/my-humidors';
import { HumidorDetailsPage } from '../pages/my-humidors/humidor-details/humidor-details';
import { HumidorAddEdit } from '../pages/my-humidors/humidor-add-edit/humidor-add-edit';
import { PlacePage } from '../pages/tools/places/place/place';
import { PlacesPage } from '../pages/tools/places/places';
import { PostLikes } from '../pages/social/post-likes/post-likes';
import { PostLikesResolver } from '../shared/resolvers/post-likes.resolver';
import { ProductPost } from '../pages/social/product-post/product-post';
import { ProductPostResolver } from '../shared/resolvers/product-post.resolver';
import { ForgotPasswordPage } from '../pages/auth/forgot-password/forgot-password';
import { RelatedLinesResolver } from '../shared/resolvers/related-lines.resolver';
import { RingGaugePage } from '../pages/tools/ring-gauge/ring-gauge';
import { ShapeDetailsPage } from '../pages/tools/shapes/shape-details/shape-details';
import { ShapesPage } from '../pages/tools/shapes/shapes';
import { SignUpPage } from '../pages/auth/sign-up/sign-up';
import { SettingsResolver } from '../shared/resolvers/settings.resolver';
import { SocialPage } from '../pages/social/social';
import { ToolsPage } from '../pages/tools/tools';
import { WrapperColorPage } from '../pages/tools/wrapper-color/wrapper-color';
import { ScanCigarPage } from '../pages/scan-cigar/scan-cigar';
import { CigarSearchPage } from '../pages/cigar-search/cigar-search';
import { CigarReviews } from '../pages/cigar-details/reviews/cigar-reviews';
import { CustomPost } from '../pages/social/custom-post/custom-post';
import { AddCigarFromSearchPage } from '../pages/my-humidors/add-cigar-from-search/add-cigar-from-search';
import { CigarDetailsPage } from '../pages/cigar-details/cigar-details';
import { ShapeResolver } from '../shared/resolvers/shape.resolver';
import { PlaceResolver } from '../shared/resolvers/place.resolver';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { OldUserDataResolver } from '../shared/resolvers/old-user-data.resolver';
import { ProductResolver } from '../shared/resolvers/product.resolver';
import { PrivacyPolicy } from '../pages/privacy-policy/privacy-policy';
import { HumidorResolver } from '../shared/resolvers/humidor.resolver';
import { HumidorMeasurementsResolver } from '../shared/resolvers/humidor-measurements.resolver';
import { MyHumidorsResolver } from '../shared/resolvers/my-humidors.resolver';
import { MeasurementHistory } from '../pages/my-humidors/measurement-history/measurement-history';
import { NoResultsPage } from '../pages/scan-cigar/no-results/no-results';
import { MasterLineResultsPage } from '../pages/scan-cigar/master-line-results/master-line-results';
import { SocialPostsResolver } from '../shared/resolvers/social-posts.resolver';
import { CigarListItemResolver } from '../shared/resolvers/cigar-list-item.resolver';
import { UserProfileResolver } from '../shared/resolvers/user-profile.resolver';
import { UserPostsResolver } from '../shared/resolvers/user-posts.resolver';
import { UserHumidorsResolver } from '../shared/resolvers/user-humidors.resolver';
import { UserReviewsResolver } from '../shared/resolvers/user-reviews.resolver';
import { NotificationsPage } from '../pages/notifications/notifications';
import { TopRatedPage } from '../pages/tools/top-rated/top-rated';
import { TopScannedPage } from '../pages/tools/top-scanned/top-scanned';
import { ResetPasswordPage } from '../pages/auth/reset-password/reset-password';
import { KnowledgeItemPage } from '../pages/tools/knowledge/knowledge-item/knowledge-item';
import { RatePage } from "../pages/rate/rate";
import { FeedbackPage } from "../pages/feedback/feedback";
import { MyRating } from '../pages/cigar-details/my-rating/my-rating';
import { MyNote } from '../pages/cigar-details/my-note/my-note';
import { Gallery } from '../pages/cigar-details/gallery/gallery';
import { InitGuard } from '../shared/guards/init.guard';
import { Settings } from '../pages/settings/settings';
import { MigrateAccountPage } from '../pages/auth/migrate-account/migrate-account';
import { SocialPostComments } from '../pages/social/comments/comments';
import { UserProfile } from '../pages/social/user-profile/user-profile';
import { UserImage } from '../pages/social/user-image/user-image';
import { UserPosts } from '../pages/social/user-posts/user-posts';
import { UserHumidors } from '../pages/social/user-humidors/user-humidors';
import { NoResultsResolver } from '../shared/resolvers/no-results.resolver';
import { UserListResolver } from '../shared/resolvers/user-list.resolver';
import { UserList } from '../pages/social/user-list/user-list';
import { UserReviews } from '../pages/social/user-reviews/user-reviews';
import { UserFollows } from '../pages/social/user-follows/user-follows';
import { UserFollowsResolver } from '../shared/resolvers/user-follows.resolver';
import { UserSearch } from '../pages/social/user-search/user-search';


const cigarDetailsChildRoutes = [
  {
    path: 'cigar-log-info',
    component: CigarLogInfo,
    data: {
      title: 'Cigar Log Info'
    },
  },
  {
    path: 'rating',
    component: MyRating,
    data: {
      title: 'Cigar Rating'
    },
  },
  {
    path: 'note',
    component: MyNote,
    data: {
      title: 'Personal Note'
    },
  },
  {
    path: 'gallery',
    component: Gallery,
    data: {
      title: 'Gallery'
    },
  },
  {
    path: 'reviews/:Rating',
    component: CigarReviews,
    data: {
      title: 'Review'
    },
  },
  {
    path: 'shape/:ShapeId',
    component: CigarDetailsPage,
    data: {
      title: 'Cigar Details',
      pageLevel: 2,
    },
    resolve: {
      cigar: ProductResolver
    },
    children: [
      {
        path: 'rating',
        component: MyRating,
        data: {
          title: 'Cigar Rating'
        },
      },
      {
        path: 'note',
        component: MyNote,
        data: {
          title: 'Personal Note'
        },
      },
      {
        path: 'gallery',
        component: Gallery,
        data: {
          title: 'Gallery'
        }
      },
      {
        path: 'reviews/:Rating',
        component: CigarReviews,
        data: {
          title: 'Review'
        },
      },
      {
        path: 'attribute/:Name',
        component: CigarAttribute,
        data: {
          title: 'Cigar Specifications'
        },
      }
    ]
  },
  {
    path: 'attribute/:Name',
    component: CigarAttribute,
    data: {
      title: 'Cigar Specifications'
    },
  },
];

const SocialPageChildRoutes = [
  {
    path: 'post/:Id',
    component: SocialPostComments,
    data: {
      title: 'Post Details',
    },
    resolve: {
      post: CommentsResolver
    },
    children: [
      {
        path: 'user-image',
        component: UserImage,
        data: {
          title: 'User Picture'
        }
      }
    ]
  },
  {
    path: 'likes/:Id',
    component: PostLikes,
    data: {
      title: 'Post Likes'
    },
    resolve: {
      comments: PostLikesResolver
    },
  },
  {
    path: 'user-search',
    component: UserSearch,
    data: {
      title: 'User Search'
    }
  },
  {
    path: 'custom-post',
    component: CustomPost,
    data: {
      title: 'Custom Post'
    }
  },
  {
    path: 'product-post',
    component: ProductPost,
    data: {
      title: 'Product Post'
    },
    resolve: {
      products: ProductPostResolver
    },
  },
  {
    path: 'post-review/:userType/:Id',
    component: UserReviews,
    data: {
      title: 'Post a Review',
      reviewPost: true,
    },
    resolve: {
      reviews: UserReviewsResolver
    },
  },
  {
    path: 'user-profile/:userType/:Id',
    component: UserProfile,
    data: {
      title: 'User Profile'
    },
    resolve: {
      UserProfile: UserProfileResolver
    },
    children: [
      {
        path: 'user-followers/:userType/:Id',
        component: UserFollows,
        data: {
          title: 'Followers'
        },
        resolve: {
          follows: UserFollowsResolver
        },
      },
      {
        path: 'user-following/:userType/:Id',
        component: UserFollows,
        data: {
          title: 'Following'
        },
        resolve: {
          follows: UserFollowsResolver
        },
      },
      {
        path: 'user-reviews/:userType/:Id',
        component: UserReviews,
        data: {
          title: 'User Humidors'
        },
        resolve: {
          reviews: UserReviewsResolver
        },
      },
      {
        path: 'user-list/:List/:userType/:Id',
        component: UserList,
        data: {
          title: 'User List'
        },
        resolve: {
          list: UserListResolver
        },
      },
      {
        path: 'user-posts/:userType/:Id',
        component: UserPosts,
        data: {
          title: 'User Posts'
        },
        resolve: {
          posts: UserPostsResolver
        },
      },
      {
        path: 'user-humidors/:userType/:Id',
        component: UserHumidors,
        data: {
          title: 'User Humidors'
        },
        resolve: {
          humidors: UserHumidorsResolver
        },
      },
    ]
  },
  {
    path: 'user-image',
    component: UserImage,
    data: {
      title: 'User Picture'
    }
  },
  {
    path: 'cigar/:Id',
    component: CigarDetailsPage,
    data: {
      title: 'Cigar Details',
      pageLevel: 2,
    },
    resolve: {
      cigar: ProductResolver
    },
    children: cigarDetailsChildRoutes
  },
  {
    path: 'custom-cigar/:Id',
    component: CustomCigarPage,
    data: {
      title: 'Edit Your Cigar',
      pageLevel: 2,
    },
    resolve: {
      cigar: ProductResolver
    }
  }
]

export const APP_ROUTES_PROVIDER: ModuleWithProviders = RouterModule.forRoot(
  [
    {
      path: '',
      canActivateChild: [InitGuard],
      children: [
        {
          path: 'login',
          canActivate: [GuestGuard],
          component: LoginPage,
          data: {
            title: 'Login'
          },
        },
        {
          path: 'register',
          canActivate: [GuestGuard],
          component: SignUpPage,
          data: {
            title: 'Register'
          },
        },
        {
          path: 'migrate',
          canActivate: [GuestGuard],
          component: MigrateAccountPage,
          resolve: {
            userData: OldUserDataResolver
          },
          data: {
            title: 'Migrate Account'
          },
        },
        {
          path: 'forgot-password',
          component: ForgotPasswordPage,
          data: {
            title: 'Forgot Password'
          },
        },
        {
          path: 'reset-password',
          component: ResetPasswordPage,
          data: {
            title: 'Reset Password'
          },
        },
        {
          path: 'my-profile',
          canActivate: [AuthGuard],
          component: MyProfilePage,
          data: {
            title: 'My Profile'
          },
        },
        {
          path: 'settings',
          component: Settings,
          data: {
            title: 'Settings'
          },
          resolve: {
            settingsData: SettingsResolver
          },
        },
        {
          path: 'privacy-policy',
          component: PrivacyPolicy,
          data: {
            title: 'Privacy Policy'
          },
        },
        {
          path: 'about',
          component: AboutPage,
          data: {
            title: 'About'
          }
        },
        {
          path: 'cigar/:Id',
          component: CigarDetailsPage,
          data: {
            title: 'Cigar Details',
            pageLevel: 2,
          },
          resolve: {
            cigar: ProductResolver
          },
          children: cigarDetailsChildRoutes
        },
        {
          path: 'my-cigars',
          component: MyCigarsPage,
          data: {
            title: 'My Cigars'
          },
          children: [
            {
              path: ':List/:ItemId',
              component: CigarDetailsPage,
              data: {
                title: 'Cigar Details',
                pageLevel: 2,
              },
              resolve: {
                cigarListItem: CigarListItemResolver
              },
              children: cigarDetailsChildRoutes
            }
          ]
        },
        {
          path: 'social',
          component: SocialPage,
          data: {
            title: 'Social'
          },
          resolve: {
            posts: SocialPostsResolver
          },
          children: SocialPageChildRoutes
        },
        {
          path: 'social/:Id',
          component: SocialPage,
          data: {
            title: 'Social'
          },
          resolve: {
            posts: SocialPostsResolver
          },
          children: SocialPageChildRoutes
        },
        {
          path: 'my-humidors',
          component: MyHumidorsPage,
          data: {
            title: 'My Humidors'
          },
          resolve: {
            humidors: MyHumidorsResolver
          },
          children: [
            {
              path: 'coming-soon',
              component: ComingSoon,
              data: {
                title: 'Coming Soon'
              },
            },
            {
              path: 'measurement-history/:HumidorId',
              component: MeasurementHistory,
              data: {
                title: 'Measurement History',
                pageLevel: 2
              },
              resolve: {
                measurements: HumidorMeasurementsResolver,
              },
            },
            {
              path: 'create',
              component: HumidorAddEdit,
              data: {
                title: 'Create Humidor'
              },
            },
            {
              path: ':HumidorId',
              component: HumidorDetailsPage,
              data: {
                title: 'Humidor Details',
                pageLevel: 2,
              },
              resolve: {
                humidor: HumidorResolver
              },
              children: [
                {
                  path: 'cigar/:Id',
                  component: CigarDetailsPage,
                  data: {
                    title: 'Cigar Details',
                    pageLevel: 3,
                  },
                  resolve: {
                    cigar: ProductResolver
                  },
                  children: cigarDetailsChildRoutes
                },
                {
                  path: 'custom-cigar',
                  component: CustomCigarPage,
                  data: {
                    title: 'Edit Your Cigar',
                    pageLevel: 3,
                  },
                  resolve: {
                    humidor: HumidorResolver
                  }
                }
              ]
            },
            {
              path: ':HumidorId/add-cigar-from-search',
              component: AddCigarFromSearchPage,
              data: {
                title: 'Add Cigar'
              },
              resolve: {
                humidor: HumidorResolver
              }
            },
            {
              path: ':HumidorId/edit',
              component: HumidorAddEdit,
              data: {
                title: 'Edit Humidor'
              },
              resolve: {
                humidor: HumidorResolver
              }
            }

          ]
        },
        {
          path: 'custom-cigar/add/journal',
          component: CustomCigarPage,
          data: {
            title: 'Add Your Cigar'
          }
        },
        {
          path: 'custom-cigar/add/humidor/:HumidorId',
          component: CustomCigarPage,
          data: {
            title: 'Add Your Cigar'
          },
          resolve: {
            humidor: HumidorResolver
          }
        },
        {
          path: 'custom-cigar/:List/:ItemId',
          component: CustomCigarPage,
          data: {
            title: 'Edit Your Cigar'
          },
          resolve: {
            cigar: CigarListItemResolver
          }
        },
        {
          path: 'scan-cigar',
          children: [
            {
              path: '',
              component: ScanCigarPage,
              data: {
                title: 'Scan Cigar'
              },
            },
            {
              path: 'no-results',
              component: NoResultsPage,
              data: {
                title: 'No Results'
              },
              resolve: {
                dataSummary: NoResultsResolver
              },
            },
            {
              path: 'master-line',
              component: MasterLineResultsPage,
              data: {
                title: 'Master Line Results'
              },
              resolve: {
                lines: RelatedLinesResolver
              },
              children: [
                {
                  path: 'cigar/:Id',
                  component: CigarDetailsPage,
                  data: {
                    title: 'Cigar Details',
                    pageLevel: 2,
                  },
                  resolve: {
                    cigar: ProductResolver
                  },
                  children: cigarDetailsChildRoutes
                },
                {
                  path: ':List/:ItemId',
                  component: CigarDetailsPage,
                  data: {
                    title: 'Cigar Details',
                    pageLevel: 3,
                  },
                  resolve: {
                    cigarListItem: CigarListItemResolver
                  },
                  children: cigarDetailsChildRoutes
                },

              ]
            }
          ]
        },
        {
          path: 'cigar-search',
          component: CigarSearchPage,
          data: {
            title: 'Cigar Search'
          },
          children: [
            {
              path: 'cigar/:Id',
              component: CigarDetailsPage,
              data: {
                title: 'Cigar Details',
                pageLevel: 1,
              },
              resolve: {
                cigar: ProductResolver
              },
              children: cigarDetailsChildRoutes
            }
          ]
        },
        {
          path: 'notifications',
          component: NotificationsPage,
          data: {
            title: 'Notifications'
          },
        },
        {
          path: 'rate',
          component: RatePage,
          data: {
            title: 'Rate This App'
          },
        },
        {
          path: 'feedback',
          component: FeedbackPage,
          data: {
            title: 'Feedback'
          },
        },
        {
          path: 'feedback-survey',
          component: FeedbackPage,
          data: {
            title: 'Feedback-survey'
          },
        },
        {
          path: 'tools',
          component: ToolsPage,
          data: {
            title: 'Tools'
          },
          children: [
            {
              path: 'about',
              component: AboutPage,
              data: {
                title: 'About'
              }
            },
            {
              path: 'knowledge',
              children: [
                {
                  path: '',
                  component: KnowledgePage,
                  data: {
                    title: 'Knowledge'
                  }
                },
                {
                  path: ':Id',
                  component: KnowledgeItemPage,
                  data: {
                    title: 'Knowledge Item'
                  }
                }
              ]
            },
            {
              path: 'places',
              component: PlacesPage,
              data: {
                title: 'Places'
              },
              children: [
                {
                  path: ':Id',
                  component: PlacePage,
                  resolve: {
                    place: PlaceResolver
                  }
                }
              ]
            },
            {
              path: 'ring-gauge',
              component: RingGaugePage,
              data: {
                title: 'Ring Gauge Tool'
              },
            },
            {
              path: 'shapes',
              component: ShapesPage,
              data: {
                title: 'Cigar Shapes'
              },
              children: [
                {
                  path: ':Id',
                  component: ShapeDetailsPage,
                  data: {
                    title: 'Shape Detail'
                  },
                  resolve: {
                    shape: ShapeResolver
                  }
                }
              ]
            },
            {
              path: 'wrapper-color',
              component: WrapperColorPage,
              data: {
                title: 'Cigar Wrapper Color'
              },
            },
            {
              path: 'top-rated',
              component: TopRatedPage,
              data: {
                title: 'Top Rated'
              },
            },
            {
              path: 'top-scanned',
              component: TopScannedPage,
              data: {
                title: 'Top Scanned'
              },
            },
            {
              path: 'feedback',
              component: FeedbackPage,
              data: {
                title: 'Feedback'
              },
            }
          ]
        }
      ]
    },
    {
      path: '**',
      redirectTo: '/my-cigars'
    }
  ], {useHash: true});
