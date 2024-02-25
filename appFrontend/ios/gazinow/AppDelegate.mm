#import <CodePush/CodePush.h>

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "RNCConfig.h"

#import "RNSplashScreen.h"

#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"gazinow";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  bool didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  
  [RNSplashScreen show];  // this needs to be called after [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  return didFinish;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}

NSDictionary *config = [RNCConfig env];

@end
