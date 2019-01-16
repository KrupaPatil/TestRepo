import { AgmCoreModule } from '@agm/core';
import { DecimalPipe } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CONFIG_GOOGLE_MAPS_KEY } from '@app/env';
import { AppVersion } from '@ionic-native/app-version';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Facebook } from '@ionic-native/facebook';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Push } from '@ionic-native/push';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CustomFormsModule } from 'ng2-validation';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { ForgotPasswordPage } from '../pages/auth/forgot-password/forgot-password';
import { LoginPage } from '../pages/auth/login/login';
import { MigrateAccountPage } from '../pages/auth/migrate-account/migrate-account';
import { ResetPasswordPage } from '../pages/auth/reset-password/reset-password';
import { SignUpPage } from '../pages/auth/sign-up/sign-up';
import { CigarAttribute } from '../pages/cigar-details/attribute/cigar-attribute';
import { CigarDetailsPage } from '../pages/cigar-details/cigar-details';
import { CigarLogInfo } from '../pages/cigar-details/cigar-log-info/cigar-log-info';
import { Gallery } from '../pages/cigar-details/gallery/gallery';
import { MyNote } from '../pages/cigar-details/my-note/my-note';
import { MyRating } from '../pages/cigar-details/my-rating/my-rating';
import { CigarReviews } from '../pages/cigar-details/reviews/cigar-reviews';
import { CigarSearchPage } from '../pages/cigar-search/cigar-search';
import { CustomCigarPage } from '../pages/custom-cigar/custom-cigar';
import { FeedbackPage } from '../pages/feedback/feedback';
import { Layout } from '../pages/layout/layout';
import { MyCigarsPage } from '../pages/my-cigars/my-cigars';
import { AddCigarFromSearchPage } from '../pages/my-humidors/add-cigar-from-search/add-cigar-from-search';
import { ComingSoon } from '../pages/my-humidors/coming-soon/coming-soon';
import { HumidorAddEdit } from '../pages/my-humidors/humidor-add-edit/humidor-add-edit';
import { HumidorDetailsPage } from '../pages/my-humidors/humidor-details/humidor-details';
import { MeasurementHistory } from '../pages/my-humidors/measurement-history/measurement-history';
import { MyHumidorsPage } from '../pages/my-humidors/my-humidors';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { PrivacyPolicy } from '../pages/privacy-policy/privacy-policy';
import { RatePage } from '../pages/rate/rate';
import { MasterLineResultsPage } from '../pages/scan-cigar/master-line-results/master-line-results';
import { NoResultsPage } from '../pages/scan-cigar/no-results/no-results';
import { ScanCigarPage } from '../pages/scan-cigar/scan-cigar';
import { Settings } from '../pages/settings/settings';
import { SocialPostComments } from '../pages/social/comments/comments';
import { CustomPost } from '../pages/social/custom-post/custom-post';
import { PostLikes } from '../pages/social/post-likes/post-likes';
import { PostPopoverPage } from '../pages/social/post-popover/post-popover';
import { ProductPost } from '../pages/social/product-post/product-post';
import { SocialPage } from '../pages/social/social';
import { SocialGroupPopover } from '../pages/social/social-group-popover/social-group-popover';
import { UserFollows } from '../pages/social/user-follows/user-follows';
import { UserHumidors } from '../pages/social/user-humidors/user-humidors';
import { UserImage } from '../pages/social/user-image/user-image';
import { UserList } from '../pages/social/user-list/user-list';
import { UserPosts } from '../pages/social/user-posts/user-posts';
import { UserProfile } from '../pages/social/user-profile/user-profile';
import { UserReviews } from '../pages/social/user-reviews/user-reviews';
import { UserSearch } from '../pages/social/user-search/user-search';
import { AboutPage } from '../pages/tools/about/about';
import { KnowledgePage } from '../pages/tools/knowledge/knowledge';
import { KnowledgeItemPage } from '../pages/tools/knowledge/knowledge-item/knowledge-item';
import { PlacePage } from '../pages/tools/places/place/place';
import { PlacesPage } from '../pages/tools/places/places';
import { RingGaugePage } from '../pages/tools/ring-gauge/ring-gauge';
import { ShapeDetailsPage } from '../pages/tools/shapes/shape-details/shape-details';
import { ShapesPage } from '../pages/tools/shapes/shapes';
import { ToolsPage } from '../pages/tools/tools';
import { TopRatedPage } from '../pages/tools/top-rated/top-rated';
import { TopScannedPage } from '../pages/tools/top-scanned/top-scanned';
import { WrapperColorPage } from '../pages/tools/wrapper-color/wrapper-color';
import { CigarBrandLogo } from '../shared/components/cigar-brand-logo/cigar-brand-logo';
import { CigarInfo } from '../shared/components/cigar-info/cigar-info';
import { CigarPrice } from '../shared/components/cigar-price/cigar-price';
import { CigarSearch } from '../shared/components/cigar-search/cigar-search';
import { CigarSearchResults } from '../shared/components/cigar-search/cigar-search-results/cigar-search-results';
import { RatingStars } from '../shared/components/rating-stars/rating-stars';
import { SocialPost } from '../shared/components/social-post/social-post';
import { Survey } from '../shared/components/survey/survey';
import { UserListItem } from '../shared/components/user-list-item/user-list-item';
import { AuthGuard } from '../shared/guards/auth.guard';
import { GuestGuard } from '../shared/guards/guest.guard';
import { InitGuard } from '../shared/guards/init.guard';
import { AppErrorHandler } from '../shared/services/error.handler';
import { SharedModule } from '../shared/shared.module';
import { MyApp } from './app.component';
import { APP_ROUTES_PROVIDER } from './app.router';

