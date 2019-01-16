import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CommentData } from './data/comment.data';
import { FavoritesData } from './data/favorites.data';
import { JournalData } from './data/journal.data';
import { SocialPostData } from './data/social-post.data';
import { WishListData } from './data/wish-list.data';
import { BackLinkDirective } from './directives/back-link.directive';
import { IsDesktopDirective } from './directives/is-desktop.directive';
import { IsMobileDirective } from './directives/is-mobile.directive';
import { PageLevelDirective } from './directives/page-level.directive';
import { ParallaxFxDirective } from './directives/parallax-fx.directive';
import { RunScriptsDirective } from './directives/run-scripts.directive';
import { CreateSourcePipe } from './pipes/create-source';
import { HumidorsTotalCigarsPipe } from './pipes/humidors-total-cigars.pipe';
import { HumidorsTotalPricePipe } from './pipes/humidors-total-price.pipe';
import { MeterToMilesPipe } from './pipes/meter-to-miles.pipe';
import { NlToBrPipe } from './pipes/nl-to-br.pipe';
import { PriceRangePipe } from './pipes/price-range.pipe';
import { SortHumidorsPipe } from './pipes/sort-humidors.pipe';
import { LocalTimePipe } from './pipes/local-time';
import { UserNamePipe } from './pipes/user-name.pipe';
import { ActiveUserResolver } from './resolvers/active-user.resolver';
import { CigarListItemResolver } from './resolvers/cigar-list-item.resolver';
import { CommentsResolver } from './resolvers/comments.resolver';
import { HumidorMeasurementsResolver } from './resolvers/humidor-measurements.resolver';
import { HumidorResolver } from './resolvers/humidor.resolver';
import { MyHumidorsResolver } from './resolvers/my-humidors.resolver';
import { NoResultsResolver } from './resolvers/no-results.resolver';
import { OldUserDataResolver } from './resolvers/old-user-data.resolver';
import { PlaceResolver } from './resolvers/place.resolver';
import { PostLikesResolver } from './resolvers/post-likes.resolver';
import { ProductPostResolver } from './resolvers/product-post.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { RelatedLinesResolver } from './resolvers/related-lines.resolver';
import { SettingsResolver } from './resolvers/settings.resolver';
import { ShapeResolver } from './resolvers/shape.resolver';
import { SocialPostsResolver } from './resolvers/social-posts.resolver';
import { UserFollowsResolver } from './resolvers/user-follows.resolver';
import { UserHumidorsResolver } from './resolvers/user-humidors.resolver';
import { UserListResolver } from './resolvers/user-list.resolver';
import { UserPostsResolver } from './resolvers/user-posts.resolver';
import { UserProfileResolver } from './resolvers/user-profile.resolver';
import { UserReviewsResolver } from './resolvers/user-reviews.resolver';
import { AccountResource } from './resources/account.resource';
import { AccountApiResource } from './resources/api/account-api.resource';
import { CommentApiResource } from './resources/api/comment-api.resource';
import { DataSummaryApiResource } from './resources/api/data-summary-api.resource';
import { FeedbackApiResource } from './resources/api/feedback-api.resource';
import { HumidorApiResource } from './resources/api/humidor-api.resource';
import { KnowledgeApiResource } from './resources/api/knowledge-api.resource';
import { ManualRecognitionApiResource } from './resources/api/manual-recognition-api.resource';
import { MigrationApiResource } from './resources/api/migration-api.resource';
import { NotificationApiResource } from './resources/api/notification-api.resource';
import { PlaceApiResource } from './resources/api/place-api.resource';
import { ProductApiResource } from './resources/api/product-api.resource';
import { ProductReviewApiResource } from './resources/api/product-review-api.resource';
import { PushNotificationApiResource } from './resources/api/push-notification-api.resource';
import { SettingsApiResource } from './resources/api/settings-api.resource';
import { SocialPostApiResource } from './resources/api/social-post-api.resource';
import { SurveyApiResource } from './resources/api/survey-api.resource';
import { TopRatedCigarsApiResource } from './resources/api/top-rated-cigars-api.resource';
import { TopScannedCigarsApiResource } from './resources/api/top-scanned-cigars-api.resource';
import { UserDataSummaryApiResource } from './resources/api/user-data-summary-api.resource';
import { UserFavoritesApiResource } from './resources/api/user-favorites-api.resource';
import { UserJournalApiResource } from './resources/api/user-journal-api.resource';
import { UserProfileApiResource } from './resources/api/user-profile-api.resource';
import { UserSearchApiResource } from './resources/api/user-search-api.resource';
import { UserWishListApiResource } from './resources/api/user-wish-list-api.resource';
import { CommentResource } from './resources/comment.resource';
import { DataSummaryResource } from './resources/data-summary.resource';
import { AccountDbResource } from './resources/db/account-db.resource';
import { HumidorDbResource } from './resources/db/humidor-db.resource';
import { KnowledgeDbResource } from './resources/db/knowledge-db.resource';
import { ProductDbResource } from './resources/db/product-db.resource';
import { ProductReviewDbResource } from './resources/db/product-review-db.resource';
import { ProductShapeDbResource } from './resources/db/product-shape-db.resource';
import { SettingsDbResource } from './resources/db/settings-db.resource';
import { SubmodelMapperService } from './resources/db/submodel-mapper.service';
import { SurveyDbResource } from './resources/db/survey-db.resource';
import { TopRatedCigarsDbResource } from './resources/db/top-rated-cigars-db.resource';
import { TopScannedCigarsDbResource } from './resources/db/top-scanned-cigars-db.resource';
import { UserFavoritesDbResource } from './resources/db/user-favorites-db.resource';
import { UserJournalDbResource } from './resources/db/user-journal-db.resource';
import { UserProfileDbResource } from './resources/db/user-profile-db.resource';
import { UserWishListDbResource } from './resources/db/user-wish-list-db.resource';
import { FeedbackResource } from './resources/feedback.resource';
import { HumidorResource } from './resources/humidor.resource';
import { KnowledgeResource } from './resources/knowledge.resource';
import { ManualRecognitionResource } from './resources/manual-recognition.resource';
import { MigrationResource } from './resources/migration.resource';
import { NotificationResource } from './resources/notification.resource';
import { PlaceResource } from './resources/place.resource';
import { ProductReviewResource } from './resources/product-review.resource';
import { ProductShapeResource } from './resources/product-shape.resource';
import { ProductResource } from './resources/product.resource';
import { PushNotificationResource } from './resources/push-notification.resource';
import { SettingsResource } from './resources/settings.resource';
import { ShapeResource } from './resources/shape.resource';
import { SocialPostResource } from './resources/social-post.resource';
import { SurveyResource } from './resources/survey.resource';
import { TopRatedCigarsResource } from './resources/top-rated-cigars.resource';
import { TopScannedCigarsResource } from './resources/top-scanned-cigars.resource';
import { UserDataSummaryResource } from './resources/user-data-summary.resource';
import { UserFavoritesResource } from './resources/user-favorites.resource';
import { UserJournalResource } from './resources/user-journal.resource';
import { UserProfileResource } from './resources/user-profile.resource';
import { UserSearchResource } from './resources/user-search.resource';
import { UserWishListResource } from './resources/user-wish-list.resource';
import { AccountService } from './services/account.service';
import { ActiveUserService } from './services/active-user.service';
import { ApiService } from './services/api.service';
import { FacebookAuthService } from './services/auth/facebook-auth.service';
import { TwitterAuthService } from './services/auth/twitter-auth.service';
import { BackNavigationService } from './services/back-navigation.service';
import { CacheStorageService } from './services/cache-storage.service';
import { CameraService } from './services/camera.service';
import { CanonicalUrlService } from './services/canonical-url.service';
import { CigarListActionsService } from './services/cigar-list-actions.service';
import { CigarLogInfoService } from './services/cigar-log-info.service';
import { DeviceService } from './services/device.service';
import { EmitterService } from './services/emitter.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { ImageResizeService } from './services/image-resize.service';
import { ImageSourceService } from './services/image-source.service';
import { LayoutConfig } from './services/layout-config';
import { LayoutConfigHistory } from './services/layout-config-history';
import { LayoutController } from './services/layout.controller';
import { LocationService } from './services/location.service';
import { LogService } from './services/log.service';
import { MigrationV2Service } from './services/migration-v2.service';
import { MigrationService } from './services/migration.service';
import { MyHumidorsService } from './services/my-humidors.service';
import { NetworkService } from './services/network.service';
import { PageLevelService } from './services/page-level.service';
import { PushNotificationsService } from './services/push-notifications.service';
import { RefreshAppService } from './services/refresh-app.service';
import { RouterService } from './services/router.service';
import { RoutesStackService } from './services/routes-stack.service';
import { ScanCigarService } from './services/scan-cigar.service';
import { ShareService } from './services/share.service';
import { CigarLogSocketEventHandler } from './services/socket-event-handlers/cigar-log.socket-event-handler';
import { HumidorInfoSocketEventHandler } from './services/socket-event-handlers/humidor-info.socket-event-handler';
import { HumidorSocketEventHandler } from './services/socket-event-handlers/humidor.socket-event-handler';
import { KnowledgeSocketEventHandler } from './services/socket-event-handlers/knowledge.socket-event-handler';
import { ProductNoteSocketEventHandler } from './services/socket-event-handlers/product-note.socket-event-handler';
import { ProductReviewSocketEventHandler } from './services/socket-event-handlers/product-review.socket-event-handler';
import { ProductSocketEventHandler } from './services/socket-event-handlers/product.socket-event-handler';
import { SensorSocketEventHandler } from './services/socket-event-handlers/sensor.socket-event-handler';
import { SensorOfflineSocketEventHandler } from './services/socket-event-handlers/sensor-offline.socket-event-handler';
import { SocialCommentSocketEventHandler } from './services/socket-event-handlers/social-comment.socket-event-handler';
import { SocialPostSocketEventHandler } from './services/socket-event-handlers/social-post.socket-event-handler';
import { UserSocketEventHandler } from './services/socket-event-handlers/user.socket-event-handler';
import { SocketHandlerService } from './services/socket-handler.service';
import { StorageService } from './services/storage.service';
import { SurveyService } from './services/survey.service';
import { TitleService } from './services/title.service';
import { VersionService } from './services/version.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AccountResource,
    AccountApiResource,
    AccountDbResource,
    CanonicalUrlService,
    HumidorDbResource,
    {
      provide: 'HumidorDbResource', useExisting: HumidorDbResource
    },
    HumidorApiResource,
    HumidorResource,
    PlaceResource,
    PlaceApiResource,
    ProductApiResource,
    ProductDbResource,
    {
      provide: 'ProductDbResource', useExisting: ProductDbResource
    },
    ProductResource,
    {
      provide: 'ProductResource', useExisting: ProductResource
    },
    ProductReviewApiResource,
    ProductReviewDbResource,
    {
      provide: 'ProductReviewDbResource', useExisting: ProductReviewDbResource
    },
    ProductReviewResource,
    {
      provide: 'ProductReviewResource', useExisting: ProductReviewResource
    },
    ProductShapeDbResource,
    {
      provide: 'ProductShapeDbResource', useExisting: ProductShapeDbResource
    },
    ProductShapeResource,
    {
      provide: 'ProductShapeResource', useExisting: ProductShapeResource
    },
    ShapeResource,
    UserFavoritesApiResource,
    UserFavoritesDbResource,
    {
      provide: 'UserFavoritesDbResource', useExisting: UserFavoritesDbResource
    },
    UserFavoritesResource,
    UserJournalApiResource,
    UserJournalDbResource,
    {
      provide: 'UserJournalDbResource', useExisting: UserJournalDbResource
    },
    UserJournalResource,
    UserWishListApiResource,
    UserWishListDbResource,
    {
      provide: 'UserWishListDbResource', useExisting: UserWishListDbResource
    },
    NotificationApiResource,
    NotificationResource,
    UserWishListResource,
    SettingsDbResource,
    {
      provide: 'SettingsDbResource', useExisting: SettingsDbResource
    },
    SettingsResource,
    SettingsApiResource,
    DataSummaryApiResource,
    DataSummaryResource,
    UserDataSummaryApiResource,
    UserDataSummaryResource,
    TopRatedCigarsDbResource,
    {
      provide: 'TopRatedCigarsDbResource', useExisting: TopRatedCigarsDbResource
    },
    TopRatedCigarsApiResource,
    TopRatedCigarsResource,
    TopScannedCigarsDbResource,
    {
      provide: 'TopScannedCigarsDbResource', useExisting: TopScannedCigarsDbResource
    },
    TopScannedCigarsApiResource,
    TopScannedCigarsResource,
    KnowledgeDbResource,
    {
      provide: 'KnowledgeDbResource', useExisting: KnowledgeApiResource
    },
    KnowledgeApiResource,
    KnowledgeResource,
    UserProfileDbResource,
    {
      provide: 'KnowledgeDbResource', useExisting: UserProfileApiResource
    },
    UserProfileApiResource,
    UserProfileResource,
    UserSearchApiResource,
    UserSearchResource,
    SurveyResource,
    SurveyApiResource,
    SurveyDbResource,
    FeedbackApiResource,
    FeedbackResource,
    ManualRecognitionResource,
    ManualRecognitionApiResource,
    AccountService,
    ActiveUserService,
    ApiService,
    CameraService,
    CacheStorageService,
    CigarListActionsService,
    CigarLogInfoService,
    CommentData,
    CommentsResolver,
    DeviceService,
    ImageResizeService,
    FacebookAuthService,
    LayoutController,
    LayoutConfig,
    LayoutConfigHistory,
    LocationService,
    LogService,
    PushNotificationsService,
    RouterService,
    RoutesStackService,
    ScanCigarService,
    StorageService,
    TwitterAuthService,
    MigrationApiResource,
    MigrationResource,
    MigrationService,
    MigrationV2Service,
    MyHumidorsService,
    NetworkService,
    JournalData,
    FavoritesData,
    WishListData,
    SocialPostData,
    PushNotificationResource,
    PushNotificationApiResource,
    PostLikesResolver,
    RelatedLinesResolver,
    RefreshAppService,
    SocialPostApiResource,
    SocialPostResource,
    SocialPostsResolver,
    SocketHandlerService,
    SubmodelMapperService,
    OldUserDataResolver,
    CommentApiResource,
    CommentResource,
    TitleService,
    EmitterService,
    PageLevelService,
    VersionService,
    ImageSourceService,
    ShareService,
    BackNavigationService,
    GoogleAnalyticsService,
    SurveyService,

    ActiveUserResolver,
    CigarListItemResolver,
    ShapeResolver,
    SettingsResolver,
    PlaceResolver,
    ProductResolver,
    ProductPostResolver,
    HumidorResolver,
    HumidorMeasurementsResolver,
    MyHumidorsResolver,
    NoResultsResolver,
    UserProfileResolver,
    UserListResolver,
    UserHumidorsResolver,
    UserFollowsResolver,
    UserPostsResolver,
    UserReviewsResolver,

    CigarLogSocketEventHandler,
    KnowledgeSocketEventHandler,
    HumidorSocketEventHandler,
    HumidorInfoSocketEventHandler,
    SensorSocketEventHandler,
    SensorOfflineSocketEventHandler,
    ProductSocketEventHandler,
    ProductNoteSocketEventHandler,
    ProductReviewSocketEventHandler,
    UserSocketEventHandler,
    SocialPostSocketEventHandler,
    SocialCommentSocketEventHandler
  ],
  declarations: [
    MeterToMilesPipe,
    NlToBrPipe,
    CreateSourcePipe,
    PriceRangePipe,
    HumidorsTotalPricePipe,
    HumidorsTotalCigarsPipe,
    SortHumidorsPipe,
    LocalTimePipe,
    UserNamePipe,
    BackLinkDirective,
    IsMobileDirective,
    IsDesktopDirective,
    PageLevelDirective,
    ParallaxFxDirective,
    RunScriptsDirective
  ],
  entryComponents: [],
  exports: [
    MeterToMilesPipe,
    NlToBrPipe,
    CreateSourcePipe,
    PriceRangePipe,
    HumidorsTotalPricePipe,
    HumidorsTotalCigarsPipe,
    SortHumidorsPipe,
    LocalTimePipe,
    UserNamePipe,
    BackLinkDirective,
    IsMobileDirective,
    IsDesktopDirective,
    PageLevelDirective,
    ParallaxFxDirective,
    RunScriptsDirective
  ]
})
export class SharedModule {
}
