# 그린Bot
![GitHub](https://img.shields.io/github/license/GreenScreen410/GreenBot-Discord?style=flat-square) ![GitHub package.json version](https://img.shields.io/github/package-json/v/GreenScreen410/GreenBot-Discord?style=flat-square) ![node-current](https://img.shields.io/node/v/discord.js?style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/GreenScreen410/GreenBot-Discord?style=flat-square) [![CodeFactor](https://www.codefactor.io/repository/github/greenscreen410/greenbot-discord/badge)](https://www.codefactor.io/repository/github/greenscreen410/greenbot-discord)
</br>2022.02.01 ~
## 파일 설명
* **assets** - 이미지, 음성 파일 등 자료가 들어있습니다.

* **commands** - 빗금 명령어(Slash Command)가 들어있습니다. 텍스트 형태의 명령어는 모두 삭제하였습니다.

* ~~**commands** - 텍스트 명령어가 들어있습니다. 접두사는 G이며, 잘 사용되지 않습니다.~~

* **events** - 빗금, ~~텍스트 명령어~~, 음악 명령어 탐지 파일이 들어있습니다.

* **handler** - 명령어 폴더 내에 있는 파일을 불러올때 쓰입니다.

* ~~**models** - mongodb(데이터베이스) 관련 파일이 들어있습니다.~~

* **.gitignore** - Github에 업로드 시, 무시할 파일들이 들어있습니다. 이 파일은 봇 실행에 영향을 주지 않습니다.

* ~~**Procfile** - Heroku에서 실행시킬 명령어를 담고있습니다. Heroku에서 호스팅하지 않는다면 해당 파일은 삭제하셔도 괜찮습니다.~~

* **index.js** - 봇을 실행시킬 때 쓰이는 파일입니다.

* **package-lock.json** - npm 패키지 관련 파일입니다.

* **package.json** - npm 패키지 관련 파일입니다.

## Q&A
> Q: 왜 파일을 불러올 때 path 모듈도 같이 사용하나요?

A: 그린Bot은 v1.9.0부터 TypeScript로 변경되게 되었고, 이에 따라 자바스크립트로의 컴파일 과정이 필요해졌습니다.<br>
컴파일 시에는 dist 라는 폴더가 생기게 되는데, 폴더 경로가 고장날 수 있으므로 path 모듈을 사용하였습니다.