@NgModule({
  declarations: [
    AboutPage,
    CigarAttribute,
    CigarLogInfo,
    CigarDetailsPage,
    CigarPrice,
    ComingSoon,
    KnowledgePage,
    Layout,
    LoginPage,
    MasterLineResultsPage,
    MyApp,
    MyCigarsPage,
    MyHumidorsPage,
    HumidorDetailsPage,
    HumidorAddEdit,
    MyProfilePage,
    MyNote,
    MyRating,
    MigrateAccountPage,
    MeasurementHistory,
    NoResultsPage,
    PlacePage,
    PlacesPage,
    ProductPost,
    PostPopoverPage,
    SocialGroupPopover,
    PrivacyPolicy,
    ForgotPasswordPage,
    ResetPasswordPage,
    RingGaugePage,
    ScanCigarPage,
    CigarSearchPage,
    CigarReviews,
    AddCigarFromSearchPage,
    ShapeDetailsPage,
    ShapesPage,
    SignUpPage,
    SocialPage,
    ToolsPage,
    WrapperColorPage,
    RatingStars,
    SocialPost,
    SocialPostComments,
    PostLikes,
    CustomPost,
    CigarInfo,
    CigarSearch,
    CigarBrandLogo,
    CigarSearchResults,
    NotificationsPage,
    TopRatedPage,
    TopScannedPage,
    KnowledgeItemPage,
    RatePage,
    FeedbackPage,
    CustomCigarPage,
    Gallery,
    UserProfile,
    UserListItem,
    UserImage,
    UserFollows,
    Settings,
    UserList,
    UserHumidors,
    UserPosts,
    UserReviews,
    UserSearch,
    Survey
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ImageCropperModule,
    InfiniteScrollModule,
    IonicModule.forRoot(MyApp),
    APP_ROUTES_PROVIDER,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: CONFIG_GOOGLE_MAPS_KEY
    }),
    CustomFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AboutPage,
    CigarDetailsPage,
    KnowledgePage,
    Layout,
    LoginPage,
    MyApp,
    MyCigarsPage,
    MyHumidorsPage,
    MyProfilePage,
    PlacePage,
    PlacesPage,
    PostPopoverPage,
    SocialGroupPopover,
    RingGaugePage,
    ScanCigarPage,
    ShapeDetailsPage,
    ShapesPage,
    SignUpPage,
    SocialPage,
    ToolsPage,
    WrapperColorPage,
    KnowledgeItemPage,
    RatePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: 'Window', useValue: window},
    AuthGuard,
    DecimalPipe,

    Device,
    FileTransfer,
    Facebook,
    Push,
    StatusBar,
    SplashScreen,
    SocialSharing,
    Geolocation,
    Camera,
    GoogleAnalytics,
    AppVersion,
    BackgroundMode,

    GuestGuard,
    InitGuard,
  ]
})
export class AppModule {}
