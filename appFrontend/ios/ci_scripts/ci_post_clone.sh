#!/bin/zsh

# ci_post_clone.sh
# Xcode Cloud가 레포 클론 직후 실행하는 스크립트.
# React Native(gazinow) 앱 빌드 전에 Node / JS 의존성 / CocoaPods를 설치한다.
# 이 파일은 .xcworkspace 와 같은 위치(ios/) 옆의 ci_scripts/ 에 있어야 한다.

set -e

echo "===== [ci_post_clone] start ====="

# 모노레포: 레포 루트(frontend) 아래 appFrontend 에 RN 앱이 있다.
APP_DIR="$CI_PRIMARY_REPOSITORY_PATH/appFrontend"
echo "[ci_post_clone] APP_DIR=$APP_DIR"

# --- 1) Node 설치 (Xcode Cloud 빌드 머신에는 Homebrew가 있다) ---
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1

brew install node@20
brew link --overwrite --force node@20
export PATH="$(brew --prefix node@20)/bin:$PATH"

echo "[ci_post_clone] node=$(command -v node) ($(node -v))"
echo "[ci_post_clone] npm=$(command -v npm) ($(npm -v))"

# --- 2) Yarn(classic) 설치 ---
# 이 프로젝트는 yarn lockfile v1(classic)을 사용한다.
npm install -g yarn
echo "[ci_post_clone] yarn=$(command -v yarn) ($(yarn -v))"

# --- 3) JS 의존성 설치 ---
cd "$APP_DIR"
yarn install --frozen-lockfile

# --- 4) Xcode 빌드 단계가 node를 찾을 수 있도록 NODE_BINARY 고정 ---
# "Bundle React Native code and images" 등 빌드 페이즈는 ios/.xcode.env(.local)을 source 한다.
# ci_post_clone의 PATH는 xcodebuild로 전파되지 않으므로 여기서 절대경로를 박아준다.
echo "export NODE_BINARY=$(command -v node)" > "$APP_DIR/ios/.xcode.env.local"
echo "[ci_post_clone] wrote ios/.xcode.env.local -> NODE_BINARY=$(command -v node)"

# --- 5) CocoaPods 설치 ---
# Gemfile은 appFrontend/ 에 있고, Podfile은 appFrontend/ios/ 에 있다.
# 시스템 Ruby(/Library/Ruby) 디렉터리는 쓰기 권한이 없으므로 gem을 사용자 경로에 설치한다.
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"
export BUNDLE_GEMFILE="$APP_DIR/Gemfile"

cd "$APP_DIR"
gem install bundler --no-document
bundle install

cd "$APP_DIR/ios"
bundle exec pod install --repo-update

echo "===== [ci_post_clone] done ====="
